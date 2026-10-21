// src/utils/deduplicate.js
// Intelligent Multi-Source Vacancy and News Deduplication Engine

/**
 * Clean and merge source strings into a unique, compact badge
 * Example: 'FreeJobAlert / Sarkari Result .cm / FreeJobAlert' -> 'FreeJobAlert / Sarkari Result .cm'
 */
export function cleanMergeSources(sourceA, sourceB) {
  const set = new Set();
  const extract = (s) => {
    if (!s) return;
    // Split by / or + or commas
    s.split(/[/+,|]/).forEach((p) => {
      const clean = p.replace(/[^\w\s.-]/g, '').trim();
      if (clean && clean.length >= 3 && !clean.toLowerCase().includes('portal') && !clean.includes('...')) {
        set.add(clean);
      }
    });
  };
  extract(sourceA);
  extract(sourceB);
  const unique = Array.from(set);
  if (unique.length === 0) return 'Official Portal';
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return `${unique[0]} / ${unique[1]}`;
  return `${unique[0]} (+${unique.length - 1} portals)`;
}

/**
 * Clean & normalize a vacancy title to extract core signature tokens
 */
export function extractJobTokens(title, dept = '') {
  // Normalize numbers with commas: e.g. 1,130 -> 1130
  const normalized = `${title || ''} ${dept || ''}`.toLowerCase().replace(/,/g, '');
  
  // Extract explicit post count number if present (e.g. 18799, 4187, 5512, 354, 73, 22)
  const numbers = normalized.match(/\b\d{2,6}\b/g) || [];
  // Filter out year numbers (2024, 2025, 2026, 2027)
  const postNumbers = numbers.filter((n) => !['2024', '2025', '2026', '2027'].includes(n));
  const primaryPostCount = postNumbers.length > 0 ? postNumbers[0] : null;

  // Clean stop words and boilerplate phrases
  const cleaned = normalized
    .replace(/https?:\/\/[^\s]+/g, ' ')
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .replace(/\b(india|all|govt|government|state|department|central|cell|board|commission|recruitment|bharti|online|offline|form|apply|notification|notice|posts|post|vacancy|vacancies|job|jobs|advt|advertisement|पदों|पद|भर्ती|आवेदन|जारी|सूचना|2024|2025|2026|2027|direct|civil|trade|eligibility|details|date|dates|last)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Exclude standalone digits from word tokens
  const tokens = cleaned.split(' ').filter((w) => w.length > 2 && !/^\d+$/.test(w));
  const uniqueTokens = Array.from(new Set(tokens)).sort();

  return {
    rawTitle: (title || '').toLowerCase().trim(),
    tokens: uniqueTokens,
    postCount: primaryPostCount
  };
}

/**
 * Checks whether two jobs from potentially different portals represent the exact same vacancy
 */
export function areJobsDuplicate(jobA, jobB) {
  if (!jobA || !jobB) return false;

  // 1. Exact raw title match
  const titleA = (jobA.title || '').toLowerCase().trim();
  const titleB = (jobB.title || '').toLowerCase().trim();
  if (titleA && titleB && titleA === titleB) return true;

  // 2. Direct same PDF or Apply link match
  if (jobA.pdfUrl && jobB.pdfUrl && jobA.pdfUrl === jobB.pdfUrl && jobA.pdfUrl.length > 15) return true;
  if (
    jobA.applyUrl &&
    jobB.applyUrl &&
    jobA.applyUrl === jobB.applyUrl &&
    jobA.applyUrl.length > 15 &&
    !jobA.applyUrl.includes('google.com')
  ) {
    return true;
  }

  // 3. Normalized Token & Post Count Matching
  const sigA = extractJobTokens(jobA.title, jobA.dept);
  const sigB = extractJobTokens(jobB.title, jobB.dept);

  // If both have the same specific post count (e.g. 18799 or 354 or 5512 or 2160 or 73)
  // MUST share at least 2 key tokens AND have at least 40% token overlap
  if (sigA.postCount && sigB.postCount && sigA.postCount === sigB.postCount) {
    const shared = sigA.tokens.filter((t) => sigB.tokens.includes(t));
    const overlapRatio = (2 * shared.length) / (sigA.tokens.length + sigB.tokens.length);
    if (shared.length >= 2 && overlapRatio >= 0.4) {
      return true;
    }
  }

  // If token overlap is high (>= 65% shared words like 'ssc cgl' or 'rrb alp' or 'rvunl lineman')
  if (sigA.tokens.length >= 2 && sigB.tokens.length >= 2) {
    const shared = sigA.tokens.filter((t) => sigB.tokens.includes(t));
    const overlapRatio = (2 * shared.length) / (sigA.tokens.length + sigB.tokens.length);
    if (shared.length >= 2 && overlapRatio >= 0.65) {
      return true;
    }
  }

  return false;
}

/**
 * Merge two duplicate job listings into one superior, enriched card
 */
export function mergeJobListing(target, incoming) {
  // If target has generic dept but incoming has specific dept, use incoming
  const dept = (target.dept && !target.dept.includes('Recruitment Cell') && !target.dept.includes('Government'))
    ? target.dept
    : (incoming.dept || target.dept);

  // If target has specific posts and incoming has generic, keep target
  const posts = (target.posts && target.posts !== 'Active Vacancies')
    ? target.posts
    : (incoming.posts || target.posts);

  // Keep most informative title
  const title = (target.title && target.title.length > (incoming.title || '').length)
    ? target.title
    : (incoming.title || target.title);

  return {
    ...target,
    ...incoming,
    title,
    dept,
    posts,
    // Keep direct PDF URL if either has it
    pdfUrl: (target.pdfUrl && target.pdfUrl.includes('.pdf')) ? target.pdfUrl : (incoming.pdfUrl || target.pdfUrl),
    // Keep direct apply URL
    applyUrl: (incoming.applyUrl && incoming.applyUrl.startsWith('http') && !incoming.applyUrl.includes('google.com'))
      ? incoming.applyUrl
      : (target.applyUrl || incoming.applyUrl),
    // Clean deduplicated source badge
    source: cleanMergeSources(target.source, incoming.source),
    // Highest verified view count
    viewsCount: Math.max(target.viewsCount || 0, incoming.viewsCount || 0)
  };
}

/**
 * Deduplicate an array of jobs against each other and against an existing base list
 */
export function deduplicateJobs(jobsList) {
  const result = [];
  for (const job of jobsList) {
    const existingIndex = result.findIndex((existing) => areJobsDuplicate(existing, job));
    if (existingIndex >= 0) {
      // Merge with existing card
      result[existingIndex] = mergeJobListing(result[existingIndex], job);
    } else {
      result.push({
        ...job,
        source: cleanMergeSources(job.source, '')
      });
    }
  }
  return result;
}

/**
 * Deduplicate news articles
 */
export function deduplicateNews(newsList) {
  const result = [];
  for (const news of newsList) {
    const cleanTitle = (news.title || '')
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s\u0900-\u097F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const exists = result.some((existing) => {
      const existingClean = (existing.title || '')
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^\w\s\u0900-\u097F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanTitle === existingClean) return true;
      if (news.url && existing.url && news.url === existing.url) return true;

      const wordsA = cleanTitle.split(' ').filter((w) => w.length > 3);
      const wordsB = existingClean.split(' ').filter((w) => w.length > 3);
      if (wordsA.length >= 4 && wordsB.length >= 4) {
        const shared = wordsA.filter((w) => wordsB.includes(w));
        if (shared.length / Math.min(wordsA.length, wordsB.length) >= 0.75) {
          return true;
        }
      }
      return false;
    });

    if (!exists) {
      result.push(news);
    }
  }
  return result;
}
