import { colorBrandForeground2, colorNeutralForegroundOnBrand, colorPaletteRedForeground3, fontFamilyBase, fontSizeBase200, fontSizeBase300, fontWeightRegular, fontWeightSemibold, lineHeightBase200, lineHeightBase300, spacingHorizontalM, spacingHorizontalXXL, spacingVerticalL, spacingVerticalXXS } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
/** Step styles
 * @public
 */
export const styles = css `
  ${display("block")}

  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: ${fontFamilyBase};
    position: relative;
    align-items: flex-start;
    column-gap: ${spacingHorizontalM};
    flex-shrink: 0;
    flex-grow: 1;
  }

  :host([hide-connector]) .state-connector,
  .summary,
  .title,
  .details {
    display: none;
  }

  :host(.overflow) {
    flex-shrink: 0;
    flex-grow: 0;
    width: 36px;
  }

  :host(.first) {
    padding-left: ${spacingHorizontalXXL};
  }

  :host(.first) .state-connector {
    left: 28px;
  }

  :host(.last) {
    padding-right: ${spacingHorizontalXXL};
  }

  .state-indicator {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    box-sizing: border-box;
  }

  .icon {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    font-weight: var(--fontWeightRegular);
    line-height: var(--lineHeightBase100);
    font-size: var(--fontSizeBase200);
    border-radius: var(--borderRadiusCircular);
    border: 2px solid var(--colorNeutralForeground2);
    background: var(--colorNeutralBackground4);
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .order {
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    margin-bottom: 1px;
  }

  .state-connector {
    position: absolute;
    top: 12px;
    left: 4px;
    height: 2px;
    width: 100%;
    background: var(--colorNeutralForegroundDisabled);
  }

  .title {
    font-weight: ${fontWeightRegular};
    font-size: ${fontSizeBase300};
    line-height: ${lineHeightBase300};
  }

  .details {
    font-weight: ${fontWeightRegular};
    font-size: ${fontSizeBase200};
    line-height: ${lineHeightBase200};
  }

  .icon svg {
    color: ${colorNeutralForegroundOnBrand};
    fill: ${colorNeutralForegroundOnBrand};
    width: 12px;
    height: 12px;
    box-sizing: border-box;
    vertical-align: middle;
  }

  :host([hide-connector]) {
    width: fit-content;
    flex-grow: 0;
    min-width: unset;
  }

  :host([aria-current="step"]) .title {
    font-weight: ${fontWeightSemibold};
  }

  :host([state="complete"]) .icon,
  :host([state="complete"]) .state-connector,
  :host([state="complete"].first) .state-connector,
  :host([active]) .icon {
    background: ${colorBrandForeground2};
    border-color: ${colorBrandForeground2};
    color: ${colorNeutralForegroundOnBrand};
  }

  :host([state="complete"]) .icon svg {
    margin-top: 2px;
  }

  :host([state="error"]) .icon {
    background: ${colorPaletteRedForeground3};
    border-color: ${colorPaletteRedForeground3};
  }

  @media (min-width: 480px) {
    :host(.overflow),
    :host,
    :host(.first) {
      display: flex;
      align-items: flex-start;
      width: fit-content;
      height: fit-content;
      max-width: 268px;
      padding: 0 0 ${spacingVerticalL} 0;
      column-gap: ${spacingHorizontalM};
      flex-grow: 0;
    }
    :host(.first) .state-connector,
    .state-connector {
      position: absolute;
      width: 2px;
      left: 11px;
      height: 100%;
      background: var(--colorNeutralForegroundDisabled);
      min-height: 22px;
    }
  }

  @media (min-width: 1023px) {
    :host {
      flex-direction: row;
    }
    .state-connector {
      left: 11px;
    }
    :host([aria-current="step"]) .details,
    .title {
      display: block;
    }
    .order {
      display: none;
    }
    .summary {
      display: flex;
      flex-direction: column;
      width: fit-content;
      min-width: 174px;
      gap: ${spacingVerticalXXS};
    }
  }
`;
//# sourceMappingURL=step.styles.js.map