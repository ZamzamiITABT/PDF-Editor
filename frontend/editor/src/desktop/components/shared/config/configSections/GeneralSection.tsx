import React from "react";
import { Stack } from "@mantine/core";
import CoreGeneralSection from "@core/components/shared/config/configSections/GeneralSection";
import { DefaultAppSettings } from "@app/components/shared/config/configSections/DefaultAppSettings";

/** ABT updates are managed externally, so updater controls stay hidden. */
const GeneralSection: React.FC = () => (
  <Stack gap="lg">
    <DefaultAppSettings />
    <CoreGeneralSection hideUpdateSection />
  </Stack>
);

export default GeneralSection;
