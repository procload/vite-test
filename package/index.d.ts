import * as _microsoft_fast_element from '@microsoft/fast-element';
import { FASTElement, ElementViewTemplate } from '@microsoft/fast-element';
import { ValuesOf } from '@microsoft/fast-foundation';

declare type size = "small" | "medium" | "large";
declare class HelloWorld extends FASTElement {
    size?: size;
    disabled: boolean;
    disabledChanged(): void;
}

declare const HelloWorldDefinition: _microsoft_fast_element.FASTElementDefinition<typeof HelloWorld>;

declare const styles$a: _microsoft_fast_element.ElementStyles;

declare const template$a: _microsoft_fast_element.ViewTemplate<HelloWorld, any>;

/**
 * A class representing a MultiView.
 * @class
 * @extends FASTElement
 */
declare class MultiView extends FASTElement {
    /**
     * Determines the hidden state of the multi-view
     * @public
     * @remarks
     * HTML Attribute: hidden
     * @type {boolean}
     */
    hidden: boolean;
    hiddenChanged(oldValue: string, newValue: string): void;
}

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-multi-view>
 */
declare const definition$8: _microsoft_fast_element.FASTElementDefinition<typeof MultiView>;

/** MultiView styles
 * @public
 */
declare const styles$9: _microsoft_fast_element.ElementStyles;

declare const template$9: ElementViewTemplate<MultiView>;

/**
 * A MultiViewController Component to be used with MultiViewGroup.
 * @public
 */
declare class MultiViewController extends FASTElement {
}

/**
 *
 * @public
 * @remarks
 * HTML Element: <fluent-multi-view-controller>
 */
declare const definition$7: _microsoft_fast_element.FASTElementDefinition<typeof MultiViewController>;

declare const styles$8: _microsoft_fast_element.ElementStyles;

declare const template$8: ElementViewTemplate<MultiViewController>;

/**
 * A MultiViewGroup Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#tablist | ARIA tablist }.
 *
 * @slot start - Content which can be provided before the multi-view-controllers element
 * @slot end - Content which can be provided after the multi-view-controllers element
 * @slot controllers - The slot for controllers
 * @slot multiViews - The slot for multiViews
 * @fires change - Fires a custom 'change' event when a multiView controller is clicked or during keyboard navigation
 * @extends FASTElement
 *
 * @public
 */
