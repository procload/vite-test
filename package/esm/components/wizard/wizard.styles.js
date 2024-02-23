import { colorNeutralBackground2, colorNeutralBackground3, colorNeutralForeground3, spacingHorizontalM, spacingHorizontalXXL, spacingHorizontalXXXL, spacingVerticalXXL } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
/** Wizard styles
 * @public
 */
export const styles = css `
  ${display("block")}

  :host {
    height: 100%;
    width: 100%;
    padding-top: 70px;
  }

  :host(.overflow) .steps {
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
  }

  .steps {
    background-color: ${colorNeutralBackground3};
    box-sizing: border-box;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 9;
    display: flex;
    flex-direction: row;
  }

  .wizard {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .title {
    color: ${colorNeutralForeground3};
  }

  .panels-container {
    background: ${colorNeutralBackground2};
  }

  .button-container {
    display: flex;
    gap: ${spacingHorizontalM};
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL} 0;
  }

  @media (min-width: 480px) {
    :host {
      padding-top: 0;
    }
    .panels-container {
      width: 100%;
    }
    .wizard {
      flex-direction: row;
    }
    :host(.overflow) .steps,
    .steps {
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
      position: relative;
      max-width: 70px;
    }
    .steps {
      flex-direction: column;
    }
    :host(.overflow) .steps {
      width: fit-content;
      justify-content: flex-start;
      align-items: center;
      overflow-x: unset;
      overflow-y: unset;
      width: 24px;
    }
  }

  @media (min-width: 1023px) {
    :host(.overflow) .steps,
    .steps {
      max-width: 268px;
      width: 268px;
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXXL}
        ${spacingVerticalXXL} ${spacingHorizontalXXL};
    }
    :host(.overflow) .steps {
      width: fit-content;
    }
  }
`;
//# sourceMappingURL=wizard.styles.js.map