import { DesignSystem } from "../design-system";
import { TeachingBubble } from "./teaching-bubble";
import { styles } from "./teaching-bubble.styles";
import { template } from "./teaching-bubble.template";
/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-teaching-bubble>
 */
export const definition = TeachingBubble.compose({
    name: `${DesignSystem.prefix}-teaching-bubble`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode,
    },
});
//# sourceMappingURL=teaching-bubble.definition.js.map