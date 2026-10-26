// Text utilities for title cleaning, deduplication, and formatting

export function cleanJobTitle(rawTitle) {
  if (!rawTitle) return '';
  let title = String(rawTitle).trim();

  // 1. Remove HTML tags, alt attributes, img tags
  title = title.replace(/<[^>]*>/g, ' ');
  title = title.replace(/alt=["'][^"']*["']/gi, ' ');
  title = title.replace(/&quot;|&amp;|&lt;|&gt;|&#\d+;/g, ' ');

  // 2. Fix concatenated words like "PostsRRC", "PostsRBI" (case sensitive: uppercase letter right after word)
  title = title.replace(/\b(Posts?|Apprentice|Trainee|Officer|Clerk|Engineer|Manager|Doctor|Scientist)([A-Z])/g, '$1 - $2');

  // 3. If title was formed by concatenating desktop + mobile spans (e.g. "X Posts - X Recruitment 2026"):
  if (/\bPosts?\s*-\s*[A-Z]/.test(title)) {
    const match = title.match(/^(.*?)\b(Posts?)\s*-\s*[A-Z].*$/);
    if (match && match[1].trim().length >= 12) {
      title = `${match[1].trim()} ${match[2]}`;
    }
  }

  // 4. Clean up any duplicate suffixes
  title = title.replace(/(Vacancy\s*202[5-7]\s*)+/gi, 'Vacancy 2026 ');
  title = title.replace(/(Recruitment\s*202[5-7]\s*)+/gi, 'Recruitment 2026 ');
  title = title.replace(/Vacancy\s*2026\s*Recruitment\s*2026/gi, 'Recruitment 2026');
  title = title.replace(/Recruitment\s*2026\s*Recruitment\s*2026/gi, 'Recruitment 2026');
  title = title.replace(/(\bPosts\b\s*)+/gi, 'Posts ');
  title = title.replace(/\s+/g, ' ').trim();

  // 5. Fix double hyphens or trailing dashes
  title = title.replace(/\s*[-–—]\s*[-–—]\s*/g, ' - ');
  title = title.replace(/\s*[-–—]\s*$/g, '');

  return title;
}

export function formatSafeQualification(qual, jobTitle = '', qualType = '') {
  if (!qual || /\b\d+\s*posts?\b/i.test(qual) || qual === 'Not Mentioned') {
    const t = `${jobTitle} ${qualType}`.toLowerCase();
    if (/apprentice|iti/i.test(t)) return '10th Pass with ITI in relevant trade (NCVT / SCVT)';
    if (/10th|matric|peon|group d|safai/i.test(t)) return '10th Pass (Matriculation)';
    if (/12th|inter|intermediate|10\+2|constable/i.test(t)) return '12th Pass (Intermediate / 10+2)';
    if (/diploma|polytechnic/i.test(t)) return 'Polytechnic Diploma in relevant Branch';
    if (/b\.tech|engineering/i.test(t)) return 'B.Tech / B.E Degree in relevant Engineering Branch';
    if (/pharmacist|pharmacy/i.test(t)) return 'Diploma / Degree in Pharmacy (D.Pharm / B.Pharm)';
    return '10th / 12th / ITI / Graduate (As per Official Notification)';
  }
  return qual;
}
