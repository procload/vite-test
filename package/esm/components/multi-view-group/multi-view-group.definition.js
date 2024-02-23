import { DesignSystem } from "../design-system";
import { MultiViewGroup } from "./multi-view-group";
import { styles } from "./multi-view-group.styles";
import { template } from "./multi-view-group.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <fluent-multi-view-group>
 */
export const definition = MultiViewGroup.compose({
    name: `${DesignSystem.prefix}-multi-view-group`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode
    }
});
//# sourceMappingURL=multi-view-group.definition.js.map