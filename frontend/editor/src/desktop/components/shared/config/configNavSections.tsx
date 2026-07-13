import { useConfigNavSections as useProprietaryConfigNavSections } from "@proprietary/components/shared/config/configNavSections";
import type { ConfigNavSection } from "@core/components/shared/config/configNavSections";

export type {
  ConfigNavSection,
  ConfigNavItem,
} from "@core/components/shared/config/configNavSections";

/** Only local preferences and preserved legal notices are relevant to ABT users. */
export const useConfigNavSections = (
  isAdmin: boolean = false,
  runningEE: boolean = false,
  loginEnabled: boolean = false,
  onRequestClose: () => void = () => {},
): ConfigNavSection[] => {
  const sections = useProprietaryConfigNavSections(
    isAdmin,
    runningEE,
    loginEnabled,
    onRequestClose,
  );
  const result: ConfigNavSection[] = [];

  if (sections.length > 0) result.push(sections[0]);
  const legalSection = sections.find((section) =>
    section.items.some((item) => item.key === "legal"),
  );
  if (legalSection) result.push(legalSection);

  return result;
};
