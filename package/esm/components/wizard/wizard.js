var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, Updates, attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp, keyEnd, keyEnter, keyEscape, keyHome, keyTab, uniqueId } from "@microsoft/fast-web-utilities";
import { WizardStepState } from "../wizard-step";
/**
 * A Wizard Custom HTML Element.
 * @public
 * @class
 * @extends FASTElement
 *
 * @remarks
 * HTML Element: \<hwc-wizard\>
 * Roles: Implements {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist } on internal step container.
 * Composition: Wizard, WizardStep, WizardPanel
 *
 * @slot start - Content which can be provided before the list element
 * @slot end - Content which can be provided after the list element
 * @slot step - The slot for steps
 * @slot panel - The slot for panels
 * @slot button - The slot for panel's elements buttons
 * @slot title - The slot for title
 *
 * @attr {boolean} ordered - Determines whether the step state indicator should be labeled with the order of the steps.
 * @attr {boolean} disable-on-complete - Determines whether the step state indicator should be labeled with the order of the steps.
 * @attr {number} current-index - The current index
 * @attr {string} aria-labelledby - The ID of the element that labels the wizard.
 * @attr {string} aria-describedby - The ID of the element that describes the wizard.
 * @attr {string} aria-label - The ID of the element that describes the wizard.
 * @attr {boolean} hidden - Determines whether the wizard is hidden.
 *
 * @csspart wizard - The wizard element
 * @csspart steps - The element container for the steps
 * @csspart panels-container - The container for wizard panel section
 * @csspart panel - The container element for the panels
 * @csspart title - The container element for the title
 *
 * @fires wizardcomplete - Fires a custom 'wizardcomplete' event when all steps state are set to complete
 * @fires wizardchange - Fires a custom 'wizardchange' event when steps change
 *
 * @public
 */