declare class MultiViewGroup extends FASTElement {
    /**
     * Method to be called when the component is inserted into the document.
     */
    connectedCallback(): void;
    /**
     * Method to be called when the component is removed from the document.
     */
    disconnectedCallback(): void;
    initialize(): void;
    /**
     * An observable array of HTML elements that represent multiViews.
     */
    multiViews: HTMLElement[];
    /**
     * An observable array of HTML elements that represent controllers.
     */
    controllers: HTMLElement[];
    /**
     * A reference to the controllers container
     */
    controllersContainer: HTMLElement;
    /**
     * An observable array of HTML elements that represent opened multiViews.
     */
    openedMultiViews: HTMLElement[];
    /**
     * The previously opened MultiView
     */
    previouslyOpenedMultiView: MultiView | null;
    /**
     * A string representing the active ID.
     */
    private activeid;
    /**
     * A HTML element representing the active controller.
     */
    private activeController?;
    /**
     * A number representing the index of the previously active controller.
     */
    private prevActiveControllerIndex;
    /**
     * A number representing the index of the active controller.
     */
    private activeControllerIndex;
    /**
     * An array of strings that represent the IDs of the controllers.
     */
    private controllerIds;
    /**
     * An array of strings that represent the IDs of the multiViews.
     */
    private multiViewsIds;
    /**
     * Method to open a multiView.
     * @param {MultiView} multiView - The multiView to open.
     */
    openMultiView: (multiView: MultiView) => void;
    /**
     * Manages opened MultiViews by limiting the number of opened views
     * and setting focus on the newly opened MultiView.
     *
     * @param {MultiView} multiView - The MultiView to manage.
     * @param {CustomEvent} [event] - The event that triggered the managing of the MultiView.
     * @public
     */
    manageOpenedMultiViews: (multiView: MultiView, event?: CustomEvent) => void;
    /**
     * Limits the number of opened MultiViews. If there are more than one MultiViews opened,
     * it will remove the attribute "data-flexposition" from the first opened MultiView and hide it.
     * @public
     */
    limitNumberOfOpenMultiViews(): void;
    /**
     * Manages the opening of a second MultiView. It will set the "data-flexposition" attribute of the second MultiView,
     * limit the number of opened MultiViews if necessary, and add the second MultiView to the list of opened MultiViews.
     *
     * @param {MultiView} multiView - The MultiView to open.
     * @public
     */
    manageOpeningSecondMultiView: (multiView: MultiView) => void;
    /**
     * Method to open the second multiView.
     */
    openSecondMultiView: (multiView: MultiView) => void;
    /**
     * Method to close a multiView.
     * @param {MultiView} multiView - The multiView to close.
     */
    closeMultiView: (multiView: MultiView) => void;
    manageClosedMultiViews: (multiView: MultiView) => void;
    /**
     * Method to close all opened multiViews.
     */
    closeAllMultiViews: () => void;
    /**
     * Method to toggle a multiView.
     * @param {MultiView} multiView - The multiView to toggle.
     */
    toggleMultiView: (multiView: MultiView) => void;
    /**
     * Method to be called when the active ID changes.
     * @param {string} oldValue - The previous value of the active ID.
     * @param {string} newValue - The new value of the active ID.
     */
    activeidChanged(oldValue: string, newValue: string): void;
    /**
     * Method to be called when controllers changes.
     */
    controllersChanged(): void;
    /**
     * Method to be called when multiViews changes.
     */
    multiViewsChanged(): void;
    /**
     * Method to be called when opendedMultiViews changes.
     */
    openedMultiViewsChanged(): void;
    /**
     * Removes a given multiView from the collection of opened multiViews.
     * @private
     * @param {MultiView} multiViewToRemove - The multiView to remove.
     */
    private removeMultiViewFromOpenedMultiViews;
    /**
     * Adds a given multiView to the collection of opened multiViews, unless it's already present.
     * @private
     * @param {MultiView} multiViewToAdd - The multiView to add.
     */
    private addMultiViewToOpenedMultiViews;
    /**
     * Triggers a change event with the currently opened multiViews.
     * @private
     */
    private change;
    private isDisabledElement;
    private isHiddenElement;
    private isFocusableElement;
    private isValidMultiViewState;
    /**
     * Returns the active index based on the activeid property, falls back to 0 if all elements are hidden.
     * @private
     * @returns {number} - The active index.
     */
    private getActiveIndex;
    /**
     * Sets attributes for controllers and determines the active controller.
     * @private
     */
    private setControllers;
    /**
     * Sets attributes for multiViews and determines which multiViews are hidden.
     * @private
     */
    private setMultiViews;
    /**
     * Unsets active controller for focus handling
     * @private
     */
    private unsetActiveToggleButton;
    /**
     * Returns an array of IDs for the controllers.
     * @private
     * @returns {Array<string>} - The IDs of the controllers.
     */
    private getControllerIds;
    /**
     * Returns an array of IDs for the multiViews.
     * @private
     * @returns {Array<string>} - The IDs of the multiViews.
     */
    private getMultiViewIds;
    /**
     * Triggers a change if the active controller index has changed.
     * @private
     */
    private setComponent;
    /**
     * Handles click events on the controllers.
     * @private
     * @param {MouseEvent} event - The click event.
     */
    private handleControllerClick;
    /**
     * Handles keydown events on the controller.
     * @param {KeyboardEvent} event The event object.
     * @private
     */
    private handleControllerKeyDown;
    /**
     * Handles keydown events on the controller.
     * @param {KeyboardEvent} event The event object.
     * @private
     */
    private handleMultiViewKeyDown;
    /**
     * Handles keydown events on the controller.
     * @param {KeyboardEvent} event The event object.
     * @private
     */
    handleToggleButtonContainerKeyDown: (event: KeyboardEvent) => void;
    /**
     * Handles blur events on the controller.
     * @param {FocusEvent} event The event object.
     * @public
     */
    handleControllerBlur(event: FocusEvent): void;
    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    private adjust;
    /**
     * Adjusts the active controller forward.
     * @param {KeyboardEvent} e The event object.
     * @private
     */
    private adjustForward;
    /**
     * Adjusts the active controller backward.
     * @param {KeyboardEvent} e The event object.
     * @private
     */
    private adjustBackward;
    /**
     * Moves the focus to the controller at the specified index.
     * @param {HTMLElement[]} group The array of controllers.
     * @param {number} index The index of the controller to focus.
     * @private
     */
    private moveToToggleButtonByIndex;
    /**
     * Sets the specified attributes on the given HTML element.
     * @param {HTMLElement} element The HTML element on which to set attributes.
     * @param {{[key: string]: string}} attributes An object mapping attribute names to values.
     * @private
     */
    private setAttributes;
    /**
     * Adds event listeners to the controllers and multiViews.
     *
     * @returns {void}
     */
    private addEventListeners;
    /**
     * Removes event listeners from the controllers.
     *
     * @returns {void}
     */
    private removeEventListeners;
}

