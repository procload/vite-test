import { colorNeutralBackground2, colorNeutralForeground1, colorNeutralStroke1, spacingHorizontalXXL, spacingVerticalL, spacingVerticalXS, spacingVerticalXXL } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
/** Wizard Panel styles
 * @public
 */
export const styles = css `
  ${display("block")}
  :host {
    height: 100%;
    background: ${colorNeutralBackground2};
  }

  :host([active]) {
    display: block;
  }

  .content {
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL} 0;
  }

  .title {
    padding: 0 ${spacingHorizontalXXL} ${spacingVerticalXS};
    color: ${colorNeutralForeground1};
  }
  .footer {
    padding: ${spacingVerticalL} ${spacingHorizontalXXL};
    border-top: 1px solid ${colorNeutralStroke1};
  }
`;
//# sourceMappingURL=wizard-panel.styles.js.map