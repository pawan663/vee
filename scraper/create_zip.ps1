[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem') | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression') | Out-Null

$sourceDir = "C:\Users\Hp\Downloads\NETLIFY_UPLOAD_VEE"
$zipPath = "C:\Users\Hp\Downloads\vee_app_deploy.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$mode = [System.IO.Compression.ZipArchiveMode]::Create
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, $mode)

Get-ChildItem -Path $sourceDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($sourceDir.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel)
}

$zip.Dispose()
Write-Host "Zip created successfully at $zipPath"
