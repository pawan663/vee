Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "c:\Users\Hp\Downloads\VEE_App"
WshShell.Run "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File ""c:\Users\Hp\Downloads\VEE_App\sync_and_push.ps1""", 0, False
