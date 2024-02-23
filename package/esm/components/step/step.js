var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { StepState } from "./step.options";
/**
 * A Step Custom HTML Element.
 * Acts as the base class for the {@link @horizon-msft/web-components#(WizardStep:class)} component.
 *
 * @public
 * @class
 * @extends FASTElement
 *
 * @remarks
 * HTML Element: \<hwc-step\>
 *
 * @slot start - The content to display at the start of the step.
 * @slot end - The content to display at the end of the step.
 * @slot incomplete - The content to display when the step is incomplete.
 * @slot complete - The content to display when the step is complete.
 * @slot error - The content to display when the step has an error.
 * @slot title - The content to display as the title of the step.
 * @slot details - The content to display as the details of the step.
 *
 * @attr {string} ariaDescribedby - The ID of the element that describes the step.
 * @attr {string} ariaLabelledby - The ID of the element that labels the step.
 * @attr {boolean} ariaCompleted - Indicates whether the step is completed for accessibility purposes.
 * @attr {boolean} active - Indicates whether the step is active.
 * @attr {StepState} state - The state of the step.
 * @attr {boolean} hideConnector - Indicates whether the connector should be hidden.
 * @attr {boolean} ordered - Indicates whether the step is ordered.
 * @attr {boolean} disabled - Indicates whether the step is disabled.
 *
 * @csspart state-indicator - The state indicator.
 * @csspart icon - The icon.
 * @csspart summary - The summary.
 * @csspart title - The title.
 * @csspart details - The details.
 * @csspart connector - The connector.
 *
 * @fires stepchange - Dispatched when the step state changes.
 */
export class Step extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Indicates whether the step is active.
         * @public
         */
        this.active = false;
        /**
         * Indicates whether the step is disabled.
         * @public
         */
        this.disabled = false;
        /**
         * The state of the step.
         * @public
         */
        this.state = StepState.incomplete;
        /**
         * The index of the step within the parent Stepper component.
         * @public
         */
        this.index = 0;
        /**
         * The details of the step.
         * @public
         */
        this.details = "";
        /**
         * The title of the step.
         * @public
         */
        this.title = "";
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
     * Handles change to the active property.
     * @public
     */
    activeChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            this.emitChange();
        }
    }
    /**
     * Toggle the ative state of the step.
     * @public
     */
    toggleActive() {
        this.active = !this.active;
    }
    /**
     * Sets the state of the step to 'complete'.
     * @public
     */
    setComplete() {
        this.state = StepState.complete;
    }
    /**
     * Sets the state of the step to 'incomplete'.
     * @public
     */
    setIncomplete() {
        this.state = StepState.incomplete;
    }
    /**
     * Sets the state of the step to 'error'.
     * @public
     */
    setError() {
        this.state = StepState.error;
    }
    /**
     * Emits a stepchange event with the current step's details.
     * @public
     */
    emitChange() {
        this.$emit("stepchange", {
            id: this.id,
            state: this.state,
            active: this.active,
            index: this.index
        });
    }
}
__decorate([
    attr({ mode: "boolean" })
], Step.prototype, "ordered", void 0);
__decorate([
    attr({ mode: "boolean", attribute: "hide-connector" })
], Step.prototype, "hideConnector", void 0);
__decorate([
    attr({ mode: "boolean" })
], Step.prototype, "active", void 0);
__decorate([
    attr({ mode: "boolean" })
], Step.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: "aria-describedby" })
], Step.prototype, "ariaDescribedby", void 0);
__decorate([
    attr({ attribute: "aria-labelledby" })
], Step.prototype, "ariaLabelledby", void 0);
__decorate([
    attr
], Step.prototype, "state", void 0);
__decorate([
    observable
], Step.prototype, "index", void 0);
__decorate([
    observable
], Step.prototype, "details", void 0);
__decorate([
    observable
], Step.prototype, "title", void 0);
//# sourceMappingURL=step.js.map