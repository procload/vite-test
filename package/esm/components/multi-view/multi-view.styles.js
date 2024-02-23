import { colorStrokeFocus2, colorTransparentStroke, shadow4, strokeWidthThick, } from "@fluentui/web-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
/** MultiView styles
 * @public
 */
export const styles = css `
  ${display("block")}

  :host {
    display: block;
    position: relative;
  }
  :host([hidden]) {
    display: none;
  }
  :host([data-flexposition="2"]) {
    order: 2;
  }
  :host(:focus-visible)::after {
    content: "";
    position: absolute;
    inset: 1px;
    border-color: ${colorTransparentStroke};
    outline: ${strokeWidthThick} solid ${colorTransparentStroke};
    box-shadow: ${shadow4}, 0 0 0 2px ${colorStrokeFocus2};
  }
`;
//# sourceMappingURL=multi-view.styles.js.map