import { DesignSystem } from "../../design-system";
import { SvgIcon } from "./svg-icon";
import { styles } from "./svg-icon.styles";
import { template } from "./svg-icon.template";
export const SvgIconDefinition = SvgIcon.compose({
    name: `${DesignSystem.prefix}-svg-icon`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode,
    },
});
//# sourceMappingURL=svg-icon.definition.js.map