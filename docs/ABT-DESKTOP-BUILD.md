# ABT desktop build

## Verified toolchain

Use the Milestone 1 verified JDK 25, Node 22, Rust/Cargo, Visual Studio Build Tools, and NSIS environment. The repository-local toolchains used on 13 July 2026 are under `.tools/`.

## Build commands

From `frontend/editor`, build the desktop frontend:

```powershell
& '..\..\.tools\node22\node-v22.23.1-win-x64\node.exe' `
  '..\node_modules\vite\bin\vite.js' build --mode desktop
```

Build the Tauri executable and NSIS bundle. The temporary config only suppresses a duplicate frontend build and updater artifact generation:

```powershell
$env:CARGO_HOME = (Resolve-Path '..\..\.tools\cargo').Path
$env:RUSTUP_HOME = (Resolve-Path '..\..\.tools\rustup').Path
$env:PATH = "$env:CARGO_HOME\bin;$(Resolve-Path '..\..\.tools\node22\node-v22.23.1-win-x64');$env:PATH"
& '..\..\.tools\node22\node-v22.23.1-win-x64\node.exe' `
  '..\node_modules\@tauri-apps\cli\tauri.js' build --bundles nsis `
  --config '..\..\.tools\tauri-nsis-config.json'
```

Copy the generated NSIS bundle to the required distribution filename:

```powershell
Copy-Item 'src-tauri\target\release\bundle\nsis\ABT PDF Tools_1.0.0_x64-setup.exe' `
  'src-tauri\target\release\bundle\nsis\ABT-PDF-Tools-Setup-1.0.0.exe'
```

## Verified artifacts

| Artifact                                                                             |       Bytes | SHA-256                                                            |
| ------------------------------------------------------------------------------------ | ----------: | ------------------------------------------------------------------ |
| `frontend/editor/src-tauri/target/release/ABT PDF Tools.exe`                         |  70,494,208 | `03535F23BAC4237A7DA88456A6392C678A9C167B5DD4225670E9B018024D5FFA` |
| `frontend/editor/src-tauri/target/release/bundle/nsis/ABT-PDF-Tools-Setup-1.0.0.exe` | 260,237,725 | `30AC385AC637502FA674079091D346CB397E921F133981CCADF299ABCBAC5575` |

Both files are unsigned. The application version resource reports product/file description `ABT PDF Tools`, company `ABT Group`, and version `1.0.0`. The NSIS bootstrap reports product `ABT PDF Tools` and version `1.0.0`; Windows Apps & Features records publisher `ABT Group`. Interactive installation can display an unknown-publisher or SmartScreen warning until ABT code signing is configured.

## Verification gates

Run `task frontend:check`, the Tauri Rust tests, a production desktop build, and the installed lifecycle in `docs/ABT-INSTALLER-TESTING.md`. OCR remains disabled in the unchanged bundled backend and returns HTTP 403; it is a known functional limitation, not a branding failure.
