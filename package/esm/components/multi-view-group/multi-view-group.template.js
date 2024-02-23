import { html, ref, slotted, } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "@microsoft/fast-foundation";
/**
 * The template for the {@link @horizon-msft/web-components#(MultiViewGroup:class)} component.
 * @public
 */
export function multiViewGroupTemplate() {
    return html `
    <template>
      <div class="root">
        <div class="views" part="views">
          <slot name="multi-view" ${slotted("multiViews")}></slot>
        </div>
        ${startSlotTemplate({})}
        <div
          class="controllers"
          part="controllers"
          role="tablist"
          aria-label="${(x) => x.ariaLabel}"
          tabindex="${(x) => (x.hidden ? "-1" : "0")}"
          ${ref("controllersContainer")}
        >
          <slot name="controller" ${slotted("controllers")}></slot>
        </div>
        ${endSlotTemplate({})}
      </div>
    </template>
  `;
}
export const template = multiViewGroupTemplate();
//# sourceMappingURL=multi-view-group.template.js.map