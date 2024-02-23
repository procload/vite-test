import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
export const styles = css `
  ${display("inline-flex")}

  :host,
  :host svg {
    height: var(--icon-height, 20px);
    width: var(--icon-width, 20px);
  }

  :host svg:not([role="img"]) {
    fill: currentcolor;
  }
`;
//# sourceMappingURL=svg-icon.styles.js.map