import { useMemo } from "react";
import { BASE_PATH } from "@app/constants/app";

/** Desktop-only ABT placeholder assets. Replace through the documented paths. */
export function useLogoAssets() {
  return useMemo(() => {
    const folder = "abt-placeholder";
    const folderPath = `${BASE_PATH}/${folder}`;

    return {
      logoVariant: "modern" as const,
      folder,
      folderPath,
      getAssetPath: (name: string) => `${folderPath}/${name}`,
      wordmark: {
        black: `${folderPath}/abt-wordmark-black.svg`,
        grey: `${folderPath}/abt-wordmark-grey.svg`,
        white: `${folderPath}/abt-wordmark-white.svg`,
      },
      tooltipLogo: `${folderPath}/abt-logo.svg`,
      firstPage: `${folderPath}/abt-logo.svg`,
      favicon: `${folderPath}/icon.ico`,
      logo192: `${folderPath}/icon.png`,
      logo512: `${folderPath}/icon.png`,
      manifestHref: `${BASE_PATH}/manifest-abt.json`,
    };
  }, []);
}
