# ABT desktop installer testing

Validated on Windows on 13 July 2026 using `ABT-PDF-Tools-Setup-1.0.0.exe`.

## Install and launch

```powershell
& 'frontend\editor\src-tauri\target\release\bundle\nsis\ABT-PDF-Tools-Setup-1.0.0.exe' /S
Start-Process "$env:LOCALAPPDATA\ABT PDF Tools\ABT PDF Tools.exe"
```

Silent installation returned exit code 0. Windows created:

- `%LOCALAPPDATA%\ABT PDF Tools\ABT PDF Tools.exe`
- `%APPDATA%\Microsoft\Windows\Start Menu\Programs\ABT PDF Tools.lnk`
- `%USERPROFILE%\Desktop\ABT PDF Tools.lnk`
- `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\ABT PDF Tools`

The Apps & Features record reported display name `ABT PDF Tools`, version `1.0.0`, publisher `ABT Group`, and install location `%LOCALAPPDATA%\ABT PDF Tools`. The visible window title was `ABT PDF Tools`.

## Backend and network evidence

The successful run used Tauri PID `10864`, Java PID `37824`, and random port `11226`. The actual child command was:

```text
"C:\Users\OmarZamzami\AppData\Local\ABT PDF Tools\runtime\jre\bin\java.exe" -Xmx2g -DBROWSER_OPEN=false -DSTIRLING_PDF_TAURI_MODE=true -Dlogging.file.path=C:\Users\OmarZamzami\AppData\Roaming\Stirling-PDF\logs -Dlogging.file.name=stirling-pdf.log -Dserver.port=0 -Dserver.address=127.0.0.1 "-Dui.appNameNavbar=ABT PDF Tools" -Dsystem.enableAnalytics=false -Dsystem.enablePosthog=false -Dsystem.enableScarf=false -Dsystem.showUpdate=false -Dserver.forward-headers-strategy=none -Dsecurity.enableLogin=false -Dsecurity.csrfDisabled=true -jar "C:\Users\OmarZamzami\AppData\Local\ABT PDF Tools\libs\stirling-pdf-2.14.1.jar"
```

Evidence commands:

```powershell
Get-CimInstance Win32_Process -Filter "Name='java.exe'" |
  Select-Object ProcessId, ParentProcessId, ExecutablePath, CommandLine
Get-NetTCPConnection -State Listen -OwningProcess 37824
Invoke-RestMethod http://127.0.0.1:11226/api/v1/config/app-config
```

Observed listener:

```text
LocalAddress LocalPort OwningProcess State
127.0.0.1        11226         37824 Listen
```

- Loopback config request: HTTP 200.
- Runtime config: `appNameNavbar=ABT PDF Tools`, `enableAnalytics=false`, `enablePosthog=false`, `enableScarf=false`, `shouldShowUpdate=false`.
- No `0.0.0.0`, `[::]`, or LAN-interface listener existed.
- TCP probe to Wi-Fi address `10.8.4.62:11226`: failed as required.
- Matching ABT Windows Firewall rules: 0. Isolation came from the bind address, not a firewall rule.

## Functional status

The loopback change and branding do not alter PDF endpoints. The unchanged installed bundle previously passed merge, split, compress, password protection, watermark, save, Arabic filenames, spaces, and OneDrive paths. OCR returns HTTP 403 (`This endpoint is disabled`) because the desktop bundle lacks/enforces disabled OCR dependencies; this remains a documented limitation and was not bypassed by weakening security.

## Close and uninstall

Normal close:

```powershell
(Get-Process -Id 10864).CloseMainWindow()
Get-Process -Id 10864,37824 -ErrorAction SilentlyContinue
```

`CloseMainWindow()` returned true. Both the Tauri and Java processes exited, and no listening socket remained.

Silent uninstall:

```powershell
& "$env:LOCALAPPDATA\ABT PDF Tools\uninstall.exe" /S
```

Uninstall returned exit code 0 and removed the installation directory, Start Menu shortcut, desktop shortcut, Apps & Features registry entry, processes, and services. `%APPDATA%\Stirling-PDF` remains as the existing upstream-compatible user-data directory; it contains settings/logs/pipeline data and is intentionally not deleted by the uninstaller.

## Runtime regression found during validation

The first branded package panicked before launch because a registered Tauri updater plugin cannot deserialize a missing configuration block. The final configuration retains a valid updater object with `endpoints: []`; update mode is also disabled. The rebuilt installer then completed the full lifecycle above without external updater access.

## Signing warning

The executable and installer have Authenticode status `NotSigned`. Interactive installs may show an unknown-publisher/SmartScreen warning. Do not distribute to employees until ABT signing and the official visual assets are supplied and validated.
