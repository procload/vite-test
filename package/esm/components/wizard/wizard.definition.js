import { DesignSystem } from "../design-system";
import { Wizard } from "./wizard";
import { styles } from "./wizard.styles";
import { template } from "./wizard.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-wizard>
 */
export const definition = Wizard.compose({
    name: `${DesignSystem.prefix}-wizard`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode
    }
});
//# sourceMappingURL=wizard.definition.js.map