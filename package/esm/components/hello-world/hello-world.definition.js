import { DesignSystem } from "../design-system";
import { HelloWorld } from "./hello-world";
import { styles } from "./hello-world.styles";
import { template } from "./hello-world.template";
export const HelloWorldDefinition = HelloWorld.compose({
    name: `${DesignSystem.prefix}-hello-world`,
    template,
    styles,
    shadowOptions: {
        mode: DesignSystem.shadowRootMode,
    },
});
//# sourceMappingURL=hello-world.definition.js.map