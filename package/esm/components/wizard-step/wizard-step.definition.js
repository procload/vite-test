import { DesignSystem } from "../design-system";
import { WizardStep } from "./wizard-step";
import { styles } from "./wizard-step.styles";
import { template } from "./wizard-step.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-wizard-step>
 */
export const definition = WizardStep.compose({
    name: `${DesignSystem.prefix}-wizard-step`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode
    }
});
//# sourceMappingURL=wizard-step.definition.js.map