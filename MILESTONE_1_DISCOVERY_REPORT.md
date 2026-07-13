# Milestone 1 Discovery Report

Date: 13 July 2026

Branch: `codex/abt-desktop-branding`

Verified upstream base: `c500c2fae7a9c1252e0ac0fef6d91c50edf6aeff`

## Executive summary

The unchanged-brand Stirling PDF desktop application builds and its Rust test suite passes on Windows. The first installed baseline build exposed its randomly assigned backend port on every IPv4 and IPv6 interface. The desktop launcher was therefore changed to pass `-Dserver.address=127.0.0.1` to Java before any branding work.

The rebuilt installer was installed, launched, functionally tested, closed, and silently uninstalled. Its Java backend listened only on `127.0.0.1`; the machine's LAN address rejected the same port. Merge, split, compress, password protection, password removal, watermark, Arabic filenames, spaces, OneDrive input/output, and output saving passed. OCR returned HTTP 403 because the unchanged desktop bundle disables that endpoint.

No branding has started. Existing legal and third-party notice files remain unchanged.

## Git safety

- `origin`: `https://github.com/ZamzamiITABT/PDF-Editor.git`
- `upstream`: `https://github.com/Stirling-Tools/stirling-pdf.git`
- `origin/main` contains the full upstream ancestry.
- The development branch was created from upstream commit `c500c2fae`.
- No root-history replacement, force push, or branding change was made.
- `.tools/` is excluded only in this clone through `.git/info/exclude`.
- `.agents/` remains untracked and is not part of the work.

## Verified toolchain

| Tool | Exact version |
| --- | --- |
| Node.js | 22.23.1 |
| npm | 10.9.8 |
| Go Task | 3.46.4 |
| Rust | 1.97.0 stable, MSVC host |
| Cargo | 1.97.0 |
| Java/Javac/JLink | Temurin 25.0.3+9 LTS |
| Visual Studio Build Tools | 18.7.11925.98 |
| Windows SDK | 10.0.26100.0 |

## Build and test results

| Purpose | Command | Result |
| --- | --- | --- |
| Discover commands | `task --list` | Passed |
| Desktop Rust tests | `task desktop:test` | Passed: 9 tests across targets, 0 failures |
| Unbundled release app | `task desktop:build:dev` | Passed |
| Supported Windows wrapper | `task desktop:build:dev:windows` | Repeated frontend post-processing hung before Tauri bundling |
| NSIS build | `npx.cmd tauri build --bundles nsis --config .tools/tauri-nsis-config.json` | Passed; temporary config disables only the duplicate `beforeBuildCommand` |

The regression test `desktop_backend_binds_to_ipv4_loopback` verifies the actual fixed JVM option list contains `-Dserver.address=127.0.0.1`.

## Security fix

Exact launcher file:

`frontend/editor/src-tauri/src/commands/backend.rs`

The final installed Java command was:

```text
"C:\Users\OmarZamzami\AppData\Local\Stirling PDF\runtime\jre\bin\java.exe" -Xmx2g -DBROWSER_OPEN=false -DSTIRLING_PDF_TAURI_MODE=true -Dlogging.file.path=C:\Users\OmarZamzami\AppData\Roaming\Stirling-PDF\logs -Dlogging.file.name=stirling-pdf.log -Dserver.port=0 -Dserver.address=127.0.0.1 -Dserver.forward-headers-strategy=none -Dsecurity.enableLogin=false -Dsecurity.csrfDisabled=true -jar "C:\Users\OmarZamzami\AppData\Local\Stirling PDF\libs\stirling-pdf-2.14.1.jar"
```

No authentication, CSRF, or unrelated backend setting was changed.

## Loopback validation evidence

Baseline installation before the fix:

- Tauri PID: `26980`
- Java PID: `39028`
- Listener: `0.0.0.0:55823`
- Listener: `[::]:55823`
- Result: failed; the build was immediately closed and uninstalled without sending PDFs.

Rebuilt installation after the fix:

