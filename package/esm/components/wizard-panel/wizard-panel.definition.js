import { DesignSystem } from "../design-system";
import { WizardPanel } from "./wizard-panel";
import { styles } from "./wizard-panel.styles";
import { template } from "./wizard-panel.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-wizard-panel>
 */
export const definition = WizardPanel.compose({
    name: `${DesignSystem.prefix}-wizard-panel`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode
    }
});
//# sourceMappingURL=wizard-panel.definition.js.map