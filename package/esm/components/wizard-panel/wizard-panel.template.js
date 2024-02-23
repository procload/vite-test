import { html } from "@microsoft/fast-element";
/**
 * The template for the {@link @horizon-msft/web-components#(WizardPanel:class)} component.
 * @public
 */
export function wizardPanelTemplate() {
    return html `
    <template
      aria-hidden="${(x) => x.hidden}"
      state="${(x) => x.state}"
      ?active="${(x) => x.active}"
    >
      <slot name="start"></slot>
      <div class="title" part="title">
        <slot name="title"></slot>
      </div>
      <div class="content" part="content"><slot></slot></div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
      <slot name="end"></slot>
    </template>
  `;
}
export const template = wizardPanelTemplate();
//# sourceMappingURL=wizard-panel.template.js.map