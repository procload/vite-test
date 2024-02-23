import { DesignSystem } from "../design-system";
import { MultiView } from "./multi-view";
import { styles } from "./multi-view.styles";
import { template } from "./multi-view.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-multi-view>
 */
export const definition = MultiView.compose({
    name: `${DesignSystem.prefix}-multi-view`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode
    }
});
//# sourceMappingURL=multi-view.definition.js.map