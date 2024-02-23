import { borderRadiusMedium, borderRadiusSmall, colorBrandBackground, colorNeutralBackground1, fontFamilyBase, fontSizeBase200, fontSizeBase300, fontSizeBase400, fontSizeBase500, fontWeightRegular, fontWeightSemibold, lineHeightBase200, lineHeightBase300, lineHeightBase400, shadow16, spacingHorizontalL, spacingHorizontalM, spacingHorizontalS } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
export const styles = css `
  :host {
    position: absolute;
    border: 1px solid ${colorBrandBackground};
    border-radius: ${borderRadiusMedium};
    background-color: ${colorBrandBackground};
    color: ${colorNeutralBackground1};
    padding: ${spacingHorizontalL};
    box-shadow: ${shadow16};
    max-width: 288px;
  }

  ::slotted(*) {
    font-family: ${fontFamilyBase};
    font-size: unset;
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase300};
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  :host([size="small"]) ::slotted(*) {
    font-size: ${fontSizeBase200};
  }

  :host([size="medium"]) ::slotted(*) {
    font-size: ${fontSizeBase300};
  }

  :host([size="large"]) ::slotted(*) {
    font-size: ${fontSizeBase400};
  }

  :host[hidden] {
    ${display("none")}
  }

  slot[name="close"]::slotted(*) {
    position: absolute;
    top: 0;
    right: 0;
  }

  .content {
    position: relative;
  }

  .heading {
    margin-bottom: ${spacingHorizontalS};
  }

  .footer {
  }

  .arrow {
    position: absolute;
    background: ${colorBrandBackground};
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    border-radius: ${borderRadiusSmall};
  }

  slot[name="image"]::slotted(*) {
    display: block;
    margin-bottom: ${spacingHorizontalM};
    width: 100%;
    height: 100%;
  }

  slot[name="heading"]::slotted(*) {
    font-weight: ${fontWeightSemibold};
    line-height: ${lineHeightBase400};
  }

  :host([size="small"]) slot[name="heading"]::slotted(*) {
    font-size: ${fontSizeBase300};
  }

  :host([size="medium"]) slot[name="heading"]::slotted(*) {
    font-size: ${fontSizeBase400};
  }

  :host([size="large"]) slot[name="heading"]::slotted(*) {
    font-size: ${fontSizeBase500};
  }

  slot[name="footer"]::slotted(*) {
    line-height: ${lineHeightBase200};
    margin-top: ${spacingHorizontalM};
    padding-top: ${spacingHorizontalM};
  }
`;
//# sourceMappingURL=teaching-bubble.styles.js.map