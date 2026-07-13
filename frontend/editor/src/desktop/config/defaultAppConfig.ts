import { AppConfig } from "@app/contexts/AppConfigContext";

/**
 * Default configuration used while the bundled backend starts up.
 */
export const DESKTOP_DEFAULT_APP_CONFIG: AppConfig = {
  appNameNavbar: "ABT PDF Tools",
  enableLogin: false,
  enableAnalytics: false,
  enablePosthog: false,
  enableScarf: false,
  shouldShowUpdate: false,
  premiumEnabled: false,
  runningProOrHigher: false,
};
