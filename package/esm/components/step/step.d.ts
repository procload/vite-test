import { FASTElement } from "@microsoft/fast-element";
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
export declare class Step extends FASTElement {
    /**
     * Indicates whether the connector should be hidden.
     * @public
     */
    ordered?: boolean;
    /**
     * Indicates whether the connector should be hidden.
     * @public
     */
    hideConnector?: boolean;
    /**
     * Indicates whether the step is active.
     * @public
     */
    active: boolean;
    /**
     * Indicates whether the step is disabled.
     * @public
     */
    disabled?: boolean;
    /**
     * The ID of the element that describes the step.
     * @public
     */
    ariaDescribedby?: string;
    /**
     * The ID of the element that labels the step.
     * @public
     */
    ariaLabelledby?: string;
    /**
     * The state of the step.
     * @public
     */
    state: StepState | string;
    /**
     * The index of the step within the parent Stepper component.
     * @public
     */
    index: number;
    /**
     * The details of the step.
     * @public
     */
    details: string;
    /**
     * The title of the step.
     * @public
     */
    title: string;
    /**
     * Handles the change in the state of the step.
     * @public
     */
    stateChanged(oldValue: StepState, newValue: StepState): void;
    /**
     * Handles change to the active property.
     * @public
     */
    activeChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Toggle the ative state of the step.
     * @public
     */
    toggleActive(): void;
    /**
     * Sets the state of the step to 'complete'.
     * @public
     */
    setComplete(): void;
    /**
     * Sets the state of the step to 'incomplete'.
     * @public
     */
    setIncomplete(): void;
    /**
     * Sets the state of the step to 'error'.
     * @public
     */
    setError(): void;
    /**
     * Emits a stepchange event with the current step's details.
     * @public
     */
    emitChange(): void;
}
//# sourceMappingURL=step.d.ts.map