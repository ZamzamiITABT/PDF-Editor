# ABT PDF Tools pilot deployment

This plan prepares the existing NSIS build for a limited test-user pilot. It does not authorize employee-wide deployment, a GitHub release, an MSI, or a merge to `main`.

## Pilot release configuration

Use version `1.0.0` for the pilot. It already produces the required Windows version metadata and distribution filename without introducing prerelease-version ambiguity in Windows detection.

| Setting                   | Pilot value                     | Current source                                                                               |
| ------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| Product                   | `ABT PDF Tools`                 | `frontend/editor/src-tauri/tauri.conf.json`                                                  |
| Publisher                 | `ABT Group`                     | `frontend/editor/src-tauri/tauri.conf.json`                                                  |
| Version                   | `1.0.0`                         | `frontend/editor/src-tauri/tauri.conf.json`                                                  |
| Installer                 | `ABT-PDF-Tools-Setup-1.0.0.exe` | Post-build copy documented in `docs/ABT-DESKTOP-BUILD.md`                                    |
| Automatic updater         | Disabled; no endpoint           | `createUpdaterArtifacts=false`, `plugins.updater.endpoints=[]`, desktop update mode disabled |
| Cloud promotion and login | Hidden; desktop SaaS URLs blank | Desktop layer overrides and `frontend/editor/.env.desktop`                                   |
| Telemetry                 | Disabled                        | Backend JVM options disable analytics, PostHog, and Scarf                                    |
| Backend exposure          | Loopback only                   | `-Dserver.address=127.0.0.1` in the actual desktop Java launcher                             |

Do not alter authentication, CSRF, OCR, or the loopback argument as part of visual branding.

## Official asset handoff

No official file has been substituted yet. Supply original, approved artwork without screenshots, JPEG conversion, AI redraws, or flattened white backgrounds.

### Required starting files

| File to provide            | Format and dimensions                                                                                                                                                           | Current placeholder or target                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `abt-logo.svg`             | SVG with transparent canvas, tight `viewBox`, embedded or outlined fonts, no linked resources. Preserve the official aspect ratio; a 1024-unit-wide viewBox is preferred.       | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-logo.svg`                                                                     |
| `abt-logo-transparent.png` | Transparent PNG, sRGB, at least 1024 px on the longest edge. Do not add padding beyond the official clear-space rule.                                                           | No current file; reserved target: `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-logo-transparent.png`                       |
| `abt-app-icon-1024.png`    | Exactly 1024x1024 PNG, sRGB, square canvas, approved safe area and corner treatment. Transparency is allowed; do not pre-round the corners unless the ABT standard requires it. | Replaces the source represented by `frontend/editor/src-tauri/icons/abt-placeholder/icon.png`; Tauri regenerates all derived sizes from it. |
| `abt-app-icon.ico`         | Windows ICO containing 16, 24, 32, 48, 64, 128, and 256 px images at 32-bit color with alpha.                                                                                   | `frontend/editor/src-tauri/icons/abt-placeholder/icon.ico`; currently used for both application and installer icon.                         |

### Required theme variants

Provide approved exports for the following, or provide written approval and exact color values allowing them to be derived from the master vector:

| Official export          | Format and dimensions                                                                               | Current path                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `abt-wordmark-black.svg` | SVG, transparent, same aspect ratio/viewBox as the other wordmarks; approved for light backgrounds. | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-wordmark-black.svg`                                                                |
| `abt-wordmark-grey.svg`  | SVG, transparent, same geometry; approved muted treatment for light backgrounds.                    | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-wordmark-grey.svg`                                                                 |
| `abt-wordmark-white.svg` | SVG, transparent, same geometry; approved for dark backgrounds.                                     | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-wordmark-white.svg`                                                                |
| `abt-mark-light.svg`     | No-text logo mark SVG for light backgrounds, square viewBox preferred.                              | No official file yet. The desktop hook currently maps light mode to the existing `abt-logo.svg` placeholder instead of the core legacy filename. |
| `abt-mark-dark.svg`      | No-text logo mark SVG for dark backgrounds, square viewBox preferred.                               | No official file yet. The desktop hook currently maps dark mode to the existing `abt-logo.svg` placeholder instead of the core legacy filename.  |

