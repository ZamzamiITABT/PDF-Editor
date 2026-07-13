# ABT desktop branding

The desktop flavor is branded as **ABT PDF Tools**, published by **ABT Group**, at version **1.0.0**. The web/core flavor keeps its upstream defaults.

## Supported override points

- `frontend/editor/src-tauri/tauri.conf.json`: product, binary, window, bundle, publisher, version, identifier, and installer icon metadata.
- `frontend/editor/.env.desktop`: desktop-only HTML title, description, favicon, touch icon, manifest, and blank external SaaS URLs.
- `frontend/editor/src/desktop/hooks/useLogoAssets.ts`: desktop logo/wordmark selection through the existing layer override system.
- `frontend/editor/src-tauri/src/commands/backend.rs`: runtime navbar name and local-only analytics/update defaults. The existing `-Dserver.address=127.0.0.1` option is unchanged.
- Desktop shadow components hide cloud badges, account prompts, cloud-only tool promotion, and update UI without redesigning core components.

Legal resources, upstream copyright notices, licenses, and third-party notices are unchanged. Internal compatibility paths such as `%APPDATA%\Stirling-PDF` and the `stirlingpdf` deep-link scheme remain intentionally stable.

## Placeholder assets

The checked-in artwork is visibly marked as placeholder artwork. Replace it only when official ABT files are supplied.

| Asset | Required format | Required path |
| --- | --- | --- |
| Primary logo | SVG, outlined/embedded fonts, tight `viewBox`, no linked resources | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-logo.svg` |
| Wordmarks | SVG, transparent canvas, black/grey/white variants | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-wordmark-{black,grey,white}.svg` |
| Transparent logo | PNG with alpha; minimum 512 px wide, 1024 px preferred | `frontend/editor/src/desktop/assets/brand/abt-placeholder/abt-logo-transparent.png` |
| App icon source | PNG, exactly 1024x1024, square, with safe padding | `frontend/editor/src-tauri/icons/abt-placeholder/icon.png` |
| Windows application icon | ICO containing 16, 24, 32, 48, 64, 128, 256 px images | `frontend/editor/src-tauri/icons/abt-placeholder/icon.ico` |
| Installer icon | Multi-resolution ICO; currently the same generated ICO | `frontend/editor/src-tauri/icons/abt-placeholder/icon.ico` |

After receiving the official 1024x1024 icon, regenerate the platform set from `frontend/editor`:

```powershell
npx.cmd tauri icon <OFFICIAL-1024-PNG> --output src-tauri/icons/abt-placeholder
```

The directory name stays `abt-placeholder` until the final visual pass so unofficial artwork cannot be mistaken for approved brand material.

## Local-only policy

- Updater mode defaults to disabled and its Tauri endpoint list is empty.
- Desktop SaaS URLs are blank.
- Login/onboarding prompts, cloud links/badges, and cloud-only tool promotion are not rendered.
- Backend analytics, PostHog, Scarf, and update display are disabled by JVM properties.
- The bundled backend listens on `127.0.0.1` only. These branding changes must never remove that argument.
