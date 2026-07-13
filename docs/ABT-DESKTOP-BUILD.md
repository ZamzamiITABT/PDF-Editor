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

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `frontend/editor/src-tauri/target/release/ABT PDF Tools.exe` | 70,494,208 | `221493F99349A3C414B391FD6004AD4B17483EDA2A5E69324AA8E3E6E3200482` |
| `frontend/editor/src-tauri/target/release/bundle/nsis/ABT-PDF-Tools-Setup-1.0.0.exe` | 260,231,276 | `F06F1EE429BF1102C0C21ACB92F074EF7E4501C52DA4A53CDBAD29B23AE33A44` |

Both files are unsigned. The application version resource reports product/file description `ABT PDF Tools`, company `ABT Group`, and version `1.0.0`. The NSIS bootstrap reports product `ABT PDF Tools` and version `1.0.0`; Windows Apps & Features records publisher `ABT Group`. Interactive installation can display an unknown-publisher or SmartScreen warning until ABT code signing is configured.

## Verification gates

Run `task frontend:check`, the Tauri Rust tests, a production desktop build, and the installed lifecycle in `docs/ABT-INSTALLER-TESTING.md`. OCR remains disabled in the unchanged bundled backend and returns HTTP 403; it is a known functional limitation, not a branding failure.
