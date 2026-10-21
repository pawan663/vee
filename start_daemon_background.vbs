Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "c:\Users\Hp\Downloads\VEE_App"
WshShell.Run "node scraper/auto_sync_daemon.js", 0, False
