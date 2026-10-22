// Official Video Registry for Vacancy Era Education YouTube Channel (@vacancyeraeducation)
export const OFFICIAL_CHANNEL_URL = "https://www.youtube.com/@vacancyeraeducation";
export const OFFICIAL_CHANNEL_ID = "UChHRt-QM9T9Wyx1Q4zUTcVg";

export const VIDEO_REGISTRY = [
  {
    keywords: ["ntpc", "national thermal power"],
    videoId: "EZvKIO-TNsQ",
    videoUrl: "https://youtu.be/EZvKIO-TNsQ",
    title: "NTPC Recruitment 2026 UR-OBC के लिए | Special Drive नई भर्ती | Vacancy Era Education",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["isro", "space", "vssc", "ursc", "sdsc"],
    videoId: "_3G_myadrN8",
    videoUrl: "https://youtu.be/_3G_myadrN8",
    title: "ISRO New Vacancy 2026 | MTS & Driver Vacancy | ISRO Recruitment 2026 🚀10वीं, ITI पास",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["eil", "engineers india"],
    videoId: "pgtC9BT744I",
    videoUrl: "https://youtu.be/pgtC9BT744I",
    title: "EIL Recruitment 2026🚨Diploma पास के लिए मौका | Navratna PSU Job | पूरी जानकारी",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["coal india", "cil", "coal"],
    videoId: "YDpQqasdH7s",
    videoUrl: "https://youtu.be/YDpQqasdH7s",
    title: "Coal India भर्ती 2026🚨Notification और सरकारी नौकरी | CIL नई भर्ती | Exam & Apply Online",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["ongc", "oil and natural gas"],
    videoId: "NmmE_hfX97Q",
    videoUrl: "https://youtu.be/NmmE_hfX97Q",
    title: "ONGC Recruitment 2026 | ONGC नई भर्ती | Free Form | Apply Online | 10th ITI Pass New Jobs",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["hero", "hero motocorp"],
    videoId: "gZb4UqmYDAU",
    videoUrl: "https://youtu.be/gZb4UqmYDAU",
    title: "Hero कंपनी में नौकरी 2026 | Hero MotoCorp Recruitment 2026🔥Private Vacancy | ITI 10th/12th Pass Jobs",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["dmrc", "delhi metro", "metro"],
    videoId: "dSWQFQwSBXQ",
    videoUrl: "https://youtu.be/dSWQFQwSBXQ",
    title: "DMRC नई भर्ती 2026🚇Non-Executive पदों पर भर्ती | ITI, Diploma, B.Tech | पूरी जानकारी",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["oil india", "oil recruitment", "oil executive", "oil india limited"],
    videoId: "yLXb10KOm6c",
    videoUrl: "https://youtu.be/yLXb10KOm6c",
    title: "Oil India नई भर्ती 2026🚨Executive Vacancy | Oil India Recruitment 2026 | Full Details",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["nmdc", "national mineral"],
    videoId: "9P2WHJkSgJs",
    videoUrl: "https://youtu.be/9P2WHJkSgJs",
    title: "NMDC नई भर्ती 2026🔥ITI, Diploma Vacancy | बंपर सरकारी भर्ती का नोटिफिकेशन | Age Limit & Salary",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["lic", "life insurance", "apprentice"],
    videoId: "_xhQ_NeJh0Q",
    videoUrl: "https://youtu.be/_xhQ_NeJh0Q",
    title: "LIC Recruitment 2026🚀Freshers के लिए Job Update | Salary, Eligibility & Apply Online",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["ncl", "northern coalfields", "mts"],
    videoId: "vef7YrcAw4E",
    videoUrl: "https://youtu.be/vef7YrcAw4E",
    title: "NCL नई भर्ती 2026 | NCL MTS Recruitment 2026🚨10वीं पास MTS Vacancy | Apply Online",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["drdo", "defence research", "itr"],
    videoId: "vPtE6PtRjUE",
    videoUrl: "https://youtu.be/vPtE6PtRjUE",
    title: "DRDO Recruitment | DRDO ITR Vacancy 2026 | official recruitment DRDO | Apply Online",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["bhel", "bharat heavy electricals", "artisan"],
    videoId: "JdRoSYF1Oao",
    videoUrl: "https://youtu.be/JdRoSYF1Oao",
    title: "BHEL नई भर्ती 2026🚨Eligibility & Apply Details के लिए Job Update | Vacancy Era Education",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["nhai", "national highways", "internship"],
    videoId: "HWymphHCh5I",
    videoUrl: "https://youtu.be/HWymphHCh5I",
    title: "NHAI Internship 2026🔥1080 Opportunities | NHAI नई भर्ती 2026 | Apply Online",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  }
];

export function getJobVideo(job) {
  if (!job) return null;

  // 1. If job explicitly has a videoId
  if (job.videoId && job.videoId !== 'yLXb10KOm6c') {
    return {
      videoId: job.videoId,
      videoUrl: job.videoUrl || `https://youtu.be/${job.videoId}`,
      title: job.videoTitle || 'Vacancy Era Education Special Video Guide',
      channel: '@vacancyeraeducation'
    };
  }

  // 2. Check title & dept against registered videos
  const text = `${job.title || ''} ${job.dept || ''}`.toLowerCase();
  for (const item of VIDEO_REGISTRY) {
    if (item.keywords.some((k) => text.includes(k.toLowerCase()))) {
      return item;
    }
  }

  // 3. Fallback: clean search on user's own channel
  const cleanSearch = (job.title || '')
    .replace(/2026|Recruitment|Bharti|Online Form|\d+[\s,]*Posts|\d+[\s,]*Vacanc(y|ies)/gi, '')
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(' ');

  return {
    videoId: null,
    videoUrl: `https://www.youtube.com/@vacancyeraeducation/search?query=${encodeURIComponent(cleanSearch || job.title)}`,
    title: `${job.title} - Vacancy Era Education Official Video`,
    channel: '@vacancyeraeducation'
  };
}
