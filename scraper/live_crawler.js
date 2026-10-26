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
  const t = (text || '').toLowerCase();
  if (/b\.tech|b\.e|mca|bca|m\.tech|engineering/i.test(t)) return { type: 'B.Tech', qual: 'B.Tech / B.E / Engineering' };
  if (/mba|pgdm|post graduate|m\.sc|m\.com|m\.a|ph\.d|masters/i.test(t)) return { type: 'Graduate', qual: 'Post Graduate (MBA / M.Sc / Masters)' };
  if (/diploma|polytechnic|d\.pharm/i.test(t)) return { type: 'Diploma', qual: 'Polytechnic Diploma in relevant Branch' };
  if (/iti/i.test(t)) return { type: 'ITI', qual: 'ITI Pass in relevant Trade (NCVT/SCVT)' };
  if (/12th|12वीं|इंटर|inter|10\+2|constable|कॉन्स्टेबल|clerk|लिपिक/i.test(t)) return { type: '12th', qual: '12th Pass (Intermediate / 10+2)' };
  if (/10th|10वीं|मैट्रिक|matric|group d|mts|peon/i.test(t)) return { type: '10th', qual: '10th Pass (Matriculation)' };
  return { type: 'Graduate', qual: 'Graduation / Any Degree' };
}

export function enrichJobDetails(title, qualType) {
  const t = (title || '').toLowerCase();

  // 1. Accurate Post Count Extraction directly tied to "Posts" / "Vacancies" / "पद"
  let posts = "Active Openings";
  const explicitPostMatch = title.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(?:posts?|vacanc(?:y|ies)|पद)/i);
  if (explicitPostMatch) {
    const num = explicitPostMatch[1].trim();
    posts = num === '1' ? '1 Post' : `${num} Posts`;
  } else {
    const bracketMatch = title.match(/[\(\[]\s*(\d{1,3}(?:,\d{3})*|\d+)\s*(?:posts?|पद)?\s*[\)\]]/i);
    if (bracketMatch && !['2024', '2025', '2026', '2027'].includes(bracketMatch[1])) {
      const num = bracketMatch[1].trim();
      posts = num === '1' ? '1 Post' : `${num} Posts`;
    } else {
      const forPostsMatch = title.match(/(?:for|of)\s+(\d{1,3}(?:,\d{3})*|\d+)\s+.*?\bposts?\b/i);
      if (forPostsMatch && !['2024', '2025', '2026', '2027'].includes(forPostsMatch[1])) {
        const num = forPostsMatch[1].trim();
        posts = num === '1' ? '1 Post' : `${num} Posts`;
      } else {
        const generalNum = title.match(/(?:–|-|\/)\s*(\d{1,3}(?:,\d{3})*|\d{2,6})\s*(?:–|-|\/|$)/);
        if (generalNum && !['2024', '2025', '2026', '2027'].includes(generalNum[1])) {
          posts = `${generalNum[1]} Posts`;
        }
      }
    }
  }

  // 2. Accurate Department identification
  let dept = "Government Department";
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
    dept = "Delhi Police (Govt of India)";
  } else if (/coast guard|icg/i.test(t)) {
    dept = "Indian Coast Guard (Ministry of Defence)";
  } else if (/indian army|\barmy\b/i.test(t)) {
    dept = "Indian Army (Defence Forces)";
  } else if (/indian navy|\bnavy\b/i.test(t)) {
    dept = "Indian Navy (Defence Forces)";
  } else if (/air force|iaf|airforce/i.test(t)) {
    dept = "Indian Air Force (IAF)";
  } else if (/supreme court|\bsci\b/i.test(t)) {
    dept = "Supreme Court of India (SCI)";
  } else if (/high court/i.test(t)) {
    dept = "High Court Judicial Services";
  } else if (/railway|rrb|rrc|group d/i.test(t)) {
    dept = "Ministry of Railways (RRB / RRC)";
  } else if (/\bupsssc\b/i.test(t)) {
    dept = "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)";
  } else if (/\buppsc\b/i.test(t)) {
    dept = "Uttar Pradesh Public Service Commission (UPPSC)";
  } else if (/\bupprpb\b|up police/i.test(t)) {
    dept = "Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB)";
  } else if (/\bbpsc\b/i.test(t)) {
    dept = "Bihar Public Service Commission (BPSC)";
  } else if (/\bbtsc\b/i.test(t)) {
    dept = "Bihar Technical Services Commission (BTSC)";
  } else if (/\brpsc\b/i.test(t)) {
    dept = "Rajasthan Public Service Commission (RPSC)";
  } else if (/\brsmssb\b|\brssb\b/i.test(t)) {
    dept = "Rajasthan Staff Selection Board (RSSB / RSMSSB)";
  } else if (/\buksssc\b/i.test(t)) {
    dept = "Uttarakhand Subordinate Service Selection Commission (UKSSSC)";
  } else if (/\bukpsc\b/i.test(t)) {
    dept = "Uttarakhand Public Service Commission (UKPSC)";
  } else if (/\bmpesb\b|vyapam/i.test(t)) {
    dept = "Madhya Pradesh Employees Selection Board (MPESB)";
  } else if (/\bhssc\b/i.test(t)) {
    dept = "Haryana Staff Selection Commission (HSSC)";
  } else if (/\bopsc\b/i.test(t)) {
    dept = "Odisha Public Service Commission (OPSC)";
  } else if (/\bossc\b/i.test(t)) {
    dept = "Odisha Staff Selection Commission (OSSC)";
  } else if (/\bwbpsc\b/i.test(t)) {
    dept = "West Bengal Public Service Commission (WBPSC)";
  } else if (/\bjkssb\b/i.test(t)) {
    dept = "J&K Services Selection Board (JKSSB)";
  } else if (/\bssc\b|\bcgl\b|\bchsl\b|\bmts\b|havaldar|\bgd\b/i.test(t)) {
    dept = "Staff Selection Commission (SSC)";
  } else if (/\bupsc\b|\bnda\b|\bcds\b|civil service/i.test(t)) {
    dept = "Union Public Service Commission (UPSC)";
  } else if (/\baai\b|airports authority/i.test(t)) {
    dept = "Airports Authority of India (AAI)";
  } else if (/\beil\b|engineers india/i.test(t)) {
    dept = "Engineers India Limited (EIL, Navratna PSU)";
  } else if (/\bcsir\b|cftri|ihbt/i.test(t)) {
    dept = "Council of Scientific & Industrial Research (CSIR)";
  } else if (/\bnicl\b/i.test(t)) {
    dept = "National Insurance Company Limited (NICL)";
  } else if (/\buiic\b/i.test(t)) {
    dept = "United India Insurance Company (UIIC)";
  } else if (/\boicl\b/i.test(t)) {
    dept = "Oriental Insurance Company Limited (OICL)";
  } else if (/\bnabard\b|nabfins/i.test(t)) {
    dept = "NABARD / NABFINS Financial Services";
  } else if (/\bexim bank\b/i.test(t)) {
    dept = "Export-Import Bank of India (Exim Bank)";
  } else if (/\brbi\b|reserve bank/i.test(t)) {
    dept = "Reserve Bank of India (RBI)";
  } else if (/\bsbi\b|state bank of india/i.test(t)) {
    dept = "State Bank of India (SBI)";
  } else if (/\bkvic\b/i.test(t)) {
    dept = "Khadi & Village Industries Commission (KVIC)";
  } else if (/\bsai\b|sports authority/i.test(t)) {
    dept = "Sports Authority of India (SAI)";
  } else if (/\bnift\b/i.test(t)) {
    dept = "National Institute of Fashion Technology (NIFT)";
  } else if (/\bnta\b|ugc net/i.test(t)) {
    dept = "National Testing Agency (NTA)";
  } else if (/\bdgft\b/i.test(t)) {
    dept = "Directorate General of Foreign Trade (DGFT)";
  } else if (/\bhurl\b/i.test(t)) {
    dept = "Hindustan Urvarak & Rasayan Limited (HURL)";
  } else if (/\bbmhrc\b/i.test(t)) {
    dept = "Bhopal Memorial Hospital & Research Centre (ICMR)";
  } else if (/\brites\b/i.test(t)) {
    dept = "RITES Limited (Ministry of Railways)";
  } else if (/\bnhai\b/i.test(t)) {
    dept = "National Highways Authority of India (NHAI)";
  } else if (/\bnmdc\b/i.test(t)) {
    dept = "National Mineral Development Corp (NMDC)";
  } else if (/\bncl\b/i.test(t)) {
    dept = "Northern Coalfields Limited (NCL)";
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
  } else if (/\bcwc\b|warehousing/i.test(t)) {
    dept = "Central Warehousing Corporation (CWC)";
  } else if (/\birel\b/i.test(t)) {
    dept = "IREL (India) Limited (Govt PSU)";
  } else if (/\blic\b|life insurance/i.test(t)) {
    dept = "Life Insurance Corporation of India (LIC)";
  } else if (/bank of baroda|\bbob\b/i.test(t)) {
    dept = "Bank of Baroda";
  } else if (/punjab & sind|punjab and sind/i.test(t)) {
    dept = "Punjab & Sind Bank";
  } else if (/uco bank/i.test(t)) {
    dept = "UCO Bank";
  } else if (/canara bank/i.test(t)) {
    dept = "Canara Bank";
  } else if (/bank|ibps|\bpnb\b|co-operative bank/i.test(t)) {
    dept = "Banking Recruitment Board (IBPS / PSB)";
  } else if (/police|constable|\bsi\b|daroga|sub[\s-]?inspector|सिपाही|दरोगा/i.test(t)) {
    dept = "State Police Recruitment Board";
  } else if (/teacher|\btet\b|\bprt\b|\btgt\b|\bpgt\b|upessc/i.test(t)) {
    dept = "Education Dept / School Selection Board";
  } else if (/post office|\bgds\b|\bdak\b/i.test(t)) {
    dept = "Department of Posts (India Post)";
  } else if (/port authority/i.test(t)) {
    const portMatch = title.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+Port\s+Authority)/);
    dept = portMatch ? portMatch[1] : "Major Port Authority of India";
  } else if (/university|vishwavidyalaya/i.test(t)) {
    const univMatch = title.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+University)/);
    dept = univMatch ? univMatch[1] : "Central / State University";
  } else {
    const words = title.trim().split(/\s+/).filter(w => !/recruitment|online|form|apply|bharti|posts?|2026/i.test(w));
    if (words.length >= 2) {
      dept = `${words[0]} ${words[1]}`;
    } else if (words.length === 1) {
      dept = words[0];
    } else {
      dept = "Government Department";
    }
  }

  // 3. Realistic Post-Aligned Salary
  let salary = "Level 3 - Level 7 (₹21,700 - ₹69,100) + DA";
  if (/apprentice/i.test(t)) {
    salary = "Monthly Stipend ₹7,000 - ₹12,500/month (As per Apprenticeship Rules)";
  } else if (qualType === '10th' || /group d|mts|peon|safai|attendant|helper/i.test(t)) {
    salary = "Level 1 (₹18,000 - ₹56,900) + DA + HRA";
  } else if (qualType === 'ITI' || /technician|trade|artisan|fitter|mechanic|driver/i.test(t)) {
    salary = "Level 2 / Level 3 (₹19,900 - ₹69,100) + Allowances";
  } else if (qualType === '12th' || /clerk|constable|typist|deo|junior assistant/i.test(t)) {
    salary = "Level 3 / Level 4 (₹21,700 - ₹81,100) + HRA";
  } else if (/presiding officer|director|chief executive|general manager|dgm/i.test(t)) {
    salary = "Level 12 - Level 14 (₹1,44,200 - ₹2,18,200) + Perks";
  } else if (qualType === 'Graduate' || qualType === 'B.Tech' || /officer|inspector|sub[\s-]?engineer|assistant manager|engineer|scientist|faculty/i.test(t)) {
    salary = "Level 6 / Level 7 (₹35,400 - ₹1,42,400) + Grade Pay";
  }

  // 4. Post-Aligned Age Limit
  let ageLimit = "18 - 35 Years (Relaxation as per Govt Rules)";
  if (/apprentice/i.test(t)) {
    ageLimit = "15 - 24 Years (Age Relaxation as per rules)";
  } else if (/police|defence|army|navy|airforce|crpf|bsf|cisf|itbp|ssb|assam rifles/i.test(t)) {
    ageLimit = "18 - 25 Years (Relaxation for OBC/SC/ST)";
  } else if (/director|chief|general manager|presiding officer|specialist/i.test(t)) {
    ageLimit = "Up to 56 Years (As per Experience)";
  }

  // 5. Post-Aligned Selection Process
  let selectionProcess = "CBT / Written Exam + Document Verification";
  if (/apprentice/i.test(t)) {
    selectionProcess = "10th & ITI Merit List (No Written Exam) + Document Verification";
  } else if (/police|army|navy|crpf|bsf|cisf|itbp|ssb|constable|tradesman|sub[\s-]?inspector/i.test(t)) {
    selectionProcess = "CBT Exam + Physical Test (PET/PST) + Medical Examination";
  } else if (/gds|merit/i.test(t)) {
    selectionProcess = "10th Class Merit List (Zero Written Exam)";
  } else if (/interview|faculty|specialist|officer|manager|director/i.test(t)) {
    selectionProcess = "Screening Test + Personal Interview";
  }

  // 6. Application Fee
  let fee = "₹100 (Gen/OBC), Nil (SC/ST/Women/Ex-SM)";
  if (/railway|rrb|rrc/i.test(t)) {
    fee = "₹500 (₹400 Refundable after appearing in CBT)";
  } else if (/bank|ibps|sbi|rbi|pnb|uco|canara/i.test(t)) {
    fee = "₹850 (Gen/OBC/EWS), ₹175 (SC/ST/PWD)";
  } else if (/apprentice/i.test(t)) {
    fee = "Nil (100% Free Application)";
  } else if (/upsc/i.test(t)) {
    fee = "₹100 (Gen/OBC Male), Nil (Female/SC/ST/PwBD)";
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

function formatQualText(rawQual, fallbackType) {
  const q = (rawQual || '').trim();
  if (!q || q.length < 3 || /^(other|others|retired\s*staff|various)$/i.test(q)) {
    if (fallbackType === '10th') return '10th Pass (Matriculation) from recognized Board';
    if (fallbackType === '12th') return '12th Pass (Intermediate / 10+2) in any stream';
    if (fallbackType === 'ITI') return 'ITI Pass in relevant Trade (NCVT/SCVT)';
    if (fallbackType === 'Diploma') return 'Polytechnic Diploma in relevant Branch';
    if (fallbackType === 'B.Tech') return 'B.Tech / B.E / Engineering Degree in relevant discipline';
    return 'Graduation / Relevant Educational Qualification as per Notification';
  }
  if (/^10th$/i.test(q)) return '10th Pass (Matriculation) from recognized Board';
  if (/^12th$/i.test(q)) return '12th Pass (Intermediate / 10+2) in any stream';
  if (/^iti$/i.test(q)) return 'ITI Pass in relevant Trade (NCVT/SCVT)';
  if (/^diploma$/i.test(q)) return 'Polytechnic Diploma in relevant Engineering / Technology';
  if (/^b\.?e\b|^b\.?tech\b/i.test(q) && q.length < 15) return 'B.Tech / B.E / Engineering Degree in relevant discipline';
  if (/^any degree$/i.test(q)) return 'Graduation / Any Bachelor Degree from recognized University';
  return q;
}

function detectFjaQual(qualText, postText) {
  const text = `${qualText} ${postText}`.toLowerCase();
  let type = 'Graduate';
  let qual = qualText;

  if (/b\.tech|b\.e|mca|bca|m\.tech|engineering/i.test(text)) {
    type = 'B.Tech';
    qual = qualText || 'B.Tech / B.E / Engineering Degree';
  } else if (/mba|pgdm|post graduate|m\.sc|m\.com|m\.a|ph\.d|masters/i.test(text)) {
    type = 'Graduate';
    qual = qualText || 'Post Graduate (MBA / M.Sc / Masters Degree)';
  } else if (/diploma|polytechnic|d\.pharm/i.test(text)) {
    type = 'Diploma';
    qual = qualText || 'Polytechnic Diploma in relevant Branch';
  } else if (/iti/i.test(text)) {
    type = 'ITI';
    qual = qualText || 'ITI Pass in relevant Trade (NCVT/SCVT)';
  } else if (/12th|12वीं|inter|intermediate|10\+2/i.test(text)) {
    type = '12th';
    qual = qualText || '12th Pass (Intermediate / 10+2)';
  } else if (/10th|10वीं|matric/i.test(text)) {
    type = '10th';
    qual = qualText || '10th Pass (Matriculation)';
  } else if (/graduate|degree|b\.a|b\.sc|b\.com/i.test(text)) {
    type = 'Graduate';
    qual = qualText || 'Graduation / Any Bachelor Degree';
  }

  return { type, qual: formatQualText(qual, type) };
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

export function isClosingWithinDays(dateStr, days = 7) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const target = new Date(dateStr).getTime();
  const now = new Date(new Date().toISOString().split('T')[0]).getTime();
  const diffDays = Math.round((target - now) / 86400000);
  return diffDays >= 0 && diffDays <= days;
}

export function generateRealisticFallbackDate(title, daysBase = 20) {
  let hash = 0;
  for (let i = 0; i < (title || '').length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const offsetDays = daysBase + (Math.abs(hash) % 14);
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toISOString().split('T')[0];
}

const REGISTRY_GENERIC_WORDS = new Set([
  'bank', 'factory', 'hospital', 'police', 'school', 'college', 'university',
  'authority', 'board', 'corporation', 'limited', 'department', 'commission',
  'ministry', 'cell', 'society', 'trust', 'sansthan', 'mandal', 'court',
  'high', 'railway', 'india', 'govt', 'state', 'central', 'national',
  'online', 'offline', 'form', 'apply', 'recruitment', 'bharti', 'posts', 'post',
  'vacancy', 'vacancies', 'various', 'notice', 'notification', '2024', '2025', '2026', '2027'
]);

export class MasterDateRegistry {
  constructor() {
    this.entries = [];
    this.slugMap = new Map();
    this.initialized = false;
  }

  init(tableHtml) {
    if (!tableHtml) return;
    this.entries = [];
    this.slugMap.clear();
    const $ = cheerio.load(tableHtml);
    const todayStr = new Date().toISOString().split('T')[0];

    $('table tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 6) {
        const postDate = $(tds[0]).text().trim();
        const org = $(tds[1]).text().trim();
        const postName = $(tds[2]).text().trim().replace(/\s+/g, ' ');
        const qual = $(tds[3]).text().trim().replace(/\s+/g, ' ');
        const lastDateRaw = $(tds[5]).text().trim();
        const link = $(tr).find('a[href*="/articles/"]').attr('href') || $(tr).find('a').attr('href') || '';
        const parsedDate = parseFjaDate(lastDateRaw);

        if (org && postName && parsedDate && parsedDate >= todayStr) {
          const entry = {
            org,
            postName,
            qual,
            lastDate: parsedDate,
            rawLastDate: lastDateRaw,
            link
          };
          this.entries.push(entry);

          if (link) {
            const slug = link.replace(/\/$/, '').split('/').pop().toLowerCase();
            if (slug && slug.length > 5) {
              this.slugMap.set(slug, entry);
            }
          }
        }
      }
    });
    this.initialized = true;
    console.log(`[MasterDateRegistry] Indexed ${this.entries.length} active recruitment notices with verified dates.`);
  }

  findMatch(title, link = '') {
    if (!title && !link) return null;

    // 1. Exact slug match
    if (link) {
      const slug = link.replace(/\/$/, '').split('/').pop().toLowerCase();
      if (slug && this.slugMap.has(slug)) {
        return this.slugMap.get(slug);
      }
      for (const [s, entry] of this.slugMap.entries()) {
        if (s.length > 8 && (slug.includes(s) || s.includes(slug))) {
          return entry;
        }
      }
    }

    // 2. Token match
    const cleanTitle = (title || '').toLowerCase()
      .replace(/https?:\/\/[^\s]+/g, ' ')
      .replace(/[^\w\s\u0900-\u097F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const titleWords = cleanTitle.split(' ').filter(w => w.length >= 3 && !/^\d+$/.test(w));
    const titleDistinctWords = titleWords.filter(w => !REGISTRY_GENERIC_WORDS.has(w));
    if (titleDistinctWords.length === 0) return null;

    let bestMatch = null;
    let highestScore = 0;

    for (const entry of this.entries) {
      const entryOrg = entry.org.toLowerCase();
      const orgDistinctWords = entryOrg.split(/\s+/).filter(w => w.length >= 3 && !REGISTRY_GENERIC_WORDS.has(w));

      // Org must share at least ONE distinctive non-generic word
      const sharesOrgWord = orgDistinctWords.some(w => titleDistinctWords.includes(w) || titleWords.some(tw => tw.includes(w) || w.includes(tw)));
      if (!sharesOrgWord) continue;

      const entryText = `${entry.org} ${entry.postName}`.toLowerCase();
      let score = 3;
      for (const w of titleDistinctWords) {
        if (entryText.includes(w)) score += 2;
      }

      if (score > highestScore && score >= 5) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    return bestMatch;
  }
}

export const globalDateRegistry = new MasterDateRegistry();

export async function fetchDetailPageLastDate(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const html = await fetchHtml(url);
    if (!html) return null;
    const cleanHtml = html.replace(/<[^>]*>/g, ' ');
    const m = cleanHtml.match(/Last Date\s*[:–-]?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})/i);
    if (m) {
      return parseFjaDate(m[1]);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// 1. Scrape FreeJobAlert (Live Table Master Registry + 3 Homepage Boxes + Feed)
export async function scrapeFreeJobAlert() {
  console.log("🌐 [1/12] Scraping FreeJobAlert (Live Table + 3 Boxes + Feed)...");
  const [homeHtml, latestTableHtml, feedXml] = await Promise.all([
    fetchHtml('https://www.freejobalert.com/'),
    fetchHtml('https://www.freejobalert.com/latest-notifications/'),
    fetchHtml('https://www.freejobalert.com/feed/')
  ]);
  const jobs = [];
  const news = [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Initialize master date registry with latest live table
  if (latestTableHtml && !globalDateRegistry.initialized) {
    globalDateRegistry.init(latestTableHtml);
  }

  // A. Parse structured Live Table FIRST: Extract top genuine jobs with 100% verified dates
  if (latestTableHtml) {
    const $ = cheerio.load(latestTableHtml);
    $('table tr').each((i, tr) => {
      if (jobs.length >= 135) return;
      const tds = $(tr).find('td');
      if (tds.length >= 6) {
        const postDate = $(tds[0]).text().trim();
        const org = $(tds[1]).text().trim();
        const postName = $(tds[2]).text().trim().replace(/\s+/g, ' ');
        const qual = $(tds[3]).text().trim().replace(/\s+/g, ' ');
        const lastDateRaw = $(tds[5]).text().trim();
        const link = $(tr).find('a[href*="/articles/"]').attr('href') || $(tr).find('a').attr('href');

        if (org && postName && link && !postName.toLowerCase().includes('post name')) {
          if (/admit\s*card|hall\s*ticket|call\s*letter|eligibility\s*result|final\s*result|\bresult\b|score\s*card|answer\s*key|merit\s*list|exam\s*date/i.test(postName) && !/online\s*form|apply\s*online/i.test(postName)) {
            news.push({
              id: `fja-live-news-${Date.now()}-${i}`,
              title: `${org} - ${postName}`,
              url: link,
              source: "FreeJobAlert",
              tag: /admit/i.test(postName) ? "Admit Card" : (/result/i.test(postName) ? "Result" : "Exam Alert"),
              timeAgo: "Live Alert",
              isAdmit: /admit/i.test(postName),
              isResult: /result/i.test(postName)
            });
            return;
          }
          const lastDate = parseFjaDate(lastDateRaw);
          if (lastDate && lastDate >= todayStr) {
            const q = detectFjaQual(qual, postName);
            const state = detectFjaState(org, postName);
            const title = `${org} ${postName} Recruitment 2026`;
            if (!jobs.some(j => j.title.toLowerCase() === title.toLowerCase())) {
              const details = enrichJobDetails(title, q.type);
              let postCount = details.posts;
              if (postCount === "Active Openings" && postName.includes('Posts')) {
                const parts = postName.split('–');
                if (parts.length > 1 && /\d+\s*posts/i.test(parts[parts.length - 1])) {
                  postCount = parts[parts.length - 1].trim();
                }
              }
              const isClosing = isClosingWithinDays(lastDate, 7);
              jobs.push({
                id: `fja-table-${Date.now()}-${i}`,
                title: title,
                dept: org,
                posts: postCount,
                qualification: q.qual,
                state: state,
                category: "Govt",
                type: q.type,
                lastDate: lastDate,
                isRealDate: true,
                ageLimit: details.ageLimit,
                fee: details.fee,
                pdfUrl: link,
                applyUrl: link,
                fallbackUrl: getOfficialPortalUrl(details.dept, title, link),
                source: "FreeJobAlert",
                isNew: true,
                isClosingSoon: isClosing,
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

  // B. Parse Homepage 3 Main Boxes directly (.nutitle)
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
            if (/admit\s*card|hall\s*ticket|call\s*letter|eligibility\s*result|final\s*result|\bresult\b|score\s*card|answer\s*key|merit\s*list|exam\s*date/i.test(text) && !/online\s*form|apply\s*online/i.test(text)) {
              news.push({
                id: `fja-box-news-${Date.now()}-${i}`,
                title: text,
                url: href,
                source: "FreeJobAlert",
                tag: /admit/i.test(text) ? "Admit Card" : (/result/i.test(text) ? "Result" : "Exam Alert"),
                timeAgo: "Live Alert",
                isAdmit: /admit/i.test(text),
                isResult: /result/i.test(text)
              });
              return;
            }
            const q = detectFjaQual('', text);
            const state = detectFjaState('', text);
            const details = enrichJobDetails(text, q.type);

            const tableMatch = globalDateRegistry.findMatch(text, href);
            const realLastDate = tableMatch ? tableMatch.lastDate : null;
            const finalLastDate = realLastDate || generateRealisticFallbackDate(text, 18);
            const isClosing = isClosingWithinDays(finalLastDate, 7);

            jobs.push({
              id: `fja-box-${Date.now()}-${i}`,
              title: text,
              dept: details.dept,
              posts: details.posts,
              qualification: q.qual,
              state: state,
              category: "Govt",
              type: q.type,
              lastDate: finalLastDate,
              isRealDate: Boolean(realLastDate),
              ageLimit: details.ageLimit,
              fee: details.fee,
              pdfUrl: href,
              applyUrl: href,
              fallbackUrl: getOfficialPortalUrl(details.dept, text, href),
              source: "FreeJobAlert",
              isNew: true,
              isClosingSoon: isClosing,
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

  // C. Parse instant RSS feed items (real-time live articles)
  if (feedXml) {
    const $feed = cheerio.load(feedXml, { xmlMode: true });
    $feed('item').each((i, el) => {
      if (jobs.length >= 110) return;
      const title = cleanTitle($feed(el).find('title').text());
      const link = $feed(el).find('link').text() || $feed(el).find('guid').text();
      if (title && title.length > 12 && !jobs.some(j => j.title.toLowerCase() === title.toLowerCase())) {
        if (/admit\s*card|hall\s*ticket|call\s*letter|eligibility\s*result|final\s*result|\bresult\b|score\s*card|answer\s*key|merit\s*list|exam\s*date/i.test(title) && !/online\s*form|apply\s*online/i.test(title)) {
          news.push({
            id: `fja-feed-news-${Date.now()}-${i}`,
            title: title,
            url: link,
            source: "FreeJobAlert",
            tag: /admit/i.test(title) ? "Admit Card" : (/result/i.test(title) ? "Result" : "Exam Alert"),
            timeAgo: "Live Alert",
            isAdmit: /admit/i.test(title),
            isResult: /result/i.test(title)
          });
          return;
        }
        const q = detectQualification(title);
        const details = enrichJobDetails(title, q.type);

        const tableMatch = globalDateRegistry.findMatch(title, link);
        const realLastDate = tableMatch ? tableMatch.lastDate : null;
        const finalLastDate = realLastDate || generateRealisticFallbackDate(title, 20);
        const isClosing = isClosingWithinDays(finalLastDate, 7);

        jobs.push({
          id: `fja-feed-${Date.now()}-${i}`,
          title: title,
          dept: details.dept,
          posts: details.posts,
          qualification: q.qual,
          state: "All India",
          category: "Govt",
          type: q.type,
          lastDate: finalLastDate,
          isRealDate: Boolean(realLastDate),
          ageLimit: details.ageLimit,
          fee: details.fee,
          pdfUrl: link,
          applyUrl: link,
          fallbackUrl: getOfficialPortalUrl(details.dept, title, link),
          source: "FreeJobAlert",
          isNew: true,
          isClosingSoon: isClosing,
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
  const candidateJobs = [];

  $('a').each((i, el) => {
    const text = cleanTitle($(el).text());
    const href = $(el).attr('href') || '';
    if (!text || text.length < 12 || !href.startsWith('http')) return;
    if (href.includes('youtube') || href.includes('instagram') || href.includes('twitter') || href.includes('t.me') || href.includes('itunes') || href.includes('play.google')) return;
    if (/sarkari\s*result|tools|privacy|disclaimer|contact|about|home/i.test(text)) return;

    const isAdmitOrResult = /result|admit\s*card|answer\s*key|cutoff|score\s*card|hall\s*ticket|eligibility|selection/i.test(text);
    const isOnlineForm = /online\s*form|apply\s*online/i.test(text);

    if (isAdmitOrResult && !isOnlineForm) {
      if (!news.some(n => n.title.toLowerCase() === text.toLowerCase()) && news.length < 25) {
        const isAdmit = /admit\s*card|hall\s*ticket/i.test(text);
        const isResult = /result|score\s*card|selection|merit/i.test(text);
        news.push({
          id: `sr-news-${Date.now()}-${i}`,
          title: text,
          source: "Sarkari Result",
          url: href,
          timeAgo: "Live Sarkari Alert",
          tag: isAdmit ? "Admit Card" : (isResult ? "Result" : "Sarkari Result"),
          isAdmit,
          isResult
        });
      }
      return;
    }

    if (/online\s*form|recruitment|bharti|vacancy|\bposts?\b|apply/i.test(text)) {
      if (!candidateJobs.some(j => j.text.toLowerCase() === text.toLowerCase()) && candidateJobs.length < 25) {
        candidateJobs.push({ text, href, index: i });
      }
    }
  });

  // Resolve authentic dates for candidate jobs
  for (const item of candidateJobs) {
    const { text, href, index } = item;
    const q = detectQualification(text);
    const details = enrichJobDetails(text, q.type);

    let realDate = null;
    const tableMatch = globalDateRegistry.findMatch(text, href);
    if (tableMatch) {
      realDate = tableMatch.lastDate;
    } else if (candidateJobs.indexOf(item) < 12) {
      realDate = await fetchDetailPageLastDate(href);
    }

    const finalLastDate = realDate || generateRealisticFallbackDate(text, 19);
    const isClosing = isClosingWithinDays(finalLastDate, 7);

    jobs.push({
      id: `sr-${Date.now()}-${index}`,
      title: text,
      dept: details.dept,
      posts: details.posts,
      qualification: q.qual,
      state: "All India / State",
      category: "Govt",
      type: q.type,
      lastDate: finalLastDate,
      isRealDate: Boolean(realDate),
      ageLimit: details.ageLimit,
      fee: details.fee,
      pdfUrl: href,
      applyUrl: href,
      source: "Sarkari Result",
      isNew: true,
      isClosingSoon: isClosing,
      isComingSoon: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text),
      status: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text) ? 'COMING_SOON' : 'ACTIVE',
      isNewsArticle: false,
      viewsCount: Math.floor(25000 + Math.random() * 30000),
      salary: details.salary,
      selectionProcess: details.selectionProcess
    });
  }

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

    const isAdmitOrResult = /result|admit\s*card|answer\s*key|cutoff|score\s*card|hall\s*ticket|out|declared/i.test(text);
    const isOnlineForm = /online\s*form|apply\s*online/i.test(text);

    if (isAdmitOrResult && !isOnlineForm) {
      if (!news.some(n => n.title.toLowerCase() === text.toLowerCase()) && news.length < 25) {
        const isAdmit = /admit\s*card|hall\s*ticket/i.test(text);
        const isResult = /result|score\s*card|merit/i.test(text);
        news.push({
          id: `srcm-news-${Date.now()}-${i}`,
          title: text,
          source: "Sarkari Result .cm",
          url: href,
          timeAgo: "Sarkari Alert",
          tag: isAdmit ? "Admit Card" : (isResult ? "Result" : "Sarkari Result .cm"),
          isAdmit,
          isResult
        });
      }
      return;
    }

    if (/form|recruitment|bharti|vacancy|\bposts?\b|karmchari|teacher/i.test(text)) {
      if (!jobs.some(j => j.title.toLowerCase() === text.toLowerCase()) && jobs.length < 25) {
        const q = detectQualification(text);
        const details = enrichJobDetails(text, q.type);

        const tableMatch = globalDateRegistry.findMatch(text, href);
        const realLastDate = tableMatch ? tableMatch.lastDate : null;
        const finalLastDate = realLastDate || generateRealisticFallbackDate(text, 23);
        const isClosing = isClosingWithinDays(finalLastDate, 7);

        jobs.push({
          id: `srcm-${Date.now()}-${i}`,
          title: text,
          dept: details.dept,
          posts: details.posts,
          qualification: q.qual,
          state: "All India / State",
          category: "Govt",
          type: q.type,
          lastDate: finalLastDate,
          isRealDate: Boolean(realLastDate),
          ageLimit: details.ageLimit,
          fee: details.fee,
          pdfUrl: href,
          applyUrl: href,
          source: "Sarkari Result .cm",
          isNew: true,
          isClosingSoon: isClosing,
          isComingSoon: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text),
          status: /upcoming|coming soon|notified soon|जल्द|शीघ्र/i.test(text) ? 'COMING_SOON' : 'ACTIVE',
          isNewsArticle: false,
          viewsCount: Math.floor(22000 + Math.random() * 28000),
          salary: details.salary,
          selectionProcess: details.selectionProcess
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
  const candidateJobs = [];

  $('a').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = cleanTitle($(el).text());
    if (!href.includes('rojgarresult.com') || text.length < 15 || text.includes('Rojgar Result') || text.includes('Disclaimer')) return;

    const isAdmitOrResult = /result|admit\s*card|answer\s*key|score\s*card|allotment|cutoff|hall\s*ticket/i.test(text);
    const isOnlineForm = /online\s*form|apply\s*online/i.test(text);

    if (isAdmitOrResult && !isOnlineForm) {
      if (!news.some(n => n.title.toLowerCase() === text.toLowerCase()) && news.length < 25) {
        const isAdmit = /admit\s*card|hall\s*ticket/i.test(text);
        const isResult = /result|allotment|score\s*card/i.test(text);
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
      return;
    }

    if (/online\s*form|recruitment|bharti|vacancy|\bposts?\b|tre 4|pgt|chsl|assistant/i.test(text)) {
      if (!candidateJobs.some(j => j.text.toLowerCase() === text.toLowerCase()) && candidateJobs.length < 20) {
        candidateJobs.push({ text, href, index: i });
      }
    }
  });

  for (const item of candidateJobs) {
    const { text, href, index } = item;
    const q = detectQualification(text);
    const details = enrichJobDetails(text, q.type);

    let realDate = null;
    const tableMatch = globalDateRegistry.findMatch(text, href);
    if (tableMatch) {
      realDate = tableMatch.lastDate;
    } else if (candidateJobs.indexOf(item) < 10) {
      realDate = await fetchDetailPageLastDate(href);
    }

    const finalLastDate = realDate || generateRealisticFallbackDate(text, 22);
    const isClosing = isClosingWithinDays(finalLastDate, 7);

    jobs.push({
      id: `rr-job-${Date.now()}-${index}`,
      title: text,
      dept: details.dept,
      posts: details.posts,
      qualification: q.qual,
      state: /up|bihar|delhi|rajasthan|haryana|mp/i.test(text) ? (text.match(/up|bihar|delhi|rajasthan|haryana|mp/i)[0].toUpperCase()) : "All India",
      category: "Govt",
      type: q.type,
      lastDate: finalLastDate,
      isRealDate: Boolean(realDate),
      ageLimit: details.ageLimit,
      fee: details.fee,
      pdfUrl: href,
      applyUrl: href,
      source: "Rojgar Result",
      isNew: true,
      isClosingSoon: isClosing,
      status: "ACTIVE",
      viewsCount: Math.floor(22000 + Math.random() * 20000),
      salary: details.salary,
      selectionProcess: details.selectionProcess,
      videoId: details.videoId,
      videoUrl: details.videoUrl,
      videoTitle: details.videoTitle
    });
  }

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

// 19. Dedicated All-India State Government Recruitment Crawler (UP, MP, Bihar, Rajasthan, Delhi, Odisha, Assam, etc.)
export async function scrapeAllStateGovernmentJobs() {
  console.log("🌐 [19/19] Scraping 14+ State Government Portals (UP, MP, Bihar, Rajasthan, Delhi, Odisha, Assam, Punjab, etc.)...");
  const statePages = [
    { state: 'Rajasthan', url: 'https://www.freejobalert.com/rajasthan-government-jobs/' },
    { state: 'Uttar Pradesh', url: 'https://www.freejobalert.com/up-government-jobs/' },
    { state: 'Bihar', url: 'https://www.freejobalert.com/bihar-government-jobs/' },
    { state: 'Madhya Pradesh', url: 'https://www.freejobalert.com/mp-government-jobs/' },
    { state: 'Delhi', url: 'https://www.freejobalert.com/delhi-jobs/' },
    { state: 'Haryana', url: 'https://www.freejobalert.com/haryana-jobs/' },
    { state: 'Jharkhand', url: 'https://www.freejobalert.com/jharkhand-jobs/' },
    { state: 'Chhattisgarh', url: 'https://www.freejobalert.com/chhattisgarh-jobs/' },
    { state: 'Punjab', url: 'https://www.freejobalert.com/punjab-government-jobs/' },
    { state: 'Odisha', url: 'https://www.freejobalert.com/odisha-government-jobs/' },
    { state: 'Assam', url: 'https://www.freejobalert.com/assam-government-jobs/' },
    { state: 'Gujarat', url: 'https://www.freejobalert.com/gujarat-government-jobs/' },
    { state: 'Maharashtra', url: 'https://www.freejobalert.com/maharashtra-government-jobs/' },
    { state: 'West Bengal', url: 'https://www.freejobalert.com/west-bengal-government-jobs/' }
  ];

  const jobs = [];
  const news = [];
  const todayStr = new Date().toISOString().split('T')[0];

  await Promise.all(statePages.map(async (sp) => {
    try {
      const html = await fetchHtml(sp.url);
      if (!html) return;
      const $ = cheerio.load(html);
      $('table tr').each((i, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 6) {
          const org = $(tds[1]).text().trim();
          const postName = $(tds[2]).text().trim().replace(/\s+/g, ' ');
          const qual = $(tds[3]).text().trim().replace(/\s+/g, ' ');
          const lastDateRaw = $(tds[5]).text().trim();
          const link = $(tr).find('a[href*="/articles/"]').attr('href') || $(tr).find('a').attr('href');

          if (org && postName && link && !postName.toLowerCase().includes('post name')) {
            const lastDate = parseFjaDate(lastDateRaw);
            if (lastDate && lastDate >= todayStr) {
              const q = detectFjaQual(qual, postName);
              const title = `${org} ${postName} Recruitment 2026`;
              if (!jobs.some(j => j.title.toLowerCase() === title.toLowerCase())) {
                const details = enrichJobDetails(title, q.type);
                let postCount = details.posts;
                if (postCount === "Active Openings" && postName.includes('Posts')) {
                  const parts = postName.split('–');
                  if (parts.length > 1 && /\d+\s*posts/i.test(parts[parts.length - 1])) {
                    postCount = parts[parts.length - 1].trim();
                  }
                }
                jobs.push({
                  id: `state-${sp.state.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`,
                  title: title,
                  dept: org,
                  posts: postCount,
                  qualification: q.qual,
                  state: sp.state,
                  category: "Govt",
                  type: q.type,
                  lastDate: lastDate,
                  isRealDate: true,
                  ageLimit: details.ageLimit,
                  fee: details.fee,
                  pdfUrl: link,
                  applyUrl: link,
                  fallbackUrl: getOfficialPortalUrl(details.dept, title, link),
                  source: `FreeJobAlert (${sp.state})`,
                  isNew: true,
                  isClosingSoon: isClosingWithinDays(lastDate, 7),
                  status: "ACTIVE",
                  viewsCount: Math.floor(18000 + Math.random() * 20000),
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
    } catch (e) {
      console.warn(`[State Crawler] Error scraping ${sp.state}:`, e.message);
    }
  }));

  console.log(`✅ [State Crawler] Extracted ${jobs.length} dedicated State Government vacancies across India!`);
  return { jobs, news };
}

// Main Aggregator & Multi-Target Publisher
export async function aggregateAllLiveData() {
  console.log("==================================================");
  console.log("🚀 STARTING 18-PORTAL REAL-TIME AGGREGATION (GOVT + PRIVATE + BUSINESS + DRISHTI + GKTODAY + JAGRAN GK)...");
  console.log("⏰ Time:", new Date().toLocaleTimeString());
  console.log("==================================================");

  // Pre-initialize Master Date Registry from FreeJobAlert Table so all scrapers have immediate access
  console.log("⚡ [Master Registry] Initializing FreeJobAlert Master Recruitment Registry (1,800+ entries)...");
  try {
    const tableHtml = await fetchHtml('https://www.freejobalert.com/latest-notifications/');
    if (tableHtml) {
      globalDateRegistry.init(tableHtml);
    }
  } catch (err) {
    console.warn("⚠️ [Master Registry] Pre-init issue, will initialize during FreeJobAlert scrape:", err.message);
  }

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
    bizData,
    stateData
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
    safeScrape(scrapeBusinessEconomyNews, 'BusinessEconomyNews'),
    safeScrape(scrapeAllStateGovernmentJobs, 'StateGovernmentJobs')
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
    ...(stateData?.jobs || []),
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

  // Circuit breaker: Never wipe good existing data if crawler was offline or 0 jobs were scraped
  if (allFreshJobs.length === 0) {
    console.warn("⚠️ [Safety Guard] 0 jobs scraped (network offline or blocked). Preserving existing live data!");
    return;
  }

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
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('live_crawler.js')) {
  aggregateAllLiveData().catch(console.error);
}
