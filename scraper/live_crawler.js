import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { deduplicateJobs, deduplicateNews } from './deduplicate.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
import { isJobExpired, isValidRecruitmentJob } from './dateExpiry.js';

async function fetchHtml(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'hi,en-US;q=0.9,en;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.warn(`[Warning] Could not fetch ${url}: ${err.message}`);
    return null;
  }
}

// Clean title string: trims paragraphs, removes HTML/img tags, removes suffixes
function cleanTitle(raw) {
  if (!raw) return '';
  let cleaned = raw;
  // Remove any unclosed or complete <img ... alt="..." tags
  cleaned = cleaned.replace(/^<img[^>]*alt=["']?/i, '');
  cleaned = cleaned.replace(/<img[^>]*alt=["']?/gi, ' ');
  cleaned = cleaned.replace(/^alt=["']?/i, '');
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');
  cleaned = cleaned.replace(/<[^>]*$/g, '');
  cleaned = cleaned.replace(/^<[^>]*/g, '');
  cleaned = cleaned.replace(/&quot;|&amp;|&lt;|&gt;|&#\d+;/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Strip news publisher suffix if present (e.g. - Dainik Bhaskar)
  cleaned = cleaned.replace(/\s*[-–]\s*(Dainik Bhaskar|Amar Ujala|Navbharat Times|Hindustan|Live Hindustan|Jagran Josh|Times of India|ABP News|Sarkari Result).*$/i, '');
  // Strip leading and trailing quotes
  cleaned = cleaned.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

  if (cleaned.includes('।')) {
    const parts = cleaned.split('।');
    if (parts[0].length >= 15) {
      cleaned = parts[0] + '।';
    }
  } else if (cleaned.length > 95) {
    cleaned = cleaned.substring(0, 90) + '...';
  }
  return cleaned.trim();
}

function detectQualification(text) {
  if (/iti/i.test(text)) return { type: 'ITI', qual: 'ITI Pass (NCVT/SCVT)' };
  if (/10th|10वीं|मैट्रिक/i.test(text)) return { type: '10th', qual: '10th Pass (Matriculation)' };
  if (/12th|12वीं|इंटर|कॉन्स्टेबल|constable/i.test(text)) return { type: '12th', qual: '12th Pass (Intermediate)' };
  if (/डिप्लोमा|diploma|polytechnic/i.test(text)) return { type: 'Diploma', qual: 'Polytechnic Diploma' };
  return { type: 'Graduate', qual: 'Graduation / Any Degree' };
}

export function enrichJobDetails(title, qualType) {
  const t = (title || '').toLowerCase();

  // 1. Extract post count from title (matches numbers with commas or standalone numbers, excluding year 2024-2027)
  let posts = "Active Vacancies";
  const postMatch = title.match(/(\d{1,3}(?:,\d{3})+|\b(?!2024|2025|2026|2027)\d{2,6}\b)(?!\s*-\s*\d)/);
  if (postMatch) {
    posts = `${postMatch[1]} Posts`;
  }

  // 2. Department identification
  let dept = "Government Recruitment Cell";
  let videoId = null;
  let videoUrl = null;
  let videoTitle = null;

  if (/oil india|oil recruitment/i.test(t)) {
    dept = "Oil India Limited (Govt PSU)";
    videoId = "yLXb10KOm6c";
    videoUrl = "https://youtu.be/yLXb10KOm6c";
    videoTitle = "Oil India नई भर्ती 2026🚨Executive Vacancy | Full Details";
  } else if (/itbp|indo[\s-]?tibetan/i.test(t)) {
    dept = "Indo-Tibetan Border Police (ITBP, MHA)";
  } else if (/\bbsf\b|border security/i.test(t)) {
    dept = "Border Security Force (BSF, MHA)";
  } else if (/\bcrpf\b|central reserve police/i.test(t)) {
    dept = "Central Reserve Police Force (CRPF, MHA)";
  } else if (/\bcisf\b|central industrial security/i.test(t)) {
    dept = "Central Industrial Security Force (CISF, MHA)";
  } else if (/\bssb\b|sashastra seema/i.test(t)) {
    dept = "Sashastra Seema Bal (SSB, MHA)";
  } else if (/assam rifles/i.test(t)) {
    dept = "Assam Rifles (Paramilitary)";
  } else if (/\brpf\b|railway protection force/i.test(t)) {
    dept = "Railway Protection Force (RPF)";
  } else if (/delhi police/i.test(t)) {
    dept = "Delhi Police";
  } else if (/coast guard|icg/i.test(t)) {
    dept = "Indian Coast Guard";
  } else if (/indian army|\barmy\b/i.test(t)) {
    dept = "Indian Army (Defence Forces)";
  } else if (/indian navy|\bnavy\b/i.test(t)) {
    dept = "Indian Navy (Defence Forces)";
  } else if (/air force|iaf|airforce/i.test(t)) {
    dept = "Indian Air Force (IAF)";
  } else if (/\blic\b|life insurance/i.test(t)) {
    dept = "Life Insurance Corporation of India (LIC)";
  } else if (/\bntpc\b/i.test(t)) {
    dept = "NTPC Limited (Govt PSU)";
  } else if (/\bbhel\b/i.test(t)) {
    dept = "Bharat Heavy Electricals Limited (BHEL)";
  } else if (/\bongc\b/i.test(t)) {
    dept = "Oil and Natural Gas Corporation (ONGC)";
  } else if (/coal india|\bcil\b/i.test(t)) {
    dept = "Coal India Limited (Govt PSU)";
  } else if (/\bdrdo\b/i.test(t)) {
    dept = "Defence Research & Development Organisation (DRDO)";
  } else if (/\bisro\b/i.test(t)) {
    dept = "Indian Space Research Organisation (ISRO)";
  } else if (/\bdmrc\b|delhi metro/i.test(t)) {
    dept = "Delhi Metro Rail Corporation (DMRC)";
  } else if (/\bnmdc\b/i.test(t)) {
    dept = "National Mineral Development Corp (NMDC)";
  } else if (/\bncl\b/i.test(t)) {
    dept = "Northern Coalfields Limited (NCL)";
  } else if (/\bnhai\b/i.test(t)) {
    dept = "National Highways Authority of India (NHAI)";
  } else if (/\bcwc\b|warehousing/i.test(t)) {
    dept = "Central Warehousing Corporation (CWC)";
  } else if (/\birel\b/i.test(t)) {
    dept = "IREL (India) Limited (Govt PSU)";
  } else if (/railway|rrb|rrc|group d/i.test(t)) {
    dept = "Ministry of Railways (RRB / RRC)";
  } else if (/\bssc\b|\bcgl\b|\bchsl\b|\bmts\b|havaldar|\bgd\b/i.test(t)) {
    dept = "Staff Selection Commission (SSC)";
  } else if (/\bupsc\b|\bnda\b|\bcds\b|civil service/i.test(t)) {
    dept = "Union Public Service Commission (UPSC)";
  } else if (/bank|ibps|\bsbi\b|\brbi\b|\bpnb\b|canara|uco/i.test(t)) {
    dept = "Banking Recruitment Board (IBPS / SBI)";
  } else if (/police|constable|\bsi\b|daroga|sub[\s-]?inspector|सिपाही|दरोगा/i.test(t)) {
    dept = "State Police Recruitment Board";
  } else if (/teacher|\btet\b|\bprt\b|\btgt\b|\bpgt\b|upessc/i.test(t)) {
    dept = "Education Dept / School Selection Board";
  } else if (/post office|\bgds\b|\bdak\b/i.test(t)) {
    dept = "Department of Posts (India Post)";
  } else {
    const firstWord = title.trim().split(/\s+/)[0];
    if (firstWord && firstWord.length > 2 && !/हादसा|सड़क|गोली|घायल|अस्पताल|hospital|joint|road|brother|sister|agra/i.test(firstWord)) {
      dept = `${firstWord} Board / Dept`;
    } else {
      dept = "Government Department";
    }
  }

  // 3. Realistic Salary based on type & dept
  let salary = "Level 3 - Level 7 (₹21,700 - ₹69,100) + DA";
  if (qualType === '10th' || /group d|mts|peon/i.test(t)) {
    salary = "Level 1 (₹18,000 - ₹56,900) + DA + HRA";
  } else if (qualType === 'ITI' || /technician|trade|artisan|apprentice/i.test(t)) {
    salary = "Level 2/3 (₹19,900 - ₹63,200) + Allowances";
  } else if (qualType === '12th' || /clerk|constable/i.test(t)) {
    salary = "Level 3/4 (₹21,700 - ₹81,100) + HRA";
  } else if (qualType === 'Graduate' || /officer|inspector|sub engineer/i.test(t)) {
    salary = "Level 6/7 (₹35,400 - ₹1,42,400) + Grade Pay";
  }

  // 4. Age Limit
  let ageLimit = "18 - 35 Years (Relaxation as per rules)";
  if (/police|defence|army|navy|airforce|crpf|assam rifles/i.test(t)) {
    ageLimit = "18 - 28 Years (Relaxation as per rules)";
  } else if (/apprentice/i.test(t)) {
    ageLimit = "15 - 24 Years";
  }

  // 5. Selection Process
  let selectionProcess = "CBT / Written Exam + Document Verification";
  if (/police|army|navy|crpf|constable|tradesman/i.test(t)) {
    selectionProcess = "CBT Exam + Physical Test (PET/PST) + Medical";
  } else if (/gds|merit/i.test(t)) {
    selectionProcess = "10th Merit List (Zero Written Exam)";
  } else if (/interview|faculty|specialist/i.test(t)) {
    selectionProcess = "Screening Test + Personal Interview";
  }

  // 6. Application Fee
  let fee = "₹100 (Gen/OBC), Nil (SC/ST/Women)";
  if (/railway|rrb/i.test(t)) {
    fee = "₹500 (₹400 Refundable after CBT)";
  } else if (/bank|ibps|sbi/i.test(t)) {
    fee = "₹850 (Gen/OBC), ₹175 (SC/ST)";
  }

  return { posts, dept, salary, ageLimit, selectionProcess, fee, videoId, videoUrl, videoTitle };
}

function parseFjaDate(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const year = match[3];
    return `${year}-${month}-${day}`;
  }
  return '';
}

function detectFjaState(org, postName) {
  const text = `${org} ${postName}`.toLowerCase();
  if (/mumbai|maharashtra|maha/i.test(text)) return 'Maharashtra';
  if (/delhi|dmrc/i.test(text)) return 'Delhi';
  if (/uttar pradesh|\bup\b|lucknow|kanpur/i.test(text)) return 'Uttar Pradesh';
  if (/bihar|patna/i.test(text)) return 'Bihar';
  if (/rajasthan|jaipur/i.test(text)) return 'Rajasthan';
  if (/haryana/i.test(text)) return 'Haryana';
  if (/punjab/i.test(text)) return 'Punjab';
  if (/gujarat|mehsana/i.test(text)) return 'Gujarat';
  if (/madhya pradesh|\bmp\b|bhopal/i.test(text)) return 'Madhya Pradesh';
  if (/chhattisgarh|\bcg\b|raipur/i.test(text)) return 'Chhattisgarh';
  if (/jharkhand|ranchi/i.test(text)) return 'Jharkhand';
  if (/uttarakhand|dehradun/i.test(text)) return 'Uttarakhand';
  if (/himachal|hp\b|shimla/i.test(text)) return 'Himachal Pradesh';
  if (/assam/i.test(text)) return 'Assam';
  if (/west bengal|kolkata/i.test(text)) return 'West Bengal';
  if (/odisha|bhubaneswar/i.test(text)) return 'Odisha';
  if (/karnataka|bengaluru|bangalore/i.test(text)) return 'Karnataka';
  if (/tamil nadu|chennai/i.test(text)) return 'Tamil Nadu';
  if (/kerala/i.test(text)) return 'Kerala';
  if (/andhra|ap\b|telangana|hyderabad/i.test(text)) return 'Andhra Pradesh';
  return 'All India';
}

function detectFjaQual(qualText, postText) {
  const text = `${qualText} ${postText}`.toLowerCase();
  if (/iti/i.test(text)) return { type: 'ITI', qual: qualText || 'ITI Pass (NCVT/SCVT)' };
  if (/diploma|polytechnic|d\.pharm/i.test(text)) return { type: 'Diploma', qual: qualText || 'Polytechnic Diploma' };
  if (/10th|10वीं|matric/i.test(text)) return { type: '10th', qual: qualText || '10th Pass (Matric)' };
  if (/12th|12वीं|inter|intermediate|10\+2/i.test(text)) return { type: '12th', qual: qualText || '12th Pass (10+2)' };
  if (/b\.tech|b\.e|mca|bca|engineering/i.test(text)) return { type: 'B.Tech', qual: qualText || 'B.Tech / B.E / Engineering' };
  if (/graduate|degree|b\.a|b\.sc|b\.com|mba|pgdm/i.test(text)) return { type: 'Graduate', qual: qualText || 'Any Graduate' };
  return { type: 'Graduate', qual: qualText || 'Any Degree' };
}

function getOfficialPortalUrl(dept, title, articleLink) {
  const d = (dept || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (/railway|rrb/i.test(d) || /railway|rrb/i.test(t)) return "https://www.rrbapply.gov.in/";
  if (/ssc|staff selection/i.test(d) || /\bssc\b/i.test(t)) return "https://ssc.gov.in/";
  if (/upsc/i.test(d) || /upsc/i.test(t)) return "https://upsc.gov.in/";
  if (/supreme court/i.test(d) || /supreme court/i.test(t)) return "https://main.sci.gov.in/recruitment";
  if (/cisf/i.test(d) || /cisf/i.test(t)) return "https://cisfrectt.cisf.gov.in/";
  if (/crpf/i.test(d) || /crpf/i.test(t)) return "https://rect.crpf.gov.in/";
  if (/bsf/i.test(d) || /bsf/i.test(t)) return "https://rectt.bsf.gov.in/";
  if (/itbp/i.test(d) || /itbp/i.test(t)) return "https://recruitment.itbpolice.nic.in/";
  if (/ssb/i.test(d) || /ssb/i.test(t)) return "https://ssbrectt.gov.in/";
  if (/assam rifles/i.test(d) || /assam rifles/i.test(t)) return "https://www.assamrifles.gov.in/";
  if (/rpf/i.test(d) || /rpf/i.test(t)) return "https://rpf.indianrailways.gov.in/";
  if (/army/i.test(d) || /army/i.test(t)) return "https://joinindianarmy.nic.in/";
  if (/navy/i.test(d) || /navy/i.test(t)) return "https://www.joinindiannavy.gov.in/";
  if (/air force|iaf/i.test(d) || /air force|iaf/i.test(t)) return "https://agnipathvayu.cdac.in/";
  if (/coast guard|icg/i.test(d) || /coast guard|icg/i.test(t)) return "https://joinindiancoastguard.cdac.in/";
  if (/delhi police/i.test(d) || /delhi police/i.test(t)) return "https://delhipolice.gov.in/";
  if (/up police|upprpb/i.test(d) || /up police/i.test(t)) return "https://uppbpb.gov.in/";
  if (/bihar police|csbc/i.test(d) || /bihar police/i.test(t)) return "https://csbc.bih.nic.in/";
  if (/rajasthan police/i.test(d) || /rajasthan police/i.test(t)) return "https://police.rajasthan.gov.in/";
  if (/mp police|mpesb/i.test(d) || /mp police/i.test(t)) return "https://esb.mp.gov.in/";
  if (/haryana police|hssc/i.test(d) || /haryana police/i.test(t)) return "https://hssc.gov.in/";
  if (/lic\b|life insurance/i.test(d) || /\blic\b|life insurance/i.test(t)) return "https://licindia.in/careers";
  if (/ntpc/i.test(d) || /ntpc/i.test(t)) return "https://careers.ntpc.co.in/";
  if (/coal india/i.test(d) || /coal india/i.test(t)) return "https://www.coalindia.in/";
  if (/dmrc|delhi metro/i.test(d) || /dmrc|delhi metro/i.test(t)) return "https://www.delhimetrorail.com/corporate/careers";
  if (/nmdc/i.test(d) || /nmdc/i.test(t)) return "https://www.nmdc.co.in/careers";
  if (/ncl/i.test(d) || /ncl/i.test(t)) return "https://nclcil.in/";
  if (/nhai/i.test(d) || /nhai/i.test(t)) return "https://nhai.gov.in/";
  if (/rites/i.test(d) || /rites/i.test(t)) return "https://www.rites.com/Career";
  if (/post office|india post|gds/i.test(d) || /post office|india post|gds/i.test(t)) return "https://indiapostgdsonline.gov.in/";
  if (/ibps/i.test(d) || /ibps/i.test(t)) return "https://www.ibps.in/";
  if (/sbi/i.test(d) || /sbi/i.test(t)) return "https://sbi.co.in/web/careers";
  if (/cwc/i.test(d) || /warehousing/i.test(t)) return "https://cewacor.nic.in/";
  if (/irel/i.test(d) || /irel/i.test(t)) return "https://www.irel.co.in/";
  if (/nicl/i.test(d) || /nicl/i.test(t)) return "https://nationalinsurance.nic.co.in/";
  if (/bhel/i.test(d) || /bhel/i.test(t)) return "https://careers.bhel.in/";
  if (/ongc/i.test(d) || /ongc/i.test(t)) return "https://ongcindia.com/web/eng/career";
  if (/drdo/i.test(d) || /drdo/i.test(t)) return "https://www.drdo.gov.in/";
  if (/isro/i.test(d) || /isro/i.test(t)) return "https://www.isro.gov.in/Careers.html";
  if (/upsssc/i.test(d) || /upsssc/i.test(t)) return "https://upsssc.gov.in/";
  if (/rpsc/i.test(d) || /rpsc/i.test(t)) return "https://rpsc.rajasthan.gov.in/";
  if (/rsmssb/i.test(d) || /rsmssb/i.test(t)) return "https://rsmssb.rajasthan.gov.in/";
  if (/bpsc/i.test(d) || /bpsc/i.test(t)) return "https://www.bpsc.bih.nic.in/";
  return articleLink || `https://www.google.com/search?q=${encodeURIComponent(dept + ' ' + title + ' official portal recruitment')}`;
}

// 1. Scrape FreeJobAlert (Homepage 3 Boxes: Job Notifications, Admit Card, Results + Live Table & Feed)
export async function scrapeFreeJobAlert() {
  console.log("🌐 [1/12] Scraping FreeJobAlert (Homepage 3 Boxes + Live Table + Feed)...");
  const [homeHtml, latestTableHtml, feedXml] = await Promise.all([
    fetchHtml('https://www.freejobalert.com/'),
    fetchHtml('https://www.freejobalert.com/latest-notifications/'),
    fetchHtml('https://www.freejobalert.com/feed/')
  ]);
  const jobs = [];
  const news = [];
  const todayStr = new Date().toISOString().split('T')[0];

  // A. Parse Homepage 3 Main Boxes directly (.nutitle)
  if (homeHtml) {
    const $ = cheerio.load(homeHtml);
    $('.nutitle').each((_, el) => {
      const heading = $(el).text().trim();
      const container = $(el).closest('.gb-container, .wp-block-group, div[class*="gb-container"]');

      // 1. Box: Job Notifications (Latest hot postings shown in user's Photo 3)
      if (heading === 'Job Notifications') {
        container.find('a').each((i, a) => {
          const text = cleanTitle($(a).text());
          const href = $(a).attr('href');
          if (text && href && !href.includes('#') && text !== heading && text !== 'View All') {
            const q = detectFjaQual('', text);
            const state = detectFjaState('', text);
            const details = enrichJobDetails(text, q.type);
            jobs.push({
              id: `fja-box-${Date.now()}-${i}`,
              title: text,
              dept: details.dept,
              posts: details.posts,
              qualification: q.qual,
              state: state,
              category: "Govt",
              type: q.type,
              lastDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
              ageLimit: details.ageLimit,
              fee: details.fee,
              pdfUrl: href,
              applyUrl: href,
              fallbackUrl: getOfficialPortalUrl(details.dept, text, href),
              source: "FreeJobAlert",
              isNew: true,
              isClosingSoon: false,
              status: "ACTIVE",
              viewsCount: Math.floor(35000 + Math.random() * 25000),
              salary: details.salary,
              selectionProcess: details.selectionProcess,
              videoId: details.videoId,
              videoUrl: details.videoUrl,
              videoTitle: details.videoTitle
            });
          }
        });
      }

      // 2. Box: Admit Card (Instant real-time hall tickets)
      else if (heading === 'Admit Card') {
        container.find('a').each((i, a) => {
          const text = cleanTitle($(a).text());
          const href = $(a).attr('href');
          if (text && href && !href.includes('#') && text !== heading && text !== 'View All') {
            news.push({
              id: `fja-admit-${Date.now()}-${i}`,
              title: text,
              url: href,
              source: "FreeJobAlert",
              tag: "Admit Card",
              timeAgo: "Today Out",
              isAdmit: true
            });
          }
        });
      }

      // 3. Box: Results (Declared merit lists & results)
      else if (heading === 'Results') {
        container.find('a').each((i, a) => {
          const text = cleanTitle($(a).text());
          const href = $(a).attr('href');
          if (text && href && !href.includes('#') && text !== heading && text !== 'View All') {
            news.push({
              id: `fja-result-${Date.now()}-${i}`,
              title: text,
              url: href,
              source: "FreeJobAlert",
              tag: "Result",
              timeAgo: "Declared Today",
              isResult: true
            });
          }
        });
      }
    });
  }

  // B. Parse structured Live Table from https://www.freejobalert.com/latest-notifications/
  if (latestTableHtml) {
    const $ = cheerio.load(latestTableHtml);
    $('table tr').each((i, tr) => {
      if (jobs.length >= 70) return;
      const tds = $(tr).find('td');
      if (tds.length >= 6) {
        const postDate = $(tds[0]).text().trim();
        const org = $(tds[1]).text().trim();
        const postName = $(tds[2]).text().trim().replace(/\s+/g, ' ');
        const qual = $(tds[3]).text().trim().replace(/\s+/g, ' ');
        const lastDateRaw = $(tds[5]).text().trim();
        const link = $(tr).find('a[href*="/articles/"]').attr('href') || $(tr).find('a').attr('href');

        if (org && postName && link && !postName.toLowerCase().includes('post name')) {
          const lastDate = parseFjaDate(lastDateRaw);
          if (!lastDate || lastDate >= todayStr) {
            const q = detectFjaQual(qual, postName);
            const state = detectFjaState(org, postName);
            const title = `${org} ${postName} Recruitment 2026`;
            if (!jobs.some(j => j.title.toLowerCase() === title.toLowerCase())) {
              const details = enrichJobDetails(title, q.type);
              const postCount = postName.includes('Posts') ? (postName.split('–')[1]?.trim() || details.posts) : details.posts;
              jobs.push({
                id: `fja-live-${Date.now()}-${i}`,
                title: title,
                dept: org,
                posts: postCount,
                qualification: q.qual,
                state: state,
                category: "Govt",
                type: q.type,
                lastDate: lastDate || '2026-11-20',
                ageLimit: details.ageLimit,
                fee: details.fee,
                pdfUrl: link,
                applyUrl: link,
                fallbackUrl: getOfficialPortalUrl(details.dept, title, link),
                source: "FreeJobAlert",
                isNew: true,
                isClosingSoon: false,
                status: "ACTIVE",
                viewsCount: Math.floor(25000 + Math.random() * 30000),
                salary: details.salary,
                selectionProcess: details.selectionProcess,
                videoId: details.videoId,
                videoUrl: details.videoUrl,
                videoTitle: details.videoTitle
              });
            }
          }
        }
      }
    });
  }

  // C. Parse instant RSS feed items (real-time live articles)
  if (feedXml) {
    const $feed = cheerio.load(feedXml, { xmlMode: true });
    $feed('item').each((i, el) => {
      if (jobs.length >= 90) return;
      const title = cleanTitle($feed(el).find('title').text());
      const link = $feed(el).find('link').text() || $feed(el).find('guid').text();
      if (title && title.length > 12 && !jobs.some(j => j.title.toLowerCase() === title.toLowerCase())) {
        const q = detectQualification(title);
        const details = enrichJobDetails(title, q.type);
        jobs.push({
          id: `fja-feed-${Date.now()}-${i}`,
          title: title,
          dept: details.dept,
          posts: details.posts,
          qualification: q.qual,
          state: "All India",
          category: "Govt",
          type: q.type,
          lastDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
          ageLimit: details.ageLimit,
          fee: details.fee,
          pdfUrl: link,
          applyUrl: link,
          fallbackUrl: getOfficialPortalUrl(details.dept, title, link),
          source: "FreeJobAlert",
          isNew: true,
          isClosingSoon: false,
          isComingSoon: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(title),
          status: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(title) ? 'COMING_SOON' : 'ACTIVE',
          viewsCount: Math.floor(19000 + Math.random() * 26000),
          salary: details.salary,
          selectionProcess: details.selectionProcess
        });
      }
    });
  }

  return { jobs, news };
}

// 2. Scrape Jagran Josh Govt Jobs
export async function scrapeJagranJosh() {
  console.log("🌐 [2/8] Scraping Jagran Josh...");
  const html = await fetchHtml('https://www.jagranjosh.com/government-jobs');
  const news = [];
  const jobs = [];
  if (!html) return { news, jobs };

  const $ = cheerio.load(html);
  $('a[href*="/articles/"]').each((i, el) => {
    if (news.length >= 30) return;
    // Skip image thumbnail anchor wrappers
    if ($(el).find('img').length > 0 && $(el).text().trim().length < 8) return;
    const headline = cleanTitle($(el).text());
    let href = $(el).attr('href') || '';
    if (headline && headline.length > 18 && !headline.includes('और पढ़ें') && !headline.startsWith('<') && !news.some(n => n.title.toLowerCase() === headline.toLowerCase())) {
      if (href.startsWith('/')) href = 'https://www.jagranjosh.com' + href;
      
      news.push({
        id: `jj-${Date.now()}-${i}`,
        title: headline,
        source: "Jagran Josh",
        url: href,
        timeAgo: "Live Update",
        tag: "Jagran Alert"
      });
    }
  });

  return { news, jobs: [] };
}

// 3. Scrape Navbharat Times Jobs
export async function scrapeNavbharatTimes() {
  console.log("🌐 [3/8] Scraping Navbharat Times (NBT)...");
  const html = await fetchHtml('https://navbharattimes.indiatimes.com/education/jobs-junction/articlelist/47479886.cms');
  const news = [];
  const jobs = [];
  if (!html) return { news, jobs };

  const $ = cheerio.load(html);
  $('a[href*="/education/jobs-junction/"]').each((i, el) => {
    if (news.length >= 30) return;
    let title = cleanTitle($(el).text());
    let href = $(el).attr('href') || '';
    if (title && title.length > 20 && !title.includes('और पढ़ें') && !news.some(n => n.title === title)) {
      if (href.startsWith('/')) href = 'https://navbharattimes.indiatimes.com' + href;
      news.push({
        id: `nbt-${Date.now()}-${i}`,
        title: title,
        source: "Navbharat Times",
        url: href,
        timeAgo: "NBT Live",
        tag: "NBT News"
      });
    }
  });
  return { news, jobs: [] };
}

// 4. Scrape Live Hindustan Career
export async function scrapeLiveHindustan() {
  console.log("🌐 [4/8] Scraping Live Hindustan...");
  const html = await fetchHtml('https://www.livehindustan.com/career/jobs/news');
  const news = [];
  const jobs = [];
  if (!html) return { news, jobs };

  const $ = cheerio.load(html);
  $('a[href*="/career/"]').each((i, el) => {
    if (news.length >= 30) return;
    const headlineEl = $(el).find('h2, h3, .title').first();
    const rawText = headlineEl.length > 0 ? headlineEl.text() : $(el).text();
    let title = cleanTitle(rawText);
    let href = $(el).attr('href') || '';

    if (title && title.length > 20 && !title.includes('और पढ़ें') && !news.some(n => n.title === title)) {
      if (href.startsWith('/')) href = 'https://www.livehindustan.com' + href;
      news.push({
        id: `lh-${Date.now()}-${i}`,
        title: title,
        source: "Live Hindustan",
        url: href,
        timeAgo: "Hindustan Alert",
        tag: "Career News"
      });
    }
  });
  return { news, jobs: [] };
}

// 5. Scrape Dainik Bhaskar Career RSS
export async function scrapeDainikBhaskar() {
  console.log("🌐 [5/8] Scraping Dainik Bhaskar PR...");
  const xml = await fetchHtml('https://news.google.com/rss/search?q=site:bhaskar.com+नौकरी+OR+भर्ती+OR+vacancy&hl=hi&gl=IN&ceid=IN:hi');
  const news = [];
  const jobs = [];
  if (!xml) return { news, jobs };

  const $ = cheerio.load(xml, { xmlMode: true });
  $('item').each((i, el) => {
    if (news.length >= 30) return;
    const title = cleanTitle($(el).find('title').text());
    const link = $(el).find('link').text();
    if (title && link && !news.some(n => n.title === title)) {
      news.push({
        id: `db-${Date.now()}-${i}`,
        title: title,
        source: "Dainik Bhaskar",
        url: link,
        timeAgo: "Bhaskar Alert",
        tag: "Dainik Bhaskar"
      });
    }
  });
  return { news, jobs: [] };
}

// 6. Scrape Amar Ujala Jobs
export async function scrapeAmarUjala() {
  console.log("🌐 [6/8] Scraping Amar Ujala PR...");
  const xml = await fetchHtml('https://news.google.com/rss/search?q=site:amarujala.com+नौकरी+OR+भर्ती+OR+vacancy&hl=hi&gl=IN&ceid=IN:hi');
  const news = [];
  const jobs = [];
  if (!xml) return { news, jobs };

  const $ = cheerio.load(xml, { xmlMode: true });
  $('item').each((i, el) => {
    if (news.length >= 30) return;
    const title = cleanTitle($(el).find('title').text());
    const link = $(el).find('link').text();
    if (title && link && !news.some(n => n.title === title)) {
      news.push({
        id: `au-${Date.now()}-${i}`,
        title: title,
        source: "Amar Ujala",
        url: link,
        timeAgo: "Amar Ujala Live",
        tag: "Amar Ujala"
      });
    }
  });
  return { news, jobs: [] };
}

// 7. Scrape Times of India Jobs
export async function scrapeTimesOfIndia() {
  console.log("🌐 [7/8] Scraping Times of India / Education Times...");
  const xml = await fetchHtml('https://news.google.com/rss/search?q=site:timesofindia.indiatimes.com+recruitment+OR+vacancy+jobs&hl=en-IN&gl=IN&ceid=IN:en');
  const news = [];
  const jobs = [];
  if (!xml) return { news, jobs };

  const $ = cheerio.load(xml, { xmlMode: true });
  $('item').each((i, el) => {
    if (news.length >= 30) return;
    const title = cleanTitle($(el).find('title').text());
    const link = $(el).find('link').text();
    if (title && link && !news.some(n => n.title === title)) {
      news.push({
        id: `toi-${Date.now()}-${i}`,
        title: title,
        source: "Times of India",
        url: link,
        timeAgo: "TOI Alert",
        tag: "National"
      });
    }
  });
  return { news, jobs: [] };
}

// 8. Google News General Real-Time Feed (Broad Fallback)
export async function scrapeGoogleNewsHindi() {
  console.log("🌐 [8/10] Scraping Real-time Multi-Query News Alerts...");
  const xml = await fetchHtml('https://news.google.com/rss/search?q=sarkari+naukri+bharti+vacancy&hl=hi&gl=IN&ceid=IN:hi');
  const news = [];
  if (!xml) return news;

  const $ = cheerio.load(xml, { xmlMode: true });
  $('item').each((i, el) => {
    if (news.length >= 30) return;
    const title = cleanTitle($(el).find('title').text());
    const link = $(el).find('link').text();
    const source = $(el).find('source').text() || 'Google Alert';
    if (title && link && !news.some(n => n.title === title)) {
      news.push({
        id: `gn-${Date.now()}-${i}`,
        title: title,
        source: source,
        url: link,
        timeAgo: "Breaking Alert",
        tag: "Verified PR"
      });
    }
  });
  return news;
}

// 9. Scrape SarkariResult.com Official
export async function scrapeSarkariResultCom() {
  console.log("🌐 [9/10] Scraping SarkariResult.com Official Portal...");
  const html = await fetchHtml('https://www.sarkariresult.com/');
  const news = [];
  const jobs = [];
  if (!html) return { news, jobs };

  const $ = cheerio.load(html);
  $('a').each((i, el) => {
    const text = cleanTitle($(el).text());
    const href = $(el).attr('href') || '';
    if (!text || text.length < 12 || !href.startsWith('http')) return;
    if (href.includes('youtube') || href.includes('instagram') || href.includes('twitter') || href.includes('t.me') || href.includes('itunes') || href.includes('play.google')) return;
    if (/sarkari\s*result|tools|privacy|disclaimer|contact|about|home/i.test(text)) return;

    if (/online form|recruitment|bharti|vacancy|post|apply/i.test(text)) {
      if (!jobs.some(j => j.title.toLowerCase() === text.toLowerCase()) && jobs.length < 20) {
        const q = detectQualification(text);
        const details = enrichJobDetails(text, q.type);
        jobs.push({
          id: `sr-${Date.now()}-${i}`,
          title: text,
          dept: details.dept,
          posts: details.posts,
          qualification: q.qual,
          state: "All India / State",
          category: "Govt",
          type: q.type,
          lastDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
          ageLimit: details.ageLimit,
          fee: details.fee,
          pdfUrl: href,
          applyUrl: href,
          source: "Sarkari Result",
          isNew: true,
          isClosingSoon: false,
          isComingSoon: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text),
          status: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text) ? 'COMING_SOON' : 'ACTIVE',
          isNewsArticle: false,
          viewsCount: Math.floor(25000 + Math.random() * 30000),
          salary: details.salary,
          selectionProcess: details.selectionProcess
        });
      }
    } else if (/result|admit card|answer key|cutoff|selection/i.test(text)) {
      if (!news.some(n => n.title.toLowerCase() === text.toLowerCase()) && news.length < 15) {
        news.push({
          id: `sr-news-${Date.now()}-${i}`,
          title: text,
          source: "Sarkari Result",
          url: href,
          timeAgo: "Live Sarkari Alert",
          tag: "Sarkari Result"
        });
      }
    }
  });

  return { news, jobs };
}

// 10. Scrape SarkariResult.com.cm Portal
export async function scrapeSarkariResultCm() {
  console.log("🌐 [10/10] Scraping SarkariResult.com.cm Portal...");
  const html = await fetchHtml('https://sarkariresult.com.cm/');
  const news = [];
  const jobs = [];
  if (!html) return { news, jobs };

  const $ = cheerio.load(html);
  $('a').each((i, el) => {
    const text = cleanTitle($(el).text());
    const href = $(el).attr('href') || '';
    if (!text || text.length < 12 || !href.startsWith('http')) return;
    if (href.includes('privacy') || href.includes('disclaimer') || href.includes('contact') || href.includes('about')) return;
    if (/sarkari\s*result|tools|privacy|disclaimer|contact|about|home/i.test(text)) return;

    if (/form|recruitment|bharti|vacancy|posts|karmchari|teacher/i.test(text)) {
      if (!jobs.some(j => j.title.toLowerCase() === text.toLowerCase()) && jobs.length < 20) {
        const q = detectQualification(text);
        const details = enrichJobDetails(text, q.type);
        jobs.push({
          id: `srcm-${Date.now()}-${i}`,
          title: text,
          dept: details.dept,
          posts: details.posts,
          qualification: q.qual,
          state: "All India / State",
          category: "Govt",
          type: q.type,
          lastDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
          ageLimit: details.ageLimit,
          fee: details.fee,
          pdfUrl: href,
          applyUrl: href,
          source: "Sarkari Result .cm",
          isNew: true,
          isClosingSoon: false,
          isComingSoon: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text),
          status: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text) ? 'COMING_SOON' : 'ACTIVE',
          isNewsArticle: false,
          viewsCount: Math.floor(22000 + Math.random() * 28000),
          salary: details.salary,
          selectionProcess: details.selectionProcess
        });
      }
    } else if (/result|admit card|answer key|out|declared/i.test(text)) {
      if (!news.some(n => n.title.toLowerCase() === text.toLowerCase()) && news.length < 15) {
        news.push({
          id: `srcm-news-${Date.now()}-${i}`,
          title: text,
          source: "Sarkari Result .cm",
          url: href,
          timeAgo: "Sarkari Alert",
          tag: "Sarkari Result .cm"
        });
      }
    }
  });

  return { news, jobs };
}

// 11. Scrape RojgarResult (Top North India & Central Govt Jobs)
export async function scrapeRojgarResult() {
  console.log("🌐 [11/13] Scraping RojgarResult.com...");
  const html = await fetchHtml('https://www.rojgarresult.com/');
  const news = [];
  const jobs = [];
  if (!html) return { news, jobs };

  const $ = cheerio.load(html);
  $('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = cleanTitle($(el).text());
    if (!href.includes('rojgarresult.com') || text.length < 15 || text.includes('Rojgar Result') || text.includes('Disclaimer')) return;

    if (/online form|recruitment|bharti|vacancy|posts|tre 4|pgt|chsl|assistant/i.test(text)) {
      if (!jobs.some(j => j.title.toLowerCase() === text.toLowerCase()) && jobs.length < 15) {
        const q = detectQualification(text);
        const details = enrichJobDetails(text, q.type);
        jobs.push({
          id: `rr-job-${Date.now()}-${i}`,
          title: text,
          dept: details.dept,
          posts: details.posts,
          qualification: q.qual,
          state: /up|bihar|delhi|rajasthan|haryana|mp/i.test(text) ? (text.match(/up|bihar|delhi|rajasthan|haryana|mp/i)[0].toUpperCase()) : "All India",
          category: "Govt",
          type: q.type,
          lastDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
          ageLimit: details.ageLimit,
          fee: details.fee,
          pdfUrl: href,
          applyUrl: href,
          source: "Rojgar Result",
          isNew: true,
          status: "ACTIVE",
          viewsCount: Math.floor(22000 + Math.random() * 20000),
          salary: details.salary,
          selectionProcess: details.selectionProcess,
          videoId: details.videoId,
          videoUrl: details.videoUrl,
          videoTitle: details.videoTitle
        });
      }
    } else if (/result|admit card|score card|allotment/i.test(text)) {
      if (!news.some(n => n.title.toLowerCase() === text.toLowerCase()) && news.length < 15) {
        const isAdmit = /admit card|hall ticket/i.test(text);
        const isResult = /result|allotment|score card/i.test(text);
        news.push({
          id: `rr-news-${Date.now()}-${i}`,
          title: text,
          source: "Rojgar Result",
          url: href,
          timeAgo: "Live Update",
          tag: isAdmit ? "Admit Card" : (isResult ? "Merit / Result" : "Rojgar Alert"),
          isAdmit,
          isResult
        });
      }
    }
  });

  return { news, jobs };
}

// 12. Scrape RemoteOK Live API (Private Remote Tech & Non-Tech Careers)
export async function scrapeRemoteOkJobs() {
  console.log("🌐 [12/13] Scraping RemoteOK Real-Time API (Remote Jobs)...");
  const jobs = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return jobs;
    const data = await res.json();
    if (!Array.isArray(data)) return jobs;

    const items = data.slice(1, 16); // Take latest 15 real job postings
    items.forEach((item, i) => {
      if (!item.position || !item.company) return;
      const isTech = /developer|engineer|software|python|react|frontend|backend|full stack|devops|data|designer/i.test(item.position);
      const qual = isTech ? 'B.Tech / B.E / BCA / MCA / Tech Experience' : 'Any Graduate / Good Communication & Skills';
      const qualType = isTech ? 'B.Tech' : 'Graduate';
      const salaryText = (item.salary_min && item.salary_max)
        ? `$${item.salary_min.toLocaleString()} - $${item.salary_max.toLocaleString()}/yr (₹${Math.round(item.salary_min * 0.8 / 1000)}L - ₹${Math.round(item.salary_max * 0.8 / 1000)}L/yr)`
        : 'Competitive Industry Package (₹10L - ₹35L/yr)';

      const futureDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

      jobs.push({
        id: `remoteok-${item.id || Date.now()}-${i}`,
        title: `${item.position} at ${item.company} (100% Remote)`,
        dept: `${item.company} (via RemoteOK)`,
        posts: "Multiple Openings",
        qualification: qual,
        state: "All India",
        location: "Worldwide Remote / Work from Home",
        category: "Private",
        type: qualType,
        lastDate: futureDate,
        ageLimit: "18 - 45 Years (Open to all)",
        fee: "Nil (100% Free Application)",
        pdfUrl: item.apply_url || item.url || 'https://remoteok.com/',
        applyUrl: item.apply_url || item.url || 'https://remoteok.com/',
        website: 'https://remoteok.com/',
        source: "RemoteOK",
        isNew: true,
        isClosingSoon: false,
        status: 'ACTIVE',
        isNewsArticle: false,
        viewsCount: Math.floor(35000 + Math.random() * 25000),
        salary: salaryText,
        selectionProcess: "Online Application + Portfolio / Coding Review + Remote Video Interview"
      });
    });
  } catch (err) {
    console.warn("[Warning] RemoteOK fetch failed:", err.message);
  }
  return jobs;
}

// 12. Scrape WeWorkRemotely RSS Feed (Remote & International Roles)
export async function scrapeWeWorkRemotelyJobs() {
  console.log("🌐 [12/12] Scraping WeWorkRemotely RSS Feed (Global Remote Careers)...");
  const jobs = [];
  try {
    const xml = await fetchHtml('https://weworkremotely.com/remote-jobs.rss');
    if (!xml) return jobs;
    const $ = cheerio.load(xml, { xmlMode: true });

    $('item').slice(0, 15).each((i, el) => {
      const fullTitle = $(el).find('title').text() || '';
      const link = $(el).find('link').text() || 'https://weworkremotely.com/';
      if (!fullTitle) return;

      const parts = fullTitle.split(':');
      const company = parts.length > 1 ? parts[0].trim() : 'Global Remote Corp';
      const position = parts.length > 1 ? parts.slice(1).join(':').trim() : fullTitle;

      const isTech = /developer|engineer|software|devops|full stack|frontend|backend|cloud/i.test(position);
      const qual = isTech ? 'B.Tech / B.E / BCA / MCA / Relevant Tech Skills' : 'Graduate / Communication & Professional Skills';
      const qualType = isTech ? 'B.Tech' : 'Graduate';
      const futureDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

      jobs.push({
        id: `wwr-${Date.now()}-${i}`,
        title: `${position} at ${company} (WeWorkRemotely)`,
        dept: `${company} (via WeWorkRemotely)`,
        posts: "Active Remote Opening",
        qualification: qual,
        state: "All India",
        location: "100% Remote (Work from Anywhere)",
        category: "Private",
        type: qualType,
        lastDate: futureDate,
        ageLimit: "18+ Years",
        fee: "Nil (Free Direct Application)",
        pdfUrl: link,
        applyUrl: link,
        website: 'https://weworkremotely.com/',
        source: "WeWorkRemotely",
        isNew: true,
        isClosingSoon: false,
        status: 'ACTIVE',
        isNewsArticle: false,
        viewsCount: Math.floor(40000 + Math.random() * 20000),
        salary: "Global Remote Pay ($50,000 - $110,000/yr)",
        selectionProcess: "Direct Online Application + Resume Screen + Team Interview"
      });
    });
  } catch (err) {
    console.warn("[Warning] WeWorkRemotely fetch failed:", err.message);
  }
  return jobs;
}

// 14. Scrape Official Vacancy Era Education YouTube Channel Real-Time Feed
export async function scrapeYouTubeChannel() {
  console.log("📺 [14/14] Scraping Official @vacancyeraeducation YouTube Feed...");
  try {
    const xml = await fetchHtml('https://www.youtube.com/feeds/videos.xml?channel_id=UChHRt-QM9T9Wyx1Q4zUTcVg');
    if (!xml) return [];
    const $ = cheerio.load(xml, { xmlMode: true });
    const videos = [];
    $('entry').each((_, el) => {
      const videoId = $(el).find('yt\\:videoId, videoId').text().trim();
      const title = $(el).find('title').text().trim();
      if (videoId && title) {
        videos.push({
          videoId,
          videoUrl: `https://youtu.be/${videoId}`,
          title,
          channel: '@vacancyeraeducation'
        });
      }
    });
    console.log(`📺 Successfully fetched ${videos.length} live videos from @vacancyeraeducation!`);
    return videos;
  } catch (err) {
    console.warn("⚠️ YouTube RSS fetch failed, using fallback registry:", err.message);
    return [];
  }
}

// 15. Scrape Drishti IAS Hindi Daily Current Affairs & Editorials
export async function scrapeDrishtiHindiCurrentAffairs() {
  console.log("📖 [15/17] Scraping Drishti IAS Hindi Daily Current Affairs...");
  try {
    const html = await fetchHtml('https://www.drishtiias.com/hindi/current-affairs-news-analysis-editorials');
    if (!html) return [];
    const $ = cheerio.load(html);
    const items = [];
    const todayStr = new Date().toISOString().split('T')[0];

    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      let text = $(el).text().replace(/\s+/g, ' ').trim();
      text = text.replace(/\.{3,}$/, '').trim();
      if ((href.includes('/hindi/daily-updates') || href.includes('/hindi/current-affairs') || href.includes('editorial')) && text.length >= 15 && text.length <= 150) {
        if (!text.includes('डाउनलोड') && !text.includes('टेस्ट सीरीज़') && !text.includes('क्विज़ संग्रह') && !text.includes('यहाँ क्लिक करें')) {
          const fullUrl = href.startsWith('http') ? href : `https://www.drishtiias.com${href}`;
          if (!items.some(it => it.title === text || it.url === fullUrl)) {
            items.push({
              id: `drishti-${Date.now()}-${items.length}`,
              title: text,
              source: 'Drishti IAS (Hindi)',
              category: 'Current Affairs',
              url: fullUrl,
              timeAgo: 'Daily Current Affairs & Editorial',
              date: todayStr
            });
          }
        }
      }
    });
    console.log(`📖 Successfully fetched ${items.length} items from Drishti IAS Hindi!`);
    return items;
  } catch (err) {
    console.warn("⚠️ Drishti IAS Hindi scrape issue:", err.message);
    return [];
  }
}

