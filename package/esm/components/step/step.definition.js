import { DesignSystem } from "../design-system";
import { Step } from "./step";
import { styles } from "./step.styles";
import { template } from "./step.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-step>
 */
export const definition = Step.compose({
    name: `${DesignSystem.prefix}-step`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode,
    },
});
//# sourceMappingURL=step.definition.js.map