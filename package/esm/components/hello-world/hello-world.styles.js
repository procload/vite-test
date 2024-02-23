import { css } from "@microsoft/fast-element";
export const styles = css `
  :host {
    display: inline-block;
    border: 1px solid var(--colorBrandBackground);
    border-radius: var(--borderRadiusMedium);
    background-color: var(--colorBrandBackground);
    color: var(--colorNeutralBackground1);
    padding: var(--spacingHorizontalM);
  }

  h1,
  h2,
  h3,
  button,
  p ::slotted(*) {
    font-family: var(--fontFamilyBase);
    font-size: unset;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  :host([size="small"]) {
    font-size: var(--fontSizeBase200);
  }
  :host([size="medium"]) {
    font-size: var(--fontSizeBase400);
  }
  :host([size="large"]) {
    font-size: var(--fontSizeBase600);
  }

  :host([disabled]) {
    background: unset;
    color: var(--colorNeutralForegroundDisabled) !important;
    background-color: var(--colorNeutralBackgroundDisabled) !important;
    border: 1px solid var(--colorNeutralBackgroundDisabled) !important;
    pointer-events: none;
  }
`;
//# sourceMappingURL=hello-world.styles.js.map