import { memo } from "react";
import CoreToolButton from "@core/components/tools/toolPicker/ToolButton";

/** Preserve the core unavailable state instead of advertising cloud execution. */
export default memo(CoreToolButton);
