import { FASTElement } from "@microsoft/fast-element";
import { WizardPanel } from "../wizard-panel/wizard-panel.js";
import { WizardStep } from "../wizard-step/wizard-step.js";
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
export declare class Wizard extends FASTElement {
    /**
     * Determines whether the step state indicator should be labeled with the order of the steps.
     * @public
     * @remarks
     * HTML Attribute: ordered
     */
    ordered?: boolean;
    /**
     * Determines whether the step state indicator should be labeled with the order of the steps.
     * @public
     * @remarks
     * HTML Attribute: disable-on-complete
     */
    disableOnComplete?: boolean;
    /**
     * The current index
     * @public
     * @remarks
     * HTML Attribute: current-index
     */
    currentIndex: number;
    /**
     * The ID of the element that labels the wizard.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    ariaLabelledby?: string;
    /**
     * The ID of the element that describes the wizard.
     * @public
     * @remarks
     * HTML Attribute: aria-describedby
     */
    ariaDescribedby?: string;
    /**
     * The reference to the step container element
     * @public
     */
    stepcontainer: HTMLElement;
    /**
     * The reference to the panel container element
     * @public
     */
    panelcontainer: HTMLElement;
    /**
     * An array to hold the slotted WizardStep components.
     * @type {WizardStep[]}
     *
     * @public
     */
    slottedsteps: WizardStep[];
    /**
     * Array of HTMLButtonElement representing the slotted buttons in the wizard component.
     * @type {HTMLButtonElement[]}
     *
     * @public
     */
    slottedbuttons: HTMLButtonElement[];
    /**
     * An array to hold the slotted Wizard Panel components.
     * @type {WizardPanel[]}
     *
     * @public
     */
    slottedpanels: WizardPanel[];
    /**
     * The id of the active step
     * @private
     */
    private activeid?;
    /**
     * The currently active WizardStep component.
     * @type {HTMLElement | undefined}
     *
     * @private
     */
    private activestep?;
    /**
     * The index of the previously active WizardStep component.
     * @type {number | undefined}
     *
     * @private
     */
    private prevActiveStepIndex?;
    /**
     * An array to hold the IDs of the WizardStep components.
     * @type {string[]}
     *
     * @private
     */
    private stepIds;
    /**
     * An array to hold the IDs of the WizardPanel components.
     * @type {string[]}
     *
     * @private
     */
    private panelIds;
    /**
     * Called when the component is connected to the DOM.
     * @public
     */
    connectedCallback(): void;
    /**
     * Called when the component is disconnected from the DOM.
     * @public
     */
    disconnectedCallback(): void;
    /**
     * Handles changes to the `activeid` property.
     * @public
     */
    activeidChanged(oldValue: string, newValue: string): void;
    /**
     * Handles changes to the `slottedpanels` property.
     * @public
     */
    slottedpanelsChanged(): void;
    /**
     * Handles changes to the `slottedsteps` property.
     * @public
     */
    slottedstepsChanged(): void;
    /**
     * Handles changes to the `currentIndex` property.
     * @public
     */
    currentIndexChanged(oldValue: number, newValue: number): void;
    /**
     * Shows the wizard component
     * @public
     */
    show(): void;
    /**
     * Hides the wizard component
     * @public
     */
    hide(): void;
    /**
     * Enables a specific step in the wizard.
     * If no index is provided, the current step will be enabled.
     * @param index - The index of the step to enable.
     *
     * @public
     */
    enableStep(index?: number): void;
    /**
     * Disables a step in the wizard.
     * @param index - The index of the step to disable. If not provided, the current step will be disabled.
     *
     * @public
     */
    disableStep(index?: number): void;
    /**
     * Sets the state of the step to error.
     * @param index - The index of the step.
     *
     * @public
     */
    errorStep(index?: number): void;
    /**
     * Sets the state of the step to complete.
     * @param index - The index of the step.
     *
     * @public
     */
    completeStep(index?: number): void;
    /**
     * Sets the state of the step to incomplete.
     * @param index - The index of the step.
     *
     * @public
     */
    incompleteStep(index?: number): void;
    /**
     * Retrieves the status of each step in the wizard.
     * @returns An array of step status objects, each containing the step ID, state, and index.
     *
     * @public
     */
    getStepStatus(): {
        id: string;
        state: string;
        index: number;
        active: boolean;
    }[];
    /**
     * Resets the Wizard to its initial state.
     * @public
     */
    reset(): void;
    /**
     * Moves to the next step in the wizard.
     * @public
     */
    next: () => void;
    /**
     * Moves to the previous step in the wizard.
     * @public
     */
    previous: () => void;
    /**
     * Sets the active step of the wizard.
     *
     * @param step - The step to set as active.
     * @param event - Optional custom event that triggered the step change.
     *
     * @public
     */
    setActiveStep(step: WizardStep): void;
    /**
     * Moves the focus to the next step in the wizard.
     *
     * @param setActive - Whether to set the next step as the active step.
     *
     * @public
     */
    focusNextStep: (setActive?: boolean) => void;
    /**
     * Moves the focus to the previous step in the wizard.
     * @param setActive - Whether to set the previous step as the active step.
     *
     * @public
     */
    focusPreviousStep: (setActive?: boolean) => void;
    /**
     * Moves to a specific step in the Wizard by its index.
     * @param index - The index of the step to move to.
     * @public
     */
    moveToStepByIndex: (index: number) => void;
    /**
     * Handles the keydown event on the step container.
     *
     * @param event - The keydown event.
     *
     * @public
     */
    handleStepContainerKeydown: (event: KeyboardEvent) => void;
    /**
     * Handles the keydown event on a step.
     *
     * @param event - The keydown event.
     *
     * @public
     */
    handleStepKeyDown: (event: KeyboardEvent) => void;
    /**
     * Sets the steps for the wizard.
     * @protected
     */
    protected setSteps: () => void;
    /**
     * Sets the panels of the wizard component.
     * @protected
     */
    protected setPanels: () => void;
    /**
     * Adds event listeners to each step in the wizard.
     * @protected
     */
    protected addListeners(): void;
    /**
     * Removes event listeners to each step in the wizard.
     * @protected
     */
    protected removeListeners(): void;
    /**
     * Sets the component's active step based on the current index.
     * @private
     */
    private setComponent;
    /**
     * Gets the index of the active step.
     * @returns The index of the active step, or -1 if no step is active.
     *
     * @private
     */
    private getActiveIndex;
    /**
     * Gets the IDs of all steps in the wizard.
     *
     * @private
     */
    private getStepIds;
    /**
     * Gets the IDs of all steps in the wizard.
     * @private
     */
    private getPanelIds;
    /**
     * Checks if the given element is disabled.
     * @private
     */
    private isDisabledElement;
    /**
     * Checks if the given element is hidden.
     * @private
     */
    private isHiddenElement;
    /**
     * Checks if the given element is focusable.
     * @private
     */
    private isFocusableElement;
    /**
     * Handles the state change of a step.
     * @param e - The custom event that contains the index and state of the step.
     *
     * @private
     */
    private handleWizardStepStateChange;
    /**
     * Handles the state change of a panel.
     * @param e - The custom event that contains the index and state of the panel.
     *
     * @private
     */
    private handlePanelStateChange;
    /**
     * Handles the selection of a step in the wizard.
     *
     * @param event - The event object representing the step selection.
     *
     * @private
     */
    private handleStepSelect;
    /**
     * Emits a custom event "wizardchange" whenever there is a change in the wizard.
     * @private
     */
    private emitChange;
    /**
     * Checks if all steps are complete. If they are, it dispatches a "wizardcomplete" event.
     * @private
     */
    private emitComplete;
}
//# sourceMappingURL=wizard.d.ts.map