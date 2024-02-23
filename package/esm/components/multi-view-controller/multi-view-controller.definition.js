import { DesignSystem } from "../design-system";
import { MultiViewController } from "./multi-view-controller";
import { styles } from "./multi-view-controller.styles";
import { template } from "./multi-view-controller.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <fluent-multi-view-controller>
 */
export const definition = MultiViewController.compose({
    name: `${DesignSystem.prefix}-multi-view-controller`,
    template,
    styles
});
//# sourceMappingURL=multi-view-controller.definition.js.map