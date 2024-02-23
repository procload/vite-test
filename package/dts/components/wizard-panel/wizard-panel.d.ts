import { FASTElement } from "@microsoft/fast-element";
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
export declare class WizardPanel extends FASTElement {
    /**
     * The index of the wizard panel.
     */
    index?: number;
    /**
     * Indicates whether the panel is hidden.
     * @public
     */
    hidden: boolean;
    /**
     * The state of the step.
     * @public
     */
    state: WizardStepState;
    /**
     * Indicates whether the step is active.
     * @public
     */
    active?: boolean;
    /**
     * Handles the change in the state of the step.
     * @public
     */
    stateChanged(oldValue: WizardStepState, newValue: WizardStepState): void;
    /**
     * Called when the `active` property changes.
     * @public
     */
    activeChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Called when the `hidden` property changes.
     * @public
     */
    hiddenChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Shows the wizard panel.
     * @public
     */
    show(): void;
    /**
     * Hides the wizard panel.
     * @public
     */
    hide(): void;
    /**
     * Emits a panelChange event with the current panel's details.
     * @public
     */
    emitChange(): void;
}
//# sourceMappingURL=wizard-panel.d.ts.map