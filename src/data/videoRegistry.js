// Official Video Registry for Vacancy Era Education YouTube Channel (@vacancyeraeducation)

export const OFFICIAL_CHANNEL_URL = "https://www.youtube.com/@vacancyeraeducation";

export const VIDEO_REGISTRY = [
  {
    keywords: ["oil india", "oil recruitment", "oil executive", "oil india limited"],
    videoId: "yLXb10KOm6c",
    videoUrl: "https://youtu.be/yLXb10KOm6c",
    title: "Oil India नई भर्ती 2026🚨Executive Vacancy | Oil India Recruitment 2026 | Full Details",
    channel: "@vacancyeraeducation",
    duration: "Full Analysis"
  },
  {
    keywords: ["bhel", "artisan"],
    videoId: null,
    videoUrl: "https://www.youtube.com/@vacancyeraeducation/search?query=bhel+artisan",
    title: "BHEL Artisan Recruitment 2026 Special Guide",
    channel: "@vacancyeraeducation"
  },
  {
    keywords: ["rrb ntpc", "railway ntpc"],
    videoId: null,
    videoUrl: "https://www.youtube.com/@vacancyeraeducation/search?query=rrb+ntpc",
    title: "RRB NTPC Recruitment Analysis & Strategy",
    channel: "@vacancyeraeducation"
  }
];

export function getJobVideo(job) {
  if (!job) return null;

  // 1. If job explicitly has videoId
  if (job.videoId) {
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

  return null;
}
