import { DesignSystem } from "../design-system";
import { Stepper } from "./stepper";
import { styles } from "./stepper.styles";
import { template } from "./stepper.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-step>
 */
export const definition = Stepper.compose({
    name: `${DesignSystem.prefix}-stepper`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode,
    },
});
//# sourceMappingURL=stepper.definition.js.map