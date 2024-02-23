var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FASTElement, observable, Updates } from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp, keyEnd, keyEnter, keyEscape, keyHome, keySpace, keyTab, limit, uniqueId, } from "@microsoft/fast-web-utilities";
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
export class MultiViewGroup extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * An observable array of HTML elements that represent multiViews.
         */
        this.multiViews = [];
        /**
         * An observable array of HTML elements that represent controllers.
         */
        this.controllers = [];
        /**
         * An observable array of HTML elements that represent opened multiViews.
         */
        this.openedMultiViews = [];
        /**
         * The previously opened MultiView
         */
        this.previouslyOpenedMultiView = null;
        /**
         * A string representing the active ID.
         */
        this.activeid = "";
        /**
         * A number representing the index of the previously active controller.
         */
        this.prevActiveControllerIndex = 0;
        /**
         * A number representing the index of the active controller.
         */
        this.activeControllerIndex = 0;
        /**
         * An array of strings that represent the IDs of the controllers.
         */
        this.controllerIds = [];
        /**
         * An array of strings that represent the IDs of the multiViews.
         */
        this.multiViewsIds = [];
        /**
         * Method to open a multiView.
         * @param {MultiView} multiView - The multiView to open.
         */
        this.openMultiView = (multiView) => {
            if (multiView.hidden) {
                this.closeAllMultiViews();
                multiView.hidden = false;
                this.manageOpenedMultiViews(multiView);
            }
        };
        /**
         * Manages opened MultiViews by limiting the number of opened views
         * and setting focus on the newly opened MultiView.
         *
         * @param {MultiView} multiView - The MultiView to manage.
         * @param {CustomEvent} [event] - The event that triggered the managing of the MultiView.
         * @public
         */
        this.manageOpenedMultiViews = (multiView, event) => {
            this.addMultiViewToOpenedMultiViews(multiView);
            if (this.openedMultiViews.length >= 2) {
                this.limitNumberOfOpenMultiViews();
            }
            Updates.enqueue(() => multiView.focus());
            this.setComponent();
        };
        /**
         * Manages the opening of a second MultiView. It will set the "data-flexposition" attribute of the second MultiView,
         * limit the number of opened MultiViews if necessary, and add the second MultiView to the list of opened MultiViews.
         *
         * @param {MultiView} multiView - The MultiView to open.
         * @public
         */
        this.manageOpeningSecondMultiView = (multiView) => {
            multiView.setAttribute("data-flexposition", "2");
            if (this.openedMultiViews.length >= 2) {
                this.limitNumberOfOpenMultiViews();
            }
            const multiViewToOpen = this.multiViews[this.activeControllerIndex];
            if (multiViewToOpen.hidden) {
                this.addMultiViewToOpenedMultiViews(multiViewToOpen);
                if (this.previouslyOpenedMultiView) {
                    this.previouslyOpenedMultiView.removeAttribute("data-flexposition");
                }
                multiViewToOpen.setAttribute("data-flexposition", "2");
            }
        };
        /**
         * Method to open the second multiView.
         */
        this.openSecondMultiView = (multiView) => {
            if (multiView.hidden) {
                this.manageOpeningSecondMultiView(multiView);
                multiView.hidden = false;
                Updates.enqueue(() => multiView.focus());
                this.previouslyOpenedMultiView = multiView;
            }
        };
        /**
         * Method to close a multiView.
         * @param {MultiView} multiView - The multiView to close.
         */
        this.closeMultiView = (multiView) => {
            if (!multiView.hidden) {
                this.manageClosedMultiViews(multiView);
                multiView.hidden = true;
            }
        };
        this.manageClosedMultiViews = (multiView) => {
            if (multiView.hasAttribute("data-flexposition")) {
                multiView.removeAttribute("data-flexposition");
            }
            this.openedMultiViews = this.openedMultiViews.filter((openedMultiView) => openedMultiView !== multiView);
            const closedMultiViewIndex = this.multiViews.indexOf(multiView);
            this.controllers[closedMultiViewIndex].focus();
            this.activeController = this.controllers[closedMultiViewIndex];
            this.removeMultiViewFromOpenedMultiViews(multiView);
        };
        /**
         * Method to close all opened multiViews.
         */
        this.closeAllMultiViews = () => {
            this.openedMultiViews.forEach((multiView) => {
                const multiViewToClose = multiView;
                this.closeMultiView(multiViewToClose);
            });
        };
        /**
         * Method to toggle a multiView.
         * @param {MultiView} multiView - The multiView to toggle.
         */
        this.toggleMultiView = (multiView) => {
            if (multiView.hidden) {
                this.openMultiView(multiView);
            }
            else {
                this.closeMultiView(multiView);
            }
        };
        /**
         * Removes a given multiView from the collection of opened multiViews.
         * @private
         * @param {MultiView} multiViewToRemove - The multiView to remove.
         */
        this.removeMultiViewFromOpenedMultiViews = (multiViewToRemove) => {
            const index = this.openedMultiViews.indexOf(multiViewToRemove);
            if (index > -1) {
                this.openedMultiViews.splice(index, 1);
            }
        };
        /**
         * Adds a given multiView to the collection of opened multiViews, unless it's already present.
         * @private
         * @param {MultiView} multiViewToAdd - The multiView to add.
         */
        this.addMultiViewToOpenedMultiViews = (multiViewToAdd) => {
            if (!this.openedMultiViews.includes(multiViewToAdd)) {
                this.openedMultiViews = [...this.openedMultiViews, multiViewToAdd];
            }
        };
        /**
         * Triggers a change event with the currently opened multiViews.
         * @private
         */
        this.change = () => {
            this.$emit("change", this.openedMultiViews);
        };
        this.isDisabledElement = (el) => {
            return el.getAttribute("aria-disabled") === "true";
        };
        this.isHiddenElement = (el) => {
            return el.getAttribute("aria-hidden") === "true";
        };
        this.isFocusableElement = (el) => {
            return (!this.isDisabledElement(el) &&
                !this.isHiddenElement(el) &&
                el.offsetParent !== null);
        };
        /**
         * Sets attributes for multiViews and determines which multiViews are hidden.
         * @private
         */
        this.setMultiViews = () => {
            this.multiViews.forEach((multiView, index) => {
                if (multiView instanceof MultiView) {
                    const controllerId = this.controllerIds[index];
                    const multiViewId = this.multiViewsIds[index];
                    this.setAttributes(multiView, {
                        id: multiViewId,
                        "aria-labelledby": controllerId,
                    });
                    if (!multiView.hidden) {
                        this.addMultiViewToOpenedMultiViews(multiView);
                    }
                    else {
                        this.removeMultiViewFromOpenedMultiViews(multiView);
                    }
                }
            });
        };
        /**
         * Unsets active controller for focus handling
         * @private
         */
        this.unsetActiveToggleButton = () => {
            this.activeControllerIndex = 0;
            this.activeController = undefined;
            this.setControllers;
        };
        /**
         * Handles click events on the controllers.
         * @private
         * @param {MouseEvent} event - The click event.
         */
        this.handleControllerClick = (event) => {
            const selectedToggleButton = event.currentTarget;
            if (selectedToggleButton.nodeType !== 1 ||
                !this.isFocusableElement(selectedToggleButton)) {
                return;
            }
            this.prevActiveControllerIndex = this.activeControllerIndex;
            this.activeControllerIndex = this.controllers.indexOf(selectedToggleButton);
            const associatedMultiView = this.multiViews[this.activeControllerIndex];
            if (event.ctrlKey) {
                this.openSecondMultiView(associatedMultiView);
            }
            else {
                this.toggleMultiView(associatedMultiView);
            }
        };
        /**
         * Handles keydown events on the controller.
         * @param {KeyboardEvent} event The event object.
         * @private
         */
        this.handleControllerKeyDown = (event) => {
            const associatedMultiView = this.multiViews[this.activeControllerIndex];
            const controller = event.currentTarget;
            switch (event.key) {
                case keyArrowUp:
                    event.preventDefault();
                    this.adjustBackward(event);
                    break;
                case keyTab:
                    if (event.shiftKey) {
                        event.preventDefault();
                        this.controllersContainer.focus();
                    }
                    else {
                        const firstToggleButton = this.controllers[0];
                        firstToggleButton.focus();
                    }
                    break;
                case keyArrowDown:
                    event.preventDefault();
                    this.adjustForward(event);
                    break;
                case keyHome:
                    event.preventDefault();
                    this.adjust(-this.activeControllerIndex);
                    break;
                case keyEnd:
                    event.preventDefault();
                    this.adjust(this.controllers.length - this.activeControllerIndex - 1);
                    break;
                case keyEnter:
                case keySpace:
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.openSecondMultiView(associatedMultiView);
                    }
                    else {
                        event.preventDefault();
                        this.toggleMultiView(associatedMultiView);
                    }
                    break;
                case keyEscape:
                    event.preventDefault();
                    controller.blur();
                    break;
            }
        };
        /**
         * Handles keydown events on the controller.
         * @param {KeyboardEvent} event The event object.
         * @private
         */
        this.handleMultiViewKeyDown = (event) => {
            const associatedMultiView = event.currentTarget;
            switch (event.key) {
                case keyEscape:
                    event.preventDefault();
                    this.closeMultiView(associatedMultiView);
                    break;
            }
        };
        /**
         * Handles keydown events on the controller.
         * @param {KeyboardEvent} event The event object.
         * @private
         */
        this.handleToggleButtonContainerKeyDown = (event) => {
            const firstToggleButton = this.controllers[0];
            switch (event.key) {
                case keyTab:
                    this.unsetActiveToggleButton();
                    firstToggleButton.tabIndex = 0;
                    break;
            }
        };
        /**
         * Adjusts the active controller forward.
         * @param {KeyboardEvent} e The event object.
         * @private
         */
        this.adjustForward = (e) => {
            const group = this.controllers;
            let index = 0;
            index = this.activeController
                ? group.indexOf(this.activeController) + 1
                : 1;
            if (index === group.length) {
                index = 0;
            }
            while (index < group.length && group.length > 1) {
                if (this.isFocusableElement(group[index])) {
                    this.moveToToggleButtonByIndex(group, index);
                    break;
                }
                else if (this.activeController &&
                    index === group.indexOf(this.activeController)) {
                    break;
                }
                else if (index + 1 >= group.length) {
                    index = 0;
                }
                else {
                    index += 1;
                }
            }
        };
        /**
         * Adjusts the active controller backward.
         * @param {KeyboardEvent} e The event object.
         * @private
         */
        this.adjustBackward = (e) => {
            const group = this.controllers;
            let index = 0;
            index = this.activeController
                ? group.indexOf(this.activeController) - 1
                : 0;
            index = index < 0 ? group.length - 1 : index;
            while (index >= 0 && group.length > 1) {
                if (this.isFocusableElement(group[index])) {
                    this.moveToToggleButtonByIndex(group, index);
                    break;
                }
                else if (index - 1 < 0) {
                    index = group.length - 1;
                }
                else {
                    index -= 1;
                }
            }
        };
        /**
         * Moves the focus to the controller at the specified index.
         * @param {HTMLElement[]} group The array of controllers.
         * @param {number} index The index of the controller to focus.
         * @private
         */
        this.moveToToggleButtonByIndex = (group, index) => {
            const controller = group[index];
            this.activeController = controller;
            this.activeController.tabIndex = 0;
            this.prevActiveControllerIndex = this.activeControllerIndex;
            this.controllers[this.prevActiveControllerIndex].tabIndex = -1;
            this.activeControllerIndex = index;
            controller.focus();
            this.setComponent();
        };
    }
    /**
     * Method to be called when the component is inserted into the document.
     */
    connectedCallback() {
        super.connectedCallback();
        this.initialize();
    }
    /**
     * Method to be called when the component is removed from the document.
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListeners();
    }
    initialize() {
        this.controllerIds = this.getControllerIds();
        this.multiViewsIds = this.getMultiViewIds();
        this.activeControllerIndex = this.getActiveIndex();
        Updates.enqueue(() => this.setControllers());
        Updates.enqueue(() => this.setMultiViews());
        Updates.enqueue(() => this.addEventListeners());
    }
    /**
     * Limits the number of opened MultiViews. If there are more than one MultiViews opened,
     * it will remove the attribute "data-flexposition" from the first opened MultiView and hide it.
     * @public
     */
    limitNumberOfOpenMultiViews() {
        const multiView = this.openedMultiViews.shift();
        if (multiView) {
            multiView.removeAttribute("data-flexposition");
            multiView.hidden = true;
        }
    }
    /**
     * Method to be called when the active ID changes.
     * @param {string} oldValue - The previous value of the active ID.
     * @param {string} newValue - The new value of the active ID.
     */
    activeidChanged(oldValue, newValue) {
        if (this.$fastController.isConnected &&
            this.controllers.length <= this.multiViews.length) {
            this.prevActiveControllerIndex = this.controllers.findIndex((item) => item.id === oldValue);
            this.activeControllerIndex = this.controllers.findIndex((item) => item.id === newValue);
            this.controllers[this.activeControllerIndex].tabIndex = 0;
            this.controllers[this.prevActiveControllerIndex].tabIndex = -1;
            this.setControllers();
            this.setMultiViews();
        }
    }
    /**
     * Method to be called when controllers changes.
     */
    controllersChanged() {
        if (this.isValidMultiViewState()) {
            this.controllerIds = this.getControllerIds();
            this.multiViewsIds = this.getMultiViewIds();
            this.setControllers();
            this.setMultiViews();
        }
    }
    /**
     * Method to be called when multiViews changes.
     */
    multiViewsChanged() {
        if (this.isValidMultiViewState()) {
            this.controllerIds = this.getControllerIds();
            this.multiViewsIds = this.getMultiViewIds();
            this.setControllers();
            this.setMultiViews();
        }
    }
    /**
     * Method to be called when opendedMultiViews changes.
     */
    openedMultiViewsChanged() {
        this.controllers.forEach((controller, index) => {
            const multiView = this.multiViews[index];
            if (this.openedMultiViews.includes(multiView)) {
                controller.setAttribute("aria-expanded", "true");
            }
            else {
                controller.setAttribute("aria-expanded", "false");
            }
        });
    }
    isValidMultiViewState() {
        return (this.$fastController.isConnected &&
            this.controllers.length <= this.multiViews.length);
    }
    /**
     * Returns the active index based on the activeid property, falls back to 0 if all elements are hidden.
     * @private
     * @returns {number} - The active index.
     */
    getActiveIndex() {
        const id = this.activeid;
        if (id !== undefined) {
            let index = this.controllerIds.indexOf(this.activeid);
            while (index !== -1) {
                const element = document.getElementById(this.controllerIds[index]);
                if (element && element.getAttribute("aria-hidden") !== "true") {
                    return index;
                }
                index = this.controllerIds.indexOf(this.activeid, index + 1);
            }
        }
        for (let i = 0; i < this.controllerIds.length; i++) {
            const element = document.getElementById(this.controllerIds[i]);
            if (element && element.getAttribute("aria-hidden") !== "true") {
                return i;
            }
        }
        return 0;
    }
    /**
     * Sets attributes for controllers and determines the active controller.
     * @private
     */
    setControllers() {
        this.activeController = this.controllers[this.activeControllerIndex];
        this.activeController.tabIndex = 0;
        this.multiViews.forEach((multiView, index) => {
            if (!multiView.hidden) {
                this.controllers[index].ariaSelected = "true";
            }
            else {
                this.controllers[index].ariaSelected = "false";
            }
        });
        this.controllers.forEach((controller, index) => {
            if (!(controller instanceof HTMLElement))
                return;
            const isActiveToggleButton = this.activeControllerIndex === index &&
                this.isFocusableElement(controller);
            const controllerId = this.controllerIds[index];
            const multiViewId = this.multiViewsIds[index];
            this.setAttributes(controller, {
                id: controllerId,
                "aria-controls": multiViewId,
            });
            if (isActiveToggleButton) {
                this.activeController = controller;
                this.activeid = controllerId;
            }
        });
    }
    /**
     * Returns an array of IDs for the controllers.
     * @private
     * @returns {Array<string>} - The IDs of the controllers.
     */
    getControllerIds() {
        return this.controllers.map((controller) => {
            var _a;
            return (_a = controller.getAttribute("id")) !== null && _a !== void 0 ? _a : `controller-${uniqueId()}`;
        });
    }
    /**
     * Returns an array of IDs for the multiViews.
     * @private
     * @returns {Array<string>} - The IDs of the multiViews.
     */
    getMultiViewIds() {
        return this.multiViews.map((multiView) => {
            var _a;
            return (_a = multiView.getAttribute("id")) !== null && _a !== void 0 ? _a : `multiView-${uniqueId()}`;
        });
    }
    /**
     * Triggers a change if the active controller index has changed.
     * @private
     */
    setComponent() {
        if (this.activeControllerIndex !== this.prevActiveControllerIndex) {
            this.activeid = this.controllerIds[this.activeControllerIndex];
            this.change();
        }
    }
    /**
     * Handles blur events on the controller.
     * @param {FocusEvent} event The event object.
     * @public
     */
    handleControllerBlur(event) {
        const controller = event.currentTarget;
        controller.tabIndex = -1;
    }
    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    adjust(adjustment) {
        const focusableToggleButtons = this.controllers.filter((t) => !this.isDisabledElement(t));
        if (this.activeController) {
            const currentActiveToggleButtonIndex = focusableToggleButtons.indexOf(this.activeController);
            const nextToggleButtonIndex = limit(0, focusableToggleButtons.length - 1, currentActiveToggleButtonIndex + adjustment);
            const nextIndex = this.controllers.indexOf(focusableToggleButtons[nextToggleButtonIndex]);
            if (nextIndex > -1) {
                this.moveToToggleButtonByIndex(this.controllers, nextIndex);
            }
        }
    }
    /**
     * Sets the specified attributes on the given HTML element.
     * @param {HTMLElement} element The HTML element on which to set attributes.
     * @param {{[key: string]: string}} attributes An object mapping attribute names to values.
     * @private
     */
    setAttributes(element, attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    /**
     * Adds event listeners to the controllers and multiViews.
     *
     * @returns {void}
     */
    addEventListeners() {
        if (this.controllersContainer) {
            this.controllersContainer.addEventListener("keydown", this.handleToggleButtonContainerKeyDown);
        }
        this.controllers.forEach((controller) => {
            controller.addEventListener("click", this.handleControllerClick);
            controller.addEventListener("keydown", this.handleControllerKeyDown);
            controller.addEventListener("blur", this.handleControllerBlur);
        });
        this.multiViews.forEach((multiView) => {
            multiView.addEventListener("keydown", (event) => this.handleMultiViewKeyDown(event));
        });
    }
    /**
     * Removes event listeners from the controllers.
     *
     * @returns {void}
     */
    removeEventListeners() {
        this.controllers.forEach((controller) => {
            controller.removeEventListener("click", this.handleControllerClick);
            controller.removeEventListener("keydown", this.handleControllerKeyDown);
            controller.removeEventListener("blur", this.handleControllerBlur);
        });
        this.multiViews.forEach((multiView) => {
            multiView.removeEventListener("keydown", (event) => this.handleMultiViewKeyDown(event));
        });
    }
}
__decorate([
    observable
], MultiViewGroup.prototype, "multiViews", void 0);
__decorate([
    observable
], MultiViewGroup.prototype, "controllers", void 0);
__decorate([
    observable
], MultiViewGroup.prototype, "controllersContainer", void 0);
__decorate([
    observable
], MultiViewGroup.prototype, "openedMultiViews", void 0);
//# sourceMappingURL=multi-view-group.js.map