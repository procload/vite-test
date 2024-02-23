var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, Updates, attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { uniqueId } from "@microsoft/fast-web-utilities";
import { StepState } from "../step/step.options.js";
/**
 * A Stepper Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#list | ARIA list }.
 * Composition: Stepper, Step
 *
 * @slot start - Content which can be provided before the list element
 * @slot end - Content which can be provided after the list element
 * @slot step - The slot for steps
 *
 * @attr {string} aria-labelledby - The ID of the element that describes the step.
 * @attr {string} aria-describedby - The ID of the element that labels the step.
 * @attr {number} current-index - The index of the current step.
 * @attr {boolean} ordered - Indicates whether the step is ordered.
 *
 * @csspart list - The element wrapper for the steps
 *
 * @fires steppercomplete - Fires a custom 'steppercomplete' event when all steps state are set to complete
 * @fires stepperchange - Fires a custom 'stepperchange' event when steps change
 *
 * @public
 */
export class Stepper extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Determines whether the step state indicator should be labeled with the order of the steps.
         * @public
         * @remarks
         * HTML Attribute: ordered
         */
        this.ordered = false;
        /**
         * The current index
         * @public
         * @remarks
         * HTML Attribute: current-index
         */
        this.currentIndex = 0;
        /**
         * An observable array of steps
         * Each step is an object with optional properties: title, state, details, index
         * @public
         */
        this.steps = [];
        /**
         * An array to hold the slotted Step components.
         * @type {Step[]}
         */
        this.slottedsteps = [];
        /**
         * An array to hold the IDs of the Step components.
         * @type {string[]}
         */
        this.stepIds = [];
        /**
         * Sets the steps for the stepper.
         * @protected
         */
        this.setSteps = () => {
            this.slottedsteps.forEach((el, index) => {
                var _a, _b, _c, _d, _e, _f;
                if (el.slot === "step") {
                    const step = el;
                    const isActiveStep = this.currentIndex === index && this.isFocusableElement(step);
                    const stepId = this.stepIds[index];
                    step.setAttribute("id", stepId);
                    step.setAttribute("role", "listitem");
                    step.active = isActiveStep;
                    step.index = index;
                    if (this.steps.length > 0) {
                        step.title = (_b = (_a = this.steps[index]) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : undefined;
                        step.details = (_d = (_c = this.steps[index]) === null || _c === void 0 ? void 0 : _c.details) !== null && _d !== void 0 ? _d : undefined;
                        step.state = (_f = (_e = this.steps[index]) === null || _e === void 0 ? void 0 : _e.state) !== null && _f !== void 0 ? _f : StepState.incomplete;
                        if (this.ordered) {
                            step.ordered = true;
                        }
                    }
                    if (isActiveStep) {
                        this.activestep = step;
                        this.activeid = stepId;
                        this.currentIndex = index;
                    }
                    if (index === this.slottedsteps.length - 1) {
                        step.hideConnector = true;
                    }
                    if (this.slottedsteps.length >= 7) {
                        step.classList.add("overflow");
                        if (index === this.slottedsteps.length - 1) {
                            step.classList.add("last");
                        }
                        if (index === 0) {
                            step.classList.add("first");
                        }
                    }
                }
            });
            if (this.slottedsteps.every((step) => step.state === "complete")) {
                this.emitComplete();
            }
            if (this.slottedsteps.length >= 7) {
                this.setAttribute("class", "overflow");
            }
            this.emitChange();
        };
        /**
         * Checks if the given element is disabled.
         * @private
         */
        this.isDisabledElement = (el) => {
            return el.getAttribute("aria-disabled") === "true";
        };
        /**
         * Checks if the given element is hidden.
         * @private
         */
        this.isHiddenElement = (el) => {
            return el.hasAttribute("hidden");
        };
        /**
         * Checks if the given element is focusable.
         * @private
         */
        this.isFocusableElement = (el) => {
            return !this.isDisabledElement(el) && !this.isHiddenElement(el);
        };
        /**
         * Emits a custom event "stepperchange" whenever there is a change in the stepper.
         * The detail of the event includes the current steps, current index, and the previous active step index.
         * @private
         */
        this.emitChange = () => {
            this.$emit("stepperchange", {
                steps: this.steps,
                currentIndex: this.currentIndex,
                prevActiveStepIndex: this.prevActiveStepIndex
            });
        };
        /**
         * Checks if all steps are complete. If they are, it dispatches a "steppercomplete" event.
         * @private
         */
        this.emitComplete = () => {
            this.dispatchEvent(new CustomEvent("steppercomplete", {
                bubbles: true,
                detail: { steps: this.steps }
            }));
        };
    }
    /**
     * Shows the stepper component
     * @public
     */
    show() {
        this.hidden = false;
    }
    /**
     * Hides the stepper component
     * @public
     */
    hide() {
        this.hidden = true;
    }
    /**
     * Handles changes to the `activeid` property.
     * @public
     */
    activeidChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.setSteps();
        }
    }
    /**
     * Handles changes to the `slottedsteps` property.
     * @public
     */
    slottedstepsChanged() {
        if (this.$fastController.isConnected) {
            this.stepIds = this.getStepIds();
            this.setSteps();
        }
    }
    /**
     * Handles changes to the `steps` property.
     * @public
     */
    stepsChanged(oldValue, newValue) {
        if (this.$fastController.isConnected &&
            oldValue !== newValue &&
            newValue.length > 0) {
            this.stepIds = this.getStepIds();
            this.setSteps();
        }
    }
    /**
     * Handles changes to the `currentIndex` property.
     * @public
     */
    currentIndexChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            Updates.enqueue(() => {
                this.prevActiveStepIndex = oldValue;
                this.setComponent();
            });
        }
    }
    /**
     * Sets the component's active step based on the current index.
     * @private
     */
    setComponent() {
        Updates.enqueue(() => {
            this.stepIds = this.getStepIds();
            this.setSteps();
        });
    }
    /**
     * Gets the IDs of all steps in the stepper.
     * @private
     */
    getStepIds() {
        return this.slottedsteps.map((step) => {
            var _a;
            return (_a = step.getAttribute("id")) !== null && _a !== void 0 ? _a : `hwc-step-${parseInt(uniqueId())}`;
        });
    }
    /**
     * Handles the state change of a step.
     * @param e - The custom event that contains the index and state of the step.
     *
     * @private
     */
    handleStepStateChange(e) {
        const index = e.detail.index;
        const state = e.detail.state;
        const active = e.detail.active;
        if (active) {
            this.currentIndex = index;
        }
        this.steps = this.steps.map((step, i) => {
            if (i === index) {
                return { ...step, state };
            }
            return step;
        });
    }
    /**
     * Adds event listeners to each step in the stepper.
     * @public
     */
    addListeners() {
        this.slottedsteps.forEach((step) => {
            step.addEventListener("stepchange", (e) => this.handleStepStateChange(e));
        });
    }
    /**
     * Removes event listeners to each step in the stepper.
     * @public
     */
    removeListeners() {
        this.slottedsteps.forEach((step) => {
            step.removeEventListener("stepchange", (e) => this.handleStepStateChange(e));
        });
    }
    /**
     * Called when the component is connected to the DOM.
     * @public
     */
    connectedCallback() {
        super.connectedCallback();
        this.stepIds = this.getStepIds();
        Updates.enqueue(() => {
            this.setComponent();
            this.addListeners();
        });
    }
    /**
     * Called when the component is disconnected from the DOM.
     * @public
     */
    disconnectedCallback() {
        super.connectedCallback();
        this.removeListeners();
    }
}
__decorate([
    attr({ mode: "boolean" })
], Stepper.prototype, "ordered", void 0);
__decorate([
    attr({ attribute: "current-index", converter: nullableNumberConverter })
], Stepper.prototype, "currentIndex", void 0);
__decorate([
    attr({ attribute: "aria-labelledby" })
], Stepper.prototype, "ariaLabelledby", void 0);
__decorate([
    attr({ attribute: "aria-describedby" })
], Stepper.prototype, "ariaDescribedby", void 0);
__decorate([
    observable
], Stepper.prototype, "activeid", void 0);
__decorate([
    observable
], Stepper.prototype, "steps", void 0);
__decorate([
    observable
], Stepper.prototype, "slottedsteps", void 0);
//# sourceMappingURL=stepper.js.map