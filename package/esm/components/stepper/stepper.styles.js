import { colorNeutralBackground3, spacingHorizontalXXL, spacingHorizontalXXXL, spacingVerticalXXL } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
/** Step styles
 * @public
 */
export const styles = css `
  ${display("block")}

  :host {
    background-color: ${colorNeutralBackground3};
    box-sizing: border-box;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 9;
  }

  .list {
    display: flex;
    flex-direction: row;
  }

  :host(.overflow) .list {
    justify-content: flex-start;
    align-items: unset;
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${spacingVerticalXXL} 0;
  }

  @media (min-width: 480px) {
    :host(.overflow),
    :host {
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
      position: relative;
      height: 100%;
      max-width: 70px;
    }
    .list {
      flex-direction: column;
      max-width: 480px;
    }
    :host(.overflow) .list {
      width: fit-content;
      justify-content: unset;
      align-items: center;
      overflow-x: unset;
      overflow-y: unset;
      width: 24px;
      padding: 0;
    }
  }

  @media (min-width: 1023px) {
    :host(.overflow),
    :host {
      max-width: 268px;
      width: 268px;
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXXL}
        ${spacingVerticalXXL} ${spacingHorizontalXXL};
    }
    :host(.overflow) .list {
      width: fit-content;
    }
  }
`;
//# sourceMappingURL=stepper.styles.js.map