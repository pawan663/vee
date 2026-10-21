import { initialJobs } from '../src/data/initialJobs.js';
import fs from 'fs';

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: 'ERROR', error: err.message };
  }
}

async function runAudit() {
  console.log("🔍 AUDITING APP JOB URLS...");
  const jobUrls = initialJobs.map(j => ({ id: j.id, title: j.title, applyUrl: j.applyUrl }));

  for (const j of jobUrls.slice(0, 10)) {
    const res = await checkUrl(j.applyUrl);
    console.log(`[${res.status}] ${j.title.substring(0, 35)}... -> ${j.applyUrl}`);
  }

  // Audit News URLs
  console.log("\n📰 AUDITING LIVE NEWS ITEMS...");
  try {
    const scraped = JSON.parse(fs.readFileSync('src/data/liveScrapedData.json', 'utf-8'));
    for (const n of scraped.news.slice(0, 8)) {
      const res = await checkUrl(n.url);
      console.log(`[${res.status}] [${n.source}] ${n.title.substring(0, 30)}... -> ${n.url}`);
    }
  } catch (e) {
    console.log("Could not check news:", e.message);
  }
}

runAudit();
