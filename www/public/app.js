"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __commonJS = (cb, mod) =>
    function __require() {
      return (
        mod ||
          (0, cb[__getOwnPropNames(cb)[0]])(
            (mod = { exports: {} }).exports,
            mod
          ),
        mod.exports
      );
    };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable:
              !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (
    (target = mod != null ? __create(__getProtoOf(mod)) : {}),
    __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule
        ? __defProp(target, "default", { value: mod, enumerable: true })
        : target,
      mod
    )
  );
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "../node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      if (true) {
        (function () {
          "use strict";
          if (
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" &&
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
              "function"
          ) {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(
              new Error()
            );
          }
          var ReactVersion = "18.2.0";
          var REACT_ELEMENT_TYPE = Symbol.for("react.element");
          var REACT_PORTAL_TYPE = Symbol.for("react.portal");
          var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
          var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
          var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
          var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
          var REACT_CONTEXT_TYPE = Symbol.for("react.context");
          var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
          var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
          var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
          var REACT_MEMO_TYPE = Symbol.for("react.memo");
          var REACT_LAZY_TYPE = Symbol.for("react.lazy");
          var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
          var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = "@@iterator";
          function getIteratorFn(maybeIterable) {
            if (maybeIterable === null || typeof maybeIterable !== "object") {
              return null;
            }
            var maybeIterator =
              (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
              maybeIterable[FAUX_ITERATOR_SYMBOL];
            if (typeof maybeIterator === "function") {
              return maybeIterator;
            }
            return null;
          }
          var ReactCurrentDispatcher = {
            /**
             * @type {ReactComponent}
             * @internal
             */
            current: null,
          };
          var ReactCurrentBatchConfig = {
            transition: null,
          };
          var ReactCurrentActQueue = {
            current: null,
            // Used to reproduce behavior of `batchedUpdates` in legacy mode.
            isBatchingLegacy: false,
            didScheduleLegacyUpdate: false,
          };
          var ReactCurrentOwner = {
            /**
             * @type {ReactComponent}
             * @internal
             */
            current: null,
          };
          var ReactDebugCurrentFrame = {};
          var currentExtraStackFrame = null;
          function setExtraStackFrame(stack) {
            {
              currentExtraStackFrame = stack;
            }
          }
          {
            ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
              {
                currentExtraStackFrame = stack;
              }
            };
            ReactDebugCurrentFrame.getCurrentStack = null;
            ReactDebugCurrentFrame.getStackAddendum = function () {
              var stack = "";
              if (currentExtraStackFrame) {
                stack += currentExtraStackFrame;
              }
              var impl = ReactDebugCurrentFrame.getCurrentStack;
              if (impl) {
                stack += impl() || "";
              }
              return stack;
            };
          }
          var enableScopeAPI = false;
          var enableCacheElement = false;
          var enableTransitionTracing = false;
          var enableLegacyHidden = false;
          var enableDebugTracing = false;
          var ReactSharedInternals = {
            ReactCurrentDispatcher,
            ReactCurrentBatchConfig,
            ReactCurrentOwner,
          };
          {
            ReactSharedInternals.ReactDebugCurrentFrame =
              ReactDebugCurrentFrame;
            ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
          }
          function warn(format) {
            {
              {
                for (
                  var _len = arguments.length,
                    args = new Array(_len > 1 ? _len - 1 : 0),
                    _key = 1;
                  _key < _len;
                  _key++
                ) {
                  args[_key - 1] = arguments[_key];
                }
                printWarning("warn", format, args);
              }
            }
          }
          function error(format) {
            {
              {
                for (
                  var _len2 = arguments.length,
                    args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                    _key2 = 1;
                  _key2 < _len2;
                  _key2++
                ) {
                  args[_key2 - 1] = arguments[_key2];
                }
                printWarning("error", format, args);
              }
            }
          }
          function printWarning(level, format, args) {
            {
              var ReactDebugCurrentFrame2 =
                ReactSharedInternals.ReactDebugCurrentFrame;
              var stack = ReactDebugCurrentFrame2.getStackAddendum();
              if (stack !== "") {
                format += "%s";
                args = args.concat([stack]);
              }
              var argsWithFormat = args.map(function (item) {
                return String(item);
              });
              argsWithFormat.unshift("Warning: " + format);
              Function.prototype.apply.call(
                console[level],
                console,
                argsWithFormat
              );
            }
          }
          var didWarnStateUpdateForUnmountedComponent = {};
          function warnNoop(publicInstance, callerName) {
            {
              var _constructor = publicInstance.constructor;
              var componentName =
                (_constructor &&
                  (_constructor.displayName || _constructor.name)) ||
                "ReactClass";
              var warningKey = componentName + "." + callerName;
              if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
                return;
              }
              error(
                "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
                callerName,
                componentName
              );
              didWarnStateUpdateForUnmountedComponent[warningKey] = true;
            }
          }
          var ReactNoopUpdateQueue = {
            /**
             * Checks whether or not this composite component is mounted.
             *
             * @param {ReactClass} publicInstance The instance we want to test.
             * @returns {boolean} True if mounted, false otherwise.
             * @protected
             * @final
             */
            isMounted: function (publicInstance) {
              return false;
            },
            /**
             * Forces an update. This should only be invoked when it is known
             * with certainty that we are **not** in a DOM transaction.
             *
             * You may want to call this when you know that some deeper aspect
             * of the component's state has changed but `setState` was not
             * called.
             *
             * This will not invoke `shouldComponentUpdate`, but it will invoke
             * `componentWillUpdate` and `componentDidUpdate`.
             *
             * @param {ReactClass} publicInstance The instance that should
             *   rerender.
             * @param {function | null} callback Called after component is
             *   updated.
             * @param {string | null} callerName Name of the calling function in
             *   the public API.
             * @internal
             */
            enqueueForceUpdate: function (
              publicInstance,
              callback,
              callerName
            ) {
              warnNoop(publicInstance, "forceUpdate");
            },
            /**
             * Replaces all of the state. Always use this or `setState` to
             * mutate state. You should treat `this.state` as immutable.
             *
             * There is no guarantee that `this.state` will be immediately
             * updated, so accessing `this.state` after calling this method may
             * return the old value.
             *
             * @param {ReactClass} publicInstance The instance that should
             *   rerender.
             * @param {object} completeState Next state.
             * @param {function | null} callback Called after component is
             *   updated.
             * @param {string | null} callerName Name of the calling function in
             *   the public API.
             * @internal
             */
            enqueueReplaceState: function (
              publicInstance,
              completeState,
              callback,
              callerName
            ) {
              warnNoop(publicInstance, "replaceState");
            },
            /**
             * Sets a subset of the state. This only exists because
             * _pendingState is internal. This provides a merging strategy that
             * is not available to deep properties which is confusing. TODO:
             * Expose pendingState or don't use it during the merge.
             *
             * @param {ReactClass} publicInstance The instance that should
             *   rerender.
             * @param {object} partialState Next partial state to be merged with
             *   state.
             * @param {function | null} callback Called after component is
             *   updated.
             * @param {string | null} Name Of the calling function in the public
             *   API.
             * @internal
             */
            enqueueSetState: function (
              publicInstance,
              partialState,
              callback,
              callerName
            ) {
              warnNoop(publicInstance, "setState");
            },
          };
          var assign = Object.assign;
          var emptyObject = {};
          {
            Object.freeze(emptyObject);
          }
          function Component(props, context, updater) {
            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;
          }
          Component.prototype.isReactComponent = {};
          Component.prototype.setState = function (partialState, callback) {
            if (
              typeof partialState !== "object" &&
              typeof partialState !== "function" &&
              partialState != null
            ) {
              throw new Error(
                "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
              );
            }
            this.updater.enqueueSetState(
              this,
              partialState,
              callback,
              "setState"
            );
          };
          Component.prototype.forceUpdate = function (callback) {
            this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
          };
          {
            var deprecatedAPIs = {
              isMounted: [
                "isMounted",
                "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.",
              ],
              replaceState: [
                "replaceState",
                "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236).",
              ],
            };
            var defineDeprecationWarning = function (methodName, info) {
              Object.defineProperty(Component.prototype, methodName, {
                get: function () {
                  warn(
                    "%s(...) is deprecated in plain JavaScript React classes. %s",
                    info[0],
                    info[1]
                  );
                  return void 0;
                },
              });
            };
            for (var fnName in deprecatedAPIs) {
              if (deprecatedAPIs.hasOwnProperty(fnName)) {
                defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
              }
            }
          }
          function ComponentDummy() {}
          ComponentDummy.prototype = Component.prototype;
          function PureComponent(props, context, updater) {
            this.props = props;
            this.context = context;
            this.refs = emptyObject;
            this.updater = updater || ReactNoopUpdateQueue;
          }
          var pureComponentPrototype = (PureComponent.prototype =
            new ComponentDummy());
          pureComponentPrototype.constructor = PureComponent;
          assign(pureComponentPrototype, Component.prototype);
          pureComponentPrototype.isPureReactComponent = true;
          function createRef() {
            var refObject = {
              current: null,
            };
            {
              Object.seal(refObject);
            }
            return refObject;
          }
          var isArrayImpl = Array.isArray;
          function isArray(a) {
            return isArrayImpl(a);
          }
          function typeName(value) {
            {
              var hasToStringTag =
                typeof Symbol === "function" && Symbol.toStringTag;
              var type =
                (hasToStringTag && value[Symbol.toStringTag]) ||
                value.constructor.name ||
                "Object";
              return type;
            }
          }
          function willCoercionThrow(value) {
            {
              try {
                testStringCoercion(value);
                return false;
              } catch (e) {
                return true;
              }
            }
          }
          function testStringCoercion(value) {
            return "" + value;
          }
          function checkKeyStringCoercion(value) {
            {
              if (willCoercionThrow(value)) {
                error(
                  "The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.",
                  typeName(value)
                );
                return testStringCoercion(value);
              }
            }
          }
          function getWrappedName(outerType, innerType, wrapperName) {
            var displayName = outerType.displayName;
            if (displayName) {
              return displayName;
            }
            var functionName = innerType.displayName || innerType.name || "";
            return functionName !== ""
              ? wrapperName + "(" + functionName + ")"
              : wrapperName;
          }
          function getContextName(type) {
            return type.displayName || "Context";
          }
          function getComponentNameFromType(type) {
            if (type == null) {
              return null;
            }
            {
              if (typeof type.tag === "number") {
                error(
                  "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
                );
              }
            }
            if (typeof type === "function") {
              return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
              return type;
            }
            switch (type) {
              case REACT_FRAGMENT_TYPE:
                return "Fragment";
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_PROFILER_TYPE:
                return "Profiler";
              case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
              case REACT_SUSPENSE_TYPE:
                return "Suspense";
              case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  var context = type;
                  return getContextName(context) + ".Consumer";
                case REACT_PROVIDER_TYPE:
                  var provider = type;
                  return getContextName(provider._context) + ".Provider";
                case REACT_FORWARD_REF_TYPE:
                  return getWrappedName(type, type.render, "ForwardRef");
                case REACT_MEMO_TYPE:
                  var outerName = type.displayName || null;
                  if (outerName !== null) {
                    return outerName;
                  }
                  return getComponentNameFromType(type.type) || "Memo";
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return getComponentNameFromType(init(payload));
                  } catch (x) {
                    return null;
                  }
                }
              }
            }
            return null;
          }
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var RESERVED_PROPS = {
            key: true,
            ref: true,
            __self: true,
            __source: true,
          };
          var specialPropKeyWarningShown,
            specialPropRefWarningShown,
            didWarnAboutStringRefs;
          {
            didWarnAboutStringRefs = {};
          }
          function hasValidRef(config) {
            {
              if (hasOwnProperty.call(config, "ref")) {
                var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.ref !== void 0;
          }
          function hasValidKey(config) {
            {
              if (hasOwnProperty.call(config, "key")) {
                var getter = Object.getOwnPropertyDescriptor(config, "key").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.key !== void 0;
          }
          function defineKeyPropWarningGetter(props, displayName) {
            var warnAboutAccessingKey = function () {
              {
                if (!specialPropKeyWarningShown) {
                  specialPropKeyWarningShown = true;
                  error(
                    "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    displayName
                  );
                }
              }
            };
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true,
            });
          }
          function defineRefPropWarningGetter(props, displayName) {
            var warnAboutAccessingRef = function () {
              {
                if (!specialPropRefWarningShown) {
                  specialPropRefWarningShown = true;
                  error(
                    "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    displayName
                  );
                }
              }
            };
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true,
            });
          }
          function warnIfStringRefCannotBeAutoConverted(config) {
            {
              if (
                typeof config.ref === "string" &&
                ReactCurrentOwner.current &&
                config.__self &&
                ReactCurrentOwner.current.stateNode !== config.__self
              ) {
                var componentName = getComponentNameFromType(
                  ReactCurrentOwner.current.type
                );
                if (!didWarnAboutStringRefs[componentName]) {
                  error(
                    'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                    componentName,
                    config.ref
                  );
                  didWarnAboutStringRefs[componentName] = true;
                }
              }
            }
          }
          var ReactElement = function (
            type,
            key,
            ref,
            self,
            source,
            owner,
            props
          ) {
            var element = {
              // This tag allows us to uniquely identify this as a React Element
              $$typeof: REACT_ELEMENT_TYPE,
              // Built-in properties that belong on the element
              type,
              key,
              ref,
              props,
              // Record the component responsible for creating this element.
              _owner: owner,
            };
            {
              element._store = {};
              Object.defineProperty(element._store, "validated", {
                configurable: false,
                enumerable: false,
                writable: true,
                value: false,
              });
              Object.defineProperty(element, "_self", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: self,
              });
              Object.defineProperty(element, "_source", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: source,
              });
              if (Object.freeze) {
                Object.freeze(element.props);
                Object.freeze(element);
              }
            }
            return element;
          };
          function createElement(type, config, children) {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            var self = null;
            var source = null;
            if (config != null) {
              if (hasValidRef(config)) {
                ref = config.ref;
                {
                  warnIfStringRefCannotBeAutoConverted(config);
                }
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              self = config.__self === void 0 ? null : config.__self;
              source = config.__source === void 0 ? null : config.__source;
              for (propName in config) {
                if (
                  hasOwnProperty.call(config, propName) &&
                  !RESERVED_PROPS.hasOwnProperty(propName)
                ) {
                  props[propName] = config[propName];
                }
              }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength === 1) {
              props.children = children;
            } else if (childrenLength > 1) {
              var childArray = Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
              {
                if (Object.freeze) {
                  Object.freeze(childArray);
                }
              }
              props.children = childArray;
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            {
              if (key || ref) {
                var displayName =
                  typeof type === "function"
                    ? type.displayName || type.name || "Unknown"
                    : type;
                if (key) {
                  defineKeyPropWarningGetter(props, displayName);
                }
                if (ref) {
                  defineRefPropWarningGetter(props, displayName);
                }
              }
            }
            return ReactElement(
              type,
              key,
              ref,
              self,
              source,
              ReactCurrentOwner.current,
              props
            );
          }
          function cloneAndReplaceKey(oldElement, newKey) {
            var newElement = ReactElement(
              oldElement.type,
              newKey,
              oldElement.ref,
              oldElement._self,
              oldElement._source,
              oldElement._owner,
              oldElement.props
            );
            return newElement;
          }
          function cloneElement(element, config, children) {
            if (element === null || element === void 0) {
              throw new Error(
                "React.cloneElement(...): The argument must be a React element, but you passed " +
                  element +
                  "."
              );
            }
            var propName;
            var props = assign({}, element.props);
            var key = element.key;
            var ref = element.ref;
            var self = element._self;
            var source = element._source;
            var owner = element._owner;
            if (config != null) {
              if (hasValidRef(config)) {
                ref = config.ref;
                owner = ReactCurrentOwner.current;
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              var defaultProps;
              if (element.type && element.type.defaultProps) {
                defaultProps = element.type.defaultProps;
              }
              for (propName in config) {
                if (
                  hasOwnProperty.call(config, propName) &&
                  !RESERVED_PROPS.hasOwnProperty(propName)
                ) {
                  if (config[propName] === void 0 && defaultProps !== void 0) {
                    props[propName] = defaultProps[propName];
                  } else {
                    props[propName] = config[propName];
                  }
                }
              }
            }
            var childrenLength = arguments.length - 2;
            if (childrenLength === 1) {
              props.children = children;
            } else if (childrenLength > 1) {
              var childArray = Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
              props.children = childArray;
            }
            return ReactElement(
              element.type,
              key,
              ref,
              self,
              source,
              owner,
              props
            );
          }
          function isValidElement(object) {
            return (
              typeof object === "object" &&
              object !== null &&
              object.$$typeof === REACT_ELEMENT_TYPE
            );
          }
          var SEPARATOR = ".";
          var SUBSEPARATOR = ":";
          function escape(key) {
            var escapeRegex = /[=:]/g;
            var escaperLookup = {
              "=": "=0",
              ":": "=2",
            };
            var escapedString = key.replace(escapeRegex, function (match) {
              return escaperLookup[match];
            });
            return "$" + escapedString;
          }
          var didWarnAboutMaps = false;
          var userProvidedKeyEscapeRegex = /\/+/g;
          function escapeUserProvidedKey(text) {
            return text.replace(userProvidedKeyEscapeRegex, "$&/");
          }
          function getElementKey(element, index) {
            if (
              typeof element === "object" &&
              element !== null &&
              element.key != null
            ) {
              {
                checkKeyStringCoercion(element.key);
              }
              return escape("" + element.key);
            }
            return index.toString(36);
          }
          function mapIntoArray(
            children,
            array,
            escapedPrefix,
            nameSoFar,
            callback
          ) {
            var type = typeof children;
            if (type === "undefined" || type === "boolean") {
              children = null;
            }
            var invokeCallback = false;
            if (children === null) {
              invokeCallback = true;
            } else {
              switch (type) {
                case "string":
                case "number":
                  invokeCallback = true;
                  break;
                case "object":
                  switch (children.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                      invokeCallback = true;
                  }
              }
            }
            if (invokeCallback) {
              var _child = children;
              var mappedChild = callback(_child);
              var childKey =
                nameSoFar === ""
                  ? SEPARATOR + getElementKey(_child, 0)
                  : nameSoFar;
              if (isArray(mappedChild)) {
                var escapedChildKey = "";
                if (childKey != null) {
                  escapedChildKey = escapeUserProvidedKey(childKey) + "/";
                }
                mapIntoArray(
                  mappedChild,
                  array,
                  escapedChildKey,
                  "",
                  function (c) {
                    return c;
                  }
                );
              } else if (mappedChild != null) {
                if (isValidElement(mappedChild)) {
                  {
                    if (
                      mappedChild.key &&
                      (!_child || _child.key !== mappedChild.key)
                    ) {
                      checkKeyStringCoercion(mappedChild.key);
                    }
                  }
                  mappedChild = cloneAndReplaceKey(
                    mappedChild,
                    // Keep both the (mapped) and old keys if they differ, just as
                    // traverseAllChildren used to do for objects as children
                    escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                      (mappedChild.key &&
                      (!_child || _child.key !== mappedChild.key)
                        ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                          // eslint-disable-next-line react-internal/safe-string-coercion
                          escapeUserProvidedKey("" + mappedChild.key) + "/"
                        : "") +
                      childKey
                  );
                }
                array.push(mappedChild);
              }
              return 1;
            }
            var child;
            var nextName;
            var subtreeCount = 0;
            var nextNamePrefix =
              nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
            if (isArray(children)) {
              for (var i = 0; i < children.length; i++) {
                child = children[i];
                nextName = nextNamePrefix + getElementKey(child, i);
                subtreeCount += mapIntoArray(
                  child,
                  array,
                  escapedPrefix,
                  nextName,
                  callback
                );
              }
            } else {
              var iteratorFn = getIteratorFn(children);
              if (typeof iteratorFn === "function") {
                var iterableChildren = children;
                {
                  if (iteratorFn === iterableChildren.entries) {
                    if (!didWarnAboutMaps) {
                      warn(
                        "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
                      );
                    }
                    didWarnAboutMaps = true;
                  }
                }
                var iterator = iteratorFn.call(iterableChildren);
                var step;
                var ii = 0;
                while (!(step = iterator.next()).done) {
                  child = step.value;
                  nextName = nextNamePrefix + getElementKey(child, ii++);
                  subtreeCount += mapIntoArray(
                    child,
                    array,
                    escapedPrefix,
                    nextName,
                    callback
                  );
                }
              } else if (type === "object") {
                var childrenString = String(children);
                throw new Error(
                  "Objects are not valid as a React child (found: " +
                    (childrenString === "[object Object]"
                      ? "object with keys {" +
                        Object.keys(children).join(", ") +
                        "}"
                      : childrenString) +
                    "). If you meant to render a collection of children, use an array instead."
                );
              }
            }
            return subtreeCount;
          }
          function mapChildren(children, func, context) {
            if (children == null) {
              return children;
            }
            var result = [];
            var count = 0;
            mapIntoArray(children, result, "", "", function (child) {
              return func.call(context, child, count++);
            });
            return result;
          }
          function countChildren(children) {
            var n = 0;
            mapChildren(children, function () {
              n++;
            });
            return n;
          }
          function forEachChildren(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function () {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          }
          function toArray(children) {
            return (
              mapChildren(children, function (child) {
                return child;
              }) || []
            );
          }
          function onlyChild(children) {
            if (!isValidElement(children)) {
              throw new Error(
                "React.Children.only expected to receive a single React element child."
              );
            }
            return children;
          }
          function createContext(defaultValue) {
            var context = {
              $$typeof: REACT_CONTEXT_TYPE,
              // As a workaround to support multiple concurrent renderers, we categorize
              // some renderers as primary and others as secondary. We only expect
              // there to be two concurrent renderers at most: React Native (primary) and
              // Fabric (secondary); React DOM (primary) and React ART (secondary).
              // Secondary renderers store their context values on separate fields.
              _currentValue: defaultValue,
              _currentValue2: defaultValue,
              // Used to track how many concurrent renderers this context currently
              // supports within in a single renderer. Such as parallel server rendering.
              _threadCount: 0,
              // These are circular
              Provider: null,
              Consumer: null,
              // Add these to use same hidden class in VM as ServerContext
              _defaultValue: null,
              _globalName: null,
            };
            context.Provider = {
              $$typeof: REACT_PROVIDER_TYPE,
              _context: context,
            };
            var hasWarnedAboutUsingNestedContextConsumers = false;
            var hasWarnedAboutUsingConsumerProvider = false;
            var hasWarnedAboutDisplayNameOnConsumer = false;
            {
              var Consumer = {
                $$typeof: REACT_CONTEXT_TYPE,
                _context: context,
              };
              Object.defineProperties(Consumer, {
                Provider: {
                  get: function () {
                    if (!hasWarnedAboutUsingConsumerProvider) {
                      hasWarnedAboutUsingConsumerProvider = true;
                      error(
                        "Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?"
                      );
                    }
                    return context.Provider;
                  },
                  set: function (_Provider) {
                    context.Provider = _Provider;
                  },
                },
                _currentValue: {
                  get: function () {
                    return context._currentValue;
                  },
                  set: function (_currentValue) {
                    context._currentValue = _currentValue;
                  },
                },
                _currentValue2: {
                  get: function () {
                    return context._currentValue2;
                  },
                  set: function (_currentValue2) {
                    context._currentValue2 = _currentValue2;
                  },
                },
                _threadCount: {
                  get: function () {
                    return context._threadCount;
                  },
                  set: function (_threadCount) {
                    context._threadCount = _threadCount;
                  },
                },
                Consumer: {
                  get: function () {
                    if (!hasWarnedAboutUsingNestedContextConsumers) {
                      hasWarnedAboutUsingNestedContextConsumers = true;
                      error(
                        "Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"
                      );
                    }
                    return context.Consumer;
                  },
                },
                displayName: {
                  get: function () {
                    return context.displayName;
                  },
                  set: function (displayName) {
                    if (!hasWarnedAboutDisplayNameOnConsumer) {
                      warn(
                        "Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.",
                        displayName
                      );
                      hasWarnedAboutDisplayNameOnConsumer = true;
                    }
                  },
                },
              });
              context.Consumer = Consumer;
            }
            {
              context._currentRenderer = null;
              context._currentRenderer2 = null;
            }
            return context;
          }
          var Uninitialized = -1;
          var Pending = 0;
          var Resolved = 1;
          var Rejected = 2;
          function lazyInitializer(payload) {
            if (payload._status === Uninitialized) {
              var ctor = payload._result;
              var thenable = ctor();
              thenable.then(
                function (moduleObject2) {
                  if (
                    payload._status === Pending ||
                    payload._status === Uninitialized
                  ) {
                    var resolved = payload;
                    resolved._status = Resolved;
                    resolved._result = moduleObject2;
                  }
                },
                function (error2) {
                  if (
                    payload._status === Pending ||
                    payload._status === Uninitialized
                  ) {
                    var rejected = payload;
                    rejected._status = Rejected;
                    rejected._result = error2;
                  }
                }
              );
              if (payload._status === Uninitialized) {
                var pending = payload;
                pending._status = Pending;
                pending._result = thenable;
              }
            }
            if (payload._status === Resolved) {
              var moduleObject = payload._result;
              {
                if (moduleObject === void 0) {
                  error(
                    "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
                    moduleObject
                  );
                }
              }
              {
                if (!("default" in moduleObject)) {
                  error(
                    "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
                    moduleObject
                  );
                }
              }
              return moduleObject.default;
            } else {
              throw payload._result;
            }
          }
          function lazy(ctor) {
            var payload = {
              // We use these fields to store the result.
              _status: Uninitialized,
              _result: ctor,
            };
            var lazyType = {
              $$typeof: REACT_LAZY_TYPE,
              _payload: payload,
              _init: lazyInitializer,
            };
            {
              var defaultProps;
              var propTypes;
              Object.defineProperties(lazyType, {
                defaultProps: {
                  configurable: true,
                  get: function () {
                    return defaultProps;
                  },
                  set: function (newDefaultProps) {
                    error(
                      "React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."
                    );
                    defaultProps = newDefaultProps;
                    Object.defineProperty(lazyType, "defaultProps", {
                      enumerable: true,
                    });
                  },
                },
                propTypes: {
                  configurable: true,
                  get: function () {
                    return propTypes;
                  },
                  set: function (newPropTypes) {
                    error(
                      "React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."
                    );
                    propTypes = newPropTypes;
                    Object.defineProperty(lazyType, "propTypes", {
                      enumerable: true,
                    });
                  },
                },
              });
            }
            return lazyType;
          }
          function forwardRef(render) {
            {
              if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
                error(
                  "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
                );
              } else if (typeof render !== "function") {
                error(
                  "forwardRef requires a render function but was given %s.",
                  render === null ? "null" : typeof render
                );
              } else {
                if (render.length !== 0 && render.length !== 2) {
                  error(
                    "forwardRef render functions accept exactly two parameters: props and ref. %s",
                    render.length === 1
                      ? "Did you forget to use the ref parameter?"
                      : "Any additional parameter will be undefined."
                  );
                }
              }
              if (render != null) {
                if (render.defaultProps != null || render.propTypes != null) {
                  error(
                    "forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?"
                  );
                }
              }
            }
            var elementType = {
              $$typeof: REACT_FORWARD_REF_TYPE,
              render,
            };
            {
              var ownName;
              Object.defineProperty(elementType, "displayName", {
                enumerable: false,
                configurable: true,
                get: function () {
                  return ownName;
                },
                set: function (name) {
                  ownName = name;
                  if (!render.name && !render.displayName) {
                    render.displayName = name;
                  }
                },
              });
            }
            return elementType;
          }
          var REACT_MODULE_REFERENCE;
          {
            REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
          }
          function isValidElementType(type) {
            if (typeof type === "string" || typeof type === "function") {
              return true;
            }
            if (
              type === REACT_FRAGMENT_TYPE ||
              type === REACT_PROFILER_TYPE ||
              enableDebugTracing ||
              type === REACT_STRICT_MODE_TYPE ||
              type === REACT_SUSPENSE_TYPE ||
              type === REACT_SUSPENSE_LIST_TYPE ||
              enableLegacyHidden ||
              type === REACT_OFFSCREEN_TYPE ||
              enableScopeAPI ||
              enableCacheElement ||
              enableTransitionTracing
            ) {
              return true;
            }
            if (typeof type === "object" && type !== null) {
              if (
                type.$$typeof === REACT_LAZY_TYPE ||
                type.$$typeof === REACT_MEMO_TYPE ||
                type.$$typeof === REACT_PROVIDER_TYPE ||
                type.$$typeof === REACT_CONTEXT_TYPE ||
                type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
                // types supported by any Flight configuration anywhere since
                // we don't know which Flight build this will end up being used
                // with.
                type.$$typeof === REACT_MODULE_REFERENCE ||
                type.getModuleId !== void 0
              ) {
                return true;
              }
            }
            return false;
          }
          function memo(type, compare) {
            {
              if (!isValidElementType(type)) {
                error(
                  "memo: The first argument must be a component. Instead received: %s",
                  type === null ? "null" : typeof type
                );
              }
            }
            var elementType = {
              $$typeof: REACT_MEMO_TYPE,
              type,
              compare: compare === void 0 ? null : compare,
            };
            {
              var ownName;
              Object.defineProperty(elementType, "displayName", {
                enumerable: false,
                configurable: true,
                get: function () {
                  return ownName;
                },
                set: function (name) {
                  ownName = name;
                  if (!type.name && !type.displayName) {
                    type.displayName = name;
                  }
                },
              });
            }
            return elementType;
          }
          function resolveDispatcher() {
            var dispatcher = ReactCurrentDispatcher.current;
            {
              if (dispatcher === null) {
                error(
                  "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem."
                );
              }
            }
            return dispatcher;
          }
          function useContext(Context) {
            var dispatcher = resolveDispatcher();
            {
              if (Context._context !== void 0) {
                var realContext = Context._context;
                if (realContext.Consumer === Context) {
                  error(
                    "Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?"
                  );
                } else if (realContext.Provider === Context) {
                  error(
                    "Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?"
                  );
                }
              }
            }
            return dispatcher.useContext(Context);
          }
          function useState7(initialState) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useState(initialState);
          }
          function useReducer(reducer, initialArg, init) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useReducer(reducer, initialArg, init);
          }
          function useRef(initialValue) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useRef(initialValue);
          }
          function useEffect6(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useEffect(create, deps);
          }
          function useInsertionEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useInsertionEffect(create, deps);
          }
          function useLayoutEffect(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useLayoutEffect(create, deps);
          }
          function useCallback5(callback, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useCallback(callback, deps);
          }
          function useMemo2(create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useMemo(create, deps);
          }
          function useImperativeHandle(ref, create, deps) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useImperativeHandle(ref, create, deps);
          }
          function useDebugValue(value, formatterFn) {
            {
              var dispatcher = resolveDispatcher();
              return dispatcher.useDebugValue(value, formatterFn);
            }
          }
          function useTransition() {
            var dispatcher = resolveDispatcher();
            return dispatcher.useTransition();
          }
          function useDeferredValue(value) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDeferredValue(value);
          }
          function useId4() {
            var dispatcher = resolveDispatcher();
            return dispatcher.useId();
          }
          function useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          ) {
            var dispatcher = resolveDispatcher();
            return dispatcher.useSyncExternalStore(
              subscribe,
              getSnapshot,
              getServerSnapshot
            );
          }
          var disabledDepth = 0;
          var prevLog;
          var prevInfo;
          var prevWarn;
          var prevError;
          var prevGroup;
          var prevGroupCollapsed;
          var prevGroupEnd;
          function disabledLog() {}
          disabledLog.__reactDisabledLog = true;
          function disableLogs() {
            {
              if (disabledDepth === 0) {
                prevLog = console.log;
                prevInfo = console.info;
                prevWarn = console.warn;
                prevError = console.error;
                prevGroup = console.group;
                prevGroupCollapsed = console.groupCollapsed;
                prevGroupEnd = console.groupEnd;
                var props = {
                  configurable: true,
                  enumerable: true,
                  value: disabledLog,
                  writable: true,
                };
                Object.defineProperties(console, {
                  info: props,
                  log: props,
                  warn: props,
                  error: props,
                  group: props,
                  groupCollapsed: props,
                  groupEnd: props,
                });
              }
              disabledDepth++;
            }
          }
          function reenableLogs() {
            {
              disabledDepth--;
              if (disabledDepth === 0) {
                var props = {
                  configurable: true,
                  enumerable: true,
                  writable: true,
                };
                Object.defineProperties(console, {
                  log: assign({}, props, {
                    value: prevLog,
                  }),
                  info: assign({}, props, {
                    value: prevInfo,
                  }),
                  warn: assign({}, props, {
                    value: prevWarn,
                  }),
                  error: assign({}, props, {
                    value: prevError,
                  }),
                  group: assign({}, props, {
                    value: prevGroup,
                  }),
                  groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed,
                  }),
                  groupEnd: assign({}, props, {
                    value: prevGroupEnd,
                  }),
                });
              }
              if (disabledDepth < 0) {
                error(
                  "disabledDepth fell below zero. This is a bug in React. Please file an issue."
                );
              }
            }
          }
          var ReactCurrentDispatcher$1 =
            ReactSharedInternals.ReactCurrentDispatcher;
          var prefix;
          function describeBuiltInComponentFrame(name, source, ownerFn) {
            {
              if (prefix === void 0) {
                try {
                  throw Error();
                } catch (x) {
                  var match = x.stack.trim().match(/\n( *(at )?)/);
                  prefix = (match && match[1]) || "";
                }
              }
              return "\n" + prefix + name;
            }
          }
          var reentry = false;
          var componentFrameCache;
          {
            var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
            componentFrameCache = new PossiblyWeakMap();
          }
          function describeNativeComponentFrame(fn, construct) {
            if (!fn || reentry) {
              return "";
            }
            {
              var frame = componentFrameCache.get(fn);
              if (frame !== void 0) {
                return frame;
              }
            }
            var control;
            reentry = true;
            var previousPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            var previousDispatcher;
            {
              previousDispatcher = ReactCurrentDispatcher$1.current;
              ReactCurrentDispatcher$1.current = null;
              disableLogs();
            }
            try {
              if (construct) {
                var Fake = function () {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                });
                if (typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x) {
                    control = x;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  control = x;
                }
                fn();
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string") {
                var sampleLines = sample.stack.split("\n");
                var controlLines = control.stack.split("\n");
                var s = sampleLines.length - 1;
                var c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                  if (sampleLines[s] !== controlLines[c]) {
                    if (s !== 1 || c !== 1) {
                      do {
                        s--;
                        c--;
                        if (c < 0 || sampleLines[s] !== controlLines[c]) {
                          var _frame =
                            "\n" + sampleLines[s].replace(" at new ", " at ");
                          if (
                            fn.displayName &&
                            _frame.includes("<anonymous>")
                          ) {
                            _frame = _frame.replace(
                              "<anonymous>",
                              fn.displayName
                            );
                          }
                          {
                            if (typeof fn === "function") {
                              componentFrameCache.set(fn, _frame);
                            }
                          }
                          return _frame;
                        }
                      } while (s >= 1 && c >= 0);
                    }
                    break;
                  }
                }
              }
            } finally {
              reentry = false;
              {
                ReactCurrentDispatcher$1.current = previousDispatcher;
                reenableLogs();
              }
              Error.prepareStackTrace = previousPrepareStackTrace;
            }
            var name = fn ? fn.displayName || fn.name : "";
            var syntheticFrame = name
              ? describeBuiltInComponentFrame(name)
              : "";
            {
              if (typeof fn === "function") {
                componentFrameCache.set(fn, syntheticFrame);
              }
            }
            return syntheticFrame;
          }
          function describeFunctionComponentFrame(fn, source, ownerFn) {
            {
              return describeNativeComponentFrame(fn, false);
            }
          }
          function shouldConstruct(Component2) {
            var prototype = Component2.prototype;
            return !!(prototype && prototype.isReactComponent);
          }
          function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
            if (type == null) {
              return "";
            }
            if (typeof type === "function") {
              {
                return describeNativeComponentFrame(
                  type,
                  shouldConstruct(type)
                );
              }
            }
            if (typeof type === "string") {
              return describeBuiltInComponentFrame(type);
            }
            switch (type) {
              case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
              case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE:
                  return describeFunctionComponentFrame(type.render);
                case REACT_MEMO_TYPE:
                  return describeUnknownElementTypeFrameInDEV(
                    type.type,
                    source,
                    ownerFn
                  );
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return describeUnknownElementTypeFrameInDEV(
                      init(payload),
                      source,
                      ownerFn
                    );
                  } catch (x) {}
                }
              }
            }
            return "";
          }
          var loggedTypeFailures = {};
          var ReactDebugCurrentFrame$1 =
            ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(
                  element.type,
                  element._source,
                  owner ? owner.type : null
                );
                ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame$1.setExtraStackFrame(null);
              }
            }
          }
          function checkPropTypes(
            typeSpecs,
            values,
            location,
            componentName,
            element
          ) {
            {
              var has = Function.call.bind(hasOwnProperty);
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error$1 = void 0;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== "function") {
                      var err = Error(
                        (componentName || "React class") +
                          ": " +
                          location +
                          " type `" +
                          typeSpecName +
                          "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                          typeof typeSpecs[typeSpecName] +
                          "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                      );
                      err.name = "Invariant Violation";
                      throw err;
                    }
                    error$1 = typeSpecs[typeSpecName](
                      values,
                      typeSpecName,
                      componentName,
                      location,
                      null,
                      "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
                    );
                  } catch (ex) {
                    error$1 = ex;
                  }
                  if (error$1 && !(error$1 instanceof Error)) {
                    setCurrentlyValidatingElement(element);
                    error(
                      "%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",
                      componentName || "React class",
                      location,
                      typeSpecName,
                      typeof error$1
                    );
                    setCurrentlyValidatingElement(null);
                  }
                  if (
                    error$1 instanceof Error &&
                    !(error$1.message in loggedTypeFailures)
                  ) {
                    loggedTypeFailures[error$1.message] = true;
                    setCurrentlyValidatingElement(element);
                    error("Failed %s type: %s", location, error$1.message);
                    setCurrentlyValidatingElement(null);
                  }
                }
              }
            }
          }
          function setCurrentlyValidatingElement$1(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(
                  element.type,
                  element._source,
                  owner ? owner.type : null
                );
                setExtraStackFrame(stack);
              } else {
                setExtraStackFrame(null);
              }
            }
          }
          var propTypesMisspellWarningShown;
          {
            propTypesMisspellWarningShown = false;
          }
          function getDeclarationErrorAddendum() {
            if (ReactCurrentOwner.current) {
              var name = getComponentNameFromType(
                ReactCurrentOwner.current.type
              );
              if (name) {
                return "\n\nCheck the render method of `" + name + "`.";
              }
            }
            return "";
          }
          function getSourceInfoErrorAddendum(source) {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return (
                "\n\nCheck your code at " + fileName + ":" + lineNumber + "."
              );
            }
            return "";
          }
          function getSourceInfoErrorAddendumForProps(elementProps) {
            if (elementProps !== null && elementProps !== void 0) {
              return getSourceInfoErrorAddendum(elementProps.__source);
            }
            return "";
          }
          var ownerHasKeyUseWarning = {};
          function getCurrentComponentErrorInfo(parentType) {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName =
                typeof parentType === "string"
                  ? parentType
                  : parentType.displayName || parentType.name;
              if (parentName) {
                info =
                  "\n\nCheck the top-level render call using <" +
                  parentName +
                  ">.";
              }
            }
            return info;
          }
          function validateExplicitKey(element, parentType) {
            if (
              !element._store ||
              element._store.validated ||
              element.key != null
            ) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo =
              getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (
              element &&
              element._owner &&
              element._owner !== ReactCurrentOwner.current
            ) {
              childOwner =
                " It was passed a child from " +
                getComponentNameFromType(element._owner.type) +
                ".";
            }
            {
              setCurrentlyValidatingElement$1(element);
              error(
                'Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',
                currentComponentErrorInfo,
                childOwner
              );
              setCurrentlyValidatingElement$1(null);
            }
          }
          function validateChildKeys(node, parentType) {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
          function validatePropTypes(element) {
            {
              var type = element.type;
              if (
                type === null ||
                type === void 0 ||
                typeof type === "string"
              ) {
                return;
              }
              var propTypes;
              if (typeof type === "function") {
                propTypes = type.propTypes;
              } else if (
                typeof type === "object" &&
                (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
                  // Inner props are checked in the reconciler.
                  type.$$typeof === REACT_MEMO_TYPE)
              ) {
                propTypes = type.propTypes;
              } else {
                return;
              }
              if (propTypes) {
                var name = getComponentNameFromType(type);
                checkPropTypes(propTypes, element.props, "prop", name, element);
              } else if (
                type.PropTypes !== void 0 &&
                !propTypesMisspellWarningShown
              ) {
                propTypesMisspellWarningShown = true;
                var _name = getComponentNameFromType(type);
                error(
                  "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                  _name || "Unknown"
                );
              }
              if (
                typeof type.getDefaultProps === "function" &&
                !type.getDefaultProps.isReactClassApproved
              ) {
                error(
                  "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead."
                );
              }
            }
          }
          function validateFragmentProps(fragment) {
            {
              var keys = Object.keys(fragment.props);
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key !== "children" && key !== "key") {
                  setCurrentlyValidatingElement$1(fragment);
                  error(
                    "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                    key
                  );
                  setCurrentlyValidatingElement$1(null);
                  break;
                }
              }
              if (fragment.ref !== null) {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid attribute `ref` supplied to `React.Fragment`.");
                setCurrentlyValidatingElement$1(null);
              }
            }
          }
          function createElementWithValidation(type, props, children) {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (
                type === void 0 ||
                (typeof type === "object" &&
                  type !== null &&
                  Object.keys(type).length === 0)
              ) {
                info +=
                  " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendumForProps(props);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (
                type !== void 0 &&
                type.$$typeof === REACT_ELEMENT_TYPE
              ) {
                typeString =
                  "<" +
                  (getComponentNameFromType(type.type) || "Unknown") +
                  " />";
                info =
                  " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              {
                error(
                  "React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
                  typeString,
                  info
                );
              }
            }
            var element = createElement.apply(this, arguments);
            if (element == null) {
              return element;
            }
            if (validType) {
              for (var i = 2; i < arguments.length; i++) {
                validateChildKeys(arguments[i], type);
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
          var didWarnAboutDeprecatedCreateFactory = false;
          function createFactoryWithValidation(type) {
            var validatedFactory = createElementWithValidation.bind(null, type);
            validatedFactory.type = type;
            {
              if (!didWarnAboutDeprecatedCreateFactory) {
                didWarnAboutDeprecatedCreateFactory = true;
                warn(
                  "React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead."
                );
              }
              Object.defineProperty(validatedFactory, "type", {
                enumerable: false,
                get: function () {
                  warn(
                    "Factory.type is deprecated. Access the class directly before passing it to createFactory."
                  );
                  Object.defineProperty(this, "type", {
                    value: type,
                  });
                  return type;
                },
              });
            }
            return validatedFactory;
          }
          function cloneElementWithValidation(element, props, children) {
            var newElement = cloneElement.apply(this, arguments);
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], newElement.type);
            }
            validatePropTypes(newElement);
            return newElement;
          }
          function startTransition(scope, options) {
            var prevTransition = ReactCurrentBatchConfig.transition;
            ReactCurrentBatchConfig.transition = {};
            var currentTransition = ReactCurrentBatchConfig.transition;
            {
              ReactCurrentBatchConfig.transition._updatedFibers =
                /* @__PURE__ */ new Set();
            }
            try {
              scope();
            } finally {
              ReactCurrentBatchConfig.transition = prevTransition;
              {
                if (
                  prevTransition === null &&
                  currentTransition._updatedFibers
                ) {
                  var updatedFibersCount =
                    currentTransition._updatedFibers.size;
                  if (updatedFibersCount > 10) {
                    warn(
                      "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
                    );
                  }
                  currentTransition._updatedFibers.clear();
                }
              }
            }
          }
          var didWarnAboutMessageChannel = false;
          var enqueueTaskImpl = null;
          function enqueueTask(task) {
            if (enqueueTaskImpl === null) {
              try {
                var requireString = ("require" + Math.random()).slice(0, 7);
                var nodeRequire = module && module[requireString];
                enqueueTaskImpl = nodeRequire.call(
                  module,
                  "timers"
                ).setImmediate;
              } catch (_err) {
                enqueueTaskImpl = function (callback) {
                  {
                    if (didWarnAboutMessageChannel === false) {
                      didWarnAboutMessageChannel = true;
                      if (typeof MessageChannel === "undefined") {
                        error(
                          "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                        );
                      }
                    }
                  }
                  var channel = new MessageChannel();
                  channel.port1.onmessage = callback;
                  channel.port2.postMessage(void 0);
                };
              }
            }
            return enqueueTaskImpl(task);
          }
          var actScopeDepth = 0;
          var didWarnNoAwaitAct = false;
          function act(callback) {
            {
              var prevActScopeDepth = actScopeDepth;
              actScopeDepth++;
              if (ReactCurrentActQueue.current === null) {
                ReactCurrentActQueue.current = [];
              }
              var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
              var result;
              try {
                ReactCurrentActQueue.isBatchingLegacy = true;
                result = callback();
                if (
                  !prevIsBatchingLegacy &&
                  ReactCurrentActQueue.didScheduleLegacyUpdate
                ) {
                  var queue = ReactCurrentActQueue.current;
                  if (queue !== null) {
                    ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                    flushActQueue(queue);
                  }
                }
              } catch (error2) {
                popActScope(prevActScopeDepth);
                throw error2;
              } finally {
                ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
              }
              if (
                result !== null &&
                typeof result === "object" &&
                typeof result.then === "function"
              ) {
                var thenableResult = result;
                var wasAwaited = false;
                var thenable = {
                  then: function (resolve, reject) {
                    wasAwaited = true;
                    thenableResult.then(
                      function (returnValue2) {
                        popActScope(prevActScopeDepth);
                        if (actScopeDepth === 0) {
                          recursivelyFlushAsyncActWork(
                            returnValue2,
                            resolve,
                            reject
                          );
                        } else {
                          resolve(returnValue2);
                        }
                      },
                      function (error2) {
                        popActScope(prevActScopeDepth);
                        reject(error2);
                      }
                    );
                  },
                };
                {
                  if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                    Promise.resolve()
                      .then(function () {})
                      .then(function () {
                        if (!wasAwaited) {
                          didWarnNoAwaitAct = true;
                          error(
                            "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
                          );
                        }
                      });
                  }
                }
                return thenable;
              } else {
                var returnValue = result;
                popActScope(prevActScopeDepth);
                if (actScopeDepth === 0) {
                  var _queue = ReactCurrentActQueue.current;
                  if (_queue !== null) {
                    flushActQueue(_queue);
                    ReactCurrentActQueue.current = null;
                  }
                  var _thenable = {
                    then: function (resolve, reject) {
                      if (ReactCurrentActQueue.current === null) {
                        ReactCurrentActQueue.current = [];
                        recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      } else {
                        resolve(returnValue);
                      }
                    },
                  };
                  return _thenable;
                } else {
                  var _thenable2 = {
                    then: function (resolve, reject) {
                      resolve(returnValue);
                    },
                  };
                  return _thenable2;
                }
              }
            }
          }
          function popActScope(prevActScopeDepth) {
            {
              if (prevActScopeDepth !== actScopeDepth - 1) {
                error(
                  "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
                );
              }
              actScopeDepth = prevActScopeDepth;
            }
          }
          function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
            {
              var queue = ReactCurrentActQueue.current;
              if (queue !== null) {
                try {
                  flushActQueue(queue);
                  enqueueTask(function () {
                    if (queue.length === 0) {
                      ReactCurrentActQueue.current = null;
                      resolve(returnValue);
                    } else {
                      recursivelyFlushAsyncActWork(
                        returnValue,
                        resolve,
                        reject
                      );
                    }
                  });
                } catch (error2) {
                  reject(error2);
                }
              } else {
                resolve(returnValue);
              }
            }
          }
          var isFlushing = false;
          function flushActQueue(queue) {
            {
              if (!isFlushing) {
                isFlushing = true;
                var i = 0;
                try {
                  for (; i < queue.length; i++) {
                    var callback = queue[i];
                    do {
                      callback = callback(true);
                    } while (callback !== null);
                  }
                  queue.length = 0;
                } catch (error2) {
                  queue = queue.slice(i + 1);
                  throw error2;
                } finally {
                  isFlushing = false;
                }
              }
            }
          }
          var createElement$1 = createElementWithValidation;
          var cloneElement$1 = cloneElementWithValidation;
          var createFactory = createFactoryWithValidation;
          var Children = {
            map: mapChildren,
            forEach: forEachChildren,
            count: countChildren,
            toArray,
            only: onlyChild,
          };
          exports.Children = Children;
          exports.Component = Component;
          exports.Fragment = REACT_FRAGMENT_TYPE;
          exports.Profiler = REACT_PROFILER_TYPE;
          exports.PureComponent = PureComponent;
          exports.StrictMode = REACT_STRICT_MODE_TYPE;
          exports.Suspense = REACT_SUSPENSE_TYPE;
          exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
            ReactSharedInternals;
          exports.cloneElement = cloneElement$1;
          exports.createContext = createContext;
          exports.createElement = createElement$1;
          exports.createFactory = createFactory;
          exports.createRef = createRef;
          exports.forwardRef = forwardRef;
          exports.isValidElement = isValidElement;
          exports.lazy = lazy;
          exports.memo = memo;
          exports.startTransition = startTransition;
          exports.unstable_act = act;
          exports.useCallback = useCallback5;
          exports.useContext = useContext;
          exports.useDebugValue = useDebugValue;
          exports.useDeferredValue = useDeferredValue;
          exports.useEffect = useEffect6;
          exports.useId = useId4;
          exports.useImperativeHandle = useImperativeHandle;
          exports.useInsertionEffect = useInsertionEffect;
          exports.useLayoutEffect = useLayoutEffect;
          exports.useMemo = useMemo2;
          exports.useReducer = useReducer;
          exports.useRef = useRef;
          exports.useState = useState7;
          exports.useSyncExternalStore = useSyncExternalStore;
          exports.useTransition = useTransition;
          exports.version = ReactVersion;
          if (
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" &&
            typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
              "function"
          ) {
            __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(
              new Error()
            );
          }
        })();
      }
    },
  });

  // ../node_modules/react/index.js
  var require_react = __commonJS({
    "../node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    },
  });

  // ../node_modules/react/cjs/react-jsx-runtime.development.js
  var require_react_jsx_runtime_development = __commonJS({
    "../node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
      "use strict";
      if (true) {
        (function () {
          "use strict";
          var React = require_react();
          var REACT_ELEMENT_TYPE = Symbol.for("react.element");
          var REACT_PORTAL_TYPE = Symbol.for("react.portal");
          var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
          var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
          var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
          var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
          var REACT_CONTEXT_TYPE = Symbol.for("react.context");
          var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
          var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
          var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
          var REACT_MEMO_TYPE = Symbol.for("react.memo");
          var REACT_LAZY_TYPE = Symbol.for("react.lazy");
          var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
          var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = "@@iterator";
          function getIteratorFn(maybeIterable) {
            if (maybeIterable === null || typeof maybeIterable !== "object") {
              return null;
            }
            var maybeIterator =
              (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
              maybeIterable[FAUX_ITERATOR_SYMBOL];
            if (typeof maybeIterator === "function") {
              return maybeIterator;
            }
            return null;
          }
          var ReactSharedInternals =
            React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
          function error(format) {
            {
              {
                for (
                  var _len2 = arguments.length,
                    args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                    _key2 = 1;
                  _key2 < _len2;
                  _key2++
                ) {
                  args[_key2 - 1] = arguments[_key2];
                }
                printWarning("error", format, args);
              }
            }
          }
          function printWarning(level, format, args) {
            {
              var ReactDebugCurrentFrame2 =
                ReactSharedInternals.ReactDebugCurrentFrame;
              var stack = ReactDebugCurrentFrame2.getStackAddendum();
              if (stack !== "") {
                format += "%s";
                args = args.concat([stack]);
              }
              var argsWithFormat = args.map(function (item) {
                return String(item);
              });
              argsWithFormat.unshift("Warning: " + format);
              Function.prototype.apply.call(
                console[level],
                console,
                argsWithFormat
              );
            }
          }
          var enableScopeAPI = false;
          var enableCacheElement = false;
          var enableTransitionTracing = false;
          var enableLegacyHidden = false;
          var enableDebugTracing = false;
          var REACT_MODULE_REFERENCE;
          {
            REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
          }
          function isValidElementType(type) {
            if (typeof type === "string" || typeof type === "function") {
              return true;
            }
            if (
              type === REACT_FRAGMENT_TYPE ||
              type === REACT_PROFILER_TYPE ||
              enableDebugTracing ||
              type === REACT_STRICT_MODE_TYPE ||
              type === REACT_SUSPENSE_TYPE ||
              type === REACT_SUSPENSE_LIST_TYPE ||
              enableLegacyHidden ||
              type === REACT_OFFSCREEN_TYPE ||
              enableScopeAPI ||
              enableCacheElement ||
              enableTransitionTracing
            ) {
              return true;
            }
            if (typeof type === "object" && type !== null) {
              if (
                type.$$typeof === REACT_LAZY_TYPE ||
                type.$$typeof === REACT_MEMO_TYPE ||
                type.$$typeof === REACT_PROVIDER_TYPE ||
                type.$$typeof === REACT_CONTEXT_TYPE ||
                type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
                // types supported by any Flight configuration anywhere since
                // we don't know which Flight build this will end up being used
                // with.
                type.$$typeof === REACT_MODULE_REFERENCE ||
                type.getModuleId !== void 0
              ) {
                return true;
              }
            }
            return false;
          }
          function getWrappedName(outerType, innerType, wrapperName) {
            var displayName = outerType.displayName;
            if (displayName) {
              return displayName;
            }
            var functionName = innerType.displayName || innerType.name || "";
            return functionName !== ""
              ? wrapperName + "(" + functionName + ")"
              : wrapperName;
          }
          function getContextName(type) {
            return type.displayName || "Context";
          }
          function getComponentNameFromType(type) {
            if (type == null) {
              return null;
            }
            {
              if (typeof type.tag === "number") {
                error(
                  "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
                );
              }
            }
            if (typeof type === "function") {
              return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
              return type;
            }
            switch (type) {
              case REACT_FRAGMENT_TYPE:
                return "Fragment";
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_PROFILER_TYPE:
                return "Profiler";
              case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
              case REACT_SUSPENSE_TYPE:
                return "Suspense";
              case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                  var context = type;
                  return getContextName(context) + ".Consumer";
                case REACT_PROVIDER_TYPE:
                  var provider = type;
                  return getContextName(provider._context) + ".Provider";
                case REACT_FORWARD_REF_TYPE:
                  return getWrappedName(type, type.render, "ForwardRef");
                case REACT_MEMO_TYPE:
                  var outerName = type.displayName || null;
                  if (outerName !== null) {
                    return outerName;
                  }
                  return getComponentNameFromType(type.type) || "Memo";
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return getComponentNameFromType(init(payload));
                  } catch (x) {
                    return null;
                  }
                }
              }
            }
            return null;
          }
          var assign = Object.assign;
          var disabledDepth = 0;
          var prevLog;
          var prevInfo;
          var prevWarn;
          var prevError;
          var prevGroup;
          var prevGroupCollapsed;
          var prevGroupEnd;
          function disabledLog() {}
          disabledLog.__reactDisabledLog = true;
          function disableLogs() {
            {
              if (disabledDepth === 0) {
                prevLog = console.log;
                prevInfo = console.info;
                prevWarn = console.warn;
                prevError = console.error;
                prevGroup = console.group;
                prevGroupCollapsed = console.groupCollapsed;
                prevGroupEnd = console.groupEnd;
                var props = {
                  configurable: true,
                  enumerable: true,
                  value: disabledLog,
                  writable: true,
                };
                Object.defineProperties(console, {
                  info: props,
                  log: props,
                  warn: props,
                  error: props,
                  group: props,
                  groupCollapsed: props,
                  groupEnd: props,
                });
              }
              disabledDepth++;
            }
          }
          function reenableLogs() {
            {
              disabledDepth--;
              if (disabledDepth === 0) {
                var props = {
                  configurable: true,
                  enumerable: true,
                  writable: true,
                };
                Object.defineProperties(console, {
                  log: assign({}, props, {
                    value: prevLog,
                  }),
                  info: assign({}, props, {
                    value: prevInfo,
                  }),
                  warn: assign({}, props, {
                    value: prevWarn,
                  }),
                  error: assign({}, props, {
                    value: prevError,
                  }),
                  group: assign({}, props, {
                    value: prevGroup,
                  }),
                  groupCollapsed: assign({}, props, {
                    value: prevGroupCollapsed,
                  }),
                  groupEnd: assign({}, props, {
                    value: prevGroupEnd,
                  }),
                });
              }
              if (disabledDepth < 0) {
                error(
                  "disabledDepth fell below zero. This is a bug in React. Please file an issue."
                );
              }
            }
          }
          var ReactCurrentDispatcher =
            ReactSharedInternals.ReactCurrentDispatcher;
          var prefix;
          function describeBuiltInComponentFrame(name, source, ownerFn) {
            {
              if (prefix === void 0) {
                try {
                  throw Error();
                } catch (x) {
                  var match = x.stack.trim().match(/\n( *(at )?)/);
                  prefix = (match && match[1]) || "";
                }
              }
              return "\n" + prefix + name;
            }
          }
          var reentry = false;
          var componentFrameCache;
          {
            var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
            componentFrameCache = new PossiblyWeakMap();
          }
          function describeNativeComponentFrame(fn, construct) {
            if (!fn || reentry) {
              return "";
            }
            {
              var frame = componentFrameCache.get(fn);
              if (frame !== void 0) {
                return frame;
              }
            }
            var control;
            reentry = true;
            var previousPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            var previousDispatcher;
            {
              previousDispatcher = ReactCurrentDispatcher.current;
              ReactCurrentDispatcher.current = null;
              disableLogs();
            }
            try {
              if (construct) {
                var Fake = function () {
                  throw Error();
                };
                Object.defineProperty(Fake.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                });
                if (typeof Reflect === "object" && Reflect.construct) {
                  try {
                    Reflect.construct(Fake, []);
                  } catch (x) {
                    control = x;
                  }
                  Reflect.construct(fn, [], Fake);
                } else {
                  try {
                    Fake.call();
                  } catch (x) {
                    control = x;
                  }
                  fn.call(Fake.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (x) {
                  control = x;
                }
                fn();
              }
            } catch (sample) {
              if (sample && control && typeof sample.stack === "string") {
                var sampleLines = sample.stack.split("\n");
                var controlLines = control.stack.split("\n");
                var s = sampleLines.length - 1;
                var c = controlLines.length - 1;
                while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                  c--;
                }
                for (; s >= 1 && c >= 0; s--, c--) {
                  if (sampleLines[s] !== controlLines[c]) {
                    if (s !== 1 || c !== 1) {
                      do {
                        s--;
                        c--;
                        if (c < 0 || sampleLines[s] !== controlLines[c]) {
                          var _frame =
                            "\n" + sampleLines[s].replace(" at new ", " at ");
                          if (
                            fn.displayName &&
                            _frame.includes("<anonymous>")
                          ) {
                            _frame = _frame.replace(
                              "<anonymous>",
                              fn.displayName
                            );
                          }
                          {
                            if (typeof fn === "function") {
                              componentFrameCache.set(fn, _frame);
                            }
                          }
                          return _frame;
                        }
                      } while (s >= 1 && c >= 0);
                    }
                    break;
                  }
                }
              }
            } finally {
              reentry = false;
              {
                ReactCurrentDispatcher.current = previousDispatcher;
                reenableLogs();
              }
              Error.prepareStackTrace = previousPrepareStackTrace;
            }
            var name = fn ? fn.displayName || fn.name : "";
            var syntheticFrame = name
              ? describeBuiltInComponentFrame(name)
              : "";
            {
              if (typeof fn === "function") {
                componentFrameCache.set(fn, syntheticFrame);
              }
            }
            return syntheticFrame;
          }
          function describeFunctionComponentFrame(fn, source, ownerFn) {
            {
              return describeNativeComponentFrame(fn, false);
            }
          }
          function shouldConstruct(Component) {
            var prototype = Component.prototype;
            return !!(prototype && prototype.isReactComponent);
          }
          function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
            if (type == null) {
              return "";
            }
            if (typeof type === "function") {
              {
                return describeNativeComponentFrame(
                  type,
                  shouldConstruct(type)
                );
              }
            }
            if (typeof type === "string") {
              return describeBuiltInComponentFrame(type);
            }
            switch (type) {
              case REACT_SUSPENSE_TYPE:
                return describeBuiltInComponentFrame("Suspense");
              case REACT_SUSPENSE_LIST_TYPE:
                return describeBuiltInComponentFrame("SuspenseList");
            }
            if (typeof type === "object") {
              switch (type.$$typeof) {
                case REACT_FORWARD_REF_TYPE:
                  return describeFunctionComponentFrame(type.render);
                case REACT_MEMO_TYPE:
                  return describeUnknownElementTypeFrameInDEV(
                    type.type,
                    source,
                    ownerFn
                  );
                case REACT_LAZY_TYPE: {
                  var lazyComponent = type;
                  var payload = lazyComponent._payload;
                  var init = lazyComponent._init;
                  try {
                    return describeUnknownElementTypeFrameInDEV(
                      init(payload),
                      source,
                      ownerFn
                    );
                  } catch (x) {}
                }
              }
            }
            return "";
          }
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var loggedTypeFailures = {};
          var ReactDebugCurrentFrame =
            ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(
                  element.type,
                  element._source,
                  owner ? owner.type : null
                );
                ReactDebugCurrentFrame.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame.setExtraStackFrame(null);
              }
            }
          }
          function checkPropTypes(
            typeSpecs,
            values,
            location,
            componentName,
            element
          ) {
            {
              var has = Function.call.bind(hasOwnProperty);
              for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                  var error$1 = void 0;
                  try {
                    if (typeof typeSpecs[typeSpecName] !== "function") {
                      var err = Error(
                        (componentName || "React class") +
                          ": " +
                          location +
                          " type `" +
                          typeSpecName +
                          "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
                          typeof typeSpecs[typeSpecName] +
                          "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                      );
                      err.name = "Invariant Violation";
                      throw err;
                    }
                    error$1 = typeSpecs[typeSpecName](
                      values,
                      typeSpecName,
                      componentName,
                      location,
                      null,
                      "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
                    );
                  } catch (ex) {
                    error$1 = ex;
                  }
                  if (error$1 && !(error$1 instanceof Error)) {
                    setCurrentlyValidatingElement(element);
                    error(
                      "%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",
                      componentName || "React class",
                      location,
                      typeSpecName,
                      typeof error$1
                    );
                    setCurrentlyValidatingElement(null);
                  }
                  if (
                    error$1 instanceof Error &&
                    !(error$1.message in loggedTypeFailures)
                  ) {
                    loggedTypeFailures[error$1.message] = true;
                    setCurrentlyValidatingElement(element);
                    error("Failed %s type: %s", location, error$1.message);
                    setCurrentlyValidatingElement(null);
                  }
                }
              }
            }
          }
          var isArrayImpl = Array.isArray;
          function isArray(a) {
            return isArrayImpl(a);
          }
          function typeName(value) {
            {
              var hasToStringTag =
                typeof Symbol === "function" && Symbol.toStringTag;
              var type =
                (hasToStringTag && value[Symbol.toStringTag]) ||
                value.constructor.name ||
                "Object";
              return type;
            }
          }
          function willCoercionThrow(value) {
            {
              try {
                testStringCoercion(value);
                return false;
              } catch (e) {
                return true;
              }
            }
          }
          function testStringCoercion(value) {
            return "" + value;
          }
          function checkKeyStringCoercion(value) {
            {
              if (willCoercionThrow(value)) {
                error(
                  "The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.",
                  typeName(value)
                );
                return testStringCoercion(value);
              }
            }
          }
          var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
          var RESERVED_PROPS = {
            key: true,
            ref: true,
            __self: true,
            __source: true,
          };
          var specialPropKeyWarningShown;
          var specialPropRefWarningShown;
          var didWarnAboutStringRefs;
          {
            didWarnAboutStringRefs = {};
          }
          function hasValidRef(config) {
            {
              if (hasOwnProperty.call(config, "ref")) {
                var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.ref !== void 0;
          }
          function hasValidKey(config) {
            {
              if (hasOwnProperty.call(config, "key")) {
                var getter = Object.getOwnPropertyDescriptor(config, "key").get;
                if (getter && getter.isReactWarning) {
                  return false;
                }
              }
            }
            return config.key !== void 0;
          }
          function warnIfStringRefCannotBeAutoConverted(config, self) {
            {
              if (
                typeof config.ref === "string" &&
                ReactCurrentOwner.current &&
                self &&
                ReactCurrentOwner.current.stateNode !== self
              ) {
                var componentName = getComponentNameFromType(
                  ReactCurrentOwner.current.type
                );
                if (!didWarnAboutStringRefs[componentName]) {
                  error(
                    'Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',
                    getComponentNameFromType(ReactCurrentOwner.current.type),
                    config.ref
                  );
                  didWarnAboutStringRefs[componentName] = true;
                }
              }
            }
          }
          function defineKeyPropWarningGetter(props, displayName) {
            {
              var warnAboutAccessingKey = function () {
                if (!specialPropKeyWarningShown) {
                  specialPropKeyWarningShown = true;
                  error(
                    "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    displayName
                  );
                }
              };
              warnAboutAccessingKey.isReactWarning = true;
              Object.defineProperty(props, "key", {
                get: warnAboutAccessingKey,
                configurable: true,
              });
            }
          }
          function defineRefPropWarningGetter(props, displayName) {
            {
              var warnAboutAccessingRef = function () {
                if (!specialPropRefWarningShown) {
                  specialPropRefWarningShown = true;
                  error(
                    "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",
                    displayName
                  );
                }
              };
              warnAboutAccessingRef.isReactWarning = true;
              Object.defineProperty(props, "ref", {
                get: warnAboutAccessingRef,
                configurable: true,
              });
            }
          }
          var ReactElement = function (
            type,
            key,
            ref,
            self,
            source,
            owner,
            props
          ) {
            var element = {
              // This tag allows us to uniquely identify this as a React Element
              $$typeof: REACT_ELEMENT_TYPE,
              // Built-in properties that belong on the element
              type,
              key,
              ref,
              props,
              // Record the component responsible for creating this element.
              _owner: owner,
            };
            {
              element._store = {};
              Object.defineProperty(element._store, "validated", {
                configurable: false,
                enumerable: false,
                writable: true,
                value: false,
              });
              Object.defineProperty(element, "_self", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: self,
              });
              Object.defineProperty(element, "_source", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: source,
              });
              if (Object.freeze) {
                Object.freeze(element.props);
                Object.freeze(element);
              }
            }
            return element;
          };
          function jsxDEV(type, config, maybeKey, source, self) {
            {
              var propName;
              var props = {};
              var key = null;
              var ref = null;
              if (maybeKey !== void 0) {
                {
                  checkKeyStringCoercion(maybeKey);
                }
                key = "" + maybeKey;
              }
              if (hasValidKey(config)) {
                {
                  checkKeyStringCoercion(config.key);
                }
                key = "" + config.key;
              }
              if (hasValidRef(config)) {
                ref = config.ref;
                warnIfStringRefCannotBeAutoConverted(config, self);
              }
              for (propName in config) {
                if (
                  hasOwnProperty.call(config, propName) &&
                  !RESERVED_PROPS.hasOwnProperty(propName)
                ) {
                  props[propName] = config[propName];
                }
              }
              if (type && type.defaultProps) {
                var defaultProps = type.defaultProps;
                for (propName in defaultProps) {
                  if (props[propName] === void 0) {
                    props[propName] = defaultProps[propName];
                  }
                }
              }
              if (key || ref) {
                var displayName =
                  typeof type === "function"
                    ? type.displayName || type.name || "Unknown"
                    : type;
                if (key) {
                  defineKeyPropWarningGetter(props, displayName);
                }
                if (ref) {
                  defineRefPropWarningGetter(props, displayName);
                }
              }
              return ReactElement(
                type,
                key,
                ref,
                self,
                source,
                ReactCurrentOwner.current,
                props
              );
            }
          }
          var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
          var ReactDebugCurrentFrame$1 =
            ReactSharedInternals.ReactDebugCurrentFrame;
          function setCurrentlyValidatingElement$1(element) {
            {
              if (element) {
                var owner = element._owner;
                var stack = describeUnknownElementTypeFrameInDEV(
                  element.type,
                  element._source,
                  owner ? owner.type : null
                );
                ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
              } else {
                ReactDebugCurrentFrame$1.setExtraStackFrame(null);
              }
            }
          }
          var propTypesMisspellWarningShown;
          {
            propTypesMisspellWarningShown = false;
          }
          function isValidElement(object) {
            {
              return (
                typeof object === "object" &&
                object !== null &&
                object.$$typeof === REACT_ELEMENT_TYPE
              );
            }
          }
          function getDeclarationErrorAddendum() {
            {
              if (ReactCurrentOwner$1.current) {
                var name = getComponentNameFromType(
                  ReactCurrentOwner$1.current.type
                );
                if (name) {
                  return "\n\nCheck the render method of `" + name + "`.";
                }
              }
              return "";
            }
          }
          function getSourceInfoErrorAddendum(source) {
            {
              if (source !== void 0) {
                var fileName = source.fileName.replace(/^.*[\\\/]/, "");
                var lineNumber = source.lineNumber;
                return (
                  "\n\nCheck your code at " + fileName + ":" + lineNumber + "."
                );
              }
              return "";
            }
          }
          var ownerHasKeyUseWarning = {};
          function getCurrentComponentErrorInfo(parentType) {
            {
              var info = getDeclarationErrorAddendum();
              if (!info) {
                var parentName =
                  typeof parentType === "string"
                    ? parentType
                    : parentType.displayName || parentType.name;
                if (parentName) {
                  info =
                    "\n\nCheck the top-level render call using <" +
                    parentName +
                    ">.";
                }
              }
              return info;
            }
          }
          function validateExplicitKey(element, parentType) {
            {
              if (
                !element._store ||
                element._store.validated ||
                element.key != null
              ) {
                return;
              }
              element._store.validated = true;
              var currentComponentErrorInfo =
                getCurrentComponentErrorInfo(parentType);
              if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
                return;
              }
              ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
              var childOwner = "";
              if (
                element &&
                element._owner &&
                element._owner !== ReactCurrentOwner$1.current
              ) {
                childOwner =
                  " It was passed a child from " +
                  getComponentNameFromType(element._owner.type) +
                  ".";
              }
              setCurrentlyValidatingElement$1(element);
              error(
                'Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',
                currentComponentErrorInfo,
                childOwner
              );
              setCurrentlyValidatingElement$1(null);
            }
          }
          function validateChildKeys(node, parentType) {
            {
              if (typeof node !== "object") {
                return;
              }
              if (isArray(node)) {
                for (var i = 0; i < node.length; i++) {
                  var child = node[i];
                  if (isValidElement(child)) {
                    validateExplicitKey(child, parentType);
                  }
                }
              } else if (isValidElement(node)) {
                if (node._store) {
                  node._store.validated = true;
                }
              } else if (node) {
                var iteratorFn = getIteratorFn(node);
                if (typeof iteratorFn === "function") {
                  if (iteratorFn !== node.entries) {
                    var iterator = iteratorFn.call(node);
                    var step;
                    while (!(step = iterator.next()).done) {
                      if (isValidElement(step.value)) {
                        validateExplicitKey(step.value, parentType);
                      }
                    }
                  }
                }
              }
            }
          }
          function validatePropTypes(element) {
            {
              var type = element.type;
              if (
                type === null ||
                type === void 0 ||
                typeof type === "string"
              ) {
                return;
              }
              var propTypes;
              if (typeof type === "function") {
                propTypes = type.propTypes;
              } else if (
                typeof type === "object" &&
                (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
                  // Inner props are checked in the reconciler.
                  type.$$typeof === REACT_MEMO_TYPE)
              ) {
                propTypes = type.propTypes;
              } else {
                return;
              }
              if (propTypes) {
                var name = getComponentNameFromType(type);
                checkPropTypes(propTypes, element.props, "prop", name, element);
              } else if (
                type.PropTypes !== void 0 &&
                !propTypesMisspellWarningShown
              ) {
                propTypesMisspellWarningShown = true;
                var _name = getComponentNameFromType(type);
                error(
                  "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                  _name || "Unknown"
                );
              }
              if (
                typeof type.getDefaultProps === "function" &&
                !type.getDefaultProps.isReactClassApproved
              ) {
                error(
                  "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead."
                );
              }
            }
          }
          function validateFragmentProps(fragment) {
            {
              var keys = Object.keys(fragment.props);
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key !== "children" && key !== "key") {
                  setCurrentlyValidatingElement$1(fragment);
                  error(
                    "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",
                    key
                  );
                  setCurrentlyValidatingElement$1(null);
                  break;
                }
              }
              if (fragment.ref !== null) {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid attribute `ref` supplied to `React.Fragment`.");
                setCurrentlyValidatingElement$1(null);
              }
            }
          }
          function jsxWithValidation(
            type,
            props,
            key,
            isStaticChildren,
            source,
            self
          ) {
            {
              var validType = isValidElementType(type);
              if (!validType) {
                var info = "";
                if (
                  type === void 0 ||
                  (typeof type === "object" &&
                    type !== null &&
                    Object.keys(type).length === 0)
                ) {
                  info +=
                    " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
                }
                var sourceInfo = getSourceInfoErrorAddendum(source);
                if (sourceInfo) {
                  info += sourceInfo;
                } else {
                  info += getDeclarationErrorAddendum();
                }
                var typeString;
                if (type === null) {
                  typeString = "null";
                } else if (isArray(type)) {
                  typeString = "array";
                } else if (
                  type !== void 0 &&
                  type.$$typeof === REACT_ELEMENT_TYPE
                ) {
                  typeString =
                    "<" +
                    (getComponentNameFromType(type.type) || "Unknown") +
                    " />";
                  info =
                    " Did you accidentally export a JSX literal instead of a component?";
                } else {
                  typeString = typeof type;
                }
                error(
                  "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
                  typeString,
                  info
                );
              }
              var element = jsxDEV(type, props, key, source, self);
              if (element == null) {
                return element;
              }
              if (validType) {
                var children = props.children;
                if (children !== void 0) {
                  if (isStaticChildren) {
                    if (isArray(children)) {
                      for (var i = 0; i < children.length; i++) {
                        validateChildKeys(children[i], type);
                      }
                      if (Object.freeze) {
                        Object.freeze(children);
                      }
                    } else {
                      error(
                        "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
                      );
                    }
                  } else {
                    validateChildKeys(children, type);
                  }
                }
              }
              if (type === REACT_FRAGMENT_TYPE) {
                validateFragmentProps(element);
              } else {
                validatePropTypes(element);
              }
              return element;
            }
          }
          function jsxWithValidationStatic(type, props, key) {
            {
              return jsxWithValidation(type, props, key, true);
            }
          }
          function jsxWithValidationDynamic(type, props, key) {
            {
              return jsxWithValidation(type, props, key, false);
            }
          }
          var jsx2 = jsxWithValidationDynamic;
          var jsxs2 = jsxWithValidationStatic;
          exports.Fragment = REACT_FRAGMENT_TYPE;
          exports.jsx = jsx2;
          exports.jsxs = jsxs2;
        })();
      }
    },
  });

  // ../node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "../node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_jsx_runtime_development();
      }
    },
  });

  // ../node_modules/trunx/dist/components/Box.js
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Breadcrumb.js
  var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Button.js
  var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Buttons.js
  var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Card.js
  var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Checkbox.js
  var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Column.js
  var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Columns.js
  var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Container.js
  var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Content.js
  var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Control.js
  var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Dropdown.js
  var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Field.js
  var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/FileUpload.js
  var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Form.js
  var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Flex.js
  var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Heading.js
  var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Help.js
  var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Hero.js
  var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Icon.js
  var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Image.js
  var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Input.js
  var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Label.js
  var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Level.js
  var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Media.js
  var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Message.js
  var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Modal.js
  var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Navbar.js
  var import_jsx_runtime28 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Notification.js
  var import_jsx_runtime29 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Pagination.js
  var import_jsx_runtime30 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Panel.js
  var import_jsx_runtime31 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Progress.js
  var import_jsx_runtime32 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Radio.js
  var import_jsx_runtime33 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Section.js
  var import_jsx_runtime34 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Select.js
  var import_jsx_runtime35 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Table.js
  var import_jsx_runtime36 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Tabs.js
  var import_jsx_runtime37 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Tag.js
  var import_jsx_runtime38 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/TagDelete.js
  var import_jsx_runtime39 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Tags.js
  var import_jsx_runtime40 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Textarea.js
  var import_jsx_runtime41 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Tile.js
  var import_jsx_runtime42 = __toESM(require_jsx_runtime(), 1);

  // ../node_modules/trunx/dist/components/Title.js
  var import_jsx_runtime43 = __toESM(require_jsx_runtime(), 1);

  // ../design/dist/components/Calendar.js
  var import_jsx_runtime45 = __toESM(require_jsx_runtime(), 1);

  // ../type-utils/dist/arrays.js
  var arrayTypeGuard = (check) => (arg) =>
    Array.isArray(arg) && arg.every((item) => check(item));

  // ../type-utils/dist/literalType.js
  var isLiteralType = (list) => (arg) =>
    typeof arg === "string" && list.includes(arg);

  // ../type-utils/dist/numbers.js
  var isNaturalNumber = (arg) =>
    typeof arg === "number" && Number.isInteger(arg) && arg > 0;

  // ../type-utils/dist/objects.js
  var isMaybeObject = (arg) =>
    typeof arg === "object" && arg !== null && !Array.isArray(arg);
  var objectTypeGuard = (check) => (arg) => isMaybeObject(arg) && check(arg);

  // ../type-utils/dist/strings.js
  var stringMaxLength = 256;
  var isFiniteString = (arg) =>
    typeof arg === "string" && arg.length <= stringMaxLength;
  var isNonEmptyString = (arg) => isFiniteString(arg) && arg !== "";

  // ../time/dist/date.js
  var isInvalidDate = (arg) =>
    arg instanceof Date && arg.toString() === "Invalid Date";
  var isDateInterval = objectTypeGuard(
    ({ start, end }) =>
      start instanceof Date &&
      !isInvalidDate(start) &&
      end instanceof Date &&
      !isInvalidDate(end) &&
      start <= end
  );

  // ../time/dist/day.js
  var isDay = (arg) => {
    if (typeof arg !== "string") return false;
    const date = new Date(arg);
    if (isInvalidDate(date)) return false;
    const day = date.toJSON().substring(0, 10);
    return day === arg;
  };
  var isDayInterval = objectTypeGuard(
    ({ start, end }) => isDay(start) && isDay(end)
  );

  // ../time/dist/hour.js
  var hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  var isHour = isLiteralType(hours);

  // ../time/dist/time.js
  var isTime = (arg) => isNaturalNumber(arg);
  var now = () => /* @__PURE__ */ new Date().getTime();
  var isTimeInterval = objectTypeGuard(
    ({ start, end }) => isTime(start) && isTime(end) && start <= end
  );

  // ../time/dist/units.js
  var timeUnits = ["second", "minute", "hour", "day"];
  var isTimeUnit = isLiteralType(timeUnits);

  // ../design/dist/components/Calendar.js
  var import_react = __toESM(require_react(), 1);

  // ../design/dist/components/Icon.js
  var import_jsx_runtime44 = __toESM(require_jsx_runtime(), 1);
  var iconRecord = {
    account: {
      jsx: (0, import_jsx_runtime44.jsxs)("g", {
        fill: "currentColor",
        children: [
          (0, import_jsx_runtime44.jsx)("path", {
            d: "M17.062,33.93 C7.728,33.93 0.133,26.335 0.133,17 C0.133,7.665 7.728,0.07 17.062,0.07 C26.397,0.07 33.992,7.665 33.992,17 C33.992,26.335 26.397,33.93 17.062,33.93 L17.062,33.93 Z M17.062,1.93 C8.753,1.93 1.992,8.69 1.992,17 C1.992,25.31 8.753,32.07 17.062,32.07 C25.372,32.07 32.133,25.31 32.133,17 C32.133,8.69 25.372,1.93 17.062,1.93 L17.062,1.93 Z",
          }),
          (0, import_jsx_runtime44.jsx)("path", {
            d: "M7.19,29.248 L5.487,28.499 C6.004,27.328 7.531,26.643 9.301,25.849 C11.008,25.083 13.133,24.13 13.133,23 L13.133,21.462 C12.528,20.955 11.503,19.865 11.342,18.226 C10.852,17.764 10.039,16.822 10.039,15.656 C10.039,14.948 10.319,14.377 10.565,14.014 C10.415,13.255 10.133,11.666 10.133,10.5 C10.133,6.594 12.853,4.07 17.062,4.07 C18.27,4.07 19.737,4.394 20.554,5.269 C22.462,5.605 23.992,7.864 23.992,10.5 C23.992,12.191 23.695,13.582 23.516,14.27 C23.715,14.607 23.93,15.107 23.93,15.687 C23.93,16.998 23.268,17.846 22.65,18.299 C22.475,19.915 21.554,20.957 20.992,21.451 L20.992,23 C20.992,23.961 22.734,24.607 24.419,25.232 C26.335,25.942 28.317,26.677 28.932,28.284 L27.193,28.948 C26.881,28.128 25.229,27.516 23.772,26.976 C21.598,26.169 19.133,25.255 19.133,23 L19.133,20.486 L19.567,20.213 C19.611,20.184 20.82,19.372 20.82,17.75 L20.82,17.121 L21.404,16.887 C21.502,16.842 22.07,16.543 22.07,15.687 C22.07,15.425 21.87,15.132 21.8,15.05 L21.461,14.652 L21.617,14.145 C21.622,14.129 22.133,12.557 22.133,10.5 C22.133,8.745 21.127,7.086 20.062,7.086 L19.528,7.086 L19.259,6.625 C19.062,6.288 18.226,5.93 17.062,5.93 C13.888,5.93 11.992,7.638 11.992,10.5 C11.992,11.852 12.466,14.029 12.471,14.051 L12.581,14.555 L12.213,14.915 C12.213,14.915 11.898,15.248 11.898,15.656 C11.898,16.171 12.516,16.812 12.815,17.042 L13.177,17.321 L13.18,17.781 C13.18,19.313 14.502,20.177 14.559,20.213 L14.987,20.487 L14.992,23 C14.992,25.335 12.373,26.51 10.061,27.546 C8.945,28.046 7.418,28.732 7.19,29.248",
          }),
        ],
      }),
      viewBox: "0 0 34 34",
    },
    "caret-left": {
      jsx: (0, import_jsx_runtime44.jsx)("g", {
        fill: "currentColor",
        children: (0, import_jsx_runtime44.jsx)("polyline", {
          points:
            "10.293 19.707 0.586 10 10.293 0.293 11.707 1.707 3.414 10 11.707 18.293 10.293 19.707",
        }),
      }),
      viewBox: "0 0 15 20",
    },
    "caret-right": {
      jsx: (0, import_jsx_runtime44.jsx)("g", {
        fill: "currentColor",
        children: (0, import_jsx_runtime44.jsx)("polyline", {
          points:
            "1.707 19.707 0.293 18.293 8.586 10 0.293 1.707 1.707 0.293 11.414 10 1.707 19.707",
        }),
      }),
      viewBox: "0 0 10 20",
    },
    danger: {
      jsx: (0, import_jsx_runtime44.jsx)("g", {
        fill: "currentColor",
        children: (0, import_jsx_runtime44.jsx)("path", {
          d: "M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172 L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259 c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227 c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554 c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47 C281.638,399.11,270.06,411.018,256.498,411.018z",
        }),
      }),
      viewBox: "0 0 512 512",
    },
    "dots-vertical": {
      jsx: (0, import_jsx_runtime44.jsxs)("g", {
        fill: "currentColor",
        children: [
          (0, import_jsx_runtime44.jsx)("circle", { r: 2, cx: 10, cy: 4 }),
          (0, import_jsx_runtime44.jsx)("circle", { r: 2, cx: 10, cy: 10 }),
          (0, import_jsx_runtime44.jsx)("circle", { r: 2, cx: 10, cy: 16 }),
        ],
      }),
      viewBox: "0 0 20 20",
    },
  };

  // ../design/dist/components/Checkmark.js
  var import_jsx_runtime46 = __toESM(require_jsx_runtime(), 1);

  // ../design/dist/components/DailyInterval.js
  var import_jsx_runtime47 = __toESM(require_jsx_runtime(), 1);
  var import_react3 = __toESM(require_react(), 1);

  // ../design/dist/hooks/useFormattedDate.js
  var import_react2 = __toESM(require_react(), 1);

  // ../design/dist/components/DateTime.js
  var import_jsx_runtime48 = __toESM(require_jsx_runtime(), 1);

  // ../design/dist/components/InputField.js
  var import_jsx_runtime49 = __toESM(require_jsx_runtime(), 1);
  var import_react4 = __toESM(require_react(), 1);

  // ../design/dist/components/Logo.js
  var import_jsx_runtime50 = __toESM(require_jsx_runtime(), 1);
  var Logo = ({ animated, size }) =>
    (0, import_jsx_runtime50.jsxs)("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      fill: "none",
      width: size,
      height: size,
      children: [
        (0, import_jsx_runtime50.jsx)("circle", {
          cx: "256",
          cy: "256",
          r: "255",
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          fill: "#16e0c8",
          d: "M96 154.426l160 92.376v189L96 343.426z",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                begin: "0.4s",
                attributeName: "fill-opacity",
                values: "0;1",
                dur: "1s",
                repeatCount: "1",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          fill: "#6adbc6",
          d: "M256 247.198l160-92.376v189l-160 92.376z",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                begin: "0.8s",
                attributeName: "fill-opacity",
                values: "0;1",
                dur: "1s",
                repeatCount: "1",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          fill: "#28ebc6",
          d: "M256.142 63.392l160.09 92.207-160.09 92.207-160.089-92.207z",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                begin: "0s",
                attributeName: "fill-opacity",
                values: "0;1",
                dur: "1s",
                repeatCount: "1",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          d: "M416 155L256 64v107l66 38z",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                begin: "0.4s",
                attributeName: "fill-opacity",
                values: "0;0.17",
                dur: "0.1s",
                repeatCount: "1",
                fill: "freeze",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          d: "M256 435V330l67-39 93 52z",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                begin: "0.4s",
                attributeName: "fill-opacity",
                values: "0;0.17",
                dur: "0.1s",
                repeatCount: "1",
                fill: "freeze",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          d: "M189 210l-92-55v188l92-52z",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                begin: "0.4s",
                attributeName: "fill-opacity",
                values: "0;0.17",
                dur: "0.1s",
                repeatCount: "1",
                fill: "freeze",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsxs)("g", {
          fill: "#333",
          fillOpacity: ".17",
          children: [
            (0, import_jsx_runtime50.jsx)("path", {
              d: "M195 213.583l60 34.641v74l-60-34.64z",
              children: animated
                ? (0, import_jsx_runtime50.jsx)("animate", {
                    begin: "0s",
                    attributeName: "width",
                    values: "0;60",
                    dur: "0.4s",
                    repeatCount: "1",
                  })
                : null,
            }),
            (0, import_jsx_runtime50.jsx)("path", {
              d: "M257 248.621l60-34.641v74l-60 34.641z",
              children: animated
                ? (0, import_jsx_runtime50.jsx)("animate", {
                    begin: "0s",
                    attributeName: "width",
                    values: "0;60",
                    dur: "0.4s",
                    repeatCount: "1",
                  })
                : null,
            }),
            (0, import_jsx_runtime50.jsx)("path", {
              d: "M256.142 177.498l60.034 34.577-60.034 34.578-60.033-34.578z",
              children: animated
                ? (0, import_jsx_runtime50.jsx)("animate", {
                    begin: "0s",
                    attributeName: "width",
                    values: "0;60",
                    dur: "0.4s",
                    repeatCount: "1",
                  })
                : null,
            }),
          ],
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          d: "M416 155L256 64 97 155v188l159 92 160-92V230l-66 41",
          stroke: "#09eae5",
          strokeWidth: "17",
          strokeDasharray: "1114",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                attributeName: "stroke-dashoffset",
                values: "1114;0",
                dur: "1.2s",
                repeatCount: "1",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("circle", {
          cx: "416",
          cy: "155",
          r: "9",
          fill: "#09eae5",
        }),
        (0, import_jsx_runtime50.jsx)("circle", {
          cx: "350",
          cy: "271",
          r: "0",
          fill: "#09eae5",
          children: animated
            ? (0, import_jsx_runtime50.jsx)("animate", {
                attributeName: "r",
                values: "0;17;9",
                begin: "1.17s",
                dur: "0.25s",
                repeatCount: "1",
                fill: "freeze",
              })
            : null,
        }),
        (0, import_jsx_runtime50.jsx)("path", {
          d: "M322 209l-66-38-67 39v81l67 39 67-39v-41l-38 21",
          stroke: "#333",
          strokeWidth: "17",
          strokeDasharray: "1114",
        }),
        (0, import_jsx_runtime50.jsx)("circle", {
          cx: "322",
          cy: "209",
          r: "9",
          fill: "#333",
        }),
        (0, import_jsx_runtime50.jsx)("circle", {
          cx: "285",
          cy: "271",
          r: "9",
          fill: "#333",
        }),
      ],
    });

  // ../design/dist/components/Modal.js
  var import_jsx_runtime51 = __toESM(require_jsx_runtime(), 1);
  var import_react5 = __toESM(require_react(), 1);

  // ../design/dist/components/Navbar.js
  var import_jsx_runtime52 = __toESM(require_jsx_runtime(), 1);
  var import_react6 = __toESM(require_react(), 1);

  // ../design/dist/components/OutputField.js
  var import_jsx_runtime53 = __toESM(require_jsx_runtime(), 1);

  // ../design/dist/components/SelectField.js
  var import_jsx_runtime54 = __toESM(require_jsx_runtime(), 1);
  var import_react7 = __toESM(require_react(), 1);

  // ../design/dist/components/Tabs.js
  var import_jsx_runtime55 = __toESM(require_jsx_runtime(), 1);

  // ../design/dist/hooks/useOfflineDetection.js
  var import_react8 = __toESM(require_react(), 1);

  // ../locators/dist/FQDNs.js
  var topLevelDomain = "ggbot2.com";
  var apiDomain = `api.${topLevelDomain}`;
  var apiNextDomain = `api-next.${topLevelDomain}`;
  var apiLocalDomain = `api-local.${topLevelDomain}`;
  var assetsDomain = `assets.${topLevelDomain}`;
  var userWebappDomain = `app.${topLevelDomain}`;
  var userWebappNextDomain = `app-next.${topLevelDomain}`;
  var wwwDomain = `www.${topLevelDomain}`;

  // ../locators/dist/baseURLs.js
  var _ApiBaseURL = class extends URL {
    constructor(deployStage) {
      super(
        deployStage === "main"
          ? _ApiBaseURL.main
          : deployStage === "next"
          ? _ApiBaseURL.next
          : _ApiBaseURL.local
      );
    }
  };
  var ApiBaseURL = _ApiBaseURL;
  __publicField(ApiBaseURL, "local", `https://${apiLocalDomain}`);
  __publicField(ApiBaseURL, "main", `https://${apiDomain}`);
  __publicField(ApiBaseURL, "next", `https://${apiNextDomain}`);
  var _UserWebappBaseURL = class extends URL {
    constructor(deployStage) {
      super(
        deployStage === "main"
          ? _UserWebappBaseURL.main
          : deployStage === "next"
          ? _UserWebappBaseURL.next
          : _UserWebappBaseURL.local
      );
    }
  };
  var UserWebappBaseURL = _UserWebappBaseURL;
  __publicField(UserWebappBaseURL, "local", "http://localhost:3000");
  __publicField(UserWebappBaseURL, "main", `https://${userWebappDomain}`);
  __publicField(UserWebappBaseURL, "next", `https://${userWebappNextDomain}`);

  // ../locators/dist/emailAddresses.js
  var noReplyEmailAddress = `noreply@${topLevelDomain}`;

  // ../locators/dist/pathnames.js
  var pathname = {
    homePage: () => "/",
    // TODO should be /privacy.html
    privacyPolicyPage: () => "/privacy",
    subscriptionCanceledPage: () => "/subscription/canceled",
    subscriptionPurchasedPage: () => "/subscription/purchased",
    // TODO should be /terms.html
    termsOfServicePage: () => "/terms",
    utrustCallback: () => "/utrust/callback",
    utrustOrder: () => "/utrust/order",
  };

  // ../locators/dist/URLs.js
  var UserWebappHomepageURL = class extends URL {
    constructor(userWebappBaseURL) {
      super(pathname.homePage(), userWebappBaseURL);
    }
  };

  // ../models/dist/countries.js
  var allowedCountryIsoCodes2 = [
    "AT",
    "FR",
    "IT",
    "DE",
    "ES",
    "GB",
    "GR",
    "NL",
    "PT",
  ];
  var isAllowedCountryIsoCode2 = isLiteralType(allowedCountryIsoCodes2);

  // ../models/dist/email.js
  var isEmailAddress = (arg) => {
    if (typeof arg !== "string") return false;
    const parts = arg.split("@");
    if (parts.length !== 2) return false;
    const [firstPart, domain] = parts;
    if (firstPart === "") return false;
    const domainParts = domain.split(".");
    if (domainParts.length < 2) return false;
    const domainExtension = domainParts.pop();
    if (domainExtension === "") return false;
    return true;
  };

  // ../models/dist/item.js
  var isItemId = (arg) =>
    typeof arg === "string" && arg.length === nullId.length;
  var nullId = "00000000";

  // ../models/dist/name.js
  var isName = (arg) => isNonEmptyString(arg);

  // ../models/dist/time.js
  var isCreationTime = objectTypeGuard(({ whenCreated }) =>
    isTime(whenCreated)
  );
  var isCreationDay = objectTypeGuard(({ creationDay }) => isDay(creationDay));
  var createdNow = () => ({ whenCreated: now() });
  var isDeletionTime = objectTypeGuard(({ whenDeleted }) =>
    isTime(whenDeleted)
  );
  var isUpdateTime = objectTypeGuard(({ whenUpdated }) => isTime(whenUpdated));

  // ../models/dist/account.js
  var isAccount = objectTypeGuard(
    ({ id, country, email, name, ...creationTime }) =>
      isItemId(id) &&
      isEmailAddress(email) &&
      isCreationTime(creationTime) &&
      (country === void 0 ? true : isAllowedCountryIsoCode2(country)) &&
      (name === void 0 ? true : isName(name))
  );
  var isAccountKey = objectTypeGuard(({ accountId }) => isItemId(accountId));
  var isReadAccountInput = objectTypeGuard((accountKey) =>
    isAccountKey(accountKey)
  );
  var isRenameAccountInput = objectTypeGuard(
    ({ name, ...accountKey }) => isName(name) && isAccountKey(accountKey)
  );
  var isSetAccountCountryInput = objectTypeGuard(
    ({ country, ...accountKey }) =>
      isAllowedCountryIsoCode2(country) && isAccountKey(accountKey)
  );

  // ../models/dist/accountDailyOrders.js
  var isAccountDailyOrdersKey = objectTypeGuard(
    ({ day, ...key }) => isDay(day) && isAccountKey(key)
  );

  // ../models/dist/strategy.js
  var strategyKinds = ["binance"];
  var isStrategyKind = isLiteralType(strategyKinds);
  var isStrategy = objectTypeGuard(
    ({ id, name, kind, ...accountKey }) =>
      isItemId(id) &&
      isAccountKey(accountKey) &&
      isStrategyKind(kind) &&
      isName(name)
  );
  var isStrategyKey = objectTypeGuard(
    ({ strategyId, strategyKind }) =>
      isItemId(strategyId) && isStrategyKind(strategyKind)
  );
  var isCopyStrategyInput = objectTypeGuard(
    ({ name, ...accountStrategyKey }) =>
      isAccountStrategyKey(accountStrategyKey) && isName(name)
  );
  var isCreateStrategyInput = objectTypeGuard(
    ({ name, kind, ...accountKey }) =>
      isAccountKey(accountKey) && isName(name) && isStrategyKind(kind)
  );
  var isReadStrategyInput = objectTypeGuard((strategyKey) =>
    isStrategyKey(strategyKey)
  );
  var isRenameStrategyInput = objectTypeGuard(
    ({ name, ...accountStrategyKey }) =>
      isName(name) && isAccountStrategyKey(accountStrategyKey)
  );
  var isDeleteStrategyInput = objectTypeGuard((accountStrategyKey) =>
    isAccountStrategyKey(accountStrategyKey)
  );

  // ../models/dist/frequency.js
  var frequencyIntervals = ["1h", "1m"];
  var isFrequencyInterval = isLiteralType(frequencyIntervals);
  var isFrequency = (arg) => {
    if (typeof arg !== "object" || arg === null) return false;
    const { every, interval } = arg;
    return isNaturalNumber(every) && isFrequencyInterval(interval);
  };

  // ../models/dist/scheduling.js
  var SchedulingStatuses = ["active", "inactive", "suspended"];
  var isSchedulingStatus = isLiteralType(SchedulingStatuses);
  var isScheduling = objectTypeGuard(
    ({ frequency, status }) =>
      isFrequency(frequency) && isSchedulingStatus(status)
  );

  // ../node_modules/dflow/dist/dflow.js
  var __defProp2 = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp2 = (obj, key, value) =>
    key in obj
      ? __defProp2(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp2.call(b, prop)) __defNormalProp2(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop)) __defNormalProp2(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __publicField2 = (obj, key, value) => {
    __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var generateItemId = (itemMap, idPrefix, wantedId) => {
    if (wantedId && !itemMap.has(wantedId)) return wantedId;
    const id = `${idPrefix}${itemMap.size}`;
    return itemMap.has(id) ? generateItemId(itemMap, idPrefix) : id;
  };
  var _Dflow = class {
    static inferDataType(arg) {
      if (_Dflow.isBoolean(arg)) return ["boolean"];
      if (_Dflow.isNumber(arg)) return ["number"];
      if (_Dflow.isString(arg)) return ["string"];
      if (_Dflow.isArray(arg)) return ["array"];
      if (_Dflow.isObject(arg)) return ["object"];
      return [];
    }
    static isArray(arg) {
      return Array.isArray(arg) && arg.every(_Dflow.isDflowData);
    }
    static isBoolean(arg) {
      return typeof arg === "boolean";
    }
    static isDflowId(arg) {
      return typeof arg === "string" && arg !== "";
    }
    static isObject(arg) {
      return (
        typeof arg === "object" &&
        arg !== null &&
        !Array.isArray(arg) &&
        Object.values(arg).every(_Dflow.isDflowData)
      );
    }
    static isNumber(arg) {
      return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
    }
    static isString(arg) {
      return typeof arg === "string";
    }
    static isDflowData(arg) {
      if (arg === void 0) return false;
      return (
        _Dflow.isString(arg) ||
        _Dflow.isBoolean(arg) ||
        _Dflow.isNumber(arg) ||
        _Dflow.isObject(arg) ||
        _Dflow.isArray(arg) ||
        _Dflow.isDflowId(arg)
      );
    }
    static isValidDataType(types, data) {
      const isAnyType = types.length === 0;
      if (isAnyType) return true;
      return types.some((pinType) => {
        switch (pinType) {
          case "array":
            return _Dflow.isArray(data);
          case "boolean":
            return _Dflow.isBoolean(data);
          case "number":
            return _Dflow.isNumber(data);
          case "object":
            return _Dflow.isObject(data);
          case "string":
            return _Dflow.isString(data);
          case "DflowId":
            return _Dflow.isDflowId(data);
          default:
            return false;
        }
      });
    }
  };
  var Dflow = _Dflow;
  __publicField2(Dflow, "dataTypes", [
    "string",
    "number",
    "boolean",
    "object",
    "array",
    "DflowId",
  ]);
  var DflowPin = class {
    constructor({ nodeId, name, types = [] }) {
      __publicField2(this, "name");
      __publicField2(this, "nodeId");
      __publicField2(this, "types");
      if (name) this.name = name;
      this.types = types;
      this.nodeId = nodeId;
    }
    static canConnect(sourceTypes, targetTypes) {
      const sourceHasTypeAny = sourceTypes.length === 0;
      if (sourceHasTypeAny) return true;
      const targetHasTypeAny = targetTypes.length === 0;
      if (targetHasTypeAny) return true;
      return targetTypes.some((pinType) => sourceTypes.includes(pinType));
    }
    get hasTypeAny() {
      return this.types.length === 0;
    }
    hasType(type) {
      return this.hasTypeAny || this.types.includes(type);
    }
  };
  var DflowInput = class extends DflowPin {
    constructor(_a) {
      var _b = _a,
        { id, optional } = _b,
        pin = __objRest(_b, ["id", "optional"]);
      super(pin);
      __publicField2(this, "id");
      __publicField2(this, "source");
      __publicField2(this, "optional");
      this.id = id;
      if (optional) this.optional = optional;
    }
    get data() {
      var _a;
      return (_a = this.source) == null ? void 0 : _a.data;
    }
    get isConnected() {
      return this.source !== void 0;
    }
    connectTo(pin) {
      if (!DflowPin.canConnect(pin.types, this.types)) {
        throw new DflowErrorCannotConnectPins({
          source: [pin.nodeId, pin.id],
          target: [this.nodeId, this.id],
        });
      }
      this.source = pin;
    }
    disconnect() {
      this.source = void 0;
    }
    toObject() {
      return { id: this.id };
    }
  };
  var DflowOutput = class extends DflowPin {
    constructor(_c) {
      var _d = _c,
        { id, data } = _d,
        pin = __objRest(_d, ["id", "data"]);
      super(pin);
      __publicField2(this, "id");
      __publicField2(this, "value");
      this.id = id;
      this.value = data;
    }
    get data() {
      return this.value;
    }
    set data(arg) {
      if (arg === void 0) {
        this.clear();
        return;
      }
      if (
        (this.hasType("string") && Dflow.isString(arg)) ||
        (this.hasType("number") && Dflow.isNumber(arg)) ||
        (this.hasType("boolean") && Dflow.isBoolean(arg)) ||
        (this.hasType("object") && Dflow.isObject(arg)) ||
        (this.hasType("array") && Dflow.isArray(arg)) ||
        (this.hasType("DflowId") && Dflow.isDflowId(arg)) ||
        (this.hasTypeAny && Dflow.isDflowData(arg))
      ) {
        this.value = arg;
      } else this.clear();
    }
    clear() {
      this.value = void 0;
    }
    toObject() {
      const obj = { id: this.id };
      if (this.value !== void 0) obj.d = this.value;
      return obj;
    }
  };
  var DflowNode = class {
    constructor({ id, kind, inputs = [], outputs = [], host }) {
      __publicField2(this, "id");
      __publicField2(this, "inputsMap", /* @__PURE__ */ new Map());
      __publicField2(this, "outputsMap", /* @__PURE__ */ new Map());
      __publicField2(this, "inputPosition", []);
      __publicField2(this, "outputPosition", []);
      __publicField2(this, "kind");
      __publicField2(this, "host");
      this.id = id;
      this.host = host;
      this.kind = kind;
      for (const obj of inputs) {
        const id1 = generateItemId(this.inputsMap, "i", obj.id);
        const input2 = new DflowInput(
          __spreadProps(__spreadValues({}, obj), { id: id1, nodeId: this.id })
        );
        this.inputsMap.set(id1, input2);
        this.inputPosition.push(id1);
      }
      for (const obj1 of outputs) {
        const id2 = generateItemId(this.outputsMap, "o", obj1.id);
        const output2 = new DflowOutput(
          __spreadProps(__spreadValues({}, obj1), { id: id2, nodeId: this.id })
        );
        this.outputsMap.set(id2, output2);
        this.outputPosition.push(id2);
      }
    }
    static input(typing = [], rest) {
      return __spreadValues(
        { types: typeof typing === "string" ? [typing] : typing },
        rest
      );
    }
    static output(typing = [], rest) {
      return __spreadValues(
        { types: typeof typing === "string" ? [typing] : typing },
        rest
      );
    }
    get inputsDataAreValid() {
      for (const { data, types, optional } of this.inputsMap.values()) {
        if (optional && data === void 0) continue;
        if (Dflow.isValidDataType(types, data)) continue;
        return false;
      }
      return true;
    }
    clearOutputs() {
      for (const output2 of this.outputsMap.values()) output2.clear();
    }
    getInputById(id) {
      const item = this.inputsMap.get(id);
      if (!item) throw new DflowErrorItemNotFound("input", { id });
      return item;
    }
    input(position) {
      const pinId = this.inputPosition[position];
      if (!pinId) {
        throw new DflowErrorItemNotFound("input", {
          id: this.id,
          nodeId: this.id,
          position,
        });
      }
      return this.getInputById(pinId);
    }
    getOutputById(id) {
      const item = this.outputsMap.get(id);
      if (!item) {
        throw new DflowErrorItemNotFound("output", { id, nodeId: this.id });
      }
      return item;
    }
    output(position) {
      const pinId = this.outputPosition[position];
      if (!pinId) {
        throw new DflowErrorItemNotFound("output", {
          nodeId: this.id,
          position,
        });
      }
      return this.getOutputById(pinId);
    }
    run() {}
    toObject() {
      const obj = { id: this.id, k: this.kind };
      const inputs = [...this.inputsMap.values()].map((item) =>
        item.toObject()
      );
      if (inputs.length > 0) obj.i = inputs;
      const outputs = [...this.outputsMap.values()].map((item) =>
        item.toObject()
      );
      if (outputs.length > 0) obj.o = outputs;
      return obj;
    }
  };
  var _DflowGraph = class {
    constructor({ nodesCatalog }) {
      __publicField2(this, "nodesCatalog");
      __publicField2(this, "nodesMap", /* @__PURE__ */ new Map());
      __publicField2(this, "edgesMap", /* @__PURE__ */ new Map());
      __publicField2(this, "runStatus", null);
      __publicField2(this, "executionReport", null);
      this.nodesCatalog = __spreadValues(
        __spreadValues({}, nodesCatalog),
        coreNodesCatalog
      );
    }
    static childrenOfNodeId(nodeId, nodeConnections) {
      return nodeConnections
        .filter(({ sourceId }) => nodeId === sourceId)
        .map(({ targetId }) => targetId);
    }
    static parentsOfNodeId(nodeId, nodeConnections) {
      return nodeConnections
        .filter(({ targetId }) => nodeId === targetId)
        .map(({ sourceId }) => sourceId);
    }
    static ancestorsOfNodeId(nodeId, nodeConnections) {
      const parentsNodeIds = _DflowGraph.parentsOfNodeId(
        nodeId,
        nodeConnections
      );
      if (parentsNodeIds.length === 0) return [];
      return parentsNodeIds.reduce(
        (accumulator, parentNodeId, index, array) => {
          const ancestors = _DflowGraph.ancestorsOfNodeId(
            parentNodeId,
            nodeConnections
          );
          const result = accumulator.concat(ancestors);
          return index === array.length - 1
            ? [...new Set(array.concat(result))]
            : result;
        },
        []
      );
    }
    static levelOfNodeId(nodeId, nodeConnections) {
      const parentsNodeIds = _DflowGraph.parentsOfNodeId(
        nodeId,
        nodeConnections
      );
      if (parentsNodeIds.length === 0) return 0;
      let maxLevel = 0;
      for (const parentNodeId of parentsNodeIds) {
        const level = _DflowGraph.levelOfNodeId(parentNodeId, nodeConnections);
        maxLevel = Math.max(level, maxLevel);
      }
      return maxLevel + 1;
    }
    get nodeConnections() {
      return [...this.edgesMap.values()].map((edge) => ({
        sourceId: edge.source[0],
        targetId: edge.target[0],
      }));
    }
    get nodeIdsInsideFunctions() {
      const ancestorsOfReturnNodes = [];
      for (const node of [...this.nodesMap.values()]) {
        if (node.kind === "return") {
          ancestorsOfReturnNodes.push(
            _DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections)
          );
        }
      }
      return [...new Set(ancestorsOfReturnNodes.flat())];
    }
    static sortNodesByLevel(nodeIds, nodeConnections) {
      const levelOf = {};
      for (const nodeId of nodeIds) {
        levelOf[nodeId] = _DflowGraph.levelOfNodeId(nodeId, nodeConnections);
      }
      return nodeIds
        .slice()
        .sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
    }
    async run() {
      this.runStatus = "running";
      const executionReport = {
        status: this.runStatus,
        start: /* @__PURE__ */ new Date().toJSON(),
        end: /* @__PURE__ */ new Date().toJSON(),
        steps: [],
      };
      const nodeIdsExcluded = this.nodeIdsInsideFunctions;
      const nodeIds = _DflowGraph.sortNodesByLevel(
        [...this.nodesMap.keys()].filter(
          (nodeId) => !nodeIdsExcluded.includes(nodeId)
        ),
        this.nodeConnections
      );
      for (const nodeId of nodeIds) {
        const node = this.nodesMap.get(nodeId);
        try {
          if (!node.inputsDataAreValid) {
            const error = new DflowErrorInvalidInputData(nodeId);
            executionReport.steps.push(
              _DflowGraph.executionNodeInfo(node, error.toObject())
            );
            node.clearOutputs();
            continue;
          }
          if (node.run.constructor.name === "AsyncFunction") {
            await node.run();
          } else {
            node.run();
          }
          executionReport.steps.push(_DflowGraph.executionNodeInfo(node));
        } catch (error1) {
          console.error(error1);
          this.runStatus = "failure";
        }
      }
      if (this.runStatus === "running") this.runStatus = "success";
      executionReport.status = this.runStatus;
      executionReport.end = /* @__PURE__ */ new Date().toJSON();
      this.executionReport = executionReport;
    }
    toObject() {
      return {
        nodes: [...this.nodesMap.values()].map((item) => item.toObject()),
        edges: [...this.edgesMap.values()].map((item) => item.toObject()),
      };
    }
  };
  var DflowGraph = _DflowGraph;
  __publicField2(DflowGraph, "executionNodeInfo", (node, error) => {
    const { id, k, o } = node.toObject();
    const info = { id, k };
    if (o) info.o = o;
    if (error) info.err = error;
    return info;
  });
  var { input, output } = DflowNode;
  var DflowNodeArgument = class extends DflowNode {};
  __publicField2(DflowNodeArgument, "kind", "argument");
  __publicField2(DflowNodeArgument, "inputs", [
    input("number", { name: "position", optional: true }),
  ]);
  __publicField2(DflowNodeArgument, "outputs", [output()]);
  var DflowNodeData = class extends DflowNode {
    constructor(_e) {
      var _f = _e,
        { outputs } = _f,
        rest = __objRest(_f, ["outputs"]);
      super(
        __spreadValues(
          {
            outputs:
              outputs == null
                ? void 0
                : outputs.map((output2) =>
                    __spreadProps(__spreadValues({}, output2), {
                      types: Dflow.inferDataType(output2.data),
                    })
                  ),
          },
          rest
        )
      );
    }
  };
  __publicField2(DflowNodeData, "kind", "data");
  __publicField2(DflowNodeData, "outputs", [output()]);
  var DflowNodeFunction = class extends DflowNode {
    constructor(arg) {
      super(arg);
      this.output(0).data = this.id;
    }
  };
  __publicField2(DflowNodeFunction, "kind", "function");
  __publicField2(DflowNodeFunction, "outputs", [
    output("DflowId", { name: "id" }),
  ]);
  var DflowNodeReturn = class extends DflowNode {};
  __publicField2(DflowNodeReturn, "kind", "return");
  __publicField2(DflowNodeReturn, "inputs", [
    input("DflowId", { name: "functionId" }),
    input([], { name: "value" }),
  ]);
  var coreNodesCatalog = {
    [DflowNodeArgument.kind]: DflowNodeArgument,
    [DflowNodeData.kind]: DflowNodeData,
    [DflowNodeFunction.kind]: DflowNodeFunction,
    [DflowNodeReturn.kind]: DflowNodeReturn,
  };
  var _DflowErrorCannotConnectPins = class extends Error {
    constructor({ source, target }) {
      super(_DflowErrorCannotConnectPins.message({ s: source, t: target }));
      __publicField2(this, "source");
      __publicField2(this, "target");
      this.source = source;
      this.target = target;
    }
    static message({ s, t }) {
      return `Cannot connect source ${s.join()} to target ${t.join()}`;
    }
    toObject() {
      return {
        _: _DflowErrorCannotConnectPins.code,
        s: this.source,
        t: this.target,
      };
    }
  };
  var DflowErrorCannotConnectPins = _DflowErrorCannotConnectPins;
  __publicField2(DflowErrorCannotConnectPins, "code", "01");
  var _DflowErrorInvalidInputData = class extends Error {
    constructor(nodeId) {
      super(_DflowErrorInvalidInputData.message({ nId: nodeId }));
      __publicField2(this, "nodeId");
      this.nodeId = nodeId;
    }
    static message({ nId: nodeId }) {
      return `Invalid input data in node ${nodeId}`;
    }
    toObject() {
      return { _: _DflowErrorInvalidInputData.code, nId: this.nodeId };
    }
  };
  var DflowErrorInvalidInputData = _DflowErrorInvalidInputData;
  __publicField2(DflowErrorInvalidInputData, "code", "02");
  var _DflowErrorItemNotFound = class extends Error {
    constructor(item, info = {}) {
      super(
        _DflowErrorItemNotFound.message({
          item,
          id: info.id,
          nId: info.nodeId,
          p: info.position,
        })
      );
      __publicField2(this, "item");
      __publicField2(this, "info");
      this.item = item;
      this.info = info;
    }
    static message({ item, id, nId: nodeId, p: position }) {
      return `Not found ${[
        `item=${item}`,
        id ? `id=${id}` : "",
        nodeId ? `nodeId=${nodeId}` : "",
        position ? `position=${position}` : "",
      ]
        .filter((str) => str !== "")
        .join()}`;
    }
    toObject() {
      const {
        item,
        info: { id, nodeId, position },
      } = this;
      const obj = { item, _: _DflowErrorItemNotFound.code };
      if (id) obj.id = id;
      if (nodeId) obj.nId = nodeId;
      if (position) obj.p = position;
      return obj;
    }
  };
  var DflowErrorItemNotFound = _DflowErrorItemNotFound;
  __publicField2(DflowErrorItemNotFound, "code", "03");
  var _DflowErrorCannotExecuteAsyncFunction = class extends Error {
    static message() {
      return "dflow executeFunction() cannot execute async functions";
    }
    constructor() {
      super(_DflowErrorCannotExecuteAsyncFunction.message());
    }
    toObject() {
      return { _: _DflowErrorCannotExecuteAsyncFunction.code };
    }
  };
  var DflowErrorCannotExecuteAsyncFunction =
    _DflowErrorCannotExecuteAsyncFunction;
  __publicField2(DflowErrorCannotExecuteAsyncFunction, "code", "04");

  // ../models/dist/strategyInput.js
  var isStrategyInput = (arg) => {
    if (arg === null || typeof arg !== "object" || Array.isArray(arg))
      return false;
    return (
      Object.keys(arg).every((key) => typeof key === "string") &&
      Object.values(arg).every((value) => Dflow.isDflowData(value))
    );
  };

  // ../models/dist/strategyScheduling.js
  var isStrategyScheduling = objectTypeGuard(
    ({ id, input: input2, ...scheduling }) =>
      isItemId(id) && isScheduling(scheduling) && input2 === void 0
        ? true
        : isStrategyInput(input2)
  );
  var isStrategySchedulings = arrayTypeGuard(isStrategyScheduling);

  // ../models/dist/accountStrategy.js
  var isAccountStrategyKey = objectTypeGuard(
    ({ accountId, ...strategyKey }) =>
      isAccountKey({ accountId }) && isStrategyKey(strategyKey)
  );
  var isAccountStrategy = objectTypeGuard(
    ({ name, schedulings, ...strategyKey }) =>
      isStrategyKey(strategyKey) &&
      isName(name) &&
      isStrategySchedulings(schedulings)
  );

  // ../models/dist/accountStrategies.js
  var isAccountStrategies = arrayTypeGuard(isAccountStrategy);
  var isWriteAccountStrategiesItemSchedulingsInput = objectTypeGuard(
    ({ accountId, strategyId, schedulings }) =>
      isItemId(accountId) &&
      isItemId(strategyId) &&
      isStrategySchedulings(schedulings)
  );

  // ../arithmetic/dist/decimal.js
  var isDecimal = (arg) => {
    if (typeof arg !== "string") return false;
    return isMaybeDecimal(arg);
  };
  var isMaybeDecimal = (arg) => {
    const n = Number(arg);
    if (typeof n !== "number" || isNaN(n) || !Number.isFinite(n)) return false;
    return true;
  };

  // ../models/dist/balance.js
  var isBalance = objectTypeGuard(
    ({ asset, free, locked }) =>
      isNonEmptyString(asset) && isDecimal(free) && isDecimal(locked)
  );
  var isBalances = arrayTypeGuard(isBalance);

  // ../models/dist/balanceChangeEvent.js
  var isBalanceChangeEvent = objectTypeGuard(
    ({ balances, ...creationTime }) =>
      isCreationTime(creationTime) && isBalances(balances)
  );
  var isBalanceChangeEvents = arrayTypeGuard(isBalanceChangeEvent);

  // ../models/dist/binanceApiConfig.js
  var isBinanceApiConfig = objectTypeGuard(
    ({ apiKey, apiSecret }) =>
      isNonEmptyString(apiKey) && isNonEmptyString(apiSecret)
  );
  var isCreateBinanceApiConfigInput = objectTypeGuard(
    ({ apiKey, apiSecret, ...accountKey }) =>
      isAccountKey(accountKey) && isBinanceApiConfig({ apiKey, apiSecret })
  );

  // ../models/dist/emailAccount.js
  var isEmailAccount = objectTypeGuard(
    ({ accountId, email, ...creationTime }) =>
      isAccountKey({ accountId }) &&
      isCreationTime(creationTime) &&
      isEmailAddress(email)
  );

  // ../models/dist/oneTimePassword.js
  var oneTimePasswordCodeLength = 6;
  var isOneTimePasswordCode = (arg) =>
    typeof arg === "string" && arg.length === oneTimePasswordCodeLength;
  var isOneTimePassword = objectTypeGuard(
    ({ code, ...creationTime }) =>
      isOneTimePasswordCode(code) && isCreationTime(creationTime)
  );

  // ../models/dist/order.js
  var isOrder = objectTypeGuard(
    ({ id, info, ...creationTime }) =>
      isItemId(id) && isCreationTime(creationTime) && Dflow.isObject(info)
  );
  var isOrders = arrayTypeGuard(isOrder);

  // ../models/dist/paymentProviders.js
  var paymentProviders = ["utrust"];
  var isPaymentProvider = isLiteralType(paymentProviders);

  // ../models/dist/strategyBalance.js
  var isStrategyBalance = objectTypeGuard(
    ({ day, data }) => isDay(day) && isBalanceChangeEvents(data)
  );
  var isReadStrategyBalancesInput = objectTypeGuard(
    ({ start, end, ...accountStrategyKey }) =>
      isDayInterval({ start, end }) && isAccountStrategyKey(accountStrategyKey)
  );

  // ../models/dist/strategyDailyBalanceChanges.js
  var isStrategyDailyBalanceChangesKey = objectTypeGuard(
    ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
  );

  // ../models/dist/strategyDailyOrders.js
  var isStrategyDailyOrdersKey = objectTypeGuard(
    ({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
  );

  // ../models/dist/strategyExecution.js
  var isStrategyExecutionStatus = isLiteralType(["success", "failure"]);
  var isStrategyExecution = objectTypeGuard(
    ({ status, balances, steps, ...updateTime }) =>
      isUpdateTime(updateTime) &&
      isStrategyExecutionStatus(status) &&
      isBalances(balances) && // TODO isDflowExecutionNodeInfo(steps)
      Array.isArray(steps)
  );
  var isExecuteStrategyInput = objectTypeGuard((accountStrategyKey) =>
    isAccountStrategyKey(accountStrategyKey)
  );

  // ../models/dist/strategyFlow.js
  var isStrategyFlow = objectTypeGuard(
    ({ view, ...updateTime }) => isMaybeObject(view) && isUpdateTime(updateTime)
    //TODO is FlowViewSerializableGraph(view)
  );
  var isReadStrategyFlowInput = objectTypeGuard((strategyKey) =>
    isStrategyKey(strategyKey)
  );
  var isWriteStrategyFlowInput = objectTypeGuard(
    ({ view, ...accountStrategyKey }) =>
      isMaybeObject(view) && isAccountStrategyKey(accountStrategyKey)
  );

  // ../models/dist/strategyOrders.js
  var isReadStrategyOrdersInput = objectTypeGuard(
    ({ start, end, ...accountStrategyKey }) =>
      isDayInterval({ start, end }) && isAccountStrategyKey(accountStrategyKey)
  );

  // ../models/dist/subscription.js
  var subscriptionPlans = ["basic"];
  var isSubscriptionPlan = isLiteralType(subscriptionPlans);
  var subscriptionStatuses = ["active", "expired"];
  var isSubscriptionStatus = isLiteralType(subscriptionStatuses);
  var isSubscription = objectTypeGuard(
    ({ plan, end }) => isSubscriptionPlan(plan) && isDay(end)
  );

  // ../models/dist/subscriptionPurchase.js
  var subscriptionPurchaseStatuses = ["completed", "canceled", "pending"];
  var isSubscriptionPurchaseStatus = isLiteralType(
    subscriptionPurchaseStatuses
  );
  var isSubscriptionPurchase = objectTypeGuard(
    ({
      id,
      plan,
      paymentProvider,
      status,
      whenCreated,
      info,
      ...dayInterval
    }) =>
      isItemId(id) &&
      isSubscriptionPlan(plan) &&
      isPaymentProvider(paymentProvider) &&
      isCreationTime({ whenCreated }) &&
      isDayInterval(dayInterval) &&
      isSubscriptionPurchaseStatus(status) &&
      info === void 0
        ? true
        : isMaybeObject(info)
  );
  var isSubscriptionPurchaseKey = objectTypeGuard(
    ({ day, accountId, purchaseId }) =>
      isItemId(accountId) && isDay(day) && isItemId(purchaseId)
  );

  // src/pages/homepage.tsx
  var import_react9 = __toESM(require_react(), 1);
  var import_jsx_runtime56 = __toESM(require_jsx_runtime(), 1);
  var userWebappHomepageURL = new UserWebappHomepageURL("main");
  var Page = () => {
    const [isFirstPageview, setIsFirstPageview] = (0, import_react9.useState)(
      false
    );
    (0, import_react9.useEffect)(() => {
      const storageKey = "first-page-view";
      const firstPageView = sessionStorage.getItem(storageKey);
      if (firstPageView) return;
      sessionStorage.setItem(storageKey, JSON.stringify(createdNow()));
      setIsFirstPageview(true);
    }, [setIsFirstPageview]);
    return /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)(Head, {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("title", {
              children: "ggbot2",
            }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("meta", {
              name: "description",
              content: "crypto flow",
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)(Logo, {
              animated: isFirstPageview,
              size: 400,
            }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("div", {
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("h1", {
                  children: [
                    "ggbot",
                    /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("b", {
                      children: "2",
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("i", {
                  children: "crypto flow",
                }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("main", {
          children: /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("a", {
            href: userWebappHomepageURL.toString(),
            children: /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("span", {
              children: "Launch App",
            }),
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime56.jsxs)("footer", {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("a", {
              href: pathname.privacyPolicyPage(),
              children: "Privacy Policy",
            }),
            /* @__PURE__ */ (0, import_jsx_runtime56.jsx)("a", {
              href: pathname.termsOfServicePage(),
              children: "Terms of Service",
            }),
          ],
        }),
      ],
    });
  };
  var homepage_default = Page;
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