- Tauri PID: `42404`
- Java PID: `17920`
- Random backend port: `13907`
- `netstat -ano`: `TCP 127.0.0.1:13907 0.0.0.0:0 LISTENING 17920`
- No `0.0.0.0:13907` listener.
- No `[::]:13907` listener.
- TCP connection to local LAN interface `172.29.176.1:13907`: `False`.
- Matching Windows Firewall application filters: `0`; isolation was provided by the bind address, not a firewall exception.

No second physical network device was available for a direct remote-device probe. Binding exclusively to IPv4 loopback and rejection on the host's LAN interface establish that the port is not reachable through that LAN address.

## Installed runtime operation results

All requests targeted the installed Java process at `http://127.0.0.1:13907`.

| Test | Input/path coverage | Result |
| --- | --- | --- |
| Merge | `Name With Spaces.pdf` + `ملف عربي.pdf` | HTTP 200; valid PDF header; 2,144 bytes |
| Split | Two-page merged result, page selector `1` | HTTP 200; ZIP with `merged_1.pdf` and `merged_2.pdf` |
| Compress | Filename containing spaces | HTTP 200; valid PDF header; 1,117 bytes |
| Password protection | Arabic filename, AES-256 request | HTTP 200; valid PDF header; 1,714 bytes |
| Password verification | Removed with the supplied user password | HTTP 200; 1,117-byte PDF output |
| Watermark | Text watermark `ABT TEST` | HTTP 200; valid PDF header; 3,400 bytes |
| OCR | English, skip-text, hOCR | HTTP 403: `This endpoint is disabled` |
| OneDrive and save | `OneDrive - ABT Group\ABT PDF Tools Runtime Test\OneDrive Test File.pdf` | HTTP 200; result saved back to OneDrive; 1,117 bytes |

The browser automation connection was unavailable because Windows denied access to the profile path used by that testing bridge. Runtime tests therefore used the installed application's production HTTP API directly, not a development backend or mock.

## Close and uninstall

- Normal window close used `CloseMainWindow()` and returned `True`.
- Tauri PID `42404` exited.
- Java PID `17920` exited.
- No listening socket remained; only normal TCP `TIME_WAIT` entries were visible.
- Silent uninstall command: `"%LOCALAPPDATA%\Stirling PDF\uninstall.exe" /S`
- Uninstall exit code: `0`.
- Install directory removed: yes.
- Apps & Features/uninstall registry entry removed: yes.
- Remaining Stirling processes: none.
- Installed Windows service: none.
- `%APPDATA%\Stirling-PDF` remained with `configs`, `customFiles`, `logs`, and `pipeline` user-data folders.

## Rebuilt artifacts

### Desktop executable

- Path: `frontend/editor/src-tauri/target/release/Stirling-PDF.exe`
- Size: `64,085,504` bytes
- SHA-256: `924B6EFA023B2498BD6C53D97E65DB59D8FAF5CB5036C4B93A056BB7DFEBAE9A`
- Authenticode: unsigned

### NSIS installer

- Path: `frontend/editor/src-tauri/target/release/bundle/nsis/Stirling PDF_2.14.1_x64-setup.exe`
- Size: `253,768,436` bytes
- SHA-256: `3F11656CA95A4772608F9EE296EC39B7A670E4022712DB5B72BFDA0C32060114`
- Authenticode: unsigned; Windows can show an unknown-publisher warning

## Desktop architecture and remaining Milestone 2 work

- Framework: Tauri 2 with React/TypeScript and Rust; do not replace it or add Electron.
- Backend: bundled Spring Boot JAR launched by the Tauri Rust process.
- Runtime: bundled JLink Java runtime.
- Port: OS-assigned with `-Dserver.port=0`, now explicitly bound to `127.0.0.1`.
- The upstream updater and cloud/SaaS endpoints still require configuration review before an ABT local-only build can be claimed.
- OCR availability must be decided for the ABT bundle because the unchanged package disables its endpoint.
- The supported Task Windows wrapper's duplicate frontend post-processing hang remains a build-workflow issue.
- Preserve all upstream legal, copyright, and third-party notice files while implementing supported branding overrides.

Branding may begin only after this focused security commit is reviewed and pushed. Official ABT logo/icon assets are still pending, so placeholders must document their required paths and dimensions.
