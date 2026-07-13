# ABT PDF Tools production readiness

This checklist tracks the work between the validated pilot package and a production deployment. Placeholder artwork remains accepted until a separate official visual-branding milestone.

## Completed controls

- Product metadata is `ABT PDF Tools`, publisher `ABT Group`, version `1.0.0`.
- The bundled Java backend uses an OS-assigned port and binds only to `127.0.0.1`.
- Telemetry, external update checks, cloud promotion, and external login prompts are disabled or hidden for the local desktop flavor.
- NSIS install scope is explicitly pinned to `currentUser`.
- Silent install and uninstall returned exit code 0 during installed-package validation.
- Start Menu, desktop shortcut, Apps & Features, normal close, background-process cleanup, and uninstall behavior passed.
- Narrow/mobile layouts use an existing placeholder mark rather than nonexistent legacy asset paths.
- Upstream legal and third-party notices remain intact.

## Required before a controlled pilot

- [x] Rebuild after the production-polish changes and record new artifact sizes and SHA-256 hashes.
- [x] Install, launch, close, and uninstall the rebuilt package locally. Repeat on a clean pilot device or VM before deployment.
- [x] Reconfirm the Java listener is `127.0.0.1` only and the LAN-address probe fails.
- [ ] Confirm Microsoft Edge WebView2 Evergreen Runtime is pre-provisioned on offline devices.
- [ ] Assign pilot users, support owner, rollback owner, feedback channel, and test-data handling rules.
- [ ] Approve the placeholder visual treatment for pilot use.

## Required before production distribution

- [ ] Sign the executable and installer with the approved ABT code-signing certificate and timestamp service.
- [ ] Validate SmartScreen/reputation behavior on the signed artifact.
- [ ] Perform the separate official-artwork visual pass at 100%, 150%, and 200% scaling in light, dark, and narrow layouts.
- [ ] Decide whether production deployment remains per-user or requires a separately built and validated per-machine package.
- [ ] Package and test the selected Intune deployment in the matching User or System context.
- [ ] Define upgrade, rollback, retention, and support-log procedures.
- [ ] Obtain release approval without bypassing the branch review and merge process.

## Known limitations

- OCR returns HTTP 403 because its endpoint is disabled in the unchanged desktop bundle. Do not enable it by weakening security.
- Artifacts remain unsigned until ABT code signing is configured.
- `%APPDATA%\Stirling-PDF` compatibility/user data is retained by uninstall.
- The current installer is x64 and per-user; it is not an MSI or per-machine package.
- Official ABT artwork is not part of this milestone.

Do not merge to `main`, publish a release, or deploy broadly until the applicable gates above are complete.

## Latest local validation

The production-polish rebuild was validated on 13 July 2026:

- Tauri PID `26460`; Java PID `32048`.
- Listener `127.0.0.1:22210` only.
- TCP probe to Wi-Fi address `10.8.4.62:22210`: not reachable.
- Normal close removed both processes.
- Silent uninstall returned 0 and removed the install directory, Start Menu entry, desktop shortcut, and HKCU uninstall entry.
- Executable: 70,494,208 bytes, SHA-256 `03535F23BAC4237A7DA88456A6392C678A9C167B5DD4225670E9B018024D5FFA`.
- Installer: 260,237,725 bytes, SHA-256 `30AC385AC637502FA674079091D346CB397E921F133981CCADF299ABCBAC5575`.
- Both artifacts remain unsigned.
