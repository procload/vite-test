(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@horizon-msft/web-components"] = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    let kernelMode;
    const kernelAttr = "fast-kernel";
    try {
        if (document.currentScript) {
            kernelMode = document.currentScript.getAttribute(kernelAttr);
        }
        else {
            const scripts = document.getElementsByTagName("script");
            const currentScript = scripts[scripts.length - 1];
            kernelMode = currentScript.getAttribute(kernelAttr);
        }
    }
    catch (e) {
        kernelMode = "isolate";
    }
    let KernelServiceId;
    switch (kernelMode) {
        case "share": // share the kernel across major versions
            KernelServiceId = Object.freeze({
                updateQueue: 1,
                observable: 2,
                contextEvent: 3,
                elementRegistry: 4,
            });
            break;
        case "share-v2": // only share the kernel with other v2 instances
            KernelServiceId = Object.freeze({
                updateQueue: 1.2,
                observable: 2.2,
                contextEvent: 3.2,
                elementRegistry: 4.2,
            });
            break;
        default:
            // fully isolate the kernel from all other FAST instances
            const postfix = `-${Math.random().toString(36).substring(2, 8)}`;
            KernelServiceId = Object.freeze({
                updateQueue: `1.2${postfix}`,
                observable: `2.2${postfix}`,
                contextEvent: `3.2${postfix}`,
                elementRegistry: `4.2${postfix}`,
            });
            break;
    }
    /**
     * Determines whether or not an object is a function.
     * @public
     */
    const isFunction = (object) => typeof object === "function";
    /**
     * Determines whether or not an object is a string.
     * @public
     */
    const isString = (object) => typeof object === "string";
    /**
     * A function which does nothing.
     * @public
     */
    const noop = () => void 0;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    /* eslint-disable @typescript-eslint/ban-ts-comment */

    (function ensureGlobalThis() {
        if (typeof globalThis !== "undefined") {
            // We're running in a modern environment.
            return;
        }
        // @ts-ignore
        if (typeof commonjsGlobal !== "undefined") {
            // We're running in NodeJS
            // @ts-ignore
            commonjsGlobal.globalThis = commonjsGlobal;
        }
        else if (typeof self !== "undefined") {
            self.globalThis = self;
        }
        else if (typeof window !== "undefined") {
            // We're running in the browser's main thread.
            window.globalThis = window;
        }
        else {
            // Hopefully we never get here...
            // Not all environments allow eval and Function. Use only as a last resort:
            // eslint-disable-next-line no-new-func
            const result = new Function("return this")();
            result.globalThis = result;
        }
    })();

    // ensure FAST global - duplicated debug.ts
    const propConfig = {
        configurable: false,
        enumerable: false,
        writable: false,
    };
    if (globalThis.FAST === void 0) {
        Reflect.defineProperty(globalThis, "FAST", Object.assign({ value: Object.create(null) }, propConfig));
    }
    /**
     * The FAST global.
     * @public
     */
    const FAST = globalThis.FAST;
    if (FAST.getById === void 0) {
        const storage = Object.create(null);
        Reflect.defineProperty(FAST, "getById", Object.assign({ value(id, initialize) {
                let found = storage[id];
                if (found === void 0) {
                    found = initialize ? (storage[id] = initialize()) : null;
                }
                return found;
            } }, propConfig));
    }
    if (FAST.error === void 0) {
        Object.assign(FAST, {
            warn() { },
            error(code) {
                return new Error(`Error ${code}`);
            },
            addMessages() { },
        });
    }
    /**
     * A readonly, empty array.
     * @remarks
     * Typically returned by APIs that return arrays when there are
     * no actual items to return.
     * @public
     */
    const emptyArray = Object.freeze([]);
    /**
     * Do not change. Part of shared kernel contract.
     * @internal
     */
    function createTypeRegistry() {
        const typeToDefinition = new Map();
        return Object.freeze({
            register(definition) {
                if (typeToDefinition.has(definition.type)) {
                    return false;
                }
                typeToDefinition.set(definition.type, definition);
                return true;
            },
            getByType(key) {
                return typeToDefinition.get(key);
            },
            getForInstance(object) {
                if (object === null || object === void 0) {
                    return void 0;
                }
                return typeToDefinition.get(object.constructor);
            },
        });
    }
    /**
     * Creates a function capable of locating metadata associated with a type.
     * @returns A metadata locator function.
     * @internal
     */
    function createMetadataLocator() {
        const metadataLookup = new WeakMap();
        return function (target) {
            let metadata = metadataLookup.get(target);
            if (metadata === void 0) {
                let currentTarget = Reflect.getPrototypeOf(target);
                while (metadata === void 0 && currentTarget !== null) {
                    metadata = metadataLookup.get(currentTarget);
                    currentTarget = Reflect.getPrototypeOf(currentTarget);
                }
                metadata = metadata === void 0 ? [] : metadata.slice(0);
                metadataLookup.set(target, metadata);
            }
            return metadata;
        };
    }
    /**
     * Makes a type noop for JSON serialization.
     * @param type - The type to make noop for JSON serialization.
     * @internal
     */
    function makeSerializationNoop(type) {
        type.prototype.toJSON = noop;
    }

    /**
     * The type of HTML aspect to target.
     * @public
     */
    const DOMAspect = Object.freeze({
        /**
         * Not aspected.
         */
        none: 0,
        /**
         * An attribute.
         */
        attribute: 1,
        /**
         * A boolean attribute.
         */
        booleanAttribute: 2,
        /**
         * A property.
         */
        property: 3,
        /**
         * Content
         */
        content: 4,
        /**
         * A token list.
         */
        tokenList: 5,
        /**
         * An event.
         */
        event: 6,
    });
    const createHTML$1 = html => html;
    const fastTrustedType = globalThis.trustedTypes
        ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML: createHTML$1 })
        : { createHTML: createHTML$1 };
    let defaultPolicy = Object.freeze({
        createHTML(value) {
            return fastTrustedType.createHTML(value);
        },
        protect(tagName, aspect, aspectName, sink) {
            return sink;
        },
    });
    const fastPolicy = defaultPolicy;
    /**
     * Common DOM APIs.
     * @public
     */
    const DOM = Object.freeze({
        /**
         * Gets the dom policy used by the templating system.
         */
        get policy() {
            return defaultPolicy;
        },
        /**
         * Sets the dom policy used by the templating system.
         * @param policy - The policy to set.
         * @remarks
         * This API can only be called once, for security reasons. It should be
         * called by the application developer at the start of their program.
         */
        setPolicy(value) {
            if (defaultPolicy !== fastPolicy) {
                throw FAST.error(1201 /* Message.onlySetDOMPolicyOnce */);
            }
            defaultPolicy = value;
        },
        /**
         * Sets an attribute value on an element.
         * @param element - The element to set the attribute value on.
         * @param attributeName - The attribute name to set.
         * @param value - The value of the attribute to set.
         * @remarks
         * If the value is `null` or `undefined`, the attribute is removed, otherwise
         * it is set to the provided value using the standard `setAttribute` API.
         */
        setAttribute(element, attributeName, value) {
            value === null || value === undefined
                ? element.removeAttribute(attributeName)
                : element.setAttribute(attributeName, value);
        },
        /**
         * Sets a boolean attribute value.
         * @param element - The element to set the boolean attribute value on.
         * @param attributeName - The attribute name to set.
         * @param value - The value of the attribute to set.
         * @remarks
         * If the value is true, the attribute is added; otherwise it is removed.
         */
        setBooleanAttribute(element, attributeName, value) {
            value
                ? element.setAttribute(attributeName, "")
                : element.removeAttribute(attributeName);
        },
    });

    /**
     * The default UpdateQueue.
     * @public
     */
    const Updates = FAST.getById(KernelServiceId.updateQueue, () => {
        const tasks = [];
        const pendingErrors = [];
        const rAF = globalThis.requestAnimationFrame;
        let updateAsync = true;
        function throwFirstError() {
            if (pendingErrors.length) {
                throw pendingErrors.shift();
            }
        }
        function tryRunTask(task) {
            try {
                task.call();
            }
            catch (error) {
                if (updateAsync) {
                    pendingErrors.push(error);
                    setTimeout(throwFirstError, 0);
                }
                else {
                    tasks.length = 0;
                    throw error;
                }
            }
        }
        function process() {
            const capacity = 1024;
            let index = 0;
            while (index < tasks.length) {
                tryRunTask(tasks[index]);
                index++;
                // Prevent leaking memory for long chains of recursive calls to `enqueue`.
                // If we call `enqueue` within a task scheduled by `enqueue`, the queue will
                // grow, but to avoid an O(n) walk for every task we execute, we don't
                // shift tasks off the queue after they have been executed.
                // Instead, we periodically shift 1024 tasks off the queue.
                if (index > capacity) {
                    // Manually shift all values starting at the index back to the
                    // beginning of the queue.
                    for (let scan = 0, newLength = tasks.length - index; scan < newLength; scan++) {
                        tasks[scan] = tasks[scan + index];
                    }
                    tasks.length -= index;
                    index = 0;
                }
            }
            tasks.length = 0;
        }
        function enqueue(callable) {
            tasks.push(callable);
            if (tasks.length < 2) {
                updateAsync ? rAF(process) : process();
            }
        }
        return Object.freeze({
            enqueue,
            next: () => new Promise(enqueue),
            process,
            setMode: (isAsync) => (updateAsync = isAsync),
        });
    });

    /**
     * An implementation of {@link Notifier} that efficiently keeps track of
     * subscribers interested in a specific change notification on an
     * observable subject.
     *
     * @remarks
     * This set is optimized for the most common scenario of 1 or 2 subscribers.
     * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
     * If the set ever exceeds two subscribers, it upgrades to an array automatically.
     * @public
     */
    class SubscriberSet {
        /**
         * Creates an instance of SubscriberSet for the specified subject.
         * @param subject - The subject that subscribers will receive notifications from.
         * @param initialSubscriber - An initial subscriber to changes.
         */
        constructor(subject, initialSubscriber) {
            this.sub1 = void 0;
            this.sub2 = void 0;
            this.spillover = void 0;
            this.subject = subject;
            this.sub1 = initialSubscriber;
        }
        /**
         * Checks whether the provided subscriber has been added to this set.
         * @param subscriber - The subscriber to test for inclusion in this set.
         */
        has(subscriber) {
            return this.spillover === void 0
                ? this.sub1 === subscriber || this.sub2 === subscriber
                : this.spillover.indexOf(subscriber) !== -1;
        }
        /**
         * Subscribes to notification of changes in an object's state.
         * @param subscriber - The object that is subscribing for change notification.
         */
        subscribe(subscriber) {
            const spillover = this.spillover;
            if (spillover === void 0) {
                if (this.has(subscriber)) {
                    return;
                }
                if (this.sub1 === void 0) {
                    this.sub1 = subscriber;
                    return;
                }
                if (this.sub2 === void 0) {
                    this.sub2 = subscriber;
                    return;
                }
                this.spillover = [this.sub1, this.sub2, subscriber];
                this.sub1 = void 0;
                this.sub2 = void 0;
            }
            else {
                const index = spillover.indexOf(subscriber);
                if (index === -1) {
                    spillover.push(subscriber);
                }
            }
        }
        /**
         * Unsubscribes from notification of changes in an object's state.
         * @param subscriber - The object that is unsubscribing from change notification.
         */
        unsubscribe(subscriber) {
            const spillover = this.spillover;
            if (spillover === void 0) {
                if (this.sub1 === subscriber) {
                    this.sub1 = void 0;
                }
                else if (this.sub2 === subscriber) {
                    this.sub2 = void 0;
                }
            }
            else {
                const index = spillover.indexOf(subscriber);
                if (index !== -1) {
                    spillover.splice(index, 1);
                }
            }
        }
        /**
         * Notifies all subscribers.
         * @param args - Data passed along to subscribers during notification.
         */
        notify(args) {
            const spillover = this.spillover;
            const subject = this.subject;
            if (spillover === void 0) {
                const sub1 = this.sub1;
                const sub2 = this.sub2;
                if (sub1 !== void 0) {
                    sub1.handleChange(subject, args);
                }
                if (sub2 !== void 0) {
                    sub2.handleChange(subject, args);
                }
            }
            else {
                for (let i = 0, ii = spillover.length; i < ii; ++i) {
                    spillover[i].handleChange(subject, args);
                }
            }
        }
    }
    /**
     * An implementation of Notifier that allows subscribers to be notified
     * of individual property changes on an object.
     * @public
     */
    class PropertyChangeNotifier {
        /**
         * Creates an instance of PropertyChangeNotifier for the specified subject.
         * @param subject - The object that subscribers will receive notifications for.
         */
        constructor(subject) {
            this.subscribers = {};
            this.subjectSubscribers = null;
            this.subject = subject;
        }
        /**
         * Notifies all subscribers, based on the specified property.
         * @param propertyName - The property name, passed along to subscribers during notification.
         */
        notify(propertyName) {
            var _a, _b;
            (_a = this.subscribers[propertyName]) === null || _a === void 0 ? void 0 : _a.notify(propertyName);
            (_b = this.subjectSubscribers) === null || _b === void 0 ? void 0 : _b.notify(propertyName);
        }
        /**
         * Subscribes to notification of changes in an object's state.
         * @param subscriber - The object that is subscribing for change notification.
         * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
         */
        subscribe(subscriber, propertyToWatch) {
            var _a, _b;
            let subscribers;
            if (propertyToWatch) {
                subscribers =
                    (_a = this.subscribers[propertyToWatch]) !== null && _a !== void 0 ? _a : (this.subscribers[propertyToWatch] = new SubscriberSet(this.subject));
            }
            else {
                subscribers =
                    (_b = this.subjectSubscribers) !== null && _b !== void 0 ? _b : (this.subjectSubscribers = new SubscriberSet(this.subject));
            }
            subscribers.subscribe(subscriber);
        }
        /**
         * Unsubscribes from notification of changes in an object's state.
         * @param subscriber - The object that is unsubscribing from change notification.
         * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
         */
        unsubscribe(subscriber, propertyToUnwatch) {
            var _a, _b;
            if (propertyToUnwatch) {
                (_a = this.subscribers[propertyToUnwatch]) === null || _a === void 0 ? void 0 : _a.unsubscribe(subscriber);
            }
            else {
                (_b = this.subjectSubscribers) === null || _b === void 0 ? void 0 : _b.unsubscribe(subscriber);
            }
        }
    }

    /**
     * Describes how the source's lifetime relates to its controller's lifetime.
     * @public
     */
    const SourceLifetime = Object.freeze({
        /**
         * The source to controller lifetime relationship is unknown.
         */
        unknown: void 0,
        /**
         * The source and controller lifetimes are coupled to one another.
         * They can/will be GC'd together.
         */
        coupled: 1,
    });
    /**
     * Common Observable APIs.
     * @public
     */
    const Observable = FAST.getById(KernelServiceId.observable, () => {
        const queueUpdate = Updates.enqueue;
        const volatileRegex = /(:|&&|\|\||if|\?\.)/;
        const notifierLookup = new WeakMap();
        let watcher = void 0;
        let createArrayObserver = (array) => {
            throw FAST.error(1101 /* Message.needsArrayObservation */);
        };
        function getNotifier(source) {
            var _a;
            let found = (_a = source.$fastController) !== null && _a !== void 0 ? _a : notifierLookup.get(source);
            if (found === void 0) {
                Array.isArray(source)
                    ? (found = createArrayObserver(source))
                    : notifierLookup.set(source, (found = new PropertyChangeNotifier(source)));
            }
            return found;
        }
        const getAccessors = createMetadataLocator();
        class DefaultObservableAccessor {
            constructor(name) {
                this.name = name;
                this.field = `_${name}`;
                this.callback = `${name}Changed`;
            }
            getValue(source) {
                if (watcher !== void 0) {
                    watcher.watch(source, this.name);
                }
                return source[this.field];
            }
            setValue(source, newValue) {
                const field = this.field;
                const oldValue = source[field];
                if (oldValue !== newValue) {
                    source[field] = newValue;
                    const callback = source[this.callback];
                    if (isFunction(callback)) {
                        callback.call(source, oldValue, newValue);
                    }
                    getNotifier(source).notify(this.name);
                }
            }
        }
        class ExpressionNotifierImplementation extends SubscriberSet {
            constructor(expression, initialSubscriber, isVolatileBinding = false) {
                super(expression, initialSubscriber);
                this.expression = expression;
                this.isVolatileBinding = isVolatileBinding;
                this.needsRefresh = true;
                this.needsQueue = true;
                this.isAsync = true;
                this.first = this;
                this.last = null;
                this.propertySource = void 0;
                this.propertyName = void 0;
                this.notifier = void 0;
                this.next = void 0;
            }
            setMode(isAsync) {
                this.isAsync = this.needsQueue = isAsync;
            }
            bind(controller) {
                this.controller = controller;
                const value = this.observe(controller.source, controller.context);
                if (!controller.isBound && this.requiresUnbind(controller)) {
                    controller.onUnbind(this);
                }
                return value;
            }
            requiresUnbind(controller) {
                return (controller.sourceLifetime !== SourceLifetime.coupled ||
                    this.first !== this.last ||
                    this.first.propertySource !== controller.source);
            }
            unbind(controller) {
                this.dispose();
            }
            observe(source, context) {
                if (this.needsRefresh && this.last !== null) {
                    this.dispose();
                }
                const previousWatcher = watcher;
                watcher = this.needsRefresh ? this : void 0;
                this.needsRefresh = this.isVolatileBinding;
                let result;
                try {
                    result = this.expression(source, context);
                }
                finally {
                    watcher = previousWatcher;
                }
                return result;
            }
            // backwards compat with v1 kernel
            disconnect() {
                this.dispose();
            }
            dispose() {
                if (this.last !== null) {
                    let current = this.first;
                    while (current !== void 0) {
                        current.notifier.unsubscribe(this, current.propertyName);
                        current = current.next;
                    }
                    this.last = null;
                    this.needsRefresh = this.needsQueue = this.isAsync;
                }
            }
            watch(propertySource, propertyName) {
                const prev = this.last;
                const notifier = getNotifier(propertySource);
                const current = prev === null ? this.first : {};
                current.propertySource = propertySource;
                current.propertyName = propertyName;
                current.notifier = notifier;
                notifier.subscribe(this, propertyName);
                if (prev !== null) {
                    if (!this.needsRefresh) {
                        // Declaring the variable prior to assignment below circumvents
                        // a bug in Angular's optimization process causing infinite recursion
                        // of this watch() method. Details https://github.com/microsoft/fast/issues/4969
                        let prevValue;
                        watcher = void 0;
                        /* eslint-disable-next-line */
                        prevValue = prev.propertySource[prev.propertyName];
                        /* eslint-disable-next-line */
                        watcher = this;
                        if (propertySource === prevValue) {
                            this.needsRefresh = true;
                        }
                    }
                    prev.next = current;
                }
                this.last = current;
            }
            handleChange() {
                if (this.needsQueue) {
                    this.needsQueue = false;
                    queueUpdate(this);
                }
                else if (!this.isAsync) {
                    this.call();
                }
            }
            call() {
                if (this.last !== null) {
                    this.needsQueue = this.isAsync;
                    this.notify(this);
                }
            }
            *records() {
                let next = this.first;
                while (next !== void 0) {
                    yield next;
                    next = next.next;
                }
            }
        }
        makeSerializationNoop(ExpressionNotifierImplementation);
        return Object.freeze({
            /**
             * @internal
             * @param factory - The factory used to create array observers.
             */
            setArrayObserverFactory(factory) {
                createArrayObserver = factory;
            },
            /**
             * Gets a notifier for an object or Array.
             * @param source - The object or Array to get the notifier for.
             */
            getNotifier,
            /**
             * Records a property change for a source object.
             * @param source - The object to record the change against.
             * @param propertyName - The property to track as changed.
             */
            track(source, propertyName) {
                watcher && watcher.watch(source, propertyName);
            },
            /**
             * Notifies watchers that the currently executing property getter or function is volatile
             * with respect to its observable dependencies.
             */
            trackVolatile() {
                watcher && (watcher.needsRefresh = true);
            },
            /**
             * Notifies subscribers of a source object of changes.
             * @param source - the object to notify of changes.
             * @param args - The change args to pass to subscribers.
             */
            notify(source, args) {
                /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                getNotifier(source).notify(args);
            },
            /**
             * Defines an observable property on an object or prototype.
             * @param target - The target object to define the observable on.
             * @param nameOrAccessor - The name of the property to define as observable;
             * or a custom accessor that specifies the property name and accessor implementation.
             */
            defineProperty(target, nameOrAccessor) {
                if (isString(nameOrAccessor)) {
                    nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
                }
                getAccessors(target).push(nameOrAccessor);
                Reflect.defineProperty(target, nameOrAccessor.name, {
                    enumerable: true,
                    get() {
                        return nameOrAccessor.getValue(this);
                    },
                    set(newValue) {
                        nameOrAccessor.setValue(this, newValue);
                    },
                });
            },
            /**
             * Finds all the observable accessors defined on the target,
             * including its prototype chain.
             * @param target - The target object to search for accessor on.
             */
            getAccessors,
            /**
             * Creates a {@link ExpressionNotifier} that can watch the
             * provided {@link Expression} for changes.
             * @param expression - The binding to observe.
             * @param initialSubscriber - An initial subscriber to changes in the binding value.
             * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
             */
            binding(expression, initialSubscriber, isVolatileBinding = this.isVolatileBinding(expression)) {
                return new ExpressionNotifierImplementation(expression, initialSubscriber, isVolatileBinding);
            },
            /**
             * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
             * on every evaluation of the value.
             * @param expression - The binding to inspect.
             */
            isVolatileBinding(expression) {
                return volatileRegex.test(expression.toString());
            },
        });
    });
    /**
     * Decorator: Defines an observable property on the target.
     * @param target - The target to define the observable on.
     * @param nameOrAccessor - The property name or accessor to define the observable as.
     * @public
     */
    function observable(target, nameOrAccessor) {
        Observable.defineProperty(target, nameOrAccessor);
    }
    const contextEvent = FAST.getById(KernelServiceId.contextEvent, () => {
        let current = null;
        return {
            get() {
                return current;
            },
            set(event) {
                current = event;
            },
        };
    });
    /**
     * Provides additional contextual information available to behaviors and expressions.
     * @public
     */
    const ExecutionContext = Object.freeze({
        /**
         * A default execution context.
         */
        default: {
            index: 0,
            length: 0,
            get event() {
                return ExecutionContext.getEvent();
            },
            eventDetail() {
                return this.event.detail;
            },
            eventTarget() {
                return this.event.target;
            },
        },
        /**
         * Gets the current event.
         * @returns An event object.
         */
        getEvent() {
            return contextEvent.get();
        },
        /**
         * Sets the current event.
         * @param event - An event object.
         */
        setEvent(event) {
            contextEvent.set(event);
        },
    });

    /**
     * Captures a binding expression along with related information and capabilities.
     *
     * @public
     */
    class Binding {
        /**
         * Creates a binding.
         * @param evaluate - Evaluates the binding.
         * @param policy - The security policy to associate with this binding.
         * @param isVolatile - Indicates whether the binding is volatile.
         */
        constructor(evaluate, policy, isVolatile = false) {
            this.evaluate = evaluate;
            this.policy = policy;
            this.isVolatile = isVolatile;
        }
    }

    class OneWayBinding extends Binding {
        createObserver(subscriber) {
            return Observable.binding(this.evaluate, subscriber, this.isVolatile);
        }
    }
    /**
     * Creates an standard binding.
     * @param expression - The binding to refresh when changed.
     * @param policy - The security policy to associate with th binding.
     * @param isVolatile - Indicates whether the binding is volatile or not.
     * @returns A binding configuration.
     * @public
     */
    function oneWay(expression, policy, isVolatile = Observable.isVolatileBinding(expression)) {
        return new OneWayBinding(expression, policy, isVolatile);
    }

    class OneTimeBinding extends Binding {
        createObserver() {
            return this;
        }
        bind(controller) {
            return this.evaluate(controller.source, controller.context);
        }
    }
    makeSerializationNoop(OneTimeBinding);
    /**
     * Creates a one time binding
     * @param expression - The binding to refresh when signaled.
     * @param policy - The security policy to associate with th binding.
     * @returns A binding configuration.
     * @public
     */
    function oneTime(expression, policy) {
        return new OneTimeBinding(expression, policy);
    }

    let DefaultStyleStrategy;
    function reduceStyles(styles) {
        return styles
            .map((x) => x instanceof ElementStyles ? reduceStyles(x.styles) : [x])
            .reduce((prev, curr) => prev.concat(curr), []);
    }
    /**
     * Represents styles that can be applied to a custom element.
     * @public
     */
    class ElementStyles {
        /**
         * Creates an instance of ElementStyles.
         * @param styles - The styles that will be associated with elements.
         */
        constructor(styles) {
            this.styles = styles;
            this.targets = new WeakSet();
            this._strategy = null;
            this.behaviors = styles
                .map((x) => x instanceof ElementStyles ? x.behaviors : null)
                .reduce((prev, curr) => (curr === null ? prev : prev === null ? curr : prev.concat(curr)), null);
        }
        /**
         * Gets the StyleStrategy associated with these element styles.
         */
        get strategy() {
            if (this._strategy === null) {
                this.withStrategy(DefaultStyleStrategy);
            }
            return this._strategy;
        }
        /** @internal */
        addStylesTo(target) {
            this.strategy.addStylesTo(target);
            this.targets.add(target);
        }
        /** @internal */
        removeStylesFrom(target) {
            this.strategy.removeStylesFrom(target);
            this.targets.delete(target);
        }
        /** @internal */
        isAttachedTo(target) {
            return this.targets.has(target);
        }
        /**
         * Associates behaviors with this set of styles.
         * @param behaviors - The behaviors to associate.
         */
        withBehaviors(...behaviors) {
            this.behaviors =
                this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);
            return this;
        }
        /**
         * Sets the strategy that handles adding/removing these styles for an element.
         * @param strategy - The strategy to use.
         */
        withStrategy(Strategy) {
            this._strategy = new Strategy(reduceStyles(this.styles));
            return this;
        }
        /**
         * Sets the default strategy type to use when creating style strategies.
         * @param Strategy - The strategy type to construct.
         */
        static setDefaultStrategy(Strategy) {
            DefaultStyleStrategy = Strategy;
        }
        /**
         * Normalizes a set of composable style options.
         * @param styles - The style options to normalize.
         * @returns A singular ElementStyles instance or undefined.
         */
        static normalize(styles) {
            return styles === void 0
                ? void 0
                : Array.isArray(styles)
                    ? new ElementStyles(styles)
                    : styles instanceof ElementStyles
                        ? styles
                        : new ElementStyles([styles]);
        }
    }
    /**
     * Indicates whether the DOM supports the adoptedStyleSheets feature.
     */
    ElementStyles.supportsAdoptedStyleSheets = Array.isArray(document.adoptedStyleSheets) &&
        "replace" in CSSStyleSheet.prototype;

    const registry$1 = createTypeRegistry();
    /**
     * Instructs the css engine to provide dynamic styles or
     * associate behaviors with styles.
     * @public
     */
    const CSSDirective = Object.freeze({
        /**
         * Gets the directive definition associated with the instance.
         * @param instance - The directive instance to retrieve the definition for.
         */
        getForInstance: registry$1.getForInstance,
        /**
         * Gets the directive definition associated with the specified type.
         * @param type - The directive type to retrieve the definition for.
         */
        getByType: registry$1.getByType,
        /**
         * Defines a CSSDirective.
         * @param type - The type to define as a directive.
         */
        define(type) {
            registry$1.register({ type });
            return type;
        },
    });
    /**
     * Decorator: Defines a CSSDirective.
     * @public
     */
    function cssDirective() {
        /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
        return function (type) {
            CSSDirective.define(type);
        };
    }

    function handleChange(directive, controller, observer) {
        controller.source.style.setProperty(directive.targetAspect, observer.bind(controller));
    }
    /**
     * Enables bindings in CSS.
     *
     * @public
     */
    class CSSBindingDirective {
        /**
         * Creates an instance of CSSBindingDirective.
         * @param dataBinding - The binding to use in CSS.
         * @param targetAspect - The CSS property to target.
         */
        constructor(dataBinding, targetAspect) {
            this.dataBinding = dataBinding;
            this.targetAspect = targetAspect;
        }
        /**
         * Creates a CSS fragment to interpolate into the CSS document.
         * @returns - the string to interpolate into CSS
         */
        createCSS(add) {
            add(this);
            return `var(${this.targetAspect})`;
        }
        /**
         * Executed when this behavior is attached to a controller.
         * @param controller - Controls the behavior lifecycle.
         */
        addedCallback(controller) {
            var _a;
            const element = controller.source;
            if (!element.$cssBindings) {
                element.$cssBindings = new Map();
                const setAttribute = element.setAttribute;
                element.setAttribute = (attr, value) => {
                    setAttribute.call(element, attr, value);
                    if (attr === "style") {
                        element.$cssBindings.forEach((v, k) => handleChange(k, v.controller, v.observer));
                    }
                };
            }
            const observer = (_a = controller[this.targetAspect]) !== null && _a !== void 0 ? _a : (controller[this.targetAspect] = this.dataBinding.createObserver(this, this));
            observer.controller = controller;
            controller.source.$cssBindings.set(this, { controller, observer });
        }
        /**
         * Executed when this behavior's host is connected.
         * @param controller - Controls the behavior lifecycle.
         */
        connectedCallback(controller) {
            handleChange(this, controller, controller[this.targetAspect]);
        }
        /**
         * Executed when this behavior is detached from a controller.
         * @param controller - Controls the behavior lifecycle.
         */
        removedCallback(controller) {
            if (controller.source.$cssBindings) {
                controller.source.$cssBindings.delete(this);
            }
        }
        /**
         * Called when a subject this instance has subscribed to changes.
         * @param subject - The subject of the change.
         * @param args - The event args detailing the change that occurred.
         *
         * @internal
         */
        handleChange(_, observer) {
            handleChange(this, observer.controller, observer);
        }
    }
    CSSDirective.define(CSSBindingDirective);

    const marker$1 = `${Math.random().toString(36).substring(2, 8)}`;
    let varId = 0;
    const nextCSSVariable = () => `--v${marker$1}${++varId}`;
    function collectStyles(strings, values) {
        const styles = [];
        let cssString = "";
        const behaviors = [];
        const add = (behavior) => {
            behaviors.push(behavior);
        };
        for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
            cssString += strings[i];
            let value = values[i];
            if (isFunction(value)) {
                value = new CSSBindingDirective(oneWay(value), nextCSSVariable()).createCSS(add);
            }
            else if (value instanceof Binding) {
                value = new CSSBindingDirective(value, nextCSSVariable()).createCSS(add);
            }
            else if (CSSDirective.getForInstance(value) !== void 0) {
                value = value.createCSS(add);
            }
            if (value instanceof ElementStyles || value instanceof CSSStyleSheet) {
                if (cssString.trim() !== "") {
                    styles.push(cssString);
                    cssString = "";
                }
                styles.push(value);
            }
            else {
                cssString += value;
            }
        }
        cssString += strings[strings.length - 1];
        if (cssString.trim() !== "") {
            styles.push(cssString);
        }
        return {
            styles,
            behaviors,
        };
    }
    /**
     * Transforms a template literal string into styles.
     * @param strings - The string fragments that are interpolated with the values.
     * @param values - The values that are interpolated with the string fragments.
     * @remarks
     * The css helper supports interpolation of strings and ElementStyle instances.
     * @public
     */
    const css = ((strings, ...values) => {
        const { styles, behaviors } = collectStyles(strings, values);
        const elementStyles = new ElementStyles(styles);
        return behaviors.length ? elementStyles.withBehaviors(...behaviors) : elementStyles;
    });
    class CSSPartial {
        constructor(styles, behaviors) {
            this.behaviors = behaviors;
            this.css = "";
            const stylesheets = styles.reduce((accumulated, current) => {
                if (isString(current)) {
                    this.css += current;
                }
                else {
                    accumulated.push(current);
                }
                return accumulated;
            }, []);
            if (stylesheets.length) {
                this.styles = new ElementStyles(stylesheets);
            }
        }
        createCSS(add) {
            this.behaviors.forEach(add);
            if (this.styles) {
                add(this);
            }
            return this.css;
        }
        addedCallback(controller) {
            controller.addStyles(this.styles);
        }
        removedCallback(controller) {
            controller.removeStyles(this.styles);
        }
    }
    CSSDirective.define(CSSPartial);
    css.partial = (strings, ...values) => {
        const { styles, behaviors } = collectStyles(strings, values);
        return new CSSPartial(styles, behaviors);
    };

    const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;
    const interpolationStart = `${marker}{`;
    const interpolationEnd = `}${marker}`;
    const interpolationEndLength = interpolationEnd.length;
    let id$1 = 0;
    /** @internal */
    const nextId = () => `${marker}-${++id$1}`;
    /**
     * Common APIs related to markup generation.
     * @public
     */
    const Markup = Object.freeze({
        /**
         * Creates a placeholder string suitable for marking out a location *within*
         * an attribute value or HTML content.
         * @param index - The directive index to create the placeholder for.
         * @remarks
         * Used internally by binding directives.
         */
        interpolation: (id) => `${interpolationStart}${id}${interpolationEnd}`,
        /**
         * Creates a placeholder that manifests itself as an attribute on an
         * element.
         * @param attributeName - The name of the custom attribute.
         * @param index - The directive index to create the placeholder for.
         * @remarks
         * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
         */
        attribute: (id) => `${nextId()}="${interpolationStart}${id}${interpolationEnd}"`,
        /**
         * Creates a placeholder that manifests itself as a marker within the DOM structure.
         * @param index - The directive index to create the placeholder for.
         * @remarks
         * Used internally by structural directives such as `repeat`.
         */
        comment: (id) => `<!--${interpolationStart}${id}${interpolationEnd}-->`,
    });
    /**
     * Common APIs related to content parsing.
     * @public
     */
    const Parser = Object.freeze({
        /**
         * Parses text content or HTML attribute content, separating out the static strings
         * from the directives.
         * @param value - The content or attribute string to parse.
         * @param factories - A list of directives to search for in the string.
         * @returns A heterogeneous array of static strings interspersed with
         * directives or null if no directives are found in the string.
         */
        parse(value, factories) {
            const parts = value.split(interpolationStart);
            if (parts.length === 1) {
                return null;
            }
            const result = [];
            for (let i = 0, ii = parts.length; i < ii; ++i) {
                const current = parts[i];
                const index = current.indexOf(interpolationEnd);
                let literal;
                if (index === -1) {
                    literal = current;
                }
                else {
                    const factoryId = current.substring(0, index);
                    result.push(factories[factoryId]);
                    literal = current.substring(index + interpolationEndLength);
                }
                if (literal !== "") {
                    result.push(literal);
                }
            }
            return result;
        },
    });

    const registry = createTypeRegistry();
    /**
     * Instructs the template engine to apply behavior to a node.
     * @public
     */
    const HTMLDirective = Object.freeze({
        /**
         * Gets the directive definition associated with the instance.
         * @param instance - The directive instance to retrieve the definition for.
         */
        getForInstance: registry.getForInstance,
        /**
         * Gets the directive definition associated with the specified type.
         * @param type - The directive type to retrieve the definition for.
         */
        getByType: registry.getByType,
        /**
         * Defines an HTMLDirective based on the options.
         * @param type - The type to define as a directive.
         * @param options - Options that specify the directive's application.
         */
        define(type, options) {
            options = options || {};
            options.type = type;
            registry.register(options);
            return type;
        },
        /**
         *
         * @param directive - The directive to assign the aspect to.
         * @param value - The value to base the aspect determination on.
         * @remarks
         * If a falsy value is provided, then the content aspect will be assigned.
         */
        assignAspect(directive, value) {
            if (!value) {
                directive.aspectType = DOMAspect.content;
                return;
            }
            directive.sourceAspect = value;
            switch (value[0]) {
                case ":":
                    directive.targetAspect = value.substring(1);
                    directive.aspectType =
                        directive.targetAspect === "classList"
                            ? DOMAspect.tokenList
                            : DOMAspect.property;
                    break;
                case "?":
                    directive.targetAspect = value.substring(1);
                    directive.aspectType = DOMAspect.booleanAttribute;
                    break;
                case "@":
                    directive.targetAspect = value.substring(1);
                    directive.aspectType = DOMAspect.event;
                    break;
                default:
                    directive.targetAspect = value;
                    directive.aspectType = DOMAspect.attribute;
                    break;
            }
        },
    });
    /**
     * Decorator: Defines an HTMLDirective.
     * @param options - Provides options that specify the directive's application.
     * @public
     */
    function htmlDirective(options) {
        /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
        return function (type) {
            HTMLDirective.define(type, options);
        };
    }
    /**
     * A base class used for attribute directives that don't need internal state.
     * @public
     */
    class StatelessAttachedAttributeDirective {
        /**
         * Creates an instance of RefDirective.
         * @param options - The options to use in configuring the directive.
         */
        constructor(options) {
            this.options = options;
        }
        /**
         * Creates a placeholder string based on the directive's index within the template.
         * @param index - The index of the directive within the template.
         * @remarks
         * Creates a custom attribute placeholder.
         */
        createHTML(add) {
            return Markup.attribute(add(this));
        }
        /**
         * Creates a behavior.
         * @param targets - The targets available for behaviors to be attached to.
         */
        createBehavior() {
            return this;
        }
    }
    makeSerializationNoop(StatelessAttachedAttributeDirective);

    function updateContent(target, aspect, value, controller) {
        // If there's no actual value, then this equates to the
        // empty string for the purposes of content bindings.
        if (value === null || value === undefined) {
            value = "";
        }
        // If the value has a "create" method, then it's a ContentTemplate.
        if (value.create) {
            target.textContent = "";
            let view = target.$fastView;
            // If there's no previous view that we might be able to
            // reuse then create a new view from the template.
            if (view === void 0) {
                view = value.create();
            }
            else {
                // If there is a previous view, but it wasn't created
                // from the same template as the new value, then we
                // need to remove the old view if it's still in the DOM
                // and create a new view from the template.
                if (target.$fastTemplate !== value) {
                    if (view.isComposed) {
                        view.remove();
                        view.unbind();
                    }
                    view = value.create();
                }
            }
            // It's possible that the value is the same as the previous template
            // and that there's actually no need to compose it.
            if (!view.isComposed) {
                view.isComposed = true;
                view.bind(controller.source, controller.context);
                view.insertBefore(target);
                target.$fastView = view;
                target.$fastTemplate = value;
            }
            else if (view.needsBindOnly) {
                view.needsBindOnly = false;
                view.bind(controller.source, controller.context);
            }
        }
        else {
            const view = target.$fastView;
            // If there is a view and it's currently composed into
            // the DOM, then we need to remove it.
            if (view !== void 0 && view.isComposed) {
                view.isComposed = false;
                view.remove();
                if (view.needsBindOnly) {
                    view.needsBindOnly = false;
                }
                else {
                    view.unbind();
                }
            }
            target.textContent = value;
        }
    }
    function updateTokenList(target, aspect, value) {
        var _a;
        const lookup = `${this.id}-t`;
        const state = (_a = target[lookup]) !== null && _a !== void 0 ? _a : (target[lookup] = { v: 0, cv: Object.create(null) });
        const classVersions = state.cv;
        let version = state.v;
        const tokenList = target[aspect];
        // Add the classes, tracking the version at which they were added.
        if (value !== null && value !== undefined && value.length) {
            const names = value.split(/\s+/);
            for (let i = 0, ii = names.length; i < ii; ++i) {
                const currentName = names[i];
                if (currentName === "") {
                    continue;
                }
                classVersions[currentName] = version;
                tokenList.add(currentName);
            }
        }
        state.v = version + 1;
        // If this is the first call to add classes, there's no need to remove old ones.
        if (version === 0) {
            return;
        }
        // Remove classes from the previous version.
        version -= 1;
        for (const name in classVersions) {
            if (classVersions[name] === version) {
                tokenList.remove(name);
            }
        }
    }
    const sinkLookup = {
        [DOMAspect.attribute]: DOM.setAttribute,
        [DOMAspect.booleanAttribute]: DOM.setBooleanAttribute,
        [DOMAspect.property]: (t, a, v) => (t[a] = v),
        [DOMAspect.content]: updateContent,
        [DOMAspect.tokenList]: updateTokenList,
        [DOMAspect.event]: () => void 0,
    };
    /**
     * A directive that applies bindings.
     * @public
     */
    class HTMLBindingDirective {
        /**
         * Creates an instance of HTMLBindingDirective.
         * @param dataBinding - The binding configuration to apply.
         */
        constructor(dataBinding) {
            this.dataBinding = dataBinding;
            this.updateTarget = null;
            /**
             * The type of aspect to target.
             */
            this.aspectType = DOMAspect.content;
        }
        /**
         * Creates HTML to be used within a template.
         * @param add - Can be used to add  behavior factories to a template.
         */
        createHTML(add) {
            return Markup.interpolation(add(this));
        }
        /**
         * Creates a behavior.
         */
        createBehavior() {
            var _a;
            if (this.updateTarget === null) {
                const sink = sinkLookup[this.aspectType];
                const policy = (_a = this.dataBinding.policy) !== null && _a !== void 0 ? _a : this.policy;
                if (!sink) {
                    throw FAST.error(1205 /* Message.unsupportedBindingBehavior */);
                }
                this.data = `${this.id}-d`;
                this.updateTarget = policy.protect(this.targetTagName, this.aspectType, this.targetAspect, sink);
            }
            return this;
        }
        /** @internal */
        bind(controller) {
            var _a;
            const target = controller.targets[this.targetNodeId];
            switch (this.aspectType) {
                case DOMAspect.event:
                    target[this.data] = controller;
                    target.addEventListener(this.targetAspect, this, this.dataBinding.options);
                    break;
                case DOMAspect.content:
                    controller.onUnbind(this);
                // intentional fall through
                default:
                    const observer = (_a = target[this.data]) !== null && _a !== void 0 ? _a : (target[this.data] = this.dataBinding.createObserver(this, this));
                    observer.target = target;
                    observer.controller = controller;
                    this.updateTarget(target, this.targetAspect, observer.bind(controller), controller);
                    break;
            }
        }
        /** @internal */
        unbind(controller) {
            const target = controller.targets[this.targetNodeId];
            const view = target.$fastView;
            if (view !== void 0 && view.isComposed) {
                view.unbind();
                view.needsBindOnly = true;
            }
        }
        /** @internal */
        handleEvent(event) {
            const controller = event.currentTarget[this.data];
            if (controller.isBound) {
                ExecutionContext.setEvent(event);
                const result = this.dataBinding.evaluate(controller.source, controller.context);
                ExecutionContext.setEvent(null);
                if (result !== true) {
                    event.preventDefault();
                }
            }
        }
        /** @internal */
        handleChange(binding, observer) {
            const target = observer.target;
            const controller = observer.controller;
            this.updateTarget(target, this.targetAspect, observer.bind(controller), controller);
        }
    }
    HTMLDirective.define(HTMLBindingDirective, { aspected: true });

    function removeNodeSequence(firstNode, lastNode) {
        const parent = firstNode.parentNode;
        let current = firstNode;
        let next;
        while (current !== lastNode) {
            next = current.nextSibling;
            parent.removeChild(current);
            current = next;
        }
        parent.removeChild(lastNode);
    }
    /**
     * The standard View implementation, which also implements ElementView and SyntheticView.
     * @public
     */
    class HTMLView {
        /**
         * Constructs an instance of HTMLView.
         * @param fragment - The html fragment that contains the nodes for this view.
         * @param behaviors - The behaviors to be applied to this view.
         */
        constructor(fragment, factories, targets) {
            this.fragment = fragment;
            this.factories = factories;
            this.targets = targets;
            this.behaviors = null;
            this.unbindables = [];
            /**
             * The data that the view is bound to.
             */
            this.source = null;
            /**
             * Indicates whether the controller is bound.
             */
            this.isBound = false;
            /**
             * Indicates how the source's lifetime relates to the controller's lifetime.
             */
            this.sourceLifetime = SourceLifetime.unknown;
            /**
             * The execution context the view is running within.
             */
            this.context = this;
            /**
             * The index of the current item within a repeat context.
             */
            this.index = 0;
            /**
             * The length of the current collection within a repeat context.
             */
            this.length = 0;
            this.firstChild = fragment.firstChild;
            this.lastChild = fragment.lastChild;
        }
        /**
         * The current event within an event handler.
         */
        get event() {
            return ExecutionContext.getEvent();
        }
        /**
         * Indicates whether the current item within a repeat context
         * has an even index.
         */
        get isEven() {
            return this.index % 2 === 0;
        }
        /**
         * Indicates whether the current item within a repeat context
         * has an odd index.
         */
        get isOdd() {
            return this.index % 2 !== 0;
        }
        /**
         * Indicates whether the current item within a repeat context
         * is the first item in the collection.
         */
        get isFirst() {
            return this.index === 0;
        }
        /**
         * Indicates whether the current item within a repeat context
         * is somewhere in the middle of the collection.
         */
        get isInMiddle() {
            return !this.isFirst && !this.isLast;
        }
        /**
         * Indicates whether the current item within a repeat context
         * is the last item in the collection.
         */
        get isLast() {
            return this.index === this.length - 1;
        }
        /**
         * Returns the typed event detail of a custom event.
         */
        eventDetail() {
            return this.event.detail;
        }
        /**
         * Returns the typed event target of the event.
         */
        eventTarget() {
            return this.event.target;
        }
        /**
         * Appends the view's DOM nodes to the referenced node.
         * @param node - The parent node to append the view's DOM nodes to.
         */
        appendTo(node) {
            node.appendChild(this.fragment);
        }
        /**
         * Inserts the view's DOM nodes before the referenced node.
         * @param node - The node to insert the view's DOM before.
         */
        insertBefore(node) {
            if (this.fragment.hasChildNodes()) {
                node.parentNode.insertBefore(this.fragment, node);
            }
            else {
                const end = this.lastChild;
                if (node.previousSibling === end)
                    return;
                const parentNode = node.parentNode;
                let current = this.firstChild;
                let next;
                while (current !== end) {
                    next = current.nextSibling;
                    parentNode.insertBefore(current, node);
                    current = next;
                }
                parentNode.insertBefore(end, node);
            }
        }
        /**
         * Removes the view's DOM nodes.
         * The nodes are not disposed and the view can later be re-inserted.
         */
        remove() {
            const fragment = this.fragment;
            const end = this.lastChild;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                fragment.appendChild(current);
                current = next;
            }
            fragment.appendChild(end);
        }
        /**
         * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
         * Once a view has been disposed, it cannot be inserted or bound again.
         */
        dispose() {
            removeNodeSequence(this.firstChild, this.lastChild);
            this.unbind();
        }
        onUnbind(behavior) {
            this.unbindables.push(behavior);
        }
        /**
         * Binds a view's behaviors to its binding source.
         * @param source - The binding source for the view's binding behaviors.
         * @param context - The execution context to run the behaviors within.
         */
        bind(source, context = this) {
            if (this.source === source) {
                return;
            }
            let behaviors = this.behaviors;
            if (behaviors === null) {
                this.source = source;
                this.context = context;
                this.behaviors = behaviors = new Array(this.factories.length);
                const factories = this.factories;
                for (let i = 0, ii = factories.length; i < ii; ++i) {
                    const behavior = factories[i].createBehavior();
                    behavior.bind(this);
                    behaviors[i] = behavior;
                }
            }
            else {
                if (this.source !== null) {
                    this.evaluateUnbindables();
                }
                this.isBound = false;
                this.source = source;
                this.context = context;
                for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                    behaviors[i].bind(this);
                }
            }
            this.isBound = true;
        }
        /**
         * Unbinds a view's behaviors from its binding source.
         */
        unbind() {
            if (!this.isBound || this.source === null) {
                return;
            }
            this.evaluateUnbindables();
            this.source = null;
            this.context = this;
            this.isBound = false;
        }
        evaluateUnbindables() {
            const unbindables = this.unbindables;
            for (let i = 0, ii = unbindables.length; i < ii; ++i) {
                unbindables[i].unbind(this);
            }
            unbindables.length = 0;
        }
        /**
         * Efficiently disposes of a contiguous range of synthetic view instances.
         * @param views - A contiguous range of views to be disposed.
         */
        static disposeContiguousBatch(views) {
            if (views.length === 0) {
                return;
            }
            removeNodeSequence(views[0].firstChild, views[views.length - 1].lastChild);
            for (let i = 0, ii = views.length; i < ii; ++i) {
                views[i].unbind();
            }
        }
    }
    makeSerializationNoop(HTMLView);
    Observable.defineProperty(HTMLView.prototype, "index");
    Observable.defineProperty(HTMLView.prototype, "length");

    const targetIdFrom = (parentId, nodeIndex) => `${parentId}.${nodeIndex}`;
    const descriptorCache = {};
    // used to prevent creating lots of objects just to track node and index while compiling
    const next = {
        index: 0,
        node: null,
    };
    function tryWarn(name) {
        if (!name.startsWith("fast-")) {
            FAST.warn(1204 /* Message.hostBindingWithoutHost */, { name });
        }
    }
    const warningHost = new Proxy(document.createElement("div"), {
        get(target, property) {
            tryWarn(property);
            const value = Reflect.get(target, property);
            return isFunction(value) ? value.bind(target) : value;
        },
        set(target, property, value) {
            tryWarn(property);
            return Reflect.set(target, property, value);
        },
    });
    class CompilationContext {
        constructor(fragment, directives, policy) {
            this.fragment = fragment;
            this.directives = directives;
            this.policy = policy;
            this.proto = null;
            this.nodeIds = new Set();
            this.descriptors = {};
            this.factories = [];
        }
        addFactory(factory, parentId, nodeId, targetIndex, tagName) {
            var _a, _b;
            if (!this.nodeIds.has(nodeId)) {
                this.nodeIds.add(nodeId);
                this.addTargetDescriptor(parentId, nodeId, targetIndex);
            }
            factory.id = (_a = factory.id) !== null && _a !== void 0 ? _a : nextId();
            factory.targetNodeId = nodeId;
            factory.targetTagName = tagName;
            factory.policy = (_b = factory.policy) !== null && _b !== void 0 ? _b : this.policy;
            this.factories.push(factory);
        }
        freeze() {
            this.proto = Object.create(null, this.descriptors);
            return this;
        }
        addTargetDescriptor(parentId, targetId, targetIndex) {
            const descriptors = this.descriptors;
            if (targetId === "r" || // root
                targetId === "h" || // host
                descriptors[targetId]) {
                return;
            }
            if (!descriptors[parentId]) {
                const index = parentId.lastIndexOf(".");
                const grandparentId = parentId.substring(0, index);
                const childIndex = parseInt(parentId.substring(index + 1));
                this.addTargetDescriptor(grandparentId, parentId, childIndex);
            }
            let descriptor = descriptorCache[targetId];
            if (!descriptor) {
                const field = `_${targetId}`;
                descriptorCache[targetId] = descriptor = {
                    get() {
                        var _a;
                        return ((_a = this[field]) !== null && _a !== void 0 ? _a : (this[field] = this[parentId].childNodes[targetIndex]));
                    },
                };
            }
            descriptors[targetId] = descriptor;
        }
        createView(hostBindingTarget) {
            const fragment = this.fragment.cloneNode(true);
            const targets = Object.create(this.proto);
            targets.r = fragment;
            targets.h = hostBindingTarget !== null && hostBindingTarget !== void 0 ? hostBindingTarget : warningHost;
            for (const id of this.nodeIds) {
                targets[id]; // trigger locator
            }
            return new HTMLView(fragment, this.factories, targets);
        }
    }
    function compileAttributes(context, parentId, node, nodeId, nodeIndex, includeBasicValues = false) {
        const attributes = node.attributes;
        const directives = context.directives;
        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const attr = attributes[i];
            const attrValue = attr.value;
            const parseResult = Parser.parse(attrValue, directives);
            let result = null;
            if (parseResult === null) {
                if (includeBasicValues) {
                    result = new HTMLBindingDirective(oneTime(() => attrValue, context.policy));
                    HTMLDirective.assignAspect(result, attr.name);
                }
            }
            else {
                /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                result = Compiler.aggregate(parseResult, context.policy);
            }
            if (result !== null) {
                node.removeAttributeNode(attr);
                i--;
                ii--;
                context.addFactory(result, parentId, nodeId, nodeIndex, node.tagName);
            }
        }
    }
    function compileContent(context, node, parentId, nodeId, nodeIndex) {
        const parseResult = Parser.parse(node.textContent, context.directives);
        if (parseResult === null) {
            next.node = node.nextSibling;
            next.index = nodeIndex + 1;
            return next;
        }
        let currentNode;
        let lastNode = (currentNode = node);
        for (let i = 0, ii = parseResult.length; i < ii; ++i) {
            const currentPart = parseResult[i];
            if (i !== 0) {
                nodeIndex++;
                nodeId = targetIdFrom(parentId, nodeIndex);
                currentNode = lastNode.parentNode.insertBefore(document.createTextNode(""), lastNode.nextSibling);
            }
            if (isString(currentPart)) {
                currentNode.textContent = currentPart;
            }
            else {
                currentNode.textContent = " ";
                HTMLDirective.assignAspect(currentPart);
                context.addFactory(currentPart, parentId, nodeId, nodeIndex, null);
            }
            lastNode = currentNode;
        }
        next.index = nodeIndex + 1;
        next.node = lastNode.nextSibling;
        return next;
    }
    function compileChildren(context, parent, parentId) {
        let nodeIndex = 0;
        let childNode = parent.firstChild;
        while (childNode) {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            const result = compileNode(context, parentId, childNode, nodeIndex);
            childNode = result.node;
            nodeIndex = result.index;
        }
    }
    function compileNode(context, parentId, node, nodeIndex) {
        const nodeId = targetIdFrom(parentId, nodeIndex);
        switch (node.nodeType) {
            case 1: // element node
                compileAttributes(context, parentId, node, nodeId, nodeIndex);
                compileChildren(context, node, nodeId);
                break;
            case 3: // text node
                return compileContent(context, node, parentId, nodeId, nodeIndex);
            case 8: // comment
                const parts = Parser.parse(node.data, context.directives);
                if (parts !== null) {
                    context.addFactory(
                    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                    Compiler.aggregate(parts), parentId, nodeId, nodeIndex, null);
                }
                break;
        }
        next.index = nodeIndex + 1;
        next.node = node.nextSibling;
        return next;
    }
    function isMarker(node, directives) {
        return (node &&
            node.nodeType == 8 &&
            Parser.parse(node.data, directives) !== null);
    }
    const templateTag = "TEMPLATE";
    /**
     * Common APIs related to compilation.
     * @public
     */
    const Compiler = {
        /**
         * Compiles a template and associated directives into a compilation
         * result which can be used to create views.
         * @param html - The html string or template element to compile.
         * @param factories - The behavior factories referenced by the template.
         * @param policy - The security policy to compile the html with.
         * @remarks
         * The template that is provided for compilation is altered in-place
         * and cannot be compiled again. If the original template must be preserved,
         * it is recommended that you clone the original and pass the clone to this API.
         * @public
         */
        compile(html, factories, policy = DOM.policy) {
            let template;
            if (isString(html)) {
                template = document.createElement(templateTag);
                template.innerHTML = policy.createHTML(html);
                const fec = template.content.firstElementChild;
                if (fec !== null && fec.tagName === templateTag) {
                    template = fec;
                }
            }
            else {
                template = html;
            }
            if (!template.content.firstChild && !template.content.lastChild) {
                template.content.appendChild(document.createComment(""));
            }
            // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
            const fragment = document.adoptNode(template.content);
            const context = new CompilationContext(fragment, factories, policy);
            compileAttributes(context, "", template, /* host */ "h", 0, true);
            if (
            // If the first node in a fragment is a marker, that means it's an unstable first node,
            // because something like a when, repeat, etc. could add nodes before the marker.
            // To mitigate this, we insert a stable first node. However, if we insert a node,
            // that will alter the result of the TreeWalker. So, we also need to offset the target index.
            isMarker(fragment.firstChild, factories) ||
                // Or if there is only one node and a directive, it means the template's content
                // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
                // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
                (fragment.childNodes.length === 1 && Object.keys(factories).length > 0)) {
                fragment.insertBefore(document.createComment(""), fragment.firstChild);
            }
            compileChildren(context, fragment, /* root */ "r");
            next.node = null; // prevent leaks
            return context.freeze();
        },
        /**
         * Sets the default compilation strategy that will be used by the ViewTemplate whenever
         * it needs to compile a view preprocessed with the html template function.
         * @param strategy - The compilation strategy to use when compiling templates.
         */
        setDefaultStrategy(strategy) {
            this.compile = strategy;
        },
        /**
         * Aggregates an array of strings and directives into a single directive.
         * @param parts - A heterogeneous array of static strings interspersed with
         * directives.
         * @param policy - The security policy to use with the aggregated bindings.
         * @returns A single inline directive that aggregates the behavior of all the parts.
         */
        aggregate(parts, policy = DOM.policy) {
            if (parts.length === 1) {
                return parts[0];
            }
            let sourceAspect;
            let binding;
            let isVolatile = false;
            let bindingPolicy = void 0;
            const partCount = parts.length;
            const finalParts = parts.map((x) => {
                if (isString(x)) {
                    return () => x;
                }
                sourceAspect = x.sourceAspect || sourceAspect;
                binding = x.dataBinding || binding;
                isVolatile = isVolatile || x.dataBinding.isVolatile;
                bindingPolicy = bindingPolicy || x.dataBinding.policy;
                return x.dataBinding.evaluate;
            });
            const expression = (scope, context) => {
                let output = "";
                for (let i = 0; i < partCount; ++i) {
                    output += finalParts[i](scope, context);
                }
                return output;
            };
            binding.evaluate = expression;
            binding.isVolatile = isVolatile;
            binding.policy = bindingPolicy !== null && bindingPolicy !== void 0 ? bindingPolicy : policy;
            const directive = new HTMLBindingDirective(binding);
            HTMLDirective.assignAspect(directive, sourceAspect);
            return directive;
        },
    };

    // Much thanks to LitHTML for working this out!
    const lastAttributeNameRegex = 
    /* eslint-disable-next-line no-control-regex */
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
    const noFactories = Object.create(null);
    /**
     * Inlines a template into another template.
     * @public
     */
    class InlineTemplateDirective {
        /**
         * Creates an instance of InlineTemplateDirective.
         * @param template - The template to inline.
         */
        constructor(html, factories = noFactories) {
            this.html = html;
            this.factories = factories;
        }
        /**
         * Creates HTML to be used within a template.
         * @param add - Can be used to add  behavior factories to a template.
         */
        createHTML(add) {
            const factories = this.factories;
            for (const key in factories) {
                add(factories[key]);
            }
            return this.html;
        }
    }
    /**
     * An empty template partial.
     */
    InlineTemplateDirective.empty = new InlineTemplateDirective("");
    HTMLDirective.define(InlineTemplateDirective);
    function createHTML(value, prevString, add, definition = HTMLDirective.getForInstance(value)) {
        if (definition.aspected) {
            const match = lastAttributeNameRegex.exec(prevString);
            if (match !== null) {
                HTMLDirective.assignAspect(value, match[2]);
            }
        }
        return value.createHTML(add);
    }
    /**
     * A template capable of creating HTMLView instances or rendering directly to DOM.
     * @public
     */
    class ViewTemplate {
        /**
         * Creates an instance of ViewTemplate.
         * @param html - The html representing what this template will instantiate, including placeholders for directives.
         * @param factories - The directives that will be connected to placeholders in the html.
         * @param policy - The security policy to use when compiling this template.
         */
        constructor(html, factories = {}, policy) {
            this.policy = policy;
            this.result = null;
            this.html = html;
            this.factories = factories;
        }
        /**
         * Creates an HTMLView instance based on this template definition.
         * @param hostBindingTarget - The element that host behaviors will be bound to.
         */
        create(hostBindingTarget) {
            if (this.result === null) {
                this.result = Compiler.compile(this.html, this.factories, this.policy);
            }
            return this.result.createView(hostBindingTarget);
        }
        /**
         * Returns a directive that can inline the template.
         */
        inline() {
            return new InlineTemplateDirective(isString(this.html) ? this.html : this.html.innerHTML, this.factories);
        }
        /**
         * Sets the DOMPolicy for this template.
         * @param policy - The policy to associated with this template.
         * @returns The modified template instance.
         * @remarks
         * The DOMPolicy can only be set once for a template and cannot be
         * set after the template is compiled.
         */
        withPolicy(policy) {
            if (this.result) {
                throw FAST.error(1208 /* Message.cannotSetTemplatePolicyAfterCompilation */);
            }
            if (this.policy) {
                throw FAST.error(1207 /* Message.onlySetTemplatePolicyOnce */);
            }
            this.policy = policy;
            return this;
        }
        /**
         * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
         * @param source - The data source to bind the template to.
         * @param host - The Element where the template will be rendered.
         * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
         * host that the template is being attached to.
         */
        render(source, host, hostBindingTarget) {
            const view = this.create(hostBindingTarget);
            view.bind(source);
            view.appendTo(host);
            return view;
        }
        /**
         * Creates a template based on a set of static strings and dynamic values.
         * @param strings - The static strings to create the template with.
         * @param values - The dynamic values to create the template with.
         * @param policy - The DOMPolicy to associated with the template.
         * @returns A ViewTemplate.
         * @remarks
         * This API should not be used directly under normal circumstances because constructing
         * a template in this way, if not done properly, can open up the application to XSS
         * attacks. When using this API, provide a strong DOMPolicy that can properly sanitize
         * and also be sure to manually sanitize all static strings particularly if they can
         * come from user input.
         */
        static create(strings, values, policy) {
            let html = "";
            const factories = Object.create(null);
            const add = (factory) => {
                var _a;
                const id = (_a = factory.id) !== null && _a !== void 0 ? _a : (factory.id = nextId());
                factories[id] = factory;
                return id;
            };
            for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
                const currentString = strings[i];
                let currentValue = values[i];
                let definition;
                html += currentString;
                if (isFunction(currentValue)) {
                    currentValue = new HTMLBindingDirective(oneWay(currentValue));
                }
                else if (currentValue instanceof Binding) {
                    currentValue = new HTMLBindingDirective(currentValue);
                }
                else if (!(definition = HTMLDirective.getForInstance(currentValue))) {
                    const staticValue = currentValue;
                    currentValue = new HTMLBindingDirective(oneTime(() => staticValue));
                }
                html += createHTML(currentValue, currentString, add, definition);
            }
            return new ViewTemplate(html + strings[strings.length - 1], factories, policy);
        }
    }
    makeSerializationNoop(ViewTemplate);
    /**
     * Transforms a template literal string into a ViewTemplate.
     * @param strings - The string fragments that are interpolated with the values.
     * @param values - The values that are interpolated with the string fragments.
     * @remarks
     * The html helper supports interpolation of strings, numbers, binding expressions,
     * other template instances, and Directive instances.
     * @public
     */
    const html = ((strings, ...values) => {
        if (Array.isArray(strings) && Array.isArray(strings.raw)) {
            return ViewTemplate.create(strings, values);
        }
        throw FAST.error(1206 /* Message.directCallToHTMLTagNotAllowed */);
    });
    html.partial = (html) => {
        return new InlineTemplateDirective(html);
    };

    /**
     * The runtime behavior for template references.
     * @public
     */
    class RefDirective extends StatelessAttachedAttributeDirective {
        /**
         * Bind this behavior.
         * @param controller - The view controller that manages the lifecycle of this behavior.
         */
        bind(controller) {
            controller.source[this.options] = controller.targets[this.targetNodeId];
        }
    }
    HTMLDirective.define(RefDirective);
    /**
     * A directive that observes the updates a property with a reference to the element.
     * @param propertyName - The name of the property to assign the reference to.
     * @public
     */
    const ref = (propertyName) => new RefDirective(propertyName);

    /**
     * A base class for node observation.
     * @public
     * @remarks
     * Internally used by the SlottedDirective and the ChildrenDirective.
     */
    class NodeObservationDirective extends StatelessAttachedAttributeDirective {
        /**
         * The unique id of the factory.
         */
        get id() {
            return this._id;
        }
        set id(value) {
            this._id = value;
            this._controllerProperty = `${value}-c`;
        }
        /**
         * Bind this behavior to the source.
         * @param source - The source to bind to.
         * @param context - The execution context that the binding is operating within.
         * @param targets - The targets that behaviors in a view can attach to.
         */
        bind(controller) {
            const target = controller.targets[this.targetNodeId];
            target[this._controllerProperty] = controller;
            this.updateTarget(controller.source, this.computeNodes(target));
            this.observe(target);
            controller.onUnbind(this);
        }
        /**
         * Unbinds this behavior from the source.
         * @param source - The source to unbind from.
         * @param context - The execution context that the binding is operating within.
         * @param targets - The targets that behaviors in a view can attach to.
         */
        unbind(controller) {
            const target = controller.targets[this.targetNodeId];
            this.updateTarget(controller.source, emptyArray);
            this.disconnect(target);
            target[this._controllerProperty] = null;
        }
        /**
         * Gets the data source for the target.
         * @param target - The target to get the source for.
         * @returns The source.
         */
        getSource(target) {
            return target[this._controllerProperty].source;
        }
        /**
         * Updates the source property with the computed nodes.
         * @param source - The source object to assign the nodes property to.
         * @param value - The nodes to assign to the source object property.
         */
        updateTarget(source, value) {
            source[this.options.property] = value;
        }
        /**
         * Computes the set of nodes that should be assigned to the source property.
         * @param target - The target to compute the nodes for.
         * @returns The computed nodes.
         * @remarks
         * Applies filters if provided.
         */
        computeNodes(target) {
            let nodes = this.getNodes(target);
            if ("filter" in this.options) {
                nodes = nodes.filter(this.options.filter);
            }
            return nodes;
        }
    }

    const slotEvent = "slotchange";
    /**
     * The runtime behavior for slotted node observation.
     * @public
     */
    class SlottedDirective extends NodeObservationDirective {
        /**
         * Begins observation of the nodes.
         * @param target - The target to observe.
         */
        observe(target) {
            target.addEventListener(slotEvent, this);
        }
        /**
         * Disconnects observation of the nodes.
         * @param target - The target to unobserve.
         */
        disconnect(target) {
            target.removeEventListener(slotEvent, this);
        }
        /**
         * Retrieves the raw nodes that should be assigned to the source property.
         * @param target - The target to get the node to.
         */
        getNodes(target) {
            return target.assignedNodes(this.options);
        }
        /** @internal */
        handleEvent(event) {
            const target = event.currentTarget;
            this.updateTarget(this.getSource(target), this.computeNodes(target));
        }
    }
    HTMLDirective.define(SlottedDirective);
    /**
     * A directive that observes the `assignedNodes()` of a slot and updates a property
     * whenever they change.
     * @param propertyOrOptions - The options used to configure slotted node observation.
     * @public
     */
    function slotted(propertyOrOptions) {
        if (isString(propertyOrOptions)) {
            propertyOrOptions = { property: propertyOrOptions };
        }
        return new SlottedDirective(propertyOrOptions);
    }

    const booleanMode = "boolean";
    const reflectMode = "reflect";
    /**
     * Metadata used to configure a custom attribute's behavior.
     * @public
     */
    const AttributeConfiguration = Object.freeze({
        /**
         * Locates all attribute configurations associated with a type.
         */
        locate: createMetadataLocator(),
    });
    /**
     * A {@link ValueConverter} that converts to and from `boolean` values.
     * @remarks
     * Used automatically when the `boolean` {@link AttributeMode} is selected.
     * @public
     */
    const booleanConverter = {
        toView(value) {
            return value ? "true" : "false";
        },
        fromView(value) {
            return value === null ||
                value === void 0 ||
                value === "false" ||
                value === false ||
                value === 0
                ? false
                : true;
        },
    };
    function toNumber(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number;
    }
    /**
     * A {@link ValueConverter} that converts to and from `number` values.
     * @remarks
     * This converter allows for nullable numbers, returning `null` if the
     * input was `null`, `undefined`, or `NaN`.
     * @public
     */
    const nullableNumberConverter = {
        toView(value) {
            const output = toNumber(value);
            return output ? output.toString() : output;
        },
        fromView: toNumber,
    };
    /**
     * An implementation of {@link Accessor} that supports reactivity,
     * change callbacks, attribute reflection, and type conversion for
     * custom elements.
     * @public
     */
    class AttributeDefinition {
        /**
         * Creates an instance of AttributeDefinition.
         * @param Owner - The class constructor that owns this attribute.
         * @param name - The name of the property associated with the attribute.
         * @param attribute - The name of the attribute in HTML.
         * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
         * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
         * to convert values to and from a DOM string.
         */
        constructor(Owner, name, attribute = name.toLowerCase(), mode = reflectMode, converter) {
            this.guards = new Set();
            this.Owner = Owner;
            this.name = name;
            this.attribute = attribute;
            this.mode = mode;
            this.converter = converter;
            this.fieldName = `_${name}`;
            this.callbackName = `${name}Changed`;
            this.hasCallback = this.callbackName in Owner.prototype;
            if (mode === booleanMode && converter === void 0) {
                this.converter = booleanConverter;
            }
        }
        /**
         * Sets the value of the attribute/property on the source element.
         * @param source - The source element to access.
         * @param value - The value to set the attribute/property to.
         */
        setValue(source, newValue) {
            const oldValue = source[this.fieldName];
            const converter = this.converter;
            if (converter !== void 0) {
                newValue = converter.fromView(newValue);
            }
            if (oldValue !== newValue) {
                source[this.fieldName] = newValue;
                this.tryReflectToAttribute(source);
                if (this.hasCallback) {
                    source[this.callbackName](oldValue, newValue);
                }
                source.$fastController.notify(this.name);
            }
        }
        /**
         * Gets the value of the attribute/property on the source element.
         * @param source - The source element to access.
         */
        getValue(source) {
            Observable.track(source, this.name);
            return source[this.fieldName];
        }
        /** @internal */
        onAttributeChangedCallback(element, value) {
            if (this.guards.has(element)) {
                return;
            }
            this.guards.add(element);
            this.setValue(element, value);
            this.guards.delete(element);
        }
        tryReflectToAttribute(element) {
            const mode = this.mode;
            const guards = this.guards;
            if (guards.has(element) || mode === "fromView") {
                return;
            }
            Updates.enqueue(() => {
                guards.add(element);
                const latestValue = element[this.fieldName];
                switch (mode) {
                    case reflectMode:
                        const converter = this.converter;
                        DOM.setAttribute(element, this.attribute, converter !== void 0 ? converter.toView(latestValue) : latestValue);
                        break;
                    case booleanMode:
                        DOM.setBooleanAttribute(element, this.attribute, latestValue);
                        break;
                }
                guards.delete(element);
            });
        }
        /**
         * Collects all attribute definitions associated with the owner.
         * @param Owner - The class constructor to collect attribute for.
         * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
         * @internal
         */
        static collect(Owner, ...attributeLists) {
            const attributes = [];
            attributeLists.push(AttributeConfiguration.locate(Owner));
            for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
                const list = attributeLists[i];
                if (list === void 0) {
                    continue;
                }
                for (let j = 0, jj = list.length; j < jj; ++j) {
                    const config = list[j];
                    if (isString(config)) {
                        attributes.push(new AttributeDefinition(Owner, config));
                    }
                    else {
                        attributes.push(new AttributeDefinition(Owner, config.property, config.attribute, config.mode, config.converter));
                    }
                }
            }
            return attributes;
        }
    }
    function attr(configOrTarget, prop) {
        let config;
        function decorator($target, $prop) {
            if (arguments.length > 1) {
                // Non invocation:
                // - @attr
                // Invocation with or w/o opts:
                // - @attr()
                // - @attr({...opts})
                config.property = $prop;
            }
            AttributeConfiguration.locate($target.constructor).push(config);
        }
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            config = {};
            decorator(configOrTarget, prop);
            return;
        }
        // Invocation with or w/o opts:
        // - @attr()
        // - @attr({...opts})
        config = configOrTarget === void 0 ? {} : configOrTarget;
        return decorator;
    }

    const defaultShadowOptions = { mode: "open" };
    const defaultElementOptions = {};
    const fastElementBaseTypes = new Set();
    const fastElementRegistry = FAST.getById(KernelServiceId.elementRegistry, () => createTypeRegistry());
    /**
     * Defines metadata for a FASTElement.
     * @public
     */
    class FASTElementDefinition {
        constructor(type, nameOrConfig = type.definition) {
            var _a;
            this.platformDefined = false;
            if (isString(nameOrConfig)) {
                nameOrConfig = { name: nameOrConfig };
            }
            this.type = type;
            this.name = nameOrConfig.name;
            this.template = nameOrConfig.template;
            this.registry = (_a = nameOrConfig.registry) !== null && _a !== void 0 ? _a : customElements;
            const proto = type.prototype;
            const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
            const observedAttributes = new Array(attributes.length);
            const propertyLookup = {};
            const attributeLookup = {};
            for (let i = 0, ii = attributes.length; i < ii; ++i) {
                const current = attributes[i];
                observedAttributes[i] = current.attribute;
                propertyLookup[current.name] = current;
                attributeLookup[current.attribute] = current;
                Observable.defineProperty(proto, current);
            }
            Reflect.defineProperty(type, "observedAttributes", {
                value: observedAttributes,
                enumerable: true,
            });
            this.attributes = attributes;
            this.propertyLookup = propertyLookup;
            this.attributeLookup = attributeLookup;
            this.shadowOptions =
                nameOrConfig.shadowOptions === void 0
                    ? defaultShadowOptions
                    : nameOrConfig.shadowOptions === null
                        ? void 0
                        : Object.assign(Object.assign({}, defaultShadowOptions), nameOrConfig.shadowOptions);
            this.elementOptions =
                nameOrConfig.elementOptions === void 0
                    ? defaultElementOptions
                    : Object.assign(Object.assign({}, defaultElementOptions), nameOrConfig.elementOptions);
            this.styles = ElementStyles.normalize(nameOrConfig.styles);
            fastElementRegistry.register(this);
        }
        /**
         * Indicates if this element has been defined in at least one registry.
         */
        get isDefined() {
            return this.platformDefined;
        }
        /**
         * Defines a custom element based on this definition.
         * @param registry - The element registry to define the element in.
         * @remarks
         * This operation is idempotent per registry.
         */
        define(registry = this.registry) {
            const type = this.type;
            if (!registry.get(this.name)) {
                this.platformDefined = true;
                registry.define(this.name, type, this.elementOptions);
            }
            return this;
        }
        /**
         * Creates an instance of FASTElementDefinition.
         * @param type - The type this definition is being created for.
         * @param nameOrDef - The name of the element to define or a config object
         * that describes the element to define.
         */
        static compose(type, nameOrDef) {
            if (fastElementBaseTypes.has(type) || fastElementRegistry.getByType(type)) {
                return new FASTElementDefinition(class extends type {
                }, nameOrDef);
            }
            return new FASTElementDefinition(type, nameOrDef);
        }
        /**
         * Registers a FASTElement base type.
         * @param type - The type to register as a base type.
         * @internal
         */
        static registerBaseType(type) {
            fastElementBaseTypes.add(type);
        }
    }
    /**
     * Gets the element definition associated with the specified type.
     * @param type - The custom element type to retrieve the definition for.
     */
    FASTElementDefinition.getByType = fastElementRegistry.getByType;
    /**
     * Gets the element definition associated with the instance.
     * @param instance - The custom element instance to retrieve the definition for.
     */
    FASTElementDefinition.getForInstance = fastElementRegistry.getForInstance;

    const defaultEventOptions = {
        bubbles: true,
        composed: true,
        cancelable: true,
    };
    const isConnectedPropertyName = "isConnected";
    const shadowRoots = new WeakMap();
    function getShadowRoot(element) {
        var _a, _b;
        return (_b = (_a = element.shadowRoot) !== null && _a !== void 0 ? _a : shadowRoots.get(element)) !== null && _b !== void 0 ? _b : null;
    }
    let elementControllerStrategy;
    /**
     * Controls the lifecycle and rendering of a `FASTElement`.
     * @public
     */
    class ElementController extends PropertyChangeNotifier {
        /**
         * Creates a Controller to control the specified element.
         * @param element - The element to be controlled by this controller.
         * @param definition - The element definition metadata that instructs this
         * controller in how to handle rendering and other platform integrations.
         * @internal
         */
        constructor(element, definition) {
            super(element);
            this.boundObservables = null;
            this.needsInitialization = true;
            this.hasExistingShadowRoot = false;
            this._template = null;
            this.stage = 3 /* Stages.disconnected */;
            /**
             * A guard against connecting behaviors multiple times
             * during connect in scenarios where a behavior adds
             * another behavior during it's connectedCallback
             */
            this.guardBehaviorConnection = false;
            this.behaviors = null;
            this._mainStyles = null;
            /**
             * This allows Observable.getNotifier(...) to return the Controller
             * when the notifier for the Controller itself is being requested. The
             * result is that the Observable system does not need to create a separate
             * instance of Notifier for observables on the Controller. The component and
             * the controller will now share the same notifier, removing one-object construct
             * per web component instance.
             */
            this.$fastController = this;
            /**
             * The view associated with the custom element.
             * @remarks
             * If `null` then the element is managing its own rendering.
             */
            this.view = null;
            this.source = element;
            this.definition = definition;
            const shadowOptions = definition.shadowOptions;
            if (shadowOptions !== void 0) {
                let shadowRoot = element.shadowRoot;
                if (shadowRoot) {
                    this.hasExistingShadowRoot = true;
                }
                else {
                    shadowRoot = element.attachShadow(shadowOptions);
                    if (shadowOptions.mode === "closed") {
                        shadowRoots.set(element, shadowRoot);
                    }
                }
            }
            // Capture any observable values that were set by the binding engine before
            // the browser upgraded the element. Then delete the property since it will
            // shadow the getter/setter that is required to make the observable operate.
            // Later, in the connect callback, we'll re-apply the values.
            const accessors = Observable.getAccessors(element);
            if (accessors.length > 0) {
                const boundObservables = (this.boundObservables = Object.create(null));
                for (let i = 0, ii = accessors.length; i < ii; ++i) {
                    const propertyName = accessors[i].name;
                    const value = element[propertyName];
                    if (value !== void 0) {
                        delete element[propertyName];
                        boundObservables[propertyName] = value;
                    }
                }
            }
        }
        /**
         * Indicates whether or not the custom element has been
         * connected to the document.
         */
        get isConnected() {
            Observable.track(this, isConnectedPropertyName);
            return this.stage === 1 /* Stages.connected */;
        }
        /**
         * The context the expression is evaluated against.
         */
        get context() {
            var _a, _b;
            return (_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.context) !== null && _b !== void 0 ? _b : ExecutionContext.default;
        }
        /**
         * Indicates whether the controller is bound.
         */
        get isBound() {
            var _a, _b;
            return (_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.isBound) !== null && _b !== void 0 ? _b : false;
        }
        /**
         * Indicates how the source's lifetime relates to the controller's lifetime.
         */
        get sourceLifetime() {
            var _a;
            return (_a = this.view) === null || _a === void 0 ? void 0 : _a.sourceLifetime;
        }
        /**
         * Gets/sets the template used to render the component.
         * @remarks
         * This value can only be accurately read after connect but can be set at any time.
         */
        get template() {
            var _a;
            // 1. Template overrides take top precedence.
            if (this._template === null) {
                const definition = this.definition;
                if (this.source.resolveTemplate) {
                    // 2. Allow for element instance overrides next.
                    this._template = this.source.resolveTemplate();
                }
                else if (definition.template) {
                    // 3. Default to the static definition.
                    this._template = (_a = definition.template) !== null && _a !== void 0 ? _a : null;
                }
            }
            return this._template;
        }
        set template(value) {
            if (this._template === value) {
                return;
            }
            this._template = value;
            if (!this.needsInitialization) {
                this.renderTemplate(value);
            }
        }
        /**
         * The main set of styles used for the component, independent
         * of any dynamically added styles.
         */
        get mainStyles() {
            var _a;
            // 1. Styles overrides take top precedence.
            if (this._mainStyles === null) {
                const definition = this.definition;
                if (this.source.resolveStyles) {
                    // 2. Allow for element instance overrides next.
                    this._mainStyles = this.source.resolveStyles();
                }
                else if (definition.styles) {
                    // 3. Default to the static definition.
                    this._mainStyles = (_a = definition.styles) !== null && _a !== void 0 ? _a : null;
                }
            }
            return this._mainStyles;
        }
        set mainStyles(value) {
            if (this._mainStyles === value) {
                return;
            }
            if (this._mainStyles !== null) {
                this.removeStyles(this._mainStyles);
            }
            this._mainStyles = value;
            if (!this.needsInitialization) {
                this.addStyles(value);
            }
        }
        /**
         * Registers an unbind handler with the controller.
         * @param behavior - An object to call when the controller unbinds.
         */
        onUnbind(behavior) {
            var _a;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.onUnbind(behavior);
        }
        /**
         * Adds the behavior to the component.
         * @param behavior - The behavior to add.
         */
        addBehavior(behavior) {
            var _a, _b;
            const targetBehaviors = (_a = this.behaviors) !== null && _a !== void 0 ? _a : (this.behaviors = new Map());
            const count = (_b = targetBehaviors.get(behavior)) !== null && _b !== void 0 ? _b : 0;
            if (count === 0) {
                targetBehaviors.set(behavior, 1);
                behavior.addedCallback && behavior.addedCallback(this);
                if (behavior.connectedCallback &&
                    !this.guardBehaviorConnection &&
                    (this.stage === 1 /* Stages.connected */ || this.stage === 0 /* Stages.connecting */)) {
                    behavior.connectedCallback(this);
                }
            }
            else {
                targetBehaviors.set(behavior, count + 1);
            }
        }
        /**
         * Removes the behavior from the component.
         * @param behavior - The behavior to remove.
         * @param force - Forces removal even if this behavior was added more than once.
         */
        removeBehavior(behavior, force = false) {
            const targetBehaviors = this.behaviors;
            if (targetBehaviors === null) {
                return;
            }
            const count = targetBehaviors.get(behavior);
            if (count === void 0) {
                return;
            }
            if (count === 1 || force) {
                targetBehaviors.delete(behavior);
                if (behavior.disconnectedCallback && this.stage !== 3 /* Stages.disconnected */) {
                    behavior.disconnectedCallback(this);
                }
                behavior.removedCallback && behavior.removedCallback(this);
            }
            else {
                targetBehaviors.set(behavior, count - 1);
            }
        }
        /**
         * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
         * @param styles - The styles to add.
         */
        addStyles(styles) {
            var _a;
            if (!styles) {
                return;
            }
            const source = this.source;
            if (styles instanceof HTMLElement) {
                const target = (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : this.source;
                target.append(styles);
            }
            else if (!styles.isAttachedTo(source)) {
                const sourceBehaviors = styles.behaviors;
                styles.addStylesTo(source);
                if (sourceBehaviors !== null) {
                    for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                        this.addBehavior(sourceBehaviors[i]);
                    }
                }
            }
        }
        /**
         * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
         * @param styles - the styles to remove.
         */
        removeStyles(styles) {
            var _a;
            if (!styles) {
                return;
            }
            const source = this.source;
            if (styles instanceof HTMLElement) {
                const target = (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : source;
                target.removeChild(styles);
            }
            else if (styles.isAttachedTo(source)) {
                const sourceBehaviors = styles.behaviors;
                styles.removeStylesFrom(source);
                if (sourceBehaviors !== null) {
                    for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                        this.removeBehavior(sourceBehaviors[i]);
                    }
                }
            }
        }
        /**
         * Runs connected lifecycle behavior on the associated element.
         */
        connect() {
            if (this.stage !== 3 /* Stages.disconnected */) {
                return;
            }
            this.stage = 0 /* Stages.connecting */;
            // If we have any observables that were bound, re-apply their values.
            if (this.boundObservables !== null) {
                const element = this.source;
                const boundObservables = this.boundObservables;
                const propertyNames = Object.keys(boundObservables);
                for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                    const propertyName = propertyNames[i];
                    element[propertyName] = boundObservables[propertyName];
                }
                this.boundObservables = null;
            }
            const behaviors = this.behaviors;
            if (behaviors !== null) {
                this.guardBehaviorConnection = true;
                for (const key of behaviors.keys()) {
                    key.connectedCallback && key.connectedCallback(this);
                }
                this.guardBehaviorConnection = false;
            }
            if (this.needsInitialization) {
                this.renderTemplate(this.template);
                this.addStyles(this.mainStyles);
                this.needsInitialization = false;
            }
            else if (this.view !== null) {
                this.view.bind(this.source);
            }
            this.stage = 1 /* Stages.connected */;
            Observable.notify(this, isConnectedPropertyName);
        }
        /**
         * Runs disconnected lifecycle behavior on the associated element.
         */
        disconnect() {
            if (this.stage !== 1 /* Stages.connected */) {
                return;
            }
            this.stage = 2 /* Stages.disconnecting */;
            Observable.notify(this, isConnectedPropertyName);
            if (this.view !== null) {
                this.view.unbind();
            }
            const behaviors = this.behaviors;
            if (behaviors !== null) {
                for (const key of behaviors.keys()) {
                    key.disconnectedCallback && key.disconnectedCallback(this);
                }
            }
            this.stage = 3 /* Stages.disconnected */;
        }
        /**
         * Runs the attribute changed callback for the associated element.
         * @param name - The name of the attribute that changed.
         * @param oldValue - The previous value of the attribute.
         * @param newValue - The new value of the attribute.
         */
        onAttributeChangedCallback(name, oldValue, newValue) {
            const attrDef = this.definition.attributeLookup[name];
            if (attrDef !== void 0) {
                attrDef.onAttributeChangedCallback(this.source, newValue);
            }
        }
        /**
         * Emits a custom HTML event.
         * @param type - The type name of the event.
         * @param detail - The event detail object to send with the event.
         * @param options - The event options. By default bubbles and composed.
         * @remarks
         * Only emits events if connected.
         */
        emit(type, detail, options) {
            if (this.stage === 1 /* Stages.connected */) {
                return this.source.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
            }
            return false;
        }
        renderTemplate(template) {
            var _a;
            // When getting the host to render to, we start by looking
            // up the shadow root. If there isn't one, then that means
            // we're doing a Light DOM render to the element's direct children.
            const element = this.source;
            const host = (_a = getShadowRoot(element)) !== null && _a !== void 0 ? _a : element;
            if (this.view !== null) {
                // If there's already a view, we need to unbind and remove through dispose.
                this.view.dispose();
                this.view = null;
            }
            else if (!this.needsInitialization || this.hasExistingShadowRoot) {
                this.hasExistingShadowRoot = false;
                // If there was previous custom rendering, we need to clear out the host.
                for (let child = host.firstChild; child !== null; child = host.firstChild) {
                    host.removeChild(child);
                }
            }
            if (template) {
                // If a new template was provided, render it.
                this.view = template.render(element, host, element);
                this.view.sourceLifetime =
                    SourceLifetime.coupled;
            }
        }
        /**
         * Locates or creates a controller for the specified element.
         * @param element - The element to return the controller for.
         * @remarks
         * The specified element must have a {@link FASTElementDefinition}
         * registered either through the use of the {@link customElement}
         * decorator or a call to `FASTElement.define`.
         */
        static forCustomElement(element) {
            const controller = element.$fastController;
            if (controller !== void 0) {
                return controller;
            }
            const definition = FASTElementDefinition.getForInstance(element);
            if (definition === void 0) {
                throw FAST.error(1401 /* Message.missingElementDefinition */);
            }
            return (element.$fastController = new elementControllerStrategy(element, definition));
        }
        /**
         * Sets the strategy that ElementController.forCustomElement uses to construct
         * ElementController instances for an element.
         * @param strategy - The strategy to use.
         */
        static setStrategy(strategy) {
            elementControllerStrategy = strategy;
        }
    }
    makeSerializationNoop(ElementController);
    // Set default strategy for ElementController
    ElementController.setStrategy(ElementController);
    /**
     * Converts a styleTarget into the operative target. When the provided target is an Element
     * that is a FASTElement, the function will return the ShadowRoot for that element. Otherwise,
     * it will return the root node for the element.
     * @param target
     * @returns
     */
    function normalizeStyleTarget(target) {
        var _a;
        if ("adoptedStyleSheets" in target) {
            return target;
        }
        else {
            return ((_a = getShadowRoot(target)) !== null && _a !== void 0 ? _a : target.getRootNode());
        }
    }
    // Default StyleStrategy implementations are defined in this module because they
    // require access to element shadowRoots, and we don't want to leak shadowRoot
    // objects out of this module.
    /**
     * https://wicg.github.io/construct-stylesheets/
     * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
     *
     * @internal
     */
    class AdoptedStyleSheetsStrategy {
        constructor(styles) {
            const styleSheetCache = AdoptedStyleSheetsStrategy.styleSheetCache;
            this.sheets = styles.map((x) => {
                if (x instanceof CSSStyleSheet) {
                    return x;
                }
                let sheet = styleSheetCache.get(x);
                if (sheet === void 0) {
                    sheet = new CSSStyleSheet();
                    sheet.replaceSync(x);
                    styleSheetCache.set(x, sheet);
                }
                return sheet;
            });
        }
        addStylesTo(target) {
            addAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
        }
        removeStylesFrom(target) {
            removeAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
        }
    }
    AdoptedStyleSheetsStrategy.styleSheetCache = new Map();
    let id = 0;
    const nextStyleId = () => `fast-${++id}`;
    function usableStyleTarget(target) {
        return target === document ? document.body : target;
    }
    /**
     * @internal
     */
    class StyleElementStrategy {
        constructor(styles) {
            this.styles = styles;
            this.styleClass = nextStyleId();
        }
        addStylesTo(target) {
            target = usableStyleTarget(normalizeStyleTarget(target));
            const styles = this.styles;
            const styleClass = this.styleClass;
            for (let i = 0; i < styles.length; i++) {
                const element = document.createElement("style");
                element.innerHTML = styles[i];
                element.className = styleClass;
                target.append(element);
            }
        }
        removeStylesFrom(target) {
            target = usableStyleTarget(normalizeStyleTarget(target));
            const styles = target.querySelectorAll(`.${this.styleClass}`);
            for (let i = 0, ii = styles.length; i < ii; ++i) {
                target.removeChild(styles[i]);
            }
        }
    }
    let addAdoptedStyleSheets = (target, sheets) => {
        target.adoptedStyleSheets = [...target.adoptedStyleSheets, ...sheets];
    };
    let removeAdoptedStyleSheets = (target, sheets) => {
        target.adoptedStyleSheets = target.adoptedStyleSheets.filter((x) => sheets.indexOf(x) === -1);
    };
    if (ElementStyles.supportsAdoptedStyleSheets) {
        try {
            // Test if browser implementation uses FrozenArray.
            // If not, use push / splice to alter the stylesheets
            // in place. This circumvents a bug in Safari 16.4 where
            // periodically, assigning the array would previously
            // cause sheets to be removed.
            document.adoptedStyleSheets.push();
            document.adoptedStyleSheets.splice();
            addAdoptedStyleSheets = (target, sheets) => {
                target.adoptedStyleSheets.push(...sheets);
            };
            removeAdoptedStyleSheets = (target, sheets) => {
                for (const sheet of sheets) {
                    const index = target.adoptedStyleSheets.indexOf(sheet);
                    if (index !== -1) {
                        target.adoptedStyleSheets.splice(index, 1);
                    }
                }
            };
        }
        catch (e) {
            // Do nothing if an error is thrown, the default
            // case handles FrozenArray.
        }
        ElementStyles.setDefaultStrategy(AdoptedStyleSheetsStrategy);
    }
    else {
        ElementStyles.setDefaultStrategy(StyleElementStrategy);
    }

    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    function createFASTElement(BaseType) {
        const type = class extends BaseType {
            constructor() {
                /* eslint-disable-next-line */
                super();
                ElementController.forCustomElement(this);
            }
            $emit(type, detail, options) {
                return this.$fastController.emit(type, detail, options);
            }
            connectedCallback() {
                this.$fastController.connect();
            }
            disconnectedCallback() {
                this.$fastController.disconnect();
            }
            attributeChangedCallback(name, oldValue, newValue) {
                this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
            }
        };
        FASTElementDefinition.registerBaseType(type);
        return type;
    }
    function compose(type, nameOrDef) {
        if (isFunction(type)) {
            return FASTElementDefinition.compose(type, nameOrDef);
        }
        return FASTElementDefinition.compose(this, type);
    }
    function define(type, nameOrDef) {
        if (isFunction(type)) {
            return FASTElementDefinition.compose(type, nameOrDef).define().type;
        }
        return FASTElementDefinition.compose(this, type).define().type;
    }
    function from(BaseType) {
        return createFASTElement(BaseType);
    }
    /**
     * A minimal base class for FASTElements that also provides
     * static helpers for working with FASTElements.
     * @public
     */
    const FASTElement = Object.assign(createFASTElement(HTMLElement), {
        /**
         * Creates a new FASTElement base class inherited from the
         * provided base type.
         * @param BaseType - The base element type to inherit from.
         */
        from,
        /**
         * Defines a platform custom element based on the provided type and definition.
         * @param type - The custom element type to define.
         * @param nameOrDef - The name of the element to define or a definition object
         * that describes the element to define.
         */
        define,
        /**
         * Defines metadata for a FASTElement which can be used to later define the element.
         * @public
         */
        compose,
    });

    class HelloWorld extends FASTElement {
        constructor() {
            super(...arguments);
            this.disabled = false;
        }
        disabledChanged() {
            console.log(this.disabled);
        }
    }
    __decorate([
        attr
    ], HelloWorld.prototype, "size", void 0);
    __decorate([
        attr({ attribute: "disabled", mode: "boolean" })
    ], HelloWorld.prototype, "disabled", void 0);

    const DesignSystem = Object.freeze({
        prefix: "hwc",
        shadowRootMode: "open",
        registry: customElements,
    });

    const styles$a = css `
  :host {
    display: inline-block;
    border: 1px solid var(--colorBrandBackground);
    border-radius: var(--borderRadiusMedium);
    background-color: var(--colorBrandBackground);
    color: var(--colorNeutralBackground1);
    padding: var(--spacingHorizontalM);
  }

  h1,
  h2,
  h3,
  button,
  p ::slotted(*) {
    font-family: var(--fontFamilyBase);
    font-size: unset;
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  :host([size="small"]) {
    font-size: var(--fontSizeBase200);
  }
  :host([size="medium"]) {
    font-size: var(--fontSizeBase400);
  }
  :host([size="large"]) {
    font-size: var(--fontSizeBase600);
  }

  :host([disabled]) {
    background: unset;
    color: var(--colorNeutralForegroundDisabled) !important;
    background-color: var(--colorNeutralBackgroundDisabled) !important;
    border: 1px solid var(--colorNeutralBackgroundDisabled) !important;
    pointer-events: none;
  }
`;

    // <pre><code>${(x) => JSON.stringify(x)}</code></pre>
    const template$a = html `
  <template ?disabled="${(x) => x.disabled}" size="${(x) => x.size}">
    <h2>Hello world</h2>
    <div>
      <li>Disabled: ${(x) => x.disabled}</li>
      <li>Size: ${(x) => x.size}</li>
    </div>
    <div>
      <slot></slot>
    </div>
  </template>
`;

    const HelloWorldDefinition = HelloWorld.compose({
        name: `${DesignSystem.prefix}-hello-world`,
        template: template$a,
        styles: styles$a,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode,
        },
    });

    /**
     * A class representing a MultiView.
     * @class
     * @extends FASTElement
     */
    class MultiView extends FASTElement {
        constructor() {
            super(...arguments);
            /**
             * Determines the hidden state of the multi-view
             * @public
             * @remarks
             * HTML Attribute: hidden
             * @type {boolean}
             */
            this.hidden = true;
        }
        hiddenChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
                this.$emit("hiddenchanged", this.hidden);
            }
        }
    }
    __decorate([
        attr({ mode: "boolean" })
    ], MultiView.prototype, "hidden", void 0);

    /**
     * String values for use with KeyboardEvent.key
     */
    const keyArrowDown = "ArrowDown";
    const keyArrowUp = "ArrowUp";
    const keyEnd = "End";
    const keyEnter = "Enter";
    const keyEscape = "Escape";
    const keyHome = "Home";
    const keySpace = " ";
    const keyTab = "Tab";

    /**
     * This method keeps a given value within the bounds of a min and max value. If the value
     * is larger than the max, the minimum value will be returned. If the value is smaller than the minimum,
     * the maximum will be returned. Otherwise, the value is returned un-changed.
     */
    /**
     * Ensures that a value is between a min and max value. If value is lower than min, min will be returned.
     * If value is greater than max, max will be returned.
     */
    function limit(min, max, value) {
        return Math.min(Math.max(value, min), max);
    }

    let uniqueIdCounter = 0;
    /**
     * Generates a unique ID based on incrementing a counter.
     */
    function uniqueId(prefix = "") {
        return `${prefix}${uniqueIdCounter++}`;
    }

    /**
     * A function to compose template options.
     * @public
     */
    function staticallyCompose(item) {
        if (!item) {
            return InlineTemplateDirective.empty;
        }
        if (typeof item === "string") {
            return new InlineTemplateDirective(item);
        }
        if ("inline" in item) {
            return item.inline();
        }
        return item;
    }

    /**
     * The template for the end slot.
     * For use with {@link StartEnd}
     *
     * @public
     */
    function endSlotTemplate(options) {
        return html `
        <slot name="end" ${ref("end")}>${staticallyCompose(options.end)}</slot>
    `.inline();
    }
    /**
     * The template for the start slots.
     * For use with {@link StartEnd}
     *
     * @public
     */
    function startSlotTemplate(options) {
        return html `
        <slot name="start" ${ref("start")}>${staticallyCompose(options.start)}</slot>
    `.inline();
    }

    /**
     * A CSS fragment to set `display: none;` when the host is hidden using the [hidden] attribute.
     * @public
     */
    const hidden = `:host([hidden]){display:none}`;
    /**
     * Applies a CSS display property.
     * Also adds CSS rules to not display the element when the [hidden] attribute is applied to the element.
     * @param display - The CSS display property value
     * @public
     */
    function display(displayValue) {
        return `${hidden}:host{display:${displayValue}}`;
    }

    /**
     * Retrieves the "composed parent" element of a node, ignoring DOM tree boundaries.
     * When the parent of a node is a shadow-root, it will return the host
     * element of the shadow root. Otherwise it will return the parent node or null if
     * no parent node exists.
     * @param element - The element for which to retrieve the composed parent
     *
     * @public
     */
    function composedParent(element) {
        const parentNode = element.parentElement;
        if (parentNode) {
            return parentNode;
        }
        else {
            const rootNode = element.getRootNode();
            if (rootNode.host instanceof HTMLElement) {
                // this is shadow-root
                return rootNode.host;
            }
        }
        return null;
    }
    /**
     * Determines if the reference element contains the test element in a "composed" DOM tree that
     * ignores shadow DOM boundaries.
     *
     * Returns true of the test element is a descendent of the reference, or exists in
     * a shadow DOM that is a logical descendent of the reference. Otherwise returns false.
     * @param reference - The element to test for containment against.
     * @param test - The element being tested for containment.
     *
     * @public
     */
    function composedContains(reference, test) {
        let current = test;
        while (current !== null) {
            if (current === reference) {
                return true;
            }
            current = composedParent(current);
        }
        return false;
    }

    class DerivedValueEvaluator {
        constructor(value) {
            this.value = value;
            this.notifier = Observable.getNotifier(this);
            this.dependencies = new Set();
            this.binding = Observable.binding(value, this);
            this.binding.setMode(false);
        }
        static getOrCreate(value) {
            let v = DerivedValueEvaluator.cache.get(value);
            if (v) {
                return v;
            }
            v = new DerivedValueEvaluator(value);
            DerivedValueEvaluator.cache.set(value, v);
            return v;
        }
        evaluate(node, tokenContext) {
            const resolve = (token) => {
                this.dependencies.add(token);
                if (tokenContext === token) {
                    if (node.parent) {
                        return node.parent.getTokenValue(token);
                    }
                    throw new Error("DesignTokenNode has encountered a circular token reference. Avoid this by setting the token value for an ancestor node.");
                }
                else {
                    return node.getTokenValue(token);
                }
            };
            return this.binding.observe(resolve);
        }
        handleChange() {
            this.notifier.notify(undefined);
        }
    }
    DerivedValueEvaluator.cache = new WeakMap();
    class DerivedValue {
        constructor(token, evaluator, node, subscriber) {
            this.token = token;
            this.evaluator = evaluator;
            this.node = node;
            this.subscriber = subscriber;
            this.value = evaluator.evaluate(node, token);
            if (this.subscriber) {
                Observable.getNotifier(this.evaluator).subscribe(this.subscriber);
            }
        }
        dispose() {
            if (this.subscriber) {
                Observable.getNotifier(this.evaluator).unsubscribe(this.subscriber);
            }
        }
        update() {
            this.value = this.evaluator.evaluate(this.node, this.token);
            return this;
        }
    }
    /**
     * @internal
     */
    class DesignTokenChangeRecordImpl {
        constructor(target, type, token, value) {
            this.target = target;
            this.type = type;
            this.token = token;
            this.value = value;
        }
        notify() {
            Observable.getNotifier(this.token).notify(this);
        }
    }
    /**
     * @public
     */
    class DesignTokenNode {
        constructor() {
            this._parent = null;
            this._children = new Set();
            this._values = new Map();
            this._derived = new Map();
            this.dependencyGraph = new Map();
        }
        /**
         * Determines if a value is a {@link DerivedDesignTokenValue}
         * @param value - The value to test
         */
        static isDerivedTokenValue(value) {
            return typeof value === "function";
        }
        /**
         * Determines if a token has a derived value for a node.
         */
        static isDerivedFor(node, token) {
            return node._derived.has(token);
        }
        /**
         * Collects token/value pairs for all derived token / values set on upstream nodes.
         */
        static collectDerivedContext(node) {
            const collected = new Map();
            // Exit early if  there is no parent
            if (node.parent === null) {
                return collected;
            }
            let ignored = DesignTokenNode.getAssignedTokensForNode(node);
            let current = node.parent;
            do {
                const assigned = DesignTokenNode.getAssignedTokensForNode(current);
                for (let i = 0, l = assigned.length; i < l; i++) {
                    const token = assigned[i];
                    if (!ignored.includes(token) &&
                        DesignTokenNode.isDerivedFor(current, token)) {
                        collected.set(token, current._derived.get(token));
                    }
                }
                ignored = Array.from(new Set(ignored.concat(assigned)));
                current = current.parent;
            } while (current !== null);
            return collected;
        }
        /**
         * Resolves the local value for a token if it is assigned, otherwise returns undefined.
         */
        static getLocalTokenValue(node, token) {
            return !DesignTokenNode.isAssigned(node, token)
                ? undefined
                : DesignTokenNode.isDerivedFor(node, token)
                    ? node._derived.get(token).value
                    : node._values.get(token);
        }
        static getOrCreateDependencyGraph(node, token) {
            let dependents = node.dependencyGraph.get(token);
            if (dependents) {
                return dependents;
            }
            dependents = new Set();
            node.dependencyGraph.set(token, dependents);
            return dependents;
        }
        /**
         * Emit all queued notifications
         */
        static notify() {
            const notifications = this._notifications;
            this._notifications = [];
            for (const record of notifications) {
                record.notify();
            }
        }
        static queueNotification(...records) {
            this._notifications.push(...records);
        }
        /**
         * Retrieves all tokens assigned directly to a node.
         * @param node - the node to retrieve assigned tokens for
         * @returns
         */
        static getAssignedTokensForNode(node) {
            return Array.from(node._values.keys());
        }
        /**
         * Retrieves all tokens assigned to the node and ancestor nodes.
         * @param node - the node to compose assigned tokens for
         */
        static composeAssignedTokensForNode(node) {
            const tokens = new Set(DesignTokenNode.getAssignedTokensForNode(node));
            let current = node.parent;
            while (current !== null) {
                const assignedTokens = DesignTokenNode.getAssignedTokensForNode(current);
                for (const token of assignedTokens) {
                    tokens.add(token);
                }
                current = current.parent;
            }
            return Array.from(tokens);
        }
        /**
         * Tests if a token is assigned directly to a node
         * @param node - The node to test
         * @param token  - The token to test
         * @returns
         */
        static isAssigned(node, token) {
            return node._values.has(token);
        }
        /**
         * The parent node
         */
        get parent() {
            return this._parent;
        }
        get children() {
            return Array.from(this._children);
        }
        /**
         * Appends a child to the node, notifying for any tokens set for the node's context.
         */
        appendChild(child) {
            var _a, _b;
            let prevContext = null;
            // If this node is already attached, get it's context so change record
            // types can be determined
            if (child.parent !== null) {
                prevContext = DesignTokenNode.composeAssignedTokensForNode(child.parent);
                child.parent._children.delete(child);
            }
            const context = DesignTokenNode.composeAssignedTokensForNode(this);
            const derivedContext = DesignTokenNode.collectDerivedContext(this);
            child._parent = this;
            this._children.add(child);
            for (const token of context) {
                let type = 0 /* DesignTokenMutationType.add */;
                if (prevContext !== null) {
                    const prevContextIndex = prevContext.indexOf(token);
                    if (prevContextIndex !== -1) {
                        type = 1 /* DesignTokenMutationType.change */;
                        prevContext.splice(prevContextIndex, 1);
                    }
                }
                child.dispatch(new DesignTokenChangeRecordImpl(this, type, token, (_a = derivedContext.get(token)) === null || _a === void 0 ? void 0 : _a.evaluator.value));
            }
            if (prevContext !== null && prevContext.length > 0) {
                for (const token of prevContext) {
                    child.dispatch(new DesignTokenChangeRecordImpl(this, 2 /* DesignTokenMutationType.delete */, token, (_b = derivedContext.get(token)) === null || _b === void 0 ? void 0 : _b.evaluator.value));
                }
            }
            DesignTokenNode.notify();
        }
        /**
         * Appends a child to the node, notifying for any tokens set for the node's context.
         */
        removeChild(child) {
            if (child.parent === this) {
                const context = DesignTokenNode.composeAssignedTokensForNode(this);
                child._parent = null;
                this._children.delete(child);
                for (const token of context) {
                    child.dispatch(new DesignTokenChangeRecordImpl(this, 2 /* DesignTokenMutationType.delete */, token));
                }
                DesignTokenNode.notify();
            }
        }
        /**
         * Dispose of the node, removing parent/child relationships and
         * unsubscribing all observable binding subscribers. Does not emit
         * notifications.
         */
        dispose() {
            if (this.parent) {
                this.parent._children.delete(this);
                this._parent = null;
            }
            for (const [, derived] of this._derived) {
                derived.dispose();
            }
        }
        /**
         * Sets a token to a value
         */
        setTokenValue(token, value) {
            const changeType = DesignTokenNode.isAssigned(this, token) ||
                DesignTokenNode.isDerivedFor(this, token)
                ? 1 /* DesignTokenMutationType.change */
                : 0 /* DesignTokenMutationType.add */;
            const prev = DesignTokenNode.getLocalTokenValue(this, token);
            this._values.set(token, value);
            if (DesignTokenNode.isDerivedFor(this, token)) {
                this.tearDownDerivedTokenValue(token);
            }
            const isDerived = DesignTokenNode.isDerivedTokenValue(value);
            const derivedContext = DesignTokenNode.collectDerivedContext(this);
            let result;
            if (isDerived) {
                const evaluator = this.setupDerivedTokenValue(token, value, true);
                result = evaluator.value;
            }
            else {
                result = value;
            }
            if (prev !== result) {
                DesignTokenNode.queueNotification(new DesignTokenChangeRecordImpl(this, changeType, token, value));
            }
            this.dispatch(new DesignTokenChangeRecordImpl(this, changeType, token, value));
            derivedContext.forEach((derivedValue, token) => {
                // Skip over any derived values already established locally, because
                // those will get updated via this.notifyDerived and this.notifyStatic
                if (!DesignTokenNode.isDerivedFor(this, token)) {
                    const prev = DesignTokenNode.getLocalTokenValue(this, token);
                    derivedValue = this.setupDerivedTokenValue(token, derivedValue.evaluator.value);
                    const result = derivedValue.value;
                    if (prev !== result) {
                        DesignTokenNode.queueNotification(new DesignTokenChangeRecordImpl(this, 1 /* DesignTokenMutationType.change */, token, derivedValue.evaluator.value));
                    }
                    this.dispatch(new DesignTokenChangeRecordImpl(this, 0 /* DesignTokenMutationType.add */, token, derivedValue.evaluator.value));
                }
            });
            DesignTokenNode.notify();
        }
        /**
         * Returns the resolve value for a token
         */
        getTokenValue(token) {
            /* eslint-disable-next-line */
            let node = this;
            let value;
            while (node !== null) {
                if (DesignTokenNode.isDerivedFor(node, token)) {
                    value = node._derived.get(token).value;
                    break;
                }
                if (DesignTokenNode.isAssigned(node, token)) {
                    value = node._values.get(token);
                    break;
                }
                node = node._parent;
            }
            if (value !== undefined) {
                return value;
            }
            else {
                throw new Error(`No value set for token ${token} in node tree.`);
            }
        }
        /**
         * Deletes the token value for a node
         */
        deleteTokenValue(token) {
            if (DesignTokenNode.isAssigned(this, token)) {
                const prev = DesignTokenNode.getLocalTokenValue(this, token);
                this._values.delete(token);
                this.tearDownDerivedTokenValue(token);
                let newValue;
                try {
                    newValue = this.getTokenValue(token);
                }
                catch (e) {
                    newValue = undefined;
                }
                DesignTokenNode.queueNotification(new DesignTokenChangeRecordImpl(this, 2 /* DesignTokenMutationType.delete */, token));
                if (prev !== newValue) {
                    this.dispatch(new DesignTokenChangeRecordImpl(this, 2 /* DesignTokenMutationType.delete */, token));
                }
                DesignTokenNode.notify();
            }
        }
        /**
         * Notifies that a token has been mutated
         */
        dispatch(record) {
            var _a, _b, _c;
            if (this !== record.target) {
                const { token } = record;
                // If the node is assigned the token being dispatched and the assigned value does not depend on the token
                // (circular token reference) then terminate the dispatch.
                const isAssigned = DesignTokenNode.isAssigned(this, token);
                const containsCircularForToken = isAssigned && ((_a = this._derived.get(token)) === null || _a === void 0 ? void 0 : _a.evaluator.dependencies.has(token));
                if (isAssigned && !containsCircularForToken) {
                    return;
                }
                // Delete token evaluations if the token is not assigned explicitly but is derived for the node and
                // the record is a delete type.
                if (record.type === 2 /* DesignTokenMutationType.delete */ &&
                    !isAssigned &&
                    DesignTokenNode.isDerivedFor(this, token)) {
                    this.tearDownDerivedTokenValue(token);
                    DesignTokenNode.queueNotification(new DesignTokenChangeRecordImpl(this, 2 /* DesignTokenMutationType.delete */, token));
                }
                if (containsCircularForToken) {
                    record = new DesignTokenChangeRecordImpl(this, 1 /* DesignTokenMutationType.change */, token, (_b = this._derived.get(token)) === null || _b === void 0 ? void 0 : _b.evaluator.value);
                }
                const { value } = record;
                if (value && DesignTokenNode.isDerivedTokenValue(value)) {
                    const dependencies = DerivedValueEvaluator.getOrCreate(value).dependencies;
                    // If this is not the originator, check to see if this node
                    // has any dependencies of the token value. If so, we need to evaluate for this node
                    let evaluate = false;
                    for (const dependency of dependencies) {
                        if (DesignTokenNode.isAssigned(this, dependency)) {
                            evaluate = true;
                            break;
                        }
                    }
                    if (evaluate) {
                        const prev = (_c = this._derived.get(token)) === null || _c === void 0 ? void 0 : _c.value;
                        const derivedValue = this.setupDerivedTokenValue(token, value);
                        if (prev !== derivedValue.value) {
                            const type = prev === undefined
                                ? 0 /* DesignTokenMutationType.add */
                                : 1 /* DesignTokenMutationType.change */;
                            const notification = new DesignTokenChangeRecordImpl(this, type, token, derivedValue.evaluator.value);
                            DesignTokenNode.queueNotification(notification);
                            record = notification;
                        }
                    }
                }
            }
            this.collectLocalChangeRecords(record).forEach(_record => {
                DesignTokenNode.queueNotification(_record);
                this.dispatch(_record);
            });
            this.notifyChildren(record);
        }
        /**
         * Generate change-records for local dependencies of a change record
         */
        collectLocalChangeRecords(record) {
            const collected = new Map();
            for (const dependent of DesignTokenNode.getOrCreateDependencyGraph(this, record.token)) {
                if (dependent.value !== dependent.update().value) {
                    collected.set(dependent.token, new DesignTokenChangeRecordImpl(this, 1 /* DesignTokenMutationType.change */, dependent.token, dependent.evaluator.value));
                }
            }
            return collected;
        }
        /**
         *
         * Notify children of changes to the node
         */
        notifyChildren(...records) {
            if (this.children.length) {
                for (let i = 0, l = this.children.length; i < l; i++) {
                    for (let j = 0; j < records.length; j++) {
                        this.children[i].dispatch(records[j]);
                    }
                }
            }
        }
        tearDownDerivedTokenValue(token) {
            if (DesignTokenNode.isDerivedFor(this, token)) {
                const value = this._derived.get(token);
                value.dispose();
                this._derived.delete(token);
                value.evaluator.dependencies.forEach(dependency => {
                    DesignTokenNode.getOrCreateDependencyGraph(this, dependency).delete(value);
                });
            }
        }
        setupDerivedTokenValue(token, value, subscribeNode = false) {
            const deriver = new DerivedValue(token, DerivedValueEvaluator.getOrCreate(value), this, subscribeNode
                ? {
                    handleChange: () => {
                        if (deriver.value !== deriver.update().value) {
                            const record = new DesignTokenChangeRecordImpl(this, 1 /* DesignTokenMutationType.change */, deriver.token, deriver.evaluator.value);
                            DesignTokenNode.queueNotification(record);
                            this.dispatch(record);
                            DesignTokenNode.notify();
                        }
                    },
                }
                : undefined);
            this._derived.set(token, deriver);
            deriver.evaluator.dependencies.forEach(dependency => {
                if (dependency !== token) {
                    DesignTokenNode.getOrCreateDependencyGraph(this, dependency).add(deriver);
                }
            });
            return deriver;
        }
    }
    DesignTokenNode._notifications = [];

    class QueuedStyleSheetTarget {
        setProperty(name, value) {
            Updates.enqueue(() => this.target.setProperty(name, value));
        }
        removeProperty(name) {
            Updates.enqueue(() => this.target.removeProperty(name));
        }
    }
    /**
     * Handles setting properties for a FASTElement using Constructable Stylesheets
     */
    class ConstructableStyleSheetTarget extends QueuedStyleSheetTarget {
        constructor(source) {
            super();
            const sheet = new CSSStyleSheet();
            this.target = sheet.cssRules[sheet.insertRule(":host{}")].style;
            source.$fastController.addStyles(new ElementStyles([sheet]));
        }
    }
    class DocumentStyleSheetTarget extends QueuedStyleSheetTarget {
        constructor() {
            super();
            const sheet = new CSSStyleSheet();
            this.target = sheet.cssRules[sheet.insertRule(":root{}")].style;
            document.adoptedStyleSheets = [
                ...document.adoptedStyleSheets,
                sheet,
            ];
        }
    }
    class HeadStyleElementStyleSheetTarget extends QueuedStyleSheetTarget {
        constructor() {
            super();
            this.style = document.createElement("style");
            document.head.appendChild(this.style);
            const { sheet } = this.style;
            // Because the HTMLStyleElement has been appended,
            // there shouldn't exist a case where `sheet` is null,
            // but if-check it just in case.
            if (sheet) {
                // https://github.com/jsdom/jsdom uses https://github.com/NV/CSSOM for it's CSSOM implementation,
                // which implements the DOM Level 2 spec for CSSStyleSheet where insertRule() requires an index argument.
                const index = sheet.insertRule(":root{}", sheet.cssRules.length);
                this.target = sheet.cssRules[index].style;
            }
        }
    }
    /**
     * Handles setting properties for a FASTElement using an HTMLStyleElement
     */
    class StyleElementStyleSheetTarget {
        constructor(target) {
            this.store = new Map();
            this.target = null;
            const controller = target.$fastController;
            this.style = document.createElement("style");
            controller.addStyles(this.style);
            Observable.getNotifier(controller).subscribe(this, "isConnected");
            this.handleChange(controller, "isConnected");
        }
        targetChanged() {
            if (this.target !== null) {
                for (const [key, value] of this.store.entries()) {
                    this.target.setProperty(key, value);
                }
            }
        }
        setProperty(name, value) {
            this.store.set(name, value);
            Updates.enqueue(() => {
                if (this.target !== null) {
                    this.target.setProperty(name, value);
                }
            });
        }
        removeProperty(name) {
            this.store.delete(name);
            Updates.enqueue(() => {
                if (this.target !== null) {
                    this.target.removeProperty(name);
                }
            });
        }
        handleChange(source, key) {
            // HTMLStyleElement.sheet is null if the element isn't connected to the DOM,
            // so this method reacts to changes in DOM connection for the element hosting
            // the HTMLStyleElement.
            //
            // All rules applied via the CSSOM also get cleared when the element disconnects,
            // so we need to add a new rule each time and populate it with the stored properties
            const { sheet } = this.style;
            if (sheet) {
                // Safari will throw if we try to use the return result of insertRule()
                // to index the rule inline, so store as a const prior to indexing.
                // https://github.com/jsdom/jsdom uses https://github.com/NV/CSSOM for it's CSSOM implementation,
                // which implements the DOM Level 2 spec for CSSStyleSheet where insertRule() requires an index argument.
                const index = sheet.insertRule(":host{}", sheet.cssRules.length);
                this.target = sheet.cssRules[index].style;
            }
            else {
                this.target = null;
            }
        }
    }
    __decorate([
        observable
    ], StyleElementStyleSheetTarget.prototype, "target", void 0);
    /**
     * Controls emission for default values. This control is capable
     * of emitting to multiple {@link PropertyTarget | PropertyTargets},
     * and only emits if it has at least one root.
     *
     * @internal
     */
    class RootStyleSheetTarget {
        setProperty(name, value) {
            RootStyleSheetTarget.properties[name] = value;
            for (const target of RootStyleSheetTarget.roots.values()) {
                target.setProperty(name, value);
            }
        }
        removeProperty(name) {
            delete RootStyleSheetTarget.properties[name];
            for (const target of RootStyleSheetTarget.roots.values()) {
                target.removeProperty(name);
            }
        }
        static registerRoot(root) {
            const { roots } = RootStyleSheetTarget;
            if (!roots.has(root)) {
                roots.add(root);
                for (const key in RootStyleSheetTarget.properties) {
                    root.setProperty(key, RootStyleSheetTarget.properties[key]);
                }
            }
        }
        static unregisterRoot(root) {
            const { roots } = RootStyleSheetTarget;
            if (roots.has(root)) {
                roots.delete(root);
                for (const key in RootStyleSheetTarget.properties) {
                    root.removeProperty(key);
                }
            }
        }
    }
    RootStyleSheetTarget.roots = new Set();
    RootStyleSheetTarget.properties = {};
    // Caches PropertyTarget instances
    const propertyTargetCache = new WeakMap();
    // Use Constructable StyleSheets for FAST elements when supported, otherwise use
    // HTMLStyleElement instances
    const propertyTargetCtor = ElementStyles.supportsAdoptedStyleSheets
        ? ConstructableStyleSheetTarget
        : StyleElementStyleSheetTarget;
    /**
     * Manages creation and caching of PropertyTarget instances.
     *
     * @internal
     */
    const PropertyTargetManager = Object.freeze({
        getOrCreate(source) {
            if (propertyTargetCache.has(source)) {
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                return propertyTargetCache.get(source);
            }
            let target;
            if (source instanceof Document) {
                target = ElementStyles.supportsAdoptedStyleSheets
                    ? new DocumentStyleSheetTarget()
                    : new HeadStyleElementStyleSheetTarget();
            }
            else {
                target = new propertyTargetCtor(source);
            }
            propertyTargetCache.set(source, target);
            return target;
        },
    });

    /**
     * @public
     */
    class DesignToken {
        constructor(configuration) {
            this.subscriberNotifier = {
                handleChange: (source, change) => {
                    const record = {
                        target: change.target === FASTDesignTokenNode.defaultNode
                            ? "default"
                            : change.target.target,
                        token: this,
                    };
                    this.subscribers.notify(record);
                },
            };
            this.name = configuration.name;
            Observable.getNotifier(this).subscribe(this.subscriberNotifier);
        }
        /**
         * The default value of the token (alias of {@link DesignToken.default})
         */
        get $value() {
            return this.default;
        }
        /**
         * The default value of the token, or undefined if it has not been set.
         */
        get default() {
            return FASTDesignTokenNode.defaultNode.getTokenValue(this);
        }
        get subscribers() {
            if (this._subscribers) {
                return this._subscribers;
            }
            this._subscribers = new SubscriberSet(this);
            return this._subscribers;
        }
        static isCSSDesignTokenConfiguration(config) {
            return (typeof config.cssCustomPropertyName ===
                "string");
        }
        static create(config) {
            if (typeof config === "string") {
                return new CSSDesignToken({ name: config, cssCustomPropertyName: config });
            }
            else {
                return DesignToken.isCSSDesignTokenConfiguration(config)
                    ? new CSSDesignToken(config)
                    : new DesignToken(config);
            }
        }
        /**
         * Configures the strategy for resolving hierarchical relationships between FASTElement targets.
         */
        static withStrategy(strategy) {
            FASTDesignTokenNode.withStrategy(strategy);
        }
        /**
         * Registers a target for emitting default style values.
         * {@link CSSDesignToken | CSSDesignTokens} with default values assigned via
         * {@link DesignToken.withDefault} will emit CSS custom properties to all
         * registered targets.
         * @param target - The target to register, defaults to the document
         */
        static registerDefaultStyleTarget(target = document) {
            if (target instanceof FASTElement || target instanceof Document) {
                target = PropertyTargetManager.getOrCreate(target);
            }
            RootStyleSheetTarget.registerRoot(target);
        }
        /**
         * Unregister a target for default style emission.
         * @param target - The root to deregister, defaults to the document
         */
        static unregisterDefaultStyleTarget(target = document) {
            if (target instanceof FASTElement || target instanceof Document) {
                target = PropertyTargetManager.getOrCreate(target);
            }
            RootStyleSheetTarget.unregisterRoot(target);
        }
        /**
         * Retrieves the value of the token for a target element.
         */
        getValueFor(target) {
            return FASTDesignTokenNode.getOrCreate(target).getTokenValue(this);
        }
        /**
         * Sets the value of the token for a target element.
         */
        setValueFor(target, value) {
            FASTDesignTokenNode.getOrCreate(target).setTokenValue(this, this.normalizeValue(value));
        }
        /**
         * Deletes the value of the token for a target element.
         */
        deleteValueFor(target) {
            FASTDesignTokenNode.getOrCreate(target).deleteTokenValue(this);
            return this;
        }
        /**
         * Sets the default value of the token.
         */
        withDefault(value) {
            FASTDesignTokenNode.defaultNode.setTokenValue(this, this.normalizeValue(value));
            return this;
        }
        /**
         * Subscribes a subscriber to notifications for the token.
         */
        subscribe(subscriber) {
            this.subscribers.subscribe(subscriber);
        }
        /**
         * Unsubscribes a subscriber to notifications for the token.
         */
        unsubscribe(subscriber) {
            this.subscribers.unsubscribe(subscriber);
        }
        /**
         * Alias the token to the provided token.
         * @param token - the token to alias to
         */
        alias(token) {
            return ((resolve) => resolve(token));
        }
        normalizeValue(value) {
            if (value instanceof DesignToken) {
                value = this.alias(value);
            }
            return value;
        }
    }
    /**
     * @public
     */
    let CSSDesignToken = class CSSDesignToken extends DesignToken {
        constructor(configuration) {
            super(configuration);
            this.cssReflector = {
                handleChange: (source, record) => {
                    const target = record.target === FASTDesignTokenNode.defaultNode
                        ? FASTDesignTokenNode.rootStyleSheetTarget
                        : record.target instanceof FASTDesignTokenNode
                            ? PropertyTargetManager.getOrCreate(record.target.target)
                            : null;
                    if (target) {
                        if (record.type === 2 /* DesignTokenMutationType.delete */) {
                            target.removeProperty(this.cssCustomProperty);
                        }
                        else {
                            target.setProperty(this.cssCustomProperty, this.resolveCSSValue(record.target.getTokenValue(this)));
                        }
                    }
                },
            };
            this.cssCustomProperty = `--${configuration.cssCustomPropertyName}`;
            this.cssVar = `var(${this.cssCustomProperty})`;
            Observable.getNotifier(this).subscribe(this.cssReflector);
        }
        /**
         * The DesignToken represented as a string that can be used in CSS.
         */
        createCSS() {
            return this.cssVar;
        }
        /**
         * Creates HTML to be used within a template.
         */
        createHTML() {
            return this.cssVar;
        }
        resolveCSSValue(value) {
            return value && typeof value.createCSS === "function" ? value.createCSS() : value;
        }
    };
    CSSDesignToken = __decorate([
        cssDirective(),
        htmlDirective()
    ], CSSDesignToken);
    const defaultDesignTokenResolutionStrategy = {
        contains: composedContains,
        parent(element) {
            let parent = composedParent(element);
            while (parent !== null) {
                if (parent instanceof FASTElement) {
                    return parent;
                }
                parent = composedParent(parent);
            }
            return null;
        },
    };
    class FASTDesignTokenNode extends DesignTokenNode {
        constructor(target) {
            super();
            this.target = target;
            // By default, nodes are not attached to the defaultNode for performance
            // reasons. However, that behavior can throw if retrieval for a node
            // happens before the bind() method is called. To guard against that,
            //  lazily attach to the defaultNode when get/set/delete methods are called.
            this.setTokenValue = this.lazyAttachToDefault(super.setTokenValue);
            this.getTokenValue = this.lazyAttachToDefault(super.getTokenValue);
            this.deleteTokenValue = this.lazyAttachToDefault(super.deleteTokenValue);
        }
        static get strategy() {
            if (this._strategy === undefined) {
                FASTDesignTokenNode.withStrategy(defaultDesignTokenResolutionStrategy);
            }
            return this._strategy;
        }
        connectedCallback(controller) {
            let parent = FASTDesignTokenNode.findParent(controller.source);
            if (parent === null) {
                parent = FASTDesignTokenNode.defaultNode;
            }
            if (parent !== this.parent) {
                const reparent = [];
                for (const child of parent.children) {
                    if (child instanceof FASTDesignTokenNode &&
                        FASTDesignTokenNode.strategy.contains(controller.source, child.target)) {
                        reparent.push(child);
                    }
                }
                parent.appendChild(this);
                for (const child of reparent) {
                    this.appendChild(child);
                }
            }
        }
        disconnectedCallback(controller) {
            FASTDesignTokenNode.cache.delete(this.target);
            this.dispose();
        }
        static getOrCreate(target) {
            let found = FASTDesignTokenNode.cache.get(target);
            if (found) {
                return found;
            }
            found = new FASTDesignTokenNode(target);
            FASTDesignTokenNode.cache.set(target, found);
            target.$fastController.addBehavior(FASTDesignTokenNode.strategy);
            target.$fastController.addBehavior(found);
            return found;
        }
        static withStrategy(strategy) {
            this._strategy = strategy;
        }
        static findParent(target) {
            let current = FASTDesignTokenNode.strategy.parent(target);
            while (current !== null) {
                const node = FASTDesignTokenNode.cache.get(current);
                if (node) {
                    return node;
                }
                current = FASTDesignTokenNode.strategy.parent(current);
            }
            return null;
        }
        /**
         * Creates a function from a function that lazily attaches the node to the default node.
         */
        lazyAttachToDefault(fn) {
            const cb = ((...args) => {
                if (this.parent === null) {
                    FASTDesignTokenNode.defaultNode.appendChild(this);
                }
                return fn.apply(this, args);
            });
            return cb;
        }
    }
    FASTDesignTokenNode.defaultNode = new DesignTokenNode();
    FASTDesignTokenNode.rootStyleSheetTarget = new RootStyleSheetTarget();
    FASTDesignTokenNode.cache = new WeakMap();

    const { create } = DesignToken;
    create('borderRadiusNone');
    const borderRadiusSmall = create('borderRadiusSmall');
    const borderRadiusMedium = create('borderRadiusMedium');
    create('borderRadiusLarge');
    create('borderRadiusXLarge');
    create('borderRadiusCircular');
    create('fontSizeBase100');
    const fontSizeBase200 = create('fontSizeBase200');
    const fontSizeBase300 = create('fontSizeBase300');
    const fontSizeBase400 = create('fontSizeBase400');
    const fontSizeBase500 = create('fontSizeBase500');
    create('fontSizeBase600');
    create('fontSizeHero700');
    create('fontSizeHero800');
    create('fontSizeHero900');
    create('fontSizeHero1000');
    create('lineHeightBase100');
    const lineHeightBase200 = create('lineHeightBase200');
    const lineHeightBase300 = create('lineHeightBase300');
    const lineHeightBase400 = create('lineHeightBase400');
    create('lineHeightBase500');
    create('lineHeightBase600');
    create('lineHeightHero700');
    create('lineHeightHero800');
    create('lineHeightHero900');
    create('lineHeightHero1000');
    const fontFamilyBase = create('fontFamilyBase');
    create('fontFamilyMonospace');
    create('fontFamilyNumeric');
    const fontWeightRegular = create('fontWeightRegular');
    create('fontWeightMedium');
    const fontWeightSemibold = create('fontWeightSemibold');
    create('fontWeightBold');
    create('strokeWidthThin');
    const strokeWidthThick = create('strokeWidthThick');
    create('strokeWidthThicker');
    create('strokeWidthThickest');
    create('spacingHorizontalNone');
    create('spacingHorizontalXXS');
    create('spacingHorizontalXS');
    create('spacingHorizontalSNudge');
    const spacingHorizontalS = create('spacingHorizontalS');
    create('spacingHorizontalMNudge');
    const spacingHorizontalM = create('spacingHorizontalM');
    const spacingHorizontalL = create('spacingHorizontalL');
    create('spacingHorizontalXL');
    const spacingHorizontalXXL = create('spacingHorizontalXXL');
    const spacingHorizontalXXXL = create('spacingHorizontalXXXL');
    create('spacingVerticalNone');
    const spacingVerticalXXS = create('spacingVerticalXXS');
    const spacingVerticalXS = create('spacingVerticalXS');
    create('spacingVerticalSNudge');
    create('spacingVerticalS');
    create('spacingVerticalMNudge');
    create('spacingVerticalM');
    const spacingVerticalL = create('spacingVerticalL');
    create('spacingVerticalXL');
    const spacingVerticalXXL = create('spacingVerticalXXL');
    create('spacingVerticalXXXL');
    create('durationUltraFast');
    create('durationFaster');
    create('durationFast');
    create('durationNormal');
    create('durationSlow');
    create('durationSlower');
    create('durationUltraSlow');
    create('curveAccelerateMax');
    create('curveAccelerateMid');
    create('curveAccelerateMin');
    create('curveDecelerateMax');
    create('curveDecelerateMid');
    create('curveDecelerateMin');
    create('curveEasyEaseMax');
    create('curveEasyEase');
    create('curveLinear');
    const colorNeutralForeground1 = create('colorNeutralForeground1');
    create('colorNeutralForeground1Hover');
    create('colorNeutralForeground1Pressed');
    create('colorNeutralForeground1Selected');
    create('colorNeutralForeground2');
    create('colorNeutralForeground2Hover');
    create('colorNeutralForeground2Pressed');
    create('colorNeutralForeground2Selected');
    create('colorNeutralForeground2BrandHover');
    create('colorNeutralForeground2BrandPressed');
    create('colorNeutralForeground2BrandSelected');
    const colorNeutralForeground3 = create('colorNeutralForeground3');
    create('colorNeutralForeground3Hover');
    create('colorNeutralForeground3Pressed');
    create('colorNeutralForeground3Selected');
    create('colorNeutralForeground3BrandHover');
    create('colorNeutralForeground3BrandPressed');
    create('colorNeutralForeground3BrandSelected');
    create('colorNeutralForeground4');
    create('colorNeutralForegroundDisabled');
    create('colorNeutralForegroundInvertedDisabled');
    create('colorBrandForegroundLink');
    create('colorBrandForegroundLinkHover');
    create('colorBrandForegroundLinkPressed');
    create('colorBrandForegroundLinkSelected');
    create('colorNeutralForeground2Link');
    create('colorNeutralForeground2LinkHover');
    create('colorNeutralForeground2LinkPressed');
    create('colorNeutralForeground2LinkSelected');
    create('colorCompoundBrandForeground1');
    create('colorCompoundBrandForeground1Hover');
    create('colorCompoundBrandForeground1Pressed');
    create('colorBrandForeground1');
    const colorBrandForeground2 = create('colorBrandForeground2');
    create('colorNeutralForeground1Static');
    create('colorNeutralForegroundStaticInverted');
    create('colorNeutralForegroundInverted');
    create('colorNeutralForegroundInvertedHover');
    create('colorNeutralForegroundInvertedPressed');
    create('colorNeutralForegroundInvertedSelected');
    create('colorNeutralForegroundInverted2');
    const colorNeutralForegroundOnBrand = create('colorNeutralForegroundOnBrand');
    create('colorNeutralForegroundInvertedLink');
    create('colorNeutralForegroundInvertedLinkHover');
    create('colorNeutralForegroundInvertedLinkPressed');
    create('colorNeutralForegroundInvertedLinkSelected');
    create('colorBrandForegroundInverted');
    create('colorBrandForegroundInvertedHover');
    create('colorBrandForegroundInvertedPressed');
    create('colorBrandForegroundOnLight');
    create('colorBrandForegroundOnLightHover');
    create('colorBrandForegroundOnLightPressed');
    create('colorBrandForegroundOnLightSelected');
    const colorNeutralBackground1 = create('colorNeutralBackground1');
    create('colorNeutralBackground1Hover');
    create('colorNeutralBackground1Pressed');
    create('colorNeutralBackground1Selected');
    const colorNeutralBackground2 = create('colorNeutralBackground2');
    create('colorNeutralBackground2Hover');
    create('colorNeutralBackground2Pressed');
    create('colorNeutralBackground2Selected');
    const colorNeutralBackground3 = create('colorNeutralBackground3');
    create('colorNeutralBackground3Hover');
    create('colorNeutralBackground3Pressed');
    create('colorNeutralBackground3Selected');
    create('colorNeutralBackground4');
    create('colorNeutralBackground4Hover');
    create('colorNeutralBackground4Pressed');
    create('colorNeutralBackground4Selected');
    create('colorNeutralBackground5');
    create('colorNeutralBackground5Hover');
    create('colorNeutralBackground5Pressed');
    create('colorNeutralBackground5Selected');
    create('colorNeutralBackground6');
    create('colorNeutralBackgroundInverted');
    create('colorNeutralBackgroundStatic');
    create('colorSubtleBackground');
    create('colorSubtleBackgroundHover');
    create('colorSubtleBackgroundPressed');
    create('colorSubtleBackgroundSelected');
    create('colorSubtleBackgroundLightAlphaHover');
    create('colorSubtleBackgroundLightAlphaPressed');
    create('colorSubtleBackgroundLightAlphaSelected');
    create('colorSubtleBackgroundInverted');
    create('colorSubtleBackgroundInvertedHover');
    create('colorSubtleBackgroundInvertedPressed');
    create('colorSubtleBackgroundInvertedSelected');
    create('colorTransparentBackground');
    create('colorTransparentBackgroundHover');
    create('colorTransparentBackgroundPressed');
    create('colorTransparentBackgroundSelected');
    create('colorNeutralBackgroundDisabled');
    create('colorNeutralBackgroundInvertedDisabled');
    create('colorNeutralStencil1');
    create('colorNeutralStencil2');
    create('colorNeutralStencil1Alpha');
    create('colorNeutralStencil2Alpha');
    create('colorBackgroundOverlay');
    create('colorScrollbarOverlay');
    const colorBrandBackground = create('colorBrandBackground');
    create('colorBrandBackgroundHover');
    create('colorBrandBackgroundPressed');
    create('colorBrandBackgroundSelected');
    create('colorCompoundBrandBackground');
    create('colorCompoundBrandBackgroundHover');
    create('colorCompoundBrandBackgroundPressed');
    create('colorBrandBackgroundStatic');
    create('colorBrandBackground2');
    create('colorBrandBackgroundInverted');
    create('colorBrandBackgroundInvertedHover');
    create('colorBrandBackgroundInvertedPressed');
    create('colorBrandBackgroundInvertedSelected');
    create('colorNeutralStrokeAccessible');
    create('colorNeutralStrokeAccessibleHover');
    create('colorNeutralStrokeAccessiblePressed');
    create('colorNeutralStrokeAccessibleSelected');
    const colorNeutralStroke1 = create('colorNeutralStroke1');
    create('colorNeutralStroke1Hover');
    create('colorNeutralStroke1Pressed');
    create('colorNeutralStroke1Selected');
    create('colorNeutralStroke2');
    create('colorNeutralStroke3');
    create('colorNeutralStrokeOnBrand');
    create('colorNeutralStrokeOnBrand2');
    create('colorNeutralStrokeOnBrand2Hover');
    create('colorNeutralStrokeOnBrand2Pressed');
    create('colorNeutralStrokeOnBrand2Selected');
    create('colorBrandStroke1');
    create('colorBrandStroke2');
    create('colorCompoundBrandStroke');
    create('colorCompoundBrandStrokeHover');
    create('colorCompoundBrandStrokePressed');
    create('colorNeutralStrokeDisabled');
    create('colorNeutralStrokeInvertedDisabled');
    const colorTransparentStroke = create('colorTransparentStroke');
    create('colorTransparentStrokeInteractive');
    create('colorTransparentStrokeDisabled');
    create('colorStrokeFocus1');
    const colorStrokeFocus2 = create('colorStrokeFocus2');
    create('colorNeutralShadowAmbient');
    create('colorNeutralShadowKey');
    create('colorNeutralShadowAmbientLighter');
    create('colorNeutralShadowKeyLighter');
    create('colorNeutralShadowAmbientDarker');
    create('colorNeutralShadowKeyDarker');
    create('colorBrandShadowAmbient');
    create('colorBrandShadowKey');
    create('colorPaletteRedBackground1');
    create('colorPaletteRedBackground2');
    create('colorPaletteRedBackground3');
    create('colorPaletteRedForeground1');
    create('colorPaletteRedForeground2');
    const colorPaletteRedForeground3 = create('colorPaletteRedForeground3');
    create('colorPaletteRedBorderActive');
    create('colorPaletteRedBorder1');
    create('colorPaletteRedBorder2');
    create('colorPaletteGreenBackground1');
    create('colorPaletteGreenBackground2');
    create('colorPaletteGreenBackground3');
    create('colorPaletteGreenForeground1');
    create('colorPaletteGreenForeground2');
    create('colorPaletteGreenForeground3');
    create('colorPaletteGreenBorderActive');
    create('colorPaletteGreenBorder1');
    create('colorPaletteGreenBorder2');
    create('colorPaletteDarkOrangeBackground1');
    create('colorPaletteDarkOrangeBackground2');
    create('colorPaletteDarkOrangeBackground3');
    create('colorPaletteDarkOrangeForeground1');
    create('colorPaletteDarkOrangeForeground2');
    create('colorPaletteDarkOrangeForeground3');
    create('colorPaletteDarkOrangeBorderActive');
    create('colorPaletteDarkOrangeBorder1');
    create('colorPaletteDarkOrangeBorder2');
    create('colorPaletteYellowBackground1');
    create('colorPaletteYellowBackground2');
    create('colorPaletteYellowBackground3');
    create('colorPaletteYellowForeground1');
    create('colorPaletteYellowForeground2');
    create('colorPaletteYellowForeground3');
    create('colorPaletteYellowBorderActive');
    create('colorPaletteYellowBorder1');
    create('colorPaletteYellowBorder2');
    create('colorPaletteBerryBackground1');
    create('colorPaletteBerryBackground2');
    create('colorPaletteBerryBackground3');
    create('colorPaletteBerryForeground1');
    create('colorPaletteBerryForeground2');
    create('colorPaletteBerryForeground3');
    create('colorPaletteBerryBorderActive');
    create('colorPaletteBerryBorder1');
    create('colorPaletteBerryBorder2');
    create('colorPaletteLightGreenBackground1');
    create('colorPaletteLightGreenBackground2');
    create('colorPaletteLightGreenBackground3');
    create('colorPaletteLightGreenForeground1');
    create('colorPaletteLightGreenForeground2');
    create('colorPaletteLightGreenForeground3');
    create('colorPaletteLightGreenBorderActive');
    create('colorPaletteLightGreenBorder1');
    create('colorPaletteLightGreenBorder2');
    create('colorPaletteMarigoldBackground1');
    create('colorPaletteMarigoldBackground2');
    create('colorPaletteMarigoldBackground3');
    create('colorPaletteMarigoldForeground1');
    create('colorPaletteMarigoldForeground2');
    create('colorPaletteMarigoldForeground3');
    create('colorPaletteMarigoldBorderActive');
    create('colorPaletteMarigoldBorder1');
    create('colorPaletteMarigoldBorder2');
    create('colorPaletteDarkRedBackground2');
    create('colorPaletteDarkRedForeground2');
    create('colorPaletteDarkRedBorderActive');
    create('colorPaletteCranberryBackground2');
    create('colorPaletteCranberryForeground2');
    create('colorPaletteCranberryBorderActive');
    create('colorPalettePumpkinBackground2');
    create('colorPalettePumpkinForeground2');
    create('colorPalettePumpkinBorderActive');
    create('colorPalettePeachBackground2');
    create('colorPalettePeachForeground2');
    create('colorPalettePeachBorderActive');
    create('colorPaletteGoldBackground2');
    create('colorPaletteGoldForeground2');
    create('colorPaletteGoldBorderActive');
    create('colorPaletteBrassBackground2');
    create('colorPaletteBrassForeground2');
    create('colorPaletteBrassBorderActive');
    create('colorPaletteBrownBackground2');
    create('colorPaletteBrownForeground2');
    create('colorPaletteBrownBorderActive');
    create('colorPaletteForestBackground2');
    create('colorPaletteForestForeground2');
    create('colorPaletteForestBorderActive');
    create('colorPaletteSeafoamBackground2');
    create('colorPaletteSeafoamForeground2');
    create('colorPaletteSeafoamBorderActive');
    create('colorPaletteDarkGreenBackground2');
    create('colorPaletteDarkGreenForeground2');
    create('colorPaletteDarkGreenBorderActive');
    create('colorPaletteLightTealBackground2');
    create('colorPaletteLightTealForeground2');
    create('colorPaletteLightTealBorderActive');
    create('colorPaletteTealBackground2');
    create('colorPaletteTealForeground2');
    create('colorPaletteTealBorderActive');
    create('colorPaletteSteelBackground2');
    create('colorPaletteSteelForeground2');
    create('colorPaletteSteelBorderActive');
    create('colorPaletteBlueBackground2');
    create('colorPaletteBlueForeground2');
    create('colorPaletteBlueBorderActive');
    create('colorPaletteRoyalBlueBackground2');
    create('colorPaletteRoyalBlueForeground2');
    create('colorPaletteRoyalBlueBorderActive');
    create('colorPaletteCornflowerBackground2');
    create('colorPaletteCornflowerForeground2');
    create('colorPaletteCornflowerBorderActive');
    create('colorPaletteNavyBackground2');
    create('colorPaletteNavyForeground2');
    create('colorPaletteNavyBorderActive');
    create('colorPaletteLavenderBackground2');
    create('colorPaletteLavenderForeground2');
    create('colorPaletteLavenderBorderActive');
    create('colorPalettePurpleBackground2');
    create('colorPalettePurpleForeground2');
    create('colorPalettePurpleBorderActive');
    create('colorPaletteGrapeBackground2');
    create('colorPaletteGrapeForeground2');
    create('colorPaletteGrapeBorderActive');
    create('colorPaletteLilacBackground2');
    create('colorPaletteLilacForeground2');
    create('colorPaletteLilacBorderActive');
    create('colorPalettePinkBackground2');
    create('colorPalettePinkForeground2');
    create('colorPalettePinkBorderActive');
    create('colorPaletteMagentaBackground2');
    create('colorPaletteMagentaForeground2');
    create('colorPaletteMagentaBorderActive');
    create('colorPalettePlumBackground2');
    create('colorPalettePlumForeground2');
    create('colorPalettePlumBorderActive');
    create('colorPaletteBeigeBackground2');
    create('colorPaletteBeigeForeground2');
    create('colorPaletteBeigeBorderActive');
    create('colorPaletteMinkBackground2');
    create('colorPaletteMinkForeground2');
    create('colorPaletteMinkBorderActive');
    create('colorPalettePlatinumBackground2');
    create('colorPalettePlatinumForeground2');
    create('colorPalettePlatinumBorderActive');
    create('colorPaletteAnchorBackground2');
    create('colorPaletteAnchorForeground2');
    create('colorPaletteAnchorBorderActive');
    create('colorPaletteRedForegroundInverted');
    create('colorPaletteGreenForegroundInverted');
    create('colorPaletteYellowForegroundInverted');
    create('shadow2');
    const shadow4 = create('shadow4');
    create('shadow8');
    const shadow16 = create('shadow16');
    create('shadow28');
    create('shadow64');
    create('shadow2Brand');
    create('shadow4Brand');
    create('shadow8Brand');
    create('shadow16Brand');
    create('shadow28Brand');
    create('shadow64Brand');

    /*!
    * tabbable 6.2.0
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */
    // NOTE: separate `:not()` selectors has broader browser support than the newer
    //  `:not([inert], [inert] *)` (Feb 2023)
    // CAREFUL: JSDom does not support `:not([inert] *)` as a selector; using it causes
    //  the entire query to fail, resulting in no nodes found, which will break a lot
    //  of things... so we have to rely on JS to identify nodes inside an inert container
    var candidateSelectors = ['input:not([inert])', 'select:not([inert])', 'textarea:not([inert])', 'a[href]:not([inert])', 'button:not([inert])', '[tabindex]:not(slot):not([inert])', 'audio[controls]:not([inert])', 'video[controls]:not([inert])', '[contenteditable]:not([contenteditable="false"]):not([inert])', 'details>summary:first-of-type:not([inert])', 'details:not([inert])'];
    var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
    var NoElement = typeof Element === 'undefined';
    var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
      var _element$getRootNode;
      return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
    } : function (element) {
      return element === null || element === void 0 ? void 0 : element.ownerDocument;
    };

    /**
     * Determines if a node is inert or in an inert ancestor.
     * @param {Element} [node]
     * @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
     *  see if any of them are inert. If false, only `node` itself is considered.
     * @returns {boolean} True if inert itself or by way of being in an inert ancestor.
     *  False if `node` is falsy.
     */
    var isInert = function isInert(node, lookUp) {
      var _node$getAttribute;
      if (lookUp === void 0) {
        lookUp = true;
      }
      // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
      //  JS API property; we have to check the attribute, which can either be empty or 'true';
      //  if it's `null` (not specified) or 'false', it's an active element
      var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, 'inert');
      var inert = inertAtt === '' || inertAtt === 'true';

      // NOTE: this could also be handled with `node.matches('[inert], :is([inert] *)')`
      //  if it weren't for `matches()` not being a function on shadow roots; the following
      //  code works for any kind of node
      // CAREFUL: JSDom does not appear to support certain selectors like `:not([inert] *)`
      //  so it likely would not support `:is([inert] *)` either...
      var result = inert || lookUp && node && isInert(node.parentNode); // recursive

      return result;
    };

    /**
     * Determines if a node's content is editable.
     * @param {Element} [node]
     * @returns True if it's content-editable; false if it's not or `node` is falsy.
     */
    var isContentEditable = function isContentEditable(node) {
      var _node$getAttribute2;
      // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
      //  to use the attribute directly to check for this, which can either be empty or 'true';
      //  if it's `null` (not specified) or 'false', it's a non-editable element
      var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
      return attValue === '' || attValue === 'true';
    };

    /**
     * @private
     * Determines if the node has an explicitly specified `tabindex` attribute.
     * @param {HTMLElement} node
     * @returns {boolean} True if so; false if not.
     */
    var hasTabIndex = function hasTabIndex(node) {
      return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
    };

    /**
     * Determine the tab index of a given node.
     * @param {HTMLElement} node
     * @returns {number} Tab order (negative, 0, or positive number).
     * @throws {Error} If `node` is falsy.
     */
    var getTabIndex = function getTabIndex(node) {
      if (!node) {
        throw new Error('No node provided');
      }
      if (node.tabIndex < 0) {
        // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
        // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
        // yet they are still part of the regular tab order; in FF, they get a default
        // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
        // order, consider their tab index to be 0.
        // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
        // so if they don't have a tabindex attribute specifically set, assume it's 0.
        if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
          return 0;
        }
      }
      return node.tabIndex;
    };
    var isInput = function isInput(node) {
      return node.tagName === 'INPUT';
    };
    var isHiddenInput = function isHiddenInput(node) {
      return isInput(node) && node.type === 'hidden';
    };
    var isDetailsWithSummary = function isDetailsWithSummary(node) {
      var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
        return child.tagName === 'SUMMARY';
      });
      return r;
    };
    var getCheckedRadio = function getCheckedRadio(nodes, form) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && nodes[i].form === form) {
          return nodes[i];
        }
      }
    };
    var isTabbableRadio = function isTabbableRadio(node) {
      if (!node.name) {
        return true;
      }
      var radioScope = node.form || getRootNode(node);
      var queryRadios = function queryRadios(name) {
        return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
      };
      var radioSet;
      if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
        radioSet = queryRadios(window.CSS.escape(node.name));
      } else {
        try {
          radioSet = queryRadios(node.name);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
          return false;
        }
      }
      var checked = getCheckedRadio(radioSet, node.form);
      return !checked || checked === node;
    };
    var isRadio = function isRadio(node) {
      return isInput(node) && node.type === 'radio';
    };
    var isNonTabbableRadio = function isNonTabbableRadio(node) {
      return isRadio(node) && !isTabbableRadio(node);
    };

    // determines if a node is ultimately attached to the window's document
    var isNodeAttached = function isNodeAttached(node) {
      var _nodeRoot;
      // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
      //  (but NOT _the_ document; see second 'If' comment below for more).
      // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
      //  is attached, and the one we need to check if it's in the document or not (because the
      //  shadow, and all nodes it contains, is never considered in the document since shadows
      //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
      //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
      //  visibility, including all the nodes it contains). The host could be any normal node,
      //  or a custom element (i.e. web component). Either way, that's the one that is considered
      //  part of the document, not the shadow root, nor any of its children (i.e. the node being
      //  tested).
      // To further complicate things, we have to look all the way up until we find a shadow HOST
      //  that is attached (or find none) because the node might be in nested shadows...
      // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
      //  document (per the docs) and while it's a Document-type object, that document does not
      //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
      //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
      //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
      //  node is actually detached.
      // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
      //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
      //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
      //  `ownerDocument` will be `null`, hence the optional chaining on it.
      var nodeRoot = node && getRootNode(node);
      var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

      // in some cases, a detached node will return itself as the root instead of a document or
      //  shadow root object, in which case, we shouldn't try to look further up the host chain
      var attached = false;
      if (nodeRoot && nodeRoot !== node) {
        var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
        attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
        while (!attached && nodeRootHost) {
          var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
          // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
          //  which means we need to get the host's host and check if that parent host is contained
          //  in (i.e. attached to) the document
          nodeRoot = getRootNode(nodeRootHost);
          nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
          attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
        }
      }
      return attached;
    };
    var isZeroArea = function isZeroArea(node) {
      var _node$getBoundingClie = node.getBoundingClientRect(),
        width = _node$getBoundingClie.width,
        height = _node$getBoundingClie.height;
      return width === 0 && height === 0;
    };
    var isHidden = function isHidden(node, _ref) {
      var displayCheck = _ref.displayCheck,
        getShadowRoot = _ref.getShadowRoot;
      // NOTE: visibility will be `undefined` if node is detached from the document
      //  (see notes about this further down), which means we will consider it visible
      //  (this is legacy behavior from a very long way back)
      // NOTE: we check this regardless of `displayCheck="none"` because this is a
      //  _visibility_ check, not a _display_ check
      if (getComputedStyle(node).visibility === 'hidden') {
        return true;
      }
      var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
      var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
      if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
        return true;
      }
      if (!displayCheck || displayCheck === 'full' || displayCheck === 'legacy-full') {
        if (typeof getShadowRoot === 'function') {
          // figure out if we should consider the node to be in an undisclosed shadow and use the
          //  'non-zero-area' fallback
          var originalNode = node;
          while (node) {
            var parentElement = node.parentElement;
            var rootNode = getRootNode(node);
            if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
            ) {
              // node has an undisclosed shadow which means we can only treat it as a black box, so we
              //  fall back to a non-zero-area test
              return isZeroArea(node);
            } else if (node.assignedSlot) {
              // iterate up slot
              node = node.assignedSlot;
            } else if (!parentElement && rootNode !== node.ownerDocument) {
              // cross shadow boundary
              node = rootNode.host;
            } else {
              // iterate up normal dom
              node = parentElement;
            }
          }
          node = originalNode;
        }
        // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
        //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
        //  it might be a falsy value, which means shadow DOM support is disabled

        // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
        //  now we can just test to see if it would normally be visible or not, provided it's
        //  attached to the main document.
        // NOTE: We must consider case where node is inside a shadow DOM and given directly to
        //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

        if (isNodeAttached(node)) {
          // this works wherever the node is: if there's at least one client rect, it's
          //  somehow displayed; it also covers the CSS 'display: contents' case where the
          //  node itself is hidden in place of its contents; and there's no need to search
          //  up the hierarchy either
          return !node.getClientRects().length;
        }

        // Else, the node isn't attached to the document, which means the `getClientRects()`
        //  API will __always__ return zero rects (this can happen, for example, if React
        //  is used to render nodes onto a detached tree, as confirmed in this thread:
        //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
        //
        // It also means that even window.getComputedStyle(node).display will return `undefined`
        //  because styles are only computed for nodes that are in the document.
        //
        // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
        //  somehow. Though it was never stated officially, anyone who has ever used tabbable
        //  APIs on nodes in detached containers has actually implicitly used tabbable in what
        //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
        //  considering __everything__ to be visible because of the innability to determine styles.
        //
        // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
        //  nodes as visible with the 'none' fallback.__
        if (displayCheck !== 'legacy-full') {
          return true; // hidden
        }
        // else, fallback to 'none' mode and consider the node visible
      } else if (displayCheck === 'non-zero-area') {
        // NOTE: Even though this tests that the node's client rect is non-zero to determine
        //  whether it's displayed, and that a detached node will __always__ have a zero-area
        //  client rect, we don't special-case for whether the node is attached or not. In
        //  this mode, we do want to consider nodes that have a zero area to be hidden at all
        //  times, and that includes attached or not.
        return isZeroArea(node);
      }

      // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
      //  it's visible
      return false;
    };

    // form fields (nested) inside a disabled fieldset are not focusable/tabbable
    //  unless they are in the _first_ <legend> element of the top-most disabled
    //  fieldset
    var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
      if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
        var parentNode = node.parentElement;
        // check if `node` is contained in a disabled <fieldset>
        while (parentNode) {
          if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
            // look for the first <legend> among the children of the disabled <fieldset>
            for (var i = 0; i < parentNode.children.length; i++) {
              var child = parentNode.children.item(i);
              // when the first <legend> (in document order) is found
              if (child.tagName === 'LEGEND') {
                // if its parent <fieldset> is not nested in another disabled <fieldset>,
                // return whether `node` is a descendant of its first <legend>
                return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
              }
            }
            // the disabled <fieldset> containing `node` has no <legend>
            return true;
          }
          parentNode = parentNode.parentElement;
        }
      }

      // else, node's tabbable/focusable state should not be affected by a fieldset's
      //  enabled/disabled state
      return false;
    };
    var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
      if (node.disabled ||
      // we must do an inert look up to filter out any elements inside an inert ancestor
      //  because we're limited in the type of selectors we can use in JSDom (see related
      //  note related to `candidateSelectors`)
      isInert(node) || isHiddenInput(node) || isHidden(node, options) ||
      // For a details element with a summary, the summary element gets the focus
      isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
        return false;
      }
      return true;
    };
    var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
      if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
        return false;
      }
      return true;
    };
    var isTabbable = function isTabbable(node, options) {
      options = options || {};
      if (!node) {
        throw new Error('No node provided');
      }
      if (matches.call(node, candidateSelector) === false) {
        return false;
      }
      return isNodeMatchingSelectorTabbable(options, node);
    };

    /**
     * Custom positioning reference element.
     * @see https://floating-ui.com/docs/virtual-elements
     */

    const sides = ['top', 'right', 'bottom', 'left'];
    const alignments = ['start', 'end'];
    const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
    const min = Math.min;
    const max = Math.max;
    const round = Math.round;
    const floor = Math.floor;
    const createCoords = v => ({
      x: v,
      y: v
    });
    const oppositeSideMap = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    const oppositeAlignmentMap = {
      start: 'end',
      end: 'start'
    };
    function clamp(start, value, end) {
      return max(start, min(value, end));
    }
    function evaluate(value, param) {
      return typeof value === 'function' ? value(param) : value;
    }
    function getSide(placement) {
      return placement.split('-')[0];
    }
    function getAlignment(placement) {
      return placement.split('-')[1];
    }
    function getOppositeAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }
    function getAxisLength(axis) {
      return axis === 'y' ? 'height' : 'width';
    }
    function getSideAxis(placement) {
      return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
    }
    function getAlignmentAxis(placement) {
      return getOppositeAxis(getSideAxis(placement));
    }
    function getAlignmentSides(placement, rects, rtl) {
      if (rtl === void 0) {
        rtl = false;
      }
      const alignment = getAlignment(placement);
      const alignmentAxis = getAlignmentAxis(placement);
      const length = getAxisLength(alignmentAxis);
      let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
      if (rects.reference[length] > rects.floating[length]) {
        mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
      }
      return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
    }
    function getOppositeAlignmentPlacement(placement) {
      return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
    }
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
    }
    function expandPaddingObject(padding) {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...padding
      };
    }
    function getPaddingObject(padding) {
      return typeof padding !== 'number' ? expandPaddingObject(padding) : {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding
      };
    }
    function rectToClientRect(rect) {
      return {
        ...rect,
        top: rect.y,
        left: rect.x,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      };
    }

    function computeCoordsFromPlacement(_ref, placement, rtl) {
      let {
        reference,
        floating
      } = _ref;
      const sideAxis = getSideAxis(placement);
      const alignmentAxis = getAlignmentAxis(placement);
      const alignLength = getAxisLength(alignmentAxis);
      const side = getSide(placement);
      const isVertical = sideAxis === 'y';
      const commonX = reference.x + reference.width / 2 - floating.width / 2;
      const commonY = reference.y + reference.height / 2 - floating.height / 2;
      const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
      let coords;
      switch (side) {
        case 'top':
          coords = {
            x: commonX,
            y: reference.y - floating.height
          };
          break;
        case 'bottom':
          coords = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;
        case 'right':
          coords = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;
        case 'left':
          coords = {
            x: reference.x - floating.width,
            y: commonY
          };
          break;
        default:
          coords = {
            x: reference.x,
            y: reference.y
          };
      }
      switch (getAlignment(placement)) {
        case 'start':
          coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
          break;
        case 'end':
          coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
          break;
      }
      return coords;
    }

    /**
     * Computes the `x` and `y` coordinates that will place the floating element
     * next to a given reference element.
     *
     * This export does not have any `platform` interface logic. You will need to
     * write one for the platform you are using Floating UI with.
     */
    const computePosition$1 = async (reference, floating, config) => {
      const {
        placement = 'bottom',
        strategy = 'absolute',
        middleware = [],
        platform
      } = config;
      const validMiddleware = middleware.filter(Boolean);
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
      let rects = await platform.getElementRects({
        reference,
        floating,
        strategy
      });
      let {
        x,
        y
      } = computeCoordsFromPlacement(rects, placement, rtl);
      let statefulPlacement = placement;
      let middlewareData = {};
      let resetCount = 0;
      for (let i = 0; i < validMiddleware.length; i++) {
        const {
          name,
          fn
        } = validMiddleware[i];
        const {
          x: nextX,
          y: nextY,
          data,
          reset
        } = await fn({
          x,
          y,
          initialPlacement: placement,
          placement: statefulPlacement,
          strategy,
          middlewareData,
          rects,
          platform,
          elements: {
            reference,
            floating
          }
        });
        x = nextX != null ? nextX : x;
        y = nextY != null ? nextY : y;
        middlewareData = {
          ...middlewareData,
          [name]: {
            ...middlewareData[name],
            ...data
          }
        };
        if (reset && resetCount <= 50) {
          resetCount++;
          if (typeof reset === 'object') {
            if (reset.placement) {
              statefulPlacement = reset.placement;
            }
            if (reset.rects) {
              rects = reset.rects === true ? await platform.getElementRects({
                reference,
                floating,
                strategy
              }) : reset.rects;
            }
            ({
              x,
              y
            } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
          }
          i = -1;
          continue;
        }
      }
      return {
        x,
        y,
        placement: statefulPlacement,
        strategy,
        middlewareData
      };
    };

    /**
     * Resolves with an object of overflow side offsets that determine how much the
     * element is overflowing a given clipping boundary on each side.
     * - positive = overflowing the boundary by that number of pixels
     * - negative = how many pixels left before it will overflow
     * - 0 = lies flush with the boundary
     * @see https://floating-ui.com/docs/detectOverflow
     */
    async function detectOverflow(state, options) {
      var _await$platform$isEle;
      if (options === void 0) {
        options = {};
      }
      const {
        x,
        y,
        platform,
        rects,
        elements,
        strategy
      } = state;
      const {
        boundary = 'clippingAncestors',
        rootBoundary = 'viewport',
        elementContext = 'floating',
        altBoundary = false,
        padding = 0
      } = evaluate(options, state);
      const paddingObject = getPaddingObject(padding);
      const altContext = elementContext === 'floating' ? 'reference' : 'floating';
      const element = elements[altBoundary ? altContext : elementContext];
      const clippingClientRect = rectToClientRect(await platform.getClippingRect({
        element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
        boundary,
        rootBoundary,
        strategy
      }));
      const rect = elementContext === 'floating' ? {
        ...rects.floating,
        x,
        y
      } : rects.reference;
      const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
      const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
        x: 1,
        y: 1
      } : {
        x: 1,
        y: 1
      };
      const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
        rect,
        offsetParent,
        strategy
      }) : rect);
      return {
        top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
        bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
        left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
        right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
      };
    }

    /**
     * Provides data to position an inner element of the floating element so that it
     * appears centered to the reference element.
     * @see https://floating-ui.com/docs/arrow
     */
    const arrow$1 = options => ({
      name: 'arrow',
      options,
      async fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          platform,
          elements,
          middlewareData
        } = state;
        // Since `element` is required, we don't Partial<> the type.
        const {
          element,
          padding = 0
        } = evaluate(options, state) || {};
        if (element == null) {
          return {};
        }
        const paddingObject = getPaddingObject(padding);
        const coords = {
          x,
          y
        };
        const axis = getAlignmentAxis(placement);
        const length = getAxisLength(axis);
        const arrowDimensions = await platform.getDimensions(element);
        const isYAxis = axis === 'y';
        const minProp = isYAxis ? 'top' : 'left';
        const maxProp = isYAxis ? 'bottom' : 'right';
        const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
        const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
        const startDiff = coords[axis] - rects.reference[axis];
        const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
        let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

        // DOM platform can return `window` as the `offsetParent`.
        if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
          clientSize = elements.floating[clientProp] || rects.floating[length];
        }
        const centerToReference = endDiff / 2 - startDiff / 2;

        // If the padding is large enough that it causes the arrow to no longer be
        // centered, modify the padding so that it is centered.
        const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
        const minPadding = min(paddingObject[minProp], largestPossiblePadding);
        const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

        // Make sure the arrow doesn't overflow the floating element if the center
        // point is outside the floating element's bounds.
        const min$1 = minPadding;
        const max = clientSize - arrowDimensions[length] - maxPadding;
        const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
        const offset = clamp(min$1, center, max);

        // If the reference is small enough that the arrow's padding causes it to
        // to point to nothing for an aligned placement, adjust the offset of the
        // floating element itself. To ensure `shift()` continues to take action,
        // a single reset is performed when this is true.
        const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center != offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
        const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
        return {
          [axis]: coords[axis] + alignmentOffset,
          data: {
            [axis]: offset,
            centerOffset: center - offset - alignmentOffset,
            ...(shouldAddOffset && {
              alignmentOffset
            })
          },
          reset: shouldAddOffset
        };
      }
    });

    function getPlacementList(alignment, autoAlignment, allowedPlacements) {
      const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => getAlignment(placement) === alignment), ...allowedPlacements.filter(placement => getAlignment(placement) !== alignment)] : allowedPlacements.filter(placement => getSide(placement) === placement);
      return allowedPlacementsSortedByAlignment.filter(placement => {
        if (alignment) {
          return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
        }
        return true;
      });
    }
    /**
     * Optimizes the visibility of the floating element by choosing the placement
     * that has the most space available automatically, without needing to specify a
     * preferred placement. Alternative to `flip`.
     * @see https://floating-ui.com/docs/autoPlacement
     */
    const autoPlacement$1 = function (options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: 'autoPlacement',
        options,
        async fn(state) {
          var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
          const {
            rects,
            middlewareData,
            placement,
            platform,
            elements
          } = state;
          const {
            crossAxis = false,
            alignment,
            allowedPlacements = placements,
            autoAlignment = true,
            ...detectOverflowOptions
          } = evaluate(options, state);
          const placements$1 = alignment !== undefined || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
          const currentPlacement = placements$1[currentIndex];
          if (currentPlacement == null) {
            return {};
          }
          const alignmentSides = getAlignmentSides(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

          // Make `computeCoords` start from the right place.
          if (placement !== currentPlacement) {
            return {
              reset: {
                placement: placements$1[0]
              }
            };
          }
          const currentOverflows = [overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
          const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
            placement: currentPlacement,
            overflows: currentOverflows
          }];
          const nextPlacement = placements$1[currentIndex + 1];

          // There are more placements to check.
          if (nextPlacement) {
            return {
              data: {
                index: currentIndex + 1,
                overflows: allOverflows
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
          const placementsSortedByMostSpace = allOverflows.map(d => {
            const alignment = getAlignment(d.placement);
            return [d.placement, alignment && crossAxis ?
            // Check along the mainAxis and main crossAxis side.
            d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
            // Check only the mainAxis.
            d.overflows[0], d.overflows];
          }).sort((a, b) => a[1] - b[1]);
          const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
          // Aligned placements should not check their opposite crossAxis
          // side.
          getAlignment(d[0]) ? 2 : 3).every(v => v <= 0));
          const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
          if (resetPlacement !== placement) {
            return {
              data: {
                index: currentIndex + 1,
                overflows: allOverflows
              },
              reset: {
                placement: resetPlacement
              }
            };
          }
          return {};
        }
      };
    };

    // For type backwards-compatibility, the `OffsetOptions` type was also
    // Derivable.

    async function convertValueToCoords(state, options) {
      const {
        placement,
        platform,
        elements
      } = state;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isVertical = getSideAxis(placement) === 'y';
      const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
      const crossAxisMulti = rtl && isVertical ? -1 : 1;
      const rawValue = evaluate(options, state);

      // eslint-disable-next-line prefer-const
      let {
        mainAxis,
        crossAxis,
        alignmentAxis
      } = typeof rawValue === 'number' ? {
        mainAxis: rawValue,
        crossAxis: 0,
        alignmentAxis: null
      } : {
        mainAxis: 0,
        crossAxis: 0,
        alignmentAxis: null,
        ...rawValue
      };
      if (alignment && typeof alignmentAxis === 'number') {
        crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
      }
      return isVertical ? {
        x: crossAxis * crossAxisMulti,
        y: mainAxis * mainAxisMulti
      } : {
        x: mainAxis * mainAxisMulti,
        y: crossAxis * crossAxisMulti
      };
    }

    /**
     * Modifies the placement by translating the floating element along the
     * specified axes.
     * A number (shorthand for `mainAxis` or distance), or an axes configuration
     * object may be passed.
     * @see https://floating-ui.com/docs/offset
     */
    const offset = function (options) {
      if (options === void 0) {
        options = 0;
      }
      return {
        name: 'offset',
        options,
        async fn(state) {
          var _middlewareData$offse, _middlewareData$arrow;
          const {
            x,
            y,
            placement,
            middlewareData
          } = state;
          const diffCoords = await convertValueToCoords(state, options);

          // If the placement is the same and the arrow caused an alignment offset
          // then we don't need to change the positioning coordinates.
          if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          return {
            x: x + diffCoords.x,
            y: y + diffCoords.y,
            data: {
              ...diffCoords,
              placement
            }
          };
        }
      };
    };

    function getNodeName(node) {
      if (isNode(node)) {
        return (node.nodeName || '').toLowerCase();
      }
      // Mocked nodes in testing environments may not be instances of Node. By
      // returning `#document` an infinite loop won't occur.
      // https://github.com/floating-ui/floating-ui/issues/2317
      return '#document';
    }
    function getWindow(node) {
      var _node$ownerDocument;
      return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
    }
    function getDocumentElement(node) {
      var _ref;
      return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
    }
    function isNode(value) {
      return value instanceof Node || value instanceof getWindow(value).Node;
    }
    function isElement(value) {
      return value instanceof Element || value instanceof getWindow(value).Element;
    }
    function isHTMLElement(value) {
      return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
    }
    function isShadowRoot(value) {
      // Browsers without `ShadowRoot` support.
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }
      return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
    }
    function isOverflowElement(element) {
      const {
        overflow,
        overflowX,
        overflowY,
        display
      } = getComputedStyle$1(element);
      return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
    }
    function isTableElement(element) {
      return ['table', 'td', 'th'].includes(getNodeName(element));
    }
    function isContainingBlock(element) {
      const webkit = isWebKit();
      const css = getComputedStyle$1(element);

      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
      return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
    }
    function getContainingBlock(element) {
      let currentNode = getParentNode(element);
      while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
        if (isContainingBlock(currentNode)) {
          return currentNode;
        } else {
          currentNode = getParentNode(currentNode);
        }
      }
      return null;
    }
    function isWebKit() {
      if (typeof CSS === 'undefined' || !CSS.supports) return false;
      return CSS.supports('-webkit-backdrop-filter', 'none');
    }
    function isLastTraversableNode(node) {
      return ['html', 'body', '#document'].includes(getNodeName(node));
    }
    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }
    function getNodeScroll(element) {
      if (isElement(element)) {
        return {
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop
        };
      }
      return {
        scrollLeft: element.pageXOffset,
        scrollTop: element.pageYOffset
      };
    }
    function getParentNode(node) {
      if (getNodeName(node) === 'html') {
        return node;
      }
      const result =
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot ||
      // DOM Element detected.
      node.parentNode ||
      // ShadowRoot detected.
      isShadowRoot(node) && node.host ||
      // Fallback.
      getDocumentElement(node);
      return isShadowRoot(result) ? result.host : result;
    }
    function getNearestOverflowAncestor(node) {
      const parentNode = getParentNode(node);
      if (isLastTraversableNode(parentNode)) {
        return node.ownerDocument ? node.ownerDocument.body : node.body;
      }
      if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
        return parentNode;
      }
      return getNearestOverflowAncestor(parentNode);
    }
    function getOverflowAncestors(node, list, traverseIframes) {
      var _node$ownerDocument2;
      if (list === void 0) {
        list = [];
      }
      if (traverseIframes === void 0) {
        traverseIframes = true;
      }
      const scrollableAncestor = getNearestOverflowAncestor(node);
      const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
      const win = getWindow(scrollableAncestor);
      if (isBody) {
        return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
      }
      return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
    }

    function getCssDimensions(element) {
      const css = getComputedStyle$1(element);
      // In testing environments, the `width` and `height` properties are empty
      // strings for SVG elements, returning NaN. Fallback to `0` in this case.
      let width = parseFloat(css.width) || 0;
      let height = parseFloat(css.height) || 0;
      const hasOffset = isHTMLElement(element);
      const offsetWidth = hasOffset ? element.offsetWidth : width;
      const offsetHeight = hasOffset ? element.offsetHeight : height;
      const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
      if (shouldFallback) {
        width = offsetWidth;
        height = offsetHeight;
      }
      return {
        width,
        height,
        $: shouldFallback
      };
    }

    function unwrapElement(element) {
      return !isElement(element) ? element.contextElement : element;
    }

    function getScale(element) {
      const domElement = unwrapElement(element);
      if (!isHTMLElement(domElement)) {
        return createCoords(1);
      }
      const rect = domElement.getBoundingClientRect();
      const {
        width,
        height,
        $
      } = getCssDimensions(domElement);
      let x = ($ ? round(rect.width) : rect.width) / width;
      let y = ($ ? round(rect.height) : rect.height) / height;

      // 0, NaN, or Infinity should always fallback to 1.

      if (!x || !Number.isFinite(x)) {
        x = 1;
      }
      if (!y || !Number.isFinite(y)) {
        y = 1;
      }
      return {
        x,
        y
      };
    }

    const noOffsets = /*#__PURE__*/createCoords(0);
    function getVisualOffsets(element) {
      const win = getWindow(element);
      if (!isWebKit() || !win.visualViewport) {
        return noOffsets;
      }
      return {
        x: win.visualViewport.offsetLeft,
        y: win.visualViewport.offsetTop
      };
    }
    function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
      if (isFixed === void 0) {
        isFixed = false;
      }
      if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
        return false;
      }
      return isFixed;
    }

    function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
      if (includeScale === void 0) {
        includeScale = false;
      }
      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }
      const clientRect = element.getBoundingClientRect();
      const domElement = unwrapElement(element);
      let scale = createCoords(1);
      if (includeScale) {
        if (offsetParent) {
          if (isElement(offsetParent)) {
            scale = getScale(offsetParent);
          }
        } else {
          scale = getScale(element);
        }
      }
      const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
      let x = (clientRect.left + visualOffsets.x) / scale.x;
      let y = (clientRect.top + visualOffsets.y) / scale.y;
      let width = clientRect.width / scale.x;
      let height = clientRect.height / scale.y;
      if (domElement) {
        const win = getWindow(domElement);
        const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
        let currentIFrame = win.frameElement;
        while (currentIFrame && offsetParent && offsetWin !== win) {
          const iframeScale = getScale(currentIFrame);
          const iframeRect = currentIFrame.getBoundingClientRect();
          const css = getComputedStyle$1(currentIFrame);
          const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
          const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
          x *= iframeScale.x;
          y *= iframeScale.y;
          width *= iframeScale.x;
          height *= iframeScale.y;
          x += left;
          y += top;
          currentIFrame = getWindow(currentIFrame).frameElement;
        }
      }
      return rectToClientRect({
        width,
        height,
        x,
        y
      });
    }

    function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
      let {
        rect,
        offsetParent,
        strategy
      } = _ref;
      const isOffsetParentAnElement = isHTMLElement(offsetParent);
      const documentElement = getDocumentElement(offsetParent);
      if (offsetParent === documentElement) {
        return rect;
      }
      let scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      let scale = createCoords(1);
      const offsets = createCoords(0);
      if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
        if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }
        if (isHTMLElement(offsetParent)) {
          const offsetRect = getBoundingClientRect(offsetParent);
          scale = getScale(offsetParent);
          offsets.x = offsetRect.x + offsetParent.clientLeft;
          offsets.y = offsetRect.y + offsetParent.clientTop;
        }
      }
      return {
        width: rect.width * scale.x,
        height: rect.height * scale.y,
        x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
        y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
      };
    }

    function getClientRects(element) {
      return Array.from(element.getClientRects());
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
    }

    // Gets the entire size of the scrollable document area, even extending outside
    // of the `<html>` and `<body>` rect bounds if horizontally scrollable.
    function getDocumentRect(element) {
      const html = getDocumentElement(element);
      const scroll = getNodeScroll(element);
      const body = element.ownerDocument.body;
      const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
      const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
      let x = -scroll.scrollLeft + getWindowScrollBarX(element);
      const y = -scroll.scrollTop;
      if (getComputedStyle$1(body).direction === 'rtl') {
        x += max(html.clientWidth, body.clientWidth) - width;
      }
      return {
        width,
        height,
        x,
        y
      };
    }

    function getViewportRect(element, strategy) {
      const win = getWindow(element);
      const html = getDocumentElement(element);
      const visualViewport = win.visualViewport;
      let width = html.clientWidth;
      let height = html.clientHeight;
      let x = 0;
      let y = 0;
      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        const visualViewportBased = isWebKit();
        if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }
      return {
        width,
        height,
        x,
        y
      };
    }

    // Returns the inner client rect, subtracting scrollbars if present.
    function getInnerBoundingClientRect(element, strategy) {
      const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
      const top = clientRect.top + element.clientTop;
      const left = clientRect.left + element.clientLeft;
      const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
      const width = element.clientWidth * scale.x;
      const height = element.clientHeight * scale.y;
      const x = left * scale.x;
      const y = top * scale.y;
      return {
        width,
        height,
        x,
        y
      };
    }
    function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
      let rect;
      if (clippingAncestor === 'viewport') {
        rect = getViewportRect(element, strategy);
      } else if (clippingAncestor === 'document') {
        rect = getDocumentRect(getDocumentElement(element));
      } else if (isElement(clippingAncestor)) {
        rect = getInnerBoundingClientRect(clippingAncestor, strategy);
      } else {
        const visualOffsets = getVisualOffsets(element);
        rect = {
          ...clippingAncestor,
          x: clippingAncestor.x - visualOffsets.x,
          y: clippingAncestor.y - visualOffsets.y
        };
      }
      return rectToClientRect(rect);
    }
    function hasFixedPositionAncestor(element, stopNode) {
      const parentNode = getParentNode(element);
      if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
        return false;
      }
      return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
    }

    // A "clipping ancestor" is an `overflow` element with the characteristic of
    // clipping (or hiding) child elements. This returns all clipping ancestors
    // of the given element up the tree.
    function getClippingElementAncestors(element, cache) {
      const cachedResult = cache.get(element);
      if (cachedResult) {
        return cachedResult;
      }
      let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
      let currentContainingBlockComputedStyle = null;
      const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
      let currentNode = elementIsFixed ? getParentNode(element) : element;

      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
      while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
        const computedStyle = getComputedStyle$1(currentNode);
        const currentNodeIsContaining = isContainingBlock(currentNode);
        if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
          currentContainingBlockComputedStyle = null;
        }
        const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
        if (shouldDropCurrentNode) {
          // Drop non-containing blocks.
          result = result.filter(ancestor => ancestor !== currentNode);
        } else {
          // Record last containing block for next iteration.
          currentContainingBlockComputedStyle = computedStyle;
        }
        currentNode = getParentNode(currentNode);
      }
      cache.set(element, result);
      return result;
    }

    // Gets the maximum area that the element is visible in due to any number of
    // clipping ancestors.
    function getClippingRect(_ref) {
      let {
        element,
        boundary,
        rootBoundary,
        strategy
      } = _ref;
      const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
      const clippingAncestors = [...elementClippingAncestors, rootBoundary];
      const firstClippingAncestor = clippingAncestors[0];
      const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
        const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
      return {
        width: clippingRect.right - clippingRect.left,
        height: clippingRect.bottom - clippingRect.top,
        x: clippingRect.left,
        y: clippingRect.top
      };
    }

    function getDimensions(element) {
      const {
        width,
        height
      } = getCssDimensions(element);
      return {
        width,
        height
      };
    }

    function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
      const isOffsetParentAnElement = isHTMLElement(offsetParent);
      const documentElement = getDocumentElement(offsetParent);
      const isFixed = strategy === 'fixed';
      const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
      let scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      const offsets = createCoords(0);
      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }
        if (isOffsetParentAnElement) {
          const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
          offsets.x = offsetRect.x + offsetParent.clientLeft;
          offsets.y = offsetRect.y + offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }
      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    function getTrueOffsetParent(element, polyfill) {
      if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
        return null;
      }
      if (polyfill) {
        return polyfill(element);
      }
      return element.offsetParent;
    }

    // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.
    function getOffsetParent(element, polyfill) {
      const window = getWindow(element);
      if (!isHTMLElement(element)) {
        return window;
      }
      let offsetParent = getTrueOffsetParent(element, polyfill);
      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent, polyfill);
      }
      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
        return window;
      }
      return offsetParent || getContainingBlock(element) || window;
    }

    const getElementRects = async function (_ref) {
      let {
        reference,
        floating,
        strategy
      } = _ref;
      const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
      const getDimensionsFn = this.getDimensions;
      return {
        reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
        floating: {
          x: 0,
          y: 0,
          ...(await getDimensionsFn(floating))
        }
      };
    };

    function isRTL(element) {
      return getComputedStyle$1(element).direction === 'rtl';
    }

    const platform = {
      convertOffsetParentRelativeRectToViewportRelativeRect,
      getDocumentElement,
      getClippingRect,
      getOffsetParent,
      getElementRects,
      getClientRects,
      getDimensions,
      getScale,
      isElement,
      isRTL
    };

    // https://samthor.au/2021/observing-dom/
    function observeMove(element, onMove) {
      let io = null;
      let timeoutId;
      const root = getDocumentElement(element);
      function cleanup() {
        clearTimeout(timeoutId);
        io && io.disconnect();
        io = null;
      }
      function refresh(skip, threshold) {
        if (skip === void 0) {
          skip = false;
        }
        if (threshold === void 0) {
          threshold = 1;
        }
        cleanup();
        const {
          left,
          top,
          width,
          height
        } = element.getBoundingClientRect();
        if (!skip) {
          onMove();
        }
        if (!width || !height) {
          return;
        }
        const insetTop = floor(top);
        const insetRight = floor(root.clientWidth - (left + width));
        const insetBottom = floor(root.clientHeight - (top + height));
        const insetLeft = floor(left);
        const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
        const options = {
          rootMargin,
          threshold: max(0, min(1, threshold)) || 1
        };
        let isFirstUpdate = true;
        function handleObserve(entries) {
          const ratio = entries[0].intersectionRatio;
          if (ratio !== threshold) {
            if (!isFirstUpdate) {
              return refresh();
            }
            if (!ratio) {
              timeoutId = setTimeout(() => {
                refresh(false, 1e-7);
              }, 100);
            } else {
              refresh(false, ratio);
            }
          }
          isFirstUpdate = false;
        }

        // Older browsers don't support a `document` as the root and will throw an
        // error.
        try {
          io = new IntersectionObserver(handleObserve, {
            ...options,
            // Handle <iframe>s
            root: root.ownerDocument
          });
        } catch (e) {
          io = new IntersectionObserver(handleObserve, options);
        }
        io.observe(element);
      }
      refresh(true);
      return cleanup;
    }

    /**
     * Automatically updates the position of the floating element when necessary.
     * Should only be called when the floating element is mounted on the DOM or
     * visible on the screen.
     * @returns cleanup function that should be invoked when the floating element is
     * removed from the DOM or hidden from the screen.
     * @see https://floating-ui.com/docs/autoUpdate
     */
    function autoUpdate(reference, floating, update, options) {
      if (options === void 0) {
        options = {};
      }
      const {
        ancestorScroll = true,
        ancestorResize = true,
        elementResize = typeof ResizeObserver === 'function',
        layoutShift = typeof IntersectionObserver === 'function',
        animationFrame = false
      } = options;
      const referenceEl = unwrapElement(reference);
      const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
      ancestors.forEach(ancestor => {
        ancestorScroll && ancestor.addEventListener('scroll', update, {
          passive: true
        });
        ancestorResize && ancestor.addEventListener('resize', update);
      });
      const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
      let reobserveFrame = -1;
      let resizeObserver = null;
      if (elementResize) {
        resizeObserver = new ResizeObserver(_ref => {
          let [firstEntry] = _ref;
          if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
            // Prevent update loops when using the `size` middleware.
            // https://github.com/floating-ui/floating-ui/issues/1740
            resizeObserver.unobserve(floating);
            cancelAnimationFrame(reobserveFrame);
            reobserveFrame = requestAnimationFrame(() => {
              resizeObserver && resizeObserver.observe(floating);
            });
          }
          update();
        });
        if (referenceEl && !animationFrame) {
          resizeObserver.observe(referenceEl);
        }
        resizeObserver.observe(floating);
      }
      let frameId;
      let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
      if (animationFrame) {
        frameLoop();
      }
      function frameLoop() {
        const nextRefRect = getBoundingClientRect(reference);
        if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
          update();
        }
        prevRefRect = nextRefRect;
        frameId = requestAnimationFrame(frameLoop);
      }
      update();
      return () => {
        ancestors.forEach(ancestor => {
          ancestorScroll && ancestor.removeEventListener('scroll', update);
          ancestorResize && ancestor.removeEventListener('resize', update);
        });
        cleanupIo && cleanupIo();
        resizeObserver && resizeObserver.disconnect();
        resizeObserver = null;
        if (animationFrame) {
          cancelAnimationFrame(frameId);
        }
      };
    }

    /**
     * Optimizes the visibility of the floating element by choosing the placement
     * that has the most space available automatically, without needing to specify a
     * preferred placement. Alternative to `flip`.
     * @see https://floating-ui.com/docs/autoPlacement
     */
    const autoPlacement = autoPlacement$1;

    /**
     * Provides data to position an inner element of the floating element so that it
     * appears centered to the reference element.
     * @see https://floating-ui.com/docs/arrow
     */
    const arrow = arrow$1;

    /**
     * Computes the `x` and `y` coordinates that will place the floating element
     * next to a given reference element.
     */
    const computePosition = (reference, floating, options) => {
      // This caches the expensive `getClippingElementAncestors` function so that
      // multiple lifecycle resets re-use the same result. It only lives for a
      // single call. If other functions become expensive, we can add them as well.
      const cache = new Map();
      const mergedOptions = {
        platform,
        ...options
      };
      const platformWithCache = {
        ...mergedOptions.platform,
        _c: cache
      };
      return computePosition$1(reference, floating, {
        ...mergedOptions,
        platform: platformWithCache
      });
    };

    /** MultiView styles
     * @public
     */
    const styles$9 = css `
  ${display("block")}

  :host {
    display: block;
    position: relative;
  }
  :host([hidden]) {
    display: none;
  }
  :host([data-flexposition="2"]) {
    order: 2;
  }
  :host(:focus-visible)::after {
    content: "";
    position: absolute;
    inset: 1px;
    border-color: ${colorTransparentStroke};
    outline: ${strokeWidthThick} solid ${colorTransparentStroke};
    box-shadow: ${shadow4}, 0 0 0 2px ${colorStrokeFocus2};
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(MultiView:class)} component.
     * @public
     */
    function multiViewTemplate() {
        return html `
    <template
      slot="multi-view"
      role="tabpanel"
      ?hidden="${(x) => x.hidden}"
      tabindex="${(x) => (!x.hidden ? "0" : "-1")}"
      role="region"
    >
      <div class="multi-view" part="multi-view">
        ${startSlotTemplate({})}
        <slot></slot>
        ${endSlotTemplate({})}
      </div>
    </template>
  `;
    }
    const template$9 = multiViewTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-multi-view>
     */
    const definition$8 = MultiView.compose({
        name: `${DesignSystem.prefix}-multi-view`,
        template: template$9,
        styles: styles$9,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode
        }
    });

    /**
     * A MultiViewController Component to be used with MultiViewGroup.
     * @public
     */
    class MultiViewController extends FASTElement {
    }

    // Need to support icon hover styles
    const styles$8 = css `
  :host {
    position: relative;
  }
  :host([aria-expanded="true"])::before {
    content: "";
    z-index: 3;
    position: absolute;
    left: 0;
    height: 32px;
    width: 3px;
    background: var(--colorBrandBackground);
  }

  :host(:focus-visible)::after {
    content: "";
    position: absolute;
    inset: 0px;
    cursor: pointer;
    border-radius: var(--borderRadiusSmall);
    outline: none;
    box-shadow: inset 0 0 0 1px var(--colorStrokeFocus2);
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(MultiViewController:class)} component.
     * @public
     */
    function multiViewControllerTemplate() {
        return html `
    <template slot="controller" tabindex="-1" role="tab">
      <fluent-button icon-only shape="square" tabindex="-1">
        <slot></slot>
      </fluent-button>
    </template>
  `;
    }
    const template$8 = multiViewControllerTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <fluent-multi-view-controller>
     */
    const definition$7 = MultiViewController.compose({
        name: `${DesignSystem.prefix}-multi-view-controller`,
        template: template$8,
        styles: styles$8
    });

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
    class MultiViewGroup extends FASTElement {
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

    /** PaneSwitcher styles
     * @public
     */
    const styles$7 = css `
  ${display("flex")}
  :host {
    flex-direction: column;
    position: absolute;
    z-index: 10;
    right: 0;
    top: 0;
    height: 100%;
  }
  .root {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .views {
    display: flex;
  }
  .controllers {
    display: flex;
    flex-direction: column;
    background: var(--colorNeutralBackground1);
    position: relative;
  }

  .controllers:focus-visible::after {
    content: "";
    position: absolute;
    inset: 1px;
    border-color: ${colorTransparentStroke};
    outline: ${strokeWidthThick} solid ${colorTransparentStroke};
    box-shadow: ${shadow4}, 0 0 0 2px ${colorStrokeFocus2};
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(MultiViewGroup:class)} component.
     * @public
     */
    function multiViewGroupTemplate() {
        return html `
    <template>
      <div class="root">
        <div class="views" part="views">
          <slot name="multi-view" ${slotted("multiViews")}></slot>
        </div>
        ${startSlotTemplate({})}
        <div
          class="controllers"
          part="controllers"
          role="tablist"
          aria-label="${(x) => x.ariaLabel}"
          tabindex="${(x) => (x.hidden ? "-1" : "0")}"
          ${ref("controllersContainer")}
        >
          <slot name="controller" ${slotted("controllers")}></slot>
        </div>
        ${endSlotTemplate({})}
      </div>
    </template>
  `;
    }
    const template$7 = multiViewGroupTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <fluent-multi-view-group>
     */
    const definition$6 = MultiViewGroup.compose({
        name: `${DesignSystem.prefix}-multi-view-group`,
        template: template$7,
        styles: styles$7,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode
        }
    });

    /**
     * The state variations for the Step component
     * @public
     */
    const StepState = {
        incomplete: "incomplete",
        complete: "complete",
        error: "error"
    };

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
    class Step extends FASTElement {
        constructor() {
            super(...arguments);
            /**
             * Indicates whether the step is active.
             * @public
             */
            this.active = false;
            /**
             * Indicates whether the step is disabled.
             * @public
             */
            this.disabled = false;
            /**
             * The state of the step.
             * @public
             */
            this.state = StepState.incomplete;
            /**
             * The index of the step within the parent Stepper component.
             * @public
             */
            this.index = 0;
            /**
             * The details of the step.
             * @public
             */
            this.details = "";
            /**
             * The title of the step.
             * @public
             */
            this.title = "";
        }
        /**
         * Handles the change in the state of the step.
         * @public
         */
        stateChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
                this.emitChange();
            }
        }
        /**
         * Handles change to the active property.
         * @public
         */
        activeChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
                this.emitChange();
            }
        }
        /**
         * Toggle the ative state of the step.
         * @public
         */
        toggleActive() {
            this.active = !this.active;
        }
        /**
         * Sets the state of the step to 'complete'.
         * @public
         */
        setComplete() {
            this.state = StepState.complete;
        }
        /**
         * Sets the state of the step to 'incomplete'.
         * @public
         */
        setIncomplete() {
            this.state = StepState.incomplete;
        }
        /**
         * Sets the state of the step to 'error'.
         * @public
         */
        setError() {
            this.state = StepState.error;
        }
        /**
         * Emits a stepchange event with the current step's details.
         * @public
         */
        emitChange() {
            this.$emit("stepchange", {
                id: this.id,
                state: this.state,
                active: this.active,
                index: this.index
            });
        }
    }
    __decorate([
        attr({ mode: "boolean" })
    ], Step.prototype, "ordered", void 0);
    __decorate([
        attr({ mode: "boolean", attribute: "hide-connector" })
    ], Step.prototype, "hideConnector", void 0);
    __decorate([
        attr({ mode: "boolean" })
    ], Step.prototype, "active", void 0);
    __decorate([
        attr({ mode: "boolean" })
    ], Step.prototype, "disabled", void 0);
    __decorate([
        attr({ attribute: "aria-describedby" })
    ], Step.prototype, "ariaDescribedby", void 0);
    __decorate([
        attr({ attribute: "aria-labelledby" })
    ], Step.prototype, "ariaLabelledby", void 0);
    __decorate([
        attr
    ], Step.prototype, "state", void 0);
    __decorate([
        observable
    ], Step.prototype, "index", void 0);
    __decorate([
        observable
    ], Step.prototype, "details", void 0);
    __decorate([
        observable
    ], Step.prototype, "title", void 0);

    /** Step styles
     * @public
     */
    const styles$6 = css `
  ${display("block")}

  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: ${fontFamilyBase};
    position: relative;
    align-items: flex-start;
    column-gap: ${spacingHorizontalM};
    flex-shrink: 0;
    flex-grow: 1;
  }

  :host([hide-connector]) .state-connector,
  .summary,
  .title,
  .details {
    display: none;
  }

  :host(.overflow) {
    flex-shrink: 0;
    flex-grow: 0;
    width: 36px;
  }

  :host(.first) {
    padding-left: ${spacingHorizontalXXL};
  }

  :host(.first) .state-connector {
    left: 28px;
  }

  :host(.last) {
    padding-right: ${spacingHorizontalXXL};
  }

  .state-indicator {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    box-sizing: border-box;
  }

  .icon {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    font-weight: var(--fontWeightRegular);
    line-height: var(--lineHeightBase100);
    font-size: var(--fontSizeBase200);
    border-radius: var(--borderRadiusCircular);
    border: 2px solid var(--colorNeutralForeground2);
    background: var(--colorNeutralBackground4);
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .order {
    font-size: var(--fontSizeBase200);
    font-weight: var(--fontWeightSemibold);
    line-height: var(--lineHeightBase200);
    margin-bottom: 1px;
  }

  .state-connector {
    position: absolute;
    top: 12px;
    left: 4px;
    height: 2px;
    width: 100%;
    background: var(--colorNeutralForegroundDisabled);
  }

  .title {
    font-weight: ${fontWeightRegular};
    font-size: ${fontSizeBase300};
    line-height: ${lineHeightBase300};
  }

  .details {
    font-weight: ${fontWeightRegular};
    font-size: ${fontSizeBase200};
    line-height: ${lineHeightBase200};
  }

  .icon svg {
    color: ${colorNeutralForegroundOnBrand};
    fill: ${colorNeutralForegroundOnBrand};
    width: 12px;
    height: 12px;
    box-sizing: border-box;
    vertical-align: middle;
  }

  :host([hide-connector]) {
    width: fit-content;
    flex-grow: 0;
    min-width: unset;
  }

  :host([aria-current="step"]) .title {
    font-weight: ${fontWeightSemibold};
  }

  :host([state="complete"]) .icon,
  :host([state="complete"]) .state-connector,
  :host([state="complete"].first) .state-connector,
  :host([active]) .icon {
    background: ${colorBrandForeground2};
    border-color: ${colorBrandForeground2};
    color: ${colorNeutralForegroundOnBrand};
  }

  :host([state="complete"]) .icon svg {
    margin-top: 2px;
  }

  :host([state="error"]) .icon {
    background: ${colorPaletteRedForeground3};
    border-color: ${colorPaletteRedForeground3};
  }

  @media (min-width: 480px) {
    :host(.overflow),
    :host,
    :host(.first) {
      display: flex;
      align-items: flex-start;
      width: fit-content;
      height: fit-content;
      max-width: 268px;
      padding: 0 0 ${spacingVerticalL} 0;
      column-gap: ${spacingHorizontalM};
      flex-grow: 0;
    }
    :host(.first) .state-connector,
    .state-connector {
      position: absolute;
      width: 2px;
      left: 11px;
      height: 100%;
      background: var(--colorNeutralForegroundDisabled);
      min-height: 22px;
    }
  }

  @media (min-width: 1023px) {
    :host {
      flex-direction: row;
    }
    .state-connector {
      left: 11px;
    }
    :host([aria-current="step"]) .details,
    .title {
      display: block;
    }
    .order {
      display: none;
    }
    .summary {
      display: flex;
      flex-direction: column;
      width: fit-content;
      min-width: 174px;
      gap: ${spacingVerticalXXS};
    }
  }
`;

    const Checkmark16Regular = html `
  <svg
    fill="currentColor"
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02Z"
      fill="currentColor"
    ></path>
  </svg>
`;
    const Dismiss16Regular = html `
  <svg
    fill="currentColor"
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m2.4 2.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1-.07-.98l.07-.08-.07.08Z"
      fill="currentColor"
    ></path>
  </svg>
`;
    /**
     * The template for the {@link @horizon-msft/web-components#(Step:class)} component.
     * @public
     */
    function baseStepTemplate() {
        return html `
    <template
      class="step"
      state="${(x) => x.state}"
      ?hide-connector="${(x) => x.hideConnector}"
      ?active="${(x) => x.active}"
      ?disabled="${(x) => x.disabled}"
      ?ordered="${(x) => x.ordered}"
      aria-label="${(x) => x.ariaLabel}"
      aria-describedby="${(x) => x.ariaDescribedby}"
      aria-labelledby="${(x) => x.ariaLabelledby}"
      aria-current="${(x) => (x.active ? "step" : null)}"
      aria-completed="${(x) => (x.state == "complete" ? "true" : "false")}"
    >
      <slot name="start"></slot>
      <div class="state-indicator">
        <div class="icon" part="icon">
          ${(x) => x.state === "incomplete"
        ? html `
                  <slot name="incomplete">
                    <span class="order" part="order">
                      ${(x) => (x.ordered ? x.index + 1 : "")}
                    </span>
                  </slot>
                `
        : ""}
          ${(x) => x.state === "complete"
        ? html `
                  <slot name="complete">${Checkmark16Regular}</slot>
                `
        : ""}
          ${(x) => x.state === "error"
        ? html `
                  <slot name="error">${Dismiss16Regular}</slot>
                `
        : ""}
        </div>
      </div>
      <div class="summary" part="summary">
        <div class="title" part="title">
          <slot name="title">${(x) => x.title}</slot>
        </div>
        <div class="details" part="details">
          <slot name="details">${(x) => x.details}</slot>
        </div>
      </div>

      <div part="state-connector" class="state-connector"></div>
      <slot name="end"></slot>
    </template>
  `;
    }
    const template$6 = baseStepTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-step>
     */
    const definition$5 = Step.compose({
        name: `${DesignSystem.prefix}-step`,
        template: template$6,
        styles: styles$6,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode,
        },
    });

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
    class Stepper extends FASTElement {
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

    /** Step styles
     * @public
     */
    const styles$5 = css `
  ${display("block")}

  :host {
    background-color: ${colorNeutralBackground3};
    box-sizing: border-box;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 9;
  }

  .list {
    display: flex;
    flex-direction: row;
  }

  :host(.overflow) .list {
    justify-content: flex-start;
    align-items: unset;
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${spacingVerticalXXL} 0;
  }

  @media (min-width: 480px) {
    :host(.overflow),
    :host {
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
      position: relative;
      height: 100%;
      max-width: 70px;
    }
    .list {
      flex-direction: column;
      max-width: 480px;
    }
    :host(.overflow) .list {
      width: fit-content;
      justify-content: unset;
      align-items: center;
      overflow-x: unset;
      overflow-y: unset;
      width: 24px;
      padding: 0;
    }
  }

  @media (min-width: 1023px) {
    :host(.overflow),
    :host {
      max-width: 268px;
      width: 268px;
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXXL}
        ${spacingVerticalXXL} ${spacingHorizontalXXL};
    }
    :host(.overflow) .list {
      width: fit-content;
    }
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(Stepper:class)} component.
     * @public
     */
    function stepperTemplate() {
        return html `
    <template
      ?hidden="${(x) => x.hidden}"
      ?ordered="${(x) => x.ordered}"
      current-index="${(x) => x.currentIndex}"
      aria-labelledby="${(x) => x.ariaLabelledby}"
      aria-describedby="${(x) => x.ariaDescribedby}"
      aria-label="${(x) => x.ariaLabel}"
    >
      <slot name="start"></slot>
      <div class="list" part="list" role="list">
        <slot name="step" ${slotted("slottedsteps")}></slot>
      </div>
      <slot name="end"></slot>
    </template>
  `;
    }
    const template$5 = stepperTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-step>
     */
    const definition$4 = Stepper.compose({
        name: `${DesignSystem.prefix}-stepper`,
        template: template$5,
        styles: styles$5,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode,
        },
    });

    /**
     * SVG Sanitizer Script
     *
     * This script provides a function, `sanitizeSVG`, designed to sanitize SVG content strings by removing
     * potentially harmful or malicious tags and attributes. It takes an SVG content string as input and returns
     * a sanitized SVG content string.
     *
     * It strictly disallows a predefined list of tags and attributes that can be exploited for malicious purposes
     * such as Cross-Site Scripting (XSS) attacks. Any occurrence of blocked tags and attributes within the provided
     * SVG content is removed during the sanitization process.
     *
     * Example Usage:
     * const sanitizedSVG = sanitizeSVG('<svg><script>alert("XSS")</script></svg>');
     *
     * Upon finding and removing any blocked tags or attributes, the sanitizer logs a warning message
     * to the console for visibility.
     */
    const BLOCKED_TAGS = [
        "base",
        "embed",
        "form",
        "frame",
        "iframe",
        "link",
        "meta",
        "object",
        "script",
        "style",
    ];
    const BLOCKED_ATTRS = [
        "data",
        "formaction",
        "onclick",
        "onerror",
        "onload",
        "onmouseover",
        "src",
    ];
    /**
     * sanitizeSVG
     *
     * @param {string} svgString - The original SVG content string.
     * @returns {string} - Sanitized SVG content string.
     *
     */
    function sanitizeSVG(svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        // Handle parsing error
        if (!doc.documentElement || doc.documentElement.nodeName === "parsererror") {
            const errorText = doc.documentElement
                ? doc.documentElement.textContent
                : "";
            console.error("SVG parsing error", errorText);
            return "";
        }
        removeBlockedElementsAndAttributes(doc, BLOCKED_TAGS, BLOCKED_ATTRS);
        // Serialize the sanitized SVG content back to string
        return new XMLSerializer().serializeToString(doc.documentElement);
    }
    /**
     * removeBlockedElementsAndAttributes
     *
     * @param {Document} doc - The SVG DOM document.
     * @param {string[]} blockedTags - Array of blocked tags.
     * @param {string[]} blockedAttrs - Array of blocked attributes.
     *
     */
    function removeBlockedElementsAndAttributes(doc, blockedTags, blockedAttrs) {
        var _a;
        // Remove blocked tags and attributes and log them
        const allElements = Array.from(doc.querySelectorAll("*"));
        for (const element of allElements) {
            const tagName = element.tagName.toLowerCase();
            if (blockedTags.includes(tagName)) {
                console.warn(`Custom SVG Sanitizer: Found and removed blocked tag: <${tagName}>`);
                (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
            }
            else {
                for (const attr of element.getAttributeNames()) {
                    if (blockedAttrs.includes(attr.toLowerCase()) ||
                        /^on[a-z]+/.test(attr.toLowerCase())) {
                        console.warn(`Custom SVG Sanitizer: Found and removed blocked attribute: ${attr} from <${element.tagName.toLowerCase()}>`);
                        element.removeAttribute(attr);
                    }
                }
            }
        }
    }

    /**
     * SvgService is responsible for fetching, caching, and manipulating SVG content.
     * This includes loading SVG icons or sprites from given paths and preparing SVG
     * content for display. Cached SVGs ensure that repeated fetches are avoided.
     *
     * Typical usage:
     *
     * const svgContent = await SvgService.loadIconOrSprite('/path/to/sprite.svg', 'icon-name');
     *
     */
    class SvgService {
        /**
         * Loads an SVG icon or sprite from a given path.
         *
         * @param path {string} - The path to the SVG file.
         * @param name {string} - The name (ID) of the icon if fetching from a sprite.
         * @returns {Promise<string>} - A promise that resolves to the SVG content or rejects with an error.
         */
        static async loadIconOrSprite(path, name) {
            try {
                let svgContent = await this.fetchAndCacheSVG(path);
                if (svgContent.includes("<symbol")) {
                    return this.getIconFromSprite(svgContent, name);
                }
                else {
                    return svgContent;
                }
            }
            catch (error) {
                console.error(`Failed to load SVG from path ${path}:`, error);
                throw error;
            }
        }
        /**
         * Fetches and caches an SVG from a given path.
         *
         * @param path {string} - The path to the SVG file.
         * @returns {Promise<string>} - A promise that resolves to the SVG content.
         */
        static async fetchAndCacheSVG(path) {
            if (!this.cache.has(path)) {
                try {
                    const svgPromise = fetch(path)
                        .then((resp) => {
                        if (!resp.ok) {
                            throw new Error(`Network error: ${resp.status} ${resp.statusText}`);
                        }
                        return resp.text();
                    })
                        .then((svg) => {
                        // Basic check for SVG format
                        if (!/<svg[\s\S]+<\/svg>/.test(svg)) {
                            throw new Error("Invalid SVG format");
                        }
                        return sanitizeSVG(svg);
                    });
                    this.cache.set(path, svgPromise);
                    return await svgPromise;
                }
                catch (error) {
                    console.error(`Failed to fetch and cache SVG from path ${path}:`, error);
                    throw error; // Propagate the error so it can be handled by the calling code if needed
                }
            }
            return await this.cache.get(path);
        }
        /**
         * Extracts an icon from an SVG sprite.
         *
         * @param spriteContent {string} - The SVG sprite content.
         * @param iconName {string} - The name (ID) of the icon to extract.
         * @returns {string} - The SVG content for the icon.
         */
        static getIconFromSprite(spriteContent, iconName) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(spriteContent, "image/svg+xml");
            const symbol = doc.querySelector(`symbol[id="${iconName}"]`);
            if (!symbol) {
                console.error(`Icon with ID ${iconName} not found in sprite.`);
                return "";
            }
            // Convert the symbol content into SVG.
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svgElem = document.createElementNS(svgNamespace, "svg");
            svgElem.setAttribute("xmlns", svgNamespace);
            svgElem.setAttributeNS(null, "viewBox", symbol.getAttribute("viewBox") || "");
            svgElem.innerHTML = symbol.innerHTML;
            return svgElem.outerHTML;
        }
        /**
         * Prepares SVG content, either as a standalone SVG or extracting it from a sprite.
         *
         * @param path {string} - The path to the SVG file.
         * @param name {string} - The name (ID) of the icon if fetching from a sprite.
         * @returns {Promise<{content: string, width?: string, height?: string}>} - A promise that resolves to the prepared SVG content and dimensions.
         */
        static async getPreparedSVG(path, name) {
            try {
                const content = await this.loadIconOrSprite(path, name);
                const doc = this.parseSVG(content);
                const symbol = doc.querySelector("symbol");
                if (symbol) {
                    return this.getSVGDetailsFromSymbol(symbol);
                }
                else {
                    return this.getSVGDetailsFromSVGElement(doc);
                }
            }
            catch (error) {
                console.error(`Failed to prepare SVG from path ${path}:`, error);
                throw error;
            }
        }
        /**
         * Parse the input SVG string and return an SVG Document.
         *
         * @param svgString {string} - The input SVG content in string format.
         * @returns {Document} - The parsed SVG as a Document.
         */
        static parseSVG(svgString) {
            const parser = new DOMParser();
            return parser.parseFromString(svgString, "image/svg+xml");
        }
        /**
         * Converts an SVG symbol to an SVG element, extracting and returning its content and dimensions.
         *
         * @param symbol {Element} - The SVG symbol element to be converted.
         * @returns {{ content: string, width?: string, height?: string }} - An object containing the SVG content and optional width and height.
         */
        static getSVGDetailsFromSymbol(symbol) {
            const viewBox = symbol.getAttribute("viewBox");
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("viewBox", viewBox || "");
            svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            while (symbol.firstChild) {
                svgElement.appendChild(symbol.firstChild);
            }
            const width = symbol.getAttribute("width") || undefined;
            const height = symbol.getAttribute("height") || undefined;
            return {
                content: svgElement.outerHTML,
                width,
                height,
            };
        }
        /**
         * Extracts content and dimensions from the first SVG element within a Document.
         *
         * @param doc {Document} - The Document containing SVG data.
         * @returns {{ content: string, width?: string, height?: string }} - An object with the SVG content and optional width and height.
         */
        static getSVGDetailsFromSVGElement(doc) {
            const svgElem = doc.querySelector("svg");
            let width;
            let height;
            if (svgElem) {
                width = svgElem.getAttribute("width") || undefined;
                height = svgElem.getAttribute("height") || undefined;
            }
            return {
                content: (svgElem === null || svgElem === void 0 ? void 0 : svgElem.outerHTML) || "",
                width,
                height,
            };
        }
    }
    SvgService.cache = new Map();

    /**
     * SvgIcon constants
     * @public
     */
    const SvgIconRole = {
        img: "img",
        null: null,
    };

    class SvgIcon extends FASTElement {
        constructor() {
            super(...arguments);
            this.isLoading = true;
            this.isError = false;
            /**
             * The name of the SVG to use from the SVG sprite.
             * @public
             * @remarks
             * HTML Attribute: name
             * @type {string}
             */
            this.name = "";
            /**
             * The size of the icon. Value must match icon size as indicated in its name.
             * @public
             * @remarks
             * HTML Attribute: size
             * @type {string}
             */
            this.size = "";
            /**
             * Path to SVG. Can be standalone SVG or SVG sprite.
             * @public
             * @remarks
             * HTML Attribute: path
             * @type {string}
             */
            this.path = "";
            /**
             * Whether the icon is hidden from screen readers. Defaults to true.
             * @public
             * @remarks
             * HTML Attribute: aria-hidden
             * @type {string}
             */
            this.ariaHidden = "true";
            /**
             * Optional label for the icon. Emitted via aria-label.
             * @public
             * @remarks
             * HTML Attribute: label
             * @type {string}
             */
            this.ariaLabel = "";
            /**
             * Whether the icon is focusable. Defaults to false.
             * @public
             * @remarks
             * HTML Attribute: focusable
             * @type {string}
             */
            this.focusable = "false";
            /**
             * The role of the icon. Defaults to null.
             * @public
             * @remarks
             * HTML Attribute: role
             * @type {string}
             */
            this.role = SvgIconRole.null;
            this.renderResolver = null;
            this.renderPromise = new Promise((resolve) => {
                this.renderResolver = resolve;
            });
        }
        nameChanged() {
            this.checkAndResolveRenderPromise();
        }
        sizeChanged() {
            this.checkAndResolveRenderPromise();
        }
        pathChanged() {
            this.checkAndResolveRenderPromise();
        }
        connectedCallback() {
            super.connectedCallback();
            this.renderPromise.then(() => this.renderIcon());
        }
        checkAndResolveRenderPromise() {
            if (this.renderResolver) {
                if (this.path) {
                    if (!this.name || (this.name && this.name !== "")) {
                        this.renderResolver();
                        this.renderResolver = null;
                    }
                }
            }
        }
        renderIcon() {
            this.isLoading = true;
            SvgService.getPreparedSVG(this.path, this.name)
                .then(({ content, width, height }) => {
                this.isLoading = false;
                this.shadowRoot.innerHTML = content;
                this.updateComputedStylesheet(width, height);
                const svgElementInShadow = this.shadowRoot.querySelector("svg");
                if (svgElementInShadow) {
                    this.updateSvgAttributes(svgElementInShadow);
                }
            })
                .catch((error) => {
                this.isLoading = false;
                this.isError = true;
                console.error(`Failed to load icon: ${this.path}`, error);
                this.renderErrorIcon();
            });
        }
        renderErrorIcon() {
            // Creating SVG element for red "X"
            const errorSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            errorSvg.setAttribute("width", "20");
            errorSvg.setAttribute("height", "20");
            errorSvg.setAttribute("viewBox", "0 0 20 20");
            // Line from top-left to bottom-right
            const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line1.setAttribute("x1", "0");
            line1.setAttribute("y1", "0");
            line1.setAttribute("x2", "20");
            line1.setAttribute("y2", "20");
            line1.setAttribute("stroke", "red");
            line1.setAttribute("stroke-width", "2");
            // Line from top-right to bottom-left
            const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line2.setAttribute("x1", "20");
            line2.setAttribute("y1", "0");
            line2.setAttribute("x2", "0");
            line2.setAttribute("y2", "20");
            line2.setAttribute("stroke", "red");
            line2.setAttribute("stroke-width", "2");
            errorSvg.appendChild(line1);
            errorSvg.appendChild(line2);
            // Adding SVG to shadowRoot
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(errorSvg);
        }
        updateComputedStylesheet(width, height) {
            if (this.size) {
                const sizeValue = ["12", "16", "20", "24", "28", "32", "48"].includes(this.size)
                    ? this.size
                    : "20";
                this.computedStylesheet = css `
        :host {
          --icon-height: ${sizeValue}px;
          --icon-width: ${sizeValue}px;
        }
      `;
            }
            else if (width && height) {
                this.computedStylesheet = css `
        :host {
          --icon-height: ${height}px;
          --icon-width: ${width}px;
        }
      `;
            }
            if (this.computedStylesheet) {
                this.$fastController.addStyles(this.computedStylesheet);
            }
        }
        updateSvgAttributes(svgElement) {
            if (this.name !== undefined) {
                svgElement.setAttribute("name", this.name);
            }
            else {
                svgElement.removeAttribute("name");
            }
            if (this.size !== undefined) {
                svgElement.setAttribute("size", this.size);
            }
            else {
                svgElement.removeAttribute("size");
            }
            if (this.ariaLabel) {
                svgElement.setAttribute("aria-label", this.ariaLabel);
            }
            else {
                svgElement.removeAttribute("aria-label");
            }
            svgElement.setAttribute("aria-hidden", this.ariaHidden);
            svgElement.setAttribute("focusable", this.focusable || "false");
            if (this.role) {
                svgElement.setAttribute("role", this.role);
            }
            else {
                svgElement.removeAttribute("role");
            }
        }
    }
    __decorate([
        observable,
        attr
    ], SvgIcon.prototype, "name", void 0);
    __decorate([
        observable,
        attr
    ], SvgIcon.prototype, "size", void 0);
    __decorate([
        observable,
        attr
    ], SvgIcon.prototype, "path", void 0);
    __decorate([
        attr({ attribute: "aria-hidden" })
    ], SvgIcon.prototype, "ariaHidden", void 0);
    __decorate([
        attr({ attribute: "aria-label" })
    ], SvgIcon.prototype, "ariaLabel", void 0);
    __decorate([
        attr
    ], SvgIcon.prototype, "focusable", void 0);
    __decorate([
        attr
    ], SvgIcon.prototype, "role", void 0);

    const styles$4 = css `
  ${display("inline-flex")}

  :host,
  :host svg {
    height: var(--icon-height, 20px);
    width: var(--icon-width, 20px);
  }

  :host svg:not([role="img"]) {
    fill: currentcolor;
  }
`;

    const template$4 = html `
  <template></template>
`;

    const SvgIconDefinition = SvgIcon.compose({
        name: `${DesignSystem.prefix}-svg-icon`,
        template: template$4,
        styles: styles$4,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode,
        },
    });

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
    class TeachingBubble extends FASTElement {
        constructor() {
            super(...arguments);
            /**
             * The target element that the teaching bubble is attached to.
             * @type {string}
             * @default ""
             */
            this.target = "";
            /**
             * Determines whether focus trapping is disabled or not.
             * @type {boolean}
             */
            this.disableTrapFocus = false;
            /**
             * Determines whether the teaching bubble is currently trapping focus or not.
             * @type {boolean}
             */
            this.isTrappingFocus = false;
            /**
             * Determines whether the teaching bubble should trap focus or not.
             * @type {boolean}
             */
            this.trapFocus = false;
            /**
             * Useful for cleanup task of floating UI auto update from dom.
             * @type {boolean}
             */
            this.cleanAutoUpdate = null;
            /**
             * @public
             * Method to show bubble.
             */
            this.show = () => {
                this.updatePosition();
                // Auto updates the position of anchored Teaching Bubble to its reference element on resize.
                this.cleanAutoUpdate = autoUpdate(this.targetEl, this.currentEl, this.updatePosition);
                this.open = true;
                this.trapFocus = true;
                this.updateTrapFocus(true);
            };
            /**
             * @public
             * Method to hide bubble.
             * @param dismiss - Determines whether the teaching bubble should be dismissed or not.
             */
            this.hide = (dismiss = false) => {
                var _a;
                this.open = false;
                (_a = this.currentEl) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
                if (dismiss) {
                    this.$emit("dismiss");
                }
            };
            this.renderResolver = null;
            this.renderPromise = new Promise((resolve) => {
                this.renderResolver = resolve;
            });
            /**
             * @private
             * Method to set the target, current and arrow elements.
             */
            this.setElements = () => {
                var _a;
                this.targetEl = document.getElementById(this.target);
                this.currentEl = this;
                this.arrowEl = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("arrow");
            };
            /**
             * @private
             * Method to update position when element is rendered in the dom.
             */
            this.updatePosition = () => {
                this.setElements();
                // Initial position of the Teaching Bubble popup.
                const computeObj = this.placement
                    ? {
                        placement: this.placement,
                        middleware: [
                            offset(10),
                            arrow({
                                element: this.arrowEl,
                                padding: 4, // Prevents arrow from overflowing the corners, matches border radius of bubble.
                            }),
                        ],
                    }
                    : {
                        middleware: [
                            autoPlacement({ autoAlignment: true }),
                            offset(10),
                            arrow({
                                element: this.arrowEl,
                                padding: 4,
                            }),
                        ],
                    };
                if (this.targetEl && this.currentEl) {
                    computePosition(this.targetEl, this.currentEl, computeObj).then(({ x, y, placement, middlewareData }) => {
                        var _a;
                        if (!(this.currentEl instanceof HTMLElement)) {
                            return;
                        }
                        Object.assign(this.currentEl.style, {
                            left: `${x}px`,
                            top: `${y}px`,
                        });
                        // Accessing the arrow x and y position.
                        const { x: arrowX, y: arrowY } = ((_a = middlewareData.arrow) !== null && _a !== void 0 ? _a : {});
                        const staticSide = {
                            top: "bottom",
                            right: "left",
                            bottom: "top",
                            left: "right",
                        }[placement.split("-")[0]];
                        Object.assign(this.arrowEl.style, {
                            left: arrowX != null ? `${arrowX}px` : "",
                            top: arrowY != null ? `${arrowY}px` : "",
                            right: "",
                            bottom: "",
                            [staticSide]: "-8px",
                        });
                    });
                }
            };
            /**
             * @private
             * Handles keydown events on the document
             * @param e - The keydown event
             */
            this.handleDocumentKeydown = (e) => {
                if (!e.defaultPrevented && this.open) {
                    switch (e.key) {
                        case keyTab:
                            this.handleTabKeyDown(e);
                            break;
                        case keyEscape:
                            this.hide(true);
                            break;
                        default:
                            return true;
                    }
                }
            };
            /**
             * @private
             * Handles tab keydown events
             * @param e - The keydown event
             */
            this.handleTabKeyDown = (e) => {
                if (!this.trapFocus || !this.open) {
                    return;
                }
                const bounds = this.getTabQueueBounds();
                if (bounds.length === 1) {
                    bounds[0].focus();
                    e.preventDefault();
                    return;
                }
                if (e.shiftKey && e.target === bounds[0]) {
                    bounds[bounds.length - 1].focus();
                    e.preventDefault();
                }
                else if (!e.shiftKey && e.target === bounds[bounds.length - 1]) {
                    bounds[0].focus();
                    e.preventDefault();
                }
                return;
            };
            /**
             * @private
             * Gets the bounds of the tab queue
             * @returns (HTMLElement | SVGElement)[]
             */
            this.getTabQueueBounds = () => {
                const bounds = [];
                return TeachingBubble.reduceTabbableItems(bounds, this);
            };
            /**
             * @private
             * Updates the state of focus trapping
             * @param shouldTrapFocusOverride - Optional override for whether focus should be trapped
             */
            this.updateTrapFocus = (shouldTrapFocusOverride) => {
                const shouldTrapFocus = shouldTrapFocusOverride === undefined
                    ? this.shouldTrapFocus()
                    : shouldTrapFocusOverride;
                if (shouldTrapFocus && !this.isTrappingFocus) {
                    this.isTrappingFocus = true;
                    // Add an event listener for focusin events if we are trapping focus
                    document.addEventListener("focusin", this.handleDocumentFocus);
                    Updates.enqueue(() => {
                        if (this.shouldForceFocus(document.activeElement)) {
                            this.focusFirstElement();
                        }
                    });
                }
                else if (!shouldTrapFocus && this.isTrappingFocus) {
                    this.isTrappingFocus = false;
                    // remove event listener if we are not trapping focus
                    document.removeEventListener("focusin", this.handleDocumentFocus);
                }
            };
            /**
             * @private
             * Handles focus events on the document
             * @param e - The focus event
             */
            this.handleDocumentFocus = (e) => {
                if (!e.defaultPrevented && this.shouldForceFocus(e.target)) {
                    this.focusFirstElement();
                    e.preventDefault();
                }
            };
            /**
             * @private
             * Focuses the first element in the tab queue
             */
            this.focusFirstElement = () => {
                const bounds = this.getTabQueueBounds();
                const teachingBubbleAllEls = document.getElementsByTagName("hwc-teaching-bubble");
                let disableFocus = 0;
                Array.from(teachingBubbleAllEls).forEach((el) => {
                    if (true === el.hasAttribute("open")) {
                        disableFocus++;
                    }
                });
                // If more than one hwc-tabbable element present, then disable first focus.
                if (disableFocus > 1) {
                    return;
                }
                if (bounds.length > 0) {
                    bounds[0].focus();
                }
                else {
                    if (this.currentEl instanceof HTMLElement) {
                        this.currentEl.focus();
                    }
                }
            };
            /**
             * @private
             * Determines if focus should be forced
             * @param currentFocusElement - The currently focused element
             * @returns boolean
             */
            this.shouldForceFocus = (currentFocusElement) => {
                return this.isTrappingFocus && !this.contains(currentFocusElement);
            };
            /**
             * @private
             * Determines if focus should be trapped
             * @returns boolean
             */
            this.shouldTrapFocus = () => {
                return this.trapFocus && this.open;
            };
        }
        /**
         * @public
         * Method gets called when the component is inserted into the document.
         */
        connectedCallback() {
            super.connectedCallback();
            this.renderPromise.then(() => {
                this.setElements();
                this.initializePosition();
                document.addEventListener("keydown", this.handleDocumentKeydown);
                Updates.enqueue(() => {
                    this.updateTrapFocus();
                    this.disableTrapFocusHandler();
                });
            });
            this.renderResolver();
        }
        /**
         * @public
         * Method to perform cleanup tasks.
         */
        disconnectedCallback() {
            super.disconnectedCallback();
            // Remove the keydown event listener.
            document.removeEventListener("keydown", this.handleDocumentKeydown);
            document.removeEventListener("focusin", this.handleDocumentFocus);
            this.updateTrapFocus(false);
            if (this.cleanAutoUpdate) {
                this.cleanAutoUpdate();
            }
            this.targetEl = null;
            this.currentEl = null;
            this.arrowEl = null;
        }
        /**
         * @public
         * Method called when the 'open' attribute changes.
         */
        openChanged() {
            this.initializePosition();
            Updates.enqueue(() => {
                this.updateTrapFocus();
                this.disableTrapFocusHandler();
            });
            this.$emit("openchange", this.open);
        }
        /**
         * @private
         * Reduces the list of tabbable items
         * @param elements - The current list of elements
         * @param element - The element to consider adding to the list
         * @returns HTMLElement[]
         */
        static reduceTabbableItems(elements, element) {
            if (element.getAttribute("tabindex") === "-1") {
                return elements;
            }
            if (isTabbable(element) ||
                (TeachingBubble.isFocusableFastElement(element) &&
                    TeachingBubble.hasTabbableShadow(element))) {
                elements.push(element);
                return elements;
            }
            return Array.from(element.children).reduce((elements, currentElement) => TeachingBubble.reduceTabbableItems(elements, currentElement), elements);
        }
        /**
         * @private
         * Determines if an element is a focusable FASTElement
         * @param element - The element to check
         * @returns boolean
         */
        static isFocusableFastElement(element) {
            var _a, _b;
            return !!((_b = (_a = element.$fastController) === null || _a === void 0 ? void 0 : _a.definition.shadowOptions) === null || _b === void 0 ? void 0 : _b.delegatesFocus);
        }
        /**
         * @private
         * Determines if an element has a tabbable shadow
         * @param element - The element to check
         * @returns boolean
         */
        static hasTabbableShadow(element) {
            var _a, _b;
            return Array.from((_b = (_a = element.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll("*")) !== null && _b !== void 0 ? _b : []).some((x) => {
                return isTabbable(x);
            });
        }
        /**
         * @private
         * Method to check if attribute 'disable-trap-focus' is present or not.
         */
        disableTrapFocusHandler() {
            if (this.disableTrapFocus) {
                this.trapFocus = false;
            }
            else {
                this.trapFocus = true;
            }
        }
        /**
         * @private
         * Method to initialize the position of bubble.
         */
        initializePosition() {
            this.open && this.targetEl && this.currentEl && this.arrowEl && this.show();
            this.open || this.hide();
        }
    }
    __decorate([
        attr({ mode: "fromView" })
    ], TeachingBubble.prototype, "target", void 0);
    __decorate([
        attr({ mode: "fromView" })
    ], TeachingBubble.prototype, "placement", void 0);
    __decorate([
        attr({ mode: "boolean" })
    ], TeachingBubble.prototype, "open", void 0);
    __decorate([
        attr({ mode: "boolean", attribute: "disable-trap-focus" })
    ], TeachingBubble.prototype, "disableTrapFocus", void 0);
    __decorate([
        attr({ mode: "fromView" })
    ], TeachingBubble.prototype, "size", void 0);
    __decorate([
        observable
    ], TeachingBubble.prototype, "targetEl", void 0);
    __decorate([
        observable
    ], TeachingBubble.prototype, "currentEl", void 0);
    __decorate([
        observable
    ], TeachingBubble.prototype, "arrowEl", void 0);
    __decorate([
        observable
    ], TeachingBubble.prototype, "isTrappingFocus", void 0);
    __decorate([
        observable
    ], TeachingBubble.prototype, "trapFocus", void 0);
    __decorate([
        observable
    ], TeachingBubble.prototype, "cleanAutoUpdate", void 0);

    const styles$3 = css `
  :host {
    position: absolute;
    border: 1px solid ${colorBrandBackground};
    border-radius: ${borderRadiusMedium};
    background-color: ${colorBrandBackground};
    color: ${colorNeutralBackground1};
    padding: ${spacingHorizontalL};
    box-shadow: ${shadow16};
    max-width: 288px;
  }

  ::slotted(*) {
    font-family: ${fontFamilyBase};
    font-size: unset;
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase300};
    margin: 0;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  :host([size="small"]) ::slotted(*) {
    font-size: ${fontSizeBase200};
  }

  :host([size="medium"]) ::slotted(*) {
    font-size: ${fontSizeBase300};
  }

  :host([size="large"]) ::slotted(*) {
    font-size: ${fontSizeBase400};
  }

  :host[hidden] {
    ${display("none")}
  }

  slot[name="close"]::slotted(*) {
    position: absolute;
    top: 0;
    right: 0;
  }

  .content {
    position: relative;
  }

  .heading {
    margin-bottom: ${spacingHorizontalS};
  }

  .footer {
  }

  .arrow {
    position: absolute;
    background: ${colorBrandBackground};
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    border-radius: ${borderRadiusSmall};
  }

  slot[name="image"]::slotted(*) {
    display: block;
    margin-bottom: ${spacingHorizontalM};
    width: 100%;
    height: 100%;
  }

  slot[name="heading"]::slotted(*) {
    font-weight: ${fontWeightSemibold};
    line-height: ${lineHeightBase400};
  }

  :host([size="small"]) slot[name="heading"]::slotted(*) {
    font-size: ${fontSizeBase300};
  }

  :host([size="medium"]) slot[name="heading"]::slotted(*) {
    font-size: ${fontSizeBase400};
  }

  :host([size="large"]) slot[name="heading"]::slotted(*) {
    font-size: ${fontSizeBase500};
  }

  slot[name="footer"]::slotted(*) {
    line-height: ${lineHeightBase200};
    margin-top: ${spacingHorizontalM};
    padding-top: ${spacingHorizontalM};
  }
`;

    function teachingBubbleTemplate() {
        return html `
    <template
      size="${(x) => x.size}"
      target="${(x) => x.target}"
      ?hidden="${(x) => !x.open}"
      placement="${(x) => x.placement}"
      role="dialog"
      ?disable-trap-focus="${(x) => x.disableTrapFocus}"
    >
      <div class="image" part="image">
        <slot name="image"></slot>
      </div>
      <div class="content" part="content">
        <div class="close" part="close"><slot name="close"></slot></div>
        <div class="heading" part="heading">
          <slot name="heading"></slot>
        </div>
        <slot></slot>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
      <div id="arrow" class="arrow" part="arrow"></div>
    </template>
  `;
    }
    const template$3 = teachingBubbleTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-teaching-bubble>
     */
    const definition$3 = TeachingBubble.compose({
        name: `${DesignSystem.prefix}-teaching-bubble`,
        template: template$3,
        styles: styles$3,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode,
        },
    });

    /**
     * @public
     * The size variations for the teaching bubble component.
     */
    const TeachingBubbleSize = {
        small: "small",
        medium: "medium",
        large: "large"
    };
    const TeachingBubblePlacement = {
        top: "top",
        bottom: "bottom",
        left: "left",
        right: "right",
        topStart: "top-start",
        topEnd: "top-end",
        bottomStart: "bottom-start",
        bottomEnd: "bottom-end",
        leftStart: "left-start",
        leftEnd: "left-end",
        rightStart: "right-start",
        rightEnd: "right-end"
    };

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
    class WizardStep extends Step {
        /**
         * Handles the keydown event for the wizard step.
         * @param {KeyboardEvent} event - The keyboard event object.
         * @returns {void}
         */
        keydownHandler(event) {
            switch (event.key) {
                case keyEnter:
                    if (this.disabled) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                    else {
                        this.active !== this.active;
                    }
            }
        }
    }

    /** Wizard Step styles
     * @public
     */
    const styles$2 = css `
  ${styles$6}
  :host(:hover) {
    cursor: pointer;
  }
  :host([disabled]) {
    cursor: not-allowed;
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(WizardStep:class)} component.
     * @public
     */
    const template$2 = baseStepTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-wizard-step>
     */
    const definition$2 = WizardStep.compose({
        name: `${DesignSystem.prefix}-wizard-step`,
        template: template$2,
        styles: styles$2,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode
        }
    });

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
    class Wizard extends FASTElement {
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
                    StepState.error;
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
                    StepState.complete;
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
                    StepState.incomplete;
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
                    step.state = StepState.incomplete;
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

    /** Wizard styles
     * @public
     */
    const styles$1 = css `
  ${display("block")}

  :host {
    height: 100%;
    width: 100%;
    padding-top: 70px;
  }

  :host(.overflow) .steps {
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
  }

  .steps {
    background-color: ${colorNeutralBackground3};
    box-sizing: border-box;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 9;
    display: flex;
    flex-direction: row;
  }

  .wizard {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .title {
    color: ${colorNeutralForeground3};
  }

  .panels-container {
    background: ${colorNeutralBackground2};
  }

  .button-container {
    display: flex;
    gap: ${spacingHorizontalM};
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL} 0;
  }

  @media (min-width: 480px) {
    :host {
      padding-top: 0;
    }
    .panels-container {
      width: 100%;
    }
    .wizard {
      flex-direction: row;
    }
    :host(.overflow) .steps,
    .steps {
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
      position: relative;
      max-width: 70px;
    }
    .steps {
      flex-direction: column;
    }
    :host(.overflow) .steps {
      width: fit-content;
      justify-content: flex-start;
      align-items: center;
      overflow-x: unset;
      overflow-y: unset;
      width: 24px;
    }
  }

  @media (min-width: 1023px) {
    :host(.overflow) .steps,
    .steps {
      max-width: 268px;
      width: 268px;
      padding: ${spacingVerticalXXL} ${spacingHorizontalXXXL}
        ${spacingVerticalXXL} ${spacingHorizontalXXL};
    }
    :host(.overflow) .steps {
      width: fit-content;
    }
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(Stepper:class)} component.
     * @public
     */
    function wizardTemplate() {
        return html `
    <template
      ?hidden="${(x) => x.hidden}"
      ?ordered="${(x) => x.ordered}"
      current-index="${(x) => x.currentIndex}"
      aria-hidden="${(x) => (x.hidden ? "true" : "false")}"
    >
      <div class="wizard" part="wizard">
        ${startSlotTemplate({})}
        <div
          role="tablist"
          class="steps"
          part="steps"
          tabindex="0"
          @keydown="${(x, c) => x.handleStepContainerKeydown(c.event)}"
          ${ref("stepcontainer")}
        >
          <slot name="step" ${slotted("slottedsteps")}></slot>
        </div>
        <div
          class="panels-container"
          part="panels-container"
          ${ref("panelcontainer")}
        >
          <div class="toolbar" part="toolbar">
            <div class="title" part="title"><slot name="title"></slot></div>
            <div class="button-container" part="button-container">
              <slot name="button" ${slotted("slottedbuttons")}></slot>
            </div>
          </div>
          <div class="panels" part="panels">
            <slot name="panel" ${slotted("slottedpanels")}></slot>
          </div>
          ${endSlotTemplate({})}
        </div>
      </div>
    </template>
  `;
    }
    const template$1 = wizardTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-wizard>
     */
    const definition$1 = Wizard.compose({
        name: `${DesignSystem.prefix}-wizard`,
        template: template$1,
        styles: styles$1,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode
        }
    });

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
    class WizardPanel extends FASTElement {
        constructor() {
            super(...arguments);
            /**
             * Indicates whether the panel is hidden.
             * @public
             */
            this.hidden = true;
            /**
             * The state of the step.
             * @public
             */
            this.state = StepState.incomplete;
            /**
             * Indicates whether the step is active.
             * @public
             */
            this.active = false;
        }
        /**
         * Handles the change in the state of the step.
         * @public
         */
        stateChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
                this.emitChange();
            }
        }
        /**
         * Called when the `active` property changes.
         * @public
         */
        activeChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
                if (newValue) {
                    this.show();
                }
                else {
                    this.hide();
                }
                this.emitChange();
            }
        }
        /**
         * Called when the `hidden` property changes.
         * @public
         */
        hiddenChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
                this.emitChange();
            }
        }
        /**
         * Shows the wizard panel.
         * @public
         */
        show() {
            this.hidden = false;
        }
        /**
         * Hides the wizard panel.
         * @public
         */
        hide() {
            this.hidden = true;
        }
        /**
         * Emits a panelChange event with the current panel's details.
         * @public
         */
        emitChange() {
            this.$emit("panelchange", {
                id: this.id,
                state: this.state,
                active: this.active,
                index: this.index
            });
        }
    }
    __decorate([
        observable
    ], WizardPanel.prototype, "index", void 0);
    __decorate([
        attr({ mode: "boolean" })
    ], WizardPanel.prototype, "hidden", void 0);
    __decorate([
        attr
    ], WizardPanel.prototype, "state", void 0);
    __decorate([
        attr({ mode: "boolean" })
    ], WizardPanel.prototype, "active", void 0);

    /** Wizard Panel styles
     * @public
     */
    const styles = css `
  ${display("block")}
  :host {
    height: 100%;
    background: ${colorNeutralBackground2};
  }

  :host([active]) {
    display: block;
  }

  .content {
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL} 0;
  }

  .title {
    padding: 0 ${spacingHorizontalXXL} ${spacingVerticalXS};
    color: ${colorNeutralForeground1};
  }
  .footer {
    padding: ${spacingVerticalL} ${spacingHorizontalXXL};
    border-top: 1px solid ${colorNeutralStroke1};
  }
`;

    /**
     * The template for the {@link @horizon-msft/web-components#(WizardPanel:class)} component.
     * @public
     */
    function wizardPanelTemplate() {
        return html `
    <template
      aria-hidden="${(x) => x.hidden}"
      state="${(x) => x.state}"
      ?active="${(x) => x.active}"
    >
      <slot name="start"></slot>
      <div class="title" part="title">
        <slot name="title"></slot>
      </div>
      <div class="content" part="content"><slot></slot></div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
      <slot name="end"></slot>
    </template>
  `;
    }
    const template = wizardPanelTemplate();

    /**
     *
     * @public
     * @remarks
     * HTML Element: <hwc-wizard-panel>
     */
    const definition = WizardPanel.compose({
        name: `${DesignSystem.prefix}-wizard-panel`,
        template,
        styles,
        shadowOptions: {
            mode: DesignSystem.shadowRootMode
        }
    });

    exports.HelloWorld = HelloWorld;
    exports.HelloWorldDefinition = HelloWorldDefinition;
    exports.MultiView = MultiView;
    exports.MultiViewController = MultiViewController;
    exports.MultiViewControllerDefinition = definition$7;
    exports.MultiViewDefinition = definition$8;
    exports.MultiViewGroup = MultiViewGroup;
    exports.MultiViewGroupDefinition = definition$6;
    exports.Step = Step;
    exports.StepDefinition = definition$5;
    exports.StepState = StepState;
    exports.Stepper = Stepper;
    exports.StepperDefinition = definition$4;
    exports.SvgIcon = SvgIcon;
    exports.SvgIconDefinition = SvgIconDefinition;
    exports.TeachingBubble = TeachingBubble;
    exports.TeachingBubbleDefinition = definition$3;
    exports.TeachingBubblePlacement = TeachingBubblePlacement;
    exports.TeachingBubbleSize = TeachingBubbleSize;
    exports.Wizard = Wizard;
    exports.WizardDefinition = definition$1;
    exports.WizardPanel = WizardPanel;
    exports.WizardPanelDefinition = definition;
    exports.WizardStep = WizardStep;
    exports.WizardStepDefinition = definition$2;
    exports.WizardStepState = StepState;
    exports.multiViewControllerStyles = styles$8;
    exports.multiViewControllerTemplate = template$8;
    exports.multiViewGroupStyles = styles$7;
    exports.multiViewGroupTemplate = template$7;
    exports.multiViewStyles = styles$9;
    exports.multiViewTemplate = template$9;
    exports.stepStyles = styles$6;
    exports.stepTemplate = template$6;
    exports.stepperStyles = styles$5;
    exports.stepperTemplate = template$5;
    exports.styles = styles$2;
    exports.svgIconStyles = styles$4;
    exports.svgIconTemplate = template$4;
    exports.teachingBubbleStyles = styles$3;
    exports.teachingBubbleTemplate = template$3;
    exports.template = template$2;
    exports.textStyles = styles$a;
    exports.textTemplate = template$a;
    exports.wizardPanelStyles = styles;
    exports.wizardPanelTemplate = template;
    exports.wizardStyles = styles$1;
    exports.wizardTemplate = template$1;

}));