// 16. Scrape GKToday Current Affairs & Subject Analysis (100+ Articles across 10 Pages)
export async function scrapeGKTodayCurrentAffairs() {
  console.log("🌐 [16/17] Scraping GKToday Current Affairs (100+ Articles across 10 Pages)...");
  try {
    const pageUrls = [
      'https://www.gktoday.in/current-affairs/',
      'https://www.gktoday.in/current-affairs/page/2/',
      'https://www.gktoday.in/current-affairs/page/3/',
      'https://www.gktoday.in/current-affairs/page/4/',
      'https://www.gktoday.in/current-affairs/page/5/',
      'https://www.gktoday.in/current-affairs/page/6/',
      'https://www.gktoday.in/current-affairs/page/7/',
      'https://www.gktoday.in/current-affairs/page/8/',
      'https://www.gktoday.in/current-affairs/page/9/',
      'https://www.gktoday.in/current-affairs/page/10/'
    ];

    const htmls = await Promise.all(pageUrls.map((u) => fetchHtml(u)));
    const items = [];
    const todayStr = new Date().toISOString().split('T')[0];

    htmls.forEach((html) => {
      if (!html) return;
      const $ = cheerio.load(html);
      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        let text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text.length >= 25 && href.startsWith('https://www.gktoday.in/') && !href.includes('/category/') && !href.includes('/pdfs/') && !href.includes('/page/')) {
          if (!text.includes('Quiz') && !text.includes('Previous Months') && !text.includes('MCQs') && !text.includes('Categories')) {
            if (!items.some((it) => it.title === text || it.url === href)) {
              items.push({
                id: `gktoday-${Date.now()}-${items.length}`,
                title: text,
                source: 'GKToday',
                category: 'Current Affairs',
                url: href,
                timeAgo: 'Daily Current Affairs Analysis',
                date: todayStr
              });
            }
          }
        }
      });
    });

    console.log(`🌐 Successfully fetched ${items.length} 100+ items from GKToday!`);
    return items;
  } catch (err) {
    console.warn("⚠️ GKToday scrape issue:", err.message);
    return [];
  }
}

