import { spawn } from 'child_process';
import path from 'path';

// Global Crash Prevention
process.on('uncaughtException', (err) => {
  console.error('[Daemon Protection] Uncaught Exception caught safely:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Daemon Protection] Unhandled Rejection caught safely:', reason);
});

console.log("==================================================");
console.log("🤖 VEE 24x7 CONTINUOUS AUTO-SYNC DAEMON RUNNING");
console.log("📡 Active Multi-Portal Live Stream (13+ Portals):");
console.log("   - FreeJobAlert (Homepage 3 Boxes: Jobs, Admit, Results + Table + Feed)");
console.log("   - SarkariResult.com & SarkariResult.com.cm");
console.log("   - RojgarResult.com");
console.log("   - Jagran Josh & Navbharat Times (NBT)");
console.log("   - Dainik Bhaskar & Amar Ujala & Live Hindustan");
console.log("   - Times of India & Google News");
console.log("   - RemoteOK (Remote Tech & Global Careers)");
console.log("   - WeWorkRemotely (Global Work-From-Home Roles)");
console.log("⏰ Continuous Adaptive Loop: Runs every 90 seconds non-stop!");
console.log("==================================================");

let isRunning = false;

function runCrawlerCycle() {
  if (isRunning) {
    console.log(`[${new Date().toLocaleTimeString()}] ⏳ Previous cycle still in progress, waiting...`);
    return;
  }
  isRunning = true;
  console.log(`\n[${new Date().toLocaleTimeString()}] 🔄 Starting continuous live crawler cycle...`);
  const crawlerScript = path.resolve('scraper/live_crawler.js');
  const child = spawn('node', [crawlerScript], { stdio: 'inherit' });

  child.on('close', (code) => {
    isRunning = false;
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Cycle complete (exit code ${code}). Next scan in 90 seconds...`);
    setTimeout(runCrawlerCycle, 90 * 1000);
  });

  child.on('error', (err) => {
    isRunning = false;
    console.error(`[${new Date().toLocaleTimeString()}] ⚠️ Crawler spawn error:`, err.message);
    setTimeout(runCrawlerCycle, 30 * 1000); // Quick retry in 30s
  });
}

// Start first cycle immediately
runCrawlerCycle();
