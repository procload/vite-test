import { html } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "@microsoft/fast-foundation";
/**
 * The template for the {@link @horizon-msft/web-components#(MultiView:class)} component.
 * @public
 */
export function multiViewTemplate() {
    return html `
    <template
      slot="multi-view"
      role="tabpanel"
      ?hidden="${(x) => x.hidden}"
      tabindex="${(x) => (!x.hidden ? "0" : "-1")}"
      role="region"
    >
      <div class="multi-view" part="multi-view">
        ${startSlotTemplate({})}
        <slot></slot>
        ${endSlotTemplate({})}
      </div>
    </template>
  `;
}
export const template = multiViewTemplate();
//# sourceMappingURL=multi-view.template.js.map