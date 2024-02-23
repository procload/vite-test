import { html, slotted } from "@microsoft/fast-element";
/**
 * The template for the {@link @horizon-msft/web-components#(Stepper:class)} component.
 * @public
 */
export function stepperTemplate() {
    return html `
    <template
      ?hidden="${(x) => x.hidden}"
      ?ordered="${(x) => x.ordered}"
      current-index="${(x) => x.currentIndex}"
      aria-labelledby="${(x) => x.ariaLabelledby}"
      aria-describedby="${(x) => x.ariaDescribedby}"
      aria-label="${(x) => x.ariaLabel}"
    >
      <slot name="start"></slot>
      <div class="list" part="list" role="list">
        <slot name="step" ${slotted("slottedsteps")}></slot>
      </div>
      <slot name="end"></slot>
    </template>
  `;
}
export const template = stepperTemplate();
//# sourceMappingURL=stepper.template.js.map