// 17. Scrape Jagran Josh General Knowledge (GK)
export async function scrapeJagranJoshGK() {
  console.log("📚 [17/17] Scraping Jagran Josh General Knowledge (GK)...");
  try {
    const html = await fetchHtml('https://www.jagranjosh.com/general-knowledge');
    if (!html) return [];
    const $ = cheerio.load(html);
    const items = [];
    const todayStr = new Date().toISOString().split('T')[0];

    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      $(el).find('img').remove();
      let text = $(el).text().replace(/\s+/g, ' ').trim();
      text = text.replace(/^alt=["']?/i, '').replace(/<[^>]*>/g, '').trim();

      if (href.includes('/general-knowledge/') && text.length >= 25 && text.length <= 150) {
        if (!text.includes('Read More') && !text.includes('Click Here') && !text.includes('Latest News')) {
          const fullUrl = href.startsWith('http') ? href : `https://www.jagranjosh.com${href}`;
          if (!items.some(it => it.title === text || it.url === fullUrl)) {
            items.push({
              id: `jagran-gk-${Date.now()}-${items.length}`,
              title: text,
              source: 'Jagran Josh GK',
              category: 'General Knowledge',
              url: fullUrl,
              timeAgo: 'GK Facts & Explanations',
              date: todayStr
            });
          }
        }
      }
    });
    console.log(`📚 Successfully fetched ${items.length} items from Jagran Josh GK!`);
    return items;
  } catch (err) {
    console.warn("⚠️ Jagran Josh GK scrape issue:", err.message);
    return [];
  }
}

