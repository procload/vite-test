import { html } from "@microsoft/fast-element";
const Checkmark16Regular = html `
  <svg
    fill="currentColor"
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02Z"
      fill="currentColor"
    ></path>
  </svg>
`;
const Dismiss16Regular = html `
  <svg
    fill="currentColor"
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m2.4 2.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1-.07-.98l.07-.08-.07.08Z"
      fill="currentColor"
    ></path>
  </svg>
`;
/**
 * The template for the {@link @horizon-msft/web-components#(Step:class)} component.
 * @public
 */
export function baseStepTemplate() {
    return html `
    <template
      class="step"
      state="${(x) => x.state}"
      ?hide-connector="${(x) => x.hideConnector}"
      ?active="${(x) => x.active}"
      ?disabled="${(x) => x.disabled}"
      ?ordered="${(x) => x.ordered}"
      aria-label="${(x) => x.ariaLabel}"
      aria-describedby="${(x) => x.ariaDescribedby}"
      aria-labelledby="${(x) => x.ariaLabelledby}"
      aria-current="${(x) => (x.active ? "step" : null)}"
      aria-completed="${(x) => (x.state == "complete" ? "true" : "false")}"
    >
      <slot name="start"></slot>
      <div class="state-indicator">
        <div class="icon" part="icon">
          ${(x) => x.state === "incomplete"
        ? html `
                  <slot name="incomplete">
                    <span class="order" part="order">
                      ${(x) => (x.ordered ? x.index + 1 : "")}
                    </span>
                  </slot>
                `
        : ""}
          ${(x) => x.state === "complete"
        ? html `
                  <slot name="complete">${Checkmark16Regular}</slot>
                `
        : ""}
          ${(x) => x.state === "error"
        ? html `
                  <slot name="error">${Dismiss16Regular}</slot>
                `
        : ""}
        </div>
      </div>
      <div class="summary" part="summary">
        <div class="title" part="title">
          <slot name="title">${(x) => x.title}</slot>
        </div>
        <div class="details" part="details">
          <slot name="details">${(x) => x.details}</slot>
        </div>
      </div>

      <div part="state-connector" class="state-connector"></div>
      <slot name="end"></slot>
    </template>
  `;
}
export const template = baseStepTemplate();
//# sourceMappingURL=step.template.js.map