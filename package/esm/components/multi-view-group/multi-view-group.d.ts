import { FASTElement } from "@microsoft/fast-element";
import { MultiView } from "../multi-view";
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
export declare class MultiViewGroup extends FASTElement {
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
//# sourceMappingURL=multi-view-group.d.ts.map