// 18. Scrape Business, Economy & Market News (Share Market, RBI, IPO, Corporate)
export async function scrapeBusinessEconomyNews() {
  console.log("💼 [18/18] Scraping Business & Market News (Google Business RSS)...");
  try {
    const [feedA, feedB] = await Promise.all([
      fetchHtml('https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=hi&gl=IN&ceid=IN:hi'),
      fetchHtml('https://news.google.com/rss/search?q=%E0%A4%AC%E0%A4%BF%E0%A4%9C%E0%A4%A8%E0%A5%87%E0%A4%B8+OR+%E0%A4%B6%E0%A5%87%E0%A4%AF%E0%A4%B0+%E0%A4%AC%E0%A4%BE%E0%A4%9C%E0%A4%BE%E0%A4%B0+OR+%E0%A4%85%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE+OR+RBI+OR+IPO&hl=hi&gl=IN&ceid=IN:hi')
    ]);

    const news = [];
    const todayStr = new Date().toISOString().split('T')[0];

    [feedA, feedB].forEach((xml) => {
      if (!xml) return;
      const $ = cheerio.load(xml, { xmlMode: true });
      $('item').each((i, el) => {
        if (news.length >= 50) return;
        const title = cleanTitle($(el).find('title').text());
        const link = $(el).find('link').text();
        const source = $(el).find('source').text() || 'Business News';
        if (title && link && !news.some((n) => n.title.toLowerCase() === title.toLowerCase())) {
          news.push({
            id: `biz-${Date.now()}-${news.length}`,
            title: title,
            source: source,
            category: 'Business',
            url: link,
            timeAgo: 'Business & Market Live',
            tag: 'Business',
            date: todayStr
          });
        }
      });
    });

    console.log(`💼 Successfully fetched ${news.length} Business & Economy news articles!`);
    return { news, jobs: [] }; // STRICT: NEVER PUSH TO JOBS!
  } catch (err) {
    console.warn("⚠️ Business news scrape issue:", err.message);
    return { news: [], jobs: [] };
  }
}

