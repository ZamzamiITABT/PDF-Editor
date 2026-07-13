import { useMemo } from "react";
import { useLogoAssets } from "@app/hooks/useLogoAssets";

/** Use the existing neutral placeholder mark until official light/dark ABT marks arrive. */
export function useLogoPath(): { dark: string; light: string } {
  const { folderPath } = useLogoAssets();

  return useMemo(() => {
    const placeholderMark = `${folderPath}/abt-logo.svg`;
    return {
      dark: placeholderMark,
      light: placeholderMark,
    };
  }, [folderPath]);
}
