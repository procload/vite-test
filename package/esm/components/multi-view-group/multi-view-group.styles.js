import { colorStrokeFocus2, colorTransparentStroke, shadow4, strokeWidthThick, } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
/** PaneSwitcher styles
 * @public
 */
export const styles = css `
  ${display("flex")}
  :host {
    flex-direction: column;
    position: absolute;
    z-index: 10;
    right: 0;
    top: 0;
    height: 100%;
  }
  .root {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .views {
    display: flex;
  }
  .controllers {
    display: flex;
    flex-direction: column;
    background: var(--colorNeutralBackground1);
    position: relative;
  }

  .controllers:focus-visible::after {
    content: "";
    position: absolute;
    inset: 1px;
    border-color: ${colorTransparentStroke};
    outline: ${strokeWidthThick} solid ${colorTransparentStroke};
    box-shadow: ${shadow4}, 0 0 0 2px ${colorStrokeFocus2};
  }
`;
//# sourceMappingURL=multi-view-group.styles.js.map