import { html, ref, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "@microsoft/fast-foundation";
/**
 * The template for the {@link @horizon-msft/web-components#(Stepper:class)} component.
 * @public
 */
export function wizardTemplate() {
    return html `
    <template
      ?hidden="${(x) => x.hidden}"
      ?ordered="${(x) => x.ordered}"
      current-index="${(x) => x.currentIndex}"
      aria-hidden="${(x) => (x.hidden ? "true" : "false")}"
    >
      <div class="wizard" part="wizard">
        ${startSlotTemplate({})}
        <div
          role="tablist"
          class="steps"
          part="steps"
          tabindex="0"
          @keydown="${(x, c) => x.handleStepContainerKeydown(c.event)}"
          ${ref("stepcontainer")}
        >
          <slot name="step" ${slotted("slottedsteps")}></slot>
        </div>
        <div
          class="panels-container"
          part="panels-container"
          ${ref("panelcontainer")}
        >
          <div class="toolbar" part="toolbar">
            <div class="title" part="title"><slot name="title"></slot></div>
            <div class="button-container" part="button-container">
              <slot name="button" ${slotted("slottedbuttons")}></slot>
            </div>
          </div>
          <div class="panels" part="panels">
            <slot name="panel" ${slotted("slottedpanels")}></slot>
          </div>
          ${endSlotTemplate({})}
        </div>
      </div>
    </template>
  `;
}
export const template = wizardTemplate();
//# sourceMappingURL=wizard.template.js.map