Until the official no-text variants arrive, the desktop-specific `useLogoPath` override deliberately uses the existing neutral `abt-logo.svg` placeholder in both themes. This prevents broken images in mobile/narrow layouts without inventing or recoloring a mark.

The external intake directory is `C:\Users\OmarZamzami\Documents\Codex\PDF Project\Branding`. It remains empty until real artwork is supplied; empty files or copied placeholders must not be mistaken for approved assets.

### Loading and installer artwork

- There is no separate branded splash asset today. `frontend/editor/src/core/components/shared/LoadingFallback.tsx` displays theme-aware `Loading...` text. If ABT requires loading artwork, provide `abt-loading.svg` with a square 512x512 viewBox and transparent background, plus an optional 1024x1024 transparent PNG fallback. It will be added through a desktop override only after approval.
- NSIS currently uses the app ICO but no custom header or sidebar bitmap. Optional official installer artwork must be uncompressed Windows BMP: `150x57` for a header and `164x314` for the welcome/finish sidebar. Proposed future paths are `frontend/editor/src-tauri/windows/nsis/abt-header.bmp` and `frontend/editor/src-tauri/windows/nsis/abt-sidebar.bmp`.
- Do not use the transparent logo PNG as the application icon unless Brand approves the square icon treatment.

## Visual-review checklist

- [ ] Window title is exactly `ABT PDF Tools` in normal, maximized, and task-switcher views.
- [ ] Navbar/sidebar wordmark is sharp and correctly spaced in light, dark, compact, and narrow-window layouts.
- [ ] Home page shows the correct wordmark and no-text mark without missing assets, stretching, clipping, or upstream branding.
- [ ] Loading state is approved; no splash artwork is added unless the supplied asset is approved.
- [ ] Executable, taskbar, Alt+Tab, file association, 16 px, 32 px, and high-DPI icons remain legible.
- [ ] Favicon and manifest/touch icon use the official icon and have no stale cache/upstream mark.
- [ ] NSIS welcome, progress, and finish pages show the correct product/publisher/icon and no distorted optional artwork.
- [ ] Start Menu and desktop shortcuts use the official icon and exact `ABT PDF Tools` name.
- [ ] Apps & Features shows `ABT PDF Tools`, `ABT Group`, and `1.0.0`.
- [ ] About/legal page retains upstream legal and third-party notices while showing the approved ABT product presentation.
- [ ] Review at Windows display scaling 100%, 150%, and 200%, and in both application color schemes.

## Pilot prerequisites and capacity

- Architecture: Windows x64 only for the current artifact.
- Preferred pilot platform: ABT-managed Windows 11 x64 on a Microsoft-supported release with current cumulative updates.
- Conditional platform: Windows 10 22H2 x64 only if ABT IT explicitly permits it under organizational support policy. Microsoft states that Edge/WebView2 updates continue on Windows 10 22H2 until at least October 2028, but this does not replace the operating-system security/support decision.
- Microsoft Edge WebView2 Evergreen Runtime is required. The NSIS installer is configured to download its bootstrapper if WebView2 is absent, so offline pilot devices must have WebView2 pre-provisioned.
- Installer size: approximately 248 MiB (`260,231,276` bytes).
- Raw bundled executable/JAR/JRE payload: approximately 296 MiB before installation overhead.
- Require at least 1 GiB free for installation and extraction. PDF processing also requires separate working space appropriate to the test documents; do not test with production-sensitive PDFs.

