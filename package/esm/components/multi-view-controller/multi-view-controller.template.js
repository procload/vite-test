import { html } from "@microsoft/fast-element";
/**
 * The template for the {@link @horizon-msft/web-components#(MultiViewController:class)} component.
 * @public
 */
export function multiViewControllerTemplate() {
    return html `
    <template slot="controller" tabindex="-1" role="tab">
      <fluent-button icon-only shape="square" tabindex="-1">
        <slot></slot>
      </fluent-button>
    </template>
  `;
}
export const template = multiViewControllerTemplate();
//# sourceMappingURL=multi-view-controller.template.js.map