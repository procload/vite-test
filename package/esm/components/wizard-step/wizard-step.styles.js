import { css } from "@microsoft/fast-element";
import { styles as stepStyles } from "../step/step.styles";
/** Wizard Step styles
 * @public
 */
export const styles = css `
  ${stepStyles}
  :host(:hover) {
    cursor: pointer;
  }
  :host([disabled]) {
    cursor: not-allowed;
  }
`;
//# sourceMappingURL=wizard-step.styles.js.map