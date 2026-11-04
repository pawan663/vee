$node = "C:\Users\Hp\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$appDir = "c:\Users\Hp\Downloads\VEE_App"
Set-Location $appDir

Write-Host "=========================================="
Write-Host " VEE 24x7 Permanent Auto-Sync Runner"
Write-Host "=========================================="

# 1. Run Scraper
& $node "$appDir\scraper\live_crawler.js"

# 2. Check if git diff exists
$status = git status --porcelain public/live_data.json src/data/liveScrapedData.json
if ($status) {
    Write-Host "New updates detected! Committing and pushing to cloud..."
    git add public/live_data.json src/data/liveScrapedData.json
    $timestamp = (Get-Date).ToString("dd-MMM-yyyy HH:mm")
    git commit -m "🤖 VEE Auto-Sync: $timestamp - Live Recruitments"
    git push origin main
    Write-Host "✅ Successfully pushed fresh live data to cloud!"
} else {
    Write-Host "No changes to push."
}
