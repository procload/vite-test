import { FASTElement } from "@microsoft/fast-element";
import { Step } from "../step/step.js";
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
export declare class Stepper extends FASTElement {
    /**
     * Determines whether the step state indicator should be labeled with the order of the steps.
     * @public
     * @remarks
     * HTML Attribute: ordered
     */
    ordered?: boolean;
    /**
     * The current index
     * @public
     * @remarks
     * HTML Attribute: current-index
     */
    currentIndex: number;
    /**
     * The ID of the element that labels the stepper.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    ariaLabelledby?: string;
    /**
     * The ID of the element that describes the stepper.
     * @public
     * @remarks
     * HTML Attribute: aria-describedby
     */
    ariaDescribedby?: string;
    /**
     * The id of the active step
     * @public
     */
    activeid?: string;
    /**
     * An observable array of steps
     * Each step is an object with optional properties: title, state, details, index
     * @public
     */
    steps: {
        title: string;
        state: string | StepState;
        details: string;
    }[];
    /**
     * An array to hold the slotted Step components.
     * @type {Step[]}
     */
    slottedsteps: Step[];
    /**
     * The currently active Step component.
     * @type {HTMLElement | undefined}
     */
    activestep?: HTMLElement;
    /**
     * The index of the previously active Step component.
     * @type {number | undefined}
     */
    prevActiveStepIndex?: number;
    /**
     * An array to hold the IDs of the Step components.
     * @type {string[]}
     */
    private stepIds;
    /**
     * Shows the stepper component
     * @public
     */
    show(): void;
    /**
     * Hides the stepper component
     * @public
     */
    hide(): void;
    /**
     * Handles changes to the `activeid` property.
     * @public
     */
    activeidChanged(oldValue: string, newValue: string): void;
    /**
     * Handles changes to the `slottedsteps` property.
     * @public
     */
    slottedstepsChanged(): void;
    /**
     * Handles changes to the `steps` property.
     * @public
     */
    stepsChanged(oldValue: [], newValue: []): void;
    /**
     * Handles changes to the `currentIndex` property.
     * @public
     */
    currentIndexChanged(oldValue: number, newValue: number): void;
    /**
     * Sets the component's active step based on the current index.
     * @private
     */
    private setComponent;
    /**
     * Sets the steps for the stepper.
     * @protected
     */
    protected setSteps: () => void;
    /**
     * Gets the IDs of all steps in the stepper.
     * @private
     */
    private getStepIds;
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
     * Emits a custom event "stepperchange" whenever there is a change in the stepper.
     * The detail of the event includes the current steps, current index, and the previous active step index.
     * @private
     */
    private emitChange;
    /**
     * Checks if all steps are complete. If they are, it dispatches a "steppercomplete" event.
     * @private
     */
    private emitComplete;
    /**
     * Handles the state change of a step.
     * @param e - The custom event that contains the index and state of the step.
     *
     * @private
     */
    private handleStepStateChange;
    /**
     * Adds event listeners to each step in the stepper.
     * @public
     */
    protected addListeners(): void;
    /**
     * Removes event listeners to each step in the stepper.
     * @public
     */
    protected removeListeners(): void;
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
}
//# sourceMappingURL=stepper.d.ts.map