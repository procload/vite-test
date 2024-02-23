var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, attr } from "@microsoft/fast-element";
/**
 * A class representing a MultiView.
 * @class
 * @extends FASTElement
 */
export class MultiView extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Determines the hidden state of the multi-view
         * @public
         * @remarks
         * HTML Attribute: hidden
         * @type {boolean}
         */
        this.hidden = true;
    }
    hiddenChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            this.$emit("hiddenchanged", this.hidden);
        }
    }
}
__decorate([
    attr({ mode: "boolean" })
], MultiView.prototype, "hidden", void 0);
//# sourceMappingURL=multi-view.js.map