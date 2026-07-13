# ABT Desktop Installer Testing

This document records the repeatable Windows validation used before ABT branding. Paths and product names still show the unchanged upstream branding.

## Build

Run from `frontend/editor` with the repository's verified Node 22, Rust, Java 25, and Visual Studio environment:

```powershell
npx.cmd tauri build --bundles nsis --config .tools/tauri-nsis-config.json
```

The temporary config disables only the duplicate frontend `beforeBuildCommand`; the already-built production frontend, bundled JAR, JRE, Rust application, and NSIS bundle remain unchanged.

## Install and launch

```powershell
& 'frontend\editor\src-tauri\target\release\bundle\nsis\Stirling PDF_2.14.1_x64-setup.exe' /S
Start-Process "$env:LOCALAPPDATA\Stirling PDF\Stirling-PDF.exe"
```

The installer and executable are unsigned. Windows can display an unknown-publisher/SmartScreen warning for an interactive installation.

## Process and bind-address verification

Find the Tauri and child Java process:

```powershell
Get-CimInstance Win32_Process |
  Where-Object { $_.Name -in 'Stirling-PDF.exe','java.exe' } |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine
```

The Java command must contain:

```text
-Dserver.port=0 -Dserver.address=127.0.0.1
```

Record listeners using both Windows views:

```powershell
Get-NetTCPConnection -State Listen -OwningProcess <JAVA_PID>
netstat -ano | Select-String '<JAVA_PID>|:<RANDOM_PORT>'
```

Pass criteria:

- Listener is `127.0.0.1:<RANDOM_PORT>`.
- No listener is `0.0.0.0:<RANDOM_PORT>`.
- No listener uses the machine's LAN address.
- A TCP connection to `<LAN_IP>:<RANDOM_PORT>` fails.
- Firewall behavior is recorded; loopback isolation must not depend on a firewall allow/deny rule.

Validated result on 13 July 2026:

```text
Tauri PID: 42404
Java PID: 17920
TCP 127.0.0.1:13907 0.0.0.0:0 LISTENING 17920
LAN probe 172.29.176.1:13907: False
Matching Windows Firewall application filters: 0
```

## Functional test requests

All calls use the random loopback URL discovered above. Use disposable PDFs without sensitive data.

```powershell
curl.exe --fail-with-body --output merged.pdf `
  --form 'fileInput=@first.pdf;type=application/pdf' `
  --form 'fileInput=@second.pdf;type=application/pdf' `
  --form 'sortType=orderProvided' --form 'removeCertSign=false' `
  --form 'generateToc=false' `
  http://127.0.0.1:<PORT>/api/v1/general/merge-pdfs

curl.exe --fail-with-body --output split.zip `
  --form 'fileInput=@merged.pdf;type=application/pdf' `
  --form 'pageNumbers=1' `
  http://127.0.0.1:<PORT>/api/v1/general/split-pages

curl.exe --fail-with-body --output compressed.pdf `
  --form 'fileInput=@Name With Spaces.pdf;type=application/pdf' `
  --form 'optimizeLevel=2' --form 'grayscale=false' `
  --form 'lineArt=false' --form 'linearize=false' `
  http://127.0.0.1:<PORT>/api/v1/misc/compress-pdf

curl.exe --fail-with-body --output protected.pdf `
  --form 'fileInput=@ملف عربي.pdf;type=application/pdf' `
  --form 'password=<TEST_PASSWORD>' --form 'ownerPassword=<TEST_OWNER_PASSWORD>' `
  --form 'keyLength=256' `
  http://127.0.0.1:<PORT>/api/v1/security/add-password

curl.exe --fail-with-body --output watermarked.pdf `
  --form 'fileInput=@Name With Spaces.pdf;type=application/pdf' `
  --form 'watermarkType=text' --form 'watermarkText=ABT TEST' `
  --form 'fontSize=12' --form 'rotation=0' --form 'opacity=0.5' `
  --form 'widthSpacer=50' --form 'heightSpacer=50' `
  --form 'alphabet=roman' --form 'customColor=#d3d3d3' `
  --form 'convertPDFToImage=false' `
  http://127.0.0.1:<PORT>/api/v1/security/add-watermark
```

Repeat a processing request with input and output under the actual OneDrive directory. Confirm the result exists and has a `%PDF-` header. The 13 July run passed spaces, Arabic filenames, OneDrive input/output, and save behavior. OCR was attempted and returned HTTP 403 with `This endpoint is disabled`; it is not a passing feature in the unchanged desktop bundle.

## Close behavior

Close the visible app normally, then confirm the Tauri and Java PIDs are gone:

```powershell
(Get-Process -Id <TAURI_PID>).CloseMainWindow()
Get-Process -Id <TAURI_PID>,<JAVA_PID> -ErrorAction SilentlyContinue
netstat -ano | Select-String ':<RANDOM_PORT>'
```

`TIME_WAIT` entries are normal. A `LISTENING` entry or surviving bundled Java process is a failure.

## Silent uninstall and leftovers

```powershell
& "$env:LOCALAPPDATA\Stirling PDF\uninstall.exe" /S
```

Verify:

```powershell
Test-Path "$env:LOCALAPPDATA\Stirling PDF"
Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*' |
  Where-Object DisplayName -Like '*Stirling*'
Get-Service | Where-Object { $_.Name -Match 'Stirling' -or $_.DisplayName -Match 'Stirling' }
```

The validated uninstall returned exit code 0, removed the install directory and registry entry, and left no process or service. It retained `%APPDATA%\Stirling-PDF\{configs,customFiles,logs,pipeline}`. Treat those as user data and decide separately whether an ABT uninstaller should offer an explicit data-removal option.
