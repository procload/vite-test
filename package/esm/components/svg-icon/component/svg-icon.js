var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, attr, css, observable, } from "@microsoft/fast-element";
import SvgService from "../services/svg-service";
import { SvgIconRole } from "./svg-icon.options";
export class SvgIcon extends FASTElement {
    constructor() {
        super(...arguments);
        this.isLoading = true;
        this.isError = false;
        /**
         * The name of the SVG to use from the SVG sprite.
         * @public
         * @remarks
         * HTML Attribute: name
         * @type {string}
         */
        this.name = "";
        /**
         * The size of the icon. Value must match icon size as indicated in its name.
         * @public
         * @remarks
         * HTML Attribute: size
         * @type {string}
         */
        this.size = "";
        /**
         * Path to SVG. Can be standalone SVG or SVG sprite.
         * @public
         * @remarks
         * HTML Attribute: path
         * @type {string}
         */
        this.path = "";
        /**
         * Whether the icon is hidden from screen readers. Defaults to true.
         * @public
         * @remarks
         * HTML Attribute: aria-hidden
         * @type {string}
         */
        this.ariaHidden = "true";
        /**
         * Optional label for the icon. Emitted via aria-label.
         * @public
         * @remarks
         * HTML Attribute: label
         * @type {string}
         */
        this.ariaLabel = "";
        /**
         * Whether the icon is focusable. Defaults to false.
         * @public
         * @remarks
         * HTML Attribute: focusable
         * @type {string}
         */
        this.focusable = "false";
        /**
         * The role of the icon. Defaults to null.
         * @public
         * @remarks
         * HTML Attribute: role
         * @type {string}
         */
        this.role = SvgIconRole.null;
        this.renderResolver = null;
        this.renderPromise = new Promise((resolve) => {
            this.renderResolver = resolve;
        });
    }
    nameChanged() {
        this.checkAndResolveRenderPromise();
    }
    sizeChanged() {
        this.checkAndResolveRenderPromise();
    }
    pathChanged() {
        this.checkAndResolveRenderPromise();
    }
    connectedCallback() {
        super.connectedCallback();
        this.renderPromise.then(() => this.renderIcon());
    }
    checkAndResolveRenderPromise() {
        if (this.renderResolver) {
            if (this.path) {
                if (!this.name || (this.name && this.name !== "")) {
                    this.renderResolver();
                    this.renderResolver = null;
                }
            }
        }
    }
    renderIcon() {
        this.isLoading = true;
        SvgService.getPreparedSVG(this.path, this.name)
            .then(({ content, width, height }) => {
            this.isLoading = false;
            this.shadowRoot.innerHTML = content;
            this.updateComputedStylesheet(width, height);
            const svgElementInShadow = this.shadowRoot.querySelector("svg");
            if (svgElementInShadow) {
                this.updateSvgAttributes(svgElementInShadow);
            }
        })
            .catch((error) => {
            this.isLoading = false;
            this.isError = true;
            console.error(`Failed to load icon: ${this.path}`, error);
            this.renderErrorIcon();
        });
    }
    renderErrorIcon() {
        // Creating SVG element for red "X"
        const errorSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        errorSvg.setAttribute("width", "20");
        errorSvg.setAttribute("height", "20");
        errorSvg.setAttribute("viewBox", "0 0 20 20");
        // Line from top-left to bottom-right
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", "0");
        line1.setAttribute("y1", "0");
        line1.setAttribute("x2", "20");
        line1.setAttribute("y2", "20");
        line1.setAttribute("stroke", "red");
        line1.setAttribute("stroke-width", "2");
        // Line from top-right to bottom-left
        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", "20");
        line2.setAttribute("y1", "0");
        line2.setAttribute("x2", "0");
        line2.setAttribute("y2", "20");
        line2.setAttribute("stroke", "red");
        line2.setAttribute("stroke-width", "2");
        errorSvg.appendChild(line1);
        errorSvg.appendChild(line2);
        // Adding SVG to shadowRoot
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(errorSvg);
    }
    updateComputedStylesheet(width, height) {
        if (this.size) {
            const sizeValue = ["12", "16", "20", "24", "28", "32", "48"].includes(this.size)
                ? this.size
                : "20";
            this.computedStylesheet = css `
        :host {
          --icon-height: ${sizeValue}px;
          --icon-width: ${sizeValue}px;
        }
      `;
        }
        else if (width && height) {
            this.computedStylesheet = css `
        :host {
          --icon-height: ${height}px;
          --icon-width: ${width}px;
        }
      `;
        }
        if (this.computedStylesheet) {
            this.$fastController.addStyles(this.computedStylesheet);
        }
    }
    updateSvgAttributes(svgElement) {
        if (this.name !== undefined) {
            svgElement.setAttribute("name", this.name);
        }
        else {
            svgElement.removeAttribute("name");
        }
        if (this.size !== undefined) {
            svgElement.setAttribute("size", this.size);
        }
        else {
            svgElement.removeAttribute("size");
        }
        if (this.ariaLabel) {
            svgElement.setAttribute("aria-label", this.ariaLabel);
        }
        else {
            svgElement.removeAttribute("aria-label");
        }
        svgElement.setAttribute("aria-hidden", this.ariaHidden);
        svgElement.setAttribute("focusable", this.focusable || "false");
        if (this.role) {
            svgElement.setAttribute("role", this.role);
        }
        else {
            svgElement.removeAttribute("role");
        }
    }
}
__decorate([
    observable,
    attr
], SvgIcon.prototype, "name", void 0);
__decorate([
    observable,
    attr
], SvgIcon.prototype, "size", void 0);
__decorate([
    observable,
    attr
], SvgIcon.prototype, "path", void 0);
__decorate([
    attr({ attribute: "aria-hidden" })
], SvgIcon.prototype, "ariaHidden", void 0);
__decorate([
    attr({ attribute: "aria-label" })
], SvgIcon.prototype, "ariaLabel", void 0);
__decorate([
    attr
], SvgIcon.prototype, "focusable", void 0);
__decorate([
    attr
], SvgIcon.prototype, "role", void 0);
//# sourceMappingURL=svg-icon.js.map