// Main Aggregator & Multi-Target Publisher
export async function aggregateAllLiveData() {
  console.log("==================================================");
  console.log("🚀 STARTING 18-PORTAL REAL-TIME AGGREGATION (GOVT + PRIVATE + BUSINESS + DRISHTI + GKTODAY + JAGRAN GK)...");
  console.log("⏰ Time:", new Date().toLocaleTimeString());
  console.log("==================================================");

  // Bulletproof Failover Guard: If any portal fails, other portals continue seamlessly
  const safeScrape = async (fn, name) => {
    try {
      const res = await fn();
      return res || { jobs: [], news: [] };
    } catch (err) {
      console.warn(`⚠️ [Failover Safe Guard] ${name} issue: ${err.message}. Seamlessly continuing with other portals.`);
      return { jobs: [], news: [] };
    }
  };

  const [
    fjaData,
    jjData,
    nbtData,
    lhData,
    dbData,
    auData,
    toiData,
    gnNews,
    srComData,
    srCmData,
    rrData,
    remoteOkJobs,
    wwrJobs,
    channelVideos,
    drishtiData,
    gkTodayData,
    jagranGkData,
    bizData
  ] = await Promise.all([
    safeScrape(scrapeFreeJobAlert, 'FreeJobAlert'),
    safeScrape(scrapeJagranJosh, 'JagranJosh'),
    safeScrape(scrapeNavbharatTimes, 'NavbharatTimes'),
    safeScrape(scrapeLiveHindustan, 'LiveHindustan'),
    safeScrape(scrapeDainikBhaskar, 'DainikBhaskar'),
    safeScrape(scrapeAmarUjala, 'AmarUjala'),
    safeScrape(scrapeTimesOfIndia, 'TimesOfIndia'),
    safeScrape(scrapeGoogleNewsHindi, 'GoogleNewsHindi'),
    safeScrape(scrapeSarkariResultCom, 'SarkariResult.com'),
    safeScrape(scrapeSarkariResultCm, 'SarkariResult.cm'),
    safeScrape(scrapeRojgarResult, 'RojgarResult'),
    safeScrape(scrapeRemoteOkJobs, 'RemoteOK'),
    safeScrape(scrapeWeWorkRemotelyJobs, 'WeWorkRemotely'),
    safeScrape(scrapeYouTubeChannel, 'YouTubeChannel'),
    safeScrape(scrapeDrishtiHindiCurrentAffairs, 'DrishtiIASHindi'),
    safeScrape(scrapeGKTodayCurrentAffairs, 'GKToday'),
    safeScrape(scrapeJagranJoshGK, 'JagranJoshGK'),
    safeScrape(scrapeBusinessEconomyNews, 'BusinessEconomyNews')
  ]);

  // Combine news with intelligent deduplication (including Drishti IAS, GKToday, Jagran GK, FreeJobAlert, Business)
  const rawNews = [
    ...(fjaData?.news || (Array.isArray(fjaData) ? fjaData : [])),
    ...(jjData?.news || []),
    ...(nbtData?.news || []),
    ...(lhData?.news || []),
    ...(dbData?.news || []),
    ...(auData?.news || []),
    ...(toiData?.news || []),
    ...(Array.isArray(gnNews) ? gnNews : (gnNews?.news || [])),
    ...(srComData?.news || []),
    ...(srCmData?.news || []),
    ...(rrData?.news || []),
    ...(Array.isArray(drishtiData) ? drishtiData : (drishtiData?.news || [])),
    ...(Array.isArray(gkTodayData) ? gkTodayData : (gkTodayData?.news || [])),
    ...(Array.isArray(jagranGkData) ? jagranGkData : (jagranGkData?.news || [])),
    ...(bizData?.news || (Array.isArray(bizData) ? bizData : []))
  ];
  const allLiveNews = deduplicateNews(rawNews);

  // Combine fresh jobs with intelligent deduplication + strict auto-expiry removal + strict validity check
  const todayStr = new Date().toISOString().split('T')[0];
  const rawJobs = [
    ...(fjaData?.jobs || []),
    ...(srComData?.jobs || []),
    ...(srCmData?.jobs || []),
    ...(rrData?.jobs || []),
    ...(Array.isArray(remoteOkJobs) ? remoteOkJobs : (remoteOkJobs?.jobs || [])),
    ...(Array.isArray(wwrJobs) ? wwrJobs : (wwrJobs?.jobs || []))
  ].filter((job) => !isJobExpired(job.lastDate, todayStr) && isValidRecruitmentJob(job)); // Strict validity & auto-expiry removal

  const allFreshJobs = deduplicateJobs(rawJobs);

  // Automatically match jobs with real videos from your channel (@vacancyeraeducation)
  // STRICT: Only assign videoId if the channel video is a 100% verified match for that organization/topic
  const orgVideoRules = [
    { name: 'NTPC', re: /\bntpc\b/i },
    { name: 'ISRO', re: /\bisro\b|\bvssc\b|\bursc\b/i },
    { name: 'EIL', re: /\beil\b|engineers india/i },
    { name: 'Coal India', re: /coal india/i },
    { name: 'ONGC', re: /\bongc\b/i },
    { name: 'Hero', re: /hero motocorp|hero company/i },
    { name: 'DMRC', re: /\bdmrc\b|delhi metro/i },
    { name: 'Oil India', re: /oil india/i },
    { name: 'NMDC', re: /\bnmdc\b/i },
    { name: 'LIC', re: /\blic\b|life insurance/i },
    { name: 'NCL', re: /\bncl\b|northern coalfields/i },
    { name: 'DRDO', re: /\bdrdo\b/i },
    { name: 'BHEL', re: /\bbhel\b/i },
    { name: 'NHAI', re: /\bnhai\b/i },
    { name: 'RITES', re: /\brites\b/i }
  ];

  const allVideos = Array.isArray(channelVideos) ? channelVideos : [];
  allFreshJobs.forEach((job) => {
    const jobText = `${job.title || ''} ${job.dept || ''}`;

    // Ensure official website portal link is populated for all jobs
    if (!job.website) {
      job.website = getOfficialPortalUrl(job.dept, job.title, job.pdfUrl || job.applyUrl);
    }

    let matchedVid = null;
    for (const rule of orgVideoRules) {
      if (rule.re.test(jobText)) {
        matchedVid = allVideos.find(v => rule.re.test(v.title || ''));
        if (matchedVid) break;
      }
    }

    if (matchedVid) {
      job.videoId = matchedVid.videoId;
      job.videoUrl = `https://youtu.be/${matchedVid.videoId}`;
      job.videoTitle = matchedVid.title;
      job.channel = '@vacancyeraeducation';
    } else {
      // NEVER assign an unrelated video! Set videoId to null so official channel search card renders
      job.videoId = null;
      const cleanSearch = (job.title || '')
        .replace(/2026|Recruitment|Bharti|Online Form|\d+[\s,]*Posts|\d+[\s,]*Vacanc(y|ies)/gi, '')
        .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
        .trim()
        .split(/\s+/)
        .slice(0, 4)
        .join(' ');
      job.videoUrl = `https://www.youtube.com/@vacancyeraeducation/search?query=${encodeURIComponent(cleanSearch || job.title)}`;
      job.videoTitle = `${job.title} - Vacancy Era Education Analysis`;
      job.channel = '@vacancyeraeducation';
    }
  });

  // Dynamic Current Affairs Monthly Edition
  const now = new Date();
  const hindiMonths = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const currentMonthName = hindiMonths[now.getMonth()];
  const currentYear = now.getFullYear();
  const currentAffairsEdition = `${currentMonthName} ${currentYear}`;

  console.log(`📊 Total Cleaned Live Current Affairs & News: ${allLiveNews.length} (from 18+ portals)`);
  console.log(`📊 Total Active Verified Jobs: ${allFreshJobs.length}`);
  console.log(`📺 Total Channel Videos Synced: ${allVideos.length}`);
  console.log(`🗓️ Current Affairs Active Edition: ${currentAffairsEdition}`);

  const payload = {
    lastUpdated: new Date().toISOString(),
    status: "LIVE_SYNC_OK",
    activePortalsCount: 18,
    currentAffairsEdition: currentAffairsEdition,
    channelVideos: allVideos,
    jobs: allFreshJobs,
    news: allLiveNews
  };

  // Write to src/data for Vite build
  const srcPath = path.resolve('src/data/liveScrapedData.json');
  fs.writeFileSync(srcPath, JSON.stringify(payload, null, 2), 'utf-8');

  // Also write to public/live_data.json for instant runtime mobile polling
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const publicPath = path.join(publicDir, 'live_data.json');
  fs.writeFileSync(publicPath, JSON.stringify(payload, null, 2), 'utf-8');

  // Also sync to dist/live_data.json if dist exists
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'live_data.json'), JSON.stringify(payload, null, 2), 'utf-8');
  }

  console.log(`💾 Live data synced to: ${srcPath} AND ${publicPath}`);
  console.log("==================================================");
  return payload;
}

// Auto-run if executed directly
aggregateAllLiveData().catch(console.error);
