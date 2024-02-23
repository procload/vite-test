import { css } from "@microsoft/fast-element";
// Need to support icon hover styles
export const styles = css `
  :host {
    position: relative;
  }
  :host([aria-expanded="true"])::before {
    content: "";
    z-index: 3;
    position: absolute;
    left: 0;
    height: 32px;
    width: 3px;
    background: var(--colorBrandBackground);
  }

  :host(:focus-visible)::after {
    content: "";
    position: absolute;
    inset: 0px;
    cursor: pointer;
    border-radius: var(--borderRadiusSmall);
    outline: none;
    box-shadow: inset 0 0 0 1px var(--colorStrokeFocus2);
  }
`;
//# sourceMappingURL=multi-view-controller.styles.js.map