Microsoft references: [WebView2 supported operating systems](https://learn.microsoft.com/en-us/microsoft-edge/webview2/) and [Windows 11 lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/windows-11-home-and-pro).

## Manual installation

1. Confirm the installer SHA-256 against the approved pilot record.
2. Close any existing ABT PDF Tools process.
3. Run `ABT-PDF-Tools-Setup-1.0.0.exe` as the intended test user.
4. Expect an unsigned-publisher/SmartScreen warning until ABT code signing is available. Verify the hash and source; do not tell users to disable SmartScreen or security controls.
5. Launch `ABT PDF Tools` and complete the visual and functional feedback checklist.

Silent installation, verified with exit code 0:

```text
ABT-PDF-Tools-Setup-1.0.0.exe /S
```

## Uninstall

Interactive uninstall is available from Windows Apps & Features. Silent uninstall, verified with exit code 0:

```text
"%LOCALAPPDATA%\ABT PDF Tools\uninstall.exe" /S
```

The uninstaller removes the application, shortcuts, and HKCU uninstall record. Existing `%APPDATA%\Stirling-PDF` compatibility/user data is retained. Remove that data only through a separately approved support procedure.

## NSIS and Intune preparation

The generated NSIS script confirms:

- `/S` silent installation is supported and was runtime-tested.
- `uninstall.exe /S` silent uninstall is supported and was runtime-tested.
- Install mode is `currentUser`, with `RequestExecutionLevel user`.
- Install location is `%LOCALAPPDATA%\ABT PDF Tools`.
- Uninstall metadata is under HKCU, not HKLM.
- This package is not suitable for System-context deployment without first producing and validating a deliberate per-machine configuration.

Recommended Intune Win32 app settings:

| Setting               | Recommendation                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Install behavior      | **User** context                                                                                           |
| Install command       | `ABT-PDF-Tools-Setup-1.0.0.exe /S`                                                                         |
| Uninstall command     | `cmd.exe /c ""%LOCALAPPDATA%\ABT PDF Tools\uninstall.exe" /S"`                                             |
| Detection type        | Registry, evaluated in the installing user's context                                                       |
| Key path              | `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Uninstall\ABT PDF Tools`                      |
| Detection value       | `DisplayVersion` string equals `1.0.0`                                                                     |
| Additional validation | `DisplayName` equals `ABT PDF Tools`; optional file check `%LOCALAPPDATA%\ABT PDF Tools\ABT PDF Tools.exe` |
| Architecture          | 64-bit application                                                                                         |

Return-code handling:

- `0`: success; verified for install and uninstall.
- Treat any other NSIS exit code as failure unless reproduced and documented during packaging validation.
- If an Intune wrapper later emits standard Windows codes, map `3010` to soft reboot, `1641` to hard reboot, and `1618` to retry. The current verified NSIS flow did not emit or require those codes.

Do not use an HKLM detection rule for this build. Do not deploy in System context: `%LOCALAPPDATA%` and HKCU would resolve to the management agent account rather than the intended employee.

## Known limitations and blockers

- Official ABT artwork is deferred to a separate visual milestone. The existing clearly identified placeholders are accepted for pilot preparation.
- The official no-text light/dark marks remain pending; narrow layouts intentionally use the neutral placeholder in both themes.
- Artifacts are unsigned, so SmartScreen/unknown-publisher prompts remain.
- OCR returns HTTP 403 because the endpoint is disabled in the unchanged desktop bundle. Do not enable it by weakening security.
- The package is per-user. A separate configuration/build/validation cycle is required before a per-machine or MSI deployment.
- WebView2 must already be installed on offline devices.
- Pilot approval, final artifact hash, test-user list, support owner, rollback owner, and data-handling rules remain to be assigned.

## Test-user feedback checklist

- [ ] Installation completed and shortcuts appeared under the correct user.
- [ ] SmartScreen behavior and any security prompt were recorded verbatim.
- [ ] Window, navbar, home, loading state, and icons looked correct at the user's display scaling.
- [ ] Merge, split, compress, password protection, watermark, save, Arabic filenames, spaces, and OneDrive paths behaved as expected.
- [ ] OCR limitation was understandable and did not suggest weakening security.
- [ ] No cloud/login/update promotion appeared and no unexpected external request was observed.
- [ ] App close removed the ABT and bundled Java processes.
- [ ] Uninstall completed and shortcuts/Apps & Features entry disappeared.
- [ ] Any retained user data, crash logs, performance issue, or confusing copy was recorded.
- [ ] User supplied Windows version, device model, display scaling, input file sizes, reproduction steps, and screenshots without sensitive documents.