export class Wizard extends FASTElement {
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
         * Determines whether the step state indicator should be labeled with the order of the steps.
         * @public
         * @remarks
         * HTML Attribute: disable-on-complete
         */
        this.disableOnComplete = false;
        /**
         * The current index
         * @public
         * @remarks
         * HTML Attribute: current-index
         */
        this.currentIndex = 0;
        /**
         * An array to hold the slotted WizardStep components.
         * @type {WizardStep[]}
         *
         * @public
         */
        this.slottedsteps = [];
        /**
         * Array of HTMLButtonElement representing the slotted buttons in the wizard component.
         * @type {HTMLButtonElement[]}
         *
         * @public
         */
        this.slottedbuttons = [];
        /**
         * An array to hold the slotted Wizard Panel components.
         * @type {WizardPanel[]}
         *
         * @public
         */
        this.slottedpanels = [];
        /**
         * An array to hold the IDs of the WizardStep components.
         * @type {string[]}
         *
         * @private
         */
        this.stepIds = [];
        /**
         * An array to hold the IDs of the WizardPanel components.
         * @type {string[]}
         *
         * @private
         */
        this.panelIds = [];
        /**
         * Moves to the next step in the wizard.
         * @public
         */
        this.next = () => {
            this.currentIndex = this.slottedsteps.indexOf(this.activestep);
            this.focusNextStep(true);
        };
        /**
         * Moves to the previous step in the wizard.
         * @public
         */
        this.previous = () => {
            this.currentIndex = this.slottedsteps.indexOf(this.activestep);
            this.focusPreviousStep(true);
        };
        /**
         * Moves the focus to the next step in the wizard.
         *
         * @param setActive - Whether to set the next step as the active step.
         *
         * @public
         */
        this.focusNextStep = (setActive = false) => {
            const group = this.slottedsteps;
            let index = 0;
            index = this.currentIndex + 1;
            while (index < group.length && group.length > 1) {
                if (group[index].disabled) {
                    index += 1;
                }
                else {
                    break;
                }
            }
            if (index === group.length) {
                index = 0;
            }
            while (index < group.length && group.length > 1) {
                if (this.isFocusableElement(group[index]) && !this.isDisabledElement(group[index])) {
                    this.moveToStepByIndex(index);
                    break;
                }
                else if (this.activestep && index === group.indexOf(this.activestep)) {
                    break;
                }
                else if (index + 1 >= group.length) {
                    index = 0;
                }
                else {
                    index += 1;
                }
            }
            if (setActive && !this.isDisabledElement(group[index])) {
                this.setActiveStep(this.slottedsteps[index]);
            }
        };
        /**
         * Moves the focus to the previous step in the wizard.
         * @param setActive - Whether to set the previous step as the active step.
         *
         * @public
         */
        this.focusPreviousStep = (setActive = false) => {
            const group = this.slottedsteps;
            let index = 0;
            index = this.currentIndex - 1;
            index = index < 0 ? group.length - 1 : index;
            while (index < group.length && group.length > 1) {
                if (group[index].disabled) {
                    index -= 1;
                }
                else {
                    break;
                }
            }
            while (index >= 0 && group.length > 1) {
                if (this.isFocusableElement(group[index]) && !this.isDisabledElement(group[index])) {
                    this.moveToStepByIndex(index);
                    break;
                }
                else if (index - 1 < 0) {
                    index = group.length - 1;
                }
                else {
                    index -= 1;
                }
            }
            if (setActive && !this.isDisabledElement(group[index])) {
                this.setActiveStep(this.slottedsteps[index]);
            }
        };
        /**
         * Moves to a specific step in the Wizard by its index.
         * @param index - The index of the step to move to.
         * @public
         */
        this.moveToStepByIndex = (index) => {
            const step = this.slottedsteps[index];
            this.currentIndex = index;
            step.focus();
            this.setComponent();
        };
        /**
         * Handles the keydown event on the step container.
         *
         * @param event - The keydown event.
         *
         * @public
         */
        this.handleStepContainerKeydown = (event) => {
            var _a;
            const activeIndex = (_a = this.slottedsteps.findIndex((step) => step.active)) !== null && _a !== void 0 ? _a : 0;
            switch (event.key) {
                case keyEnter:
                    event.preventDefault();
                    if (document.activeElement === this) {
                        if (activeIndex !== -1) {
                            this.currentIndex = activeIndex;
                            this.slottedsteps[activeIndex].focus();
                        }
                    }
                    break;
                case keyTab:
                    event.stopPropagation();
                    event.preventDefault();
                    this.slottedbuttons[0].focus();
                    this.slottedsteps[activeIndex].tabIndex = -1;
                    break;
                default:
                    break;
            }
        };
        /**
         * Handles the keydown event on a step.
         *
         * @param event - The keydown event.
         *
         * @public
         */
        this.handleStepKeyDown = (event) => {
            switch (event.key) {
                case keyTab:
                    event.stopPropagation();
                    event.preventDefault();
                    if (event.shiftKey) {
                        this.stepcontainer.focus();
                    }
                    else {
                        const activeIndex = this.slottedsteps.findIndex((step) => step.active);
                        this.slottedsteps[activeIndex].tabIndex = -1;
                        this.slottedbuttons[0].focus();
                    }
                    break;
                case keyEscape:
                    event.preventDefault();
                    this.stepcontainer.focus();
                    break;
                case keyEnter:
                    event.preventDefault();
                    this.handleStepSelect(event);
                    break;
                case keyArrowUp:
                    event.preventDefault();
                    this.focusPreviousStep();
                    break;
                case keyArrowDown:
                    event.preventDefault();
                    this.focusNextStep();
                    break;
                case keyHome:
                    event.preventDefault();
                    this.moveToStepByIndex(-this.currentIndex);
                    break;
                case keyEnd:
                    event.preventDefault();
                    this.moveToStepByIndex(this.slottedsteps.length - this.currentIndex - 1);
                    break;
                default:
                    break;
            }
        };
        /**
         * Sets the steps for the wizard.
         * @protected
         */
        this.setSteps = () => {
            this.currentIndex === -1 ? this.getActiveIndex() : this.currentIndex;
            this.slottedsteps.forEach((el, index) => {
                if (el.slot === "step") {
                    const step = el;
                    const isActiveStep = this.currentIndex === index && this.isFocusableElement(step);
                    const stepId = this.stepIds[index];
                    step.setAttribute("id", stepId);
                    step.setAttribute("tabindex", isActiveStep ? "0" : "-1");
                    step.setAttribute("role", "tab");
                    step.active = isActiveStep;
                    step.index = index;
                    if (this.ordered) {
                        step.ordered = true;
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
                    }
                }
            });
            if (this.slottedsteps.every((step) => step.state === "complete")) {
                this.emitComplete();
            }
            if (this.slottedsteps.length >= 7) {
                this.setAttribute("class", "overflow");
            }
            this.setPanels();
        };
        /**
         * Sets the panels of the wizard component.
         * @protected
         */
        this.setPanels = () => {
            this.slottedpanels.forEach((el, index) => {
                if (el.slot === "panel") {
                    const panel = el;
                    const stepId = this.stepIds[index];
                    const panelId = this.panelIds[index];
                    panel.setAttribute("id", panelId);
                    panel.setAttribute("aria-labelledby", stepId);
                    panel.setAttribute("role", "tabpanel");
                    panel.index = index;
                    const isActivePanel = this.currentIndex === index && this.isFocusableElement(panel);
                    panel.active = isActivePanel;
                    this.currentIndex !== index ? panel.hide() : panel.show();
                }
            });
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
         * Handles the selection of a step in the wizard.
         *
         * @param event - The event object representing the step selection.
         *
         * @private
         */
        this.handleStepSelect = (event) => {
            const selectedStep = event.currentTarget;
            if (selectedStep.disabled) {
                return;
            }
            else {
                this.setActiveStep(selectedStep);
            }
        };
        /**
         * Emits a custom event "wizardchange" whenever there is a change in the wizard.
         * @private
         */
        this.emitChange = () => {
            this.$emit("wizardchange", {
                currentIndex: this.currentIndex,
                activeid: this.activeid
            });
        };
        /**
         * Checks if all steps are complete. If they are, it dispatches a "wizardcomplete" event.
         * @private
         */
        this.emitComplete = () => {
            this.dispatchEvent(new CustomEvent("wizardcomplete", {
                bubbles: true
            }));
        };
    }
    /**
     * Called when the component is connected to the DOM.
     * @public
     */
    connectedCallback() {
        super.connectedCallback();
        Updates.enqueue(() => {
            this.stepIds = this.getStepIds();
            this.panelIds = this.getPanelIds();
            this.currentIndex = this.getActiveIndex();
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
    /**
     * Handles changes to the `activeid` property.
     * @public
     */
    activeidChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.prevActiveStepIndex = this.slottedsteps.findIndex((item) => item.id === oldValue);
            this.setSteps();
        }
    }
    /**
     * Handles changes to the `slottedpanels` property.
     * @public
     */
    slottedpanelsChanged() {
        if (this.$fastController.isConnected) {
            this.panelIds = this.getPanelIds();
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
     * Handles changes to the `currentIndex` property.
     * @public
     */
    currentIndexChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            Updates.enqueue(() => {
                this.prevActiveStepIndex = oldValue;
                this.stepIds = this.getStepIds();
                this.panelIds = this.getPanelIds();
                this.setComponent();
            });
        }
    }
    /**
     * Shows the wizard component
     * @public
     */
    show() {
        this.hidden = false;
    }
    /**
     * Hides the wizard component
     * @public
     */
    hide() {
        this.hidden = true;
    }
    /**
     * Enables a specific step in the wizard.
     * If no index is provided, the current step will be enabled.
     * @param index - The index of the step to enable.
     *
     * @public
     */
    enableStep(index) {
        if (this.currentIndex >= 0 && this.slottedsteps.length > 0) {
            this.slottedsteps[index !== null && index !== void 0 ? index : this.currentIndex].disabled = false;
        }
    }
    /**
     * Disables a step in the wizard.
     * @param index - The index of the step to disable. If not provided, the current step will be disabled.
     *
     * @public
     */
    disableStep(index) {
        if (this.currentIndex >= 0 && this.slottedsteps.length > 0) {
            this.slottedsteps[index !== null && index !== void 0 ? index : this.currentIndex].disabled = true;
        }
    }
    /**
     * Sets the state of the step to error.
     * @param index - The index of the step.
     *
     * @public
     */
    errorStep(index) {
        if (this.currentIndex >= 0 && this.slottedsteps.length > 0) {
            this.slottedsteps[index !== null && index !== void 0 ? index : this.currentIndex].state =
                WizardStepState.error;
        }
    }
    /**
     * Sets the state of the step to complete.
     * @param index - The index of the step.
     *
     * @public
     */
    completeStep(index) {
        if (this.currentIndex >= 0 && this.slottedsteps.length > 0) {
            this.slottedsteps[index !== null && index !== void 0 ? index : this.currentIndex].state =
                WizardStepState.complete;
            if (this.disableOnComplete) {
                this.disableStep(index);
            }
        }
    }
    /**
     * Sets the state of the step to incomplete.
     * @param index - The index of the step.
     *
     * @public
     */
    incompleteStep(index) {
        if (this.currentIndex >= 0 && this.slottedsteps.length > 0) {
            this.slottedsteps[index !== null && index !== void 0 ? index : this.currentIndex].state =
                WizardStepState.incomplete;
        }
    }
    /**
     * Retrieves the status of each step in the wizard.
     * @returns An array of step status objects, each containing the step ID, state, and index.
     *
     * @public
     */
    getStepStatus() {
        const stepStatus = [];
        if (this.slottedsteps.length > 0) {
            this.slottedsteps.forEach((step, index) => {
                stepStatus.push({
                    id: step.id,
                    state: step.state,
                    index: index,
                    active: step.active
                });
            });
        }
        return stepStatus;
    }
    /**
     * Resets the Wizard to its initial state.
     * @public
     */
    reset() {
        if (this.slottedsteps.length > 0) {
            this.slottedsteps.forEach((el, index) => {
                const step = el;
                step.state = WizardStepState.incomplete;
            });
            this.stepIds = this.getStepIds();
            this.panelIds = this.getPanelIds();
            this.currentIndex = 0;
            this.activeid = undefined;
            this.prevActiveStepIndex = -1;
        }
    }
    /**
     * Sets the active step of the wizard.
     *
     * @param step - The step to set as active.
     * @param event - Optional custom event that triggered the step change.
     *
     * @public
     */
    setActiveStep(step) {
        var _a;
        const index = step.index;
        const disabled = (_a = step.disabled) !== null && _a !== void 0 ? _a : false;
        if (disabled) {
            return;
        }
        step.active = true;
        this.activestep = step;
        this.activeid = this.stepIds[index];
        this.currentIndex = index;
        this.setComponent();
    }
    /**
     * Adds event listeners to each step in the wizard.
     * @protected
     */
    addListeners() {
        this.slottedsteps.forEach((step) => {
            step.addEventListener("stepchange", (e) => this.handleWizardStepStateChange(e));
        });
        this.slottedsteps.forEach((step) => {
            step.addEventListener("click", (e) => this.handleStepSelect(e));
        });
        this.slottedsteps.forEach((step) => {
            step.addEventListener("keydown", (e) => this.handleStepKeyDown(e));
        });
        this.slottedpanels.forEach((panel) => {
            panel.addEventListener("panelchange", (e) => this.handlePanelStateChange(e));
        });
    }
    /**
     * Removes event listeners to each step in the wizard.
     * @protected
     */
    removeListeners() {
        this.slottedsteps.forEach((step) => {
            step.removeEventListener("stepchange", (e) => this.handleWizardStepStateChange(e));
        });
        this.slottedsteps.forEach((step) => {
            step.removeEventListener("click", (e) => this.handleStepSelect(e));
        });
        this.slottedsteps.forEach((step) => {
            step.removeEventListener("keydown", (e) => this.handleStepKeyDown(e));
        });
        this.slottedpanels.forEach((panel) => {
            panel.removeEventListener("panelchange", (e) => this.handlePanelStateChange(e));
        });
    }
    /**
     * Sets the component's active step based on the current index.
     * @private
     */
    setComponent() {
        if (this.currentIndex && this.currentIndex !== this.prevActiveStepIndex) {
            Updates.enqueue(() => {
                this.stepIds = this.getStepIds();
                this.panelIds = this.getPanelIds();
            });
        }
    }
    /**
     * Gets the index of the active step.
     * @returns The index of the active step, or -1 if no step is active.
     *
     * @private
     */
    getActiveIndex() {
        var _a;
        const id = (_a = this.activeid) !== null && _a !== void 0 ? _a : "";
        if (id !== undefined) {
            return this.stepIds.indexOf(id) === -1 ? 0 : this.stepIds.indexOf(id);
        }
        else {
            return 0;
        }
    }
    /**
     * Gets the IDs of all steps in the wizard.
     *
     * @private
     */
    getStepIds() {
        return this.slottedsteps.map((step) => {
            var _a;
            return ((_a = step.getAttribute("id")) !== null && _a !== void 0 ? _a : `hwc-wizard-step-${parseInt(uniqueId())}`);
        });
    }
    /**
     * Gets the IDs of all steps in the wizard.
     * @private
     */
    getPanelIds() {
        return this.slottedpanels.map((panel) => {
            var _a;
            return ((_a = panel.getAttribute("id")) !== null && _a !== void 0 ? _a : `hwc-wizard-panel-${parseInt(uniqueId())}`);
        });
    }
    /**
     * Handles the state change of a step.
     * @param e - The custom event that contains the index and state of the step.
     *
     * @private
     */
    handleWizardStepStateChange(e) {
        const index = e.detail.index;
        const active = e.detail.active;
        if (active) {
            this.currentIndex = index;
        }
        this.slottedpanels[index].state = e.detail.state;
        this.setSteps();
    }
    /**
     * Handles the state change of a panel.
     * @param e - The custom event that contains the index and state of the panel.
     *
     * @private
     */
    handlePanelStateChange(e) {
        const index = e.detail.index;
        const active = e.detail.active;
        if (active) {
            this.currentIndex = index;
        }
        this.slottedsteps[index].state = e.detail.state;
        this.setSteps();
    }
}
__decorate([
    attr({ mode: "boolean" })
], Wizard.prototype, "ordered", void 0);
__decorate([
    attr({ mode: "boolean", attribute: "disable-on-complete" })
], Wizard.prototype, "disableOnComplete", void 0);
__decorate([
    attr({ attribute: "current-index", converter: nullableNumberConverter })
], Wizard.prototype, "currentIndex", void 0);
__decorate([
    attr({ attribute: "aria-labelledby" })
], Wizard.prototype, "ariaLabelledby", void 0);
__decorate([
    attr({ attribute: "aria-describedby" })
], Wizard.prototype, "ariaDescribedby", void 0);
__decorate([
    observable
], Wizard.prototype, "stepcontainer", void 0);
__decorate([
    observable
], Wizard.prototype, "panelcontainer", void 0);
__decorate([
    observable
], Wizard.prototype, "slottedsteps", void 0);
__decorate([
    observable
], Wizard.prototype, "slottedbuttons", void 0);
__decorate([
    observable
], Wizard.prototype, "slottedpanels", void 0);
__decorate([
    observable
], Wizard.prototype, "activeid", void 0);
//# sourceMappingURL=wizard.js.map