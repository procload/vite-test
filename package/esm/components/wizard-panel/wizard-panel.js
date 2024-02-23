var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { WizardStepState } from "../wizard-step";
/**
 * A WizardPanel Custom HTML Element.
 * @public
 * @class
 * @extends FASTElement
 *
 * @remarks
 * HTML Element: \<wizard-panel\>
 * Role: {@link https://www.w3.org/TR/wai-aria-1.1/#tabpanel | ARIA tabpanel }.
 *
 * @slot start - The content to display at the start of the step.
 * @slot end - The content to display at the end of the step.
 * @slot title - The content to display as the title of the step.
 * @slot - The default content of the step.
 * @slot footer - The content to display as the footer of the step.
 *
 * @attr {boolean} active - Indicates whether the step is active.
 * @attr {StepState} state - The state of the step.
 * @attr {boolean} hidden - Indicates whether the step is hidden.
 * @attr {string} id - The ID of the step.
 * @attr {string} slot - The slot of the step.
 * @attr {string} ariaLabel - The aria-label of the step.
 * @attr {string} ariaDescribedby - The aria-describedby of the step.
 * @attr {string} ariaLabelledby - The aria-labelledby of the step.
 *
 * @csspart title - The title.
 * @csspart content - The content.
 * @csspart footer - The footer.
 *
 * @fires panelchange - Dispatched when the panel state changes.
 */
export class WizardPanel extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Indicates whether the panel is hidden.
         * @public
         */
        this.hidden = true;
        /**
         * The state of the step.
         * @public
         */
        this.state = WizardStepState.incomplete;
        /**
         * Indicates whether the step is active.
         * @public
         */
        this.active = false;
    }
    /**
     * Handles the change in the state of the step.
     * @public
     */
    stateChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            this.emitChange();
        }
    }
    /**
     * Called when the `active` property changes.
     * @public
     */
    activeChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            if (newValue) {
                this.show();
            }
            else {
                this.hide();
            }
            this.emitChange();
        }
    }
    /**
     * Called when the `hidden` property changes.
     * @public
     */
    hiddenChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            this.emitChange();
        }
    }
    /**
     * Shows the wizard panel.
     * @public
     */
    show() {
        this.hidden = false;
    }
    /**
     * Hides the wizard panel.
     * @public
     */
    hide() {
        this.hidden = true;
    }
    /**
     * Emits a panelChange event with the current panel's details.
     * @public
     */
    emitChange() {
        this.$emit("panelchange", {
            id: this.id,
            state: this.state,
            active: this.active,
            index: this.index
        });
    }
}
__decorate([
    observable
], WizardPanel.prototype, "index", void 0);
__decorate([
    attr({ mode: "boolean" })
], WizardPanel.prototype, "hidden", void 0);
__decorate([
    attr
], WizardPanel.prototype, "state", void 0);
__decorate([
    attr({ mode: "boolean" })
], WizardPanel.prototype, "active", void 0);
//# sourceMappingURL=wizard-panel.js.map