/**
 *
 * @public
 * @remarks
 * HTML Element: <fluent-multi-view-group>
 */
declare const definition$6: _microsoft_fast_element.FASTElementDefinition<typeof MultiViewGroup>;

/** PaneSwitcher styles
 * @public
 */
declare const styles$7: _microsoft_fast_element.ElementStyles;

declare const template$7: ElementViewTemplate<MultiViewGroup>;

/**
 * The state variations for the Step component
 * @public
 */
declare const StepState: {
    readonly incomplete: "incomplete";
    readonly complete: "complete";
    readonly error: "error";
};
/**
 * The state types for the Step component
 * @public
 */
declare type StepState = ValuesOf<typeof StepState>;

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
declare class Step extends FASTElement {
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

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-step>
 */
declare const definition$5: _microsoft_fast_element.FASTElementDefinition<typeof Step>;

/** Step styles
 * @public
 */
declare const styles$6: _microsoft_fast_element.ElementStyles;

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
declare class WizardStep extends Step {
    /**
     * Handles the keydown event for the wizard step.
     * @param {KeyboardEvent} event - The keyboard event object.
     * @returns {void}
     */
    keydownHandler(event: KeyboardEvent): void;
}

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-wizard-step>
 */
declare const definition$4: _microsoft_fast_element.FASTElementDefinition<typeof WizardStep>;

/** Wizard Step styles
 * @public
 */
declare const styles$5: _microsoft_fast_element.ElementStyles;

/**
 * The template for the {@link @horizon-msft/web-components#(WizardStep:class)} component.
 * @public
 */
declare const template$6: ElementViewTemplate<WizardStep>;

declare const template$5: ElementViewTemplate<Step>;

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
declare class Stepper extends FASTElement {
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

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-step>
 */
declare const definition$3: _microsoft_fast_element.FASTElementDefinition<typeof Stepper>;

/** Step styles
 * @public
 */
declare const styles$4: _microsoft_fast_element.ElementStyles;

declare const template$4: ElementViewTemplate<Stepper>;

declare class SvgIcon extends FASTElement {
    private computedStylesheet?;
    private isLoading;
    private isError;
    /**
     * The name of the SVG to use from the SVG sprite.
     * @public
     * @remarks
     * HTML Attribute: name
     * @type {string}
     */
    name: string;
    nameChanged(): void;
    /**
     * The size of the icon. Value must match icon size as indicated in its name.
     * @public
     * @remarks
     * HTML Attribute: size
     * @type {string}
     */
    size: string;
    sizeChanged(): void;
    /**
     * Path to SVG. Can be standalone SVG or SVG sprite.
     * @public
     * @remarks
     * HTML Attribute: path
     * @type {string}
     */
    path: string;
    pathChanged(): void;
    /**
     * Whether the icon is hidden from screen readers. Defaults to true.
     * @public
     * @remarks
     * HTML Attribute: aria-hidden
     * @type {string}
     */
    ariaHidden: string;
    /**
     * Optional label for the icon. Emitted via aria-label.
     * @public
     * @remarks
     * HTML Attribute: label
     * @type {string}
     */
    ariaLabel: string | null;
    /**
     * Whether the icon is focusable. Defaults to false.
     * @public
     * @remarks
     * HTML Attribute: focusable
     * @type {string}
     */
    focusable: string | null;
    /**
     * The role of the icon. Defaults to null.
     * @public
     * @remarks
     * HTML Attribute: role
     * @type {string}
     */
    role: string | null;
    private renderResolver;
    private renderPromise;
    connectedCallback(): void;
    private checkAndResolveRenderPromise;
    private renderIcon;
    private renderErrorIcon;
    private updateComputedStylesheet;
    private updateSvgAttributes;
}

declare const SvgIconDefinition: _microsoft_fast_element.FASTElementDefinition<typeof SvgIcon>;

declare const styles$3: _microsoft_fast_element.ElementStyles;

declare const template$3: _microsoft_fast_element.ViewTemplate<SvgIcon, any>;

/**
 * @public
 * The size variations for the teaching bubble component.
 */
declare const TeachingBubbleSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * @public
 * The size types for the teaching bubble component.
 */
declare type TeachingBubbleSize = ValuesOf<typeof TeachingBubbleSize>;
declare const TeachingBubblePlacement: {
    readonly top: "top";
    readonly bottom: "bottom";
    readonly left: "left";
    readonly right: "right";
    readonly topStart: "top-start";
    readonly topEnd: "top-end";
    readonly bottomStart: "bottom-start";
    readonly bottomEnd: "bottom-end";
    readonly leftStart: "left-start";
    readonly leftEnd: "left-end";
    readonly rightStart: "right-start";
    readonly rightEnd: "right-end";
};
declare type TeachingBubblePlacement = ValuesOf<typeof TeachingBubblePlacement>;

/**
 * A TeachingBubble Custom HTML Element.
 * @public
 * @class
 * @extends FASTElement
 *
 * @remarks
 * HTML Element: \<hwc-teaching-bubble\>
 * Roles: Implements {@link https://www.w3.org/TR/wai-aria-1.1/#tooltip | ARIA tooltip } on internal container.
 * Composition: TeachingBubble
 *
 * @slot default - The slot for bubble content
 * @slot footer - The slot for bubble footer
 * @slot close - The slot for close button
 * @slot image - The slot for image
 * @slot heading - The slot for heading
 *
 * @attr {string} target - The ID of the element that the teaching bubble is attached to.
 * @attr {TeachingBubblePlacement} placement - The placement of the teaching bubble relative to the target.
 * @attr {boolean} open - Determines whether the teaching bubble is open.
 * @attr {boolean} disable-trap-focus - Determines whether focus trapping is disabled.
 * @attr {TeachingBubbleSize} size - The size of the teaching bubble.
 *
 * @csspart content - The content container for the teaching bubble
 * @csspart footer - The footer container for the teaching bubble
 * @csspart heading - The heading container for the teaching bubble
 * @csspart close - The close button container for the teaching bubble
 * @csspart image - The image container for the teaching bubble
 * @csspart arrow - The arrow container for the teaching bubble
 *
 * @fires openchange - Fires a custom 'openchange' event when the open state changes
 * @fires dismiss - Fires a custom 'dismiss' event when the teaching bubble is dismissed
 *
 * @public
 */
declare class TeachingBubble extends FASTElement {
    /**
     * @public
     * Method gets called when the component is inserted into the document.
     */
    connectedCallback(): void;
    /**
     * @public
     * Method to perform cleanup tasks.
     */
    disconnectedCallback(): void;
    /**
     * The target element that the teaching bubble is attached to.
     * @type {string}
     * @default ""
     */
    readonly target: string;
    /**
     * The placement of the teaching bubble relative to the target.
     * @type {string}
     *
     */
    readonly placement?: TeachingBubblePlacement;
    /**
     * Determines whether the teaching bubble is open or not.
     * @type {boolean}
     */
    open?: boolean;
    /**
     * Determines whether focus trapping is disabled or not.
     * @type {boolean}
     */
    disableTrapFocus?: boolean;
    /**
     * The size of the teaching bubble.
     * @type {TeachingBubbleSize}
     */
    readonly size?: TeachingBubbleSize;
    /**
     * The target element that the teaching bubble is attached to.
     * @type {HTMLElement | null}
     */
    private targetEl?;
    /**
     * The current element that has focus within the teaching bubble.
     * @type {HTMLElement | null}
     */
    private currentEl?;
    /**
     * The arrow element of the teaching bubble.
     * @type {HTMLElement | null}
     */
    private arrowEl?;
    /**
     * Determines whether the teaching bubble is currently trapping focus or not.
     * @type {boolean}
     */
    private isTrappingFocus;
    /**
     * Determines whether the teaching bubble should trap focus or not.
     * @type {boolean}
     */
    private trapFocus;
    /**
     * Useful for cleanup task of floating UI auto update from dom.
     * @type {boolean}
     */
    private cleanAutoUpdate;
    /**
     * @public
     * Method to show bubble.
     */
    show: () => void;
    /**
     * @public
     * Method to hide bubble.
     * @param dismiss - Determines whether the teaching bubble should be dismissed or not.
     */
    hide: (dismiss?: boolean) => void;
    /**
     * @public
     * Method called when the 'open' attribute changes.
     */
    openChanged(): void;
    private renderResolver;
    private renderPromise;
    /**
     * @private
     * Method to set the target, current and arrow elements.
     */
    private setElements;
    /**
     * @private
     * Method to update position when element is rendered in the dom.
     */
    private updatePosition;
    /**
     * @private
     * Handles keydown events on the document
     * @param e - The keydown event
     */
    private handleDocumentKeydown;
    /**
     * @private
     * Handles tab keydown events
     * @param e - The keydown event
     */
    private handleTabKeyDown;
    /**
     * @private
     * Gets the bounds of the tab queue
     * @returns (HTMLElement | SVGElement)[]
     */
    private getTabQueueBounds;
    /**
     * @private
     * Reduces the list of tabbable items
     * @param elements - The current list of elements
     * @param element - The element to consider adding to the list
     * @returns HTMLElement[]
     */
    private static reduceTabbableItems;
    /**
     * @private
     * Determines if an element is a focusable FASTElement
     * @param element - The element to check
     * @returns boolean
     */
    private static isFocusableFastElement;
    /**
     * @private
     * Determines if an element has a tabbable shadow
     * @param element - The element to check
     * @returns boolean
     */
    private static hasTabbableShadow;
    /**
     * @private
     * Updates the state of focus trapping
     * @param shouldTrapFocusOverride - Optional override for whether focus should be trapped
     */
    private updateTrapFocus;
    /**
     * @private
     * Handles focus events on the document
     * @param e - The focus event
     */
    private handleDocumentFocus;
    /**
     * @private
     * Focuses the first element in the tab queue
     */
    private focusFirstElement;
    /**
     * @private
     * Determines if focus should be forced
     * @param currentFocusElement - The currently focused element
     * @returns boolean
     */
    private shouldForceFocus;
    /**
     * @private
     * Determines if focus should be trapped
     * @returns boolean
     */
    private shouldTrapFocus;
    /**
     * @private
     * Method to check if attribute 'disable-trap-focus' is present or not.
     */
    private disableTrapFocusHandler;
    /**
     * @private
     * Method to initialize the position of bubble.
     */
    private initializePosition;
}

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-teaching-bubble>
 */
declare const definition$2: _microsoft_fast_element.FASTElementDefinition<typeof TeachingBubble>;

declare const styles$2: _microsoft_fast_element.ElementStyles;

declare const template$2: ElementViewTemplate<TeachingBubble>;

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
declare class WizardPanel extends FASTElement {
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
    state: StepState;
    /**
     * Indicates whether the step is active.
     * @public
     */
    active?: boolean;
    /**
     * Handles the change in the state of the step.
     * @public
     */
    stateChanged(oldValue: StepState, newValue: StepState): void;
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
declare class Wizard extends FASTElement {
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

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-wizard>
 */
declare const definition$1: _microsoft_fast_element.FASTElementDefinition<typeof Wizard>;

/** Wizard styles
 * @public
 */
declare const styles$1: _microsoft_fast_element.ElementStyles;

declare const template$1: ElementViewTemplate<Wizard>;

/**
 *
 * @public
 * @remarks
 * HTML Element: <hwc-wizard-panel>
 */
declare const definition: _microsoft_fast_element.FASTElementDefinition<typeof WizardPanel>;

/** Wizard Panel styles
 * @public
 */
declare const styles: _microsoft_fast_element.ElementStyles;

declare const template: ElementViewTemplate<WizardPanel>;

export { HelloWorld, HelloWorldDefinition, MultiView, MultiViewController, definition$7 as MultiViewControllerDefinition, definition$8 as MultiViewDefinition, MultiViewGroup, definition$6 as MultiViewGroupDefinition, Step, definition$5 as StepDefinition, StepState, Stepper, definition$3 as StepperDefinition, SvgIcon, SvgIconDefinition, TeachingBubble, definition$2 as TeachingBubbleDefinition, TeachingBubblePlacement, TeachingBubbleSize, Wizard, definition$1 as WizardDefinition, WizardPanel, definition as WizardPanelDefinition, WizardStep, definition$4 as WizardStepDefinition, StepState as WizardStepState, styles$8 as multiViewControllerStyles, template$8 as multiViewControllerTemplate, styles$7 as multiViewGroupStyles, template$7 as multiViewGroupTemplate, styles$9 as multiViewStyles, template$9 as multiViewTemplate, type size, styles$6 as stepStyles, template$5 as stepTemplate, styles$4 as stepperStyles, template$4 as stepperTemplate, styles$5 as styles, styles$3 as svgIconStyles, template$3 as svgIconTemplate, styles$2 as teachingBubbleStyles, template$2 as teachingBubbleTemplate, template$6 as template, styles$a as textStyles, template$a as textTemplate, styles as wizardPanelStyles, template as wizardPanelTemplate, styles$1 as wizardStyles, template$1 as wizardTemplate };
