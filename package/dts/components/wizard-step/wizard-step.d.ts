import { Step } from "../step/step";
/**
 * An interactive WizardStep Custom HTML Element composed with the wizard and wizard panel.
 *
 * @public
 * @class
 * @extends FASTElement
 *
 * @remarks
 * HTML Element: \<wizard-step\>
 * Role: {@link https://www.w3.org/TR/wai-aria-1.1/#tab | ARIA tab }
 * Composition: Wizard, WizardStep, WizardPanel
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
export declare class WizardStep extends Step {
    /**
     * Handles the keydown event for the wizard step.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {void}
     */
    keydownHandler(event: KeyboardEvent): void;
}
//# sourceMappingURL=wizard-step.d.ts.map