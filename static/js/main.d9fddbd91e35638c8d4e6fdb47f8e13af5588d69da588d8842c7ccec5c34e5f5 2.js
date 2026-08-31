(() => {
  // node_modules/alpinejs/dist/module.esm.js
  var flushPending = false;
  var flushing = false;
  var queue = [];
  var lastFlushedIndex = -1;
  var transactionActive = false;
  function scheduler(callback) {
    queueJob(callback);
  }
  function startTransaction() {
    transactionActive = true;
  }
  function commitTransaction() {
    transactionActive = false;
    queueFlush();
  }
  function queueJob(job) {
    if (!queue.includes(job))
      queue.push(job);
    queueFlush();
  }
  function dequeueJob(job) {
    let index = queue.indexOf(job);
    if (index !== -1 && index > lastFlushedIndex)
      queue.splice(index, 1);
  }
  function queueFlush() {
    if (!flushing && !flushPending) {
      if (transactionActive)
        return;
      flushPending = true;
      queueMicrotask(flushJobs);
    }
  }
  function flushJobs() {
    flushPending = false;
    flushing = true;
    for (let i = 0; i < queue.length; i++) {
      queue[i]();
      lastFlushedIndex = i;
    }
    queue.length = 0;
    lastFlushedIndex = -1;
    flushing = false;
  }
  var reactive;
  var effect;
  var release;
  var raw;
  var shouldSchedule = true;
  function disableEffectScheduling(callback) {
    shouldSchedule = false;
    callback();
    shouldSchedule = true;
  }
  function setReactivityEngine(engine) {
    reactive = engine.reactive;
    release = engine.release;
    effect = (callback) => engine.effect(callback, { scheduler: (task) => {
      if (shouldSchedule) {
        scheduler(task);
      } else {
        task();
      }
    } });
    raw = engine.raw;
  }
  function overrideEffect(override) {
    effect = override;
  }
  function elementBoundEffect(el) {
    let cleanup2 = () => {
    };
    let wrappedEffect = (callback) => {
      let effectReference = effect(callback);
      if (!el._x_effects) {
        el._x_effects = /* @__PURE__ */ new Set();
        el._x_runEffects = () => {
          el._x_effects.forEach((i) => i());
        };
      }
      el._x_effects.add(effectReference);
      cleanup2 = () => {
        if (effectReference === void 0)
          return;
        el._x_effects.delete(effectReference);
        release(effectReference);
      };
      return effectReference;
    };
    return [wrappedEffect, () => {
      cleanup2();
    }];
  }
  function watch(getter, callback) {
    let firstTime = true;
    let oldValue;
    let oldValueJSON;
    let effectReference = effect(() => {
      let value = getter();
      let newJSON = JSON.stringify(value);
      if (!firstTime) {
        if (typeof value === "object" || value !== oldValue) {
          let previousValue = typeof oldValue === "object" ? JSON.parse(oldValueJSON) : oldValue;
          queueMicrotask(() => {
            callback(value, previousValue);
          });
        }
      }
      oldValue = value;
      oldValueJSON = newJSON;
      firstTime = false;
    });
    return () => release(effectReference);
  }
  async function transaction(callback) {
    startTransaction();
    try {
      await callback();
      await Promise.resolve();
    } finally {
      commitTransaction();
    }
  }
  var onAttributeAddeds = [];
  var onElRemoveds = [];
  var onElAddeds = [];
  function onElAdded(callback) {
    onElAddeds.push(callback);
  }
  function onElRemoved(el, callback) {
    if (typeof callback === "function") {
      if (!el._x_cleanups)
        el._x_cleanups = [];
      el._x_cleanups.push(callback);
    } else {
      callback = el;
      onElRemoveds.push(callback);
    }
  }
  function onAttributesAdded(callback) {
    onAttributeAddeds.push(callback);
  }
  function onAttributeRemoved(el, name, callback) {
    if (!el._x_attributeCleanups)
      el._x_attributeCleanups = {};
    if (!el._x_attributeCleanups[name])
      el._x_attributeCleanups[name] = [];
    el._x_attributeCleanups[name].push(callback);
  }
  function cleanupAttributes(el, names) {
    if (!el._x_attributeCleanups)
      return;
    Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
      if (names === void 0 || names.includes(name)) {
        value.forEach((i) => i());
        delete el._x_attributeCleanups[name];
      }
    });
  }
  function cleanupElement(el) {
    el._x_effects?.forEach(dequeueJob);
    while (el._x_cleanups?.length)
      el._x_cleanups.pop()();
  }
  var observer = new MutationObserver(onMutate);
  var currentlyObserving = false;
  function startObservingMutations() {
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
    currentlyObserving = true;
  }
  function stopObservingMutations() {
    flushObserver();
    observer.disconnect();
    currentlyObserving = false;
  }
  var queuedMutations = [];
  function flushObserver() {
    let records = observer.takeRecords();
    queuedMutations.push(() => records.length > 0 && onMutate(records));
    let queueLengthWhenTriggered = queuedMutations.length;
    queueMicrotask(() => {
      if (queuedMutations.length === queueLengthWhenTriggered) {
        while (queuedMutations.length > 0)
          queuedMutations.shift()();
      }
    });
  }
  function mutateDom(callback) {
    if (!currentlyObserving)
      return callback();
    stopObservingMutations();
    let result = callback();
    startObservingMutations();
    return result;
  }
  var isCollecting = false;
  var deferredMutations = [];
  function deferMutations() {
    isCollecting = true;
  }
  function flushAndStopDeferringMutations() {
    isCollecting = false;
    onMutate(deferredMutations);
    deferredMutations = [];
  }
  function onMutate(mutations) {
    if (isCollecting) {
      deferredMutations = deferredMutations.concat(mutations);
      return;
    }
    let addedNodes = [];
    let removedNodes = /* @__PURE__ */ new Set();
    let addedAttributes = /* @__PURE__ */ new Map();
    let removedAttributes = /* @__PURE__ */ new Map();
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].target._x_ignoreMutationObserver)
        continue;
      if (mutations[i].type === "childList") {
        mutations[i].removedNodes.forEach((node) => {
          if (node.nodeType !== 1)
            return;
          if (!node._x_marker)
            return;
          removedNodes.add(node);
        });
        mutations[i].addedNodes.forEach((node) => {
          if (node.nodeType !== 1)
            return;
          if (removedNodes.has(node)) {
            removedNodes.delete(node);
            return;
          }
          if (node._x_marker)
            return;
          addedNodes.push(node);
        });
      }
      if (mutations[i].type === "attributes") {
        let el = mutations[i].target;
        let name = mutations[i].attributeName;
        let oldValue = mutations[i].oldValue;
        let add2 = () => {
          if (!addedAttributes.has(el))
            addedAttributes.set(el, []);
          addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
        };
        let remove = () => {
          if (!removedAttributes.has(el))
            removedAttributes.set(el, []);
          removedAttributes.get(el).push(name);
        };
        if (el.hasAttribute(name) && oldValue === null) {
          add2();
        } else if (el.hasAttribute(name)) {
          remove();
          add2();
        } else {
          remove();
        }
      }
    }
    removedAttributes.forEach((attrs, el) => {
      cleanupAttributes(el, attrs);
    });
    addedAttributes.forEach((attrs, el) => {
      onAttributeAddeds.forEach((i) => i(el, attrs));
    });
    for (let node of removedNodes) {
      if (addedNodes.some((i) => i.contains(node)))
        continue;
      onElRemoveds.forEach((i) => i(node));
    }
    for (let node of addedNodes) {
      if (!node.isConnected)
        continue;
      onElAddeds.forEach((i) => i(node));
    }
    addedNodes = null;
    removedNodes = null;
    addedAttributes = null;
    removedAttributes = null;
  }
  function scope(node) {
    return mergeProxies(closestDataStack(node));
  }
  function addScopeToNode(node, data2, referenceNode) {
    node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
    return () => {
      node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
    };
  }
  function closestDataStack(node) {
    if (node._x_dataStack)
      return node._x_dataStack;
    if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
      return closestDataStack(node.host);
    }
    if (!node.parentNode) {
      return [];
    }
    return closestDataStack(node.parentNode);
  }
  function mergeProxies(objects) {
    return new Proxy({ objects }, mergeProxyTrap);
  }
  function keyInPrototypeChain(obj, key) {
    if (obj === null || obj === Object.prototype)
      return null;
    if (Object.prototype.hasOwnProperty.call(obj, key))
      return obj;
    return keyInPrototypeChain(Object.getPrototypeOf(obj), key);
  }
  var mergeProxyTrap = {
    ownKeys({ objects }) {
      return Array.from(
        new Set(objects.flatMap((i) => Object.keys(i)))
      );
    },
    has({ objects }, name) {
      if (name == Symbol.unscopables)
        return false;
      return objects.some(
        (obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name)
      );
    },
    get({ objects }, name, thisProxy) {
      if (name == "toJSON")
        return collapseProxies;
      return Reflect.get(
        objects.find(
          (obj) => Reflect.has(obj, name)
        ) || {},
        name,
        thisProxy
      );
    },
    set({ objects }, name, value, thisProxy) {
      let target;
      for (const obj of objects) {
        target = keyInPrototypeChain(obj, name);
        if (target)
          break;
      }
      if (!target)
        target = objects[objects.length - 1];
      const descriptor = Object.getOwnPropertyDescriptor(target, name);
      if (descriptor?.set && descriptor?.get)
        return descriptor.set.call(thisProxy, value) || true;
      return Reflect.set(target, name, value);
    }
  };
  function collapseProxies() {
    let keys = Reflect.ownKeys(this);
    return keys.reduce((acc, key) => {
      acc[key] = Reflect.get(this, key);
      return acc;
    }, {});
  }
  function initInterceptors(data2) {
    let isObject3 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
    let recurse = (obj, basePath = "") => {
      Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
        if (enumerable === false || value === void 0)
          return;
        if (typeof value === "object" && value !== null && value.__v_skip)
          return;
        let path = basePath === "" ? key : `${basePath}.${key}`;
        if (typeof value === "object" && value !== null && value._x_interceptor) {
          obj[key] = value.initialize(data2, path, key);
        } else {
          if (isObject3(value) && value !== obj && !(value instanceof Element)) {
            recurse(value, path);
          }
        }
      });
    };
    return recurse(data2);
  }
  function interceptor(callback, mutateObj = () => {
  }) {
    let obj = {
      initialValue: void 0,
      _x_interceptor: true,
      initialize(data2, path, key) {
        return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
      }
    };
    mutateObj(obj);
    return (initialValue) => {
      if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
        let initialize = obj.initialize.bind(obj);
        obj.initialize = (data2, path, key) => {
          let innerValue = initialValue.initialize(data2, path, key);
          obj.initialValue = innerValue;
          return initialize(data2, path, key);
        };
      } else {
        obj.initialValue = initialValue;
      }
      return obj;
    };
  }
  function get(obj, path) {
    return path.split(".").reduce((carry, segment) => carry[segment], obj);
  }
  function set(obj, path, value) {
    if (typeof path === "string")
      path = path.split(".");
    if (path.length === 1)
      obj[path[0]] = value;
    else if (path.length === 0)
      throw error;
    else {
      if (obj[path[0]])
        return set(obj[path[0]], path.slice(1), value);
      else {
        obj[path[0]] = {};
        return set(obj[path[0]], path.slice(1), value);
      }
    }
  }
  var magics = {};
  function magic(name, callback) {
    magics[name] = callback;
  }
  function injectMagics(obj, el) {
    let memoizedUtilities = getUtilities(el);
    Object.entries(magics).forEach(([name, callback]) => {
      Object.defineProperty(obj, `$${name}`, {
        get() {
          return callback(el, memoizedUtilities);
        },
        enumerable: false
      });
    });
    return obj;
  }
  function getUtilities(el) {
    let [utilities, cleanup2] = getElementBoundUtilities(el);
    let utils2 = { interceptor, ...utilities };
    onElRemoved(el, cleanup2);
    return utils2;
  }
  function tryCatch(el, expression, callback, ...args) {
    try {
      return callback(...args);
    } catch (e) {
      handleError(e, el, expression);
    }
  }
  function handleError(...args) {
    return errorHandler(...args);
  }
  var errorHandler = normalErrorHandler;
  function setErrorHandler(handler4) {
    errorHandler = handler4;
  }
  function normalErrorHandler(error2, el, expression = void 0) {
    error2 = Object.assign(
      error2 ?? { message: "No error message given." },
      { el, expression }
    );
    console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
    setTimeout(() => {
      throw error2;
    }, 0);
  }
  var shouldAutoEvaluateFunctions = true;
  function dontAutoEvaluateFunctions(callback) {
    let cache = shouldAutoEvaluateFunctions;
    shouldAutoEvaluateFunctions = false;
    let result = callback();
    shouldAutoEvaluateFunctions = cache;
    return result;
  }
  function evaluate(el, expression, extras = {}) {
    let result;
    evaluateLater(el, expression)((value) => result = value, extras);
    return result;
  }
  function evaluateLater(...args) {
    return theEvaluatorFunction(...args);
  }
  var theEvaluatorFunction = () => {
  };
  function setEvaluator(newEvaluator) {
    theEvaluatorFunction = newEvaluator;
  }
  var theRawEvaluatorFunction;
  function setRawEvaluator(newEvaluator) {
    theRawEvaluatorFunction = newEvaluator;
  }
  function normalEvaluator(el, expression) {
    let overriddenMagics = {};
    injectMagics(overriddenMagics, el);
    let dataStack = [overriddenMagics, ...closestDataStack(el)];
    let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
    return tryCatch.bind(null, el, expression, evaluator);
  }
  function generateEvaluatorFromFunction(dataStack, func) {
    return (receiver = () => {
    }, { scope: scope2 = {}, params = [], context } = {}) => {
      if (!shouldAutoEvaluateFunctions) {
        runIfTypeOfFunction(receiver, func, mergeProxies([scope2, ...dataStack]), params);
        return;
      }
      let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
      runIfTypeOfFunction(receiver, result);
    };
  }
  var evaluatorMemo = {};
  function generateFunctionFromString(expression, el) {
    if (evaluatorMemo[expression]) {
      return evaluatorMemo[expression];
    }
    let AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
    const safeAsyncFunction = () => {
      try {
        let func2 = new AsyncFunction(
          ["__self", "scope"],
          `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`
        );
        Object.defineProperty(func2, "name", {
          value: `[Alpine] ${expression}`
        });
        return func2;
      } catch (error2) {
        handleError(error2, el, expression);
        return Promise.resolve();
      }
    };
    let func = safeAsyncFunction();
    evaluatorMemo[expression] = func;
    return func;
  }
  function generateEvaluatorFromString(dataStack, expression, el) {
    let func = generateFunctionFromString(expression, el);
    return (receiver = () => {
    }, { scope: scope2 = {}, params = [], context } = {}) => {
      func.result = void 0;
      func.finished = false;
      let completeScope = mergeProxies([scope2, ...dataStack]);
      if (typeof func === "function") {
        let promise = func.call(context, func, completeScope).catch((error2) => handleError(error2, el, expression));
        if (func.finished) {
          runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
          func.result = void 0;
        } else {
          promise.then((result) => {
            runIfTypeOfFunction(receiver, result, completeScope, params, el);
          }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
        }
      }
    };
  }
  function runIfTypeOfFunction(receiver, value, scope2, params, el) {
    if (shouldAutoEvaluateFunctions && typeof value === "function") {
      let result = value.apply(scope2, params);
      if (result instanceof Promise) {
        result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
      } else {
        receiver(result);
      }
    } else if (typeof value === "object" && value instanceof Promise) {
      value.then((i) => receiver(i));
    } else {
      receiver(value);
    }
  }
  function evaluateRaw(...args) {
    return theRawEvaluatorFunction(...args);
  }
  function normalRawEvaluator(el, expression, extras = {}) {
    let overriddenMagics = {};
    injectMagics(overriddenMagics, el);
    let dataStack = [overriddenMagics, ...closestDataStack(el)];
    let scope2 = mergeProxies([extras.scope ?? {}, ...dataStack]);
    let params = extras.params ?? [];
    if (expression.includes("await")) {
      let AsyncFunction = Object.getPrototypeOf(async function() {
      }).constructor;
      let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
      let func = new AsyncFunction(
        ["scope"],
        `with (scope) { let __result = ${rightSideSafeExpression}; return __result }`
      );
      let result = func.call(extras.context, scope2);
      return result;
    } else {
      let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(()=>{ ${expression} })()` : expression;
      let func = new Function(
        ["scope"],
        `with (scope) { let __result = ${rightSideSafeExpression}; return __result }`
      );
      let result = func.call(extras.context, scope2);
      if (typeof result === "function" && shouldAutoEvaluateFunctions) {
        return result.apply(scope2, params);
      }
      return result;
    }
  }
  var prefixAsString = "x-";
  function prefix(subject = "") {
    return prefixAsString + subject;
  }
  function setPrefix(newPrefix) {
    prefixAsString = newPrefix;
  }
  var directiveHandlers = {};
  function directive(name, callback) {
    directiveHandlers[name] = callback;
    return {
      before(directive2) {
        if (!directiveHandlers[directive2]) {
          console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
          return;
        }
        const pos = directiveOrder.indexOf(directive2);
        directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
      }
    };
  }
  function directiveExists(name) {
    return Object.keys(directiveHandlers).includes(name);
  }
  function directives(el, attributes, originalAttributeOverride) {
    attributes = Array.from(attributes);
    if (el._x_virtualDirectives) {
      let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
      let staticAttributes = attributesOnly(vAttributes);
      vAttributes = vAttributes.map((attribute) => {
        if (staticAttributes.find((attr) => attr.name === attribute.name)) {
          return {
            name: `x-bind:${attribute.name}`,
            value: `"${attribute.value}"`
          };
        }
        return attribute;
      });
      attributes = attributes.concat(vAttributes);
    }
    let transformedAttributeMap = {};
    let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
    return directives2.map((directive2) => {
      return getDirectiveHandler(el, directive2);
    });
  }
  function attributesOnly(attributes) {
    return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
  }
  var isDeferringHandlers = false;
  var directiveHandlerStacks = /* @__PURE__ */ new Map();
  var currentHandlerStackKey = /* @__PURE__ */ Symbol();
  function deferHandlingDirectives(callback) {
    isDeferringHandlers = true;
    let key = /* @__PURE__ */ Symbol();
    currentHandlerStackKey = key;
    directiveHandlerStacks.set(key, []);
    let flushHandlers = () => {
      while (directiveHandlerStacks.get(key).length)
        directiveHandlerStacks.get(key).shift()();
      directiveHandlerStacks.delete(key);
    };
    let stopDeferring = () => {
      isDeferringHandlers = false;
      flushHandlers();
    };
    callback(flushHandlers);
    stopDeferring();
  }
  function getElementBoundUtilities(el) {
    let cleanups = [];
    let cleanup2 = (callback) => cleanups.push(callback);
    let [effect3, cleanupEffect] = elementBoundEffect(el);
    cleanups.push(cleanupEffect);
    let utilities = {
      Alpine: alpine_default,
      effect: effect3,
      cleanup: cleanup2,
      evaluateLater: evaluateLater.bind(evaluateLater, el),
      evaluate: evaluate.bind(evaluate, el)
    };
    let doCleanup = () => cleanups.forEach((i) => i());
    return [utilities, doCleanup];
  }
  function getDirectiveHandler(el, directive2) {
    let noop = () => {
    };
    let handler4 = directiveHandlers[directive2.type] || noop;
    let [utilities, cleanup2] = getElementBoundUtilities(el);
    onAttributeRemoved(el, directive2.original, cleanup2);
    let fullHandler = () => {
      if (el._x_ignore || el._x_ignoreSelf)
        return;
      handler4.inline && handler4.inline(el, directive2, utilities);
      handler4 = handler4.bind(handler4, el, directive2, utilities);
      isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
    };
    fullHandler.runCleanups = cleanup2;
    return fullHandler;
  }
  var startingWith = (subject, replacement) => ({ name, value }) => {
    if (name.startsWith(subject))
      name = name.replace(subject, replacement);
    return { name, value };
  };
  var into = (i) => i;
  function toTransformedAttributes(callback = () => {
  }) {
    return ({ name, value }) => {
      let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
        return transform(carry);
      }, { name, value });
      if (newName !== name)
        callback(newName, name);
      return { name: newName, value: newValue };
    };
  }
  var attributeTransformers = [];
  function mapAttributes(callback) {
    attributeTransformers.push(callback);
  }
  function outNonAlpineAttributes({ name }) {
    return alpineAttributeRegex().test(name);
  }
  var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
  function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
    return ({ name, value }) => {
      if (name === value)
        value = "";
      let typeMatch = name.match(alpineAttributeRegex());
      let valueMatch = name.match(/:([a-zA-Z0-9\--:]+)/);
      let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      let original = originalAttributeOverride || transformedAttributeMap[name] || name;
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map((i) => i.replace(".", "")),
        expression: value,
        original
      };
    };
  }
  var DEFAULT = "DEFAULT";
  var directiveOrder = [
    "ignore",
    "ref",
    "data",
    "id",
    "anchor",
    "bind",
    "init",
    "for",
    "model",
    "modelable",
    "transition",
    "show",
    "if",
    DEFAULT,
    "teleport"
  ];
  function byPriority(a, b) {
    let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
    let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
    return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
  }
  function dispatch(el, name, detail = {}, options = {}) {
    return el.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        // Allows events to pass the shadow DOM barrier.
        composed: true,
        cancelable: true,
        // Allows overriding the default event options.
        ...options
      })
    );
  }
  function walk(el, callback) {
    if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
      Array.from(el.children).forEach((el2) => walk(el2, callback));
      return;
    }
    let skip = false;
    callback(el, () => skip = true);
    if (skip)
      return;
    let node = el.firstElementChild;
    while (node) {
      walk(node, callback, false);
      node = node.nextElementSibling;
    }
  }
  function warn(message, ...args) {
    console.warn(`Alpine Warning: ${message}`, ...args);
  }
  var started = false;
  function start() {
    if (started)
      warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
    started = true;
    if (!document.body)
      warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
    dispatch(document, "alpine:init");
    dispatch(document, "alpine:initializing");
    startObservingMutations();
    onElAdded((el) => initTree(el, walk));
    onElRemoved((el) => destroyTree(el));
    onAttributesAdded((el, attrs) => {
      directives(el, attrs).forEach((handle) => handle());
    });
    let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
    Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
      initTree(el);
    });
    dispatch(document, "alpine:initialized");
    setTimeout(() => {
      warnAboutMissingPlugins();
    });
  }
  var rootSelectorCallbacks = [];
  var initSelectorCallbacks = [];
  function rootSelectors() {
    return rootSelectorCallbacks.map((fn) => fn());
  }
  function allSelectors() {
    return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
  }
  function addRootSelector(selectorCallback) {
    rootSelectorCallbacks.push(selectorCallback);
  }
  function addInitSelector(selectorCallback) {
    initSelectorCallbacks.push(selectorCallback);
  }
  function closestRoot(el, includeInitSelectors = false) {
    return findClosest(el, (element) => {
      const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
      if (selectors.some((selector) => element.matches(selector)))
        return true;
    });
  }
  function findClosest(el, callback) {
    if (!el)
      return;
    if (callback(el))
      return el;
    if (el._x_teleportBack)
      return findClosest(el._x_teleportBack, callback);
    if (el.parentNode instanceof ShadowRoot) {
      return findClosest(el.parentNode.host, callback);
    }
    if (!el.parentElement)
      return;
    return findClosest(el.parentElement, callback);
  }
  function isRoot(el) {
    return rootSelectors().some((selector) => el.matches(selector));
  }
  var initInterceptors2 = [];
  function interceptInit(callback) {
    initInterceptors2.push(callback);
  }
  var markerDispenser = 1;
  function initTree(el, walker = walk, intercept = () => {
  }) {
    if (findClosest(el, (i) => i._x_ignore))
      return;
    deferHandlingDirectives(() => {
      walker(el, (el2, skip) => {
        if (el2._x_marker)
          return;
        intercept(el2, skip);
        initInterceptors2.forEach((i) => i(el2, skip));
        directives(el2, el2.attributes).forEach((handle) => handle());
        if (!el2._x_ignore)
          el2._x_marker = markerDispenser++;
        el2._x_ignore && skip();
      });
    });
  }
  function destroyTree(root, walker = walk) {
    walker(root, (el) => {
      cleanupElement(el);
      cleanupAttributes(el);
      delete el._x_marker;
    });
  }
  function warnAboutMissingPlugins() {
    let pluginDirectives = [
      ["ui", "dialog", ["[x-dialog], [x-popover]"]],
      ["anchor", "anchor", ["[x-anchor]"]],
      ["sort", "sort", ["[x-sort]"]]
    ];
    pluginDirectives.forEach(([plugin2, directive2, selectors]) => {
      if (directiveExists(directive2))
        return;
      selectors.some((selector) => {
        if (document.querySelector(selector)) {
          warn(`found "${selector}", but missing ${plugin2} plugin`);
          return true;
        }
      });
    });
  }
  var tickStack = [];
  var isHolding = false;
  function nextTick(callback = () => {
  }) {
    queueMicrotask(() => {
      isHolding || setTimeout(() => {
        releaseNextTicks();
      });
    });
    return new Promise((res) => {
      tickStack.push(() => {
        callback();
        res();
      });
    });
  }
  function releaseNextTicks() {
    isHolding = false;
    while (tickStack.length)
      tickStack.shift()();
  }
  function holdNextTicks() {
    isHolding = true;
  }
  function setClasses(el, value) {
    if (Array.isArray(value)) {
      return setClassesFromString(el, value.join(" "));
    } else if (typeof value === "object" && value !== null) {
      return setClassesFromObject(el, value);
    } else if (typeof value === "function") {
      return setClasses(el, value());
    }
    return setClassesFromString(el, value);
  }
  function splitClasses(classString) {
    return classString.split(/\s/).filter(Boolean);
  }
  function setClassesFromString(el, classString) {
    let missingClasses = (classString2) => splitClasses(classString2).filter((i) => !el.classList.contains(i)).filter(Boolean);
    let addClassesAndReturnUndo = (classes) => {
      el.classList.add(...classes);
      return () => {
        el.classList.remove(...classes);
      };
    };
    classString = classString === true ? classString = "" : classString || "";
    return addClassesAndReturnUndo(missingClasses(classString));
  }
  function setClassesFromObject(el, classObject) {
    let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? splitClasses(classString) : false).filter(Boolean);
    let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? splitClasses(classString) : false).filter(Boolean);
    let added = [];
    let removed = [];
    forRemove.forEach((i) => {
      if (el.classList.contains(i)) {
        el.classList.remove(i);
        removed.push(i);
      }
    });
    forAdd.forEach((i) => {
      if (!el.classList.contains(i)) {
        el.classList.add(i);
        added.push(i);
      }
    });
    return () => {
      removed.forEach((i) => el.classList.add(i));
      added.forEach((i) => el.classList.remove(i));
    };
  }
  function setStyles(el, value) {
    if (typeof value === "object" && value !== null) {
      return setStylesFromObject(el, value);
    }
    return setStylesFromString(el, value);
  }
  function setStylesFromObject(el, value) {
    let previousStyles = {};
    Object.entries(value).forEach(([key, value2]) => {
      previousStyles[key] = el.style[key];
      if (!key.startsWith("--")) {
        key = kebabCase(key);
      }
      el.style.setProperty(key, value2);
    });
    setTimeout(() => {
      if (el.style.length === 0) {
        el.removeAttribute("style");
      }
    });
    return () => {
      setStyles(el, previousStyles);
    };
  }
  function setStylesFromString(el, value) {
    let cache = el.getAttribute("style", value);
    el.setAttribute("style", value);
    return () => {
      el.setAttribute("style", cache || "");
    };
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function once(callback, fallback = () => {
  }) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      } else {
        fallback.apply(this, arguments);
      }
    };
  }
  directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
    if (typeof expression === "function")
      expression = evaluate2(expression);
    if (expression === false)
      return;
    if (!expression || typeof expression === "boolean") {
      registerTransitionsFromHelper(el, modifiers, value);
    } else {
      registerTransitionsFromClassString(el, expression, value);
    }
  });
  function registerTransitionsFromClassString(el, classString, stage) {
    registerTransitionObject(el, setClasses, "");
    let directiveStorageMap = {
      "enter": (classes) => {
        el._x_transition.enter.during = classes;
      },
      "enter-start": (classes) => {
        el._x_transition.enter.start = classes;
      },
      "enter-end": (classes) => {
        el._x_transition.enter.end = classes;
      },
      "leave": (classes) => {
        el._x_transition.leave.during = classes;
      },
      "leave-start": (classes) => {
        el._x_transition.leave.start = classes;
      },
      "leave-end": (classes) => {
        el._x_transition.leave.end = classes;
      }
    };
    directiveStorageMap[stage](classString);
  }
  function registerTransitionsFromHelper(el, modifiers, stage) {
    registerTransitionObject(el, setStyles);
    let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
    let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
    let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
    if (modifiers.includes("in") && !doesntSpecify) {
      modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
    }
    if (modifiers.includes("out") && !doesntSpecify) {
      modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
    }
    let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
    let wantsOpacity = wantsAll || modifiers.includes("opacity");
    let wantsScale = wantsAll || modifiers.includes("scale");
    let opacityValue = wantsOpacity ? 0 : 1;
    let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
    let delay = modifierValue(modifiers, "delay", 0) / 1e3;
    let origin = modifierValue(modifiers, "origin", "center");
    let property = "opacity, transform";
    let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
    let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
    let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
    if (transitioningIn) {
      el._x_transition.enter.during = {
        transformOrigin: origin,
        transitionDelay: `${delay}s`,
        transitionProperty: property,
        transitionDuration: `${durationIn}s`,
        transitionTimingFunction: easing
      };
      el._x_transition.enter.start = {
        opacity: opacityValue,
        transform: `scale(${scaleValue})`
      };
      el._x_transition.enter.end = {
        opacity: 1,
        transform: `scale(1)`
      };
    }
    if (transitioningOut) {
      el._x_transition.leave.during = {
        transformOrigin: origin,
        transitionDelay: `${delay}s`,
        transitionProperty: property,
        transitionDuration: `${durationOut}s`,
        transitionTimingFunction: easing
      };
      el._x_transition.leave.start = {
        opacity: 1,
        transform: `scale(1)`
      };
      el._x_transition.leave.end = {
        opacity: opacityValue,
        transform: `scale(${scaleValue})`
      };
    }
  }
  function registerTransitionObject(el, setFunction, defaultValue = {}) {
    if (!el._x_transition)
      el._x_transition = {
        enter: { during: defaultValue, start: defaultValue, end: defaultValue },
        leave: { during: defaultValue, start: defaultValue, end: defaultValue },
        in(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.enter.during,
            start: this.enter.start,
            end: this.enter.end
          }, before, after);
        },
        out(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.leave.during,
            start: this.leave.start,
            end: this.leave.end
          }, before, after);
        }
      };
  }
  window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
    const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
    let clickAwayCompatibleShow = () => nextTick2(show);
    if (value) {
      if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
        el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
      } else {
        el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
      }
      return;
    }
    el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
      el._x_transition.out(() => {
      }, () => resolve(hide));
      el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
    }) : Promise.resolve(hide);
    queueMicrotask(() => {
      let closest = closestHide(el);
      if (closest) {
        if (!closest._x_hideChildren)
          closest._x_hideChildren = [];
        closest._x_hideChildren.push(el);
      } else {
        nextTick2(() => {
          let hideAfterChildren = (el2) => {
            let carry = Promise.all([
              el2._x_hidePromise,
              ...(el2._x_hideChildren || []).map(hideAfterChildren)
            ]).then(([i]) => i?.());
            delete el2._x_hidePromise;
            delete el2._x_hideChildren;
            return carry;
          };
          hideAfterChildren(el).catch((e) => {
            if (!e.isFromCancelledTransition)
              throw e;
          });
        });
      }
    });
  };
  function closestHide(el) {
    let parent = el.parentNode;
    if (!parent)
      return;
    return parent._x_hidePromise ? parent : closestHide(parent);
  }
  function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
  }, after = () => {
  }) {
    if (el._x_transitioning)
      el._x_transitioning.cancel();
    if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
      before();
      after();
      return;
    }
    let undoStart, undoDuring, undoEnd;
    performTransition(el, {
      start() {
        undoStart = setFunction(el, start2);
      },
      during() {
        undoDuring = setFunction(el, during);
      },
      before,
      end() {
        undoStart();
        undoEnd = setFunction(el, end);
      },
      after,
      cleanup() {
        undoDuring();
        undoEnd();
      }
    });
  }
  function performTransition(el, stages) {
    let interrupted, reachedBefore, reachedEnd;
    let finish = once(() => {
      mutateDom(() => {
        interrupted = true;
        if (!reachedBefore)
          stages.before();
        if (!reachedEnd) {
          stages.end();
          releaseNextTicks();
        }
        stages.after();
        if (el.isConnected)
          stages.cleanup();
        delete el._x_transitioning;
      });
    });
    el._x_transitioning = {
      beforeCancels: [],
      beforeCancel(callback) {
        this.beforeCancels.push(callback);
      },
      cancel: once(function() {
        while (this.beforeCancels.length) {
          this.beforeCancels.shift()();
        }
        ;
        finish();
      }),
      finish
    };
    mutateDom(() => {
      stages.start();
      stages.during();
    });
    holdNextTicks();
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
      let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
      if (duration === 0)
        duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
      mutateDom(() => {
        stages.before();
      });
      reachedBefore = true;
      requestAnimationFrame(() => {
        if (interrupted)
          return;
        mutateDom(() => {
          stages.end();
        });
        releaseNextTicks();
        setTimeout(el._x_transitioning.finish, duration + delay);
        reachedEnd = true;
      });
    });
  }
  function modifierValue(modifiers, key, fallback) {
    if (modifiers.indexOf(key) === -1)
      return fallback;
    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue)
      return fallback;
    if (key === "scale") {
      if (isNaN(rawValue))
        return fallback;
    }
    if (key === "duration" || key === "delay") {
      let match = rawValue.match(/([0-9]+)ms/);
      if (match)
        return match[1];
    }
    if (key === "origin") {
      if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
      }
    }
    return rawValue;
  }
  var isCloning = false;
  function skipDuringClone(callback, fallback = () => {
  }) {
    return (...args) => isCloning ? fallback(...args) : callback(...args);
  }
  function onlyDuringClone(callback) {
    return (...args) => isCloning && callback(...args);
  }
  var interceptors = [];
  function interceptClone(callback) {
    interceptors.push(callback);
  }
  function cloneNode(from, to) {
    interceptors.forEach((i) => i(from, to));
    isCloning = true;
    dontRegisterReactiveSideEffects(() => {
      initTree(to, (el, callback) => {
        callback(el, () => {
        });
      });
    });
    isCloning = false;
  }
  var isCloningLegacy = false;
  function clone(oldEl, newEl) {
    if (!newEl._x_dataStack)
      newEl._x_dataStack = oldEl._x_dataStack;
    isCloning = true;
    isCloningLegacy = true;
    dontRegisterReactiveSideEffects(() => {
      cloneTree(newEl);
    });
    isCloning = false;
    isCloningLegacy = false;
  }
  function cloneTree(el) {
    let hasRunThroughFirstEl = false;
    let shallowWalker = (el2, callback) => {
      walk(el2, (el3, skip) => {
        if (hasRunThroughFirstEl && isRoot(el3))
          return skip();
        hasRunThroughFirstEl = true;
        callback(el3, skip);
      });
    };
    initTree(el, shallowWalker);
  }
  function dontRegisterReactiveSideEffects(callback) {
    let cache = effect;
    overrideEffect((callback2, el) => {
      let storedEffect = cache(callback2);
      release(storedEffect);
      return () => {
      };
    });
    callback();
    overrideEffect(cache);
  }
  function bind(el, name, value, modifiers = []) {
    if (!el._x_bindings)
      el._x_bindings = reactive({});
    el._x_bindings[name] = value;
    name = modifiers.includes("camel") ? camelCase(name) : name;
    switch (name) {
      case "value":
        bindInputValue(el, value);
        break;
      case "style":
        bindStyles(el, value);
        break;
      case "class":
        bindClasses(el, value);
        break;
      case "selected":
      case "checked":
        bindAttributeAndProperty(el, name, value);
        break;
      default:
        bindAttribute(el, name, value);
        break;
    }
  }
  function bindInputValue(el, value) {
    if (isRadio(el)) {
      if (el.attributes.value === void 0) {
        el.value = value;
      }
    } else if (isCheckbox(el)) {
      if (Number.isInteger(value)) {
        el.value = value;
      } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
        el.value = String(value);
      } else {
        if (Array.isArray(value)) {
          el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
        } else {
          el.checked = !!value;
        }
      }
    } else if (el.tagName === "SELECT") {
      updateSelect(el, value);
    } else {
      if (el.value === value)
        return;
      el.value = value === void 0 ? "" : value;
    }
  }
  function bindClasses(el, value) {
    if (el._x_undoAddedClasses)
      el._x_undoAddedClasses();
    el._x_undoAddedClasses = setClasses(el, value);
  }
  function bindStyles(el, value) {
    if (el._x_undoAddedStyles)
      el._x_undoAddedStyles();
    el._x_undoAddedStyles = setStyles(el, value);
  }
  function bindAttributeAndProperty(el, name, value) {
    bindAttribute(el, name, value);
    setPropertyIfChanged(el, name, value);
  }
  function bindAttribute(el, name, value) {
    if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
      el.removeAttribute(name);
    } else {
      if (isBooleanAttr(name))
        value = name;
      setIfChanged(el, name, value);
    }
  }
  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }
  function setPropertyIfChanged(el, propName, value) {
    if (el[propName] !== value) {
      el[propName] = value;
    }
  }
  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map((value2) => {
      return value2 + "";
    });
    Array.from(el.options).forEach((option) => {
      option.selected = arrayWrappedValue.includes(option.value);
    });
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function safeParseBoolean(rawValue) {
    if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
      return true;
    }
    if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
      return false;
    }
    return rawValue ? Boolean(rawValue) : null;
  }
  var booleanAttributes = /* @__PURE__ */ new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    "shadowrootclonable",
    "shadowrootdelegatesfocus",
    "shadowrootserializable"
  ]);
  function isBooleanAttr(attrName) {
    return booleanAttributes.has(attrName);
  }
  function attributeShouldntBePreservedIfFalsy(name) {
    return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
  }
  function getBinding(el, name, fallback) {
    if (el._x_bindings && el._x_bindings[name] !== void 0)
      return el._x_bindings[name];
    return getAttributeBinding(el, name, fallback);
  }
  function extractProp(el, name, fallback, extract = true) {
    if (el._x_bindings && el._x_bindings[name] !== void 0)
      return el._x_bindings[name];
    if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
      let binding = el._x_inlineBindings[name];
      binding.extract = extract;
      return dontAutoEvaluateFunctions(() => {
        return evaluate(el, binding.expression);
      });
    }
    return getAttributeBinding(el, name, fallback);
  }
  function getAttributeBinding(el, name, fallback) {
    let attr = el.getAttribute(name);
    if (attr === null)
      return typeof fallback === "function" ? fallback() : fallback;
    if (attr === "")
      return true;
    if (isBooleanAttr(name)) {
      return !![name, "true"].includes(attr);
    }
    return attr;
  }
  function isCheckbox(el) {
    return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
  }
  function isRadio(el) {
    return el.type === "radio" || el.localName === "ui-radio";
  }
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      let context = this, args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
    let firstRun = true;
    let outerHash;
    let innerHash;
    let reference = effect(() => {
      let outer = outerGet();
      let inner = innerGet();
      if (firstRun) {
        innerSet(cloneIfObject(outer));
        firstRun = false;
      } else {
        let outerHashLatest = JSON.stringify(outer);
        let innerHashLatest = JSON.stringify(inner);
        if (outerHashLatest !== outerHash) {
          innerSet(cloneIfObject(outer));
        } else if (outerHashLatest !== innerHashLatest) {
          outerSet(cloneIfObject(inner));
        } else {
        }
      }
      outerHash = JSON.stringify(outerGet());
      innerHash = JSON.stringify(innerGet());
    });
    return () => {
      release(reference);
    };
  }
  function cloneIfObject(value) {
    return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
  }
  function plugin(callback) {
    let callbacks = Array.isArray(callback) ? callback : [callback];
    callbacks.forEach((i) => i(alpine_default));
  }
  var stores = {};
  var isReactive = false;
  function store(name, value) {
    if (!isReactive) {
      stores = reactive(stores);
      isReactive = true;
    }
    if (value === void 0) {
      return stores[name];
    }
    stores[name] = value;
    initInterceptors(stores[name]);
    if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
      stores[name].init();
    }
  }
  function getStores() {
    return stores;
  }
  var binds = {};
  function bind2(name, bindings) {
    let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
    if (name instanceof Element) {
      return applyBindingsObject(name, getBindings());
    } else {
      binds[name] = getBindings;
    }
    return () => {
    };
  }
  function injectBindingProviders(obj) {
    Object.entries(binds).forEach(([name, callback]) => {
      Object.defineProperty(obj, name, {
        get() {
          return (...args) => {
            return callback(...args);
          };
        }
      });
    });
    return obj;
  }
  function applyBindingsObject(el, obj, original) {
    let cleanupRunners = [];
    while (cleanupRunners.length)
      cleanupRunners.pop()();
    let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(attributes);
    attributes = attributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    directives(el, attributes, original).map((handle) => {
      cleanupRunners.push(handle.runCleanups);
      handle();
    });
    return () => {
      while (cleanupRunners.length)
        cleanupRunners.pop()();
    };
  }
  var datas = {};
  function data(name, callback) {
    datas[name] = callback;
  }
  function injectDataProviders(obj, context) {
    Object.entries(datas).forEach(([name, callback]) => {
      Object.defineProperty(obj, name, {
        get() {
          return (...args) => {
            return callback.bind(context)(...args);
          };
        },
        enumerable: false
      });
    });
    return obj;
  }
  var Alpine2 = {
    get reactive() {
      return reactive;
    },
    get release() {
      return release;
    },
    get effect() {
      return effect;
    },
    get raw() {
      return raw;
    },
    get transaction() {
      return transaction;
    },
    version: "3.15.11",
    flushAndStopDeferringMutations,
    dontAutoEvaluateFunctions,
    disableEffectScheduling,
    startObservingMutations,
    stopObservingMutations,
    setReactivityEngine,
    onAttributeRemoved,
    onAttributesAdded,
    closestDataStack,
    skipDuringClone,
    onlyDuringClone,
    addRootSelector,
    addInitSelector,
    setErrorHandler,
    interceptClone,
    addScopeToNode,
    deferMutations,
    mapAttributes,
    evaluateLater,
    interceptInit,
    initInterceptors,
    injectMagics,
    setEvaluator,
    setRawEvaluator,
    mergeProxies,
    extractProp,
    findClosest,
    onElRemoved,
    closestRoot,
    destroyTree,
    interceptor,
    // INTERNAL: not public API and is subject to change without major release.
    transition,
    // INTERNAL
    setStyles,
    // INTERNAL
    mutateDom,
    directive,
    entangle,
    throttle,
    debounce,
    evaluate,
    evaluateRaw,
    initTree,
    nextTick,
    prefixed: prefix,
    prefix: setPrefix,
    plugin,
    magic,
    store,
    start,
    clone,
    // INTERNAL
    cloneNode,
    // INTERNAL
    bound: getBinding,
    $data: scope,
    watch,
    walk,
    data,
    bind: bind2
  };
  var alpine_default = Alpine2;
  function makeMap(str, expectsLowerCase) {
    const map = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
  }
  var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
  var EMPTY_OBJ = true ? Object.freeze({}) : {};
  var EMPTY_ARR = true ? Object.freeze([]) : [];
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (val, key) => hasOwnProperty.call(val, key);
  var isArray = Array.isArray;
  var isMap = (val) => toTypeString(val) === "[object Map]";
  var isString = (val) => typeof val === "string";
  var isSymbol = (val) => typeof val === "symbol";
  var isObject = (val) => val !== null && typeof val === "object";
  var objectToString = Object.prototype.toString;
  var toTypeString = (value) => objectToString.call(value);
  var toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  var cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  var camelizeRE = /-(\w)/g;
  var camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (-, c) => c ? c.toUpperCase() : "");
  });
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
  var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
  var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
  var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
  var targetMap = /* @__PURE__ */ new WeakMap();
  var effectStack = [];
  var activeEffect;
  var ITERATE_KEY = /* @__PURE__ */ Symbol(true ? "iterate" : "");
  var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(true ? "Map key iterate" : "");
  function isEffect(fn) {
    return fn && fn._isEffect === true;
  }
  function effect2(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
      fn = fn.raw;
    }
    const effect3 = createReactiveEffect(fn, options);
    if (!options.lazy) {
      effect3();
    }
    return effect3;
  }
  function stop(effect3) {
    if (effect3.active) {
      cleanup(effect3);
      if (effect3.options.onStop) {
        effect3.options.onStop();
      }
      effect3.active = false;
    }
  }
  var uid = 0;
  function createReactiveEffect(fn, options) {
    const effect3 = function reactiveEffect() {
      if (!effect3.active) {
        return fn();
      }
      if (!effectStack.includes(effect3)) {
        cleanup(effect3);
        try {
          enableTracking();
          effectStack.push(effect3);
          activeEffect = effect3;
          return fn();
        } finally {
          effectStack.pop();
          resetTracking();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    };
    effect3.id = uid++;
    effect3.allowRecurse = !!options.allowRecurse;
    effect3._isEffect = true;
    effect3.active = true;
    effect3.raw = fn;
    effect3.deps = [];
    effect3.options = options;
    return effect3;
  }
  function cleanup(effect3) {
    const { deps } = effect3;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect3);
      }
      deps.length = 0;
    }
  }
  var shouldTrack = true;
  var trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (!shouldTrack || activeEffect === void 0) {
      return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if (activeEffect.options.onTrack) {
        activeEffect.options.onTrack({
          effect: activeEffect,
          target,
          type,
          key
        });
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    const effects2 = /* @__PURE__ */ new Set();
    const add2 = (effectsToAdd) => {
      if (effectsToAdd) {
        effectsToAdd.forEach((effect3) => {
          if (effect3 !== activeEffect || effect3.allowRecurse) {
            effects2.add(effect3);
          }
        });
      }
    };
    if (type === "clear") {
      depsMap.forEach(add2);
    } else if (key === "length" && isArray(target)) {
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newValue) {
          add2(dep);
        }
      });
    } else {
      if (key !== void 0) {
        add2(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray(target)) {
            add2(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              add2(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            add2(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray(target)) {
            add2(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              add2(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            add2(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    const run = (effect3) => {
      if (effect3.options.onTrigger) {
        effect3.options.onTrigger({
          effect: effect3,
          target,
          key,
          type,
          newValue,
          oldValue,
          oldTarget
        });
      }
      if (effect3.options.scheduler) {
        effect3.options.scheduler(effect3);
      } else {
        effect3();
      }
    };
    effects2.forEach(run);
  }
  var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
  var get2 = /* @__PURE__ */ createGetter();
  var readonlyGet = /* @__PURE__ */ createGetter(true);
  var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
          track(arr, "get", i + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        const res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function createGetter(isReadonly = false, shallow = false) {
    return function get3(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }
      if (isObject(res)) {
        return isReadonly ? readonly(res) : reactive2(res);
      }
      return res;
    };
  }
  var set2 = /* @__PURE__ */ createSetter();
  function createSetter(shallow = false) {
    return function set3(target, key, value, receiver) {
      let oldValue = target[key];
      if (!shallow) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  var mutableHandlers = {
    get: get2,
    set: set2,
    deleteProperty,
    has,
    ownKeys
  };
  var readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      if (true) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    },
    deleteProperty(target, key) {
      if (true) {
        console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    }
  };
  var toReactive = (value) => isObject(value) ? reactive2(value) : value;
  var toReadonly = (value) => isObject(value) ? readonly(value) : value;
  var toShallow = (value) => value;
  var getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, isReadonly = false, isShallow = false) {
    target = target[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "get", key);
    }
    !isReadonly && track(rawTarget, "get", rawKey);
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has$1(key, isReadonly = false) {
    const target = this[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "has", key);
    }
    !isReadonly && track(rawTarget, "has", rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly = false) {
    target = target[
      "__v_raw"
      /* RAW */
    ];
    !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get3 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else if (true) {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get3.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get3 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else if (true) {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get3 ? get3.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = true ? isMap(target) ? new Map(target) : new Set(target) : void 0;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed[
        "__v_raw"
        /* RAW */
      ];
      const rawTarget = toRaw(target);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly, isShallow) {
    return function(...args) {
      const target = this[
        "__v_raw"
        /* RAW */
      ];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      if (true) {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
      }
      return type === "delete" ? false : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get$1(this, key);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get$1(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod(
        "add"
        /* ADD */
      ),
      set: createReadonlyMethod(
        "set"
        /* SET */
      ),
      delete: createReadonlyMethod(
        "delete"
        /* DELETE */
      ),
      clear: createReadonlyMethod(
        "clear"
        /* CLEAR */
      ),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get$1(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod(
        "add"
        /* ADD */
      ),
      set: createReadonlyMethod(
        "set"
        /* SET */
      ),
      delete: createReadonlyMethod(
        "delete"
        /* DELETE */
      ),
      clear: createReadonlyMethod(
        "clear"
        /* CLEAR */
      ),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
      shallowInstrumentations2[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  var mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  var readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
    }
  }
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  var readonlyMap = /* @__PURE__ */ new WeakMap();
  var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value[
      "__v_skip"
      /* SKIP */
    ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive2(target) {
    if (target && target[
      "__v_isReadonly"
      /* IS_READONLY */
    ]) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      if (true) {
        console.warn(`value cannot be made reactive: ${String(target)}`);
      }
      return target;
    }
    if (target[
      "__v_raw"
      /* RAW */
    ] && !(isReadonly && target[
      "__v_isReactive"
      /* IS_REACTIVE */
    ])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function toRaw(observed) {
    return observed && toRaw(observed[
      "__v_raw"
      /* RAW */
    ]) || observed;
  }
  function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
  }
  magic("nextTick", () => nextTick);
  magic("dispatch", (el) => dispatch.bind(dispatch, el));
  magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
    let evaluate2 = evaluateLater2(key);
    let getter = () => {
      let value;
      evaluate2((i) => value = i);
      return value;
    };
    let unwatch = watch(getter, callback);
    cleanup2(unwatch);
  });
  magic("store", getStores);
  magic("data", (el) => scope(el));
  magic("root", (el) => closestRoot(el));
  magic("refs", (el) => {
    if (el._x_refs_proxy)
      return el._x_refs_proxy;
    el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
    return el._x_refs_proxy;
  });
  function getArrayOfRefObject(el) {
    let refObjects = [];
    findClosest(el, (i) => {
      if (i._x_refs)
        refObjects.push(i._x_refs);
    });
    return refObjects;
  }
  var globalIdMemo = {};
  function findAndIncrementId(name) {
    if (!globalIdMemo[name])
      globalIdMemo[name] = 0;
    return ++globalIdMemo[name];
  }
  function closestIdRoot(el, name) {
    return findClosest(el, (element) => {
      if (element._x_ids && element._x_ids[name])
        return true;
    });
  }
  function setIdRoot(el, name) {
    if (!el._x_ids)
      el._x_ids = {};
    if (!el._x_ids[name])
      el._x_ids[name] = findAndIncrementId(name);
  }
  magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
    let cacheKey = `${name}${key ? `-${key}` : ""}`;
    return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
      let root = closestIdRoot(el, name);
      let id = root ? root._x_ids[name] : findAndIncrementId(name);
      return key ? `${name}-${id}-${key}` : `${name}-${id}`;
    });
  });
  interceptClone((from, to) => {
    if (from._x_id) {
      to._x_id = from._x_id;
    }
  });
  function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
    if (!el._x_id)
      el._x_id = {};
    if (el._x_id[cacheKey])
      return el._x_id[cacheKey];
    let output = callback();
    el._x_id[cacheKey] = output;
    cleanup2(() => {
      delete el._x_id[cacheKey];
    });
    return output;
  }
  magic("el", (el) => el);
  warnMissingPluginMagic("Focus", "focus", "focus");
  warnMissingPluginMagic("Persist", "persist", "persist");
  function warnMissingPluginMagic(name, magicName, slug) {
    magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
  }
  directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
    let func = evaluateLater2(expression);
    let innerGet = () => {
      let result;
      func((i) => result = i);
      return result;
    };
    let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
    let innerSet = (val) => evaluateInnerSet(() => {
    }, { scope: { "__placeholder": val } });
    let initialValue = innerGet();
    innerSet(initialValue);
    queueMicrotask(() => {
      if (!el._x_model)
        return;
      el._x_removeModelListeners["default"]();
      let outerGet = el._x_model.get;
      let outerSet = el._x_model.setWithModifiers;
      let releaseEntanglement = entangle(
        {
          get() {
            return outerGet();
          },
          set(value) {
            outerSet(value);
          }
        },
        {
          get() {
            return innerGet();
          },
          set(value) {
            innerSet(value);
          }
        }
      );
      cleanup2(releaseEntanglement);
    });
  });
  directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
    if (el.tagName.toLowerCase() !== "template")
      warn("x-teleport can only be used on a <template> tag", el);
    let target = getTarget(expression);
    let clone2 = el.content.cloneNode(true).firstElementChild;
    el._x_teleport = clone2;
    clone2._x_teleportBack = el;
    el.setAttribute("data-teleport-template", true);
    clone2.setAttribute("data-teleport-target", true);
    if (el._x_forwardEvents) {
      el._x_forwardEvents.forEach((eventName) => {
        clone2.addEventListener(eventName, (e) => {
          e.stopPropagation();
          el.dispatchEvent(new e.constructor(e.type, e));
        });
      });
    }
    addScopeToNode(clone2, {}, el);
    let placeInDom = (clone3, target2, modifiers2) => {
      if (modifiers2.includes("prepend")) {
        target2.parentNode.insertBefore(clone3, target2);
      } else if (modifiers2.includes("append")) {
        target2.parentNode.insertBefore(clone3, target2.nextSibling);
      } else {
        target2.appendChild(clone3);
      }
    };
    mutateDom(() => {
      placeInDom(clone2, target, modifiers);
      skipDuringClone(() => {
        initTree(clone2);
      })();
    });
    el._x_teleportPutBack = () => {
      let target2 = getTarget(expression);
      mutateDom(() => {
        placeInDom(el._x_teleport, target2, modifiers);
      });
    };
    cleanup2(
      () => mutateDom(() => {
        clone2.remove();
        destroyTree(clone2);
      })
    );
  });
  var teleportContainerDuringClone = document.createElement("div");
  function getTarget(expression) {
    let target = skipDuringClone(() => {
      return document.querySelector(expression);
    }, () => {
      return teleportContainerDuringClone;
    })();
    if (!target)
      warn(`Cannot find x-teleport element for selector: "${expression}"`);
    return target;
  }
  var handler = () => {
  };
  handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
    modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
    cleanup2(() => {
      modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
    });
  };
  directive("ignore", handler);
  directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
    effect3(evaluateLater(el, expression));
  }));
  function on(el, event, modifiers, callback) {
    let listenerTarget = el;
    let handler4 = (e) => callback(e);
    let options = {};
    let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
    if (modifiers.includes("dot"))
      event = dotSyntax(event);
    if (modifiers.includes("camel"))
      event = camelCase2(event);
    if (modifiers.includes("capture"))
      options.capture = true;
    if (modifiers.includes("window"))
      listenerTarget = window;
    if (modifiers.includes("document"))
      listenerTarget = document;
    if (modifiers.includes("passive")) {
      options.passive = modifiers[modifiers.indexOf("passive") + 1] !== "false";
    }
    handler4 = addDebounceOrThrottle(modifiers, handler4);
    if (modifiers.includes("prevent"))
      handler4 = wrapHandler(handler4, (next, e) => {
        e.preventDefault();
        next(e);
      });
    if (modifiers.includes("stop"))
      handler4 = wrapHandler(handler4, (next, e) => {
        e.stopPropagation();
        next(e);
      });
    if (modifiers.includes("once")) {
      handler4 = wrapHandler(handler4, (next, e) => {
        next(e);
        listenerTarget.removeEventListener(event, handler4, options);
      });
    }
    if (modifiers.includes("away") || modifiers.includes("outside")) {
      listenerTarget = document;
      handler4 = wrapHandler(handler4, (next, e) => {
        if (el.contains(e.target))
          return;
        if (e.target.isConnected === false)
          return;
        if (el.offsetWidth < 1 && el.offsetHeight < 1)
          return;
        if (el._x_isShown === false)
          return;
        next(e);
      });
    }
    if (modifiers.includes("self"))
      handler4 = wrapHandler(handler4, (next, e) => {
        e.target === el && next(e);
      });
    if (event === "submit") {
      handler4 = wrapHandler(handler4, (next, e) => {
        if (e.target._x_pendingModelUpdates) {
          e.target._x_pendingModelUpdates.forEach((fn) => fn());
        }
        next(e);
      });
    }
    if (isKeyEvent(event) || isClickEvent(event)) {
      handler4 = wrapHandler(handler4, (next, e) => {
        if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
          return;
        }
        next(e);
      });
    }
    listenerTarget.addEventListener(event, handler4, options);
    return () => {
      listenerTarget.removeEventListener(event, handler4, options);
    };
  }
  function addDebounceOrThrottle(modifiers, handler4) {
    if (modifiers.includes("debounce")) {
      let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler4 = debounce(handler4, wait);
    }
    if (modifiers.includes("throttle")) {
      let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler4 = throttle(handler4, wait);
    }
    return handler4;
  }
  function dotSyntax(subject) {
    return subject.replace(/-/g, ".");
  }
  function camelCase2(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function kebabCase2(subject) {
    if ([" ", "-"].includes(
      subject
    ))
      return subject;
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[-\s]/, "-").toLowerCase();
  }
  function isKeyEvent(event) {
    return ["keydown", "keyup"].includes(event);
  }
  function isClickEvent(event) {
    return ["contextmenu", "click", "mouse"].some((i) => event.includes(i));
  }
  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter((i) => {
      return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(i);
    });
    if (keyModifiers.includes("debounce")) {
      let debounceIndex = keyModifiers.indexOf("debounce");
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (keyModifiers.includes("throttle")) {
      let debounceIndex = keyModifiers.indexOf("throttle");
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (keyModifiers.length === 0)
      return false;
    if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
      return false;
    const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
        if (modifier === "cmd" || modifier === "super")
          modifier = "meta";
        return e[`${modifier}Key`];
      });
      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        if (isClickEvent(e.type))
          return false;
        if (keyToModifiers(e.key).includes(keyModifiers[0]))
          return false;
      }
    }
    return true;
  }
  function keyToModifiers(key) {
    if (!key)
      return [];
    key = kebabCase2(key);
    let modifierToKeyMap = {
      "ctrl": "control",
      "slash": "/",
      "space": " ",
      "spacebar": " ",
      "cmd": "meta",
      "esc": "escape",
      "up": "arrow-up",
      "down": "arrow-down",
      "left": "arrow-left",
      "right": "arrow-right",
      "period": ".",
      "comma": ",",
      "equal": "=",
      "minus": "-",
      "underscore": "-"
    };
    modifierToKeyMap[key] = key;
    return Object.keys(modifierToKeyMap).map((modifier) => {
      if (modifierToKeyMap[modifier] === key)
        return modifier;
    }).filter((modifier) => modifier);
  }
  directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let scopeTarget = el;
    if (modifiers.includes("parent")) {
      scopeTarget = findClosest(el, (element) => element !== el);
    }
    let evaluateGet = evaluateLater(scopeTarget, expression);
    let evaluateSet;
    if (typeof expression === "string") {
      evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
    } else if (typeof expression === "function" && typeof expression() === "string") {
      evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
    } else {
      evaluateSet = () => {
      };
    }
    let getValue = () => {
      let result;
      evaluateGet((value) => result = value);
      return isGetterSetter(result) ? result.get() : result;
    };
    let setValue = (value) => {
      let result;
      evaluateGet((value2) => result = value2);
      if (isGetterSetter(result)) {
        result.set(value);
      } else {
        evaluateSet(() => {
        }, {
          scope: { "__placeholder": value }
        });
      }
    };
    if (typeof expression === "string" && el.type === "radio") {
      mutateDom(() => {
        if (!el.hasAttribute("name"))
          el.setAttribute("name", expression);
      });
    }
    let hasChangeModifier = modifiers.includes("change") || modifiers.includes("lazy");
    let hasBlurModifier = modifiers.includes("blur");
    let hasEnterModifier = modifiers.includes("enter");
    let hasExplicitEventModifiers = hasChangeModifier || hasBlurModifier || hasEnterModifier;
    let removeListener;
    if (isCloning) {
      removeListener = () => {
      };
    } else if (hasExplicitEventModifiers) {
      let listeners = [];
      let syncValue = (e) => setValue(getInputValue(el, modifiers, e, getValue()));
      if (hasChangeModifier) {
        listeners.push(on(el, "change", modifiers, syncValue));
      }
      if (hasBlurModifier) {
        listeners.push(on(el, "blur", modifiers, syncValue));
        if (el.form) {
          let form = el.form;
          let syncCallback = () => syncValue({ target: el });
          if (!form._x_pendingModelUpdates)
            form._x_pendingModelUpdates = [];
          form._x_pendingModelUpdates.push(syncCallback);
          cleanup2(() => {
            if (form._x_pendingModelUpdates) {
              form._x_pendingModelUpdates.splice(form._x_pendingModelUpdates.indexOf(syncCallback), 1);
            }
          });
        }
      }
      if (hasEnterModifier) {
        listeners.push(on(el, "keydown", modifiers, (e) => {
          if (e.key === "Enter")
            syncValue(e);
        }));
      }
      removeListener = () => listeners.forEach((remove) => remove());
    } else {
      let event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) ? "change" : "input";
      removeListener = on(el, event, modifiers, (e) => {
        setValue(getInputValue(el, modifiers, e, getValue()));
      });
    }
    if (modifiers.includes("fill")) {
      if ([void 0, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
        setValue(
          getInputValue(el, modifiers, { target: el }, getValue())
        );
      }
    }
    if (!el._x_removeModelListeners)
      el._x_removeModelListeners = {};
    el._x_removeModelListeners["default"] = removeListener;
    cleanup2(() => el._x_removeModelListeners["default"]());
    if (el.form) {
      let removeResetListener = on(el.form, "reset", [], (e) => {
        nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
      });
      cleanup2(() => removeResetListener());
    }
    el._x_model = {
      get() {
        return getValue();
      },
      set(value) {
        setValue(value);
      },
      setWithModifiers: addDebounceOrThrottle(modifiers, setValue)
    };
    el._x_forceModelUpdate = (value) => {
      if (value === void 0 && typeof expression === "string" && expression.match(/\./))
        value = "";
      mutateDom(() => {
        if (isCheckbox(el)) {
          if (Array.isArray(value)) {
            el.checked = value.some((val) => val == el.value);
          } else {
            el.checked = !!value;
          }
        } else if (isRadio(el)) {
          if (typeof value === "boolean") {
            el.checked = safeParseBoolean(el.value) === value;
          } else {
            el.checked = el.value == value;
          }
        } else {
          bind(el, "value", value);
        }
      });
    };
    effect3(() => {
      let value = getValue();
      if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
        return;
      el._x_forceModelUpdate(value);
    });
  });
  function getInputValue(el, modifiers, event, currentValue) {
    return mutateDom(() => {
      if (event instanceof CustomEvent && event.detail !== void 0)
        return event.detail !== null && event.detail !== void 0 ? event.detail : event.target.value;
      else if (isCheckbox(el)) {
        if (Array.isArray(currentValue)) {
          let newValue = null;
          if (modifiers.includes("number")) {
            newValue = safeParseNumber(event.target.value);
          } else if (modifiers.includes("boolean")) {
            newValue = safeParseBoolean(event.target.value);
          } else {
            newValue = event.target.value;
          }
          return event.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
        if (modifiers.includes("number")) {
          return Array.from(event.target.selectedOptions).map((option) => {
            let rawValue = option.value || option.text;
            return safeParseNumber(rawValue);
          });
        } else if (modifiers.includes("boolean")) {
          return Array.from(event.target.selectedOptions).map((option) => {
            let rawValue = option.value || option.text;
            return safeParseBoolean(rawValue);
          });
        }
        return Array.from(event.target.selectedOptions).map((option) => {
          return option.value || option.text;
        });
      } else {
        let newValue;
        if (isRadio(el)) {
          if (event.target.checked) {
            newValue = event.target.value;
          } else {
            newValue = currentValue;
          }
        } else {
          newValue = event.target.value;
        }
        if (modifiers.includes("number")) {
          return safeParseNumber(newValue);
        } else if (modifiers.includes("boolean")) {
          return safeParseBoolean(newValue);
        } else if (modifiers.includes("trim")) {
          return newValue.trim();
        } else {
          return newValue;
        }
      }
    });
  }
  function safeParseNumber(rawValue) {
    let number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric2(number) ? number : rawValue;
  }
  function checkedAttrLooseCompare2(valueA, valueB) {
    return valueA == valueB;
  }
  function isNumeric2(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function isGetterSetter(value) {
    return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
  }
  directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
  addInitSelector(() => `[${prefix("init")}]`);
  directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
    if (typeof expression === "string") {
      return !!expression.trim() && evaluate2(expression, {}, false);
    }
    return evaluate2(expression, {}, false);
  }));
  directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.textContent = value;
        });
      });
    });
  });
  directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.innerHTML = value ?? "";
          el._x_ignoreSelf = true;
          initTree(el);
          delete el._x_ignoreSelf;
        });
      });
    });
  });
  mapAttributes(startingWith(":", into(prefix("bind:"))));
  var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
    if (!value) {
      let bindingProviders = {};
      injectBindingProviders(bindingProviders);
      let getBindings = evaluateLater(el, expression);
      getBindings((bindings) => {
        applyBindingsObject(el, bindings, original);
      }, { scope: bindingProviders });
      return;
    }
    if (value === "key")
      return storeKeyForXFor(el, expression);
    if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
      return;
    }
    let evaluate2 = evaluateLater(el, expression);
    effect3(() => evaluate2((result) => {
      if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
        result = "";
      }
      mutateDom(() => bind(el, value, result, modifiers));
    }));
    cleanup2(() => {
      el._x_undoAddedClasses && el._x_undoAddedClasses();
      el._x_undoAddedStyles && el._x_undoAddedStyles();
    });
  };
  handler2.inline = (el, { value, modifiers, expression }) => {
    if (!value)
      return;
    if (!el._x_inlineBindings)
      el._x_inlineBindings = {};
    el._x_inlineBindings[value] = { expression, extract: false };
  };
  directive("bind", handler2);
  function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression;
  }
  addRootSelector(() => `[${prefix("data")}]`);
  directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
    if (shouldSkipRegisteringDataDuringClone(el))
      return;
    expression = expression === "" ? "{}" : expression;
    let magicContext = {};
    injectMagics(magicContext, el);
    let dataProviderContext = {};
    injectDataProviders(dataProviderContext, magicContext);
    let data2 = evaluate(el, expression, { scope: dataProviderContext });
    if (data2 === void 0 || data2 === true)
      data2 = {};
    injectMagics(data2, el);
    let reactiveData = reactive(data2);
    initInterceptors(reactiveData);
    let undo = addScopeToNode(el, reactiveData);
    reactiveData["init"] && evaluate(el, reactiveData["init"]);
    cleanup2(() => {
      reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
      undo();
    });
  });
  interceptClone((from, to) => {
    if (from._x_dataStack) {
      to._x_dataStack = from._x_dataStack;
      to.setAttribute("data-has-alpine-state", true);
    }
  });
  function shouldSkipRegisteringDataDuringClone(el) {
    if (!isCloning)
      return false;
    if (isCloningLegacy)
      return true;
    return el.hasAttribute("data-has-alpine-state");
  }
  directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
    let evaluate2 = evaluateLater(el, expression);
    if (!el._x_doHide)
      el._x_doHide = () => {
        mutateDom(() => {
          el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
        });
      };
    if (!el._x_doShow)
      el._x_doShow = () => {
        mutateDom(() => {
          if (el.style.length === 1 && el.style.display === "none") {
            el.removeAttribute("style");
          } else {
            el.style.removeProperty("display");
          }
        });
      };
    let hide = () => {
      el._x_doHide();
      el._x_isShown = false;
    };
    let show = () => {
      el._x_doShow();
      el._x_isShown = true;
    };
    let clickAwayCompatibleShow = () => setTimeout(show);
    let toggle = once(
      (value) => value ? show() : hide(),
      (value) => {
        if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
          el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
        } else {
          value ? clickAwayCompatibleShow() : hide();
        }
      }
    );
    let oldValue;
    let firstTime = true;
    effect3(() => evaluate2((value) => {
      if (!firstTime && value === oldValue)
        return;
      if (modifiers.includes("immediate"))
        value ? clickAwayCompatibleShow() : hide();
      toggle(value);
      oldValue = value;
      firstTime = false;
    }));
  });
  directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
    let iteratorNames = parseForExpression(expression);
    let evaluateItems = evaluateLater(el, iteratorNames.items);
    let evaluateKey = evaluateLater(
      el,
      // the x-bind:key expression is stored for our use instead of evaluated.
      el._x_keyExpression || "index"
    );
    el._x_lookup = /* @__PURE__ */ new Map();
    effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
    cleanup2(() => {
      el._x_lookup.forEach(
        (el2) => mutateDom(() => {
          destroyTree(el2);
          el2.remove();
        })
      );
      delete el._x_lookup;
    });
  });
  function refreshScope(scope2) {
    return (newScope) => {
      Object.entries(newScope).forEach(([key, value]) => {
        scope2[key] = value;
      });
    };
  }
  function loop(templateEl, iteratorNames, evaluateItems, evaluateKey) {
    evaluateItems((items) => {
      if (isNumeric3(items))
        items = Array.from({ length: items }, (-, i) => i + 1);
      if (items === void 0)
        items = [];
      if (items instanceof Set)
        items = Array.from(items);
      if (items instanceof Map)
        items = Array.from(items);
      let oldLookup = templateEl._x_lookup;
      let lookup = /* @__PURE__ */ new Map();
      templateEl._x_lookup = lookup;
      let hasStringKeys = isObject2(items);
      let scopeEntries = Object.entries(items).map(([index, item]) => {
        if (!hasStringKeys)
          index = parseInt(index);
        let scope2 = getIterationScopeVariables(iteratorNames, item, index, items);
        let key;
        evaluateKey((innerKey) => {
          if (typeof innerKey === "object")
            warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
          if (oldLookup.has(innerKey)) {
            lookup.set(innerKey, oldLookup.get(innerKey));
            oldLookup.delete(innerKey);
          }
          key = innerKey;
        }, { scope: { index, ...scope2 } });
        return [key, scope2];
      });
      mutateDom(() => {
        oldLookup.forEach((el) => {
          destroyTree(el);
          el.remove();
        });
        let added = /* @__PURE__ */ new Set();
        let prev = templateEl;
        scopeEntries.forEach(([key, scope2]) => {
          if (lookup.has(key)) {
            let el = lookup.get(key);
            el._x_refreshXForScope(scope2);
            if (prev.nextElementSibling !== el) {
              if (prev.nextElementSibling)
                el.replaceWith(prev.nextElementSibling);
              prev.after(el);
            }
            prev = el;
            if (el._x_currentIfEl) {
              if (el.nextElementSibling !== el._x_currentIfEl)
                prev.after(el._x_currentIfEl);
              prev = el._x_currentIfEl;
            }
            return;
          }
          if (templateEl.content.children.length > 1)
            warn("x-for templates require a single root element, additional elements will be ignored.", templateEl);
          let clone2 = document.importNode(templateEl.content, true).firstElementChild;
          let reactiveScope = reactive(scope2);
          addScopeToNode(clone2, reactiveScope, templateEl);
          clone2._x_refreshXForScope = refreshScope(reactiveScope);
          lookup.set(key, clone2);
          added.add(clone2);
          prev.after(clone2);
          prev = clone2;
        });
        skipDuringClone(() => added.forEach((clone2) => initTree(clone2)))();
      });
    });
  }
  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\s*\(|\)\s*$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch)
      return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].replace(stripParensRE, "").trim();
    let iteratorMatch = item.match(forIteratorRE);
    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, "").trim();
      res.index = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }
    return res;
  }
  function getIterationScopeVariables(iteratorNames, item, index, items) {
    let scopeVariables = {};
    if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
      let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
      names.forEach((name, i) => {
        scopeVariables[name] = item[i];
      });
    } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
      let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
      names.forEach((name) => {
        scopeVariables[name] = item[name];
      });
    } else {
      scopeVariables[iteratorNames.item] = item;
    }
    if (iteratorNames.index)
      scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection)
      scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }
  function isNumeric3(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function isObject2(subject) {
    return typeof subject === "object" && !Array.isArray(subject);
  }
  function handler3() {
  }
  handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
    let root = closestRoot(el);
    if (!root)
      return;
    if (!root._x_refs)
      root._x_refs = {};
    root._x_refs[expression] = el;
    cleanup2(() => delete root._x_refs[expression]);
  };
  directive("ref", handler3);
  directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
    if (el.tagName.toLowerCase() !== "template")
      warn("x-if can only be used on a <template> tag", el);
    let evaluate2 = evaluateLater(el, expression);
    let show = () => {
      if (el._x_currentIfEl)
        return el._x_currentIfEl;
      let clone2 = el.content.cloneNode(true).firstElementChild;
      addScopeToNode(clone2, {}, el);
      mutateDom(() => {
        el.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      el._x_currentIfEl = clone2;
      el._x_undoIf = () => {
        mutateDom(() => {
          destroyTree(clone2);
          clone2.remove();
        });
        delete el._x_currentIfEl;
      };
      return clone2;
    };
    let hide = () => {
      if (!el._x_undoIf)
        return;
      el._x_undoIf();
      delete el._x_undoIf;
    };
    effect3(() => evaluate2((value) => {
      value ? show() : hide();
    }));
    cleanup2(() => el._x_undoIf && el._x_undoIf());
  });
  directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
    let names = evaluate2(expression);
    names.forEach((name) => setIdRoot(el, name));
  });
  interceptClone((from, to) => {
    if (from._x_ids) {
      to._x_ids = from._x_ids;
    }
  });
  mapAttributes(startingWith("@", into(prefix("on:"))));
  directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
    let evaluate2 = expression ? evaluateLater(el, expression) : () => {
    };
    if (el.tagName.toLowerCase() === "template") {
      if (!el._x_forwardEvents)
        el._x_forwardEvents = [];
      if (!el._x_forwardEvents.includes(value))
        el._x_forwardEvents.push(value);
    }
    let removeListener = on(el, value, modifiers, (e) => {
      evaluate2(() => {
      }, { scope: { "$event": e }, params: [e] });
    });
    cleanup2(() => removeListener());
  }));
  warnMissingPluginDirective("Collapse", "collapse", "collapse");
  warnMissingPluginDirective("Intersect", "intersect", "intersect");
  warnMissingPluginDirective("Focus", "trap", "focus");
  warnMissingPluginDirective("Mask", "mask", "mask");
  function warnMissingPluginDirective(name, directiveName, slug) {
    directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
  }
  alpine_default.setEvaluator(normalEvaluator);
  alpine_default.setRawEvaluator(normalRawEvaluator);
  alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
  var src_default = alpine_default;
  var module_default = src_default;

  // node_modules/@casoon/atlas-components/dist/chunk-YN33K25A.js
  var idCounter = 0;
  var generateId = (prefix2) => {
    return `atlas-${prefix2}-${++idCounter}`;
  };
  var getModalAriaAttributes = (options) => ({
    role: "dialog",
    "aria-modal": "true",
    ...options.labelledBy && { "aria-labelledby": options.labelledBy },
    ...options.describedBy && { "aria-describedby": options.describedBy }
  });
  var getDrawerAriaAttributes = (options) => ({
    role: "dialog",
    "aria-modal": "true",
    ...options.labelledBy && { "aria-labelledby": options.labelledBy }
  });
  var getDropdownTriggerAttributes = (options) => ({
    "aria-haspopup": "true",
    "aria-expanded": String(options.isOpen),
    "aria-controls": options.menuId
  });
  var getDropdownMenuAttributes = (options) => ({
    role: "menu",
    id: options.id,
    "aria-labelledby": options.labelledBy
  });
  var getMenuItemAttributes = (options) => ({
    role: "menuitem",
    tabindex: options.disabled ? "-1" : "0",
    ...options.disabled && { "aria-disabled": "true" }
  });
  var announce = (message, priority = "polite") => {
    if (typeof document === "undefined") return;
    const region = document.createElement("div");
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", priority);
    region.setAttribute("aria-atomic", "true");
    region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
    document.body.appendChild(region);
    setTimeout(() => {
      region.textContent = message;
    }, 100);
    setTimeout(() => {
      region.remove();
    }, 1e3);
  };

  // node_modules/@casoon/atlas-components/dist/chunk-Z7WRGBGY.js
  var isBrowser = () => {
    return typeof window !== "undefined" && typeof document !== "undefined";
  };
  var getDocument = () => {
    return isBrowser() ? document : null;
  };
  var createElement = (tag, options = {}) => {
    const doc = getDocument();
    if (!doc) return null;
    const element = doc.createElement(tag);
    if (options.className) {
      element.className = options.className;
    }
    if (options.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        element.setAttribute(key, value);
      }
    }
    if (options.styles) {
      Object.assign(element.style, options.styles);
    }
    if (options.dataset) {
      for (const [key, value] of Object.entries(options.dataset)) {
        element.dataset[key] = value;
      }
    }
    return element;
  };
  var getFocusableElements = (container) => {
    const selector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(", ");
    return Array.from(container.querySelectorAll(selector)).filter(
      (el) => el.offsetParent !== null
      // visible
    );
  };
  var lockScroll = () => {
    const doc = getDocument();
    if (!doc) return () => {
    };
    const scrollY = window.scrollY;
    const body = doc.body;
    const originalStyle = body.style.cssText;
    body.style.cssText = `
    position: fixed;
    top: -${scrollY}px;
    left: 0;
    right: 0;
    overflow: hidden;
  `;
    return () => {
      body.style.cssText = originalStyle;
      window.scrollTo(0, scrollY);
    };
  };
  var addListener = (target, type, listener, options) => {
    target.addEventListener(type, listener, options);
    return () => target.removeEventListener(type, listener, options);
  };

  // node_modules/@casoon/atlas-components/dist/chunk-COURMEEU.js
  var ATTRS = {
    ROOT: "data-atlas-sidebar",
    SIDEBAR: "data-atlas-sidebar-panel",
    CONTENT: "data-atlas-sidebar-content",
    BODY: "data-atlas-sidebar-body",
    GROUP: "data-atlas-sidebar-group",
    GROUP_LABEL: "data-atlas-sidebar-group-label",
    MENU: "data-atlas-sidebar-menu",
    ITEM: "data-atlas-sidebar-item",
    TRIGGER: "data-atlas-sidebar-trigger",
    OVERLAY: "data-atlas-sidebar-overlay"
  };
  var CLASSES = {
    ROOT: "atlas-sidebar-provider",
    SIDEBAR: "atlas-sidebar",
    SIDEBAR_LEFT: "atlas-sidebar--left",
    SIDEBAR_RIGHT: "atlas-sidebar--right",
    SIDEBAR_OPEN: "atlas-sidebar--open",
    SIDEBAR_COLLAPSED: "atlas-sidebar--collapsed",
    CONTENT: "atlas-sidebar-content",
    CONTENT_COLLAPSED: "atlas-sidebar-content--collapsed",
    BODY: "atlas-sidebar-body",
    GROUP: "atlas-sidebar-group",
    GROUP_LABEL: "atlas-sidebar-group-label",
    GROUP_COLLAPSED: "atlas-sidebar-group--collapsed",
    MENU: "atlas-sidebar-menu",
    ITEM: "atlas-sidebar-item",
    ITEM_ACTIVE: "atlas-sidebar-item--active",
    ITEM_DISABLED: "atlas-sidebar-item--disabled",
    ITEM_ICON: "atlas-sidebar-item-icon",
    ITEM_LABEL: "atlas-sidebar-item-label",
    ITEM_BADGE: "atlas-sidebar-item-badge",
    OVERLAY: "atlas-sidebar-overlay",
    OVERLAY_VISIBLE: "atlas-sidebar-overlay--visible"
  };
  var MOBILE_BREAKPOINT = 768;
  function createSidebar(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState();
    }
    const {
      side = "left",
      collapsible = false,
      defaultOpen = true,
      defaultCollapsed = false,
      width = "280px",
      collapsedWidth = "60px",
      groups: initialGroups = []
    } = options;
    let currentGroups = initialGroups;
    let isOpenState = defaultOpen;
    let isCollapsedState = defaultCollapsed;
    let unlockScroll = null;
    generateId("sidebar");
    let sidebarEl = null;
    let contentEl = null;
    let overlayEl = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES.ROOT);
      element.setAttribute(ATTRS.ROOT, "");
      element.style.setProperty("--atlas-sidebar-width", width);
      element.style.setProperty("--atlas-sidebar-width-collapsed", collapsedWidth);
      sidebarEl = element.querySelector(`[${ATTRS.SIDEBAR}]`);
      if (!sidebarEl) {
        sidebarEl = document.createElement("aside");
        sidebarEl.setAttribute(ATTRS.SIDEBAR, "");
      }
      sidebarEl.className = `${CLASSES.SIDEBAR} ${side === "right" ? CLASSES.SIDEBAR_RIGHT : CLASSES.SIDEBAR_LEFT}`;
      sidebarEl.setAttribute("role", "navigation");
      sidebarEl.setAttribute("aria-label", "Sidebar navigation");
      contentEl = element.querySelector(`[${ATTRS.CONTENT}]`);
      if (!contentEl) {
        contentEl = document.createElement("div");
        contentEl.setAttribute(ATTRS.CONTENT, "");
        contentEl.className = CLASSES.CONTENT;
      }
      overlayEl = document.createElement("div");
      overlayEl.className = CLASSES.OVERLAY;
      overlayEl.setAttribute(ATTRS.OVERLAY, "");
      if (currentGroups.length > 0) {
        renderGroups();
      }
      if (!element.querySelector(`[${ATTRS.SIDEBAR}]`)) {
        element.insertBefore(overlayEl, element.firstChild);
        element.insertBefore(sidebarEl, element.firstChild);
      } else {
        element.insertBefore(overlayEl, sidebarEl);
      }
      updateState();
      setupEventListeners();
    }
    function renderGroups() {
      if (!sidebarEl) return;
      let bodyEl = sidebarEl.querySelector(`[${ATTRS.BODY}]`);
      if (!bodyEl) {
        bodyEl = document.createElement("div");
        bodyEl.className = CLASSES.BODY;
        bodyEl.setAttribute(ATTRS.BODY, "");
        sidebarEl.appendChild(bodyEl);
      } else {
        bodyEl.innerHTML = "";
      }
      currentGroups.forEach((group) => {
        const groupEl = createGroupElement(group);
        bodyEl?.appendChild(groupEl);
      });
    }
    function createGroupElement(group) {
      const groupEl = document.createElement("div");
      groupEl.className = CLASSES.GROUP;
      groupEl.setAttribute(ATTRS.GROUP, group.id);
      if (group.collapsed) {
        groupEl.classList.add(CLASSES.GROUP_COLLAPSED);
      }
      if (group.label) {
        const labelEl = document.createElement("div");
        labelEl.className = CLASSES.GROUP_LABEL;
        labelEl.setAttribute(ATTRS.GROUP_LABEL, "");
        labelEl.textContent = group.label;
        if (group.collapsible) {
          labelEl.setAttribute("role", "button");
          labelEl.setAttribute("tabindex", "0");
          labelEl.setAttribute("aria-expanded", group.collapsed ? "false" : "true");
          labelEl.addEventListener("click", () => toggleGroup(group.id));
          labelEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleGroup(group.id);
            }
          });
        }
        groupEl.appendChild(labelEl);
      }
      const menuEl = document.createElement("ul");
      menuEl.className = CLASSES.MENU;
      menuEl.setAttribute(ATTRS.MENU, "");
      menuEl.setAttribute("role", "menu");
      group.items.forEach((item) => {
        const itemEl = createItemElement(item);
        menuEl.appendChild(itemEl);
      });
      groupEl.appendChild(menuEl);
      return groupEl;
    }
    function createItemElement(item) {
      const li = document.createElement("li");
      li.setAttribute("role", "none");
      const link = document.createElement("a");
      link.className = CLASSES.ITEM;
      link.setAttribute(ATTRS.ITEM, item.id);
      link.setAttribute("role", "menuitem");
      link.href = item.href || "#";
      link.tabIndex = 0;
      if (item.active) {
        link.classList.add(CLASSES.ITEM_ACTIVE);
        link.setAttribute("aria-current", "page");
      }
      if (item.disabled) {
        link.classList.add(CLASSES.ITEM_DISABLED);
        link.setAttribute("aria-disabled", "true");
        link.tabIndex = -1;
      }
      if (item.icon) {
        const iconEl = document.createElement("span");
        iconEl.className = CLASSES.ITEM_ICON;
        iconEl.setAttribute("aria-hidden", "true");
        iconEl.innerHTML = item.icon;
        link.appendChild(iconEl);
      }
      const labelEl = document.createElement("span");
      labelEl.className = CLASSES.ITEM_LABEL;
      labelEl.textContent = item.label;
      link.appendChild(labelEl);
      if (item.badge) {
        const badgeEl = document.createElement("span");
        badgeEl.className = CLASSES.ITEM_BADGE;
        badgeEl.textContent = item.badge;
        link.appendChild(badgeEl);
      }
      link.addEventListener("click", (e) => {
        if (item.disabled) {
          e.preventDefault();
          return;
        }
        item.onSelect?.();
        options.onSelect?.(item);
        if (!item.href || item.href === "#") {
          e.preventDefault();
        }
        if (isMobile()) {
          close();
        }
      });
      li.appendChild(link);
      return li;
    }
    function setupEventListeners() {
      if (overlayEl) {
        cleanups.push(
          addListener(overlayEl, "click", () => {
            close();
          })
        );
      }
      const triggers = element.querySelectorAll(`[${ATTRS.TRIGGER}]`);
      triggers.forEach((trigger2) => {
        cleanups.push(
          addListener(trigger2, "click", () => {
            if (isMobile()) {
              toggle();
            } else if (collapsible) {
              toggleCollapse();
            }
          })
        );
      });
      cleanups.push(
        addListener(document, "keydown", (e) => {
          const ke = e;
          if (ke.key === "Escape" && isOpenState && isMobile()) {
            close();
          }
        })
      );
      cleanups.push(
        addListener(window, "resize", () => {
          updateState();
        })
      );
    }
    function isMobile() {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    function toggleGroup(groupId) {
      const group = currentGroups.find((g) => g.id === groupId);
      if (!group) return;
      group.collapsed = !group.collapsed;
      const groupEl = element.querySelector(`[${ATTRS.GROUP}="${groupId}"]`);
      const labelEl = groupEl?.querySelector(`[${ATTRS.GROUP_LABEL}]`);
      if (groupEl) {
        groupEl.classList.toggle(CLASSES.GROUP_COLLAPSED, group.collapsed);
      }
      if (labelEl) {
        labelEl.setAttribute("aria-expanded", group.collapsed ? "false" : "true");
      }
    }
    function updateState() {
      if (!sidebarEl || !contentEl || !overlayEl) return;
      const mobile = isMobile();
      if (mobile) {
        sidebarEl.classList.toggle(CLASSES.SIDEBAR_OPEN, isOpenState);
        sidebarEl.classList.remove(CLASSES.SIDEBAR_COLLAPSED);
        overlayEl.classList.toggle(CLASSES.OVERLAY_VISIBLE, isOpenState);
        if (isOpenState && !unlockScroll) {
          unlockScroll = lockScroll();
        } else if (!isOpenState && unlockScroll) {
          unlockScroll();
          unlockScroll = null;
        }
      } else {
        sidebarEl.classList.remove(CLASSES.SIDEBAR_OPEN);
        sidebarEl.classList.toggle(CLASSES.SIDEBAR_COLLAPSED, isCollapsedState);
        overlayEl.classList.remove(CLASSES.OVERLAY_VISIBLE);
        contentEl.classList.toggle(CLASSES.CONTENT_COLLAPSED, isCollapsedState);
        if (unlockScroll) {
          unlockScroll();
          unlockScroll = null;
        }
      }
      sidebarEl.setAttribute("aria-hidden", mobile && !isOpenState ? "true" : "false");
    }
    function open() {
      if (isOpenState) return;
      isOpenState = true;
      updateState();
      options.onOpenChange?.(true);
    }
    function close() {
      if (!isOpenState) return;
      isOpenState = false;
      updateState();
      options.onOpenChange?.(false);
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function collapse() {
      if (isCollapsedState || !collapsible) return;
      isCollapsedState = true;
      updateState();
      options.onCollapsedChange?.(true);
    }
    function expand() {
      if (!isCollapsedState) return;
      isCollapsedState = false;
      updateState();
      options.onCollapsedChange?.(false);
    }
    function toggleCollapse() {
      if (isCollapsedState) {
        expand();
      } else {
        collapse();
      }
    }
    function setActiveItem(itemId) {
      element.querySelectorAll(`.${CLASSES.ITEM_ACTIVE}`).forEach((el) => {
        el.classList.remove(CLASSES.ITEM_ACTIVE);
        el.removeAttribute("aria-current");
      });
      const itemEl = element.querySelector(`[${ATTRS.ITEM}="${itemId}"]`);
      if (itemEl) {
        itemEl.classList.add(CLASSES.ITEM_ACTIVE);
        itemEl.setAttribute("aria-current", "page");
      }
      currentGroups.forEach((group) => {
        group.items.forEach((item) => {
          item.active = item.id === itemId;
        });
      });
    }
    function destroy() {
      if (unlockScroll) {
        unlockScroll();
      }
      cleanups.forEach((cleanup2) => cleanup2());
      overlayEl?.remove();
      element.classList.remove(CLASSES.ROOT);
      element.removeAttribute(ATTRS.ROOT);
      element.style.removeProperty("--atlas-sidebar-width");
      element.style.removeProperty("--atlas-sidebar-width-collapsed");
    }
    init();
    return {
      isOpen: () => isOpenState,
      isCollapsed: () => isCollapsedState,
      open,
      close,
      toggle,
      collapse,
      expand,
      toggleCollapse,
      getGroups: () => [...currentGroups],
      setGroups: (groups) => {
        currentGroups = groups;
        renderGroups();
      },
      setActiveItem,
      destroy
    };
  }
  function createNoopState() {
    return {
      isOpen: () => false,
      isCollapsed: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      collapse: () => {
      },
      expand: () => {
      },
      toggleCollapse: () => {
      },
      getGroups: () => [],
      setGroups: () => {
      },
      setActiveItem: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-PTH7T5K6.js
  var ANIMATION_DURATION = {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 400
  };
  var EASING = {
    /** Standard ease for most animations */
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    /** Decelerate - elements entering the screen */
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    /** Accelerate - elements leaving the screen */
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    /** Bounce - for playful feedback */
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    /** Spring - natural feeling */
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  };
  var Z_INDEX = {
    dropdown: 100,
    sticky: 200,
    drawer: 300,
    modal: 400,
    toast: 500,
    tooltip: 600
  };

  // node_modules/@casoon/atlas-components/dist/chunk-OF6BWNO5.js
  function createSlider(element, options = {}) {
    if (!isBrowser()) {
      return createNoopSliderState();
    }
    const {
      min = 0,
      max = 100,
      step = 1,
      value: initialValue = 50,
      orientation = "horizontal",
      size: size2 = "md",
      disabled: initialDisabled = false,
      showTooltip = true,
      alwaysShowTooltip = false,
      marks = false,
      formatValue = (v) => String(v),
      name,
      onChange,
      onDragStart,
      onDragEnd
    } = options;
    const id = generateId("slider");
    const isRange = Array.isArray(initialValue);
    let currentValue = isRange ? [...initialValue] : initialValue;
    let isDisabled = initialDisabled;
    let isDragging = false;
    let activeHandle = null;
    const cleanupListeners = [];
    const sizeConfig = {
      sm: { track: 4, thumb: 14 },
      md: { track: 6, thumb: 18 },
      lg: { track: 8, thumb: 22 }
    };
    const { track: trackSize, thumb: thumbSize } = sizeConfig[size2];
    let track2;
    let trackFill;
    let thumbStart;
    let thumbEnd = null;
    let tooltipStart = null;
    let tooltipEnd = null;
    function createStructure() {
      element.innerHTML = "";
      element.classList.add("atlas-slider", `atlas-slider-${size2}`, `atlas-slider-${orientation}`);
      element.setAttribute("data-atlas-slider", "");
      element.setAttribute("role", "group");
      element.setAttribute("aria-label", "Slider");
      const isVertical = orientation === "vertical";
      element.style.cssText = `
      position: relative;
      ${isVertical ? "height: 200px; width: auto;" : "width: 100%; height: auto;"}
      display: flex;
      align-items: center;
      ${isVertical ? "flex-direction: column;" : ""}
      padding: ${thumbSize / 2}px;
      touch-action: none;
      user-select: none;
    `;
      track2 = document.createElement("div");
      track2.className = "atlas-slider-track";
      track2.style.cssText = `
      position: relative;
      ${isVertical ? `width: ${trackSize}px; height: 100%;` : `height: ${trackSize}px; width: 100%;`}
      background: var(--atlas-muted, hsl(210 40% 96.1%));
      border-radius: ${trackSize / 2}px;
      cursor: ${isDisabled ? "not-allowed" : "pointer"};
    `;
      trackFill = document.createElement("div");
      trackFill.className = "atlas-slider-fill";
      trackFill.style.cssText = `
      position: absolute;
      ${isVertical ? `width: 100%; left: 0;` : `height: 100%; top: 0;`}
      background: var(--atlas-primary, hsl(222.2 47.4% 11.2%));
      border-radius: ${trackSize / 2}px;
      pointer-events: none;
      transition: ${isDragging ? "none" : `all ${ANIMATION_DURATION.fast}ms ${EASING.standard}`};
    `;
      track2.appendChild(trackFill);
      thumbStart = createThumb("start");
      track2.appendChild(thumbStart);
      if (isRange) {
        thumbEnd = createThumb("end");
        track2.appendChild(thumbEnd);
      }
      element.appendChild(track2);
      if (marks) {
        createMarks();
      }
      if (name) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = name;
        hiddenInput.id = `${id}-hidden`;
        hiddenInput.value = isRange ? currentValue.join(",") : String(currentValue);
        element.appendChild(hiddenInput);
      }
      updatePositions();
    }
    function createThumb(type) {
      const thumb = document.createElement("div");
      thumb.className = `atlas-slider-thumb atlas-slider-thumb-${type}`;
      thumb.setAttribute("role", "slider");
      thumb.setAttribute("tabindex", isDisabled ? "-1" : "0");
      thumb.setAttribute("aria-valuemin", String(min));
      thumb.setAttribute("aria-valuemax", String(max));
      thumb.setAttribute("aria-orientation", orientation);
      thumb.id = `${id}-thumb-${type}`;
      const isVertical = orientation === "vertical";
      thumb.style.cssText = `
      position: absolute;
      width: ${thumbSize}px;
      height: ${thumbSize}px;
      background: var(--atlas-background, hsl(0 0% 100%));
      border: 2px solid var(--atlas-primary, hsl(222.2 47.4% 11.2%));
      border-radius: 50%;
      cursor: ${isDisabled ? "not-allowed" : "grab"};
      transform: translate(${isVertical ? "-50%" : "-50%"}, ${isVertical ? "50%" : "-50%"});
      ${isVertical ? "left: 50%;" : "top: 50%;"}
      transition: ${isDragging ? "none" : `box-shadow ${ANIMATION_DURATION.fast}ms ${EASING.standard}`};
      z-index: 1;
    `;
      if (showTooltip || alwaysShowTooltip) {
        const tooltip = document.createElement("div");
        tooltip.className = "atlas-slider-tooltip";
        tooltip.style.cssText = `
        position: absolute;
        ${isVertical ? "left: calc(100% + 8px); top: 50%; transform: translateY(-50%);" : "bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);"}
        background: var(--atlas-foreground, hsl(222.2 84% 4.9%));
        color: var(--atlas-background, hsl(0 0% 100%));
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: ${alwaysShowTooltip ? "1" : "0"};
        transition: opacity ${ANIMATION_DURATION.fast}ms ${EASING.standard};
      `;
        thumb.appendChild(tooltip);
        if (type === "start") {
          tooltipStart = tooltip;
        } else {
          tooltipEnd = tooltip;
        }
      }
      setupThumbListeners(thumb, type);
      return thumb;
    }
    function createMarks() {
      const marksContainer = document.createElement("div");
      marksContainer.className = "atlas-slider-marks";
      const isVertical = orientation === "vertical";
      marksContainer.style.cssText = `
      position: absolute;
      ${isVertical ? "left: calc(100% + 12px); top: 0; height: 100%;" : "top: calc(100% + 8px); left: 0; width: 100%;"}
      pointer-events: none;
    `;
      const markPositions = marks === true ? generateAutoMarks() : marks;
      markPositions.forEach((mark) => {
        const percent = (mark.value - min) / (max - min) * 100;
        const markEl = document.createElement("div");
        markEl.className = "atlas-slider-mark";
        markEl.style.cssText = `
        position: absolute;
        ${isVertical ? `bottom: ${percent}%; transform: translateY(50%);` : `left: ${percent}%; transform: translateX(-50%);`}
        font-size: 11px;
        color: var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%));
      `;
        markEl.textContent = mark.label ?? String(mark.value);
        marksContainer.appendChild(markEl);
      });
      element.appendChild(marksContainer);
    }
    function generateAutoMarks() {
      const range = max - min;
      const markStep = range / 4;
      const marks2 = [];
      for (let i = 0; i <= 4; i++) {
        marks2.push({ value: min + markStep * i });
      }
      return marks2;
    }
    function setupThumbListeners(thumb, type) {
      const handleMouseDown = (e) => {
        if (isDisabled) return;
        e.preventDefault();
        startDrag(type);
        const handleMouseMove = (e2) => {
          updateValueFromEvent(e2, type);
        };
        const handleMouseUp = () => {
          endDrag();
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      };
      cleanupListeners.push(addListener(thumb, "mousedown", handleMouseDown));
      const handleTouchStart = (e) => {
        if (isDisabled) return;
        e.preventDefault();
        startDrag(type);
        const handleTouchMove = (e2) => {
          updateValueFromEvent(e2.touches[0], type);
        };
        const handleTouchEnd = () => {
          endDrag();
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd);
      };
      cleanupListeners.push(
        addListener(thumb, "touchstart", handleTouchStart, { passive: false })
      );
      cleanupListeners.push(
        addListener(thumb, "keydown", ((e) => {
          if (isDisabled) return;
          handleKeyDown(e, type);
        }))
      );
      if (showTooltip && !alwaysShowTooltip) {
        cleanupListeners.push(
          addListener(thumb, "focus", (() => {
            const tooltip = type === "start" ? tooltipStart : tooltipEnd;
            if (tooltip) tooltip.style.opacity = "1";
          })),
          addListener(thumb, "blur", (() => {
            const tooltip = type === "start" ? tooltipStart : tooltipEnd;
            if (tooltip) tooltip.style.opacity = "0";
          }))
        );
      }
    }
    function startDrag(type) {
      isDragging = true;
      activeHandle = type;
      const thumb = type === "start" ? thumbStart : thumbEnd;
      if (thumb) {
        thumb.style.cursor = "grabbing";
        thumb.style.boxShadow = "0 0 0 4px hsl(var(--atlas-ring) / 0.3)";
      }
      if (showTooltip && !alwaysShowTooltip) {
        const tooltip = type === "start" ? tooltipStart : tooltipEnd;
        if (tooltip) tooltip.style.opacity = "1";
      }
      onDragStart?.();
    }
    function endDrag() {
      isDragging = false;
      const thumb = activeHandle === "start" ? thumbStart : thumbEnd;
      if (thumb) {
        thumb.style.cursor = isDisabled ? "not-allowed" : "grab";
        thumb.style.boxShadow = "none";
      }
      if (showTooltip && !alwaysShowTooltip) {
        const tooltip = activeHandle === "start" ? tooltipStart : tooltipEnd;
        if (tooltip) tooltip.style.opacity = "0";
      }
      activeHandle = null;
      onDragEnd?.();
    }
    function updateValueFromEvent(e, type) {
      const rect = track2.getBoundingClientRect();
      const isVertical = orientation === "vertical";
      let percent;
      if (isVertical) {
        percent = 1 - (e.clientY - rect.top) / rect.height;
      } else {
        percent = (e.clientX - rect.left) / rect.width;
      }
      percent = Math.max(0, Math.min(1, percent));
      let newValue = min + percent * (max - min);
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));
      if (isRange) {
        const [startVal, endVal] = currentValue;
        if (type === "start") {
          newValue = Math.min(newValue, endVal);
          currentValue = [newValue, endVal];
        } else {
          newValue = Math.max(newValue, startVal);
          currentValue = [startVal, newValue];
        }
      } else {
        currentValue = newValue;
      }
      updatePositions();
      updateHiddenInput();
      onChange?.(currentValue);
    }
    function handleKeyDown(e, type) {
      const isVertical = orientation === "vertical";
      let delta = 0;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          delta = isVertical ? e.key === "ArrowUp" ? step : 0 : e.key === "ArrowRight" ? step : 0;
          if (delta === 0) delta = step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          delta = isVertical ? e.key === "ArrowDown" ? -step : 0 : e.key === "ArrowLeft" ? -step : 0;
          if (delta === 0) delta = -step;
          break;
        case "PageUp":
          delta = step * 10;
          break;
        case "PageDown":
          delta = -step * 10;
          break;
        case "Home":
          if (isRange) {
            const [, endVal] = currentValue;
            currentValue = type === "start" ? [min, endVal] : [min, min];
          } else {
            currentValue = min;
          }
          updatePositions();
          updateHiddenInput();
          onChange?.(currentValue);
          e.preventDefault();
          return;
        case "End":
          if (isRange) {
            const [startVal] = currentValue;
            currentValue = type === "end" ? [startVal, max] : [max, max];
          } else {
            currentValue = max;
          }
          updatePositions();
          updateHiddenInput();
          onChange?.(currentValue);
          e.preventDefault();
          return;
        default:
          return;
      }
      e.preventDefault();
      if (isRange) {
        const [startVal, endVal] = currentValue;
        if (type === "start") {
          let newStart = startVal + delta;
          newStart = Math.max(min, Math.min(newStart, endVal));
          currentValue = [newStart, endVal];
        } else {
          let newEnd = endVal + delta;
          newEnd = Math.max(startVal, Math.min(newEnd, max));
          currentValue = [startVal, newEnd];
        }
      } else {
        let newValue = currentValue + delta;
        newValue = Math.max(min, Math.min(newValue, max));
        currentValue = newValue;
      }
      updatePositions();
      updateHiddenInput();
      onChange?.(currentValue);
    }
    function updatePositions() {
      const isVertical = orientation === "vertical";
      if (isRange) {
        const [startVal, endVal] = currentValue;
        const startPercent = (startVal - min) / (max - min) * 100;
        const endPercent = (endVal - min) / (max - min) * 100;
        if (isVertical) {
          thumbStart.style.bottom = `${startPercent}%`;
          if (thumbEnd) thumbEnd.style.bottom = `${endPercent}%`;
          trackFill.style.bottom = `${startPercent}%`;
          trackFill.style.height = `${endPercent - startPercent}%`;
        } else {
          thumbStart.style.left = `${startPercent}%`;
          if (thumbEnd) thumbEnd.style.left = `${endPercent}%`;
          trackFill.style.left = `${startPercent}%`;
          trackFill.style.width = `${endPercent - startPercent}%`;
        }
        thumbStart.setAttribute("aria-valuenow", String(startVal));
        thumbStart.setAttribute("aria-valuetext", formatValue(startVal));
        thumbEnd?.setAttribute("aria-valuenow", String(endVal));
        thumbEnd?.setAttribute("aria-valuetext", formatValue(endVal));
        if (tooltipStart) tooltipStart.textContent = formatValue(startVal);
        if (tooltipEnd) tooltipEnd.textContent = formatValue(endVal);
      } else {
        const value = currentValue;
        const percent = (value - min) / (max - min) * 100;
        if (isVertical) {
          thumbStart.style.bottom = `${percent}%`;
          trackFill.style.bottom = "0";
          trackFill.style.height = `${percent}%`;
        } else {
          thumbStart.style.left = `${percent}%`;
          trackFill.style.left = "0";
          trackFill.style.width = `${percent}%`;
        }
        thumbStart.setAttribute("aria-valuenow", String(value));
        thumbStart.setAttribute("aria-valuetext", formatValue(value));
        if (tooltipStart) tooltipStart.textContent = formatValue(value);
      }
    }
    function updateHiddenInput() {
      if (!name) return;
      const hiddenInput = element.querySelector(`#${id}-hidden`);
      if (hiddenInput) {
        hiddenInput.value = isRange ? currentValue.join(",") : String(currentValue);
      }
    }
    function updateDisabledState() {
      const thumbs = [thumbStart, thumbEnd].filter(Boolean);
      thumbs.forEach((thumb) => {
        thumb.setAttribute("tabindex", isDisabled ? "-1" : "0");
        thumb.style.cursor = isDisabled ? "not-allowed" : "grab";
        thumb.style.opacity = isDisabled ? "0.5" : "1";
      });
      track2.style.cursor = isDisabled ? "not-allowed" : "pointer";
      track2.style.opacity = isDisabled ? "0.5" : "1";
      if (isDisabled) {
        element.setAttribute("aria-disabled", "true");
      } else {
        element.removeAttribute("aria-disabled");
      }
    }
    function setupTrackClick() {
      cleanupListeners.push(
        addListener(track2, "click", ((e) => {
          if (isDisabled) return;
          if (e.target !== track2 && e.target !== trackFill) return;
          const rect = track2.getBoundingClientRect();
          const isVertical = orientation === "vertical";
          let percent;
          if (isVertical) {
            percent = 1 - (e.clientY - rect.top) / rect.height;
          } else {
            percent = (e.clientX - rect.left) / rect.width;
          }
          percent = Math.max(0, Math.min(1, percent));
          let newValue = min + percent * (max - min);
          newValue = Math.round(newValue / step) * step;
          if (isRange) {
            const [startVal, endVal] = currentValue;
            const distToStart = Math.abs(newValue - startVal);
            const distToEnd = Math.abs(newValue - endVal);
            if (distToStart <= distToEnd) {
              currentValue = [Math.min(newValue, endVal), endVal];
            } else {
              currentValue = [startVal, Math.max(newValue, startVal)];
            }
          } else {
            currentValue = newValue;
          }
          updatePositions();
          updateHiddenInput();
          onChange?.(currentValue);
        }))
      );
    }
    createStructure();
    setupTrackClick();
    updateDisabledState();
    const setValue = (value) => {
      if (isRange && Array.isArray(value)) {
        currentValue = [
          Math.max(min, Math.min(value[0], max)),
          Math.max(min, Math.min(value[1], max))
        ];
      } else if (!isRange && typeof value === "number") {
        currentValue = Math.max(min, Math.min(value, max));
      }
      updatePositions();
      updateHiddenInput();
      onChange?.(currentValue);
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      updateDisabledState();
    };
    const focus = () => {
      thumbStart.focus();
    };
    const destroy = () => {
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.innerHTML = "";
      element.classList.remove("atlas-slider", `atlas-slider-${size2}`, `atlas-slider-${orientation}`);
      element.removeAttribute("data-atlas-slider");
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
      element.removeAttribute("aria-disabled");
      element.style.cssText = "";
    };
    return {
      get value() {
        return currentValue;
      },
      get isDisabled() {
        return isDisabled;
      },
      get isDragging() {
        return isDragging;
      },
      get isRange() {
        return isRange;
      },
      setValue,
      setDisabled,
      focus,
      destroy
    };
  }
  function createNoopSliderState() {
    return {
      get value() {
        return 0;
      },
      get isDisabled() {
        return false;
      },
      get isDragging() {
        return false;
      },
      get isRange() {
        return false;
      },
      setValue: () => {
      },
      setDisabled: () => {
      },
      focus: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-JFKLXHXA.js
  function createTextarea(element, options = {}) {
    if (!isBrowser()) {
      return createNoopTextareaState();
    }
    const {
      size: size2 = "md",
      autoResize = false,
      resize = "vertical",
      minHeight,
      maxHeight,
      rows = 3,
      maxLength,
      showCount = false,
      placeholder,
      disabled: initialDisabled = false,
      readOnly = false,
      focusGlow = true,
      validate,
      validateDebounce = 300,
      validateOnBlur = true,
      validateOnInput = false,
      name,
      onChange,
      onValidate,
      onFocus,
      onBlur
    } = options;
    const id = generateId("textarea");
    let isValid = true;
    let errorMessage = null;
    let isFocused = false;
    let isDisabled = initialDisabled;
    let validateTimeout = null;
    let countElement = null;
    let wrapper = null;
    const cleanupListeners = [];
    const originalStyles = {
      transition: element.style.transition,
      boxShadow: element.style.boxShadow,
      resize: element.style.resize,
      overflow: element.style.overflow
    };
    element.classList.add("atlas-textarea", `atlas-textarea-${size2}`);
    element.setAttribute("data-atlas-textarea", "");
    if (!element.id) {
      element.id = id;
    }
    element.rows = rows;
    if (name) element.name = name;
    if (placeholder) element.placeholder = placeholder;
    if (maxLength !== void 0) element.maxLength = maxLength;
    if (readOnly) element.readOnly = true;
    element.disabled = isDisabled;
    const sizeStyles = {
      sm: { fontSize: "0.875rem", padding: "0.5rem 0.75rem" },
      md: { fontSize: "1rem", padding: "0.625rem 0.875rem" },
      lg: { fontSize: "1.125rem", padding: "0.75rem 1rem" }
    };
    const { fontSize, padding } = sizeStyles[size2];
    element.style.cssText = `
    width: 100%;
    font-size: ${fontSize};
    padding: ${padding};
    border: 1px solid var(--atlas-border, hsl(214.3 31.8% 91.4%));
    border-radius: 6px;
    background: var(--atlas-background, hsl(0 0% 100%));
    color: var(--atlas-foreground, hsl(222.2 84% 4.9%));
    outline: none;
    font-family: inherit;
    line-height: 1.5;
    resize: ${autoResize ? "none" : resize};
    transition: border-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
                box-shadow ${ANIMATION_DURATION.fast}ms ${EASING.standard};
  `;
    if (minHeight) {
      element.style.minHeight = `${minHeight}px`;
    }
    if (maxHeight) {
      element.style.maxHeight = `${maxHeight}px`;
    }
    if (showCount) {
      const parent = element.parentElement;
      if (parent && !parent.classList.contains("atlas-textarea-wrapper")) {
        wrapper = document.createElement("div");
        wrapper.className = "atlas-textarea-wrapper";
        wrapper.style.cssText = "position: relative; width: 100%;";
        parent.insertBefore(wrapper, element);
        wrapper.appendChild(element);
      } else {
        wrapper = parent;
      }
      countElement = document.createElement("span");
      countElement.className = "atlas-textarea-count";
      countElement.style.cssText = `
      position: absolute;
      right: 0.75rem;
      bottom: 0.5rem;
      font-size: 0.75rem;
      color: var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%));
      pointer-events: none;
      background: var(--atlas-background, hsl(0 0% 100%));
      padding: 0 0.25rem;
    `;
      updateCount();
      wrapper?.appendChild(countElement);
    }
    function adjustHeight() {
      if (!autoResize) return;
      element.style.height = "auto";
      let newHeight = element.scrollHeight;
      if (minHeight && newHeight < minHeight) {
        newHeight = minHeight;
      }
      if (maxHeight && newHeight > maxHeight) {
        newHeight = maxHeight;
        element.style.overflowY = "auto";
      } else {
        element.style.overflowY = "hidden";
      }
      element.style.height = `${newHeight}px`;
    }
    function updateCount() {
      if (!countElement) return;
      const current = element.value.length;
      const max = maxLength;
      countElement.textContent = max ? `${current}/${max}` : String(current);
      if (max) {
        if (current >= max) {
          countElement.style.color = "var(--atlas-destructive, hsl(0 84.2% 60.2%))";
        } else if (current >= max * 0.9) {
          countElement.style.color = "var(--atlas-warning, hsl(38 92% 50%))";
        } else {
          countElement.style.color = "var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%))";
        }
      }
    }
    function applyFocusGlow() {
      if (!focusGlow) return;
      element.style.borderColor = "var(--atlas-ring, hsl(215 20.2% 65.1%))";
      element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-ring) / 0.2)";
    }
    function removeFocusGlow() {
      if (!isValid) {
        element.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))";
        element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
      } else {
        element.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))";
        element.style.boxShadow = "none";
      }
    }
    function shakeElement() {
      if (!element.animate) return;
      element.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" }
        ],
        {
          duration: 400,
          easing: "ease-in-out"
        }
      );
    }
    function runValidation() {
      if (!validate) {
        isValid = true;
        errorMessage = null;
        return true;
      }
      const result = validate(element.value);
      isValid = result === null;
      errorMessage = result;
      if (isValid) {
        element.classList.remove("atlas-textarea-error");
        element.removeAttribute("aria-invalid");
        removeFocusGlow();
      } else {
        element.classList.add("atlas-textarea-error");
        element.setAttribute("aria-invalid", "true");
        element.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))";
        element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
        shakeElement();
      }
      onValidate?.(isValid, errorMessage || void 0);
      return isValid;
    }
    function debouncedValidate() {
      if (validateTimeout) {
        clearTimeout(validateTimeout);
      }
      validateTimeout = setTimeout(() => {
        runValidation();
      }, validateDebounce);
    }
    const handleFocus = () => {
      isFocused = true;
      applyFocusGlow();
      onFocus?.();
    };
    const handleBlur = () => {
      isFocused = false;
      removeFocusGlow();
      if (validateOnBlur && validate) {
        runValidation();
      }
      onBlur?.();
    };
    const handleInput = () => {
      onChange?.(element.value);
      if (showCount) {
        updateCount();
      }
      if (autoResize) {
        adjustHeight();
      }
      if (validateOnInput && validate) {
        debouncedValidate();
      }
      if (!isValid && element.value) {
        element.classList.remove("atlas-textarea-error");
        if (isFocused) {
          applyFocusGlow();
        } else {
          element.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))";
          element.style.boxShadow = "none";
        }
      }
    };
    cleanupListeners.push(
      addListener(element, "focus", handleFocus),
      addListener(element, "blur", handleBlur),
      addListener(element, "input", handleInput)
    );
    if (autoResize) {
      requestAnimationFrame(adjustHeight);
    }
    const setValue = (value) => {
      element.value = value;
      if (showCount) {
        updateCount();
      }
      if (autoResize) {
        adjustHeight();
      }
      onChange?.(value);
    };
    const validateFn = () => {
      return runValidation();
    };
    const setError = (message) => {
      isValid = false;
      errorMessage = message;
      element.classList.add("atlas-textarea-error");
      element.setAttribute("aria-invalid", "true");
      element.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))";
      element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
      shakeElement();
      onValidate?.(false, message);
    };
    const clearError = () => {
      isValid = true;
      errorMessage = null;
      element.classList.remove("atlas-textarea-error");
      element.removeAttribute("aria-invalid");
      if (isFocused) {
        applyFocusGlow();
      } else {
        element.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))";
        element.style.boxShadow = "none";
      }
      onValidate?.(true);
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      element.disabled = disabled;
      if (disabled) {
        element.style.opacity = "0.5";
        element.style.cursor = "not-allowed";
      } else {
        element.style.opacity = "1";
        element.style.cursor = "text";
      }
    };
    const focus = () => {
      element.focus();
    };
    const blur = () => {
      element.blur();
    };
    const selectAll = () => {
      element.select();
    };
    const destroy = () => {
      if (validateTimeout) {
        clearTimeout(validateTimeout);
      }
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.style.transition = originalStyles.transition;
      element.style.boxShadow = originalStyles.boxShadow;
      element.style.resize = originalStyles.resize;
      element.style.overflow = originalStyles.overflow;
      element.classList.remove("atlas-textarea", `atlas-textarea-${size2}`, "atlas-textarea-error");
      element.removeAttribute("data-atlas-textarea");
      element.removeAttribute("aria-invalid");
      if (countElement) {
        countElement.remove();
      }
      if (wrapper?.classList.contains("atlas-textarea-wrapper")) {
        const parent = wrapper.parentElement;
        if (parent) {
          parent.insertBefore(element, wrapper);
          wrapper.remove();
        }
      }
    };
    return {
      get value() {
        return element.value;
      },
      get isValid() {
        return isValid;
      },
      get errorMessage() {
        return errorMessage;
      },
      get isFocused() {
        return isFocused;
      },
      get isDisabled() {
        return isDisabled;
      },
      setValue,
      validate: validateFn,
      setError,
      clearError,
      setDisabled,
      focus,
      blur,
      selectAll,
      destroy
    };
  }
  function createNoopTextareaState() {
    return {
      get value() {
        return "";
      },
      get isValid() {
        return true;
      },
      get errorMessage() {
        return null;
      },
      get isFocused() {
        return false;
      },
      get isDisabled() {
        return false;
      },
      setValue: () => {
      },
      validate: () => true,
      setError: () => {
      },
      clearError: () => {
      },
      setDisabled: () => {
      },
      focus: () => {
      },
      blur: () => {
      },
      selectAll: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-ZG6MA7L6.js
  function createRovingFocus(container, options = {}) {
    if (!isBrowser()) {
      return {
        setFocus: () => {
        },
        getCurrentIndex: () => -1,
        update: () => {
        },
        destroy: () => {
        }
      };
    }
    const {
      orientation = "horizontal",
      loop: loop2 = true,
      itemSelector = '[role="menuitem"], [role="option"], [role="tab"], [role="radio"]',
      onFocusChange,
      homeEnd = true
    } = options;
    let currentIndex = 0;
    function getItems() {
      return Array.from(container.querySelectorAll(itemSelector)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-disabled") !== "true"
      );
    }
    function setFocus(index) {
      const items = getItems();
      if (items.length === 0) return;
      if (loop2) {
        index = (index % items.length + items.length) % items.length;
      } else {
        index = Math.max(0, Math.min(index, items.length - 1));
      }
      items.forEach((item, i) => {
        item.setAttribute("tabindex", i === index ? "0" : "-1");
      });
      items[index]?.focus();
      currentIndex = index;
      onFocusChange?.(items[index], index);
    }
    function handleKeyDown(event) {
      const items = getItems();
      if (items.length === 0) return;
      const target = event.target;
      const currentIdx = items.indexOf(target);
      if (currentIdx === -1) return;
      let handled = false;
      let nextIndex = currentIdx;
      switch (event.key) {
        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            nextIndex = currentIdx + 1;
            handled = true;
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            nextIndex = currentIdx - 1;
            handled = true;
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            nextIndex = currentIdx + 1;
            handled = true;
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            nextIndex = currentIdx - 1;
            handled = true;
          }
          break;
        case "Home":
          if (homeEnd) {
            nextIndex = 0;
            handled = true;
          }
          break;
        case "End":
          if (homeEnd) {
            nextIndex = items.length - 1;
            handled = true;
          }
          break;
      }
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
        setFocus(nextIndex);
      }
    }
    function update() {
      const items = getItems();
      items.forEach((item, i) => {
        item.setAttribute("tabindex", i === currentIndex ? "0" : "-1");
      });
    }
    update();
    container.addEventListener("keydown", handleKeyDown);
    return {
      setFocus,
      getCurrentIndex: () => currentIndex,
      update,
      destroy: () => {
        container.removeEventListener("keydown", handleKeyDown);
      }
    };
  }
  function createTypeahead(container, options = {}) {
    if (!isBrowser()) {
      return {
        reset: () => {
        },
        destroy: () => {
        }
      };
    }
    const {
      itemSelector = '[role="menuitem"], [role="option"]',
      textAttribute = "data-text",
      timeout = 500,
      onMatch
    } = options;
    let searchString = "";
    let searchTimeout = null;
    function getItems() {
      return Array.from(container.querySelectorAll(itemSelector)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-disabled") !== "true"
      );
    }
    function getItemText(item) {
      return (item.getAttribute(textAttribute) || item.textContent || "").toLowerCase().trim();
    }
    function search() {
      if (!searchString) return;
      const items = getItems();
      const query = searchString.toLowerCase();
      const matchIndex = items.findIndex((item) => {
        const text = getItemText(item);
        return text.startsWith(query);
      });
      if (matchIndex !== -1) {
        onMatch?.(items[matchIndex], matchIndex);
      }
    }
    function handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;
      if (!/^[a-zA-Z0-9 ]$/.test(event.key)) return;
      event.preventDefault();
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      searchString += event.key;
      search();
      searchTimeout = setTimeout(() => {
        searchString = "";
      }, timeout);
    }
    function reset() {
      searchString = "";
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
      }
    }
    container.addEventListener("keydown", handleKeyDown);
    return {
      reset,
      destroy: () => {
        container.removeEventListener("keydown", handleKeyDown);
        reset();
      }
    };
  }
  function handleActivation(element, onActivate, keys = ["Enter", " "]) {
    if (!isBrowser()) {
      return () => {
      };
    }
    function handleKeyDown(event) {
      if (keys.includes(event.key)) {
        event.preventDefault();
        onActivate();
      }
    }
    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-AYH6ZYZ6.js
  var ATTRS2 = {
    ITEM: "data-atlas-toggle-group-item",
    VALUE: "data-value"
  };
  var CLASSES2 = {
    ROOT: "atlas-toggle-group",
    ROOT_OUTLINE: "atlas-toggle-group--outline",
    ROOT_SM: "atlas-toggle-group--sm",
    ROOT_MD: "atlas-toggle-group--md",
    ROOT_LG: "atlas-toggle-group--lg",
    ROOT_VERTICAL: "atlas-toggle-group--vertical",
    ROOT_DISABLED: "atlas-toggle-group--disabled",
    ITEM: "atlas-toggle-group-item",
    ITEM_PRESSED: "atlas-toggle-group-item--pressed",
    ITEM_DISABLED: "atlas-toggle-group-item--disabled"
  };
  function createToggleGroup(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState2();
    }
    const {
      type = "single",
      value: initialValue = type === "multiple" ? [] : "",
      variant = "default",
      size: size2 = "md",
      disabled: initialDisabled = false,
      orientation = "horizontal",
      loop: loop2 = true,
      required = false
    } = options;
    let currentValue = type === "multiple" ? Array.isArray(initialValue) ? [...initialValue] : initialValue ? [initialValue] : [] : Array.isArray(initialValue) ? initialValue[0] || "" : initialValue;
    let isDisabledState = initialDisabled;
    const id = generateId("toggle-group");
    const cleanups = [];
    let rovingFocus = null;
    function init() {
      element.classList.add(CLASSES2.ROOT);
      element.setAttribute("data-atlas-toggle-group", "");
      element.setAttribute("role", "group");
      element.id = id;
      if (variant === "outline") {
        element.classList.add(CLASSES2.ROOT_OUTLINE);
      }
      element.classList.add(
        size2 === "sm" ? CLASSES2.ROOT_SM : size2 === "lg" ? CLASSES2.ROOT_LG : CLASSES2.ROOT_MD
      );
      if (orientation === "vertical") {
        element.classList.add(CLASSES2.ROOT_VERTICAL);
      }
      if (isDisabledState) {
        element.classList.add(CLASSES2.ROOT_DISABLED);
      }
      setupItems();
      rovingFocus = createRovingFocus(element, {
        orientation,
        loop: loop2,
        itemSelector: `[${ATTRS2.ITEM}]:not([aria-disabled="true"])`,
        onFocusChange: (el) => el.focus()
      });
      updateAllItems();
    }
    function setupItems() {
      const items = getItems();
      items.forEach((item) => {
        item.classList.add(CLASSES2.ITEM);
        item.setAttribute("role", "radio");
        item.setAttribute("tabindex", "-1");
        item.style.transition = `
        background-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
        color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
        border-color ${ANIMATION_DURATION.fast}ms ${EASING.standard}
      `.replace(/\s+/g, " ").trim();
        const clickCleanup = addListener(item, "click", () => handleItemClick(item));
        const keyCleanup = handleActivation(item, () => handleItemClick(item));
        cleanups.push(clickCleanup, keyCleanup);
      });
      const firstEnabled = items.find(
        (item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true"
      );
      if (firstEnabled) {
        firstEnabled.setAttribute("tabindex", "0");
      }
    }
    function getItems() {
      return Array.from(element.querySelectorAll(`[${ATTRS2.ITEM}]`));
    }
    function getItemValue(item) {
      return item.getAttribute(ATTRS2.VALUE) || "";
    }
    function handleItemClick(item) {
      if (isDisabledState) return;
      if (item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true") return;
      const value = getItemValue(item);
      if (!value) return;
      toggleValue(value);
      if (item.animate) {
        item.animate([{ transform: "scale(0.97)" }, { transform: "scale(1)" }], {
          duration: ANIMATION_DURATION.fast,
          easing: EASING.bounce
        });
      }
    }
    function toggleValue(value) {
      if (type === "multiple") {
        const values = currentValue;
        const index = values.indexOf(value);
        if (index >= 0) {
          values.splice(index, 1);
        } else {
          values.push(value);
        }
        currentValue = [...values];
      } else {
        if (currentValue === value) {
          if (!required) {
            currentValue = "";
          }
        } else {
          currentValue = value;
        }
      }
      updateAllItems();
      options.onChange?.(currentValue);
    }
    function isSelected(value) {
      if (type === "multiple") {
        return currentValue.includes(value);
      }
      return currentValue === value;
    }
    function updateAllItems() {
      const items = getItems();
      items.forEach((item) => {
        const value = getItemValue(item);
        const selected = isSelected(value);
        const disabled = item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true";
        item.setAttribute("aria-pressed", String(selected));
        item.setAttribute("data-state", selected ? "on" : "off");
        if (selected) {
          item.classList.add(CLASSES2.ITEM_PRESSED);
        } else {
          item.classList.remove(CLASSES2.ITEM_PRESSED);
        }
        if (disabled || isDisabledState) {
          item.classList.add(CLASSES2.ITEM_DISABLED);
          item.setAttribute("aria-disabled", "true");
        } else {
          item.classList.remove(CLASSES2.ITEM_DISABLED);
          item.removeAttribute("aria-disabled");
        }
      });
      rovingFocus?.update();
    }
    function setValue(value) {
      if (type === "multiple") {
        currentValue = Array.isArray(value) ? [...value] : value ? [value] : [];
      } else {
        currentValue = Array.isArray(value) ? value[0] || "" : value;
      }
      updateAllItems();
      options.onChange?.(currentValue);
    }
    function setDisabled(disabled) {
      isDisabledState = disabled;
      if (disabled) {
        element.classList.add(CLASSES2.ROOT_DISABLED);
      } else {
        element.classList.remove(CLASSES2.ROOT_DISABLED);
      }
      updateAllItems();
    }
    function setItemDisabled(value, disabled) {
      const items = getItems();
      const item = items.find((i) => getItemValue(i) === value);
      if (item) {
        if (disabled) {
          item.setAttribute("disabled", "");
          item.setAttribute("aria-disabled", "true");
        } else {
          item.removeAttribute("disabled");
          item.removeAttribute("aria-disabled");
        }
        updateAllItems();
      }
    }
    function update() {
      setupItems();
      updateAllItems();
      rovingFocus?.update();
    }
    function focus() {
      const items = getItems();
      const firstEnabled = items.find(
        (item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true"
      );
      firstEnabled?.focus();
    }
    function destroy() {
      rovingFocus?.destroy();
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(
        CLASSES2.ROOT,
        CLASSES2.ROOT_OUTLINE,
        CLASSES2.ROOT_SM,
        CLASSES2.ROOT_MD,
        CLASSES2.ROOT_LG,
        CLASSES2.ROOT_VERTICAL,
        CLASSES2.ROOT_DISABLED
      );
      element.removeAttribute("data-atlas-toggle-group");
      element.removeAttribute("data-atlas-toggle-group-initialized");
      element.removeAttribute("role");
      const items = getItems();
      items.forEach((item) => {
        item.classList.remove(CLASSES2.ITEM, CLASSES2.ITEM_PRESSED, CLASSES2.ITEM_DISABLED);
        item.removeAttribute("role");
        item.removeAttribute("tabindex");
        item.removeAttribute("aria-pressed");
        item.removeAttribute("data-state");
      });
    }
    init();
    return {
      getValue: () => type === "multiple" ? [...currentValue] : currentValue,
      setValue,
      toggleValue,
      isSelected,
      setDisabled,
      isDisabled: () => isDisabledState,
      setItemDisabled,
      update,
      focus,
      destroy
    };
  }
  function createNoopState2() {
    return {
      getValue: () => [],
      setValue: () => {
      },
      toggleValue: () => {
      },
      isSelected: () => false,
      setDisabled: () => {
      },
      isDisabled: () => false,
      setItemDisabled: () => {
      },
      update: () => {
      },
      focus: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-XUFQCFU6.js
  function getViewportRect() {
    return {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  function getElementRect(element, strategy) {
    const rect = element.getBoundingClientRect();
    if (strategy === "fixed") {
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    }
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    };
  }
  function getMainAxis(placement) {
    return placement.startsWith("top") || placement.startsWith("bottom") ? "y" : "x";
  }
  function getOppositePlacement(placement) {
    const map = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    };
    return placement.replace(/^(top|bottom|left|right)/, (match) => map[match]);
  }
  function computePosition(referenceRect, floatingRect, placement, offset) {
    const [side, align = "center"] = placement.split("-");
    let x = 0;
    let y = 0;
    switch (side) {
      case "top":
        y = referenceRect.y - floatingRect.height - offset;
        break;
      case "bottom":
        y = referenceRect.y + referenceRect.height + offset;
        break;
      case "left":
        x = referenceRect.x - floatingRect.width - offset;
        break;
      case "right":
        x = referenceRect.x + referenceRect.width + offset;
        break;
    }
    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          x = referenceRect.x;
          break;
        case "end":
          x = referenceRect.x + referenceRect.width - floatingRect.width;
          break;
        default:
          x = referenceRect.x + (referenceRect.width - floatingRect.width) / 2;
      }
    } else {
      switch (align) {
        case "start":
          y = referenceRect.y;
          break;
        case "end":
          y = referenceRect.y + referenceRect.height - floatingRect.height;
          break;
        default:
          y = referenceRect.y + (referenceRect.height - floatingRect.height) / 2;
      }
    }
    return { x, y };
  }
  function checkOverflow(floatingRect, position, viewport, padding) {
    return {
      top: padding - position.y,
      right: position.x + floatingRect.width - (viewport.width - padding),
      bottom: position.y + floatingRect.height - (viewport.height - padding),
      left: padding - position.x
    };
  }
  function computeFloatingPosition(reference, floating, options = {}) {
    if (!isBrowser()) {
      return { x: 0, y: 0, placement: options.placement || "bottom" };
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      offset = 8,
      flip = true,
      shift = true,
      shiftPadding = 8,
      arrow = null
    } = options;
    const referenceRect = getElementRect(reference, strategy);
    const floatingRect = {
      ...getElementRect(floating, strategy),
      width: floating.offsetWidth,
      height: floating.offsetHeight
    };
    const viewport = getViewportRect();
    let currentPlacement = placement;
    let position = computePosition(referenceRect, floatingRect, currentPlacement, offset);
    if (flip) {
      const overflow = checkOverflow(floatingRect, position, viewport, shiftPadding);
      const mainAxis = getMainAxis(currentPlacement);
      const shouldFlip = mainAxis === "y" ? currentPlacement.startsWith("top") && overflow.top > 0 || currentPlacement.startsWith("bottom") && overflow.bottom > 0 : currentPlacement.startsWith("left") && overflow.left > 0 || currentPlacement.startsWith("right") && overflow.right > 0;
      if (shouldFlip) {
        currentPlacement = getOppositePlacement(currentPlacement);
        position = computePosition(referenceRect, floatingRect, currentPlacement, offset);
      }
    }
    if (shift) {
      const overflow = checkOverflow(floatingRect, position, viewport, shiftPadding);
      const mainAxis = getMainAxis(currentPlacement);
      if (mainAxis === "y") {
        if (overflow.left > 0) {
          position.x += overflow.left;
        } else if (overflow.right > 0) {
          position.x -= overflow.right;
        }
      } else {
        if (overflow.top > 0) {
          position.y += overflow.top;
        } else if (overflow.bottom > 0) {
          position.y -= overflow.bottom;
        }
      }
    }
    let arrowX;
    let arrowY;
    if (arrow) {
      const arrowRect = arrow.getBoundingClientRect();
      const mainAxis = getMainAxis(currentPlacement);
      if (mainAxis === "y") {
        const centerX = referenceRect.x + referenceRect.width / 2;
        arrowX = centerX - position.x - arrowRect.width / 2;
        arrowX = Math.max(8, Math.min(arrowX, floatingRect.width - arrowRect.width - 8));
      } else {
        const centerY = referenceRect.y + referenceRect.height / 2;
        arrowY = centerY - position.y - arrowRect.height / 2;
        arrowY = Math.max(8, Math.min(arrowY, floatingRect.height - arrowRect.height - 8));
      }
    }
    return {
      x: Math.round(position.x),
      y: Math.round(position.y),
      placement: currentPlacement,
      arrowX,
      arrowY
    };
  }
  function applyFloatingStyles(floating, result, strategy = "absolute") {
    Object.assign(floating.style, {
      position: strategy,
      left: `${result.x}px`,
      top: `${result.y}px`,
      margin: "0"
    });
  }
  function autoUpdate(reference, floating, update, options = {}) {
    if (!isBrowser()) {
      return () => {
      };
    }
    const { ancestorScroll = true, ancestorResize = true, elementResize = true } = options;
    const cleanups = [];
    if (ancestorScroll) {
      let ancestor = reference;
      while (ancestor) {
        ancestor.addEventListener("scroll", update, { passive: true });
        const currentAncestor = ancestor;
        cleanups.push(() => currentAncestor.removeEventListener("scroll", update));
        ancestor = ancestor.parentElement;
      }
      window.addEventListener("scroll", update, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", update));
    }
    if (ancestorResize) {
      window.addEventListener("resize", update);
      cleanups.push(() => window.removeEventListener("resize", update));
    }
    if (elementResize && typeof ResizeObserver !== "undefined") {
      const observer3 = new ResizeObserver(update);
      observer3.observe(reference);
      observer3.observe(floating);
      cleanups.push(() => observer3.disconnect());
    }
    update();
    return () => {
      cleanups.forEach((cleanup2) => cleanup2());
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-XMPNQU52.js
  function createDismissHandler(container, options) {
    if (!isBrowser()) {
      return {
        destroy: () => {
        },
        pause: () => {
        },
        resume: () => {
        }
      };
    }
    const {
      onDismiss,
      escapeKey = true,
      clickOutside = true,
      ignore = [],
      pointerDownOutside = false
    } = options;
    let paused = false;
    const cleanups = [];
    function handleKeyDown(event) {
      if (paused) return;
      if (escapeKey && event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onDismiss();
      }
    }
    function isOutside(target) {
      if (!target || !(target instanceof Node)) return false;
      if (container.contains(target)) {
        return false;
      }
      for (const ignored of ignore) {
        if (ignored?.contains(target)) {
          return false;
        }
      }
      return true;
    }
    function handlePointerDown(event) {
      if (paused) return;
      if (!clickOutside) return;
      if (isOutside(event.target)) {
        onDismiss();
      }
    }
    function handleClick(event) {
      if (paused) return;
      if (!clickOutside) return;
      if (pointerDownOutside) return;
      if (isOutside(event.target)) {
        onDismiss();
      }
    }
    cleanups.push(
      addListener(document, "keydown", handleKeyDown, {
        capture: true
      })
    );
    if (pointerDownOutside) {
      cleanups.push(
        addListener(
          document,
          "pointerdown",
          handlePointerDown,
          { capture: true }
        )
      );
    } else {
      setTimeout(() => {
        if (!paused) {
          cleanups.push(
            addListener(document, "click", handleClick, {
              capture: true
            })
          );
        }
      }, 0);
    }
    return {
      destroy: () => {
        cleanups.forEach((cleanup2) => cleanup2());
      },
      pause: () => {
        paused = true;
      },
      resume: () => {
        paused = false;
      }
    };
  }
  var LayerStack = class {
    constructor() {
      this.layers = /* @__PURE__ */ new Map();
    }
    /** Push a new layer onto the stack */
    push(element, onDismiss) {
      this.layers.set(element, onDismiss);
    }
    /** Remove a layer from the stack */
    remove(element) {
      this.layers.delete(element);
    }
    /** Check if element is the topmost layer */
    isTop(element) {
      const entries = Array.from(this.layers.keys());
      return entries[entries.length - 1] === element;
    }
    /** Dismiss the topmost layer */
    dismissTop() {
      const entries = Array.from(this.layers.entries());
      if (entries.length === 0) return false;
      const [, onDismiss] = entries[entries.length - 1];
      onDismiss();
      return true;
    }
    /** Get the number of active layers */
    get size() {
      return this.layers.size;
    }
  };
  var layerStack = new LayerStack();

  // node_modules/@casoon/atlas-components/dist/chunk-ALZ2UYTV.js
  var createFocusTrap = (options) => {
    const { container, initialFocus = "first", returnFocus = "previous", onEscape } = options;
    let isActive = false;
    let previouslyFocused = null;
    let focusableElements = [];
    let cleanupListeners = [];
    const updateElements = () => {
      focusableElements = getFocusableElements(container);
    };
    const handleKeyDown = (e) => {
      if (!isActive) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }
      if (e.key === "Tab") {
        updateElements();
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const doc = getDocument();
        if (!doc) return;
        if (e.shiftKey) {
          if (doc.activeElement === firstElement || doc.activeElement === container) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (doc.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    const handleFocusOut = (e) => {
      if (!isActive) return;
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && !container.contains(relatedTarget)) {
        e.preventDefault();
        focusableElements[0]?.focus();
      }
    };
    const activate = () => {
      if (isActive) return;
      isActive = true;
      const doc = getDocument();
      if (!doc) return;
      previouslyFocused = doc.activeElement;
      updateElements();
      requestAnimationFrame(() => {
        if (initialFocus === "first" && focusableElements.length > 0) {
          focusableElements[0].focus();
        } else if (initialFocus === "container") {
          container.setAttribute("tabindex", "-1");
          container.focus();
        } else if (initialFocus instanceof HTMLElement) {
          initialFocus.focus();
        }
      });
      cleanupListeners.push(
        addListener(doc, "keydown", handleKeyDown),
        addListener(
          container,
          "focusout",
          handleFocusOut
        )
      );
    };
    const deactivate = () => {
      if (!isActive) return;
      isActive = false;
      cleanupListeners.forEach((cleanup2) => cleanup2());
      cleanupListeners = [];
      if (container.getAttribute("tabindex") === "-1") {
        container.removeAttribute("tabindex");
      }
      if (returnFocus === "previous" && previouslyFocused) {
        previouslyFocused.focus();
      } else if (returnFocus instanceof HTMLElement) {
        returnFocus.focus();
      }
      previouslyFocused = null;
    };
    return {
      activate,
      deactivate,
      updateElements
    };
  };

  // node_modules/@casoon/atlas-components/dist/chunk-5AJD73JO.js
  var ATTRS3 = {
    HEADER: "data-atlas-calendar-header",
    GRID: "data-atlas-calendar-grid",
    DAY: "data-atlas-calendar-day",
    PREV: "data-atlas-calendar-prev",
    NEXT: "data-atlas-calendar-next"
  };
  var CLASSES3 = {
    ROOT: "atlas-calendar",
    HEADER: "atlas-calendar-header",
    TITLE: "atlas-calendar-title",
    NAV_BTN: "atlas-calendar-nav-btn",
    GRID: "atlas-calendar-grid",
    WEEKDAYS: "atlas-calendar-weekdays",
    WEEKDAY: "atlas-calendar-weekday",
    WEEK: "atlas-calendar-week",
    WEEK_NUMBER: "atlas-calendar-week-number",
    DAY: "atlas-calendar-day",
    DAY_TODAY: "atlas-calendar-day--today",
    DAY_SELECTED: "atlas-calendar-day--selected",
    DAY_DISABLED: "atlas-calendar-day--disabled",
    DAY_OUTSIDE: "atlas-calendar-day--outside",
    DAY_RANGE_START: "atlas-calendar-day--range-start",
    DAY_RANGE_END: "atlas-calendar-day--range-end",
    DAY_RANGE_MIDDLE: "atlas-calendar-day--range-middle"
  };
  var CHEVRON_LEFT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
  var CHEVRON_RIGHT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  function createCalendar(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState3();
    }
    const {
      mode = "single",
      value: initialValue = null,
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 1,
      locale = "en-US",
      showWeekNumbers = false,
      showOutsideDays = true,
      numberOfMonths = 1
    } = options;
    let currentValue = initialValue;
    let viewedMonth = initialValue instanceof Date ? new Date(initialValue) : /* @__PURE__ */ new Date();
    const id = generateId("calendar");
    const cleanups = [];
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
    const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    function init() {
      element.classList.add(CLASSES3.ROOT);
      element.setAttribute("data-atlas-calendar", "");
      element.setAttribute("role", "application");
      element.setAttribute("aria-label", "Calendar");
      element.id = id;
      render();
    }
    function render() {
      element.innerHTML = "";
      for (let i = 0; i < numberOfMonths; i++) {
        const monthDate = new Date(viewedMonth);
        monthDate.setMonth(monthDate.getMonth() + i);
        element.appendChild(createMonthView(monthDate, i === 0, i === numberOfMonths - 1));
      }
    }
    function createMonthView(date, showPrev, showNext) {
      const container = document.createElement("div");
      container.className = "atlas-calendar-month";
      const header = document.createElement("div");
      header.className = CLASSES3.HEADER;
      header.setAttribute(ATTRS3.HEADER, "");
      if (showPrev) {
        const prevBtn = document.createElement("button");
        prevBtn.className = CLASSES3.NAV_BTN;
        prevBtn.setAttribute(ATTRS3.PREV, "");
        prevBtn.type = "button";
        prevBtn.innerHTML = CHEVRON_LEFT;
        prevBtn.setAttribute("aria-label", "Previous month");
        prevBtn.addEventListener("click", prevMonth);
        header.appendChild(prevBtn);
      } else {
        header.appendChild(document.createElement("span"));
      }
      const title = document.createElement("div");
      title.className = CLASSES3.TITLE;
      title.textContent = monthFormatter.format(date);
      title.setAttribute("aria-live", "polite");
      header.appendChild(title);
      if (showNext) {
        const nextBtn = document.createElement("button");
        nextBtn.className = CLASSES3.NAV_BTN;
        nextBtn.setAttribute(ATTRS3.NEXT, "");
        nextBtn.type = "button";
        nextBtn.innerHTML = CHEVRON_RIGHT;
        nextBtn.setAttribute("aria-label", "Next month");
        nextBtn.addEventListener("click", nextMonth);
        header.appendChild(nextBtn);
      } else {
        header.appendChild(document.createElement("span"));
      }
      container.appendChild(header);
      const grid = document.createElement("div");
      grid.className = CLASSES3.GRID;
      grid.setAttribute(ATTRS3.GRID, "");
      grid.setAttribute("role", "grid");
      const weekdays = document.createElement("div");
      weekdays.className = CLASSES3.WEEKDAYS;
      weekdays.setAttribute("role", "row");
      if (showWeekNumbers) {
        const empty = document.createElement("div");
        empty.className = CLASSES3.WEEK_NUMBER;
        weekdays.appendChild(empty);
      }
      for (let i = 0; i < 7; i++) {
        const dayIndex = (weekStartsOn + i) % 7;
        const day = document.createElement("div");
        day.className = CLASSES3.WEEKDAY;
        day.setAttribute("role", "columnheader");
        const tempDate = new Date(2024, 0, dayIndex);
        day.textContent = dayFormatter.format(tempDate).slice(0, 2);
        weekdays.appendChild(day);
      }
      grid.appendChild(weekdays);
      const weeks = getWeeksInMonth(date);
      weeks.forEach((week) => {
        const weekRow = document.createElement("div");
        weekRow.className = CLASSES3.WEEK;
        weekRow.setAttribute("role", "row");
        if (showWeekNumbers) {
          const weekNum = document.createElement("div");
          weekNum.className = CLASSES3.WEEK_NUMBER;
          weekNum.textContent = String(getWeekNumber(week[0]));
          weekRow.appendChild(weekNum);
        }
        week.forEach((dayDate) => {
          const dayEl = createDayElement(dayDate, date);
          weekRow.appendChild(dayEl);
        });
        grid.appendChild(weekRow);
      });
      container.appendChild(grid);
      return container;
    }
    function createDayElement(date, monthDate) {
      const day = document.createElement("button");
      day.className = CLASSES3.DAY;
      day.setAttribute(ATTRS3.DAY, "");
      day.setAttribute("role", "gridcell");
      day.type = "button";
      day.textContent = String(date.getDate());
      day.setAttribute("data-date", date.toISOString());
      const isToday = isSameDay(date, /* @__PURE__ */ new Date());
      const isOutside = date.getMonth() !== monthDate.getMonth();
      const disabled = isDisabled(date);
      const selected = isSelected(date);
      if (isToday) day.classList.add(CLASSES3.DAY_TODAY);
      if (isOutside) day.classList.add(CLASSES3.DAY_OUTSIDE);
      if (disabled) {
        day.classList.add(CLASSES3.DAY_DISABLED);
        day.disabled = true;
      }
      if (selected) day.classList.add(CLASSES3.DAY_SELECTED);
      if (mode === "range" && Array.isArray(currentValue) && currentValue.length === 2) {
        const [start2, end] = currentValue;
        if (isSameDay(date, start2)) day.classList.add(CLASSES3.DAY_RANGE_START);
        if (isSameDay(date, end)) day.classList.add(CLASSES3.DAY_RANGE_END);
        if (date > start2 && date < end) day.classList.add(CLASSES3.DAY_RANGE_MIDDLE);
      }
      day.setAttribute("aria-selected", selected ? "true" : "false");
      if (disabled) day.setAttribute("aria-disabled", "true");
      if (!isOutside || showOutsideDays) {
        day.addEventListener("click", () => handleDayClick(date));
        if (mode === "range") {
          day.addEventListener("mouseenter", () => handleDayHover());
        }
      } else {
        day.style.visibility = "hidden";
      }
      return day;
    }
    function handleDayClick(date) {
      if (isDisabled(date)) return;
      switch (mode) {
        case "single":
          currentValue = date;
          break;
        case "multiple": {
          const current = currentValue ?? [];
          const index = current.findIndex((d) => isSameDay(d, date));
          if (index >= 0) {
            current.splice(index, 1);
          } else {
            current.push(date);
          }
          currentValue = [...current];
          break;
        }
        case "range": {
          const range = currentValue;
          if (!range || range.length === 2 || !range[0]) {
            currentValue = [date, date];
          } else {
            const [start2] = range;
            if (date < start2) {
              currentValue = [date, start2];
            } else {
              currentValue = [start2, date];
            }
          }
          break;
        }
      }
      render();
      options.onChange?.(currentValue);
    }
    function handleDayHover(date) {
    }
    function getWeeksInMonth(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      const dayOfWeek = startDate.getDay();
      const diff = (dayOfWeek - weekStartsOn + 7) % 7;
      startDate.setDate(startDate.getDate() - diff);
      const weeks = [];
      const current = new Date(startDate);
      while (current <= lastDay || weeks.length < 6) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          week.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
        if (current.getMonth() !== month && weeks.length >= 4) {
          break;
        }
      }
      return weeks;
    }
    function getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
    }
    function isSameDay(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    function isSelected(date) {
      if (!currentValue) return false;
      if (currentValue instanceof Date) {
        return isSameDay(date, currentValue);
      }
      if (Array.isArray(currentValue)) {
        return currentValue.some((d) => isSameDay(date, d));
      }
      return false;
    }
    function isDisabled(date) {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (typeof disabledDates === "function") {
        return disabledDates(date);
      }
      if (Array.isArray(disabledDates)) {
        return disabledDates.some((d) => isSameDay(date, d));
      }
      return false;
    }
    function nextMonth() {
      viewedMonth.setMonth(viewedMonth.getMonth() + 1);
      render();
      options.onMonthChange?.(new Date(viewedMonth));
    }
    function prevMonth() {
      viewedMonth.setMonth(viewedMonth.getMonth() - 1);
      render();
      options.onMonthChange?.(new Date(viewedMonth));
    }
    function goToToday() {
      viewedMonth = /* @__PURE__ */ new Date();
      render();
      options.onMonthChange?.(new Date(viewedMonth));
    }
    function setValue(value) {
      currentValue = value;
      if (value instanceof Date) {
        viewedMonth = new Date(value);
      }
      render();
    }
    function setViewedMonth(date) {
      viewedMonth = new Date(date);
      render();
      options.onMonthChange?.(new Date(viewedMonth));
    }
    function refresh() {
      render();
    }
    function destroy() {
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES3.ROOT);
      element.removeAttribute("data-atlas-calendar");
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
      element.innerHTML = "";
    }
    init();
    return {
      getValue: () => currentValue,
      setValue,
      getViewedMonth: () => new Date(viewedMonth),
      setViewedMonth,
      nextMonth,
      prevMonth,
      goToToday,
      isSelected,
      isDisabled,
      refresh,
      destroy
    };
  }
  function createNoopState3() {
    return {
      getValue: () => null,
      setValue: () => {
      },
      getViewedMonth: () => /* @__PURE__ */ new Date(),
      setViewedMonth: () => {
      },
      nextMonth: () => {
      },
      prevMonth: () => {
      },
      goToToday: () => {
      },
      isSelected: () => false,
      isDisabled: () => false,
      refresh: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS22 = {
    TRIGGER: "data-atlas-date-picker-trigger",
    CONTENT: "data-atlas-date-picker-content",
    PRESETS: "data-atlas-date-picker-presets",
    PRESET: "data-atlas-date-picker-preset",
    CLEAR: "data-atlas-date-picker-clear",
    CALENDAR: "data-atlas-date-picker-calendar"
  };
  var CLASSES22 = {
    ROOT: "atlas-date-picker",
    TRIGGER: "atlas-date-picker-trigger",
    TRIGGER_ICON: "atlas-date-picker-trigger-icon",
    TRIGGER_TEXT: "atlas-date-picker-trigger-text",
    TRIGGER_PLACEHOLDER: "atlas-date-picker-trigger-placeholder",
    TRIGGER_CLEAR: "atlas-date-picker-trigger-clear",
    CONTENT: "atlas-date-picker-content",
    CONTENT_OPEN: "atlas-date-picker-content--open",
    PRESETS: "atlas-date-picker-presets",
    PRESET: "atlas-date-picker-preset",
    WITH_PRESETS: "atlas-date-picker-with-presets",
    CALENDAR: "atlas-date-picker-calendar",
    DISABLED: "atlas-date-picker--disabled",
    OPEN: "atlas-date-picker--open"
  };
  var DEFAULT_PRESETS = [
    {
      label: "Today",
      getValue: () => /* @__PURE__ */ new Date()
    },
    {
      label: "Tomorrow",
      getValue: () => {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() + 1);
        return d;
      }
    },
    {
      label: "In a week",
      getValue: () => {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() + 7);
        return d;
      }
    },
    {
      label: "In a month",
      getValue: () => {
        const d = /* @__PURE__ */ new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
      }
    }
  ];
  var CALENDAR_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  var CLEAR_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  function createDatePicker(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState22();
    }
    const {
      mode = "single",
      value: initialValue = null,
      placeholder = "Pick a date",
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 1,
      locale = "en-US",
      placement: initialPlacement = "bottom-start",
      offset = 4,
      showPresets = false,
      presets: presets2 = DEFAULT_PRESETS,
      disabled: initialDisabled = false,
      clearable = true,
      closeOnEsc = true,
      closeOnClickOutside = true,
      numberOfMonths = 1,
      showWeekNumbers = false
    } = options;
    let currentValue = initialValue;
    let isOpenState = false;
    let isDisabledState = initialDisabled;
    const currentPlacement = initialPlacement;
    const id = generateId("date-picker");
    let triggerEl = null;
    let contentEl = null;
    let calendarEl = null;
    let textEl = null;
    let clearBtn = null;
    let calendar = null;
    let focusTrap = null;
    let dismissHandler = null;
    let cleanupAutoUpdate = null;
    const cleanups = [];
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    function init() {
      element.classList.add(CLASSES22.ROOT);
      element.setAttribute("data-atlas-date-picker", "");
      element.id = id;
      if (isDisabledState) {
        element.classList.add(CLASSES22.DISABLED);
      }
      triggerEl = element.querySelector(`[${ATTRS22.TRIGGER}]`);
      if (!triggerEl) {
        triggerEl = document.createElement("button");
        triggerEl.setAttribute(ATTRS22.TRIGGER, "");
        element.appendChild(triggerEl);
      }
      setupTrigger();
      contentEl = element.querySelector(`[${ATTRS22.CONTENT}]`);
      if (!contentEl) {
        contentEl = document.createElement("div");
        contentEl.setAttribute(ATTRS22.CONTENT, "");
        element.appendChild(contentEl);
      }
      setupContent();
      updateDisplay();
    }
    function setupTrigger() {
      if (!triggerEl) return;
      triggerEl.className = CLASSES22.TRIGGER;
      triggerEl.type = "button";
      triggerEl.setAttribute("aria-haspopup", "dialog");
      triggerEl.setAttribute("aria-expanded", "false");
      triggerEl.setAttribute("aria-controls", `${id}-content`);
      triggerEl.disabled = isDisabledState;
      triggerEl.innerHTML = `
      <span class="${CLASSES22.TRIGGER_ICON}">${CALENDAR_ICON}</span>
      <span class="${CLASSES22.TRIGGER_TEXT} ${CLASSES22.TRIGGER_PLACEHOLDER}">${placeholder}</span>
    `;
      textEl = triggerEl.querySelector(`.${CLASSES22.TRIGGER_TEXT}`);
      cleanups.push(addListener(triggerEl, "click", handleTriggerClick));
      cleanups.push(addListener(triggerEl, "keydown", handleTriggerKeydown));
    }
    function setupContent() {
      if (!contentEl) return;
      contentEl.id = `${id}-content`;
      contentEl.className = CLASSES22.CONTENT;
      contentEl.setAttribute("role", "dialog");
      contentEl.setAttribute("aria-modal", "true");
      contentEl.setAttribute("aria-label", "Choose date");
      contentEl.style.display = "none";
      contentEl.style.position = "absolute";
      renderContent();
    }
    function renderContent() {
      if (!contentEl) return;
      contentEl.innerHTML = "";
      if (showPresets) {
        contentEl.classList.add(CLASSES22.WITH_PRESETS);
        const presetsEl = document.createElement("div");
        presetsEl.className = CLASSES22.PRESETS;
        presetsEl.setAttribute(ATTRS22.PRESETS, "");
        presets2.forEach((preset, index) => {
          const btn = document.createElement("button");
          btn.className = CLASSES22.PRESET;
          btn.setAttribute(ATTRS22.PRESET, "");
          btn.type = "button";
          btn.textContent = preset.label;
          btn.dataset.presetIndex = String(index);
          btn.addEventListener("click", () => handlePresetClick(index));
          presetsEl.appendChild(btn);
        });
        contentEl.appendChild(presetsEl);
      }
      calendarEl = document.createElement("div");
      calendarEl.className = CLASSES22.CALENDAR;
      calendarEl.setAttribute(ATTRS22.CALENDAR, "");
      contentEl.appendChild(calendarEl);
      calendar = createCalendar(calendarEl, {
        mode,
        value: currentValue,
        minDate,
        maxDate,
        disabledDates,
        weekStartsOn,
        locale,
        numberOfMonths,
        showWeekNumbers,
        onChange: handleCalendarChange
      });
    }
    function handleTriggerClick(event) {
      event.preventDefault();
      event.stopPropagation();
      const target = event.target;
      if (target.closest(`.${CLASSES22.TRIGGER_CLEAR}`)) {
        clear2();
        return;
      }
      if (isDisabledState) return;
      toggle();
    }
    function handleTriggerKeydown(event) {
      if (isDisabledState) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    }
    function handlePresetClick(index) {
      const preset = presets2[index];
      if (!preset) return;
      const date = preset.getValue();
      setValue(date);
      close();
    }
    function handleCalendarChange(value) {
      currentValue = value;
      updateDisplay();
      options.onChange?.(value);
      if (mode === "single" && value) {
        setTimeout(() => close(), 150);
      }
      if (mode === "range" && Array.isArray(value) && value.length === 2) {
        const [start2, end] = value;
        if (start2 && end && start2.getTime() !== end.getTime()) {
          setTimeout(() => close(), 150);
        }
      }
    }
    function open() {
      if (isOpenState || isDisabledState || !contentEl || !triggerEl) return;
      isOpenState = true;
      triggerEl.setAttribute("aria-expanded", "true");
      contentEl.style.display = "";
      element.classList.add(CLASSES22.OPEN);
      contentEl.classList.add(CLASSES22.CONTENT_OPEN);
      updatePosition();
      cleanupAutoUpdate = autoUpdate(triggerEl, contentEl, updatePosition);
      focusTrap = createFocusTrap({
        container: contentEl,
        initialFocus: "container",
        returnFocus: triggerEl
      });
      focusTrap.activate();
      dismissHandler = createDismissHandler(contentEl, {
        escapeKey: closeOnEsc,
        clickOutside: closeOnClickOutside,
        ignore: [triggerEl],
        onDismiss: close
      });
      requestAnimationFrame(() => {
        const dayBtn = calendarEl?.querySelector("button[data-atlas-calendar-day]");
        dayBtn?.focus();
      });
      options.onOpen?.();
    }
    function close() {
      if (!isOpenState || !contentEl || !triggerEl) return;
      isOpenState = false;
      triggerEl.setAttribute("aria-expanded", "false");
      element.classList.remove(CLASSES22.OPEN);
      contentEl.classList.remove(CLASSES22.CONTENT_OPEN);
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      focusTrap?.deactivate();
      focusTrap = null;
      dismissHandler?.destroy();
      dismissHandler = null;
      setTimeout(() => {
        if (!isOpenState && contentEl) {
          contentEl.style.display = "none";
        }
      }, ANIMATION_DURATION.normal);
      triggerEl.focus();
      options.onClose?.();
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function updatePosition() {
      if (!triggerEl || !contentEl) return;
      const result = computeFloatingPosition(triggerEl, contentEl, {
        placement: currentPlacement,
        offset,
        flip: true,
        shift: true
      });
      contentEl.style.left = `${result.x}px`;
      contentEl.style.top = `${result.y}px`;
      contentEl.setAttribute("data-placement", result.placement);
    }
    function formatDate(date) {
      return dateFormatter.format(date);
    }
    function updateDisplay() {
      if (!textEl || !triggerEl) return;
      clearBtn?.remove();
      clearBtn = null;
      let displayText;
      let hasValue = false;
      if (mode === "range") {
        if (Array.isArray(currentValue) && currentValue.length === 2 && currentValue[0] && currentValue[1]) {
          const [start2, end] = currentValue;
          displayText = `${formatDate(start2)} - ${formatDate(end)}`;
          hasValue = true;
        } else if (Array.isArray(currentValue) && currentValue[0]) {
          displayText = `${formatDate(currentValue[0])} - ...`;
          hasValue = true;
        } else {
          displayText = placeholder;
        }
      } else if (mode === "multiple") {
        if (Array.isArray(currentValue) && currentValue.length > 0) {
          displayText = currentValue.length === 1 ? formatDate(currentValue[0]) : `${currentValue.length} dates selected`;
          hasValue = true;
        } else {
          displayText = placeholder;
        }
      } else {
        if (currentValue instanceof Date) {
          displayText = formatDate(currentValue);
          hasValue = true;
        } else {
          displayText = placeholder;
        }
      }
      textEl.textContent = displayText;
      if (hasValue) {
        textEl.classList.remove(CLASSES22.TRIGGER_PLACEHOLDER);
      } else {
        textEl.classList.add(CLASSES22.TRIGGER_PLACEHOLDER);
      }
      if (clearable && hasValue) {
        clearBtn = document.createElement("button");
        clearBtn.className = CLASSES22.TRIGGER_CLEAR;
        clearBtn.setAttribute(ATTRS22.CLEAR, "");
        clearBtn.type = "button";
        clearBtn.setAttribute("aria-label", "Clear date");
        clearBtn.innerHTML = CLEAR_ICON;
        triggerEl.appendChild(clearBtn);
      }
    }
    function setValue(value) {
      currentValue = value;
      calendar?.setValue(value);
      updateDisplay();
      options.onChange?.(value);
    }
    function clear2() {
      setValue(null);
    }
    function setDisabled(disabled) {
      isDisabledState = disabled;
      if (disabled) {
        element.classList.add(CLASSES22.DISABLED);
        triggerEl?.setAttribute("disabled", "");
        if (isOpenState) close();
      } else {
        element.classList.remove(CLASSES22.DISABLED);
        triggerEl?.removeAttribute("disabled");
      }
    }
    function destroy() {
      if (isOpenState) {
        focusTrap?.deactivate();
        dismissHandler?.destroy();
        cleanupAutoUpdate?.();
      }
      calendar?.destroy();
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES22.ROOT, CLASSES22.OPEN, CLASSES22.DISABLED);
      element.removeAttribute("data-atlas-date-picker");
      element.removeAttribute("data-atlas-date-picker-initialized");
    }
    init();
    return {
      getValue: () => currentValue,
      setValue,
      isOpen: () => isOpenState,
      open,
      close,
      toggle,
      clear: clear2,
      setDisabled,
      isDisabled: () => isDisabledState,
      getCalendar: () => calendar,
      destroy
    };
  }
  function createNoopState22() {
    return {
      getValue: () => null,
      setValue: () => {
      },
      isOpen: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      clear: () => {
      },
      setDisabled: () => {
      },
      isDisabled: () => false,
      getCalendar: () => null,
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-F2H3TK3B.js
  function createInputOtp(element, options = {}) {
    if (!isBrowser()) {
      return createNoopInputOtpState();
    }
    const {
      length = 6,
      type = "numeric",
      masked = false,
      disabled: initialDisabled = false,
      separatorAfter = [],
      separatorChar = "-",
      autoFocus = true,
      name,
      placeholder = "\u25CB",
      onChange,
      onComplete,
      onFocus,
      onBlur
    } = options;
    const id = generateId("otp");
    let values = new Array(length).fill("");
    let isDisabled = initialDisabled;
    let isFocused = false;
    let hasError = false;
    const inputs = [];
    const cleanupListeners = [];
    const getPattern = () => {
      switch (type) {
        case "numeric":
          return /^[0-9]$/;
        case "alphabetic":
          return /^[a-zA-Z]$/;
        case "alphanumeric":
          return /^[a-zA-Z0-9]$/;
        default:
          return /^[0-9]$/;
      }
    };
    const pattern = getPattern();
    function createStructure() {
      element.innerHTML = "";
      element.classList.add("atlas-input-otp");
      element.setAttribute("role", "group");
      element.setAttribute("aria-label", `OTP input with ${length} characters`);
      element.setAttribute("data-atlas-input-otp", "");
      element.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
    `;
      if (name) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = name;
        hiddenInput.id = `${id}-hidden`;
        element.appendChild(hiddenInput);
      }
      for (let i = 0; i < length; i++) {
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "atlas-input-otp-slot";
        inputWrapper.style.cssText = `
        position: relative;
        width: 40px;
        height: 48px;
      `;
        const input = document.createElement("input");
        input.type = masked ? "password" : "text";
        input.inputMode = type === "numeric" ? "numeric" : "text";
        input.maxLength = 1;
        input.className = "atlas-input-otp-input";
        input.id = `${id}-${i}`;
        input.setAttribute("aria-label", `Character ${i + 1} of ${length}`);
        input.setAttribute("autocomplete", "one-time-code");
        input.placeholder = placeholder;
        input.disabled = isDisabled;
        input.style.cssText = `
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 1.25rem;
        font-weight: 600;
        border: 2px solid var(--atlas-border, hsl(214.3 31.8% 91.4%));
        border-radius: 8px;
        background: var(--atlas-background, hsl(0 0% 100%));
        color: var(--atlas-foreground, hsl(222.2 84% 4.9%));
        outline: none;
        transition: border-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
                    box-shadow ${ANIMATION_DURATION.fast}ms ${EASING.standard},
                    transform ${ANIMATION_DURATION.fast}ms ${EASING.standard};
      `;
        inputs.push(input);
        inputWrapper.appendChild(input);
        element.appendChild(inputWrapper);
        if (separatorAfter.includes(i + 1) && i < length - 1) {
          const separator = document.createElement("span");
          separator.className = "atlas-input-otp-separator";
          separator.textContent = separatorChar;
          separator.style.cssText = `
          color: var(--atlas-muted-foreground, hsl(215.4 16.3% 46.9%));
          font-size: 1.25rem;
          user-select: none;
        `;
          element.appendChild(separator);
        }
        setupInputListeners(input, i);
      }
      if (autoFocus && !isDisabled) {
        requestAnimationFrame(() => {
          inputs[0]?.focus();
        });
      }
    }
    function setupInputListeners(input, index) {
      cleanupListeners.push(
        addListener(input, "input", ((e) => {
          const inputEvent = e;
          const value = input.value;
          if (inputEvent.inputType === "insertFromPaste") {
            return;
          }
          if (value && !pattern.test(value)) {
            input.value = values[index];
            shakeInput(input);
            return;
          }
          values[index] = value;
          updateHiddenInput();
          onChange?.(getValue());
          if (value && index < length - 1) {
            inputs[index + 1].focus();
          }
          checkCompletion();
        }))
      );
      cleanupListeners.push(
        addListener(input, "keydown", ((e) => {
          switch (e.key) {
            case "Backspace":
              if (!input.value && index > 0) {
                e.preventDefault();
                inputs[index - 1].focus();
                inputs[index - 1].value = "";
                values[index - 1] = "";
                updateHiddenInput();
                onChange?.(getValue());
              } else if (input.value) {
                values[index] = "";
                updateHiddenInput();
                onChange?.(getValue());
              }
              break;
            case "Delete":
              values[index] = "";
              input.value = "";
              updateHiddenInput();
              onChange?.(getValue());
              break;
            case "ArrowLeft":
              e.preventDefault();
              if (index > 0) {
                inputs[index - 1].focus();
              }
              break;
            case "ArrowRight":
              e.preventDefault();
              if (index < length - 1) {
                inputs[index + 1].focus();
              }
              break;
            case "Home":
              e.preventDefault();
              inputs[0].focus();
              break;
            case "End":
              e.preventDefault();
              inputs[length - 1].focus();
              break;
          }
        }))
      );
      cleanupListeners.push(
        addListener(input, "paste", ((e) => {
          e.preventDefault();
          const pastedData = e.clipboardData?.getData("text") || "";
          handlePaste(pastedData, index);
        }))
      );
      cleanupListeners.push(
        addListener(input, "focus", (() => {
          isFocused = true;
          input.style.borderColor = "var(--atlas-ring, hsl(215 20.2% 65.1%))";
          input.style.boxShadow = "0 0 0 3px hsl(var(--atlas-ring) / 0.2)";
          input.style.transform = "scale(1.05)";
          input.select();
          onFocus?.();
        }))
      );
      cleanupListeners.push(
        addListener(input, "blur", (() => {
          requestAnimationFrame(() => {
            const activeElement = document.activeElement;
            const stillFocused = inputs.some((inp) => inp === activeElement);
            if (!stillFocused) {
              isFocused = false;
              onBlur?.();
            }
          });
          input.style.borderColor = hasError ? "var(--atlas-destructive, hsl(0 84.2% 60.2%))" : "var(--atlas-border, hsl(214.3 31.8% 91.4%))";
          input.style.boxShadow = hasError ? "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)" : "none";
          input.style.transform = "scale(1)";
        }))
      );
    }
    function handlePaste(data2, startIndex) {
      const validChars = data2.split("").filter((char) => pattern.test(char));
      for (let i = 0; i < validChars.length && startIndex + i < length; i++) {
        const idx = startIndex + i;
        values[idx] = validChars[i];
        inputs[idx].value = validChars[i];
      }
      updateHiddenInput();
      onChange?.(getValue());
      const nextEmptyIndex = values.findIndex((v) => !v);
      if (nextEmptyIndex !== -1) {
        inputs[nextEmptyIndex].focus();
      } else {
        inputs[length - 1].focus();
      }
      checkCompletion();
    }
    function shakeInput(input) {
      if (!input.animate) return;
      input.animate(
        [
          { transform: "translateX(0) scale(1.05)" },
          { transform: "translateX(-3px) scale(1.05)" },
          { transform: "translateX(3px) scale(1.05)" },
          { transform: "translateX(-3px) scale(1.05)" },
          { transform: "translateX(0) scale(1.05)" }
        ],
        {
          duration: 300,
          easing: "ease-in-out"
        }
      );
    }
    function getValue() {
      return values.join("");
    }
    function updateHiddenInput() {
      if (name) {
        const hiddenInput = element.querySelector(`#${id}-hidden`);
        if (hiddenInput) {
          hiddenInput.value = getValue();
        }
      }
    }
    function checkCompletion() {
      const value = getValue();
      if (value.length === length && values.every((v) => v)) {
        onComplete?.(value);
      }
    }
    function updateDisabledState() {
      inputs.forEach((input) => {
        input.disabled = isDisabled;
        if (isDisabled) {
          input.style.opacity = "0.5";
          input.style.cursor = "not-allowed";
        } else {
          input.style.opacity = "1";
          input.style.cursor = "text";
        }
      });
      if (isDisabled) {
        element.setAttribute("aria-disabled", "true");
      } else {
        element.removeAttribute("aria-disabled");
      }
    }
    function updateErrorState() {
      inputs.forEach((input) => {
        if (hasError) {
          input.style.borderColor = "var(--atlas-destructive, hsl(0 84.2% 60.2%))";
          if (document.activeElement !== input) {
            input.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
          }
        } else {
          input.style.borderColor = "var(--atlas-border, hsl(214.3 31.8% 91.4%))";
          if (document.activeElement !== input) {
            input.style.boxShadow = "none";
          }
        }
      });
      if (hasError) {
        element.setAttribute("aria-invalid", "true");
      } else {
        element.removeAttribute("aria-invalid");
      }
    }
    createStructure();
    const setValue = (value) => {
      const chars = value.split("").slice(0, length);
      values = new Array(length).fill("");
      chars.forEach((char, i) => {
        if (pattern.test(char)) {
          values[i] = char;
          inputs[i].value = char;
        }
      });
      updateHiddenInput();
      onChange?.(getValue());
      checkCompletion();
    };
    const clear2 = () => {
      values = new Array(length).fill("");
      inputs.forEach((input) => {
        input.value = "";
      });
      updateHiddenInput();
      onChange?.("");
      inputs[0]?.focus();
    };
    const focus = () => {
      const firstEmptyIndex = values.findIndex((v) => !v);
      const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      inputs[targetIndex]?.focus();
    };
    const blur = () => {
      inputs.forEach((input) => input.blur());
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      updateDisabledState();
    };
    const setError = (error2) => {
      hasError = error2;
      updateErrorState();
      if (error2) {
        inputs.forEach((input) => shakeInput(input));
      }
    };
    const destroy = () => {
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.innerHTML = "";
      element.classList.remove("atlas-input-otp");
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
      element.removeAttribute("aria-disabled");
      element.removeAttribute("aria-invalid");
      element.removeAttribute("data-atlas-input-otp");
      element.style.cssText = "";
    };
    return {
      get value() {
        return getValue();
      },
      get isComplete() {
        return getValue().length === length && values.every((v) => v);
      },
      get isDisabled() {
        return isDisabled;
      },
      get isFocused() {
        return isFocused;
      },
      setValue,
      clear: clear2,
      focus,
      blur,
      setDisabled,
      setError,
      destroy
    };
  }
  function createNoopInputOtpState() {
    return {
      get value() {
        return "";
      },
      get isComplete() {
        return false;
      },
      get isDisabled() {
        return false;
      },
      get isFocused() {
        return false;
      },
      setValue: () => {
      },
      clear: () => {
      },
      focus: () => {
      },
      blur: () => {
      },
      setDisabled: () => {
      },
      setError: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-RBWHW7MF.js
  var ATTRS4 = {
    ROOT: "data-atlas-menubar",
    MENU: "data-atlas-menubar-menu",
    TRIGGER: "data-atlas-menubar-trigger",
    CONTENT: "data-atlas-menubar-content",
    ITEM: "data-atlas-menubar-item",
    SEPARATOR: "data-atlas-menubar-separator",
    LABEL: "data-atlas-menubar-label"
  };
  var CLASSES4 = {
    ROOT: "atlas-menubar",
    MENU: "atlas-menubar-menu",
    TRIGGER: "atlas-menubar-trigger",
    TRIGGER_OPEN: "atlas-menubar-trigger--open",
    CONTENT: "atlas-menubar-content",
    CONTENT_OPEN: "atlas-menubar-content--open",
    ITEM: "atlas-menubar-item",
    ITEM_DISABLED: "atlas-menubar-item--disabled",
    ITEM_HIGHLIGHTED: "atlas-menubar-item--highlighted",
    SEPARATOR: "atlas-menubar-separator",
    LABEL: "atlas-menubar-label",
    SHORTCUT: "atlas-menubar-shortcut",
    ICON: "atlas-menubar-icon",
    INDICATOR: "atlas-menubar-indicator"
  };
  function createMenubar(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState4();
    }
    const {
      menus: initialMenus = [],
      placement = "bottom-start",
      offset = 4,
      closeOnSelect = true
    } = options;
    let currentMenus = initialMenus;
    let openMenuId = null;
    const id = generateId("menubar");
    const menuElements = /* @__PURE__ */ new Map();
    let dismissHandler = null;
    let cleanupAutoUpdate = null;
    let barRovingFocus = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES4.ROOT);
      element.setAttribute(ATTRS4.ROOT, "");
      element.setAttribute("role", "menubar");
      if (currentMenus.length > 0) {
        renderMenus();
      } else {
        discoverMenus();
      }
      setupBarNavigation();
    }
    function discoverMenus() {
      const menuEls = element.querySelectorAll(`[${ATTRS4.MENU}]`);
      menuEls.forEach((menuEl) => {
        const menuId = menuEl.getAttribute(ATTRS4.MENU) || generateId("menu");
        const trigger2 = menuEl.querySelector(`[${ATTRS4.TRIGGER}]`);
        const content = menuEl.querySelector(`[${ATTRS4.CONTENT}]`);
        if (trigger2 && content) {
          setupMenu(menuId, menuEl, trigger2, content);
        }
      });
    }
    function renderMenus() {
      element.innerHTML = "";
      currentMenus.forEach((menu) => {
        const menuEl = document.createElement("div");
        menuEl.className = CLASSES4.MENU;
        menuEl.setAttribute(ATTRS4.MENU, menu.id);
        const trigger2 = document.createElement("button");
        trigger2.className = CLASSES4.TRIGGER;
        trigger2.setAttribute(ATTRS4.TRIGGER, "");
        trigger2.setAttribute("type", "button");
        trigger2.setAttribute("role", "menuitem");
        trigger2.setAttribute("aria-haspopup", "menu");
        trigger2.setAttribute("aria-expanded", "false");
        trigger2.textContent = menu.label;
        trigger2.id = `${id}-trigger-${menu.id}`;
        if (menu.disabled) {
          trigger2.setAttribute("disabled", "");
          trigger2.setAttribute("aria-disabled", "true");
        }
        const content = document.createElement("div");
        content.className = CLASSES4.CONTENT;
        content.setAttribute(ATTRS4.CONTENT, "");
        content.setAttribute("role", "menu");
        content.setAttribute("aria-labelledby", trigger2.id);
        content.id = `${id}-content-${menu.id}`;
        content.style.display = "none";
        renderItems(content, menu.items, menu.id);
        menuEl.appendChild(trigger2);
        menuEl.appendChild(content);
        element.appendChild(menuEl);
        setupMenu(menu.id, menuEl, trigger2, content);
      });
    }
    function renderItems(container, items, menuId) {
      items.forEach((item) => {
        const el = createItemElement(item, menuId);
        container.appendChild(el);
      });
    }
    function createItemElement(item, menuId) {
      if (item.type === "separator") {
        const sep = document.createElement("div");
        sep.className = CLASSES4.SEPARATOR;
        sep.setAttribute(ATTRS4.SEPARATOR, "");
        sep.setAttribute("role", "separator");
        return sep;
      }
      if (item.type === "label") {
        const label = document.createElement("div");
        label.className = CLASSES4.LABEL;
        label.setAttribute(ATTRS4.LABEL, "");
        label.textContent = item.label;
        return label;
      }
      const el = document.createElement("div");
      el.className = CLASSES4.ITEM;
      el.setAttribute(ATTRS4.ITEM, "");
      el.setAttribute("data-menu-id", menuId);
      el.setAttribute("data-item-id", item.id);
      el.setAttribute(
        "role",
        item.type === "checkbox" ? "menuitemcheckbox" : item.type === "radio" ? "menuitemradio" : "menuitem"
      );
      el.tabIndex = -1;
      if (item.disabled) {
        el.classList.add(CLASSES4.ITEM_DISABLED);
        el.setAttribute("aria-disabled", "true");
      }
      if (item.type === "checkbox" || item.type === "radio") {
        el.setAttribute("aria-checked", item.checked ? "true" : "false");
      }
      let html = "";
      if (item.type === "checkbox" || item.type === "radio") {
        html += `<span class="${CLASSES4.INDICATOR}" aria-hidden="true">`;
        if (item.checked) {
          html += item.type === "checkbox" ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>';
        }
        html += "</span>";
      }
      if (item.icon) {
        html += `<span class="${CLASSES4.ICON}" aria-hidden="true">${item.icon}</span>`;
      }
      html += `<span class="atlas-menubar-item-label">${escapeHtml(item.label)}</span>`;
      if (item.shortcut) {
        html += `<span class="${CLASSES4.SHORTCUT}">${escapeHtml(item.shortcut)}</span>`;
      }
      el.innerHTML = html;
      return el;
    }
    function setupMenu(menuId, _menuEl, trigger2, content) {
      trigger2.setAttribute("aria-controls", content.id || `${id}-content-${menuId}`);
      menuElements.set(menuId, { trigger: trigger2, content, rovingFocus: null });
      cleanups.push(
        addListener(trigger2, "click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (openMenuId === menuId) {
            closeMenu();
          } else {
            openMenu(menuId);
          }
        })
      );
      cleanups.push(
        addListener(trigger2, "mouseenter", () => {
          if (openMenuId && openMenuId !== menuId) {
            openMenu(menuId);
          }
        })
      );
      cleanups.push(
        addListener(content, "click", (e) => {
          const target = e.target;
          const itemEl = target.closest(`[${ATTRS4.ITEM}]`);
          if (itemEl && !itemEl.hasAttribute("aria-disabled")) {
            handleItemSelect(menuId, itemEl);
          }
        })
      );
      cleanups.push(
        addListener(content, "keydown", (e) => {
          const ke = e;
          if (ke.key === "Enter" || ke.key === " ") {
            e.preventDefault();
            const target = e.target;
            const itemEl = target.closest(`[${ATTRS4.ITEM}]`);
            if (itemEl && !itemEl.hasAttribute("aria-disabled")) {
              handleItemSelect(menuId, itemEl);
            }
          }
        })
      );
      cleanups.push(
        addListener(content, "mouseover", (e) => {
          const target = e.target;
          const itemEl = target.closest(`[${ATTRS4.ITEM}]`);
          if (itemEl && !itemEl.hasAttribute("aria-disabled")) {
            highlightItem(content, itemEl);
          }
        })
      );
    }
    function setupBarNavigation() {
      barRovingFocus = createRovingFocus(element, {
        itemSelector: `[${ATTRS4.TRIGGER}]:not([disabled])`,
        orientation: "horizontal",
        loop: true
      });
      cleanups.push(
        addListener(element, "keydown", (e) => {
          const ke = e;
          if (ke.key === "ArrowRight" && openMenuId) {
            e.preventDefault();
            const menuIds = Array.from(menuElements.keys());
            const currentIndex = menuIds.indexOf(openMenuId);
            const nextIndex = (currentIndex + 1) % menuIds.length;
            openMenu(menuIds[nextIndex]);
          } else if (ke.key === "ArrowLeft" && openMenuId) {
            e.preventDefault();
            const menuIds = Array.from(menuElements.keys());
            const currentIndex = menuIds.indexOf(openMenuId);
            const prevIndex = (currentIndex - 1 + menuIds.length) % menuIds.length;
            openMenu(menuIds[prevIndex]);
          } else if (ke.key === "Escape") {
            e.preventDefault();
            closeMenu();
          }
        })
      );
    }
    function highlightItem(content, itemEl) {
      content.querySelectorAll(`.${CLASSES4.ITEM_HIGHLIGHTED}`).forEach((el) => {
        el.classList.remove(CLASSES4.ITEM_HIGHLIGHTED);
      });
      itemEl.classList.add(CLASSES4.ITEM_HIGHLIGHTED);
      itemEl.focus();
    }
    function handleItemSelect(menuId, itemEl) {
      const itemId = itemEl.getAttribute("data-item-id");
      const menu = currentMenus.find((m) => m.id === menuId);
      const item = menu?.items.find((i) => i.id === itemId);
      if (!item || item.disabled) return;
      if (item.type === "checkbox") {
        item.checked = !item.checked;
        itemEl.setAttribute("aria-checked", item.checked ? "true" : "false");
        updateItemIndicator(itemEl, item);
      } else if (item.type === "radio" && item.group) {
        menu?.items.forEach((i) => {
          if (i.type === "radio" && i.group === item.group) {
            i.checked = i.id === item.id;
          }
        });
        const content = menuElements.get(menuId)?.content;
        content?.querySelectorAll(`[${ATTRS4.ITEM}]`).forEach((el) => {
          const elItemId = el.getAttribute("data-item-id");
          const elItem = menu?.items.find((i) => i.id === elItemId);
          if (elItem?.type === "radio" && elItem.group === item.group) {
            el.setAttribute("aria-checked", elItem.checked ? "true" : "false");
            updateItemIndicator(el, elItem);
          }
        });
      }
      item.onSelect?.();
      options.onSelect?.(menuId, item);
      if (closeOnSelect && item.type !== "checkbox" && item.type !== "radio") {
        closeMenu();
      }
    }
    function updateItemIndicator(itemEl, item) {
      const indicator = itemEl.querySelector(`.${CLASSES4.INDICATOR}`);
      if (indicator) {
        if (item.checked) {
          indicator.innerHTML = item.type === "checkbox" ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>';
        } else {
          indicator.innerHTML = "";
        }
      }
    }
    function openMenu(menuId) {
      const menuData = menuElements.get(menuId);
      if (!menuData) return;
      if (openMenuId && openMenuId !== menuId) {
        closeMenuInternal(openMenuId);
      }
      openMenuId = menuId;
      const { trigger: trigger2, content } = menuData;
      trigger2.classList.add(CLASSES4.TRIGGER_OPEN);
      trigger2.setAttribute("aria-expanded", "true");
      content.style.display = "";
      content.classList.add(CLASSES4.CONTENT_OPEN);
      updatePosition(trigger2, content);
      cleanupAutoUpdate = autoUpdate(trigger2, content, () => updatePosition(trigger2, content));
      menuData.rovingFocus = createRovingFocus(content, {
        itemSelector: `[${ATTRS4.ITEM}]:not([aria-disabled="true"])`,
        orientation: "vertical",
        loop: true
      });
      dismissHandler = createDismissHandler(content, {
        escapeKey: true,
        clickOutside: true,
        ignore: [element],
        onDismiss: closeMenu
      });
      requestAnimationFrame(() => {
        const firstItem = content.querySelector(
          `[${ATTRS4.ITEM}]:not([aria-disabled="true"])`
        );
        if (firstItem) {
          highlightItem(content, firstItem);
        }
      });
      options.onMenuOpen?.(menuId);
    }
    function closeMenuInternal(menuId) {
      const menuData = menuElements.get(menuId);
      if (!menuData) return;
      const { trigger: trigger2, content, rovingFocus } = menuData;
      trigger2.classList.remove(CLASSES4.TRIGGER_OPEN);
      trigger2.setAttribute("aria-expanded", "false");
      content.classList.remove(CLASSES4.CONTENT_OPEN);
      content.querySelectorAll(`.${CLASSES4.ITEM_HIGHLIGHTED}`).forEach((el) => {
        el.classList.remove(CLASSES4.ITEM_HIGHLIGHTED);
      });
      rovingFocus?.destroy();
      menuData.rovingFocus = null;
      setTimeout(() => {
        if (openMenuId !== menuId) {
          content.style.display = "none";
        }
      }, ANIMATION_DURATION.fast);
      options.onMenuClose?.(menuId);
    }
    function closeMenu() {
      if (!openMenuId) return;
      const menuId = openMenuId;
      openMenuId = null;
      closeMenuInternal(menuId);
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      dismissHandler?.destroy();
      dismissHandler = null;
      const menuData = menuElements.get(menuId);
      menuData?.trigger.focus();
    }
    function closeAll() {
      closeMenu();
    }
    function updatePosition(trigger2, content) {
      const result = computeFloatingPosition(trigger2, content, {
        placement,
        offset,
        flip: true,
        shift: true
      });
      content.style.position = "absolute";
      content.style.left = `${result.x}px`;
      content.style.top = `${result.y}px`;
    }
    function destroy() {
      closeMenu();
      barRovingFocus?.destroy();
      cleanups.forEach((cleanup2) => cleanup2());
      menuElements.clear();
      element.classList.remove(CLASSES4.ROOT);
      element.removeAttribute(ATTRS4.ROOT);
      element.removeAttribute("role");
    }
    init();
    return {
      getOpenMenu: () => openMenuId,
      openMenu,
      closeMenu,
      closeAll,
      hasOpenMenu: () => openMenuId !== null,
      getMenus: () => [...currentMenus],
      setMenus: (menus) => {
        currentMenus = menus;
        menuElements.clear();
        renderMenus();
        setupBarNavigation();
      },
      destroy
    };
  }
  function createNoopState4() {
    return {
      getOpenMenu: () => null,
      openMenu: () => {
      },
      closeMenu: () => {
      },
      closeAll: () => {
      },
      hasOpenMenu: () => false,
      getMenus: () => [],
      setMenus: () => {
      },
      destroy: () => {
      }
    };
  }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // node_modules/@casoon/atlas-components/dist/chunk-G4LDOE2T.js
  var ATTRS5 = {
    ROOT: "data-atlas-navigation-menu",
    LIST: "data-atlas-navigation-menu-list",
    ITEM: "data-atlas-navigation-menu-item",
    TRIGGER: "data-atlas-navigation-menu-trigger",
    CONTENT: "data-atlas-navigation-menu-content",
    LINK: "data-atlas-navigation-menu-link"
  };
  var CLASSES5 = {
    ROOT: "atlas-navigation-menu",
    LIST: "atlas-navigation-menu-list",
    ITEM: "atlas-navigation-menu-item",
    TRIGGER: "atlas-navigation-menu-trigger",
    TRIGGER_OPEN: "atlas-navigation-menu-trigger--open",
    CONTENT: "atlas-navigation-menu-content",
    CONTENT_OPEN: "atlas-navigation-menu-content--open",
    LINK: "atlas-navigation-menu-link",
    LINK_ACTIVE: "atlas-navigation-menu-link--active",
    CHEVRON: "atlas-navigation-menu-chevron",
    DESCRIPTION: "atlas-navigation-menu-description",
    ICON: "atlas-navigation-menu-icon"
  };
  function createNavigationMenu(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState5();
    }
    const {
      items: initialItems = [],
      trigger: trigger2 = "hover",
      placement = "bottom-start",
      offset = 4,
      openDelay = 0,
      closeDelay = 150
    } = options;
    let currentItems = initialItems;
    let openItemId = null;
    let openTimeout = null;
    let closeTimeout = null;
    const id = generateId("nav-menu");
    const itemElements = /* @__PURE__ */ new Map();
    let dismissHandler = null;
    let cleanupAutoUpdate = null;
    let listRovingFocus = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES5.ROOT);
      element.setAttribute(ATTRS5.ROOT, "");
      const nav = document.createElement("nav");
      nav.setAttribute("aria-label", "Main navigation");
      if (currentItems.length > 0) {
        renderItems(nav);
      } else {
        discoverItems();
      }
      if (element.children.length === 0 || currentItems.length > 0) {
        element.appendChild(nav);
      }
      setupListNavigation();
      cleanups.push(
        addListener(document, "click", (e) => {
          if (!element.contains(e.target)) {
            closeAll();
          }
        })
      );
    }
    function discoverItems() {
      const itemEls = element.querySelectorAll(`[${ATTRS5.ITEM}]`);
      itemEls.forEach((itemEl) => {
        const itemId = itemEl.getAttribute(ATTRS5.ITEM) || generateId("nav-item");
        const triggerEl = itemEl.querySelector(`[${ATTRS5.TRIGGER}]`);
        const contentEl = itemEl.querySelector(`[${ATTRS5.CONTENT}]`);
        setupItem(itemId, itemEl, triggerEl, contentEl);
      });
    }
    function renderItems(container) {
      const list = document.createElement("ul");
      list.className = CLASSES5.LIST;
      list.setAttribute(ATTRS5.LIST, "");
      list.setAttribute("role", "menubar");
      currentItems.forEach((item) => {
        const li = document.createElement("li");
        li.className = CLASSES5.ITEM;
        li.setAttribute(ATTRS5.ITEM, item.id);
        li.setAttribute("role", "none");
        if (item.items && item.items.length > 0) {
          const triggerEl = createTriggerElement(item);
          const contentEl = createContentElement(item);
          li.appendChild(triggerEl);
          li.appendChild(contentEl);
          setupItem(item.id, li, triggerEl, contentEl);
        } else if (item.href) {
          const link = createLinkElement(item);
          li.appendChild(link);
          setupItem(item.id, li, null, null);
        }
        list.appendChild(li);
      });
      container.appendChild(list);
    }
    function createTriggerElement(item) {
      const btn = document.createElement("button");
      btn.className = CLASSES5.TRIGGER;
      btn.setAttribute(ATTRS5.TRIGGER, "");
      btn.setAttribute("type", "button");
      btn.setAttribute("role", "menuitem");
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.id = `${id}-trigger-${item.id}`;
      if (item.disabled) {
        btn.setAttribute("disabled", "");
        btn.setAttribute("aria-disabled", "true");
      }
      if (item.icon) {
        btn.innerHTML = `<span class="${CLASSES5.ICON}" aria-hidden="true">${item.icon}</span>`;
      }
      const labelSpan = document.createElement("span");
      labelSpan.textContent = item.label;
      btn.appendChild(labelSpan);
      const chevron = document.createElement("span");
      chevron.className = CLASSES5.CHEVRON;
      chevron.setAttribute("aria-hidden", "true");
      chevron.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
      btn.appendChild(chevron);
      return btn;
    }
    function createContentElement(item) {
      const content = document.createElement("div");
      content.className = CLASSES5.CONTENT;
      content.setAttribute(ATTRS5.CONTENT, "");
      content.setAttribute("role", "menu");
      content.id = `${id}-content-${item.id}`;
      content.style.display = "none";
      if (item.content) {
        content.innerHTML = item.content;
      } else if (item.items) {
        const subList = document.createElement("ul");
        subList.setAttribute("role", "menu");
        item.items.forEach((subItem) => {
          const subLi = document.createElement("li");
          subLi.setAttribute("role", "none");
          const link = createLinkElement(subItem);
          subLi.appendChild(link);
          subList.appendChild(subLi);
        });
        content.appendChild(subList);
      }
      return content;
    }
    function createLinkElement(item) {
      const link = document.createElement("a");
      link.className = CLASSES5.LINK;
      link.setAttribute(ATTRS5.LINK, "");
      link.setAttribute("role", "menuitem");
      link.href = item.href || "#";
      link.tabIndex = -1;
      if (item.active) {
        link.classList.add(CLASSES5.LINK_ACTIVE);
        link.setAttribute("aria-current", "page");
      }
      if (item.disabled) {
        link.setAttribute("aria-disabled", "true");
        link.tabIndex = -1;
      }
      if (item.icon) {
        link.innerHTML = `<span class="${CLASSES5.ICON}" aria-hidden="true">${item.icon}</span>`;
      }
      const textWrapper = document.createElement("div");
      textWrapper.className = "atlas-navigation-menu-text";
      const labelSpan = document.createElement("span");
      labelSpan.className = "atlas-navigation-menu-label";
      labelSpan.textContent = item.label;
      textWrapper.appendChild(labelSpan);
      if (item.description) {
        const descSpan = document.createElement("span");
        descSpan.className = CLASSES5.DESCRIPTION;
        descSpan.textContent = item.description;
        textWrapper.appendChild(descSpan);
      }
      link.appendChild(textWrapper);
      link.addEventListener("click", (e) => {
        if (item.disabled) {
          e.preventDefault();
          return;
        }
        item.onSelect?.();
        options.onSelect?.(item);
        if (!item.href || item.href === "#") {
          e.preventDefault();
        }
        closeAll();
      });
      return link;
    }
    function setupItem(itemId, itemEl, triggerEl, contentEl) {
      itemElements.set(itemId, {
        itemEl,
        trigger: triggerEl,
        content: contentEl,
        rovingFocus: null
      });
      if (!triggerEl || !contentEl) return;
      triggerEl.setAttribute("aria-controls", contentEl.id);
      if (trigger2 === "click") {
        cleanups.push(
          addListener(triggerEl, "click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (openItemId === itemId) {
              closeItem();
            } else {
              openItem(itemId);
            }
          })
        );
      } else {
        cleanups.push(
          addListener(itemEl, "mouseenter", () => {
            clearTimeouts();
            openTimeout = setTimeout(() => {
              openItem(itemId);
            }, openDelay);
          })
        );
        cleanups.push(
          addListener(itemEl, "mouseleave", () => {
            clearTimeouts();
            closeTimeout = setTimeout(() => {
              if (openItemId === itemId) {
                closeItem();
              }
            }, closeDelay);
          })
        );
        cleanups.push(
          addListener(triggerEl, "click", (e) => {
            e.preventDefault();
            if (openItemId === itemId) {
              closeItem();
            } else {
              openItem(itemId);
            }
          })
        );
      }
      cleanups.push(
        addListener(contentEl, "keydown", (e) => {
          const ke = e;
          if (ke.key === "Escape") {
            e.preventDefault();
            closeItem();
            triggerEl.focus();
          }
        })
      );
    }
    function setupListNavigation() {
      const list = element.querySelector(`[${ATTRS5.LIST}]`);
      if (!list) return;
      listRovingFocus = createRovingFocus(list, {
        itemSelector: `[${ATTRS5.TRIGGER}]:not([disabled]), [${ATTRS5.LINK}]:not([aria-disabled="true"])`,
        orientation: "horizontal",
        loop: true
      });
      cleanups.push(
        addListener(element, "keydown", (e) => {
          const ke = e;
          if (ke.key === "ArrowDown" && openItemId) {
            e.preventDefault();
            const itemData = itemElements.get(openItemId);
            const firstLink = itemData?.content?.querySelector(
              `[${ATTRS5.LINK}]:not([aria-disabled="true"])`
            );
            firstLink?.focus();
          }
        })
      );
    }
    function clearTimeouts() {
      if (openTimeout) {
        clearTimeout(openTimeout);
        openTimeout = null;
      }
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    }
    function openItem(itemId) {
      const itemData = itemElements.get(itemId);
      if (!itemData?.trigger || !itemData?.content) return;
      if (openItemId && openItemId !== itemId) {
        closeItemInternal(openItemId);
      }
      openItemId = itemId;
      const { trigger: triggerEl, content: contentEl } = itemData;
      triggerEl.classList.add(CLASSES5.TRIGGER_OPEN);
      triggerEl.setAttribute("aria-expanded", "true");
      contentEl.style.display = "";
      contentEl.classList.add(CLASSES5.CONTENT_OPEN);
      updatePosition(triggerEl, contentEl);
      cleanupAutoUpdate = autoUpdate(
        triggerEl,
        contentEl,
        () => updatePosition(triggerEl, contentEl)
      );
      itemData.rovingFocus = createRovingFocus(contentEl, {
        itemSelector: `[${ATTRS5.LINK}]:not([aria-disabled="true"])`,
        orientation: "vertical",
        loop: true
      });
      if (trigger2 === "click") {
        dismissHandler = createDismissHandler(contentEl, {
          escapeKey: true,
          clickOutside: true,
          ignore: [itemData.itemEl],
          onDismiss: closeItem
        });
      }
      options.onOpen?.(itemId);
    }
    function closeItemInternal(itemId) {
      const itemData = itemElements.get(itemId);
      if (!itemData?.trigger || !itemData?.content) return;
      const { trigger: triggerEl, content: contentEl, rovingFocus } = itemData;
      triggerEl.classList.remove(CLASSES5.TRIGGER_OPEN);
      triggerEl.setAttribute("aria-expanded", "false");
      contentEl.classList.remove(CLASSES5.CONTENT_OPEN);
      rovingFocus?.destroy();
      itemData.rovingFocus = null;
      setTimeout(() => {
        if (openItemId !== itemId) {
          contentEl.style.display = "none";
        }
      }, ANIMATION_DURATION.fast);
      options.onClose?.(itemId);
    }
    function closeItem() {
      if (!openItemId) return;
      const itemId = openItemId;
      openItemId = null;
      clearTimeouts();
      closeItemInternal(itemId);
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      dismissHandler?.destroy();
      dismissHandler = null;
    }
    function closeAll() {
      closeItem();
    }
    function updatePosition(triggerEl, contentEl) {
      const result = computeFloatingPosition(triggerEl, contentEl, {
        placement,
        offset,
        flip: true,
        shift: true
      });
      contentEl.style.position = "absolute";
      contentEl.style.left = `${result.x}px`;
      contentEl.style.top = `${result.y}px`;
    }
    function destroy() {
      clearTimeouts();
      closeItem();
      listRovingFocus?.destroy();
      cleanups.forEach((cleanup2) => cleanup2());
      itemElements.clear();
      element.classList.remove(CLASSES5.ROOT);
      element.removeAttribute(ATTRS5.ROOT);
    }
    init();
    return {
      getOpenItem: () => openItemId,
      openItem,
      closeItem,
      closeAll,
      hasOpenItem: () => openItemId !== null,
      getItems: () => [...currentItems],
      setItems: (items) => {
        currentItems = items;
        itemElements.clear();
        element.innerHTML = "";
        init();
      },
      destroy
    };
  }
  function createNoopState5() {
    return {
      getOpenItem: () => null,
      openItem: () => {
      },
      closeItem: () => {
      },
      closeAll: () => {
      },
      hasOpenItem: () => false,
      getItems: () => [],
      setItems: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-3NLMITNR.js
  var ATTRS6 = {
    NAV: "data-atlas-pagination-nav",
    LIST: "data-atlas-pagination-list",
    ITEM: "data-atlas-pagination-item",
    PREV: "data-atlas-pagination-prev",
    NEXT: "data-atlas-pagination-next",
    FIRST: "data-atlas-pagination-first",
    LAST: "data-atlas-pagination-last",
    PAGE: "data-atlas-pagination-page",
    ELLIPSIS: "data-atlas-pagination-ellipsis"
  };
  var CLASSES6 = {
    ROOT: "atlas-pagination",
    NAV: "atlas-pagination-nav",
    LIST: "atlas-pagination-list",
    ITEM: "atlas-pagination-item",
    BUTTON: "atlas-pagination-button",
    BUTTON_NAV: "atlas-pagination-button--nav",
    BUTTON_PAGE: "atlas-pagination-button--page",
    BUTTON_ACTIVE: "atlas-pagination-button--active",
    BUTTON_DISABLED: "atlas-pagination-button--disabled",
    ELLIPSIS: "atlas-pagination-ellipsis"
  };
  var ICON_PREV = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
  var ICON_NEXT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  var ICON_FIRST = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>`;
  var ICON_LAST = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`;
  function createPagination(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState6();
    }
    const {
      page: initialPage = 1,
      total: initialTotal = 1,
      siblings = 1,
      showEdges = false,
      showPrevNext = true
    } = options;
    let currentPage = Math.max(1, Math.min(initialPage, initialTotal));
    let totalPages = Math.max(1, initialTotal);
    const id = generateId("pagination");
    let navEl = null;
    let listEl = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES6.ROOT);
      element.setAttribute("data-atlas-pagination", "");
      element.id = id;
      navEl = document.createElement("nav");
      navEl.className = CLASSES6.NAV;
      navEl.setAttribute(ATTRS6.NAV, "");
      navEl.setAttribute("aria-label", "Pagination");
      listEl = document.createElement("ul");
      listEl.className = CLASSES6.LIST;
      listEl.setAttribute(ATTRS6.LIST, "");
      navEl.appendChild(listEl);
      element.appendChild(navEl);
      render();
    }
    function generateRange() {
      const range = [];
      if (totalPages <= 0) return range;
      range.push(1);
      const leftSibling = Math.max(2, currentPage - siblings);
      const rightSibling = Math.min(totalPages - 1, currentPage + siblings);
      if (leftSibling > 2) {
        range.push("ellipsis");
      }
      for (let i = leftSibling; i <= rightSibling; i++) {
        if (i > 1 && i < totalPages) {
          range.push(i);
        }
      }
      if (rightSibling < totalPages - 1) {
        range.push("ellipsis");
      }
      if (totalPages > 1) {
        range.push(totalPages);
      }
      return range;
    }
    function render() {
      if (!listEl) return;
      listEl.innerHTML = "";
      if (showEdges) {
        addNavButton("first", ICON_FIRST, "First page", currentPage <= 1, first);
      }
      if (showPrevNext) {
        addNavButton("prev", ICON_PREV, "Previous page", currentPage <= 1, prev);
      }
      const range = generateRange();
      range.forEach((item) => {
        if (item === "ellipsis") {
          addEllipsis();
        } else {
          addPageButton(item, item === currentPage);
        }
      });
      if (showPrevNext) {
        addNavButton("next", ICON_NEXT, "Next page", currentPage >= totalPages, next);
      }
      if (showEdges) {
        addNavButton("last", ICON_LAST, "Last page", currentPage >= totalPages, last);
      }
    }
    function addNavButton(type, icon, label, disabled, handler4) {
      const li = document.createElement("li");
      li.className = CLASSES6.ITEM;
      li.setAttribute(ATTRS6.ITEM, "");
      const button = document.createElement("button");
      button.className = `${CLASSES6.BUTTON} ${CLASSES6.BUTTON_NAV}`;
      if (disabled) {
        button.classList.add(CLASSES6.BUTTON_DISABLED);
      }
      button.type = "button";
      button.disabled = disabled;
      button.setAttribute("aria-label", label);
      button.setAttribute(`${ATTRS6[type.toUpperCase()]}`, "");
      button.innerHTML = icon;
      if (!disabled) {
        button.addEventListener("click", handler4);
      }
      li.appendChild(button);
      listEl?.appendChild(li);
    }
    function addPageButton(pageNum, isCurrent) {
      const li = document.createElement("li");
      li.className = CLASSES6.ITEM;
      li.setAttribute(ATTRS6.ITEM, "");
      const button = document.createElement("button");
      button.className = `${CLASSES6.BUTTON} ${CLASSES6.BUTTON_PAGE}`;
      if (isCurrent) {
        button.classList.add(CLASSES6.BUTTON_ACTIVE);
      }
      button.type = "button";
      button.textContent = String(pageNum);
      button.setAttribute(ATTRS6.PAGE, String(pageNum));
      button.setAttribute("aria-label", `Page ${pageNum}`);
      if (isCurrent) {
        button.setAttribute("aria-current", "page");
      }
      button.addEventListener("click", () => goToPage(pageNum));
      li.appendChild(button);
      listEl?.appendChild(li);
    }
    function addEllipsis() {
      const li = document.createElement("li");
      li.className = CLASSES6.ITEM;
      li.setAttribute(ATTRS6.ITEM, "");
      const span = document.createElement("span");
      span.className = CLASSES6.ELLIPSIS;
      span.setAttribute(ATTRS6.ELLIPSIS, "");
      span.setAttribute("aria-hidden", "true");
      span.textContent = "...";
      li.appendChild(span);
      listEl?.appendChild(li);
    }
    function goToPage(page) {
      if (page < 1 || page > totalPages || page === currentPage) return;
      currentPage = page;
      render();
      options.onChange?.(currentPage);
    }
    function next() {
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    }
    function prev() {
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    }
    function first() {
      goToPage(1);
    }
    function last() {
      goToPage(totalPages);
    }
    function setPage(page) {
      goToPage(Math.max(1, Math.min(page, totalPages)));
    }
    function setTotal(total) {
      totalPages = Math.max(1, total);
      if (currentPage > totalPages) {
        currentPage = totalPages;
      }
      render();
    }
    function canPrev() {
      return currentPage > 1;
    }
    function canNext() {
      return currentPage < totalPages;
    }
    function refresh() {
      render();
    }
    function destroy() {
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES6.ROOT);
      element.removeAttribute("data-atlas-pagination");
      element.innerHTML = "";
    }
    init();
    return {
      getPage: () => currentPage,
      setPage,
      getTotal: () => totalPages,
      setTotal,
      next,
      prev,
      first,
      last,
      canPrev,
      canNext,
      refresh,
      destroy
    };
  }
  function createNoopState6() {
    return {
      getPage: () => 1,
      setPage: () => {
      },
      getTotal: () => 1,
      setTotal: () => {
      },
      next: () => {
      },
      prev: () => {
      },
      first: () => {
      },
      last: () => {
      },
      canPrev: () => false,
      canNext: () => false,
      refresh: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-H2HBAE5O.js
  var ATTRS7 = {
    GROUP: "data-atlas-resizable-group",
    PANEL: "data-atlas-resizable-panel",
    HANDLE: "data-atlas-resizable-handle"
  };
  var CLASSES7 = {
    ROOT: "atlas-resizable",
    GROUP: "atlas-resizable-group",
    PANEL: "atlas-resizable-panel",
    PANEL_COLLAPSED: "atlas-resizable-panel--collapsed",
    HANDLE: "atlas-resizable-handle",
    HANDLE_GRIP: "atlas-resizable-handle-grip",
    HANDLE_ACTIVE: "atlas-resizable-handle--active",
    HORIZONTAL: "atlas-resizable--horizontal",
    VERTICAL: "atlas-resizable--vertical",
    DRAGGING: "atlas-resizable--dragging"
  };
  function createResizable(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState7();
    }
    const {
      direction = "horizontal",
      panels: panelConfigs = [],
      keyboardStep = 5,
      showHandle = true
    } = options;
    let panelEls = [];
    let handleEls = [];
    let sizes = [];
    const collapsedPanels = /* @__PURE__ */ new Set();
    let defaultSizes = [];
    let isDragging = false;
    let activeHandleIndex = -1;
    let dragStartPos = 0;
    let dragStartSizes = [];
    const id = generateId("resizable");
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES7.ROOT, CLASSES7.GROUP);
      element.classList.add(direction === "horizontal" ? CLASSES7.HORIZONTAL : CLASSES7.VERTICAL);
      element.setAttribute("data-atlas-resizable", "");
      element.setAttribute(ATTRS7.GROUP, "");
      element.setAttribute("role", "group");
      element.id = id;
      findPanels();
      createHandles();
      initializeSizes();
      applySizes();
    }
    function findPanels() {
      panelEls = Array.from(element.querySelectorAll(`[${ATTRS7.PANEL}]`));
      if (panelEls.length === 0) {
        panelEls = Array.from(element.children).filter(
          (child) => child instanceof HTMLElement && !child.hasAttribute(ATTRS7.HANDLE)
        );
        panelEls.forEach((panel, index) => {
          panel.setAttribute(ATTRS7.PANEL, String(index));
          panel.classList.add(CLASSES7.PANEL);
        });
      }
    }
    function createHandles() {
      handleEls.forEach((h) => h.remove());
      handleEls = [];
      for (let i = 0; i < panelEls.length - 1; i++) {
        const handle = document.createElement("div");
        handle.className = CLASSES7.HANDLE;
        handle.setAttribute(ATTRS7.HANDLE, String(i));
        handle.setAttribute("role", "separator");
        handle.setAttribute("tabindex", "0");
        handle.setAttribute(
          "aria-orientation",
          direction === "horizontal" ? "vertical" : "horizontal"
        );
        handle.setAttribute("aria-valuenow", "50");
        handle.setAttribute("aria-valuemin", "0");
        handle.setAttribute("aria-valuemax", "100");
        handle.setAttribute("aria-label", `Resize handle ${i + 1}`);
        if (showHandle) {
          const grip = document.createElement("div");
          grip.className = CLASSES7.HANDLE_GRIP;
          handle.appendChild(grip);
        }
        panelEls[i].after(handle);
        handleEls.push(handle);
        setupHandleEvents(handle, i);
      }
    }
    function setupHandleEvents(handle, index) {
      const handleMouseDown = (e) => {
        e.preventDefault();
        startDrag(index, direction === "horizontal" ? e.clientX : e.clientY);
      };
      handle.addEventListener("mousedown", handleMouseDown);
      cleanups.push(() => handle.removeEventListener("mousedown", handleMouseDown));
      const handleTouchStart = (e) => {
        const touch = e.touches[0];
        startDrag(index, direction === "horizontal" ? touch.clientX : touch.clientY);
      };
      handle.addEventListener("touchstart", handleTouchStart, { passive: true });
      cleanups.push(() => handle.removeEventListener("touchstart", handleTouchStart));
      const handleKeyDown = (e) => {
        let delta = 0;
        if (direction === "horizontal") {
          if (e.key === "ArrowLeft") delta = -keyboardStep;
          else if (e.key === "ArrowRight") delta = keyboardStep;
        } else {
          if (e.key === "ArrowUp") delta = -keyboardStep;
          else if (e.key === "ArrowDown") delta = keyboardStep;
        }
        if (e.shiftKey) {
          delta *= 2;
        }
        if (delta !== 0) {
          e.preventDefault();
          resizeByDelta(index, delta);
          options.onResize?.(sizes);
        }
        if (e.key === "Home") {
          e.preventDefault();
          const config = panelConfigs[index];
          if (config?.collapsible) {
            collapse(index);
          }
        }
        if (e.key === "End") {
          e.preventDefault();
          expand(index);
        }
      };
      handle.addEventListener("keydown", handleKeyDown);
      cleanups.push(() => handle.removeEventListener("keydown", handleKeyDown));
      const handleDblClick = () => {
        reset();
      };
      handle.addEventListener("dblclick", handleDblClick);
      cleanups.push(() => handle.removeEventListener("dblclick", handleDblClick));
    }
    function startDrag(handleIndex, startPos) {
      isDragging = true;
      activeHandleIndex = handleIndex;
      dragStartPos = startPos;
      dragStartSizes = [...sizes];
      element.classList.add(CLASSES7.DRAGGING);
      handleEls[handleIndex].classList.add(CLASSES7.HANDLE_ACTIVE);
      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      options.onResizeStart?.();
      const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
        handleDrag(currentPos);
      };
      const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const currentPos = direction === "horizontal" ? touch.clientX : touch.clientY;
        handleDrag(currentPos);
      };
      const handleEnd = () => {
        endDrag();
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
      document.addEventListener("touchend", handleEnd);
    }
    function handleDrag(currentPos) {
      if (!isDragging || activeHandleIndex < 0) return;
      const totalSize = direction === "horizontal" ? element.clientWidth : element.clientHeight;
      const deltaPixels = currentPos - dragStartPos;
      const deltaPercent = deltaPixels / totalSize * 100;
      resizeByDelta(activeHandleIndex, deltaPercent, dragStartSizes);
      options.onResize?.(sizes);
    }
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      element.classList.remove(CLASSES7.DRAGGING);
      if (activeHandleIndex >= 0 && handleEls[activeHandleIndex]) {
        handleEls[activeHandleIndex].classList.remove(CLASSES7.HANDLE_ACTIVE);
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      activeHandleIndex = -1;
      options.onResizeEnd?.(sizes);
    }
    function resizeByDelta(handleIndex, deltaPercent, baseSizes) {
      const base = baseSizes ?? sizes;
      const prevIndex = handleIndex;
      const nextIndex = handleIndex + 1;
      if (prevIndex < 0 || nextIndex >= panelEls.length) return;
      const prevConfig = panelConfigs[prevIndex] ?? {};
      const nextConfig = panelConfigs[nextIndex] ?? {};
      const prevMin = prevConfig.minSize ?? 0;
      const prevMax = prevConfig.maxSize ?? 100;
      const nextMin = nextConfig.minSize ?? 0;
      const nextMax = nextConfig.maxSize ?? 100;
      let newPrevSize = base[prevIndex] + deltaPercent;
      let newNextSize = base[nextIndex] - deltaPercent;
      if (newPrevSize < prevMin) {
        newPrevSize = prevMin;
        newNextSize = base[prevIndex] + base[nextIndex] - prevMin;
      }
      if (newPrevSize > prevMax) {
        newPrevSize = prevMax;
        newNextSize = base[prevIndex] + base[nextIndex] - prevMax;
      }
      if (newNextSize < nextMin) {
        newNextSize = nextMin;
        newPrevSize = base[prevIndex] + base[nextIndex] - nextMin;
      }
      if (newNextSize > nextMax) {
        newNextSize = nextMax;
        newPrevSize = base[prevIndex] + base[nextIndex] - nextMax;
      }
      sizes[prevIndex] = newPrevSize;
      sizes[nextIndex] = newNextSize;
      const prevCollapsedSize = prevConfig.collapsedSize ?? 0;
      const nextCollapsedSize = nextConfig.collapsedSize ?? 0;
      if (prevConfig.collapsible && newPrevSize <= prevCollapsedSize) {
        collapsedPanels.add(prevIndex);
      } else {
        collapsedPanels.delete(prevIndex);
      }
      if (nextConfig.collapsible && newNextSize <= nextCollapsedSize) {
        collapsedPanels.add(nextIndex);
      } else {
        collapsedPanels.delete(nextIndex);
      }
      applySizes();
      updateAriaValues();
    }
    function initializeSizes() {
      const panelCount = panelEls.length;
      if (panelCount === 0) {
        sizes = [];
        defaultSizes = [];
        return;
      }
      const equalSize = 100 / panelCount;
      sizes = panelEls.map((-, index) => {
        const config = panelConfigs[index];
        return config?.defaultSize ?? equalSize;
      });
      const total = sizes.reduce((sum, s) => sum + s, 0);
      if (total !== 100) {
        const factor = 100 / total;
        sizes = sizes.map((s) => s * factor);
      }
      defaultSizes = [...sizes];
    }
    function applySizes() {
      panelEls.forEach((panel, index) => {
        const size2 = sizes[index] ?? 0;
        panelConfigs[index] ?? {};
        const isCollapsed2 = collapsedPanels.has(index);
        if (direction === "horizontal") {
          panel.style.width = `${size2}%`;
          panel.style.flexBasis = `${size2}%`;
        } else {
          panel.style.height = `${size2}%`;
          panel.style.flexBasis = `${size2}%`;
        }
        panel.style.flexGrow = "0";
        panel.style.flexShrink = "0";
        panel.classList.toggle(CLASSES7.PANEL_COLLAPSED, isCollapsed2);
        if (isCollapsed2) {
          panel.style.overflow = "hidden";
        } else {
          panel.style.overflow = "";
        }
      });
    }
    function updateAriaValues() {
      handleEls.forEach((handle, index) => {
        const prevSize = sizes[index] ?? 0;
        handle.setAttribute("aria-valuenow", String(Math.round(prevSize)));
      });
    }
    function collapse(panelIndex) {
      const config = panelConfigs[panelIndex];
      if (!config?.collapsible || panelIndex < 0 || panelIndex >= panelEls.length) return;
      const collapsedSize = config.collapsedSize ?? 0;
      const currentSize = sizes[panelIndex];
      const delta = collapsedSize - currentSize;
      if (panelIndex > 0) {
        sizes[panelIndex - 1] -= delta;
      } else if (panelIndex < panelEls.length - 1) {
        sizes[panelIndex + 1] -= delta;
      }
      sizes[panelIndex] = collapsedSize;
      collapsedPanels.add(panelIndex);
      applySizes();
      updateAriaValues();
      options.onResize?.(sizes);
    }
    function expand(panelIndex) {
      if (panelIndex < 0 || panelIndex >= panelEls.length) return;
      if (!collapsedPanels.has(panelIndex)) return;
      const config = panelConfigs[panelIndex] ?? {};
      const targetSize = config.defaultSize ?? defaultSizes[panelIndex] ?? 100 / panelEls.length;
      const currentSize = sizes[panelIndex];
      const delta = targetSize - currentSize;
      if (panelIndex > 0 && sizes[panelIndex - 1] > delta) {
        sizes[panelIndex - 1] -= delta;
      } else if (panelIndex < panelEls.length - 1) {
        sizes[panelIndex + 1] -= delta;
      }
      sizes[panelIndex] = targetSize;
      collapsedPanels.delete(panelIndex);
      applySizes();
      updateAriaValues();
      options.onResize?.(sizes);
    }
    function toggle(panelIndex) {
      if (collapsedPanels.has(panelIndex)) {
        expand(panelIndex);
      } else {
        collapse(panelIndex);
      }
    }
    function isCollapsed(panelIndex) {
      return collapsedPanels.has(panelIndex);
    }
    function getSizes() {
      return [...sizes];
    }
    function setSizes(newSizes) {
      if (newSizes.length !== panelEls.length) {
        console.warn("[Atlas Resizable] Size array length must match panel count");
        return;
      }
      sizes = [...newSizes];
      collapsedPanels.clear();
      panelEls.forEach((-, index) => {
        const config = panelConfigs[index] ?? {};
        const collapsedSize = config.collapsedSize ?? 0;
        if (config.collapsible && sizes[index] <= collapsedSize) {
          collapsedPanels.add(index);
        }
      });
      applySizes();
      updateAriaValues();
      options.onResize?.(sizes);
    }
    function reset() {
      sizes = [...defaultSizes];
      collapsedPanels.clear();
      applySizes();
      updateAriaValues();
      options.onResize?.(sizes);
    }
    function refresh() {
      findPanels();
      createHandles();
      initializeSizes();
      applySizes();
    }
    function destroy() {
      cleanups.forEach((cleanup2) => cleanup2());
      handleEls.forEach((h) => h.remove());
      element.classList.remove(
        CLASSES7.ROOT,
        CLASSES7.GROUP,
        CLASSES7.HORIZONTAL,
        CLASSES7.VERTICAL,
        CLASSES7.DRAGGING
      );
      element.removeAttribute("data-atlas-resizable");
      element.removeAttribute(ATTRS7.GROUP);
      element.removeAttribute("role");
      panelEls.forEach((panel) => {
        panel.classList.remove(CLASSES7.PANEL, CLASSES7.PANEL_COLLAPSED);
        panel.removeAttribute(ATTRS7.PANEL);
        panel.style.width = "";
        panel.style.height = "";
        panel.style.flexBasis = "";
        panel.style.flexGrow = "";
        panel.style.flexShrink = "";
        panel.style.overflow = "";
      });
    }
    init();
    return {
      getSizes,
      setSizes,
      getPanelCount: () => panelEls.length,
      collapse,
      expand,
      toggle,
      isCollapsed,
      reset,
      refresh,
      destroy
    };
  }
  function createNoopState7() {
    return {
      getSizes: () => [],
      setSizes: () => {
      },
      getPanelCount: () => 0,
      collapse: () => {
      },
      expand: () => {
      },
      toggle: () => {
      },
      isCollapsed: () => false,
      reset: () => {
      },
      refresh: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-CXYQOZ6F.js
  var ATTRS8 = {
    VIEWPORT: "data-atlas-scroll-viewport",
    CONTENT: "data-atlas-scroll-content",
    SCROLLBAR: "data-atlas-scrollbar",
    SCROLLBAR_THUMB: "data-atlas-scrollbar-thumb",
    CORNER: "data-atlas-scroll-corner"
  };
  var CLASSES8 = {
    ROOT: "atlas-scroll-area",
    VIEWPORT: "atlas-scroll-area-viewport",
    CONTENT: "atlas-scroll-area-content",
    SCROLLBAR: "atlas-scrollbar",
    SCROLLBAR_VERTICAL: "atlas-scrollbar--vertical",
    SCROLLBAR_HORIZONTAL: "atlas-scrollbar--horizontal",
    SCROLLBAR_THUMB: "atlas-scrollbar-thumb",
    SCROLLBAR_VISIBLE: "atlas-scrollbar--visible",
    SCROLLBAR_DRAGGING: "atlas-scrollbar--dragging",
    CORNER: "atlas-scroll-area-corner",
    TYPE_AUTO: "atlas-scroll-area--type-auto",
    TYPE_ALWAYS: "atlas-scroll-area--type-always",
    TYPE_SCROLL: "atlas-scroll-area--type-scroll",
    TYPE_HOVER: "atlas-scroll-area--type-hover"
  };
  function createScrollArea(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState8();
    }
    const { orientation = "vertical", type = "auto", scrollbarSize = 10 } = options;
    const id = generateId("scroll-area");
    let viewportEl = null;
    let contentEl = null;
    let verticalScrollbar = null;
    let verticalThumb = null;
    let horizontalScrollbar = null;
    let horizontalThumb = null;
    let cornerEl = null;
    const cleanups = [];
    let isDraggingVertical = false;
    let isDraggingHorizontal = false;
    let dragStartY = 0;
    let dragStartX = 0;
    let dragStartScrollTop = 0;
    let dragStartScrollLeft = 0;
    let scrollTimeout = null;
    let isHovering = false;
    function init() {
      element.classList.add(CLASSES8.ROOT);
      element.classList.add(`${CLASSES8.ROOT}--${orientation}`);
      element.classList.add(getTypeClass(type));
      element.setAttribute("data-atlas-scroll-area", "");
      element.id = id;
      viewportEl = document.createElement("div");
      viewportEl.className = CLASSES8.VIEWPORT;
      viewportEl.setAttribute(ATTRS8.VIEWPORT, "");
      switch (orientation) {
        case "vertical":
          viewportEl.style.overflowX = "hidden";
          viewportEl.style.overflowY = "scroll";
          break;
        case "horizontal":
          viewportEl.style.overflowX = "scroll";
          viewportEl.style.overflowY = "hidden";
          break;
        case "both":
          viewportEl.style.overflow = "scroll";
          break;
      }
      viewportEl.style.scrollbarWidth = "none";
      viewportEl.style.msOverflowStyle = "none";
      contentEl = document.createElement("div");
      contentEl.className = CLASSES8.CONTENT;
      contentEl.setAttribute(ATTRS8.CONTENT, "");
      while (element.firstChild) {
        contentEl.appendChild(element.firstChild);
      }
      viewportEl.appendChild(contentEl);
      element.appendChild(viewportEl);
      if (orientation === "vertical" || orientation === "both") {
        createVerticalScrollbar();
      }
      if (orientation === "horizontal" || orientation === "both") {
        createHorizontalScrollbar();
      }
      if (orientation === "both") {
        createCorner();
      }
      setupScrollListener();
      setupHoverListeners();
      setupResizeObserver();
      updateScrollbars();
    }
    function getTypeClass(t) {
      switch (t) {
        case "always":
          return CLASSES8.TYPE_ALWAYS;
        case "scroll":
          return CLASSES8.TYPE_SCROLL;
        case "hover":
          return CLASSES8.TYPE_HOVER;
        default:
          return CLASSES8.TYPE_AUTO;
      }
    }
    function createVerticalScrollbar() {
      verticalScrollbar = document.createElement("div");
      verticalScrollbar.className = `${CLASSES8.SCROLLBAR} ${CLASSES8.SCROLLBAR_VERTICAL}`;
      verticalScrollbar.setAttribute(ATTRS8.SCROLLBAR, "vertical");
      verticalScrollbar.style.width = `${scrollbarSize}px`;
      verticalThumb = document.createElement("div");
      verticalThumb.className = CLASSES8.SCROLLBAR_THUMB;
      verticalThumb.setAttribute(ATTRS8.SCROLLBAR_THUMB, "vertical");
      verticalScrollbar.appendChild(verticalThumb);
      element.appendChild(verticalScrollbar);
      verticalScrollbar.addEventListener("mousedown", handleVerticalTrackClick);
      verticalThumb.addEventListener("mousedown", handleVerticalThumbDrag);
    }
    function createHorizontalScrollbar() {
      horizontalScrollbar = document.createElement("div");
      horizontalScrollbar.className = `${CLASSES8.SCROLLBAR} ${CLASSES8.SCROLLBAR_HORIZONTAL}`;
      horizontalScrollbar.setAttribute(ATTRS8.SCROLLBAR, "horizontal");
      horizontalScrollbar.style.height = `${scrollbarSize}px`;
      horizontalThumb = document.createElement("div");
      horizontalThumb.className = CLASSES8.SCROLLBAR_THUMB;
      horizontalThumb.setAttribute(ATTRS8.SCROLLBAR_THUMB, "horizontal");
      horizontalScrollbar.appendChild(horizontalThumb);
      element.appendChild(horizontalScrollbar);
      horizontalScrollbar.addEventListener("mousedown", handleHorizontalTrackClick);
      horizontalThumb.addEventListener("mousedown", handleHorizontalThumbDrag);
    }
    function createCorner() {
      cornerEl = document.createElement("div");
      cornerEl.className = CLASSES8.CORNER;
      cornerEl.setAttribute(ATTRS8.CORNER, "");
      cornerEl.style.width = `${scrollbarSize}px`;
      cornerEl.style.height = `${scrollbarSize}px`;
      element.appendChild(cornerEl);
    }
    function setupScrollListener() {
      if (!viewportEl) return;
      const handleScroll = () => {
        updateScrollbars();
        showScrollbars();
        options.onScroll?.(viewportEl?.scrollTop ?? 0, viewportEl?.scrollLeft ?? 0);
      };
      cleanups.push(addListener(viewportEl, "scroll", handleScroll));
    }
    function setupHoverListeners() {
      if (type !== "hover") return;
      cleanups.push(
        addListener(element, "mouseenter", () => {
          isHovering = true;
          showScrollbars();
        })
      );
      cleanups.push(
        addListener(element, "mouseleave", () => {
          isHovering = false;
          hideScrollbars();
        })
      );
    }
    function setupResizeObserver() {
      if (!viewportEl) return;
      const resizeObserver = new ResizeObserver(() => {
        updateScrollbars();
      });
      resizeObserver.observe(viewportEl);
      if (contentEl) {
        resizeObserver.observe(contentEl);
      }
      cleanups.push(() => resizeObserver.disconnect());
    }
    function updateScrollbars() {
      if (!viewportEl) return;
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = viewportEl;
      if (verticalThumb && verticalScrollbar) {
        const trackHeight = verticalScrollbar.clientHeight;
        const thumbHeight = Math.max(30, clientHeight / scrollHeight * trackHeight);
        const thumbTop = scrollTop / (scrollHeight - clientHeight) * (trackHeight - thumbHeight);
        verticalThumb.style.height = `${thumbHeight}px`;
        verticalThumb.style.transform = `translateY(${thumbTop}px)`;
        const hasVerticalScroll = scrollHeight > clientHeight;
        verticalScrollbar.style.display = hasVerticalScroll ? "block" : "none";
      }
      if (horizontalThumb && horizontalScrollbar) {
        const trackWidth = horizontalScrollbar.clientWidth;
        const thumbWidth = Math.max(30, clientWidth / scrollWidth * trackWidth);
        const thumbLeft = scrollLeft / (scrollWidth - clientWidth) * (trackWidth - thumbWidth);
        horizontalThumb.style.width = `${thumbWidth}px`;
        horizontalThumb.style.transform = `translateX(${thumbLeft}px)`;
        const hasHorizontalScroll = scrollWidth > clientWidth;
        horizontalScrollbar.style.display = hasHorizontalScroll ? "block" : "none";
      }
    }
    function showScrollbars() {
      if (type === "scroll" || type === "auto") {
        verticalScrollbar?.classList.add(CLASSES8.SCROLLBAR_VISIBLE);
        horizontalScrollbar?.classList.add(CLASSES8.SCROLLBAR_VISIBLE);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
          if (!isDraggingVertical && !isDraggingHorizontal && !isHovering) {
            hideScrollbars();
          }
        }, 1e3);
      }
    }
    function hideScrollbars() {
      if (type === "scroll" || type === "auto") {
        if (!isDraggingVertical && !isDraggingHorizontal) {
          verticalScrollbar?.classList.remove(CLASSES8.SCROLLBAR_VISIBLE);
          horizontalScrollbar?.classList.remove(CLASSES8.SCROLLBAR_VISIBLE);
        }
      }
    }
    function handleVerticalTrackClick(e) {
      if (e.target === verticalThumb || !viewportEl || !verticalScrollbar) return;
      const trackRect = verticalScrollbar.getBoundingClientRect();
      const thumbRect = verticalThumb?.getBoundingClientRect();
      if (!thumbRect) return;
      const clickY = e.clientY - trackRect.top;
      const thumbCenter = thumbRect.top - trackRect.top + thumbRect.height / 2;
      const direction = clickY < thumbCenter ? -1 : 1;
      viewportEl.scrollTop += direction * viewportEl.clientHeight * 0.9;
    }
    function handleHorizontalTrackClick(e) {
      if (e.target === horizontalThumb || !viewportEl || !horizontalScrollbar) return;
      const trackRect = horizontalScrollbar.getBoundingClientRect();
      const thumbRect = horizontalThumb?.getBoundingClientRect();
      if (!thumbRect) return;
      const clickX = e.clientX - trackRect.left;
      const thumbCenter = thumbRect.left - trackRect.left + thumbRect.width / 2;
      const direction = clickX < thumbCenter ? -1 : 1;
      viewportEl.scrollLeft += direction * viewportEl.clientWidth * 0.9;
    }
    function handleVerticalThumbDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!viewportEl) return;
      isDraggingVertical = true;
      dragStartY = e.clientY;
      dragStartScrollTop = viewportEl.scrollTop;
      verticalScrollbar?.classList.add(CLASSES8.SCROLLBAR_DRAGGING);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
      const handleMouseMove = (moveEvent) => {
        if (!viewportEl || !verticalScrollbar) return;
        const deltaY = moveEvent.clientY - dragStartY;
        const trackHeight = verticalScrollbar.clientHeight;
        const thumbHeight = verticalThumb?.clientHeight ?? 0;
        const scrollableHeight = viewportEl.scrollHeight - viewportEl.clientHeight;
        const scrollDelta = deltaY / (trackHeight - thumbHeight) * scrollableHeight;
        viewportEl.scrollTop = dragStartScrollTop + scrollDelta;
      };
      const handleMouseUp = () => {
        isDraggingVertical = false;
        verticalScrollbar?.classList.remove(CLASSES8.SCROLLBAR_DRAGGING);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (!isHovering) {
          hideScrollbars();
        }
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    function handleHorizontalThumbDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!viewportEl) return;
      isDraggingHorizontal = true;
      dragStartX = e.clientX;
      dragStartScrollLeft = viewportEl.scrollLeft;
      horizontalScrollbar?.classList.add(CLASSES8.SCROLLBAR_DRAGGING);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
      const handleMouseMove = (moveEvent) => {
        if (!viewportEl || !horizontalScrollbar) return;
        const deltaX = moveEvent.clientX - dragStartX;
        const trackWidth = horizontalScrollbar.clientWidth;
        const thumbWidth = horizontalThumb?.clientWidth ?? 0;
        const scrollableWidth = viewportEl.scrollWidth - viewportEl.clientWidth;
        const scrollDelta = deltaX / (trackWidth - thumbWidth) * scrollableWidth;
        viewportEl.scrollLeft = dragStartScrollLeft + scrollDelta;
      };
      const handleMouseUp = () => {
        isDraggingHorizontal = false;
        horizontalScrollbar?.classList.remove(CLASSES8.SCROLLBAR_DRAGGING);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (!isHovering) {
          hideScrollbars();
        }
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    function scrollTo(scrollOptions) {
      viewportEl?.scrollTo(scrollOptions);
    }
    function scrollBy(scrollOptions) {
      viewportEl?.scrollBy(scrollOptions);
    }
    function scrollIntoView(target, scrollOptions) {
      target.scrollIntoView(scrollOptions);
    }
    function refresh() {
      updateScrollbars();
    }
    function destroy() {
      cleanups.forEach((cleanup2) => cleanup2());
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      element.classList.remove(
        CLASSES8.ROOT,
        `${CLASSES8.ROOT}--${orientation}`,
        CLASSES8.TYPE_AUTO,
        CLASSES8.TYPE_ALWAYS,
        CLASSES8.TYPE_SCROLL,
        CLASSES8.TYPE_HOVER
      );
      element.removeAttribute("data-atlas-scroll-area");
      if (contentEl && viewportEl) {
        while (contentEl.firstChild) {
          element.appendChild(contentEl.firstChild);
        }
      }
      viewportEl?.remove();
      verticalScrollbar?.remove();
      horizontalScrollbar?.remove();
      cornerEl?.remove();
    }
    init();
    return {
      getViewport: () => viewportEl,
      scrollTo,
      scrollBy,
      getScrollTop: () => viewportEl?.scrollTop ?? 0,
      setScrollTop: (value) => {
        if (viewportEl) viewportEl.scrollTop = value;
      },
      getScrollLeft: () => viewportEl?.scrollLeft ?? 0,
      setScrollLeft: (value) => {
        if (viewportEl) viewportEl.scrollLeft = value;
      },
      getScrollSize: () => ({
        width: viewportEl?.scrollWidth ?? 0,
        height: viewportEl?.scrollHeight ?? 0
      }),
      getViewportSize: () => ({
        width: viewportEl?.clientWidth ?? 0,
        height: viewportEl?.clientHeight ?? 0
      }),
      scrollIntoView,
      refresh,
      destroy
    };
  }
  function createNoopState8() {
    return {
      getViewport: () => null,
      scrollTo: () => {
      },
      scrollBy: () => {
      },
      getScrollTop: () => 0,
      setScrollTop: () => {
      },
      getScrollLeft: () => 0,
      setScrollLeft: () => {
      },
      getScrollSize: () => ({ width: 0, height: 0 }),
      getViewportSize: () => ({ width: 0, height: 0 }),
      scrollIntoView: () => {
      },
      refresh: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-SQ3UGIKZ.js
  function createCard(element, options = {}) {
    if (!isBrowser()) {
      return createNoopCardState();
    }
    const {
      hover = "lift",
      tilt: tilt2 = false,
      tiltMax = 10,
      shine = false,
      liftDistance = 4,
      clickable = true,
      onClick,
      onHoverChange
    } = options;
    let isHovered = false;
    let cleanupListeners = [];
    let shineElement = null;
    let rafId = null;
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    const originalBoxShadow = element.style.boxShadow;
    element.style.transition = `
    transform ${ANIMATION_DURATION.normal}ms ${EASING.spring},
    box-shadow ${ANIMATION_DURATION.normal}ms ${EASING.standard}
  `.replace(/\s+/g, " ").trim();
    element.style.transformStyle = "preserve-3d";
    element.style.willChange = "transform";
    if (clickable) {
      element.style.cursor = "pointer";
    }
    if (shine) {
      shineElement = document.createElement("div");
      shineElement.className = "atlas-card-shine";
      shineElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      background: linear-gradient(
        105deg,
        transparent 40%,
        rgba(255, 255, 255, 0.1) 45%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 55%,
        transparent 60%
      );
      background-size: 200% 200%;
      background-position: 100% 0%;
      opacity: 0;
      transition: opacity ${ANIMATION_DURATION.fast}ms ${EASING.standard};
      border-radius: inherit;
    `;
      const computedPosition = window.getComputedStyle(element).position;
      if (computedPosition === "static") {
        element.style.position = "relative";
      }
      element.appendChild(shineElement);
    }
    const calculateTilt = (e, rect) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = (x / rect.width - 0.5) * 2;
      const percentY = (y / rect.height - 0.5) * 2;
      const rotateX = -percentY * tiltMax;
      const rotateY = percentX * tiltMax;
      return { rotateX, rotateY, percentX, percentY };
    };
    const applyHoverEffects = (e) => {
      let transform = "";
      let boxShadow = "";
      switch (hover) {
        case "lift":
          transform = `translateY(-${liftDistance}px)`;
          boxShadow = `
          0 ${liftDistance}px ${liftDistance * 2}px rgba(0, 0, 0, 0.1),
          0 ${liftDistance / 2}px ${liftDistance}px rgba(0, 0, 0, 0.08)
        `;
          break;
        case "scale":
          transform = "scale(1.02)";
          boxShadow = "0 10px 30px rgba(0, 0, 0, 0.12)";
          break;
        case "glow":
          boxShadow = "0 0 30px rgba(var(--atlas-primary-rgb, 59, 130, 246), 0.4)";
          break;
      }
      if (tilt2 && e) {
        const rect = element.getBoundingClientRect();
        const { rotateX, rotateY, percentX } = calculateTilt(e, rect);
        if (hover === "lift") {
          transform = `translateY(-${liftDistance}px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else if (hover === "scale") {
          transform = `scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
          transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
        if (shineElement) {
          const shineX = (percentX + 1) * 50;
          shineElement.style.backgroundPosition = `${shineX}% 0%`;
        }
      }
      element.style.transform = transform;
      element.style.boxShadow = boxShadow;
    };
    const removeHoverEffects = () => {
      element.style.transform = "";
      element.style.boxShadow = originalBoxShadow || "";
      if (shineElement) {
        shineElement.style.opacity = "0";
      }
    };
    const handleMouseEnter = () => {
      isHovered = true;
      onHoverChange?.(true);
      if (shineElement) {
        shineElement.style.opacity = "1";
      }
      if (!tilt2) {
        applyHoverEffects();
      }
    };
    const handleMouseMove = (e) => {
      if (!isHovered) return;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        applyHoverEffects(e);
      });
    };
    const handleMouseLeave = () => {
      isHovered = false;
      onHoverChange?.(false);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      removeHoverEffects();
    };
    const handleClick = () => {
      if (!clickable) return;
      if (element.animate) {
        element.animate(
          [
            { transform: element.style.transform },
            {
              transform: `${element.style.transform || ""} scale(0.98)`.trim()
            },
            { transform: element.style.transform }
          ],
          {
            duration: 150,
            easing: EASING.bounce
          }
        );
      }
      onClick?.();
    };
    cleanupListeners.push(
      addListener(element, "mouseenter", handleMouseEnter),
      addListener(element, "mousemove", handleMouseMove),
      addListener(element, "mouseleave", handleMouseLeave),
      addListener(element, "click", handleClick)
    );
    const animateIn = (delay = 0) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px) scale(0.95)";
      setTimeout(() => {
        element.style.transition = `
        opacity ${ANIMATION_DURATION.normal}ms ${EASING.decelerate},
        transform ${ANIMATION_DURATION.normal}ms ${EASING.spring}
      `.replace(/\s+/g, " ").trim();
        element.style.opacity = "1";
        element.style.transform = "";
        setTimeout(() => {
          element.style.transition = `
          transform ${ANIMATION_DURATION.normal}ms ${EASING.spring},
          box-shadow ${ANIMATION_DURATION.normal}ms ${EASING.standard}
        `.replace(/\s+/g, " ").trim();
        }, ANIMATION_DURATION.normal);
      }, delay);
    };
    const animateOut = () => {
      return new Promise((resolve) => {
        element.style.transition = `
        opacity ${ANIMATION_DURATION.fast}ms ${EASING.accelerate},
        transform ${ANIMATION_DURATION.fast}ms ${EASING.accelerate}
      `.replace(/\s+/g, " ").trim();
        element.style.opacity = "0";
        element.style.transform = "translateY(-10px) scale(0.95)";
        setTimeout(resolve, ANIMATION_DURATION.fast);
      });
    };
    const destroy = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      cleanupListeners.forEach((cleanup2) => cleanup2());
      cleanupListeners = [];
      if (shineElement) {
        shineElement.remove();
      }
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
      element.style.boxShadow = originalBoxShadow;
    };
    return {
      get isHovered() {
        return isHovered;
      },
      animateIn,
      animateOut,
      destroy
    };
  }
  function createNoopCardState() {
    return {
      get isHovered() {
        return false;
      },
      animateIn: () => {
      },
      animateOut: () => Promise.resolve(),
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-IQSLKJJZ.js
  function createForm(options = {}) {
    const { initialValues = {}, validate, onSubmit, onChange } = options;
    const fields = /* @__PURE__ */ new Map();
    const subscribers = /* @__PURE__ */ new Set();
    for (const key in initialValues) {
      if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
        const typedKey = key;
        const initVals = initialValues;
        fields.set(typedKey, {
          value: initVals[typedKey],
          touched: false,
          dirty: false
        });
      }
    }
    const notifySubscribers = () => {
      const values = getValues();
      onChange?.(values);
      subscribers.forEach((callback) => callback(values));
    };
    const setValue = (name, value) => {
      const field = fields.get(name) || {
        value: void 0,
        touched: false,
        dirty: false
      };
      fields.set(name, { ...field, value, dirty: true });
      notifySubscribers();
    };
    const setTouched = (name) => {
      const field = fields.get(name);
      if (field) {
        fields.set(name, { ...field, touched: true });
        notifySubscribers();
      }
    };
    const setError = (name, error2) => {
      const field = fields.get(name);
      if (field) {
        fields.set(name, { ...field, error: error2 });
        notifySubscribers();
      }
    };
    const getField = (name) => fields.get(name);
    const getValues = () => {
      const values = {};
      fields.forEach((field, name) => {
        values[name] = field.value;
      });
      return values;
    };
    const validateForm = () => {
      if (!validate) return {};
      const errors = validate(getValues());
      fields.forEach((field, name) => {
        field.error = errors[name];
      });
      notifySubscribers();
      return errors;
    };
    const handleSubmit = async () => {
      const errors = validateForm();
      if (Object.keys(errors).length === 0) {
        await onSubmit?.(getValues());
      }
    };
    const reset = () => {
      fields.clear();
      for (const key in initialValues) {
        if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
          const typedKey = key;
          const initVals = initialValues;
          fields.set(typedKey, {
            value: initVals[typedKey],
            touched: false,
            dirty: false
          });
        }
      }
      notifySubscribers();
    };
    const subscribe = (callback) => {
      subscribers.add(callback);
      callback(getValues());
      return () => {
        subscribers.delete(callback);
      };
    };
    const destroy = () => {
      subscribers.clear();
      fields.clear();
    };
    return {
      get fields() {
        return fields;
      },
      setValue,
      setTouched,
      setError,
      getField,
      getValues,
      validateForm,
      handleSubmit,
      reset,
      subscribe,
      destroy
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-6MVIPYM2.js
  function createButton(element, options = {}) {
    if (!isBrowser()) {
      return createNoopButtonState();
    }
    const {
      ripple: ripple2 = true,
      hover = "breathing",
      haptic = true,
      pressScale = 0.97,
      pressDuration = 150,
      successDuration = 1500,
      onPress,
      onLoadingChange,
      onStateChange
    } = options;
    let isLoading = false;
    let isDisabled = element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
    let isPressed = false;
    let isHovered = false;
    let visualState = "idle";
    let stateElement = null;
    let originalContent = "";
    let cleanupListeners = [];
    let stateTimeout = null;
    let breathingAnimation = null;
    const originalTransition = element.style.transition;
    const originalTransform = element.style.transform;
    const originalFilter = element.style.filter;
    const originalBoxShadow = element.style.boxShadow;
    element.style.transition = `
    transform ${pressDuration}ms ${EASING.bounce},
    filter ${pressDuration}ms ${EASING.standard},
    box-shadow ${ANIMATION_DURATION.fast}ms ${EASING.standard}
  `.replace(/\s+/g, " ").trim();
    element.style.transformOrigin = "center center";
    element.style.position = "relative";
    element.style.overflow = "hidden";
    const triggerHaptic = (pattern = 10) => {
      if (haptic && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    };
    const setVisualState = (newState) => {
      if (visualState === newState) return;
      visualState = newState;
      onStateChange?.(newState);
    };
    const applyHoverEffect = () => {
      if (isDisabled || isLoading || hover === "none") return;
      switch (hover) {
        case "glow":
          element.style.boxShadow = "0 0 20px rgba(var(--atlas-primary-rgb, 59, 130, 246), 0.5)";
          element.style.filter = "brightness(1.05)";
          break;
        case "lift":
          element.style.transform = "translateY(-2px)";
          element.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          break;
        case "breathing":
          if (!breathingAnimation && element.animate) {
            breathingAnimation = element.animate(
              [
                { transform: "scale(1)", filter: "brightness(1)" },
                { transform: "scale(1.02)", filter: "brightness(1.05)" },
                { transform: "scale(1)", filter: "brightness(1)" }
              ],
              {
                duration: 2e3,
                iterations: Number.POSITIVE_INFINITY,
                easing: "ease-in-out"
              }
            );
          }
          break;
      }
    };
    const removeHoverEffect = () => {
      if (hover === "none") return;
      if (breathingAnimation) {
        breathingAnimation.cancel();
        breathingAnimation = null;
      }
      element.style.boxShadow = originalBoxShadow;
      if (!isPressed) {
        element.style.transform = originalTransform || "";
        element.style.filter = originalFilter || "";
      }
    };
    const createRipple = (e) => {
      if (!ripple2 || isDisabled || isLoading) return;
      const rect = element.getBoundingClientRect();
      let x, y;
      if (e instanceof MouseEvent) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        const touch = e.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }
      const size2 = Math.max(rect.width, rect.height) * 2;
      const rippleElement = createElement("span", {
        className: "atlas-button-ripple",
        styles: {
          position: "absolute",
          borderRadius: "50%",
          backgroundColor: "currentColor",
          opacity: "0.2",
          transform: "scale(0)",
          pointerEvents: "none",
          width: `${size2}px`,
          height: `${size2}px`,
          left: `${x - size2 / 2}px`,
          top: `${y - size2 / 2}px`,
          animation: `atlas-ripple ${ANIMATION_DURATION.normal}ms ${EASING.decelerate} forwards`
        }
      });
      if (rippleElement) {
        element.appendChild(rippleElement);
        setTimeout(() => rippleElement.remove(), ANIMATION_DURATION.normal);
      }
    };
    const pressDown = () => {
      if (isDisabled || isLoading || isPressed) return;
      isPressed = true;
      if (breathingAnimation) {
        breathingAnimation.pause();
      }
      element.style.transform = `scale(${pressScale})`;
      element.style.filter = "brightness(0.95)";
      triggerHaptic();
    };
    const pressUp = () => {
      if (!isPressed) return;
      isPressed = false;
      element.style.transform = isHovered && hover === "lift" ? "translateY(-2px)" : "";
      element.style.filter = isHovered && hover === "glow" ? "brightness(1.05)" : "";
      if (breathingAnimation && isHovered) {
        breathingAnimation.play();
      }
    };
    const createStateIndicator = (type) => {
      if (type === "spinner") {
        return createElement("span", {
          className: "atlas-button-spinner",
          attributes: { "aria-hidden": "true" },
          styles: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1em",
            height: "1em",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "atlas-spin 600ms linear infinite"
          }
        });
      }
      if (type === "success") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "1em");
        svg.setAttribute("height", "1em");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "3");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");
        svg.style.cssText = "display: inline-block; vertical-align: middle;";
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M5 13l4 4L19 7");
        path.style.cssText = `
        stroke-dasharray: 24;
        stroke-dashoffset: 24;
        animation: atlas-checkmark-draw 400ms ${EASING.decelerate} forwards;
      `;
        svg.appendChild(path);
        return svg;
      }
      if (type === "error") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "1em");
        svg.setAttribute("height", "1em");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "3");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("aria-hidden", "true");
        svg.style.cssText = "display: inline-block; vertical-align: middle;";
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", "6");
        line1.setAttribute("y1", "6");
        line1.setAttribute("x2", "18");
        line1.setAttribute("y2", "18");
        line1.style.cssText = `
        stroke-dasharray: 17;
        stroke-dashoffset: 17;
        animation: atlas-x-draw 300ms ${EASING.decelerate} forwards;
      `;
        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", "18");
        line2.setAttribute("y1", "6");
        line2.setAttribute("x2", "6");
        line2.setAttribute("y2", "18");
        line2.style.cssText = `
        stroke-dasharray: 17;
        stroke-dashoffset: 17;
        animation: atlas-x-draw 300ms ${EASING.decelerate} 100ms forwards;
      `;
        svg.appendChild(line1);
        svg.appendChild(line2);
        return svg;
      }
      return null;
    };
    const handleMouseEnter = () => {
      isHovered = true;
      applyHoverEffect();
    };
    const handleMouseLeave = () => {
      isHovered = false;
      removeHoverEffect();
      if (isPressed) {
        pressUp();
      }
    };
    const handleMouseDown = (e) => {
      pressDown();
      createRipple(e);
    };
    const handleMouseUp = () => {
      pressUp();
    };
    const handleTouchStart = (e) => {
      pressDown();
      createRipple(e);
    };
    const handleTouchEnd = () => {
      pressUp();
    };
    const handleClick = () => {
      if (isDisabled || isLoading) return;
      onPress?.();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pressDown();
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        pressUp();
        if (!isDisabled && !isLoading) {
          onPress?.();
          triggerHaptic();
        }
      }
    };
    cleanupListeners.push(
      addListener(element, "mouseenter", handleMouseEnter),
      addListener(element, "mouseleave", handleMouseLeave),
      addListener(element, "mousedown", handleMouseDown),
      addListener(element, "mouseup", handleMouseUp),
      addListener(element, "touchstart", handleTouchStart, {
        passive: true
      }),
      addListener(element, "touchend", handleTouchEnd),
      addListener(element, "click", handleClick),
      addListener(element, "keydown", handleKeyDown),
      addListener(element, "keyup", handleKeyUp)
    );
    const setLoading = (loading) => {
      if (isLoading === loading) return;
      isLoading = loading;
      if (stateTimeout) {
        clearTimeout(stateTimeout);
        stateTimeout = null;
      }
      if (loading) {
        setVisualState("loading");
        originalContent = element.innerHTML;
        element.style.transition = `opacity ${ANIMATION_DURATION.fast}ms ${EASING.standard}`;
        element.style.opacity = "0.5";
        setTimeout(() => {
          stateElement = createStateIndicator("spinner");
          if (stateElement) {
            element.innerHTML = "";
            element.appendChild(stateElement);
          }
          element.style.opacity = "1";
        }, ANIMATION_DURATION.fast / 2);
        element.setAttribute("aria-busy", "true");
        element.style.pointerEvents = "none";
      } else {
        element.style.opacity = "0.5";
        setTimeout(() => {
          element.innerHTML = originalContent;
          element.style.opacity = "1";
          stateElement = null;
        }, ANIMATION_DURATION.fast / 2);
        element.removeAttribute("aria-busy");
        element.style.pointerEvents = "";
        setVisualState("idle");
      }
      onLoadingChange?.(loading);
    };
    const setSuccess = (message) => {
      if (stateTimeout) {
        clearTimeout(stateTimeout);
      }
      setVisualState("success");
      isLoading = false;
      if (!originalContent) {
        originalContent = element.innerHTML;
      }
      triggerHaptic([10, 50, 10]);
      element.style.opacity = "0.5";
      setTimeout(() => {
        stateElement = createStateIndicator("success");
        if (stateElement) {
          element.innerHTML = "";
          element.appendChild(stateElement);
        }
        element.style.opacity = "1";
        if (element.animate) {
          element.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
            {
              duration: 300,
              easing: EASING.bounce
            }
          );
        }
      }, ANIMATION_DURATION.fast / 2);
      element.removeAttribute("aria-busy");
      element.style.pointerEvents = "";
      if (message) {
        announce(message, "polite");
      }
      stateTimeout = setTimeout(() => {
        element.style.opacity = "0.5";
        setTimeout(() => {
          element.innerHTML = originalContent;
          element.style.opacity = "1";
          stateElement = null;
          originalContent = "";
          setVisualState("idle");
        }, ANIMATION_DURATION.fast / 2);
      }, successDuration);
    };
    const setError = (message) => {
      if (stateTimeout) {
        clearTimeout(stateTimeout);
      }
      setVisualState("error");
      isLoading = false;
      if (!originalContent) {
        originalContent = element.innerHTML;
      }
      triggerHaptic([50, 100, 50]);
      element.style.opacity = "0.5";
      setTimeout(() => {
        stateElement = createStateIndicator("error");
        if (stateElement) {
          element.innerHTML = "";
          element.appendChild(stateElement);
        }
        element.style.opacity = "1";
        if (element.animate) {
          element.animate(
            [
              { transform: "translateX(0)" },
              { transform: "translateX(-4px)" },
              { transform: "translateX(4px)" },
              { transform: "translateX(-4px)" },
              { transform: "translateX(4px)" },
              { transform: "translateX(0)" }
            ],
            {
              duration: 400,
              easing: "ease-in-out"
            }
          );
        }
      }, ANIMATION_DURATION.fast / 2);
      element.removeAttribute("aria-busy");
      element.style.pointerEvents = "";
      if (message) {
        announce(message, "assertive");
      }
      stateTimeout = setTimeout(() => {
        element.style.opacity = "0.5";
        setTimeout(() => {
          element.innerHTML = originalContent;
          element.style.opacity = "1";
          stateElement = null;
          originalContent = "";
          setVisualState("idle");
        }, ANIMATION_DURATION.fast / 2);
      }, successDuration);
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      if (disabled) {
        removeHoverEffect();
        element.setAttribute("aria-disabled", "true");
        element.style.opacity = "0.5";
        element.style.cursor = "not-allowed";
      } else {
        element.removeAttribute("aria-disabled");
        element.style.opacity = "";
        element.style.cursor = "";
      }
    };
    const triggerPress = () => {
      if (isDisabled || isLoading) return;
      pressDown();
      triggerHaptic();
      setTimeout(() => {
        pressUp();
        onPress?.();
      }, pressDuration);
    };
    const destroy = () => {
      if (stateTimeout) {
        clearTimeout(stateTimeout);
      }
      if (breathingAnimation) {
        breathingAnimation.cancel();
      }
      cleanupListeners.forEach((cleanup2) => cleanup2());
      cleanupListeners = [];
      element.style.transition = originalTransition;
      element.style.transform = originalTransform;
      element.style.filter = originalFilter;
      element.style.boxShadow = originalBoxShadow;
      if (originalContent) {
        element.innerHTML = originalContent;
        element.removeAttribute("aria-busy");
      }
    };
    return {
      get isLoading() {
        return isLoading;
      },
      get isDisabled() {
        return isDisabled;
      },
      get visualState() {
        return visualState;
      },
      setLoading,
      setDisabled,
      setSuccess,
      setError,
      triggerPress,
      destroy
    };
  }
  function createNoopButtonState() {
    return {
      get isLoading() {
        return false;
      },
      get isDisabled() {
        return false;
      },
      get visualState() {
        return "idle";
      },
      setLoading: () => {
      },
      setDisabled: () => {
      },
      setSuccess: () => {
      },
      setError: () => {
      },
      triggerPress: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-YIJTCXVH.js
  function createModal(element, options = {}) {
    if (!isBrowser()) {
      return createNoopModalState(element);
    }
    const {
      backdrop = true,
      closeOnBackdrop = true,
      closeOnEscape = true,
      trapFocus = true,
      animation = "normal",
      backdropBlur = true,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      onOpen,
      onClose
    } = options;
    const duration = ANIMATION_DURATION[animation];
    const modalId = generateId("modal");
    let isOpen = false;
    let backdropElement = null;
    let focusTrap = null;
    let unlockScroll = null;
    let cleanupListeners = [];
    const ariaAttrs = getModalAriaAttributes({
      labelledBy: ariaLabelledBy,
      describedBy: ariaDescribedBy
    });
    element.id = element.id || modalId;
    for (const [key, value] of Object.entries(ariaAttrs)) {
      element.setAttribute(key, value);
    }
    if (ariaLabel) {
      element.setAttribute("aria-label", ariaLabel);
    }
    element.setAttribute("aria-hidden", "true");
    element.style.display = "none";
    if (trapFocus) {
      focusTrap = createFocusTrap({
        container: element,
        initialFocus: "first",
        returnFocus: "previous",
        onEscape: closeOnEscape ? () => close() : void 0
      });
    }
    const createBackdropElement = () => {
      if (!backdrop) return null;
      return createElement("div", {
        className: "atlas-modal-backdrop",
        attributes: {
          "data-atlas-modal-backdrop": "",
          "aria-hidden": "true"
        },
        styles: {
          position: "fixed",
          inset: "0",
          zIndex: String(Z_INDEX.modal - 1),
          backgroundColor: "rgba(0, 0, 0, 0)",
          backdropFilter: backdropBlur ? "blur(0px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: `background-color ${duration}ms ${EASING.standard}, backdrop-filter ${duration}ms ${EASING.standard}`
        }
      });
    };
    const animateIn = () => {
      if (!backdropElement) return;
      requestAnimationFrame(() => {
        if (backdropElement) {
          backdropElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
          if (backdropBlur) {
            backdropElement.style.backdropFilter = "blur(4px)";
          }
        }
        element.style.opacity = "1";
        element.style.transform = "scale(1)";
      });
    };
    const animateOut = () => {
      return new Promise((resolve) => {
        if (backdropElement) {
          backdropElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
          if (backdropBlur) {
            backdropElement.style.backdropFilter = "blur(0px)";
          }
        }
        element.style.opacity = "0";
        element.style.transform = "scale(0.95)";
        setTimeout(resolve, duration);
      });
    };
    const handleBackdropClick = (e) => {
      if (closeOnBackdrop && e.target === backdropElement) {
        close();
      }
    };
    const handleEscapeKey = (e) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };
    const open = () => {
      if (isOpen) return;
      isOpen = true;
      unlockScroll = lockScroll();
      if (backdrop) {
        backdropElement = createBackdropElement();
        if (backdropElement) {
          document.body.appendChild(backdropElement);
          if (closeOnBackdrop) {
            cleanupListeners.push(
              addListener(
                backdropElement,
                "click",
                handleBackdropClick
              )
            );
          }
        }
      }
      element.style.display = "";
      element.style.position = "fixed";
      element.style.zIndex = String(Z_INDEX.modal);
      element.style.opacity = "0";
      element.style.transform = "scale(0.95)";
      element.style.transition = `opacity ${duration}ms ${EASING.decelerate}, transform ${duration}ms ${EASING.spring}`;
      element.setAttribute("aria-hidden", "false");
      if (closeOnEscape && !trapFocus) {
        cleanupListeners.push(
          addListener(
            document,
            "keydown",
            handleEscapeKey
          )
        );
      }
      animateIn();
      focusTrap?.activate();
      announce("Dialog opened");
      onOpen?.();
    };
    const close = async () => {
      if (!isOpen) return;
      isOpen = false;
      focusTrap?.deactivate();
      await animateOut();
      element.style.display = "none";
      element.setAttribute("aria-hidden", "true");
      if (backdropElement) {
        backdropElement.remove();
        backdropElement = null;
      }
      cleanupListeners.forEach((cleanup2) => cleanup2());
      cleanupListeners = [];
      unlockScroll?.();
      unlockScroll = null;
      announce("Dialog closed");
      onClose?.();
    };
    const toggle = () => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    };
    const update = () => {
      focusTrap?.updateElements();
    };
    const destroy = () => {
      if (isOpen) {
        focusTrap?.deactivate();
        element.style.display = "none";
        element.setAttribute("aria-hidden", "true");
        backdropElement?.remove();
        cleanupListeners.forEach((cleanup2) => cleanup2());
        unlockScroll?.();
      }
      element.removeAttribute("aria-modal");
      element.removeAttribute("aria-hidden");
    };
    return {
      get isOpen() {
        return isOpen;
      },
      get element() {
        return element;
      },
      open,
      close,
      toggle,
      update,
      destroy
    };
  }
  function createNoopModalState(element) {
    return {
      get isOpen() {
        return false;
      },
      get element() {
        return element;
      },
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      update: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-ZMDYGJAY.js
  var TRANSFORM_ORIGINS = {
    top: "bottom center",
    bottom: "top center",
    left: "right center",
    right: "left center"
  };
  function createDropdown(trigger2, menu, options = {}) {
    if (!isBrowser()) {
      return createNoopDropdownState(trigger2, menu, options.placement || "bottom");
    }
    const {
      placement = "bottom",
      closeOnClickOutside = true,
      closeOnSelect = true,
      animation = "fast",
      offset = 4,
      onOpen,
      onClose,
      onSelect
    } = options;
    const duration = ANIMATION_DURATION[animation];
    const triggerId = trigger2.id || generateId("dropdown-trigger");
    const menuId = menu.id || generateId("dropdown-menu");
    let isOpen = false;
    let focusedIndex = -1;
    let menuItems = [];
    let cleanupListeners = [];
    trigger2.id = triggerId;
    menu.id = menuId;
    const updateTriggerAria = () => {
      const attrs = getDropdownTriggerAttributes({ isOpen, menuId });
      for (const [key, value] of Object.entries(attrs)) {
        trigger2.setAttribute(key, value);
      }
    };
    const menuAttrs = getDropdownMenuAttributes({
      id: menuId,
      labelledBy: triggerId
    });
    for (const [key, value] of Object.entries(menuAttrs)) {
      menu.setAttribute(key, value);
    }
    updateTriggerAria();
    menu.style.position = "absolute";
    menu.style.zIndex = String(Z_INDEX.dropdown);
    menu.style.opacity = "0";
    menu.style.transform = "scale(0.95)";
    menu.style.transformOrigin = TRANSFORM_ORIGINS[placement];
    menu.style.visibility = "hidden";
    menu.style.pointerEvents = "none";
    const getMenuItems = () => {
      return Array.from(
        menu.querySelectorAll('[role="menuitem"], [data-dropdown-item]')
      ).filter(
        (item) => !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true"
      );
    };
    const updateMenuItems = () => {
      menuItems = getMenuItems();
      menuItems.forEach((item) => {
        const attrs = getMenuItemAttributes({ disabled: false });
        for (const [key, value] of Object.entries(attrs)) {
          if (!item.hasAttribute(key)) {
            item.setAttribute(key, value);
          }
        }
      });
    };
    const positionMenu = () => {
      const triggerRect = trigger2.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      let top = 0;
      let left = 0;
      switch (placement) {
        case "bottom":
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
          break;
        case "top":
          top = triggerRect.top - menuRect.height - offset;
          left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
          break;
        case "left":
          top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
          left = triggerRect.left - menuRect.width - offset;
          break;
        case "right":
          top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
          left = triggerRect.right + offset;
          break;
      }
      const padding = 8;
      left = Math.max(padding, Math.min(left, window.innerWidth - menuRect.width - padding));
      top = Math.max(padding, Math.min(top, window.innerHeight - menuRect.height - padding));
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
    };
    const focusItem = (index) => {
      if (menuItems.length === 0) return;
      if (index < 0) index = menuItems.length - 1;
      if (index >= menuItems.length) index = 0;
      menuItems.forEach((item2) => item2.classList.remove("atlas-dropdown-focused"));
      focusedIndex = index;
      const item = menuItems[focusedIndex];
      item.classList.add("atlas-dropdown-focused");
      item.focus();
    };
    const selectItem = (item) => {
      const index = menuItems.indexOf(item);
      onSelect?.(item, index);
      if (closeOnSelect) {
        close();
      }
    };
    const handleTriggerClick = () => {
      toggle();
    };
    const handleTriggerKeyDown = (e) => {
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            open();
            setTimeout(() => focusItem(0), 50);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            open();
            setTimeout(() => focusItem(menuItems.length - 1), 50);
          }
          break;
      }
    };
    const handleMenuKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusItem(focusedIndex + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusItem(focusedIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          focusItem(0);
          break;
        case "End":
          e.preventDefault();
          focusItem(menuItems.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && menuItems[focusedIndex]) {
            selectItem(menuItems[focusedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          trigger2.focus();
          break;
        case "Tab":
          close();
          break;
      }
    };
    const handleItemClick = (e) => {
      const item = e.target.closest(
        '[role="menuitem"], [data-dropdown-item]'
      );
      if (item && menuItems.includes(item)) {
        selectItem(item);
      }
    };
    const handleClickOutside = (e) => {
      if (closeOnClickOutside && !trigger2.contains(e.target) && !menu.contains(e.target)) {
        close();
      }
    };
    const animateIn = () => {
      menu.style.visibility = "visible";
      menu.style.pointerEvents = "auto";
      menu.style.transition = `opacity ${duration}ms ${EASING.decelerate}, transform ${duration}ms ${EASING.spring}`;
      requestAnimationFrame(() => {
        menu.style.opacity = "1";
        menu.style.transform = "scale(1)";
      });
    };
    const animateOut = () => {
      return new Promise((resolve) => {
        menu.style.transition = `opacity ${duration}ms ${EASING.accelerate}, transform ${duration}ms ${EASING.accelerate}`;
        menu.style.opacity = "0";
        menu.style.transform = "scale(0.95)";
        setTimeout(() => {
          menu.style.visibility = "hidden";
          menu.style.pointerEvents = "none";
          resolve();
        }, duration);
      });
    };
    const open = () => {
      if (isOpen) return;
      isOpen = true;
      updateMenuItems();
      focusedIndex = -1;
      updateTriggerAria();
      positionMenu();
      cleanupListeners.push(
        addListener(document, "click", handleClickOutside),
        addListener(menu, "keydown", handleMenuKeyDown),
        addListener(menu, "click", handleItemClick)
      );
      animateIn();
      onOpen?.();
    };
    const close = async () => {
      if (!isOpen) return;
      isOpen = false;
      updateTriggerAria();
      menuItems.forEach((item) => item.classList.remove("atlas-dropdown-focused"));
      focusedIndex = -1;
      cleanupListeners.forEach((cleanup2) => cleanup2());
      cleanupListeners = [];
      await animateOut();
      onClose?.();
    };
    const toggle = () => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    };
    const destroy = () => {
      if (isOpen) {
        menu.style.visibility = "hidden";
        menu.style.pointerEvents = "none";
        cleanupListeners.forEach((cleanup2) => cleanup2());
      }
      trigger2.removeAttribute("aria-haspopup");
      trigger2.removeAttribute("aria-expanded");
      trigger2.removeAttribute("aria-controls");
    };
    const triggerClickCleanup = addListener(
      trigger2,
      "click",
      handleTriggerClick
    );
    const triggerKeydownCleanup = addListener(
      trigger2,
      "keydown",
      handleTriggerKeyDown
    );
    const originalDestroy = destroy;
    const destroyWithTrigger = () => {
      triggerClickCleanup();
      triggerKeydownCleanup();
      originalDestroy();
    };
    return {
      get isOpen() {
        return isOpen;
      },
      get trigger() {
        return trigger2;
      },
      get menu() {
        return menu;
      },
      get placement() {
        return placement;
      },
      get focusedIndex() {
        return focusedIndex;
      },
      open,
      close,
      toggle,
      focusItem,
      getItems: () => [...menuItems],
      destroy: destroyWithTrigger
    };
  }
  function createNoopDropdownState(trigger2, menu, placement) {
    return {
      get isOpen() {
        return false;
      },
      get trigger() {
        return trigger2;
      },
      get menu() {
        return menu;
      },
      get placement() {
        return placement;
      },
      get focusedIndex() {
        return -1;
      },
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      focusItem: () => {
      },
      getItems: () => [],
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-LX3S7IFA.js
  function createTabs(tabIds, options = {}) {
    if (!tabIds || tabIds.length === 0) {
      throw new Error("[Atlas Tabs] tabIds must be a non-empty array");
    }
    const { defaultTab = tabIds[0], onChange, orientation = "horizontal" } = options;
    if (!tabIds.includes(defaultTab)) {
      throw new Error(`[Atlas Tabs] defaultTab "${defaultTab}" is not in tabIds`);
    }
    let activeTab = defaultTab;
    const subscribers = /* @__PURE__ */ new Set();
    const notifySubscribers = () => {
      subscribers.forEach((callback) => callback(activeTab));
    };
    const setActiveTab = (tabId) => {
      if (!tabIds.includes(tabId)) {
        console.warn(`[Atlas Tabs] Invalid tab ID: "${tabId}"`);
        return;
      }
      if (tabId !== activeTab) {
        activeTab = tabId;
        onChange?.(tabId);
        notifySubscribers();
      }
    };
    const isActive = (tabId) => tabId === activeTab;
    const getTabProps = (tabId) => ({
      "aria-selected": isActive(tabId),
      "aria-controls": `panel-${tabId}`,
      tabIndex: isActive(tabId) ? 0 : -1,
      role: "tab",
      id: `tab-${tabId}`
    });
    const getPanelProps = (tabId) => ({
      hidden: !isActive(tabId),
      "aria-labelledby": `tab-${tabId}`,
      role: "tabpanel",
      id: `panel-${tabId}`
    });
    const getTabListProps = () => ({
      role: "tablist",
      "aria-orientation": orientation
    });
    const subscribe = (callback) => {
      subscribers.add(callback);
      callback(activeTab);
      return () => {
        subscribers.delete(callback);
      };
    };
    const destroy = () => {
      subscribers.clear();
    };
    return {
      get activeTab() {
        return activeTab;
      },
      get orientation() {
        return orientation;
      },
      setActiveTab,
      isActive,
      getTabProps,
      getPanelProps,
      getTabListProps,
      subscribe,
      destroy
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-7YF5Q2EM.js
  function createAccordion(panelIds, options = {}) {
    if (!panelIds || panelIds.length === 0) {
      throw new Error("[Atlas Accordion] panelIds must be a non-empty array");
    }
    const { collapsible = true, multiple = false, defaultOpen = [], onChange } = options;
    const invalidPanels = defaultOpen.filter((id) => !panelIds.includes(id));
    if (invalidPanels.length > 0) {
      throw new Error(
        `[Atlas Accordion] defaultOpen contains invalid panel IDs: ${invalidPanels.join(", ")}`
      );
    }
    const openPanels = new Set(defaultOpen);
    const subscribers = /* @__PURE__ */ new Set();
    const notifySubscribers = () => {
      onChange?.(new Set(openPanels));
      subscribers.forEach((callback) => callback(new Set(openPanels)));
    };
    const toggle = (panelId) => {
      if (!panelIds.includes(panelId)) {
        console.warn(`[Atlas Accordion] Invalid panel ID: "${panelId}"`);
        return;
      }
      const wasOpen = openPanels.has(panelId);
      if (wasOpen) {
        if (collapsible || openPanels.size > 1) {
          openPanels.delete(panelId);
          notifySubscribers();
        }
      } else {
        if (!multiple) {
          openPanels.clear();
        }
        openPanels.add(panelId);
        notifySubscribers();
      }
    };
    const open = (panelId) => {
      if (!panelIds.includes(panelId)) {
        console.warn(`[Atlas Accordion] Invalid panel ID: "${panelId}"`);
        return;
      }
      const wasAlreadyOpen = openPanels.has(panelId);
      if (!multiple) {
        openPanels.clear();
      }
      openPanels.add(panelId);
      if (!wasAlreadyOpen || !multiple) {
        notifySubscribers();
      }
    };
    const close = (panelId) => {
      if (!panelIds.includes(panelId)) {
        console.warn(`[Atlas Accordion] Invalid panel ID: "${panelId}"`);
        return;
      }
      if (openPanels.has(panelId) && (collapsible || openPanels.size > 1)) {
        openPanels.delete(panelId);
        notifySubscribers();
      }
    };
    const isOpen = (panelId) => openPanels.has(panelId);
    const getButtonProps = (panelId) => ({
      "aria-expanded": isOpen(panelId),
      "aria-controls": `panel-${panelId}`,
      id: `button-${panelId}`,
      role: "button",
      tabIndex: 0
    });
    const getPanelProps = (panelId) => ({
      id: `panel-${panelId}`,
      "aria-labelledby": `button-${panelId}`,
      role: "region",
      hidden: !isOpen(panelId)
    });
    const subscribe = (callback) => {
      subscribers.add(callback);
      callback(new Set(openPanels));
      return () => {
        subscribers.delete(callback);
      };
    };
    const getOpenPanels = () => new Set(openPanels);
    const destroy = () => {
      subscribers.clear();
      openPanels.clear();
    };
    return {
      getOpenPanels,
      toggle,
      open,
      close,
      isOpen,
      getButtonProps,
      getPanelProps,
      subscribe,
      destroy
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-MSX65MAU.js
  function createTooltip(trigger2, options = {}) {
    const {
      delay = 500,
      placement = "top",
      trigger: triggerType = "hover",
      onShow,
      onHide
    } = options;
    let isVisible = false;
    let timeoutId;
    const show = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        isVisible = true;
        trigger2.setAttribute("data-tooltip-visible", "true");
        trigger2.setAttribute("data-tooltip-placement", placement);
        onShow?.();
      }, delay);
    };
    const hide = () => {
      clearTimeout(timeoutId);
      isVisible = false;
      trigger2.removeAttribute("data-tooltip-visible");
      onHide?.();
    };
    const toggle = () => isVisible ? hide() : show();
    const handleMouseEnter = () => show();
    const handleMouseLeave = () => hide();
    const handleFocus = () => show();
    const handleBlur = () => hide();
    const handleClick = () => toggle();
    if (triggerType === "hover") {
      trigger2.addEventListener("mouseenter", handleMouseEnter);
      trigger2.addEventListener("mouseleave", handleMouseLeave);
    } else if (triggerType === "focus") {
      trigger2.addEventListener("focus", handleFocus);
      trigger2.addEventListener("blur", handleBlur);
    } else if (triggerType === "click") {
      trigger2.addEventListener("click", handleClick);
    }
    const destroy = () => {
      clearTimeout(timeoutId);
      trigger2.removeEventListener("mouseenter", handleMouseEnter);
      trigger2.removeEventListener("mouseleave", handleMouseLeave);
      trigger2.removeEventListener("focus", handleFocus);
      trigger2.removeEventListener("blur", handleBlur);
      trigger2.removeEventListener("click", handleClick);
      trigger2.removeAttribute("data-tooltip-visible");
      trigger2.removeAttribute("data-tooltip-placement");
    };
    return {
      get isVisible() {
        return isVisible;
      },
      get placement() {
        return placement;
      },
      show,
      hide,
      toggle,
      destroy
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-JTEL6HS5.js
  var POSITION_STYLES = {
    "top-left": { top: "16px", left: "16px", alignItems: "flex-start" },
    "top-center": {
      top: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      alignItems: "center"
    },
    "top-right": { top: "16px", right: "16px", alignItems: "flex-end" },
    "bottom-left": { bottom: "16px", left: "16px", alignItems: "flex-start" },
    "bottom-center": {
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      alignItems: "center"
    },
    "bottom-right": { bottom: "16px", right: "16px", alignItems: "flex-end" }
  };
  var ICONS = {
    success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
    <path class="atlas-toast-checkmark" d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L18 17H2L10 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
    <path d="M10 8v4M10 14v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M10 9v5M10 6v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
    default: ""
  };
  var TYPE_COLORS = {
    success: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
    error: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
    warning: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
    info: { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
    default: { bg: "#f9fafb", border: "#6b7280", text: "#1f2937" }
  };
  var toastCounter = 0;
  function createToastManager(managerOptions = {}) {
    if (!isBrowser()) {
      return createNoopToastManager();
    }
    const {
      position = "bottom-right",
      maxVisible = 5,
      gap = 12,
      container = document.body
    } = managerOptions;
    const toasts = /* @__PURE__ */ new Map();
    let containerElement = null;
    const createContainer = () => {
      if (containerElement) return containerElement;
      containerElement = createElement("div", {
        className: "atlas-toast-container",
        attributes: {
          "data-atlas-toast-container": "",
          "aria-live": "polite",
          "aria-atomic": "true"
        },
        styles: {
          position: "fixed",
          zIndex: String(Z_INDEX.toast),
          display: "flex",
          flexDirection: position.startsWith("top") ? "column" : "column-reverse",
          gap: `${gap}px`,
          pointerEvents: "none",
          ...POSITION_STYLES[position]
        }
      });
      if (containerElement) {
        container.appendChild(containerElement);
      }
      return containerElement;
    };
    const show = (message, options = {}) => {
      const {
        type = "default",
        duration = 4e3,
        dismissible = true,
        action,
        pauseOnHover = true,
        showProgress = duration > 0,
        onDismiss
      } = options;
      const id = `toast-${++toastCounter}`;
      const colors = TYPE_COLORS[type];
      const icon = ICONS[type];
      const toastContainer = createContainer();
      if (!toastContainer) {
        return { id, message, type, dismiss: () => {
        } };
      }
      while (toasts.size >= maxVisible) {
        const firstId = toasts.keys().next().value;
        if (firstId) dismiss(firstId);
      }
      const toast = createElement("div", {
        className: `atlas-toast atlas-toast-${type}`,
        attributes: {
          "data-atlas-toast": id,
          role: "alert"
        },
        styles: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          pointerEvents: "auto",
          opacity: "0",
          transform: position.startsWith("top") ? "translateY(-100%)" : "translateY(100%)",
          transition: `opacity ${ANIMATION_DURATION.normal}ms ${EASING.decelerate}, transform ${ANIMATION_DURATION.normal}ms ${EASING.spring}`,
          maxWidth: "400px",
          position: "relative",
          overflow: "hidden"
        }
      });
      if (!toast) {
        return { id, message, type, dismiss: () => {
        } };
      }
      let html = "";
      if (icon) {
        html += `<span class="atlas-toast-icon" style="flex-shrink: 0; color: ${colors.border};">${icon}</span>`;
      }
      html += `<span class="atlas-toast-message" style="flex: 1;">${message}</span>`;
      if (action) {
        html += `<button class="atlas-toast-action" style="
        background: transparent;
        border: none;
        color: ${colors.border};
        font-weight: 600;
        cursor: pointer;
        padding: 4px 8px;
        margin: -4px;
        border-radius: 4px;
        transition: background ${ANIMATION_DURATION.fast}ms;
      " data-action>${action.label}</button>`;
      }
      if (dismissible) {
        html += `<button class="atlas-toast-dismiss" aria-label="Dismiss" style="
        background: transparent;
        border: none;
        color: currentColor;
        opacity: 0.5;
        cursor: pointer;
        padding: 4px;
        margin: -4px;
        display: flex;
        transition: opacity ${ANIMATION_DURATION.fast}ms;
      " data-dismiss>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>`;
      }
      if (showProgress && duration > 0) {
        html += `<div class="atlas-toast-progress" style="
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: ${colors.border};
        opacity: 0.3;
        width: 100%;
        transform-origin: left;
        animation: atlas-toast-progress ${duration}ms linear forwards;
      "></div>`;
      }
      toast.innerHTML = html;
      let timeoutId = null;
      let remainingTime = duration;
      let startTime = Date.now();
      const cleanupListeners = [];
      const startTimer = () => {
        if (duration <= 0) return;
        startTime = Date.now();
        timeoutId = setTimeout(() => dismiss(id), remainingTime);
      };
      const pauseTimer = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
          remainingTime -= Date.now() - startTime;
        }
        const progress = toast.querySelector(".atlas-toast-progress");
        if (progress) {
          progress.style.animationPlayState = "paused";
        }
      };
      const resumeTimer = () => {
        if (duration > 0 && remainingTime > 0) {
          startTimer();
          const progress = toast.querySelector(".atlas-toast-progress");
          if (progress) {
            progress.style.animationPlayState = "running";
          }
        }
      };
      if (pauseOnHover) {
        cleanupListeners.push(
          addListener(
            toast,
            "mouseenter",
            pauseTimer
          ),
          addListener(
            toast,
            "mouseleave",
            resumeTimer
          )
        );
      }
      const dismissBtn = toast.querySelector("[data-dismiss]");
      if (dismissBtn) {
        cleanupListeners.push(
          addListener(
            dismissBtn,
            "click",
            () => dismiss(id)
          )
        );
      }
      const actionBtn = toast.querySelector("[data-action]");
      if (actionBtn && action) {
        cleanupListeners.push(
          addListener(actionBtn, "click", (() => {
            action.onClick();
            dismiss(id);
          }))
        );
      }
      const cleanup2 = () => {
        if (timeoutId) clearTimeout(timeoutId);
        cleanupListeners.forEach((fn) => fn());
        onDismiss?.();
      };
      toasts.set(id, { element: toast, cleanup: cleanup2 });
      toastContainer.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      });
      startTimer();
      announce(message, type === "error" ? "assertive" : "polite");
      return {
        id,
        message,
        type,
        dismiss: () => dismiss(id)
      };
    };
    const dismiss = (id) => {
      const toast = toasts.get(id);
      if (!toast) return;
      const { element, cleanup: cleanup2 } = toast;
      cleanup2();
      element.style.opacity = "0";
      element.style.transform = position.startsWith("top") ? "translateY(-100%)" : "translateY(100%)";
      setTimeout(() => {
        element.remove();
        toasts.delete(id);
        if (toasts.size === 0 && containerElement) {
          containerElement.remove();
          containerElement = null;
        }
      }, ANIMATION_DURATION.normal);
    };
    const dismissAll = () => {
      for (const id of toasts.keys()) {
        dismiss(id);
      }
    };
    const getToasts = () => {
      return Array.from(toasts.keys()).map((id) => ({
        id,
        message: "",
        // Could store this if needed
        type: "default",
        dismiss: () => dismiss(id)
      }));
    };
    const destroy = () => {
      dismissAll();
      if (containerElement) {
        containerElement.remove();
        containerElement = null;
      }
    };
    const success = (message, options) => show(message, { ...options, type: "success" });
    const error2 = (message, options) => show(message, { ...options, type: "error" });
    const warning = (message, options) => show(message, { ...options, type: "warning" });
    const info = (message, options) => show(message, { ...options, type: "info" });
    return {
      show,
      success,
      error: error2,
      warning,
      info,
      dismiss,
      dismissAll,
      getToasts,
      destroy
    };
  }
  function createNoopToastManager() {
    const noopItem = {
      id: "",
      message: "",
      type: "default",
      dismiss: () => {
      }
    };
    return {
      show: () => noopItem,
      success: () => noopItem,
      error: () => noopItem,
      warning: () => noopItem,
      info: () => noopItem,
      dismiss: () => {
      },
      dismissAll: () => {
      },
      getToasts: () => [],
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/chunk-W77B4YAA.js
  var TRANSFORMS = {
    left: { open: "translateX(0)", closed: "translateX(-100%)" },
    right: { open: "translateX(0)", closed: "translateX(100%)" },
    top: { open: "translateY(0)", closed: "translateY(-100%)" },
    bottom: { open: "translateY(0)", closed: "translateY(100%)" }
  };
  var POSITIONS = {
    left: { top: "0", left: "0", bottom: "0", width: "auto", height: "100%" },
    right: { top: "0", right: "0", bottom: "0", width: "auto", height: "100%" },
    top: { top: "0", left: "0", right: "0", width: "100%", height: "auto" },
    bottom: { bottom: "0", left: "0", right: "0", width: "100%", height: "auto" }
  };
  function createDrawer(element, options = {}) {
    if (!isBrowser()) {
      return createNoopDrawerState(element, options.side || "right");
    }
    const {
      side = "right",
      backdrop = true,
      closeOnBackdrop = true,
      closeOnEscape = true,
      trapFocus = true,
      animation = "normal",
      backdropBlur = true,
      ariaLabel,
      ariaLabelledBy,
      onOpen,
      onClose
    } = options;
    const duration = ANIMATION_DURATION[animation];
    const drawerId = generateId("drawer");
    const transforms = TRANSFORMS[side];
    const positions = POSITIONS[side];
    let isOpen = false;
    let backdropElement = null;
    let focusTrap = null;
    let unlockScroll = null;
    let cleanupListeners = [];
    const ariaAttrs = getDrawerAriaAttributes({
      labelledBy: ariaLabelledBy,
      side
    });
    element.id = element.id || drawerId;
    for (const [key, value] of Object.entries(ariaAttrs)) {
      element.setAttribute(key, value);
    }
    if (ariaLabel) {
      element.setAttribute("aria-label", ariaLabel);
    }
    element.setAttribute("aria-hidden", "true");
    element.style.position = "fixed";
    element.style.zIndex = String(Z_INDEX.drawer);
    element.style.transform = transforms.closed;
    element.style.visibility = "hidden";
    Object.assign(element.style, positions);
    if (trapFocus) {
      focusTrap = createFocusTrap({
        container: element,
        initialFocus: "first",
        returnFocus: "previous",
        onEscape: closeOnEscape ? () => close() : void 0
      });
    }
    const createBackdropElement = () => {
      if (!backdrop) return null;
      return createElement("div", {
        className: "atlas-drawer-backdrop",
        attributes: {
          "data-atlas-drawer-backdrop": "",
          "data-side": side,
          "aria-hidden": "true"
        },
        styles: {
          position: "fixed",
          inset: "0",
          zIndex: String(Z_INDEX.drawer - 1),
          backgroundColor: "rgba(0, 0, 0, 0)",
          backdropFilter: backdropBlur ? "blur(0px)" : "none",
          transition: `background-color ${duration}ms ${EASING.standard}, backdrop-filter ${duration}ms ${EASING.standard}`
        }
      });
    };
    const animateIn = () => {
      if (backdropElement) {
        requestAnimationFrame(() => {
          if (backdropElement) {
            backdropElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            if (backdropBlur) {
              backdropElement.style.backdropFilter = "blur(4px)";
            }
          }
        });
      }
      element.style.transition = `transform ${duration}ms ${EASING.spring}, visibility 0ms`;
      element.style.visibility = "visible";
      requestAnimationFrame(() => {
        element.style.transform = transforms.open;
      });
    };
    const animateOut = () => {
      return new Promise((resolve) => {
        if (backdropElement) {
          backdropElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
          if (backdropBlur) {
            backdropElement.style.backdropFilter = "blur(0px)";
          }
        }
        element.style.transition = `transform ${duration}ms ${EASING.accelerate}, visibility 0ms ${duration}ms`;
        element.style.transform = transforms.closed;
        setTimeout(() => {
          element.style.visibility = "hidden";
          resolve();
        }, duration);
      });
    };
    const handleBackdropClick = (e) => {
      if (closeOnBackdrop && e.target === backdropElement) {
        close();
      }
    };
    const handleEscapeKey = (e) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };
    const open = () => {
      if (isOpen) return;
      isOpen = true;
      unlockScroll = lockScroll();
      if (backdrop) {
        backdropElement = createBackdropElement();
        if (backdropElement) {
          document.body.appendChild(backdropElement);
          if (closeOnBackdrop) {
            cleanupListeners.push(
              addListener(
                backdropElement,
                "click",
                handleBackdropClick
              )
            );
          }
        }
      }
      element.setAttribute("aria-hidden", "false");
      if (closeOnEscape && !trapFocus) {
        cleanupListeners.push(
          addListener(
            document,
            "keydown",
            handleEscapeKey
          )
        );
      }
      animateIn();
      setTimeout(() => {
        focusTrap?.activate();
      }, 50);
      announce(`${side} drawer opened`);
      onOpen?.();
    };
    const close = async () => {
      if (!isOpen) return;
      isOpen = false;
      focusTrap?.deactivate();
      await animateOut();
      element.setAttribute("aria-hidden", "true");
      if (backdropElement) {
        backdropElement.remove();
        backdropElement = null;
      }
      cleanupListeners.forEach((cleanup2) => cleanup2());
      cleanupListeners = [];
      unlockScroll?.();
      unlockScroll = null;
      announce("Drawer closed");
      onClose?.();
    };
    const toggle = () => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    };
    const update = () => {
      focusTrap?.updateElements();
    };
    const destroy = () => {
      if (isOpen) {
        focusTrap?.deactivate();
        element.style.visibility = "hidden";
        element.style.transform = transforms.closed;
        element.setAttribute("aria-hidden", "true");
        backdropElement?.remove();
        cleanupListeners.forEach((cleanup2) => cleanup2());
        unlockScroll?.();
      }
      element.removeAttribute("aria-modal");
      element.removeAttribute("aria-hidden");
    };
    return {
      get isOpen() {
        return isOpen;
      },
      get element() {
        return element;
      },
      get side() {
        return side;
      },
      open,
      close,
      toggle,
      update,
      destroy
    };
  }
  function createNoopDrawerState(element, side) {
    return {
      get isOpen() {
        return false;
      },
      get element() {
        return element;
      },
      get side() {
        return side;
      },
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      update: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-components/dist/index.js
  var initialized = /* @__PURE__ */ new WeakSet();
  var cleanupMap = /* @__PURE__ */ new WeakMap();
  function parseBool(value) {
    return value !== null && value !== "false";
  }
  function initElement(element) {
    if (initialized.has(element)) return;
    const type = element.dataset.atlas;
    if (!type) return;
    let cleanup2;
    switch (type) {
      case "button":
        cleanup2 = initButton(element);
        break;
      case "tooltip":
        cleanup2 = initTooltip(element);
        break;
      case "card":
        cleanup2 = initCard(element);
        break;
      case "input":
        cleanup2 = initInput(element);
        break;
      case "grid":
        cleanup2 = initGrid(element);
        break;
    }
    if (cleanup2) {
      initialized.add(element);
      cleanupMap.set(element, cleanup2);
    }
  }
  function initButton(element) {
    const options = {
      ripple: parseBool(element.dataset.ripple ?? "true"),
      hover: element.dataset.hover || "breathing",
      haptic: parseBool(element.dataset.haptic ?? "true"),
      pressScale: element.dataset.pressScale ? parseFloat(element.dataset.pressScale) : void 0
    };
    const button = createButton(element, options);
    const observer22 = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-loading") {
          button.setLoading(parseBool(element.dataset.loading ?? null));
        }
        if (mutation.attributeName === "data-disabled" || mutation.attributeName === "disabled") {
          button.setDisabled(
            parseBool(element.dataset.disabled ?? null) || element.hasAttribute("disabled")
          );
        }
      }
    });
    observer22.observe(element, { attributes: true });
    return () => {
      observer22.disconnect();
      button.destroy();
    };
  }
  function initTooltip(element) {
    const options = {
      content: element.dataset.content || element.getAttribute("title") || "",
      placement: element.dataset.placement || "top",
      delay: element.dataset.delay ? parseInt(element.dataset.delay, 10) : 500,
      trigger: element.dataset.trigger || "hover"
    };
    if (element.hasAttribute("title")) {
      element.removeAttribute("title");
    }
    const tooltip = createTooltip(element, options);
    return () => tooltip.destroy();
  }
  function initCard(element) {
    const options = {
      hover: element.dataset.hover || "lift",
      tilt: parseBool(element.dataset.tilt ?? null),
      tiltMax: element.dataset.tiltMax ? parseFloat(element.dataset.tiltMax) : 10,
      shine: parseBool(element.dataset.shine ?? null),
      liftDistance: element.dataset.liftDistance ? parseFloat(element.dataset.liftDistance) : void 0,
      clickable: parseBool(element.dataset.clickable ?? "true")
    };
    const card = createCard(element, options);
    if (parseBool(element.dataset.animate ?? null)) {
      const delay = element.dataset.delay ? parseInt(element.dataset.delay, 10) : 0;
      card.animateIn(delay);
    }
    return () => card.destroy();
  }
  function initInput(element) {
    const input = element;
    const cleanups = [];
    const originalTransition = input.style.transition;
    const originalBoxShadow = input.style.boxShadow;
    const originalBorderColor = input.style.borderColor;
    input.style.transition = `
    box-shadow ${ANIMATION_DURATION.fast}ms ${EASING.standard},
    border-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
    transform ${ANIMATION_DURATION.fast}ms ${EASING.standard}
  `.replace(/\s+/g, " ").trim();
    if (parseBool(input.dataset.focusGlow ?? "true")) {
      const glowColor = input.dataset.glowColor || "rgba(59, 130, 246, 0.5)";
      const handleFocus = () => {
        input.style.boxShadow = `0 0 0 3px ${glowColor}`;
        input.style.borderColor = "rgba(59, 130, 246, 0.8)";
      };
      const handleBlur = () => {
        if (!input.dataset.error) {
          input.style.boxShadow = originalBoxShadow || "";
          input.style.borderColor = originalBorderColor || "";
        }
      };
      cleanups.push(addListener(input, "focus", handleFocus));
      cleanups.push(addListener(input, "blur", handleBlur));
    }
    const observer22 = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-error") {
          if (parseBool(input.dataset.error ?? null)) {
            input.style.borderColor = "rgba(239, 68, 68, 0.8)";
            input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.3)";
            if (input.animate) {
              input.animate(
                [
                  { transform: "translateX(0)" },
                  { transform: "translateX(-4px)" },
                  { transform: "translateX(4px)" },
                  { transform: "translateX(-4px)" },
                  { transform: "translateX(4px)" },
                  { transform: "translateX(0)" }
                ],
                {
                  duration: 400,
                  easing: "ease-in-out"
                }
              );
            }
          } else {
            input.style.borderColor = originalBorderColor || "";
            input.style.boxShadow = originalBoxShadow || "";
          }
        }
        if (mutation.attributeName === "data-success") {
          if (parseBool(input.dataset.success ?? null)) {
            input.style.borderColor = "rgba(34, 197, 94, 0.8)";
            input.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.3)";
            if (input.animate) {
              input.animate(
                [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
                {
                  duration: 200,
                  easing: EASING.bounce
                }
              );
            }
          }
        }
      }
    });
    observer22.observe(input, { attributes: true });
    return () => {
      observer22.disconnect();
      cleanups.forEach((fn) => fn());
      input.style.transition = originalTransition;
      input.style.boxShadow = originalBoxShadow;
      input.style.borderColor = originalBorderColor;
    };
  }
  function initGrid(element) {
    const staggerDelay = element.dataset.stagger ? parseInt(element.dataset.stagger, 10) : 50;
    const initialDelay = element.dataset.initialDelay ? parseInt(element.dataset.initialDelay, 10) : 0;
    const animateOnScroll = parseBool(element.dataset.animateOnScroll ?? null);
    const children = Array.from(element.children);
    children.forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(20px)";
      child.style.transition = `
      opacity ${ANIMATION_DURATION.normal}ms ${EASING.decelerate},
      transform ${ANIMATION_DURATION.normal}ms ${EASING.spring}
    `.replace(/\s+/g, " ").trim();
    });
    const animateChildren = () => {
      children.forEach((child, index) => {
        setTimeout(
          () => {
            child.style.opacity = "1";
            child.style.transform = "translateY(0)";
          },
          initialDelay + index * staggerDelay
        );
      });
    };
    let intersectionObserver = null;
    if (animateOnScroll) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateChildren();
              intersectionObserver?.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );
      intersectionObserver.observe(element);
    } else {
      requestAnimationFrame(() => {
        animateChildren();
      });
    }
    return () => {
      intersectionObserver?.disconnect();
      children.forEach((child) => {
        child.style.opacity = "";
        child.style.transform = "";
        child.style.transition = "";
      });
    };
  }
  function destroyElement(element) {
    const cleanup2 = cleanupMap.get(element);
    if (cleanup2) {
      cleanup2();
      cleanupMap.delete(element);
      initialized.delete(element);
    }
  }
  function initAll(root = document) {
    const elements = root.querySelectorAll("[data-atlas]");
    elements.forEach(initElement);
  }
  var observer2 = null;
  function startObserver() {
    if (!isBrowser() || observer2) return;
    observer2 = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.dataset.atlas) initElement(node);
            node.querySelectorAll("[data-atlas]").forEach(initElement);
          }
        }
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLElement) {
            if (initialized.has(node)) destroyElement(node);
            node.querySelectorAll("[data-atlas]").forEach(destroyElement);
          }
        }
      }
    });
    observer2.observe(document.body, { childList: true, subtree: true });
  }
  function atlasInit() {
    if (!isBrowser()) return;
    initAll();
    startObserver();
  }
  function atlasDestroy() {
    if (observer2) {
      observer2.disconnect();
      observer2 = null;
    }
    document.querySelectorAll("[data-atlas]").forEach(destroyElement);
  }
  if (isBrowser()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", atlasInit);
    } else {
      atlasInit();
    }
    document.addEventListener("astro:page-load", atlasInit);
  }
  var ATTRS9 = {
    IMAGE: "data-atlas-avatar-image",
    FALLBACK: "data-atlas-avatar-fallback",
    STATUS: "data-atlas-avatar-status"
  };
  var CLASSES9 = {
    ROOT: "atlas-avatar",
    IMAGE: "atlas-avatar-image",
    FALLBACK: "atlas-avatar-fallback",
    STATUS: "atlas-avatar-status",
    LOADING: "atlas-avatar--loading",
    ERROR: "atlas-avatar--error"
  };
  var SIZE_CLASSES = {
    xs: "atlas-avatar--xs",
    sm: "atlas-avatar--sm",
    default: "atlas-avatar--default",
    lg: "atlas-avatar--lg",
    xl: "atlas-avatar--xl"
  };
  var SHAPE_CLASSES = {
    circle: "atlas-avatar--circle",
    square: "atlas-avatar--square"
  };
  var STATUS_CLASSES = {
    online: "atlas-avatar-status--online",
    offline: "atlas-avatar-status--offline",
    busy: "atlas-avatar-status--busy",
    away: "atlas-avatar-status--away"
  };
  function createAvatar(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState9();
    }
    const {
      src: initialSrc,
      alt = "",
      fallback: initialFallback = "",
      size: size2 = "default",
      shape = "circle",
      status: initialStatus = null,
      color
    } = options;
    let currentSrc = initialSrc;
    let currentFallback = initialFallback;
    let currentSize = size2;
    let currentShape = shape;
    let currentStatus = initialStatus;
    let imageError = false;
    const id = generateId("avatar");
    let imageEl = null;
    let fallbackEl = null;
    let statusEl = null;
    function init() {
      element.classList.add(CLASSES9.ROOT);
      element.setAttribute("data-atlas-avatar", "");
      element.setAttribute("role", "img");
      element.setAttribute("aria-label", alt || currentFallback || "Avatar");
      element.id = id;
      applySizeClass();
      applyShapeClass();
      if (color) {
        element.style.setProperty("--atlas-avatar-color", color);
      }
      imageEl = document.createElement("img");
      imageEl.className = CLASSES9.IMAGE;
      imageEl.setAttribute(ATTRS9.IMAGE, "");
      imageEl.alt = alt;
      imageEl.addEventListener("load", handleImageLoad);
      imageEl.addEventListener("error", handleImageError);
      fallbackEl = document.createElement("span");
      fallbackEl.className = CLASSES9.FALLBACK;
      fallbackEl.setAttribute(ATTRS9.FALLBACK, "");
      fallbackEl.setAttribute("aria-hidden", "true");
      if (currentStatus) {
        createStatusElement();
      }
      element.appendChild(imageEl);
      element.appendChild(fallbackEl);
      if (currentSrc) {
        loadImage(currentSrc);
      } else {
        showFallback();
      }
    }
    function loadImage(src) {
      if (!imageEl) return;
      element.classList.add(CLASSES9.LOADING);
      element.classList.remove(CLASSES9.ERROR);
      imageError = false;
      imageEl.src = src;
    }
    function handleImageLoad() {
      imageError = false;
      element.classList.remove(CLASSES9.LOADING, CLASSES9.ERROR);
      if (imageEl) {
        imageEl.style.display = "";
      }
      if (fallbackEl) {
        fallbackEl.style.display = "none";
      }
      options.onLoad?.();
    }
    function handleImageError() {
      imageError = true;
      element.classList.remove(CLASSES9.LOADING);
      element.classList.add(CLASSES9.ERROR);
      showFallback();
      options.onError?.();
    }
    function showFallback() {
      if (imageEl) {
        imageEl.style.display = "none";
      }
      if (fallbackEl) {
        fallbackEl.style.display = "";
        fallbackEl.textContent = getInitials(currentFallback);
      }
    }
    function getInitials(text) {
      if (!text) return "";
      const words = text.trim().split(/\s+/);
      if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
      }
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    function createStatusElement() {
      if (statusEl) {
        statusEl.remove();
      }
      if (!currentStatus) return;
      statusEl = document.createElement("span");
      statusEl.className = `${CLASSES9.STATUS} ${STATUS_CLASSES[currentStatus] || ""}`;
      statusEl.setAttribute(ATTRS9.STATUS, "");
      statusEl.setAttribute("aria-label", currentStatus);
      element.appendChild(statusEl);
    }
    function applySizeClass() {
      Object.values(SIZE_CLASSES).forEach((cls) => {
        element.classList.remove(cls);
      });
      element.classList.add(SIZE_CLASSES[currentSize]);
    }
    function applyShapeClass() {
      Object.values(SHAPE_CLASSES).forEach((cls) => {
        element.classList.remove(cls);
      });
      element.classList.add(SHAPE_CLASSES[currentShape]);
    }
    function setSrc(src) {
      currentSrc = src;
      if (src) {
        loadImage(src);
      } else {
        showFallback();
      }
    }
    function setFallback(fallback) {
      currentFallback = fallback;
      if (fallbackEl && (!currentSrc || imageError)) {
        fallbackEl.textContent = getInitials(fallback);
      }
      element.setAttribute("aria-label", alt || fallback || "Avatar");
    }
    function setSize(newSize) {
      currentSize = newSize;
      applySizeClass();
    }
    function setShape(newShape) {
      currentShape = newShape;
      applyShapeClass();
    }
    function setStatus(status) {
      currentStatus = status;
      createStatusElement();
    }
    function destroy() {
      imageEl?.removeEventListener("load", handleImageLoad);
      imageEl?.removeEventListener("error", handleImageError);
      element.classList.remove(
        CLASSES9.ROOT,
        CLASSES9.LOADING,
        CLASSES9.ERROR,
        ...Object.values(SIZE_CLASSES),
        ...Object.values(SHAPE_CLASSES)
      );
      element.removeAttribute("data-atlas-avatar");
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
    }
    init();
    return {
      getSrc: () => currentSrc,
      setSrc,
      setFallback,
      setSize,
      getSize: () => currentSize,
      setShape,
      getShape: () => currentShape,
      setStatus,
      getStatus: () => currentStatus,
      destroy
    };
  }
  function createNoopState9() {
    return {
      getSrc: () => void 0,
      setSrc: () => {
      },
      setFallback: () => {
      },
      setSize: () => {
      },
      getSize: () => "default",
      setShape: () => {
      },
      getShape: () => "circle",
      setStatus: () => {
      },
      getStatus: () => null,
      destroy: () => {
      }
    };
  }
  function createAvatarGroup(element, options = {}) {
    if (!isBrowser()) {
      return {
        getCount: () => 0,
        setMax: () => {
        },
        getMax: () => 0,
        destroy: () => {
        }
      };
    }
    const { max: initialMax = Infinity, size: size2 = "default", spacing = -8 } = options;
    let currentMax = initialMax;
    function init() {
      element.classList.add("atlas-avatar-group");
      element.setAttribute("data-atlas-avatar-group", "");
      element.setAttribute("role", "group");
      element.style.setProperty("--atlas-avatar-group-spacing", `${spacing}px`);
      updateVisibility();
    }
    function updateVisibility() {
      const avatars = element.querySelectorAll("[data-atlas-avatar]");
      let hiddenCount = 0;
      avatars.forEach((avatar, index) => {
        const el = avatar;
        if (index < currentMax) {
          el.style.display = "";
          el.style.setProperty("--atlas-avatar-index", String(index));
        } else {
          el.style.display = "none";
          hiddenCount++;
        }
      });
      let overflow = element.querySelector(".atlas-avatar-overflow");
      if (hiddenCount > 0) {
        if (!overflow) {
          overflow = document.createElement("span");
          overflow.className = `atlas-avatar-overflow ${SIZE_CLASSES[size2]}`;
          element.appendChild(overflow);
        }
        overflow.textContent = `+${hiddenCount}`;
        overflow.style.display = "";
      } else if (overflow) {
        overflow.style.display = "none";
      }
    }
    function setMax(max) {
      currentMax = max;
      updateVisibility();
    }
    function destroy() {
      element.classList.remove("atlas-avatar-group");
      element.removeAttribute("data-atlas-avatar-group");
      element.removeAttribute("role");
    }
    init();
    return {
      getCount: () => element.querySelectorAll("[data-atlas-avatar]").length,
      setMax,
      getMax: () => currentMax,
      destroy
    };
  }
  var VARIANT_CLASSES = {
    default: "atlas-badge-default",
    primary: "atlas-badge-primary",
    secondary: "atlas-badge-secondary",
    destructive: "atlas-badge-destructive",
    success: "atlas-badge-success",
    warning: "atlas-badge-warning",
    outline: "atlas-badge-outline"
  };
  var SIZE_CLASSES2 = {
    sm: "atlas-badge-sm",
    md: "atlas-badge-md",
    lg: "atlas-badge-lg"
  };
  function createBadge(element, options = {}) {
    if (!isBrowser()) {
      return createNoopBadgeState();
    }
    const {
      variant: initialVariant = "default",
      size: size2 = "md",
      pulse: initialPulse = false,
      dot = false,
      content: initialContent = "",
      max
    } = options;
    let currentVariant = initialVariant;
    let currentContent = formatContent(initialContent, max);
    let isPulsing = initialPulse;
    let pulseAnimation = null;
    element.classList.add("atlas-badge");
    element.classList.add(VARIANT_CLASSES[currentVariant]);
    element.classList.add(SIZE_CLASSES2[size2]);
    if (dot) {
      element.classList.add("atlas-badge-dot");
      element.setAttribute("aria-hidden", "true");
    }
    if (!dot && currentContent) {
      element.textContent = currentContent;
    }
    if (isPulsing) {
      startPulse();
    }
    function formatContent(content, maxValue) {
      if (typeof content === "number" && maxValue !== void 0 && content > maxValue) {
        return `${maxValue}+`;
      }
      return String(content);
    }
    function startPulse() {
      if (pulseAnimation || !element.animate) return;
      pulseAnimation = element.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0.7, transform: "scale(1.1)" },
          { opacity: 1, transform: "scale(1)" }
        ],
        {
          duration: 1500,
          iterations: Infinity,
          easing: "ease-in-out"
        }
      );
    }
    function stopPulse() {
      if (pulseAnimation) {
        pulseAnimation.cancel();
        pulseAnimation = null;
      }
    }
    const setContent = (content) => {
      currentContent = formatContent(content, max);
      if (!dot) {
        element.textContent = currentContent;
      }
    };
    const setVariant = (variant) => {
      element.classList.remove(VARIANT_CLASSES[currentVariant]);
      currentVariant = variant;
      element.classList.add(VARIANT_CLASSES[currentVariant]);
    };
    const setPulse = (pulse2) => {
      isPulsing = pulse2;
      if (pulse2) {
        startPulse();
      } else {
        stopPulse();
      }
    };
    const setVisible = (visible) => {
      element.style.display = visible ? "" : "none";
      element.setAttribute("aria-hidden", String(!visible));
    };
    const destroy = () => {
      stopPulse();
      element.classList.remove("atlas-badge");
      element.classList.remove(VARIANT_CLASSES[currentVariant]);
      element.classList.remove(SIZE_CLASSES2[size2]);
      if (dot) {
        element.classList.remove("atlas-badge-dot");
      }
    };
    return {
      get variant() {
        return currentVariant;
      },
      get content() {
        return currentContent;
      },
      get isPulsing() {
        return isPulsing;
      },
      setContent,
      setVariant,
      setPulse,
      setVisible,
      destroy
    };
  }
  function createNoopBadgeState() {
    return {
      get variant() {
        return "default";
      },
      get content() {
        return "";
      },
      get isPulsing() {
        return false;
      },
      setContent: () => {
      },
      setVariant: () => {
      },
      setPulse: () => {
      },
      setVisible: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS23 = {
    ROOT: "data-atlas-bento",
    ITEM: "data-atlas-bento-item",
    ID: "data-bento-id",
    SIZE: "data-bento-size"
  };
  var CLASSES23 = {
    ROOT: "atlas-bento-grid",
    ITEM: "atlas-bento-item",
    ITEM_CONTENT: "atlas-bento-item-content",
    DRAGGING: "atlas-bento-dragging",
    DROP_TARGET: "atlas-bento-drop-target"
  };
  var SIZE_SPANS = {
    "1x1": { col: 1, row: 1 },
    "1x2": { col: 1, row: 2 },
    "2x1": { col: 2, row: 1 },
    "2x2": { col: 2, row: 2 },
    "1x3": { col: 1, row: 3 },
    "3x1": { col: 3, row: 1 },
    "2x3": { col: 2, row: 3 },
    "3x2": { col: 3, row: 2 }
  };
  function createBentoGrid(container, config2 = {}) {
    if (!isBrowser()) {
      return {
        getItems: () => [],
        addItem: () => {
        },
        removeItem: () => {
        },
        updateItem: () => {
        },
        reorder: () => {
        },
        refresh: () => {
        },
        destroy: () => {
        }
      };
    }
    let {
      items = [],
      columns = 4,
      gap = 16,
      rowHeight = "auto",
      aspectRatio = 1,
      animateHover = true,
      hoverScale = 1.02,
      animateEntrance = true,
      staggerDelay = 50,
      draggable = false,
      breakpoints,
      onItemClick,
      onReorder
    } = config2;
    let currentColumns = columns;
    let draggedItem = null;
    container.setAttribute(ATTRS23.ROOT, "");
    container.classList.add(CLASSES23.ROOT);
    function updateGridStyles() {
      const computedRowHeight = rowHeight === "auto" ? `calc((100% - ${(currentColumns - 1) * gap}px) / ${currentColumns} * ${aspectRatio})` : `${rowHeight}px`;
      container.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${currentColumns}, 1fr);
      grid-auto-rows: ${computedRowHeight};
      gap: ${gap}px;
    `;
    }
    function createItemElement(item) {
      const el = document.createElement("div");
      el.className = `${CLASSES23.ITEM} ${item.className || ""}`;
      el.setAttribute(ATTRS23.ITEM, "");
      el.setAttribute(ATTRS23.ID, item.id);
      const size2 = item.size || "1x1";
      const spans = SIZE_SPANS[size2];
      const colSpan = item.colSpan ?? spans.col;
      const rowSpan = item.rowSpan ?? spans.row;
      el.setAttribute(ATTRS23.SIZE, size2);
      el.style.gridColumn = `span ${Math.min(colSpan, currentColumns)}`;
      el.style.gridRow = `span ${rowSpan}`;
      const contentEl = document.createElement("div");
      contentEl.className = CLASSES23.ITEM_CONTENT;
      contentEl.innerHTML = item.content || "";
      contentEl.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: var(--bento-bg, #f5f5f5);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    `;
      el.appendChild(contentEl);
      if (animateHover) {
        el.addEventListener("mouseenter", () => {
          contentEl.style.transform = `scale(${hoverScale})`;
          contentEl.style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)";
        });
        el.addEventListener("mouseleave", () => {
          contentEl.style.transform = "";
          contentEl.style.boxShadow = "";
        });
      }
      if (onItemClick) {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => onItemClick(item));
      }
      if (draggable) {
        el.draggable = true;
        setupDragHandlers(el, item);
      }
      return el;
    }
    function setupDragHandlers(el, item) {
      el.addEventListener("dragstart", (e) => {
        draggedItem = el;
        el.classList.add(CLASSES23.DRAGGING);
        e.dataTransfer?.setData("text/plain", item.id);
      });
      el.addEventListener("dragend", () => {
        el.classList.remove(CLASSES23.DRAGGING);
        draggedItem = null;
        document.querySelectorAll(`.${CLASSES23.DROP_TARGET}`).forEach((t) => {
          t.classList.remove(CLASSES23.DROP_TARGET);
        });
      });
      el.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== el) {
          el.classList.add(CLASSES23.DROP_TARGET);
        }
      });
      el.addEventListener("dragleave", () => {
        el.classList.remove(CLASSES23.DROP_TARGET);
      });
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        el.classList.remove(CLASSES23.DROP_TARGET);
        if (!draggedItem || draggedItem === el) return;
        const draggedId = draggedItem.getAttribute(ATTRS23.ID);
        const targetId = el.getAttribute(ATTRS23.ID);
        if (!draggedId || !targetId) return;
        const draggedIndex = items.findIndex((i) => i.id === draggedId);
        const targetIndex = items.findIndex((i) => i.id === targetId);
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [removed] = items.splice(draggedIndex, 1);
          items.splice(targetIndex, 0, removed);
          render();
          onReorder?.(items);
        }
      });
    }
    function render() {
      container.innerHTML = "";
      updateGridStyles();
      items.forEach((item, index) => {
        const el = createItemElement(item);
        if (animateEntrance) {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
          el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "";
          }, index * staggerDelay);
        }
        container.appendChild(el);
      });
    }
    function handleResize() {
      if (!breakpoints) return;
      const width = window.innerWidth;
      let newColumns = columns;
      if (breakpoints.lg && width >= 1024) {
        newColumns = breakpoints.lg;
      } else if (breakpoints.md && width >= 768) {
        newColumns = breakpoints.md;
      } else if (breakpoints.sm) {
        newColumns = breakpoints.sm;
      }
      if (newColumns !== currentColumns) {
        currentColumns = newColumns;
        updateGridStyles();
        container.querySelectorAll(`[${ATTRS23.ITEM}]`).forEach((el) => {
          const size2 = el.getAttribute(ATTRS23.SIZE);
          if (size2) {
            const spans = SIZE_SPANS[size2];
            el.style.gridColumn = `span ${Math.min(spans.col, currentColumns)}`;
          }
        });
      }
    }
    if (items.length === 0) {
      Array.from(container.children).forEach((child, index) => {
        const el = child;
        items.push({
          id: el.getAttribute(ATTRS23.ID) || `item-${index}`,
          size: el.getAttribute(ATTRS23.SIZE) || "1x1",
          content: el.innerHTML,
          className: el.className
        });
      });
    }
    render();
    if (breakpoints) {
      window.addEventListener("resize", handleResize);
      handleResize();
    }
    return {
      getItems() {
        return [...items];
      },
      addItem(item) {
        items.push(item);
        const el = createItemElement(item);
        if (animateEntrance) {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px) scale(0.9)";
          el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          container.appendChild(el);
          requestAnimationFrame(() => {
            el.style.opacity = "1";
            el.style.transform = "";
          });
        } else {
          container.appendChild(el);
        }
      },
      removeItem(id) {
        const index = items.findIndex((i) => i.id === id);
        if (index === -1) return;
        items.splice(index, 1);
        const el = container.querySelector(`[${ATTRS23.ID}="${id}"]`);
        if (el) {
          el.style.opacity = "0";
          el.style.transform = "scale(0.9)";
          setTimeout(() => el.remove(), 300);
        }
      },
      updateItem(id, updates) {
        const index = items.findIndex((i) => i.id === id);
        if (index === -1) return;
        items[index] = { ...items[index], ...updates };
        const el = container.querySelector(`[${ATTRS23.ID}="${id}"]`);
        if (el) {
          const contentEl = el.querySelector(`.${CLASSES23.ITEM_CONTENT}`);
          if (contentEl && updates.content !== void 0) {
            contentEl.innerHTML = updates.content;
          }
          if (updates.size || updates.colSpan || updates.rowSpan) {
            const size2 = updates.size || items[index].size || "1x1";
            const spans = SIZE_SPANS[size2];
            const colSpan = updates.colSpan ?? items[index].colSpan ?? spans.col;
            const rowSpan = updates.rowSpan ?? items[index].rowSpan ?? spans.row;
            el.style.gridColumn = `span ${Math.min(colSpan, currentColumns)}`;
            el.style.gridRow = `span ${rowSpan}`;
            el.setAttribute(ATTRS23.SIZE, size2);
          }
        }
      },
      reorder(ids) {
        const newItems = [];
        for (const id of ids) {
          const item = items.find((i) => i.id === id);
          if (item) newItems.push(item);
        }
        items = newItems;
        render();
      },
      refresh() {
        render();
      },
      destroy() {
        if (breakpoints) {
          window.removeEventListener("resize", handleResize);
        }
        container.innerHTML = "";
        container.removeAttribute(ATTRS23.ROOT);
        container.classList.remove(CLASSES23.ROOT);
        container.style.cssText = "";
      }
    };
  }
  var AtlasBentoGrid = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._grid = null;
    }
    static get observedAttributes() {
      return ["columns", "gap", "animate"];
    }
    connectedCallback() {
      requestAnimationFrame(() => {
        this._init();
      });
    }
    disconnectedCallback() {
      this._grid?.destroy();
      this._grid = null;
    }
    _init() {
      this._grid = createBentoGrid(this, {
        columns: parseInt(this.getAttribute("columns") || "4", 10),
        gap: parseInt(this.getAttribute("gap") || "16", 10),
        animateHover: this.getAttribute("animate-hover") !== "false",
        animateEntrance: this.getAttribute("animate-entrance") !== "false",
        draggable: this.hasAttribute("draggable")
      });
    }
    refresh() {
      this._grid?.refresh();
    }
  };
  if (isBrowser() && !customElements.get("atlas-bento-grid")) {
    customElements.define("atlas-bento-grid", AtlasBentoGrid);
  }
  var ATTRS32 = {
    LIST: "data-atlas-breadcrumb-list",
    ITEM: "data-atlas-breadcrumb-item",
    LINK: "data-atlas-breadcrumb-link",
    SEPARATOR: "data-atlas-breadcrumb-separator",
    CURRENT: "data-atlas-breadcrumb-current"
  };
  var CLASSES32 = {
    ROOT: "atlas-breadcrumb",
    LIST: "atlas-breadcrumb-list",
    ITEM: "atlas-breadcrumb-item",
    LINK: "atlas-breadcrumb-link",
    SEPARATOR: "atlas-breadcrumb-separator",
    CURRENT: "atlas-breadcrumb-current"
  };
  var DEFAULT_SEPARATOR = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  function createBreadcrumb(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState23();
    }
    const {
      items: initialItems = [],
      separator: initialSeparator = DEFAULT_SEPARATOR,
      ariaLabel = "Breadcrumb"
    } = options;
    let currentItems = initialItems;
    let currentSeparator = initialSeparator;
    const id = generateId("breadcrumb");
    let list = null;
    function init() {
      element.classList.add(CLASSES32.ROOT);
      element.setAttribute("data-atlas-breadcrumb", "");
      element.setAttribute("role", "navigation");
      element.setAttribute("aria-label", ariaLabel);
      element.id = id;
      list = element.querySelector(`[${ATTRS32.LIST}]`);
      if (!list) {
        list = document.createElement("ol");
        list.className = CLASSES32.LIST;
        list.setAttribute(ATTRS32.LIST, "");
        element.appendChild(list);
      }
      if (currentItems.length > 0) {
        render();
      } else {
        parseExistingItems();
      }
    }
    function parseExistingItems() {
      const existingItems = element.querySelectorAll(`[${ATTRS32.ITEM}]`);
      currentItems = Array.from(existingItems).map((item) => {
        const link = item.querySelector(`[${ATTRS32.LINK}]`);
        const isCurrent = item.hasAttribute(ATTRS32.CURRENT) || link?.hasAttribute("aria-current");
        return {
          label: link?.textContent?.trim() ?? item.textContent?.trim() ?? "",
          href: link?.getAttribute("href") ?? void 0,
          current: isCurrent
        };
      });
    }
    function render() {
      if (!list) return;
      list.innerHTML = "";
      currentItems.forEach((item, index) => {
        const li = createItemElement(item, index);
        list?.appendChild(li);
        if (index < currentItems.length - 1) {
          const sep = createSeparatorElement();
          list?.appendChild(sep);
        }
      });
    }
    function createItemElement(item, index) {
      const li = document.createElement("li");
      li.className = CLASSES32.ITEM;
      li.setAttribute(ATTRS32.ITEM, "");
      if (item.current) {
        li.setAttribute(ATTRS32.CURRENT, "");
        li.classList.add(CLASSES32.CURRENT);
        const span = document.createElement("span");
        span.className = CLASSES32.LINK;
        span.setAttribute("role", "link");
        span.setAttribute("aria-current", "page");
        span.setAttribute("aria-disabled", "true");
        span.textContent = item.label;
        li.appendChild(span);
      } else {
        const link = document.createElement("a");
        link.className = CLASSES32.LINK;
        link.setAttribute(ATTRS32.LINK, "");
        link.href = item.href ?? "#";
        link.textContent = item.label;
        link.addEventListener("click", (e) => {
          if (options.onNavigate) {
            e.preventDefault();
            options.onNavigate(item, index);
          }
        });
        li.appendChild(link);
      }
      return li;
    }
    function createSeparatorElement() {
      const li = document.createElement("li");
      li.className = CLASSES32.SEPARATOR;
      li.setAttribute(ATTRS32.SEPARATOR, "");
      li.setAttribute("role", "presentation");
      li.setAttribute("aria-hidden", "true");
      li.innerHTML = currentSeparator;
      return li;
    }
    function setItems(items) {
      currentItems = items;
      render();
    }
    function setSeparator(separator) {
      currentSeparator = separator;
      render();
    }
    function destroy() {
      element.classList.remove(CLASSES32.ROOT);
      element.removeAttribute("data-atlas-breadcrumb");
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
    }
    init();
    return {
      getItems: () => [...currentItems],
      setItems,
      setSeparator,
      destroy
    };
  }
  function createNoopState23() {
    return {
      getItems: () => [],
      setItems: () => {
      },
      setSeparator: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS42 = {
    VIEWPORT: "data-atlas-carousel-viewport",
    CONTAINER: "data-atlas-carousel-container",
    SLIDE: "data-atlas-carousel-slide",
    PREV: "data-atlas-carousel-prev",
    NEXT: "data-atlas-carousel-next",
    DOTS: "data-atlas-carousel-dots",
    DOT: "data-atlas-carousel-dot"
  };
  var CLASSES42 = {
    ROOT: "atlas-carousel",
    VIEWPORT: "atlas-carousel-viewport",
    CONTAINER: "atlas-carousel-container",
    SLIDE: "atlas-carousel-slide",
    SLIDE_ACTIVE: "atlas-carousel-slide--active",
    ARROW: "atlas-carousel-arrow",
    ARROW_PREV: "atlas-carousel-arrow--prev",
    ARROW_NEXT: "atlas-carousel-arrow--next",
    ARROW_DISABLED: "atlas-carousel-arrow--disabled",
    DOTS: "atlas-carousel-dots",
    DOT: "atlas-carousel-dot",
    DOT_ACTIVE: "atlas-carousel-dot--active",
    DRAGGING: "atlas-carousel--dragging",
    HORIZONTAL: "atlas-carousel--horizontal",
    VERTICAL: "atlas-carousel--vertical"
  };
  var ARROW_PREV_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
  var ARROW_NEXT_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
  function createCarousel(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState32();
    }
    const {
      startIndex = 0,
      loop: loop2 = false,
      autoplay = 0,
      pauseOnHover = true,
      draggable = true,
      slidesToShow = 1,
      slidesToScroll = 1,
      orientation = "horizontal",
      gap = "0px",
      duration = ANIMATION_DURATION.normal,
      showArrows = true,
      showDots = true
    } = options;
    let currentIndex = startIndex;
    let isPlayingState = autoplay > 0;
    let autoplayTimer = null;
    let isDragging = false;
    let dragStart = 0;
    let dragOffset = 0;
    const id = generateId("carousel");
    let viewportEl = null;
    let containerEl = null;
    let slides = [];
    let prevBtn = null;
    let nextBtn = null;
    let dotsEl = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES42.ROOT);
      element.classList.add(orientation === "horizontal" ? CLASSES42.HORIZONTAL : CLASSES42.VERTICAL);
      element.setAttribute("data-atlas-carousel", "");
      element.setAttribute("role", "region");
      element.setAttribute("aria-roledescription", "carousel");
      element.setAttribute("aria-label", "Image carousel");
      element.id = id;
      viewportEl = element.querySelector(`[${ATTRS42.VIEWPORT}]`);
      if (!viewportEl) {
        viewportEl = document.createElement("div");
        viewportEl.className = CLASSES42.VIEWPORT;
        viewportEl.setAttribute(ATTRS42.VIEWPORT, "");
        const existingContent = Array.from(element.children);
        existingContent.forEach((child) => viewportEl?.appendChild(child));
        element.appendChild(viewportEl);
      }
      containerEl = viewportEl.querySelector(`[${ATTRS42.CONTAINER}]`);
      if (!containerEl) {
        containerEl = document.createElement("div");
        containerEl.className = CLASSES42.CONTAINER;
        containerEl.setAttribute(ATTRS42.CONTAINER, "");
        const viewportContent = Array.from(viewportEl.children);
        viewportContent.forEach((child) => containerEl?.appendChild(child));
        viewportEl.appendChild(containerEl);
      }
      refreshSlides();
      containerEl.style.gap = gap;
      if (showArrows) {
        createArrows();
      }
      if (showDots) {
        createDots();
      }
      if (draggable) {
        setupDrag();
      }
      setupKeyboard();
      if (pauseOnHover && autoplay > 0) {
        cleanups.push(addListener(element, "mouseenter", () => stopAutoplay()));
        cleanups.push(
          addListener(element, "mouseleave", () => {
            if (isPlayingState) startAutoplay();
          })
        );
      }
      goTo(currentIndex, false);
      if (autoplay > 0) {
        startAutoplay();
      }
    }
    function refreshSlides() {
      slides = Array.from(containerEl?.querySelectorAll(`[${ATTRS42.SLIDE}]`) ?? []);
      if (slides.length === 0 && containerEl) {
        slides = Array.from(containerEl.children);
        slides.forEach((slide) => {
          slide.classList.add(CLASSES42.SLIDE);
          slide.setAttribute(ATTRS42.SLIDE, "");
        });
      }
      slides.forEach((slide, index) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `Slide ${index + 1} of ${slides.length}`);
        const width = `calc((100% - ${gap} * ${slidesToShow - 1}) / ${slidesToShow})`;
        slide.style.flex = `0 0 ${width}`;
        slide.style.minWidth = width;
      });
      if (showDots && dotsEl) {
        createDots();
      }
    }
    function createArrows() {
      prevBtn = document.createElement("button");
      prevBtn.className = `${CLASSES42.ARROW} ${CLASSES42.ARROW_PREV}`;
      prevBtn.setAttribute(ATTRS42.PREV, "");
      prevBtn.setAttribute("aria-label", "Previous slide");
      prevBtn.type = "button";
      prevBtn.innerHTML = ARROW_PREV_ICON;
      prevBtn.addEventListener("click", prev);
      element.appendChild(prevBtn);
      nextBtn = document.createElement("button");
      nextBtn.className = `${CLASSES42.ARROW} ${CLASSES42.ARROW_NEXT}`;
      nextBtn.setAttribute(ATTRS42.NEXT, "");
      nextBtn.setAttribute("aria-label", "Next slide");
      nextBtn.type = "button";
      nextBtn.innerHTML = ARROW_NEXT_ICON;
      nextBtn.addEventListener("click", next);
      element.appendChild(nextBtn);
    }
    function createDots() {
      if (dotsEl) {
        dotsEl.remove();
      }
      const dotCount = Math.ceil((slides.length - slidesToShow + 1) / slidesToScroll);
      if (dotCount <= 1) return;
      dotsEl = document.createElement("div");
      dotsEl.className = CLASSES42.DOTS;
      dotsEl.setAttribute(ATTRS42.DOTS, "");
      dotsEl.setAttribute("role", "tablist");
      dotsEl.setAttribute("aria-label", "Slide navigation");
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement("button");
        dot.className = `${CLASSES42.DOT} ${i === Math.floor(currentIndex / slidesToScroll) ? CLASSES42.DOT_ACTIVE : ""}`;
        dot.setAttribute(ATTRS42.DOT, "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.setAttribute(
          "aria-selected",
          i === Math.floor(currentIndex / slidesToScroll) ? "true" : "false"
        );
        dot.type = "button";
        dot.addEventListener("click", () => goTo(i * slidesToScroll));
        dotsEl.appendChild(dot);
      }
      element.appendChild(dotsEl);
    }
    function setupDrag() {
      if (!containerEl) return;
      const isHorizontal = orientation === "horizontal";
      function handlePointerDown(e) {
        if (e.button !== 0) return;
        isDragging = true;
        dragStart = isHorizontal ? e.clientX : e.clientY;
        dragOffset = 0;
        element.classList.add(CLASSES42.DRAGGING);
        if (containerEl) containerEl.style.transition = "none";
        containerEl?.setPointerCapture(e.pointerId);
      }
      function handlePointerMove(e) {
        if (!isDragging) return;
        const current = isHorizontal ? e.clientX : e.clientY;
        dragOffset = current - dragStart;
        const baseOffset = getSlideOffset(currentIndex);
        const transform = isHorizontal ? `translateX(${baseOffset + dragOffset}px)` : `translateY(${baseOffset + dragOffset}px)`;
        if (containerEl) containerEl.style.transform = transform;
      }
      function handlePointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove(CLASSES42.DRAGGING);
        if (containerEl) containerEl.style.transition = "";
        const threshold = (viewportEl?.clientWidth ?? 0) / 4;
        if (Math.abs(dragOffset) > threshold) {
          if (dragOffset > 0) {
            prev();
          } else {
            next();
          }
        } else {
          goTo(currentIndex);
        }
        containerEl?.releasePointerCapture(e.pointerId);
      }
      containerEl.addEventListener("pointerdown", handlePointerDown);
      containerEl.addEventListener("pointermove", handlePointerMove);
      containerEl.addEventListener("pointerup", handlePointerUp);
      containerEl.addEventListener("pointercancel", handlePointerUp);
      cleanups.push(() => {
        containerEl?.removeEventListener("pointerdown", handlePointerDown);
        containerEl?.removeEventListener("pointermove", handlePointerMove);
        containerEl?.removeEventListener("pointerup", handlePointerUp);
        containerEl?.removeEventListener("pointercancel", handlePointerUp);
      });
    }
    function setupKeyboard() {
      function handleKeydown(e) {
        switch (e.key) {
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            prev();
            break;
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            next();
            break;
        }
      }
      element.setAttribute("tabindex", "0");
      cleanups.push(addListener(element, "keydown", handleKeydown));
    }
    function getSlideOffset(index) {
      if (!viewportEl || slides.length === 0) return 0;
      const slideWidth = slides[0].offsetWidth;
      const gapValue = parseFloat(gap) || 0;
      return -(index * (slideWidth + gapValue));
    }
    function goTo(index, animate2 = true) {
      const maxIndex = Math.max(0, slides.length - slidesToShow);
      if (loop2) {
        if (index < 0) {
          index = maxIndex;
        } else if (index > maxIndex) {
          index = 0;
        }
      } else {
        index = Math.max(0, Math.min(index, maxIndex));
      }
      currentIndex = index;
      if (containerEl) {
        const offset = getSlideOffset(currentIndex);
        const isHorizontal = orientation === "horizontal";
        containerEl.style.transition = animate2 ? `transform ${duration}ms ${EASING.standard}` : "none";
        containerEl.style.transform = isHorizontal ? `translateX(${offset}px)` : `translateY(${offset}px)`;
      }
      slides.forEach((slide, i) => {
        const isActive = i >= currentIndex && i < currentIndex + slidesToShow;
        slide.classList.toggle(CLASSES42.SLIDE_ACTIVE, isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      updateArrows();
      updateDots();
      if (animate2) {
        options.onChange?.(currentIndex);
      }
    }
    function next() {
      goTo(currentIndex + slidesToScroll);
    }
    function prev() {
      goTo(currentIndex - slidesToScroll);
    }
    function updateArrows() {
      if (!loop2) {
        const maxIndex = Math.max(0, slides.length - slidesToShow);
        prevBtn?.classList.toggle(CLASSES42.ARROW_DISABLED, currentIndex === 0);
        nextBtn?.classList.toggle(CLASSES42.ARROW_DISABLED, currentIndex >= maxIndex);
      }
    }
    function updateDots() {
      if (!dotsEl) return;
      const dots = dotsEl.querySelectorAll(`[${ATTRS42.DOT}]`);
      const activeDotIndex = Math.floor(currentIndex / slidesToScroll);
      dots.forEach((dot, i) => {
        dot.classList.toggle(CLASSES42.DOT_ACTIVE, i === activeDotIndex);
        dot.setAttribute("aria-selected", i === activeDotIndex ? "true" : "false");
      });
    }
    function startAutoplay() {
      if (autoplayTimer) return;
      autoplayTimer = setInterval(() => {
        next();
      }, autoplay);
    }
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
    function play() {
      isPlayingState = true;
      startAutoplay();
    }
    function pause() {
      isPlayingState = false;
      stopAutoplay();
    }
    function refresh() {
      refreshSlides();
      goTo(Math.min(currentIndex, slides.length - slidesToShow), false);
    }
    function destroy() {
      stopAutoplay();
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES42.ROOT, CLASSES42.HORIZONTAL, CLASSES42.VERTICAL, CLASSES42.DRAGGING);
      element.removeAttribute("data-atlas-carousel");
      element.removeAttribute("role");
      element.removeAttribute("aria-roledescription");
      element.removeAttribute("aria-label");
      element.removeAttribute("tabindex");
    }
    init();
    return {
      getIndex: () => currentIndex,
      goTo,
      next,
      prev,
      getCount: () => slides.length,
      play,
      pause,
      isPlaying: () => isPlayingState && autoplayTimer !== null,
      refresh,
      destroy
    };
  }
  function createNoopState32() {
    return {
      getIndex: () => 0,
      goTo: () => {
      },
      next: () => {
      },
      prev: () => {
      },
      getCount: () => 0,
      play: () => {
      },
      pause: () => {
      },
      isPlaying: () => false,
      refresh: () => {
      },
      destroy: () => {
      }
    };
  }
  function createCheckbox(element, options = {}) {
    if (!isBrowser()) {
      return createNoopCheckboxState();
    }
    const {
      checked: initialChecked = false,
      indeterminate: initialIndeterminate = false,
      disabled: initialDisabled = false,
      name,
      value,
      onChange
    } = options;
    let isChecked = initialChecked;
    let isIndeterminate = initialIndeterminate;
    let isDisabled = initialDisabled;
    const cleanupListeners = [];
    element.classList.add("atlas-checkbox");
    element.setAttribute("role", "checkbox");
    element.setAttribute("tabindex", isDisabled ? "-1" : "0");
    if (name) element.setAttribute("data-name", name);
    if (value) element.setAttribute("data-value", value);
    function updateState() {
      if (isIndeterminate) {
        element.setAttribute("aria-checked", "mixed");
        element.classList.add("atlas-checkbox-indeterminate");
        element.classList.remove("atlas-checkbox-checked");
      } else if (isChecked) {
        element.setAttribute("aria-checked", "true");
        element.classList.add("atlas-checkbox-checked");
        element.classList.remove("atlas-checkbox-indeterminate");
      } else {
        element.setAttribute("aria-checked", "false");
        element.classList.remove("atlas-checkbox-checked", "atlas-checkbox-indeterminate");
      }
      if (isDisabled) {
        element.setAttribute("aria-disabled", "true");
        element.setAttribute("tabindex", "-1");
        element.classList.add("atlas-checkbox-disabled");
      } else {
        element.removeAttribute("aria-disabled");
        element.setAttribute("tabindex", "0");
        element.classList.remove("atlas-checkbox-disabled");
      }
    }
    function animateChange() {
      if (!element.animate) return;
      element.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(0.9)" },
          { transform: "scale(1.05)" },
          { transform: "scale(1)" }
        ],
        {
          duration: ANIMATION_DURATION.fast,
          easing: EASING.bounce
        }
      );
    }
    function handleToggle() {
      if (isDisabled) return;
      if (isIndeterminate) {
        isIndeterminate = false;
        isChecked = true;
      } else {
        isChecked = !isChecked;
      }
      updateState();
      animateChange();
      onChange?.(isChecked);
    }
    cleanupListeners.push(
      addListener(element, "click", handleToggle),
      handleActivation(element, handleToggle)
    );
    updateState();
    const setChecked = (checked) => {
      if (isChecked === checked) return;
      isChecked = checked;
      isIndeterminate = false;
      updateState();
      animateChange();
      onChange?.(isChecked);
    };
    const toggle = () => {
      handleToggle();
    };
    const setIndeterminate = (indeterminate) => {
      isIndeterminate = indeterminate;
      updateState();
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      updateState();
    };
    const focus = () => {
      element.focus();
    };
    const destroy = () => {
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.classList.remove(
        "atlas-checkbox",
        "atlas-checkbox-checked",
        "atlas-checkbox-indeterminate",
        "atlas-checkbox-disabled"
      );
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      element.removeAttribute("aria-checked");
      element.removeAttribute("aria-disabled");
    };
    return {
      get isChecked() {
        return isChecked;
      },
      get isIndeterminate() {
        return isIndeterminate;
      },
      get isDisabled() {
        return isDisabled;
      },
      setChecked,
      toggle,
      setIndeterminate,
      setDisabled,
      focus,
      destroy
    };
  }
  function createNoopCheckboxState() {
    return {
      get isChecked() {
        return false;
      },
      get isIndeterminate() {
        return false;
      },
      get isDisabled() {
        return false;
      },
      setChecked: () => {
      },
      toggle: () => {
      },
      setIndeterminate: () => {
      },
      setDisabled: () => {
      },
      focus: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS52 = {
    ROOT: "data-atlas-combobox",
    INPUT: "data-atlas-combobox-input",
    CONTENT: "data-atlas-combobox-content",
    OPTION: "data-atlas-combobox-option",
    VALUE: "data-value",
    SELECTED: "data-selected",
    DISABLED: "data-disabled",
    HIGHLIGHTED: "data-highlighted",
    LOADING: "data-loading",
    EMPTY: "data-empty",
    CREATE: "data-create"
  };
  var CLASSES52 = {
    ROOT: "atlas-combobox",
    INPUT_WRAPPER: "atlas-combobox-input-wrapper",
    INPUT: "atlas-combobox-input",
    CLEAR: "atlas-combobox-clear",
    LOADING: "atlas-combobox-loading",
    CONTENT: "atlas-combobox-content",
    OPTIONS: "atlas-combobox-options",
    OPTION: "atlas-combobox-option",
    OPTION_LABEL: "atlas-combobox-option-label",
    HIGHLIGHT: "atlas-combobox-highlight",
    EMPTY: "atlas-combobox-empty",
    CREATE: "atlas-combobox-create"
  };
  function defaultFilter(option, query) {
    return option.label.toLowerCase().includes(query.toLowerCase());
  }
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return text.replace(regex, `<mark class="${CLASSES52.HIGHLIGHT}">$1</mark>`);
  }
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function debounce2(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  function createCombobox(container, config2) {
    if (!isBrowser()) {
      return {
        getValue: () => "",
        getSelected: () => null,
        setValue: () => {
        },
        setInputValue: () => {
        },
        open: () => {
        },
        close: () => {
        },
        isOpen: () => false,
        focus: () => {
        },
        setOptions: () => {
        },
        clear: () => {
        },
        setDisabled: () => {
        },
        destroy: () => {
        }
      };
    }
    let options = config2.options || [];
    let filteredOptions = [];
    let selectedValue = config2.value || "";
    let selectedOption = null;
    let inputValue = "";
    let isOpenState = false;
    let isLoading = false;
    let highlightedIndex = -1;
    let disabled = config2.disabled ?? false;
    const {
      placeholder = "",
      minChars = 0,
      debounce: debounceDelay = 150,
      showLoading = true,
      allowCreate = false,
      createLabel: createLabel2 = (q) => `Create "${q}"`,
      placement = "bottom-start",
      maxOptions = 10,
      emptyMessage = "No results found",
      loadingMessage = "Loading...",
      filterFn = defaultFilter,
      renderOption,
      highlightMatches = true,
      onSearch,
      onChange,
      onCreate,
      onFocus,
      onBlur
    } = config2;
    const id = generateId("combobox");
    const inputId = `${id}-input`;
    const listboxId = `${id}-listbox`;
    let inputEl = null;
    let contentEl = null;
    let optionsEl = null;
    let clearBtn = null;
    let loadingEl = null;
    let dismissHandler = null;
    let cleanupAutoUpdate = null;
    if (selectedValue) {
      selectedOption = options.find((o) => o.value === selectedValue) || null;
      inputValue = selectedOption?.label || selectedValue;
    }
    function render() {
      container.innerHTML = "";
      container.setAttribute(ATTRS52.ROOT, "");
      container.classList.add(CLASSES52.ROOT);
      const inputWrapper = document.createElement("div");
      inputWrapper.className = CLASSES52.INPUT_WRAPPER;
      inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.id = inputId;
      inputEl.className = CLASSES52.INPUT;
      inputEl.placeholder = placeholder;
      inputEl.value = inputValue;
      inputEl.setAttribute(ATTRS52.INPUT, "");
      inputEl.setAttribute("role", "combobox");
      inputEl.setAttribute("aria-autocomplete", "list");
      inputEl.setAttribute("aria-expanded", "false");
      inputEl.setAttribute("aria-controls", listboxId);
      inputEl.setAttribute("autocomplete", "off");
      if (disabled) {
        inputEl.disabled = true;
        inputEl.setAttribute(ATTRS52.DISABLED, "");
      }
      inputWrapper.appendChild(inputEl);
      clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = CLASSES52.CLEAR;
      clearBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
      clearBtn.setAttribute("aria-label", "Clear");
      clearBtn.hidden = !inputValue;
      inputWrapper.appendChild(clearBtn);
      if (showLoading) {
        loadingEl = document.createElement("div");
        loadingEl.className = CLASSES52.LOADING;
        loadingEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="28" stroke-dashoffset="7">
            <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      `;
        loadingEl.hidden = true;
        inputWrapper.appendChild(loadingEl);
      }
      container.appendChild(inputWrapper);
      contentEl = document.createElement("div");
      contentEl.id = `${id}-content`;
      contentEl.className = CLASSES52.CONTENT;
      contentEl.setAttribute(ATTRS52.CONTENT, "");
      contentEl.hidden = true;
      optionsEl = document.createElement("div");
      optionsEl.id = listboxId;
      optionsEl.className = CLASSES52.OPTIONS;
      optionsEl.setAttribute("role", "listbox");
      contentEl.appendChild(optionsEl);
      document.body.appendChild(contentEl);
    }
    function renderOptions() {
      const displayOptions = filteredOptions.slice(0, maxOptions);
      if (isLoading) {
        optionsEl.innerHTML = `<div class="${CLASSES52.EMPTY}" ${ATTRS52.LOADING}>${loadingMessage}</div>`;
        return;
      }
      if (displayOptions.length === 0) {
        let html2 = `<div class="${CLASSES52.EMPTY}" ${ATTRS52.EMPTY}>${emptyMessage}</div>`;
        if (allowCreate && inputValue.trim()) {
          html2 += `
          <div
            class="${CLASSES52.CREATE}"
            ${ATTRS52.CREATE}
            role="option"
            tabindex="-1"
          >
            ${createLabel2(inputValue.trim())}
          </div>
        `;
        }
        optionsEl.innerHTML = html2;
        return;
      }
      let html = displayOptions.map((opt, i) => {
        const isSelected = opt.value === selectedValue;
        const isHighlighted = i === highlightedIndex;
        const optionId = `${id}-option-${i}`;
        let content;
        if (renderOption) {
          content = renderOption(opt, isHighlighted);
        } else {
          const label = highlightMatches ? highlightText(opt.label, inputValue) : opt.label;
          content = `<span class="${CLASSES52.OPTION_LABEL}">${label}</span>`;
        }
        return `
          <div
            id="${optionId}"
            class="${CLASSES52.OPTION}"
            role="option"
            ${ATTRS52.OPTION}
            ${ATTRS52.VALUE}="${opt.value}"
            ${isSelected ? ATTRS52.SELECTED : ""}
            ${isHighlighted ? ATTRS52.HIGHLIGHTED : ""}
            ${opt.disabled ? ATTRS52.DISABLED : ""}
            aria-selected="${isSelected}"
            aria-disabled="${opt.disabled || false}"
          >
            ${content}
          </div>
        `;
      }).join("");
      if (allowCreate && inputValue.trim() && !displayOptions.some((o) => o.label.toLowerCase() === inputValue.toLowerCase())) {
        html += `
        <div
          class="${CLASSES52.CREATE}"
          ${ATTRS52.CREATE}
          role="option"
          tabindex="-1"
        >
          ${createLabel2(inputValue.trim())}
        </div>
      `;
      }
      optionsEl.innerHTML = html;
      if (highlightedIndex >= 0 && highlightedIndex < displayOptions.length) {
        inputEl.setAttribute("aria-activedescendant", `${id}-option-${highlightedIndex}`);
      } else {
        inputEl.removeAttribute("aria-activedescendant");
      }
    }
    function getVisibleOptions() {
      return Array.from(
        optionsEl.querySelectorAll(`[${ATTRS52.OPTION}]:not([${ATTRS52.DISABLED}])`)
      );
    }
    function highlightOption(index) {
      const visibleOptions = getVisibleOptions();
      visibleOptions.forEach((el) => el.removeAttribute(ATTRS52.HIGHLIGHTED));
      if (index >= 0 && index < visibleOptions.length) {
        const option = visibleOptions[index];
        option.setAttribute(ATTRS52.HIGHLIGHTED, "");
        option.scrollIntoView({ block: "nearest" });
        inputEl.setAttribute("aria-activedescendant", option.id);
        highlightedIndex = index;
      } else {
        highlightedIndex = -1;
        inputEl.removeAttribute("aria-activedescendant");
      }
    }
    const performSearch = debounce2(async (query) => {
      if (query.length < minChars) {
        filteredOptions = [];
        renderOptions();
        return;
      }
      if (onSearch) {
        isLoading = true;
        renderOptions();
        try {
          const results = await onSearch(query);
          filteredOptions = results;
        } catch (error2) {
          console.error("[Combobox] Search error:", error2);
          filteredOptions = [];
        } finally {
          isLoading = false;
        }
      } else {
        filteredOptions = options.filter((opt) => filterFn(opt, query));
      }
      highlightedIndex = filteredOptions.length > 0 ? 0 : -1;
      renderOptions();
    }, debounceDelay);
    function selectOption(option) {
      selectedValue = option.value;
      selectedOption = option;
      inputValue = option.label;
      inputEl.value = inputValue;
      if (clearBtn) clearBtn.hidden = false;
      close();
      onChange?.(selectedValue, selectedOption);
    }
    function createItem(value) {
      onCreate?.(value);
      inputValue = value;
      selectedValue = value;
      selectedOption = null;
      if (clearBtn) clearBtn.hidden = false;
      close();
    }
    function clearSelection() {
      selectedValue = "";
      selectedOption = null;
      inputValue = "";
      inputEl.value = "";
      if (clearBtn) clearBtn.hidden = true;
      filteredOptions = [];
      renderOptions();
      onChange?.("", null);
    }
    function open() {
      if (isOpenState || disabled) return;
      isOpenState = true;
      contentEl.hidden = false;
      inputEl.setAttribute("aria-expanded", "true");
      const updatePosition = () => {
        const result = computeFloatingPosition(inputEl, contentEl, {
          placement,
          offset: 4,
          flip: true
        });
        applyFloatingStyles(contentEl, result);
        contentEl.style.minWidth = `${inputEl.offsetWidth}px`;
      };
      updatePosition();
      cleanupAutoUpdate = autoUpdate(inputEl, contentEl, updatePosition);
      performSearch(inputValue);
      dismissHandler = createDismissHandler(contentEl, {
        onDismiss: close,
        escapeKey: true,
        clickOutside: true,
        ignore: [container]
      });
    }
    function close() {
      if (!isOpenState) return;
      isOpenState = false;
      contentEl.hidden = true;
      inputEl.setAttribute("aria-expanded", "false");
      inputEl.removeAttribute("aria-activedescendant");
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      dismissHandler?.destroy();
      dismissHandler = null;
      highlightedIndex = -1;
      isLoading = false;
    }
    function handleInput(e) {
      const input = e.target;
      inputValue = input.value;
      if (clearBtn) clearBtn.hidden = !inputValue;
      if (selectedOption && inputValue !== selectedOption.label) {
        selectedValue = "";
        selectedOption = null;
      }
      if (!isOpenState && inputValue.length >= minChars) {
        open();
      } else if (isOpenState) {
        performSearch(inputValue);
      }
    }
    function handleFocus() {
      onFocus?.();
      if (inputValue.length >= minChars || options.length > 0) {
        open();
      }
    }
    function handleBlur() {
      onBlur?.();
      setTimeout(() => {
        if (!contentEl.contains(document.activeElement)) {
          close();
        }
      }, 150);
    }
    function handleKeydown(e) {
      const visibleOptions = getVisibleOptions();
      const hasCreateOption = allowCreate && inputValue.trim() && optionsEl.querySelector(`[${ATTRS52.CREATE}]`);
      const totalOptions = visibleOptions.length + (hasCreateOption ? 1 : 0);
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpenState) {
            open();
          } else {
            highlightOption(Math.min(highlightedIndex + 1, totalOptions - 1));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpenState) {
            highlightOption(Math.max(highlightedIndex - 1, 0));
          }
          break;
        case "Enter":
          e.preventDefault();
          if (isOpenState) {
            if (hasCreateOption && highlightedIndex === visibleOptions.length) {
              createItem(inputValue.trim());
            } else if (highlightedIndex >= 0 && highlightedIndex < visibleOptions.length) {
              const value = visibleOptions[highlightedIndex].getAttribute(ATTRS52.VALUE);
              const option = filteredOptions.find((o) => o.value === value);
              if (option) selectOption(option);
            }
          } else if (inputValue.length >= minChars) {
            open();
          }
          break;
        case "Escape":
          if (isOpenState) {
            e.preventDefault();
            close();
          }
          break;
        case "Tab":
          close();
          break;
        case "Home":
          if (isOpenState) {
            e.preventDefault();
            highlightOption(0);
          }
          break;
        case "End":
          if (isOpenState) {
            e.preventDefault();
            highlightOption(totalOptions - 1);
          }
          break;
      }
    }
    function handleOptionsClick(e) {
      const target = e.target;
      const createEl = target.closest(`[${ATTRS52.CREATE}]`);
      if (createEl) {
        createItem(inputValue.trim());
        return;
      }
      const optionEl = target.closest(`[${ATTRS52.OPTION}]`);
      if (optionEl && !optionEl.hasAttribute(ATTRS52.DISABLED)) {
        const value = optionEl.getAttribute(ATTRS52.VALUE);
        const option = filteredOptions.find((o) => o.value === value);
        if (option) selectOption(option);
      }
    }
    function handleClearClick(e) {
      e.preventDefault();
      e.stopPropagation();
      clearSelection();
      inputEl.focus();
    }
    render();
    inputEl.addEventListener("input", handleInput);
    inputEl.addEventListener("focus", handleFocus);
    inputEl.addEventListener("blur", handleBlur);
    inputEl.addEventListener("keydown", handleKeydown);
    optionsEl.addEventListener("click", handleOptionsClick);
    if (clearBtn !== null) {
      const btn = clearBtn;
      btn.addEventListener("click", handleClearClick);
    }
    return {
      getValue() {
        return selectedValue;
      },
      getSelected() {
        return selectedOption;
      },
      setValue(value) {
        const option = options.find((o) => o.value === value);
        if (option) {
          selectOption(option);
        } else {
          selectedValue = value;
          selectedOption = null;
          inputValue = value;
          inputEl.value = value;
        }
      },
      setInputValue(text) {
        inputValue = text;
        inputEl.value = text;
        if (clearBtn) clearBtn.hidden = !text;
      },
      open,
      close,
      isOpen() {
        return isOpenState;
      },
      focus() {
        inputEl.focus();
      },
      setOptions(newOptions) {
        options = newOptions;
        if (isOpenState) {
          performSearch(inputValue);
        }
      },
      clear() {
        clearSelection();
      },
      setDisabled(value) {
        disabled = value;
        inputEl.disabled = disabled;
        if (disabled) {
          inputEl.setAttribute(ATTRS52.DISABLED, "");
          close();
        } else {
          inputEl.removeAttribute(ATTRS52.DISABLED);
        }
      },
      destroy() {
        close();
        inputEl.removeEventListener("input", handleInput);
        inputEl.removeEventListener("focus", handleFocus);
        inputEl.removeEventListener("blur", handleBlur);
        inputEl.removeEventListener("keydown", handleKeydown);
        optionsEl.removeEventListener("click", handleOptionsClick);
        clearBtn?.removeEventListener("click", handleClearClick);
        contentEl.remove();
        container.innerHTML = "";
      }
    };
  }
  var AtlasCombobox = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._combobox = null;
      this._options = [];
    }
    static get observedAttributes() {
      return ["placeholder", "disabled", "value", "min-chars"];
    }
    connectedCallback() {
      this._parseOptions();
      this._init();
    }
    disconnectedCallback() {
      this._combobox?.destroy();
      this._combobox = null;
    }
    attributeChangedCallback(name, _oldValue, newValue) {
      if (!this._combobox) return;
      switch (name) {
        case "disabled":
          this._combobox.setDisabled(newValue !== null);
          break;
        case "value":
          if (newValue) {
            this._combobox.setValue(newValue);
          }
          break;
      }
    }
    _parseOptions() {
      const dataOptions = this.getAttribute("data-options");
      if (dataOptions) {
        try {
          this._options = JSON.parse(dataOptions);
          return;
        } catch {
          console.warn("[AtlasCombobox] Invalid JSON in data-options");
        }
      }
      const datalistId = this.getAttribute("list");
      if (datalistId) {
        const datalist = document.getElementById(datalistId);
        if (datalist) {
          this._options = Array.from(datalist.querySelectorAll("option")).map((opt) => ({
            value: opt.value,
            label: opt.textContent || opt.value
          }));
        }
      }
    }
    _init() {
      this._combobox = createCombobox(this, {
        options: this._options,
        placeholder: this.getAttribute("placeholder") || void 0,
        disabled: this.hasAttribute("disabled"),
        value: this.getAttribute("value") || void 0,
        minChars: parseInt(this.getAttribute("min-chars") || "0", 10),
        allowCreate: this.hasAttribute("allow-create"),
        onChange: (value, option) => {
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { value, option },
              bubbles: true
            })
          );
        },
        onCreate: (value) => {
          this.dispatchEvent(
            new CustomEvent("create", {
              detail: { value },
              bubbles: true
            })
          );
        }
      });
    }
    // Public API
    get value() {
      return this._combobox?.getValue() || "";
    }
    set value(val) {
      this._combobox?.setValue(val);
    }
    get selected() {
      return this._combobox?.getSelected() || null;
    }
    open() {
      this._combobox?.open();
    }
    close() {
      this._combobox?.close();
    }
    clear() {
      this._combobox?.clear();
    }
    focus() {
      this._combobox?.focus();
    }
  };
  if (isBrowser() && !customElements.get("atlas-combobox")) {
    customElements.define("atlas-combobox", AtlasCombobox);
  }
  var ATTRS62 = {
    DIALOG: "data-atlas-command-dialog",
    INPUT: "data-atlas-command-input",
    LIST: "data-atlas-command-list",
    GROUP: "data-atlas-command-group",
    ITEM: "data-atlas-command-item",
    EMPTY: "data-atlas-command-empty"
  };
  var CLASSES62 = {
    ROOT: "atlas-command",
    DIALOG: "atlas-command-dialog",
    INPUT_WRAPPER: "atlas-command-input-wrapper",
    INPUT: "atlas-command-input",
    ICON: "atlas-command-icon",
    LIST: "atlas-command-list",
    GROUP: "atlas-command-group",
    GROUP_LABEL: "atlas-command-group-label",
    ITEM: "atlas-command-item",
    ITEM_ICON: "atlas-command-item-icon",
    ITEM_LABEL: "atlas-command-item-label",
    ITEM_SHORTCUT: "atlas-command-item-shortcut",
    ITEM_HIGHLIGHTED: "atlas-command-item--highlighted",
    ITEM_DISABLED: "atlas-command-item--disabled",
    EMPTY: "atlas-command-empty",
    OPEN: "atlas-command--open",
    BACKDROP: "atlas-command-backdrop"
  };
  var SEARCH_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  function createCommand(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState42();
    }
    const {
      items: initialItems = [],
      placeholder = "Type a command or search...",
      emptyMessage = "No results found.",
      searchDebounce = 150
    } = options;
    let isOpenState = false;
    let currentItems = initialItems;
    let currentQuery = "";
    let filteredItems = [];
    let searchTimeout = null;
    const id = generateId("command");
    let backdropEl = null;
    let dialogEl = null;
    let inputEl = null;
    let listEl = null;
    let emptyEl = null;
    let focusTrap = null;
    let unlockScrollFn = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES62.ROOT);
      element.setAttribute("data-atlas-command", "");
      element.id = id;
      backdropEl = document.createElement("div");
      backdropEl.className = CLASSES62.BACKDROP;
      backdropEl.addEventListener("click", close);
      element.appendChild(backdropEl);
      dialogEl = document.createElement("div");
      dialogEl.className = CLASSES62.DIALOG;
      dialogEl.setAttribute(ATTRS62.DIALOG, "");
      dialogEl.setAttribute("role", "dialog");
      dialogEl.setAttribute("aria-modal", "true");
      dialogEl.setAttribute("aria-label", "Command palette");
      const inputWrapper = document.createElement("div");
      inputWrapper.className = CLASSES62.INPUT_WRAPPER;
      inputWrapper.innerHTML = `<span class="${CLASSES62.ICON}" aria-hidden="true">${SEARCH_ICON}</span>`;
      inputEl = document.createElement("input");
      inputEl.className = CLASSES62.INPUT;
      inputEl.setAttribute(ATTRS62.INPUT, "");
      inputEl.type = "text";
      inputEl.placeholder = placeholder;
      inputEl.setAttribute("role", "combobox");
      inputEl.setAttribute("aria-autocomplete", "list");
      inputEl.setAttribute("aria-controls", `${id}-list`);
      inputWrapper.appendChild(inputEl);
      listEl = document.createElement("div");
      listEl.className = CLASSES62.LIST;
      listEl.setAttribute(ATTRS62.LIST, "");
      listEl.id = `${id}-list`;
      listEl.setAttribute("role", "listbox");
      emptyEl = document.createElement("div");
      emptyEl.className = CLASSES62.EMPTY;
      emptyEl.setAttribute(ATTRS62.EMPTY, "");
      emptyEl.textContent = emptyMessage;
      emptyEl.style.display = "none";
      dialogEl.appendChild(inputWrapper);
      dialogEl.appendChild(listEl);
      dialogEl.appendChild(emptyEl);
      element.appendChild(dialogEl);
      setupEvents();
      updateFilteredItems();
    }
    function setupEvents() {
      if (!inputEl) return;
      cleanups.push(addListener(inputEl, "input", handleInput));
      cleanups.push(addListener(inputEl, "keydown", handleInputKeydown));
    }
    function handleInput(event) {
      const target = event.target;
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      searchTimeout = setTimeout(() => {
        currentQuery = target.value;
        updateFilteredItems();
        options.onSearch?.(currentQuery);
      }, searchDebounce);
    }
    function handleInputKeydown(event) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          focusNextItem();
          break;
        case "ArrowUp":
          event.preventDefault();
          focusPreviousItem();
          break;
        case "Enter":
          event.preventDefault();
          selectHighlightedItem();
          break;
        case "Escape":
          event.preventDefault();
          close();
          break;
      }
    }
    function focusNextItem() {
      const items = listEl?.querySelectorAll(`[${ATTRS62.ITEM}]:not([aria-disabled="true"])`);
      if (!items || items.length === 0) return;
      const current = listEl?.querySelector(`.${CLASSES62.ITEM_HIGHLIGHTED}`);
      const currentIndex = current ? Array.from(items).indexOf(current) : -1;
      const nextIndex = (currentIndex + 1) % items.length;
      highlightItem(items[nextIndex]);
    }
    function focusPreviousItem() {
      const items = listEl?.querySelectorAll(`[${ATTRS62.ITEM}]:not([aria-disabled="true"])`);
      if (!items || items.length === 0) return;
      const current = listEl?.querySelector(`.${CLASSES62.ITEM_HIGHLIGHTED}`);
      const currentIndex = current ? Array.from(items).indexOf(current) : 0;
      const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      highlightItem(items[prevIndex]);
    }
    function highlightItem(el) {
      listEl?.querySelectorAll(`.${CLASSES62.ITEM_HIGHLIGHTED}`).forEach((item) => {
        item.classList.remove(CLASSES62.ITEM_HIGHLIGHTED);
      });
      el.classList.add(CLASSES62.ITEM_HIGHLIGHTED);
      el.scrollIntoView({ block: "nearest" });
    }
    function selectHighlightedItem() {
      const highlighted = listEl?.querySelector(`.${CLASSES62.ITEM_HIGHLIGHTED}`);
      if (!highlighted) return;
      const itemId = highlighted.getAttribute("data-id");
      const item = filteredItems.find((i) => i.id === itemId);
      if (item && !item.disabled) {
        selectItem(item);
      }
    }
    function selectItem(item) {
      item.onSelect?.();
      options.onSelect?.(item);
      close();
    }
    function flattenItems(items) {
      const result = [];
      for (const item of items) {
        if ("items" in item) {
          result.push(...item.items);
        } else {
          result.push(item);
        }
      }
      return result;
    }
    function defaultFilter3(item, query) {
      const searchText = query.toLowerCase();
      const label = item.label.toLowerCase();
      const keywords = item.keywords?.map((k) => k.toLowerCase()) ?? [];
      return label.includes(searchText) || keywords.some((k) => k.includes(searchText));
    }
    function updateFilteredItems() {
      const allItems = flattenItems(currentItems);
      const filterFn = options.filter ?? defaultFilter3;
      if (!currentQuery) {
        filteredItems = allItems.slice();
      } else {
        filteredItems = allItems.filter((item) => filterFn(item, currentQuery));
      }
      renderList();
    }
    function renderList() {
      if (!listEl || !emptyEl) return;
      listEl.innerHTML = "";
      if (filteredItems.length === 0) {
        emptyEl.style.display = "";
        return;
      }
      emptyEl.style.display = "none";
      const groups = /* @__PURE__ */ new Map();
      const ungrouped = [];
      for (const item of filteredItems) {
        if (item.group) {
          const group = groups.get(item.group) ?? [];
          group.push(item);
          groups.set(item.group, group);
        } else {
          ungrouped.push(item);
        }
      }
      ungrouped.forEach((item) => {
        listEl?.appendChild(createItemElement(item));
      });
      for (const [groupName, groupItems] of groups) {
        const groupEl = document.createElement("div");
        groupEl.className = CLASSES62.GROUP;
        groupEl.setAttribute(ATTRS62.GROUP, "");
        groupEl.setAttribute("role", "group");
        groupEl.setAttribute("aria-label", groupName);
        const labelEl = document.createElement("div");
        labelEl.className = CLASSES62.GROUP_LABEL;
        labelEl.textContent = groupName;
        groupEl.appendChild(labelEl);
        groupItems.forEach((item) => {
          groupEl.appendChild(createItemElement(item));
        });
        listEl?.appendChild(groupEl);
      }
      const firstItem = listEl.querySelector(
        `[${ATTRS62.ITEM}]:not([aria-disabled="true"])`
      );
      if (firstItem) {
        highlightItem(firstItem);
      }
    }
    function createItemElement(item) {
      const el = document.createElement("div");
      el.className = `${CLASSES62.ITEM} ${item.disabled ? CLASSES62.ITEM_DISABLED : ""}`;
      el.setAttribute(ATTRS62.ITEM, "");
      el.setAttribute("role", "option");
      el.setAttribute("data-id", item.id);
      if (item.disabled) {
        el.setAttribute("aria-disabled", "true");
      }
      let html = "";
      if (item.icon) {
        html += `<span class="${CLASSES62.ITEM_ICON}" aria-hidden="true">${item.icon}</span>`;
      }
      html += `<span class="${CLASSES62.ITEM_LABEL}">${escapeHtml2(item.label)}</span>`;
      if (item.shortcut) {
        html += `<span class="${CLASSES62.ITEM_SHORTCUT}">${escapeHtml2(item.shortcut)}</span>`;
      }
      el.innerHTML = html;
      if (!item.disabled) {
        el.addEventListener("click", () => selectItem(item));
        el.addEventListener("mouseenter", () => highlightItem(el));
      }
      return el;
    }
    function open() {
      if (isOpenState) return;
      isOpenState = true;
      element.classList.add(CLASSES62.OPEN);
      unlockScrollFn = lockScroll();
      if (dialogEl) {
        focusTrap = createFocusTrap({
          container: dialogEl,
          initialFocus: inputEl ?? "first"
        });
        focusTrap.activate();
      }
      requestAnimationFrame(() => {
        inputEl?.focus();
        inputEl?.select();
      });
      options.onOpen?.();
    }
    function close() {
      if (!isOpenState) return;
      isOpenState = false;
      element.classList.remove(CLASSES62.OPEN);
      if (inputEl) {
        inputEl.value = "";
      }
      currentQuery = "";
      updateFilteredItems();
      focusTrap?.deactivate();
      focusTrap = null;
      unlockScrollFn?.();
      unlockScrollFn = null;
      options.onClose?.();
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function setQuery(query) {
      currentQuery = query;
      if (inputEl) {
        inputEl.value = query;
      }
      updateFilteredItems();
    }
    function setItems(items) {
      currentItems = items;
      updateFilteredItems();
    }
    function destroy() {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      if (isOpenState) {
        focusTrap?.deactivate();
        unlockScrollFn?.();
      }
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES62.ROOT, CLASSES62.OPEN);
      element.removeAttribute("data-atlas-command");
      element.innerHTML = "";
    }
    init();
    return {
      isOpen: () => isOpenState,
      open,
      close,
      toggle,
      getQuery: () => currentQuery,
      setQuery,
      getItems: () => [...currentItems],
      setItems,
      getFilteredItems: () => [...filteredItems],
      destroy
    };
  }
  function createNoopState42() {
    return {
      isOpen: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      getQuery: () => "",
      setQuery: () => {
      },
      getItems: () => [],
      setItems: () => {
      },
      getFilteredItems: () => [],
      destroy: () => {
      }
    };
  }
  function escapeHtml2(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
  var ATTRS72 = {
    BACKDROP: "data-atlas-dialog-backdrop",
    CONTENT: "data-atlas-dialog-content",
    TITLE: "data-atlas-dialog-title",
    DESCRIPTION: "data-atlas-dialog-description",
    CLOSE: "data-atlas-dialog-close"
  };
  var CLASSES72 = {
    ROOT: "atlas-dialog",
    BACKDROP: "atlas-dialog-backdrop",
    WRAPPER: "atlas-dialog-wrapper",
    CONTENT: "atlas-dialog-content",
    OPEN: "atlas-dialog--open",
    CLOSING: "atlas-dialog--closing"
  };
  var SIZE_CLASSES3 = {
    sm: "atlas-dialog--sm",
    default: "atlas-dialog--default",
    lg: "atlas-dialog--lg",
    xl: "atlas-dialog--xl",
    full: "atlas-dialog--full"
  };
  function createDialog(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState52();
    }
    const {
      modal = true,
      size: size2 = "default",
      closeOnEsc = true,
      closeOnBackdrop = true,
      open: initialOpen = false
    } = options;
    let isOpenState = false;
    let currentSize = size2;
    let previouslyFocused = null;
    const id = generateId("dialog");
    let backdrop = null;
    let wrapper = null;
    let content = null;
    let focusTrap = null;
    let dismissHandler = null;
    let unlockScrollFn = null;
    function init() {
      element.classList.add(CLASSES72.ROOT);
      element.setAttribute("data-atlas-dialog", "");
      element.setAttribute("role", "dialog");
      element.setAttribute("aria-modal", modal ? "true" : "false");
      element.id = id;
      applySizeClass();
      backdrop = element.querySelector(`[${ATTRS72.BACKDROP}]`);
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = CLASSES72.BACKDROP;
        backdrop.setAttribute(ATTRS72.BACKDROP, "");
        element.insertBefore(backdrop, element.firstChild);
      }
      wrapper = element.querySelector(`.${CLASSES72.WRAPPER}`);
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = CLASSES72.WRAPPER;
        const existingContent = element.querySelector(`[${ATTRS72.CONTENT}]`);
        if (existingContent) {
          wrapper.appendChild(existingContent);
        }
        element.appendChild(wrapper);
      }
      content = element.querySelector(`[${ATTRS72.CONTENT}]`);
      if (!content) {
        content = wrapper.querySelector(`.${CLASSES72.CONTENT}`);
      }
      if (content) {
        content.setAttribute("tabindex", "-1");
      }
      const title = element.querySelector(`[${ATTRS72.TITLE}]`);
      if (title) {
        const titleId = `${id}-title`;
        title.id = titleId;
        element.setAttribute("aria-labelledby", titleId);
      }
      const description = element.querySelector(`[${ATTRS72.DESCRIPTION}]`);
      if (description) {
        const descId = `${id}-desc`;
        description.id = descId;
        element.setAttribute("aria-describedby", descId);
      }
      setupCloseButtons();
      if (closeOnBackdrop && backdrop) {
        backdrop.addEventListener("click", handleBackdropClick);
      }
      if (initialOpen) {
        requestAnimationFrame(() => open());
      }
    }
    function setupCloseButtons() {
      const closeButtons = element.querySelectorAll(`[${ATTRS72.CLOSE}]`);
      closeButtons.forEach((btn) => {
        btn.addEventListener("click", close);
        if (!btn.getAttribute("aria-label")) {
          btn.setAttribute("aria-label", "Close dialog");
        }
      });
    }
    function handleBackdropClick(event) {
      if (event.target === backdrop) {
        close();
      }
    }
    function applySizeClass() {
      Object.values(SIZE_CLASSES3).forEach((cls) => {
        element.classList.remove(cls);
      });
      element.classList.add(SIZE_CLASSES3[currentSize]);
    }
    function open() {
      if (isOpenState) return;
      isOpenState = true;
      previouslyFocused = document.activeElement;
      element.classList.add(CLASSES72.OPEN);
      element.removeAttribute("hidden");
      if (modal) {
        unlockScrollFn = lockScroll();
      }
      const trapTarget = content ?? wrapper ?? element;
      focusTrap = createFocusTrap({
        container: trapTarget,
        initialFocus: "container",
        returnFocus: previouslyFocused ?? "previous"
      });
      focusTrap.activate();
      if (closeOnEsc) {
        dismissHandler = createDismissHandler(element, {
          escapeKey: true,
          clickOutside: false,
          onDismiss: close
        });
      }
      requestAnimationFrame(() => {
        (content ?? element).focus();
      });
      options.onOpen?.();
    }
    function close() {
      if (!isOpenState) return;
      isOpenState = false;
      element.classList.add(CLASSES72.CLOSING);
      setTimeout(() => {
        element.classList.remove(CLASSES72.OPEN, CLASSES72.CLOSING);
        element.setAttribute("hidden", "");
        focusTrap?.deactivate();
        focusTrap = null;
        dismissHandler?.destroy();
        dismissHandler = null;
        unlockScrollFn?.();
        unlockScrollFn = null;
        previouslyFocused?.focus();
        previouslyFocused = null;
        options.onClose?.();
      }, ANIMATION_DURATION.normal);
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function setSize(newSize) {
      currentSize = newSize;
      applySizeClass();
    }
    function destroy() {
      if (isOpenState) {
        element.classList.remove(CLASSES72.OPEN, CLASSES72.CLOSING);
        focusTrap?.deactivate();
        dismissHandler?.destroy();
        unlockScrollFn?.();
      }
      backdrop?.removeEventListener("click", handleBackdropClick);
      const closeButtons = element.querySelectorAll(`[${ATTRS72.CLOSE}]`);
      closeButtons.forEach((btn) => {
        btn.removeEventListener("click", close);
      });
      element.classList.remove(CLASSES72.ROOT, CLASSES72.OPEN, ...Object.values(SIZE_CLASSES3));
      element.removeAttribute("data-atlas-dialog");
      element.removeAttribute("role");
      element.removeAttribute("aria-modal");
    }
    init();
    return {
      isOpen: () => isOpenState,
      open,
      close,
      toggle,
      setSize,
      getSize: () => currentSize,
      destroy
    };
  }
  function createNoopState52() {
    return {
      isOpen: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      setSize: () => {
      },
      getSize: () => "default",
      destroy: () => {
      }
    };
  }
  function createInput(element, options = {}) {
    if (!isBrowser()) {
      return createNoopInputState();
    }
    const {
      size: size2 = "md",
      focusGlow = true,
      shakeOnError = true,
      validate: validate2,
      validateDebounce = 300,
      validateOnBlur = true,
      validateOnInput = false,
      showCount = false,
      maxLength,
      onValidate,
      onChange,
      onFocus,
      onBlur
    } = options;
    let isValid = true;
    let errorMessage = null;
    let isFocused = false;
    let validateTimeout = null;
    let countElement = null;
    const cleanupListeners = [];
    const originalTransition = element.style.transition;
    const originalBoxShadow = element.style.boxShadow;
    element.classList.add("atlas-input");
    element.classList.add(`atlas-input-${size2}`);
    element.style.transition = `
    border-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
    box-shadow ${ANIMATION_DURATION.fast}ms ${EASING.standard}
  `.replace(/\s+/g, " ").trim();
    if (maxLength !== void 0) {
      element.setAttribute("maxlength", String(maxLength));
    }
    if (showCount) {
      countElement = document.createElement("span");
      countElement.className = "atlas-input-count";
      countElement.style.cssText = `
      position: absolute;
      right: 0.75rem;
      bottom: 0.5rem;
      font-size: 0.75rem;
      color: hsl(var(--atlas-muted-foreground));
      pointer-events: none;
    `;
      updateCount();
      const parent = element.parentElement;
      if (parent && !parent.classList.contains("atlas-input-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "atlas-input-wrapper";
        wrapper.style.position = "relative";
        parent.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        wrapper.appendChild(countElement);
      } else if (parent) {
        parent.appendChild(countElement);
      }
    }
    function updateCount() {
      if (countElement) {
        const current = element.value.length;
        const max = maxLength || "";
        countElement.textContent = max ? `${current}/${max}` : String(current);
        if (maxLength) {
          if (current >= maxLength) {
            countElement.style.color = "hsl(var(--atlas-destructive))";
          } else if (current >= maxLength * 0.9) {
            countElement.style.color = "hsl(var(--atlas-warning))";
          } else {
            countElement.style.color = "hsl(var(--atlas-muted-foreground))";
          }
        }
      }
    }
    function applyFocusGlow() {
      if (!focusGlow) return;
      element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-ring) / 0.2)";
    }
    function removeFocusGlow() {
      if (!isValid) {
        element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
      } else {
        element.style.boxShadow = originalBoxShadow;
      }
    }
    function shakeElement() {
      if (!shakeOnError || !element.animate) return;
      element.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" }
        ],
        {
          duration: 400,
          easing: "ease-in-out"
        }
      );
    }
    function runValidation() {
      if (!validate2) {
        isValid = true;
        errorMessage = null;
        return true;
      }
      const result = validate2(element.value);
      isValid = result === null;
      errorMessage = result;
      if (isValid) {
        element.classList.remove("atlas-input-error");
        element.removeAttribute("aria-invalid");
        element.removeAttribute("aria-errormessage");
        removeFocusGlow();
      } else {
        element.classList.add("atlas-input-error");
        element.setAttribute("aria-invalid", "true");
        element.style.borderColor = "hsl(var(--atlas-destructive))";
        element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
        shakeElement();
      }
      onValidate?.(isValid, errorMessage || void 0);
      return isValid;
    }
    function debouncedValidate() {
      if (validateTimeout) {
        clearTimeout(validateTimeout);
      }
      validateTimeout = setTimeout(() => {
        runValidation();
      }, validateDebounce);
    }
    const handleFocus = () => {
      isFocused = true;
      applyFocusGlow();
      onFocus?.();
    };
    const handleBlur = () => {
      isFocused = false;
      removeFocusGlow();
      if (validateOnBlur && validate2) {
        runValidation();
      }
      onBlur?.();
    };
    const handleInput = () => {
      onChange?.(element.value);
      if (showCount) {
        updateCount();
      }
      if (validateOnInput && validate2) {
        debouncedValidate();
      }
      if (!isValid) {
        element.style.borderColor = "";
        if (isFocused) {
          applyFocusGlow();
        } else {
          element.style.boxShadow = originalBoxShadow;
        }
      }
    };
    cleanupListeners.push(
      addListener(element, "focus", handleFocus),
      addListener(element, "blur", handleBlur),
      addListener(element, "input", handleInput)
    );
    const setValue = (value) => {
      element.value = value;
      if (showCount) {
        updateCount();
      }
      onChange?.(value);
    };
    const validateFn = () => {
      return runValidation();
    };
    const setError = (message) => {
      isValid = false;
      errorMessage = message;
      element.classList.add("atlas-input-error");
      element.setAttribute("aria-invalid", "true");
      element.style.borderColor = "hsl(var(--atlas-destructive))";
      element.style.boxShadow = "0 0 0 3px hsl(var(--atlas-destructive) / 0.2)";
      shakeElement();
      onValidate?.(false, message);
    };
    const clearError = () => {
      isValid = true;
      errorMessage = null;
      element.classList.remove("atlas-input-error");
      element.removeAttribute("aria-invalid");
      element.style.borderColor = "";
      if (isFocused) {
        applyFocusGlow();
      } else {
        element.style.boxShadow = originalBoxShadow;
      }
      onValidate?.(true);
    };
    const focus = () => {
      element.focus();
    };
    const blur = () => {
      element.blur();
    };
    const selectAll = () => {
      element.select();
    };
    const destroy = () => {
      if (validateTimeout) {
        clearTimeout(validateTimeout);
      }
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.style.transition = originalTransition;
      element.style.boxShadow = originalBoxShadow;
      element.classList.remove("atlas-input", `atlas-input-${size2}`, "atlas-input-error");
      if (countElement) {
        countElement.remove();
      }
    };
    return {
      get value() {
        return element.value;
      },
      get isValid() {
        return isValid;
      },
      get errorMessage() {
        return errorMessage;
      },
      get isFocused() {
        return isFocused;
      },
      setValue,
      validate: validateFn,
      setError,
      clearError,
      focus,
      blur,
      selectAll,
      destroy
    };
  }
  function createNoopInputState() {
    return {
      get value() {
        return "";
      },
      get isValid() {
        return true;
      },
      get errorMessage() {
        return null;
      },
      get isFocused() {
        return false;
      },
      setValue: () => {
      },
      validate: () => true,
      setError: () => {
      },
      clearError: () => {
      },
      focus: () => {
      },
      blur: () => {
      },
      selectAll: () => {
      },
      destroy: () => {
      }
    };
  }
  function createLabel(element, options = {}) {
    if (!isBrowser()) {
      return createNoopLabelState();
    }
    const {
      for: forId,
      required = false,
      optional = false,
      requiredText = "*",
      optionalText = "(optional)",
      hasError: initialError = false
    } = options;
    let hasError = initialError;
    let requiredIndicator = null;
    let optionalIndicator = null;
    let associatedInput = null;
    const cleanupListeners = [];
    element.classList.add("atlas-label");
    if (forId) {
      if (element.tagName.toLowerCase() === "label") {
        element.htmlFor = forId;
      }
      associatedInput = document.getElementById(forId);
    }
    if (required) {
      addRequiredIndicator();
    }
    if (optional && !required) {
      addOptionalIndicator();
    }
    if (hasError) {
      element.classList.add("atlas-label-error");
    }
    if (element.tagName.toLowerCase() !== "label" && forId) {
      const handleClick = () => {
        const input = document.getElementById(forId);
        if (input && "focus" in input) {
          input.focus();
        }
      };
      cleanupListeners.push(addListener(element, "click", handleClick));
      element.style.cursor = "pointer";
    }
    function addRequiredIndicator() {
      if (requiredIndicator) return;
      requiredIndicator = document.createElement("span");
      requiredIndicator.className = "atlas-label-required";
      requiredIndicator.textContent = requiredText;
      requiredIndicator.setAttribute("aria-hidden", "true");
      requiredIndicator.style.cssText = `
      color: hsl(var(--atlas-destructive));
      margin-left: 0.25rem;
    `;
      element.appendChild(requiredIndicator);
    }
    function removeRequiredIndicator() {
      if (requiredIndicator) {
        requiredIndicator.remove();
        requiredIndicator = null;
      }
    }
    function addOptionalIndicator() {
      if (optionalIndicator) return;
      optionalIndicator = document.createElement("span");
      optionalIndicator.className = "atlas-label-optional";
      optionalIndicator.textContent = ` ${optionalText}`;
      optionalIndicator.style.cssText = `
      color: hsl(var(--atlas-muted-foreground));
      font-weight: normal;
      font-size: 0.875em;
    `;
      element.appendChild(optionalIndicator);
    }
    function removeOptionalIndicator() {
      if (optionalIndicator) {
        optionalIndicator.remove();
        optionalIndicator = null;
      }
    }
    const setError = (error2) => {
      hasError = error2;
      if (error2) {
        element.classList.add("atlas-label-error");
      } else {
        element.classList.remove("atlas-label-error");
      }
    };
    const setRequired = (required2) => {
      if (required2) {
        removeOptionalIndicator();
        addRequiredIndicator();
      } else {
        removeRequiredIndicator();
      }
    };
    const setFor = (inputId) => {
      if (element.tagName.toLowerCase() === "label") {
        element.htmlFor = inputId;
      }
      associatedInput = document.getElementById(inputId);
    };
    const destroy = () => {
      cleanupListeners.forEach((cleanup2) => cleanup2());
      removeRequiredIndicator();
      removeOptionalIndicator();
      element.classList.remove("atlas-label", "atlas-label-error");
    };
    return {
      get hasError() {
        return hasError;
      },
      get associatedInput() {
        return associatedInput;
      },
      setError,
      setRequired,
      setFor,
      destroy
    };
  }
  function createNoopLabelState() {
    return {
      get hasError() {
        return false;
      },
      get associatedInput() {
        return null;
      },
      setError: () => {
      },
      setRequired: () => {
      },
      setFor: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS82 = {
    ROOT: "data-atlas-marquee",
    CONTENT: "data-atlas-marquee-content",
    INNER: "data-atlas-marquee-inner"
  };
  var CLASSES82 = {
    ROOT: "atlas-marquee",
    INNER: "atlas-marquee-inner",
    CONTENT: "atlas-marquee-content",
    GRADIENT_LEFT: "atlas-marquee-gradient-left",
    GRADIENT_RIGHT: "atlas-marquee-gradient-right",
    GRADIENT_TOP: "atlas-marquee-gradient-top",
    GRADIENT_BOTTOM: "atlas-marquee-gradient-bottom",
    PAUSED: "atlas-marquee-paused"
  };
  function createMarquee(container, config2 = {}) {
    if (!isBrowser()) {
      return {
        play: () => {
        },
        pause: () => {
        },
        isPlaying: () => false,
        setSpeed: () => {
        },
        setDirection: () => {
        },
        destroy: () => {
        }
      };
    }
    const {
      direction: initialDirection = "left",
      speed: initialSpeed = 50,
      pauseOnHover = true,
      gap = 40,
      gradient = true,
      gradientSize = 50,
      gradientColor = "white",
      copies: configCopies,
      easing: _easing = "linear",
      delay = 0,
      autoplay = true,
      onCycle
    } = config2;
    let direction = initialDirection;
    let speed = initialSpeed;
    let playing = false;
    let animationId = null;
    let startTime = null;
    let pausedAt = 0;
    let offset = 0;
    const isHorizontal = direction === "left" || direction === "right";
    const isReverse = direction === "right" || direction === "down";
    const originalContent = container.innerHTML;
    container.innerHTML = "";
    container.setAttribute(ATTRS82.ROOT, "");
    container.classList.add(CLASSES82.ROOT);
    container.style.overflow = "hidden";
    container.style.position = "relative";
    const innerEl = document.createElement("div");
    innerEl.className = CLASSES82.INNER;
    innerEl.setAttribute(ATTRS82.INNER, "");
    innerEl.style.display = "flex";
    innerEl.style.flexDirection = isHorizontal ? "row" : "column";
    innerEl.style.width = isHorizontal ? "max-content" : "100%";
    innerEl.style.height = isHorizontal ? "100%" : "max-content";
    innerEl.style.gap = `${gap}px`;
    const contentEl = document.createElement("div");
    contentEl.className = CLASSES82.CONTENT;
    contentEl.setAttribute(ATTRS82.CONTENT, "");
    contentEl.innerHTML = originalContent;
    contentEl.style.display = "flex";
    contentEl.style.flexDirection = isHorizontal ? "row" : "column";
    contentEl.style.gap = `${gap}px`;
    contentEl.style.flexShrink = "0";
    innerEl.appendChild(contentEl);
    container.appendChild(innerEl);
    let contentSize = isHorizontal ? contentEl.offsetWidth : contentEl.offsetHeight;
    const containerSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
    const copies = configCopies ?? Math.ceil(containerSize * 2 / contentSize) + 1;
    for (let i = 0; i < copies; i++) {
      const copy = contentEl.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      innerEl.appendChild(copy);
    }
    contentSize = contentSize + gap;
    if (gradient) {
      const gradientStyle = `
      position: absolute;
      z-index: 1;
      pointer-events: none;
    `;
      if (isHorizontal) {
        const leftGradient = document.createElement("div");
        leftGradient.className = CLASSES82.GRADIENT_LEFT;
        leftGradient.style.cssText = `
        ${gradientStyle}
        left: 0;
        top: 0;
        bottom: 0;
        width: ${gradientSize}px;
        background: linear-gradient(to right, ${gradientColor}, transparent);
      `;
        const rightGradient = document.createElement("div");
        rightGradient.className = CLASSES82.GRADIENT_RIGHT;
        rightGradient.style.cssText = `
        ${gradientStyle}
        right: 0;
        top: 0;
        bottom: 0;
        width: ${gradientSize}px;
        background: linear-gradient(to left, ${gradientColor}, transparent);
      `;
        container.appendChild(leftGradient);
        container.appendChild(rightGradient);
      } else {
        const topGradient = document.createElement("div");
        topGradient.className = CLASSES82.GRADIENT_TOP;
        topGradient.style.cssText = `
        ${gradientStyle}
        left: 0;
        right: 0;
        top: 0;
        height: ${gradientSize}px;
        background: linear-gradient(to bottom, ${gradientColor}, transparent);
      `;
        const bottomGradient = document.createElement("div");
        bottomGradient.className = CLASSES82.GRADIENT_BOTTOM;
        bottomGradient.style.cssText = `
        ${gradientStyle}
        left: 0;
        right: 0;
        bottom: 0;
        height: ${gradientSize}px;
        background: linear-gradient(to top, ${gradientColor}, transparent);
      `;
        container.appendChild(topGradient);
        container.appendChild(bottomGradient);
      }
    }
    function animate2(timestamp) {
      if (!playing) return;
      if (startTime === null) {
        startTime = timestamp - pausedAt;
      }
      const elapsed = timestamp - startTime;
      const pixelsMoved = elapsed / 1e3 * speed;
      offset = pixelsMoved % contentSize;
      const translateValue = isReverse ? offset : -offset;
      if (isHorizontal) {
        innerEl.style.transform = `translateX(${translateValue}px)`;
      } else {
        innerEl.style.transform = `translateY(${translateValue}px)`;
      }
      if (onCycle && Math.floor(pixelsMoved / contentSize) > Math.floor((pixelsMoved - speed / 60) / contentSize)) {
        onCycle();
      }
      animationId = requestAnimationFrame(animate2);
    }
    function play() {
      if (playing) return;
      playing = true;
      container.classList.remove(CLASSES82.PAUSED);
      animationId = requestAnimationFrame(animate2);
    }
    function pause() {
      if (!playing) return;
      playing = false;
      container.classList.add(CLASSES82.PAUSED);
      pausedAt = performance.now() - (startTime || 0);
      startTime = null;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }
    function handleMouseEnter() {
      if (pauseOnHover && playing) {
        pause();
        container.dataset.wasPlaying = "true";
      }
    }
    function handleMouseLeave() {
      if (pauseOnHover && container.dataset.wasPlaying === "true") {
        delete container.dataset.wasPlaying;
        play();
      }
    }
    if (pauseOnHover) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    if (autoplay) {
      if (delay > 0) {
        setTimeout(play, delay);
      } else {
        play();
      }
    }
    return {
      play,
      pause,
      isPlaying() {
        return playing;
      },
      setSpeed(newSpeed) {
        const wasPlaying = playing;
        if (wasPlaying) pause();
        speed = newSpeed;
        if (wasPlaying) play();
      },
      setDirection(newDirection) {
        direction = newDirection;
        console.warn("[Marquee] Direction change requires rebuild");
      },
      destroy() {
        pause();
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.innerHTML = originalContent;
        container.removeAttribute(ATTRS82.ROOT);
        container.classList.remove(CLASSES82.ROOT);
        container.style.overflow = "";
        container.style.position = "";
      }
    };
  }
  var AtlasMarquee = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._marquee = null;
    }
    static get observedAttributes() {
      return ["speed", "direction", "pause-on-hover", "gap", "gradient"];
    }
    connectedCallback() {
      requestAnimationFrame(() => {
        this._init();
      });
    }
    disconnectedCallback() {
      this._marquee?.destroy();
      this._marquee = null;
    }
    attributeChangedCallback(name, _oldValue, newValue) {
      if (!this._marquee) return;
      switch (name) {
        case "speed":
          this._marquee.setSpeed(parseFloat(newValue) || 50);
          break;
      }
    }
    _init() {
      this._marquee = createMarquee(this, {
        speed: parseFloat(this.getAttribute("speed") || "50"),
        direction: this.getAttribute("direction") || "left",
        pauseOnHover: this.getAttribute("pause-on-hover") !== "false",
        gap: parseFloat(this.getAttribute("gap") || "40"),
        gradient: this.getAttribute("gradient") !== "false",
        gradientSize: parseFloat(this.getAttribute("gradient-size") || "50"),
        gradientColor: this.getAttribute("gradient-color") || "white"
      });
    }
    play() {
      this._marquee?.play();
    }
    pause() {
      this._marquee?.pause();
    }
  };
  if (isBrowser() && !customElements.get("atlas-marquee")) {
    customElements.define("atlas-marquee", AtlasMarquee);
  }
  var ATTRS92 = {
    TRIGGER: "data-atlas-menu-trigger",
    CONTENT: "data-atlas-menu-content",
    ITEM: "data-atlas-menu-item",
    SEPARATOR: "data-atlas-menu-separator",
    LABEL: "data-atlas-menu-label"
  };
  var CLASSES92 = {
    ROOT: "atlas-menu",
    CONTENT: "atlas-menu-content",
    ITEM: "atlas-menu-item",
    ITEM_DISABLED: "atlas-menu-item--disabled",
    ITEM_HIGHLIGHTED: "atlas-menu-item--highlighted",
    SEPARATOR: "atlas-menu-separator",
    LABEL: "atlas-menu-label",
    SHORTCUT: "atlas-menu-shortcut",
    ICON: "atlas-menu-icon",
    INDICATOR: "atlas-menu-indicator",
    OPEN: "atlas-menu--open"
  };
  function createMenu(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState62();
    }
    const {
      trigger: trigger2 = "click",
      placement = "bottom-start",
      offset = 4,
      items: initialItems = [],
      closeOnSelect = true
    } = options;
    let isOpenState = false;
    let currentItems = initialItems;
    let contextPosition = null;
    const id = generateId("menu");
    let triggerEl = null;
    let contentEl = null;
    let dismissHandler = null;
    let rovingFocus = null;
    let cleanupAutoUpdate = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES92.ROOT);
      element.setAttribute("data-atlas-menu", "");
      triggerEl = element.querySelector(`[${ATTRS92.TRIGGER}]`);
      if (!triggerEl) {
        triggerEl = element.firstElementChild;
        triggerEl?.setAttribute(ATTRS92.TRIGGER, "");
      }
      contentEl = element.querySelector(`[${ATTRS92.CONTENT}]`);
      if (!contentEl) {
        contentEl = document.createElement("div");
        contentEl.className = CLASSES92.CONTENT;
        contentEl.setAttribute(ATTRS92.CONTENT, "");
        element.appendChild(contentEl);
      }
      contentEl.id = `${id}-content`;
      contentEl.setAttribute("role", "menu");
      contentEl.setAttribute("tabindex", "-1");
      contentEl.style.display = "none";
      if (triggerEl) {
        triggerEl.id = triggerEl.id || `${id}-trigger`;
        triggerEl.setAttribute("aria-haspopup", "menu");
        triggerEl.setAttribute("aria-expanded", "false");
        triggerEl.setAttribute("aria-controls", contentEl.id);
      }
      setupTriggerEvents();
      if (currentItems.length > 0) {
        renderItems();
      }
    }
    function setupTriggerEvents() {
      if (!triggerEl) return;
      switch (trigger2) {
        case "click":
          cleanups.push(addListener(triggerEl, "click", handleTriggerClick));
          cleanups.push(addListener(triggerEl, "keydown", handleTriggerKeydown));
          break;
        case "contextmenu":
          cleanups.push(addListener(triggerEl, "contextmenu", handleContextMenu));
          break;
        case "hover":
          cleanups.push(addListener(triggerEl, "mouseenter", () => open()));
          cleanups.push(addListener(triggerEl, "mouseleave", handleMouseLeave));
          if (contentEl) {
            cleanups.push(addListener(contentEl, "mouseleave", handleMouseLeave));
          }
          break;
      }
    }
    function handleTriggerClick(event) {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    }
    function handleTriggerKeydown(event) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        open();
      }
    }
    function handleContextMenu(event) {
      event.preventDefault();
      contextPosition = { x: event.clientX, y: event.clientY };
      open(contextPosition);
    }
    function handleMouseLeave() {
      setTimeout(() => {
        if (!element.matches(":hover")) {
          close();
        }
      }, 100);
    }
    function renderItems() {
      if (!contentEl) return;
      contentEl.innerHTML = "";
      currentItems.forEach((item) => {
        const el = createMenuItemElement(item);
        contentEl?.appendChild(el);
      });
      rovingFocus?.destroy();
      rovingFocus = createRovingFocus(contentEl, {
        itemSelector: `[${ATTRS92.ITEM}]:not([aria-disabled="true"])`,
        orientation: "vertical",
        loop: true
      });
    }
    function createMenuItemElement(item) {
      if (item.type === "separator") {
        const sep = document.createElement("div");
        sep.className = CLASSES92.SEPARATOR;
        sep.setAttribute(ATTRS92.SEPARATOR, "");
        sep.setAttribute("role", "separator");
        return sep;
      }
      if (item.type === "label") {
        const label = document.createElement("div");
        label.className = CLASSES92.LABEL;
        label.setAttribute(ATTRS92.LABEL, "");
        label.textContent = item.label;
        return label;
      }
      const el = document.createElement("div");
      el.className = CLASSES92.ITEM;
      el.setAttribute(ATTRS92.ITEM, "");
      el.setAttribute(
        "role",
        item.type === "checkbox" ? "menuitemcheckbox" : item.type === "radio" ? "menuitemradio" : "menuitem"
      );
      el.setAttribute("data-id", item.id);
      el.tabIndex = -1;
      if (item.disabled) {
        el.classList.add(CLASSES92.ITEM_DISABLED);
        el.setAttribute("aria-disabled", "true");
      }
      if (item.type === "checkbox" || item.type === "radio") {
        el.setAttribute("aria-checked", item.checked ? "true" : "false");
      }
      let html = "";
      if (item.type === "checkbox" || item.type === "radio") {
        html += `<span class="${CLASSES92.INDICATOR}" aria-hidden="true">`;
        if (item.checked) {
          html += item.type === "checkbox" ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>';
        }
        html += "</span>";
      }
      if (item.icon) {
        html += `<span class="${CLASSES92.ICON}" aria-hidden="true">${item.icon}</span>`;
      }
      html += `<span class="atlas-menu-label">${escapeHtml22(item.label)}</span>`;
      if (item.shortcut) {
        html += `<span class="${CLASSES92.SHORTCUT}">${escapeHtml22(item.shortcut)}</span>`;
      }
      if (item.items && item.items.length > 0) {
        html += '<svg class="atlas-menu-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      }
      el.innerHTML = html;
      if (!item.disabled) {
        el.addEventListener("click", () => selectItem(item));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectItem(item);
          }
        });
        el.addEventListener("mouseenter", () => highlightItem(el));
      }
      return el;
    }
    function highlightItem(el) {
      contentEl?.querySelectorAll(`.${CLASSES92.ITEM_HIGHLIGHTED}`).forEach((item) => {
        item.classList.remove(CLASSES92.ITEM_HIGHLIGHTED);
      });
      el.classList.add(CLASSES92.ITEM_HIGHLIGHTED);
      el.focus();
    }
    function selectItem(item) {
      if (item.disabled) return;
      if (item.type === "checkbox") {
        item.checked = !item.checked;
        renderItems();
      } else if (item.type === "radio" && item.group) {
        currentItems.forEach((i) => {
          if (i.type === "radio" && i.group === item.group) {
            i.checked = i.id === item.id;
          }
        });
        renderItems();
      }
      item.onSelect?.();
      options.onSelect?.(item);
      if (closeOnSelect && item.type !== "checkbox" && item.type !== "radio") {
        close();
      }
    }
    function open(position) {
      if (isOpenState || !contentEl) return;
      isOpenState = true;
      contextPosition = position ?? null;
      triggerEl?.setAttribute("aria-expanded", "true");
      contentEl.style.display = "";
      element.classList.add(CLASSES92.OPEN);
      updatePosition();
      if (!contextPosition && triggerEl) {
        cleanupAutoUpdate = autoUpdate(triggerEl, contentEl, updatePosition);
      }
      dismissHandler = createDismissHandler(contentEl, {
        escapeKey: true,
        clickOutside: true,
        ignore: triggerEl ? [triggerEl] : [],
        onDismiss: close
      });
      requestAnimationFrame(() => {
        const firstItem = contentEl?.querySelector(
          `[${ATTRS92.ITEM}]:not([aria-disabled="true"])`
        );
        if (firstItem) {
          highlightItem(firstItem);
        }
      });
      options.onOpen?.();
    }
    function close() {
      if (!isOpenState || !contentEl) return;
      isOpenState = false;
      contextPosition = null;
      triggerEl?.setAttribute("aria-expanded", "false");
      element.classList.remove(CLASSES92.OPEN);
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      dismissHandler?.destroy();
      dismissHandler = null;
      contentEl.querySelectorAll(`.${CLASSES92.ITEM_HIGHLIGHTED}`).forEach((item) => {
        item.classList.remove(CLASSES92.ITEM_HIGHLIGHTED);
      });
      setTimeout(() => {
        if (!isOpenState && contentEl) {
          contentEl.style.display = "none";
        }
      }, ANIMATION_DURATION.fast);
      triggerEl?.focus();
      options.onClose?.();
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function updatePosition() {
      if (!contentEl) return;
      if (contextPosition) {
        contentEl.style.position = "fixed";
        contentEl.style.left = `${contextPosition.x}px`;
        contentEl.style.top = `${contextPosition.y}px`;
      } else if (triggerEl) {
        const result = computeFloatingPosition(triggerEl, contentEl, {
          placement,
          offset,
          flip: true,
          shift: true
        });
        contentEl.style.position = "absolute";
        contentEl.style.left = `${result.x}px`;
        contentEl.style.top = `${result.y}px`;
      }
    }
    function destroy() {
      if (isOpenState) {
        dismissHandler?.destroy();
        cleanupAutoUpdate?.();
      }
      rovingFocus?.destroy();
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES92.ROOT, CLASSES92.OPEN);
      element.removeAttribute("data-atlas-menu");
    }
    init();
    return {
      isOpen: () => isOpenState,
      open,
      close,
      toggle,
      getItems: () => [...currentItems],
      setItems: (items) => {
        currentItems = items;
        renderItems();
      },
      getCheckedItems: () => currentItems.filter((i) => i.checked),
      destroy
    };
  }
  function createNoopState62() {
    return {
      isOpen: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      getItems: () => [],
      setItems: () => {
      },
      getCheckedItems: () => [],
      destroy: () => {
      }
    };
  }
  function escapeHtml22(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
  var ATTRS10 = {
    TRIGGER: "data-atlas-popover-trigger",
    CONTENT: "data-atlas-popover-content",
    ARROW: "data-atlas-popover-arrow"
  };
  var CLASSES10 = {
    ROOT: "atlas-popover",
    OPEN: "atlas-popover--open"
  };
  function createPopover(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState72();
    }
    const {
      trigger: trigger2 = "click",
      placement: initialPlacement = "bottom",
      offset = 8,
      trapFocus = true,
      showDelay = 0,
      hideDelay = 100,
      closeOnEsc = true,
      closeOnClickOutside = true,
      open: initialOpen = false
    } = options;
    let isOpenState = false;
    let currentPlacement = initialPlacement;
    let showTimeout = null;
    let hideTimeout = null;
    const id = generateId("popover");
    let triggerEl = null;
    let contentEl = null;
    let focusTrap = null;
    let dismissHandler = null;
    let cleanupAutoUpdate = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES10.ROOT);
      element.setAttribute("data-atlas-popover", "");
      triggerEl = element.querySelector(`[${ATTRS10.TRIGGER}]`);
      if (!triggerEl) {
        triggerEl = element.firstElementChild;
        triggerEl?.setAttribute(ATTRS10.TRIGGER, "");
      }
      contentEl = element.querySelector(`[${ATTRS10.CONTENT}]`);
      if (contentEl) {
        contentEl.id = `${id}-content`;
        contentEl.setAttribute("role", "dialog");
        contentEl.setAttribute("aria-modal", "false");
        contentEl.setAttribute("tabindex", "-1");
        contentEl.style.display = "none";
      }
      if (triggerEl) {
        triggerEl.id = triggerEl.id || `${id}-trigger`;
        triggerEl.setAttribute("aria-haspopup", "dialog");
        triggerEl.setAttribute("aria-expanded", "false");
        if (contentEl) {
          triggerEl.setAttribute("aria-controls", contentEl.id);
        }
      }
      setupTriggerEvents();
      if (initialOpen) {
        requestAnimationFrame(() => open());
      }
    }
    function setupTriggerEvents() {
      if (!triggerEl) return;
      switch (trigger2) {
        case "click":
          cleanups.push(addListener(triggerEl, "click", handleTriggerClick));
          cleanups.push(addListener(triggerEl, "keydown", handleTriggerKeydown));
          break;
        case "hover":
          cleanups.push(addListener(triggerEl, "mouseenter", handleMouseEnter));
          cleanups.push(addListener(triggerEl, "mouseleave", handleMouseLeave));
          if (contentEl) {
            cleanups.push(
              addListener(contentEl, "mouseenter", handleContentMouseEnter)
            );
            cleanups.push(addListener(contentEl, "mouseleave", handleMouseLeave));
          }
          break;
        case "focus":
          cleanups.push(addListener(triggerEl, "focus", () => open()));
          cleanups.push(addListener(triggerEl, "blur", () => close()));
          break;
      }
    }
    function handleTriggerClick(event) {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    }
    function handleTriggerKeydown(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    }
    function handleMouseEnter() {
      clearTimeouts();
      showTimeout = setTimeout(() => {
        open();
      }, showDelay);
    }
    function handleMouseLeave() {
      clearTimeouts();
      hideTimeout = setTimeout(() => {
        close();
      }, hideDelay);
    }
    function handleContentMouseEnter() {
      clearTimeouts();
    }
    function clearTimeouts() {
      if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    }
    function open() {
      if (isOpenState || !contentEl || !triggerEl) return;
      clearTimeouts();
      isOpenState = true;
      triggerEl.setAttribute("aria-expanded", "true");
      contentEl.style.display = "";
      element.classList.add(CLASSES10.OPEN);
      updatePosition();
      cleanupAutoUpdate = autoUpdate(triggerEl, contentEl, updatePosition);
      if (trapFocus) {
        focusTrap = createFocusTrap({
          container: contentEl,
          initialFocus: "container",
          returnFocus: triggerEl
        });
        focusTrap.activate();
      }
      dismissHandler = createDismissHandler(contentEl, {
        escapeKey: closeOnEsc,
        clickOutside: closeOnClickOutside,
        ignore: [triggerEl],
        onDismiss: close
      });
      requestAnimationFrame(() => {
        contentEl?.focus();
      });
      options.onOpen?.();
    }
    function close() {
      if (!isOpenState || !contentEl || !triggerEl) return;
      clearTimeouts();
      isOpenState = false;
      triggerEl.setAttribute("aria-expanded", "false");
      element.classList.remove(CLASSES10.OPEN);
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      focusTrap?.deactivate();
      focusTrap = null;
      dismissHandler?.destroy();
      dismissHandler = null;
      setTimeout(() => {
        if (!isOpenState && contentEl) {
          contentEl.style.display = "none";
        }
      }, ANIMATION_DURATION.normal);
      triggerEl.focus();
      options.onClose?.();
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function updatePosition() {
      if (!triggerEl || !contentEl) return;
      const result = computeFloatingPosition(triggerEl, contentEl, {
        placement: currentPlacement,
        offset,
        flip: true,
        shift: true
      });
      contentEl.style.position = "absolute";
      contentEl.style.left = `${result.x}px`;
      contentEl.style.top = `${result.y}px`;
      contentEl.setAttribute("data-placement", result.placement);
      const arrow = contentEl.querySelector(`[${ATTRS10.ARROW}]`);
      if (arrow && (result.arrowX !== void 0 || result.arrowY !== void 0)) {
        arrow.style.left = result.arrowX !== void 0 ? `${result.arrowX}px` : "";
        arrow.style.top = result.arrowY !== void 0 ? `${result.arrowY}px` : "";
      }
    }
    function setPlacement(placement) {
      currentPlacement = placement;
      if (isOpenState) {
        updatePosition();
      }
    }
    function destroy() {
      clearTimeouts();
      if (isOpenState) {
        focusTrap?.deactivate();
        dismissHandler?.destroy();
        cleanupAutoUpdate?.();
      }
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(CLASSES10.ROOT, CLASSES10.OPEN);
      element.removeAttribute("data-atlas-popover");
    }
    init();
    return {
      isOpen: () => isOpenState,
      open,
      close,
      toggle,
      updatePosition,
      setPlacement,
      getPlacement: () => currentPlacement,
      destroy
    };
  }
  function createNoopState72() {
    return {
      isOpen: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      updatePosition: () => {
      },
      setPlacement: () => {
      },
      getPlacement: () => "bottom",
      destroy: () => {
      }
    };
  }
  function createProgress(element, options = {}) {
    if (!isBrowser()) {
      return createNoopProgressState();
    }
    const {
      type = "linear",
      value: initialValue = 0,
      indeterminate = false,
      shimmer = true,
      animated = true,
      size: size2 = 48,
      strokeWidth = 4,
      color = "var(--atlas-primary, #3b82f6)",
      trackColor = "var(--atlas-gray-200, #e5e7eb)",
      showLabel = false,
      announceProgress = true,
      onChange,
      onComplete
    } = options;
    let currentValue = Math.max(0, Math.min(100, initialValue));
    let visualState = indeterminate ? "loading" : "idle";
    let isIndeterminate = indeterminate;
    let progressElement = null;
    let labelElement = null;
    const originalContent = element.innerHTML;
    if (type === "linear") {
      createLinearProgress();
    } else {
      createCircularProgress();
    }
    function createLinearProgress() {
      element.innerHTML = "";
      element.style.cssText = `
      position: relative;
      width: 100%;
      height: 4px;
      background: ${trackColor};
      border-radius: 9999px;
      overflow: hidden;
    `;
      element.setAttribute("role", "progressbar");
      element.setAttribute("aria-valuemin", "0");
      element.setAttribute("aria-valuemax", "100");
      element.setAttribute("aria-valuenow", String(currentValue));
      progressElement = document.createElement("div");
      progressElement.className = "atlas-progress-bar";
      progressElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: ${currentValue}%;
      background: ${color};
      border-radius: 9999px;
      transition: ${animated ? `width ${ANIMATION_DURATION.normal}ms ${EASING.decelerate}` : "none"};
    `;
      if (shimmer) {
        const shimmerElement = document.createElement("div");
        shimmerElement.className = "atlas-progress-shimmer";
        shimmerElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%
        );
        animation: atlas-shimmer 1.5s infinite;
      `;
        progressElement.appendChild(shimmerElement);
      }
      element.appendChild(progressElement);
      if (showLabel) {
        labelElement = document.createElement("span");
        labelElement.className = "atlas-progress-label";
        labelElement.style.cssText = `
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        font-weight: 500;
        color: currentColor;
      `;
        labelElement.textContent = `${Math.round(currentValue)}%`;
        element.style.height = "20px";
        element.appendChild(labelElement);
      }
      if (isIndeterminate) {
        applyIndeterminateLinear();
      }
    }
    function createCircularProgress() {
      element.innerHTML = "";
      element.style.cssText = `
      position: relative;
      width: ${size2}px;
      height: ${size2}px;
    `;
      element.setAttribute("role", "progressbar");
      element.setAttribute("aria-valuemin", "0");
      element.setAttribute("aria-valuemax", "100");
      element.setAttribute("aria-valuenow", String(currentValue));
      const radius = (size2 - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - currentValue / 100 * circumference;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", String(size2));
      svg.setAttribute("height", String(size2));
      svg.setAttribute("viewBox", `0 0 ${size2} ${size2}`);
      svg.style.cssText = "transform: rotate(-90deg);";
      const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      bgCircle.setAttribute("cx", String(size2 / 2));
      bgCircle.setAttribute("cy", String(size2 / 2));
      bgCircle.setAttribute("r", String(radius));
      bgCircle.setAttribute("fill", "none");
      bgCircle.setAttribute("stroke", trackColor);
      bgCircle.setAttribute("stroke-width", String(strokeWidth));
      const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      progressCircle.setAttribute("cx", String(size2 / 2));
      progressCircle.setAttribute("cy", String(size2 / 2));
      progressCircle.setAttribute("r", String(radius));
      progressCircle.setAttribute("fill", "none");
      progressCircle.setAttribute("stroke", color);
      progressCircle.setAttribute("stroke-width", String(strokeWidth));
      progressCircle.setAttribute("stroke-linecap", "round");
      progressCircle.setAttribute("stroke-dasharray", String(circumference));
      progressCircle.setAttribute("stroke-dashoffset", String(offset));
      progressCircle.style.cssText = animated ? `transition: stroke-dashoffset ${ANIMATION_DURATION.normal}ms ${EASING.decelerate};` : "";
      svg.appendChild(bgCircle);
      svg.appendChild(progressCircle);
      element.appendChild(svg);
      progressElement = progressCircle;
      if (showLabel) {
        labelElement = document.createElement("span");
        labelElement.className = "atlas-progress-label";
        labelElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: ${size2 / 4}px;
        font-weight: 600;
        color: currentColor;
      `;
        labelElement.textContent = `${Math.round(currentValue)}%`;
        element.appendChild(labelElement);
      }
      if (isIndeterminate) {
        applyIndeterminateCircular();
      }
    }
    function applyIndeterminateLinear() {
      if (progressElement) {
        progressElement.style.width = "30%";
        progressElement.style.animation = "atlas-progress-indeterminate 1.5s ease-in-out infinite";
      }
    }
    function applyIndeterminateCircular() {
      const svg = element.querySelector("svg");
      if (svg) {
        svg.style.animation = "atlas-spin 1.5s linear infinite";
      }
      if (progressElement) {
        const radius = (size2 - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        progressElement.setAttribute(
          "stroke-dasharray",
          `${circumference * 0.25} ${circumference * 0.75}`
        );
        progressElement.setAttribute("stroke-dashoffset", "0");
      }
    }
    function removeIndeterminate() {
      if (type === "linear" && progressElement) {
        progressElement.style.animation = "";
        progressElement.style.width = `${currentValue}%`;
      } else {
        const svg = element.querySelector("svg");
        if (svg) {
          svg.style.animation = "";
        }
      }
    }
    const setValue = (value) => {
      const clampedValue = Math.max(0, Math.min(100, value));
      if (clampedValue === currentValue) return;
      currentValue = clampedValue;
      visualState = "loading";
      if (isIndeterminate) {
        setIndeterminate(false);
      }
      element.setAttribute("aria-valuenow", String(currentValue));
      if (type === "linear" && progressElement) {
        progressElement.style.width = `${currentValue}%`;
      } else if (type === "circular" && progressElement) {
        const radius = (size2 - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - currentValue / 100 * circumference;
        progressElement.setAttribute("stroke-dashoffset", String(offset));
      }
      if (labelElement) {
        labelElement.textContent = `${Math.round(currentValue)}%`;
      }
      if (announceProgress && currentValue % 25 === 0) {
        announce(`Progress: ${Math.round(currentValue)}%`, "polite");
      }
      onChange?.(currentValue);
      if (currentValue >= 100) {
        onComplete?.();
      }
    };
    const setIndeterminate = (indeterminate2) => {
      if (isIndeterminate === indeterminate2) return;
      isIndeterminate = indeterminate2;
      if (indeterminate2) {
        element.removeAttribute("aria-valuenow");
        visualState = "loading";
        if (type === "linear") {
          applyIndeterminateLinear();
        } else {
          applyIndeterminateCircular();
        }
      } else {
        element.setAttribute("aria-valuenow", String(currentValue));
        removeIndeterminate();
      }
    };
    const complete = () => {
      setValue(100);
      visualState = "success";
      if (progressElement) {
        const successColor = "var(--atlas-success, #22c55e)";
        if (type === "linear") {
          progressElement.style.background = successColor;
        } else {
          progressElement.setAttribute("stroke", successColor);
        }
        if (element.animate) {
          element.animate(
            [{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
            {
              duration: 300,
              easing: EASING.bounce
            }
          );
        }
      }
      if (showLabel && labelElement) {
        labelElement.textContent = "\u2713";
      }
      announce("Progress complete", "polite");
    };
    const error2 = () => {
      visualState = "error";
      if (progressElement) {
        const errorColor = "var(--atlas-error, #ef4444)";
        if (type === "linear") {
          progressElement.style.background = errorColor;
        } else {
          progressElement.setAttribute("stroke", errorColor);
        }
        if (element.animate) {
          element.animate(
            [
              { transform: "translateX(0)" },
              { transform: "translateX(-3px)" },
              { transform: "translateX(3px)" },
              { transform: "translateX(-3px)" },
              { transform: "translateX(0)" }
            ],
            {
              duration: 300,
              easing: "ease-in-out"
            }
          );
        }
      }
      if (showLabel && labelElement) {
        labelElement.textContent = "\u2715";
      }
      announce("Progress error", "assertive");
    };
    const reset = () => {
      currentValue = 0;
      visualState = "idle";
      isIndeterminate = indeterminate;
      if (type === "linear") {
        createLinearProgress();
      } else {
        createCircularProgress();
      }
    };
    const destroy = () => {
      element.innerHTML = originalContent;
      element.removeAttribute("role");
      element.removeAttribute("aria-valuemin");
      element.removeAttribute("aria-valuemax");
      element.removeAttribute("aria-valuenow");
      element.style.cssText = "";
    };
    return {
      get value() {
        return currentValue;
      },
      get visualState() {
        return visualState;
      },
      setValue,
      setIndeterminate,
      complete,
      error: error2,
      reset,
      destroy
    };
  }
  function createNoopProgressState() {
    return {
      get value() {
        return 0;
      },
      get visualState() {
        return "idle";
      },
      setValue: () => {
      },
      setIndeterminate: () => {
      },
      complete: () => {
      },
      error: () => {
      },
      reset: () => {
      },
      destroy: () => {
      }
    };
  }
  function createRadioGroup(container, options = {}) {
    if (!isBrowser()) {
      return createNoopRadioGroupState();
    }
    const {
      name,
      value: initialValue,
      disabled: initialDisabled = false,
      orientation = "vertical",
      onChange
    } = options;
    let currentValue = initialValue ?? null;
    let isDisabled = initialDisabled;
    let rovingFocus = null;
    const cleanupListeners = [];
    container.classList.add("atlas-radio-group");
    container.setAttribute("role", "radiogroup");
    if (name) container.setAttribute("aria-label", name);
    function getItems() {
      return Array.from(
        container.querySelectorAll('[role="radio"], [data-atlas-radio]')
      );
    }
    function updateRadios() {
      const items2 = getItems();
      items2.forEach((item) => {
        const itemValue = item.dataset.value || item.getAttribute("value") || "";
        const isSelected = itemValue === currentValue;
        const isItemDisabled = isDisabled || item.hasAttribute("data-disabled");
        item.setAttribute("aria-checked", String(isSelected));
        if (isSelected) {
          item.classList.add("atlas-radio-checked");
        } else {
          item.classList.remove("atlas-radio-checked");
        }
        if (isItemDisabled) {
          item.setAttribute("aria-disabled", "true");
          item.classList.add("atlas-radio-disabled");
        } else {
          item.removeAttribute("aria-disabled");
          item.classList.remove("atlas-radio-disabled");
        }
      });
    }
    function handleSelect(item) {
      if (isDisabled || item.hasAttribute("data-disabled")) return;
      const itemValue = item.dataset.value || item.getAttribute("value") || "";
      if (itemValue === currentValue) return;
      currentValue = itemValue;
      updateRadios();
      if (item.animate) {
        item.animate([{ transform: "scale(0.95)" }, { transform: "scale(1)" }], {
          duration: ANIMATION_DURATION.fast,
          easing: EASING.bounce
        });
      }
      onChange?.(currentValue);
    }
    rovingFocus = createRovingFocus(container, {
      orientation,
      itemSelector: '[role="radio"], [data-atlas-radio]',
      onFocusChange: (element) => {
        handleSelect(element);
      }
    });
    const items = getItems();
    items.forEach((item) => {
      if (!item.hasAttribute("role")) {
        item.setAttribute("role", "radio");
      }
      item.classList.add("atlas-radio");
      cleanupListeners.push(
        addListener(item, "click", () => {
          handleSelect(item);
          item.focus();
        })
      );
    });
    updateRadios();
    const setValue = (value) => {
      if (currentValue === value) return;
      currentValue = value;
      updateRadios();
      onChange?.(currentValue);
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      updateRadios();
    };
    const setOptionDisabled = (value, disabled) => {
      const items2 = getItems();
      const item = items2.find((i) => (i.dataset.value || i.getAttribute("value") || "") === value);
      if (item) {
        if (disabled) {
          item.setAttribute("data-disabled", "");
        } else {
          item.removeAttribute("data-disabled");
        }
        updateRadios();
      }
    };
    const focus = () => {
      const items2 = getItems();
      const selectedItem = items2.find(
        (i) => (i.dataset.value || i.getAttribute("value") || "") === currentValue
      );
      (selectedItem || items2[0])?.focus();
    };
    const destroy = () => {
      rovingFocus?.destroy();
      cleanupListeners.forEach((cleanup2) => cleanup2());
      container.classList.remove("atlas-radio-group");
      container.removeAttribute("role");
      container.removeAttribute("aria-label");
      const items2 = getItems();
      items2.forEach((item) => {
        item.classList.remove("atlas-radio", "atlas-radio-checked", "atlas-radio-disabled");
        item.removeAttribute("aria-checked");
        item.removeAttribute("aria-disabled");
      });
    };
    return {
      get value() {
        return currentValue;
      },
      get isDisabled() {
        return isDisabled;
      },
      setValue,
      setDisabled,
      setOptionDisabled,
      focus,
      destroy
    };
  }
  function createNoopRadioGroupState() {
    return {
      get value() {
        return null;
      },
      get isDisabled() {
        return false;
      },
      setValue: () => {
      },
      setDisabled: () => {
      },
      setOptionDisabled: () => {
      },
      focus: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS11 = {
    ROOT: "data-atlas-select",
    TRIGGER: "data-atlas-select-trigger",
    CONTENT: "data-atlas-select-content",
    SEARCH: "data-atlas-select-search",
    OPTION: "data-atlas-select-option",
    GROUP: "data-atlas-select-group",
    GROUP_LABEL: "data-atlas-select-group-label",
    VALUE: "data-value",
    SELECTED: "data-selected",
    DISABLED: "data-disabled",
    HIGHLIGHTED: "data-highlighted",
    EMPTY: "data-empty"
  };
  var CLASSES11 = {
    ROOT: "atlas-select",
    TRIGGER: "atlas-select-trigger",
    TRIGGER_TEXT: "atlas-select-trigger-text",
    TRIGGER_ICON: "atlas-select-trigger-icon",
    TRIGGER_CLEAR: "atlas-select-trigger-clear",
    TAGS: "atlas-select-tags",
    TAG: "atlas-select-tag",
    TAG_REMOVE: "atlas-select-tag-remove",
    CONTENT: "atlas-select-content",
    SEARCH: "atlas-select-search",
    SEARCH_INPUT: "atlas-select-search-input",
    OPTIONS: "atlas-select-options",
    OPTION: "atlas-select-option",
    OPTION_CHECK: "atlas-select-option-check",
    GROUP: "atlas-select-group",
    GROUP_LABEL: "atlas-select-group-label",
    EMPTY: "atlas-select-empty"
  };
  function flattenOptions(options) {
    const result = [];
    for (const item of options) {
      if ("options" in item) {
        result.push(...item.options);
      } else {
        result.push(item);
      }
    }
    return result;
  }
  function defaultFilter2(option, query) {
    return option.label.toLowerCase().includes(query.toLowerCase());
  }
  function defaultRenderOption(option, isSelected) {
    const checkmark = isSelected ? `<span class="${CLASSES11.OPTION_CHECK}">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
       </span>` : `<span class="${CLASSES11.OPTION_CHECK}"></span>`;
    return `${checkmark}<span>${option.label}</span>`;
  }
  function defaultRenderValue(options) {
    if (options.length === 0) return "";
    if (options.length === 1) return options[0].label;
    return `${options.length} selected`;
  }
  function createSelect(container, config2) {
    if (!isBrowser()) {
      return {
        getValue: () => config2.multiple ? [] : "",
        getSelected: () => [],
        setValue: () => {
        },
        open: () => {
        },
        close: () => {
        },
        toggle: () => {
        },
        isOpen: () => false,
        focus: () => {
        },
        setOptions: () => {
        },
        clear: () => {
        },
        setDisabled: () => {
        },
        destroy: () => {
        }
      };
    }
    let options = config2.options;
    let flatOptions = flattenOptions(options);
    const selectedValues = new Set(
      Array.isArray(config2.value) ? config2.value : config2.value ? [config2.value] : []
    );
    let isOpenState = false;
    let searchQuery = "";
    let highlightedIndex = -1;
    let disabled = config2.disabled ?? false;
    const {
      placeholder = "Select...",
      multiple = false,
      searchable = false,
      searchPlaceholder = "Search...",
      clearable = false,
      maxSelections,
      placement = "bottom-start",
      closeOnSelect = !multiple,
      filterFn = defaultFilter2,
      renderOption = defaultRenderOption,
      renderValue = defaultRenderValue,
      onChange,
      onOpen,
      onClose,
      onSearch
    } = config2;
    const id = generateId("select");
    const triggerId = `${id}-trigger`;
    const contentId = `${id}-content`;
    const searchId = `${id}-search`;
    const listboxId = `${id}-listbox`;
    let triggerEl = null;
    let contentEl = null;
    let searchEl = null;
    let optionsEl = null;
    let rovingFocus = null;
    let typeahead = null;
    let dismissHandler = null;
    let cleanupAutoUpdate = null;
    function render() {
      container.innerHTML = "";
      container.setAttribute(ATTRS11.ROOT, "");
      container.classList.add(CLASSES11.ROOT);
      triggerEl = document.createElement("button");
      triggerEl.type = "button";
      triggerEl.id = triggerId;
      triggerEl.className = CLASSES11.TRIGGER;
      triggerEl.setAttribute(ATTRS11.TRIGGER, "");
      triggerEl.setAttribute("aria-haspopup", "listbox");
      triggerEl.setAttribute("aria-expanded", "false");
      triggerEl.setAttribute("aria-controls", contentId);
      if (disabled) {
        triggerEl.disabled = true;
        triggerEl.setAttribute(ATTRS11.DISABLED, "");
      }
      updateTriggerContent();
      container.appendChild(triggerEl);
      contentEl = document.createElement("div");
      contentEl.id = contentId;
      contentEl.className = CLASSES11.CONTENT;
      contentEl.setAttribute(ATTRS11.CONTENT, "");
      contentEl.setAttribute("role", "dialog");
      contentEl.setAttribute("aria-labelledby", triggerId);
      contentEl.hidden = true;
      if (searchable) {
        const searchWrapper = document.createElement("div");
        searchWrapper.className = CLASSES11.SEARCH;
        searchEl = document.createElement("input");
        searchEl.type = "text";
        searchEl.id = searchId;
        searchEl.className = CLASSES11.SEARCH_INPUT;
        searchEl.placeholder = searchPlaceholder;
        searchEl.setAttribute(ATTRS11.SEARCH, "");
        searchEl.setAttribute("aria-controls", listboxId);
        searchEl.setAttribute("aria-autocomplete", "list");
        searchWrapper.appendChild(searchEl);
        contentEl.appendChild(searchWrapper);
      }
      optionsEl = document.createElement("div");
      optionsEl.id = listboxId;
      optionsEl.className = CLASSES11.OPTIONS;
      optionsEl.setAttribute("role", "listbox");
      optionsEl.setAttribute("aria-multiselectable", String(multiple));
      renderOptions();
      contentEl.appendChild(optionsEl);
      document.body.appendChild(contentEl);
    }
    function updateTriggerContent() {
      const selected = getSelected();
      if (multiple && selected.length > 0) {
        const tagsHtml = selected.map(
          (opt) => `
          <span class="${CLASSES11.TAG}" data-value="${opt.value}">
            ${opt.label}
            <button type="button" class="${CLASSES11.TAG_REMOVE}" aria-label="Remove ${opt.label}">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </span>
        `
        ).join("");
        triggerEl.innerHTML = `
        <span class="${CLASSES11.TAGS}">${tagsHtml}</span>
        <span class="${CLASSES11.TRIGGER_ICON}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;
      } else {
        const text = selected.length > 0 ? renderValue(selected) : placeholder;
        const isPlaceholder = selected.length === 0;
        let clearBtn = "";
        if (clearable && selected.length > 0) {
          clearBtn = `
          <button type="button" class="${CLASSES11.TRIGGER_CLEAR}" aria-label="Clear selection">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        `;
        }
        triggerEl.innerHTML = `
        <span class="${CLASSES11.TRIGGER_TEXT}" ${isPlaceholder ? 'data-placeholder="true"' : ""}>${text}</span>
        ${clearBtn}
        <span class="${CLASSES11.TRIGGER_ICON}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;
      }
    }
    function renderOptions() {
      const filteredOptions = searchQuery ? flatOptions.filter((opt) => filterFn(opt, searchQuery)) : flatOptions;
      if (filteredOptions.length === 0) {
        optionsEl.innerHTML = `<div class="${CLASSES11.EMPTY}" ${ATTRS11.EMPTY}>No options found</div>`;
        optionsEl.setAttribute("aria-activedescendant", "");
        return;
      }
      const grouped = /* @__PURE__ */ new Map();
      const ungrouped = [];
      for (const opt of filteredOptions) {
        if (opt.group) {
          const group = grouped.get(opt.group) || [];
          group.push(opt);
          grouped.set(opt.group, group);
        } else {
          ungrouped.push(opt);
        }
      }
      let html = "";
      for (const opt of ungrouped) {
        html += renderOptionHtml(opt);
      }
      for (const [label, opts] of grouped) {
        html += `
        <div class="${CLASSES11.GROUP}" ${ATTRS11.GROUP} role="group" aria-label="${label}">
          <div class="${CLASSES11.GROUP_LABEL}" ${ATTRS11.GROUP_LABEL}>${label}</div>
          ${opts.map((opt) => renderOptionHtml(opt)).join("")}
        </div>
      `;
      }
      optionsEl.innerHTML = html;
      if (highlightedIndex === -1 && filteredOptions.length > 0) {
        highlightOption(0);
      }
    }
    function renderOptionHtml(option) {
      const isSelected = selectedValues.has(option.value);
      const isDisabled = option.disabled ?? false;
      const optionId = `${id}-option-${option.value}`;
      return `
      <div
        id="${optionId}"
        class="${CLASSES11.OPTION}"
        role="option"
        ${ATTRS11.OPTION}
        ${ATTRS11.VALUE}="${option.value}"
        ${isSelected ? `${ATTRS11.SELECTED}` : ""}
        ${isDisabled ? `${ATTRS11.DISABLED}` : ""}
        aria-selected="${isSelected}"
        aria-disabled="${isDisabled}"
      >
        ${renderOption(option, isSelected)}
      </div>
    `;
    }
    function getVisibleOptions() {
      return Array.from(
        optionsEl.querySelectorAll(`[${ATTRS11.OPTION}]:not([${ATTRS11.DISABLED}])`)
      );
    }
    function highlightOption(index) {
      const visibleOptions = getVisibleOptions();
      visibleOptions.forEach((el) => el.removeAttribute(ATTRS11.HIGHLIGHTED));
      if (index >= 0 && index < visibleOptions.length) {
        const option = visibleOptions[index];
        option.setAttribute(ATTRS11.HIGHLIGHTED, "");
        option.scrollIntoView({ block: "nearest" });
        optionsEl.setAttribute("aria-activedescendant", option.id);
        highlightedIndex = index;
      }
    }
    function getSelected() {
      return flatOptions.filter((opt) => selectedValues.has(opt.value));
    }
    function selectOption(value) {
      const option = flatOptions.find((opt) => opt.value === value);
      if (!option || option.disabled) return;
      if (multiple) {
        if (selectedValues.has(value)) {
          selectedValues.delete(value);
        } else {
          if (maxSelections && selectedValues.size >= maxSelections) return;
          selectedValues.add(value);
        }
      } else {
        selectedValues.clear();
        selectedValues.add(value);
      }
      updateTriggerContent();
      renderOptions();
      const selected = getSelected();
      const returnValue = multiple ? Array.from(selectedValues) : value;
      onChange?.(returnValue, selected);
      if (closeOnSelect) {
        close();
      }
    }
    function clearSelection() {
      selectedValues.clear();
      updateTriggerContent();
      renderOptions();
      const returnValue = multiple ? [] : "";
      onChange?.(returnValue, []);
    }
    function open() {
      if (isOpenState || disabled) return;
      isOpenState = true;
      contentEl.hidden = false;
      triggerEl.setAttribute("aria-expanded", "true");
      const updatePosition = () => {
        const result = computeFloatingPosition(triggerEl, contentEl, {
          placement,
          offset: 4,
          flip: true
        });
        applyFloatingStyles(contentEl, result);
      };
      updatePosition();
      cleanupAutoUpdate = autoUpdate(triggerEl, contentEl, updatePosition);
      if (searchEl) {
        searchEl.value = "";
        searchQuery = "";
        renderOptions();
        searchEl.focus();
      } else {
        highlightOption(0);
        optionsEl.focus();
      }
      rovingFocus = createRovingFocus(optionsEl, {
        itemSelector: `[${ATTRS11.OPTION}]:not([${ATTRS11.DISABLED}])`,
        orientation: "vertical",
        loop: true,
        onFocusChange: (_el, index) => {
          highlightedIndex = index;
        }
      });
      if (!searchable) {
        typeahead = createTypeahead(optionsEl, {
          itemSelector: `[${ATTRS11.OPTION}]:not([${ATTRS11.DISABLED}])`,
          onMatch: (_el, index) => {
            highlightOption(index);
          }
        });
      }
      dismissHandler = createDismissHandler(contentEl, {
        onDismiss: close,
        escapeKey: true,
        clickOutside: true,
        ignore: [triggerEl]
      });
      onOpen?.();
    }
    function close() {
      if (!isOpenState) return;
      isOpenState = false;
      contentEl.hidden = true;
      triggerEl.setAttribute("aria-expanded", "false");
      cleanupAutoUpdate?.();
      cleanupAutoUpdate = null;
      rovingFocus?.destroy();
      rovingFocus = null;
      typeahead?.destroy();
      typeahead = null;
      dismissHandler?.destroy();
      dismissHandler = null;
      searchQuery = "";
      highlightedIndex = -1;
      triggerEl.focus();
      onClose?.();
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function handleTriggerClick(e) {
      const target = e.target;
      if (target.closest(`.${CLASSES11.TRIGGER_CLEAR}`)) {
        e.stopPropagation();
        clearSelection();
        return;
      }
      const tagRemove = target.closest(`.${CLASSES11.TAG_REMOVE}`);
      if (tagRemove) {
        e.stopPropagation();
        const tag = tagRemove.closest(`.${CLASSES11.TAG}`);
        const value = tag?.dataset.value;
        if (value) {
          selectedValues.delete(value);
          updateTriggerContent();
          renderOptions();
          const selected = getSelected();
          onChange?.(Array.from(selectedValues), selected);
        }
        return;
      }
      toggle();
    }
    function handleTriggerKeydown(e) {
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
        case "ArrowUp":
          e.preventDefault();
          open();
          break;
      }
    }
    function handleOptionsClick(e) {
      const target = e.target;
      const option = target.closest(`[${ATTRS11.OPTION}]`);
      if (option && !option.hasAttribute(ATTRS11.DISABLED)) {
        const value = option.getAttribute(ATTRS11.VALUE);
        if (value) {
          selectOption(value);
        }
      }
    }
    function handleOptionsKeydown(e) {
      const visibleOptions = getVisibleOptions();
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < visibleOptions.length) {
            const value = visibleOptions[highlightedIndex].getAttribute(ATTRS11.VALUE);
            if (value) selectOption(value);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          highlightOption(Math.min(highlightedIndex + 1, visibleOptions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          highlightOption(Math.max(highlightedIndex - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          highlightOption(0);
          break;
        case "End":
          e.preventDefault();
          highlightOption(visibleOptions.length - 1);
          break;
        case "Tab":
          close();
          break;
      }
    }
    function handleSearchInput(e) {
      const input = e.target;
      searchQuery = input.value;
      highlightedIndex = -1;
      renderOptions();
      onSearch?.(searchQuery);
    }
    function handleSearchKeydown(e) {
      const visibleOptions = getVisibleOptions();
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          highlightOption(Math.min(highlightedIndex + 1, visibleOptions.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          highlightOption(Math.max(highlightedIndex - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < visibleOptions.length) {
            const value = visibleOptions[highlightedIndex].getAttribute(ATTRS11.VALUE);
            if (value) selectOption(value);
          }
          break;
        case "Escape":
          close();
          break;
      }
    }
    render();
    triggerEl.addEventListener("click", handleTriggerClick);
    triggerEl.addEventListener("keydown", handleTriggerKeydown);
    optionsEl.addEventListener("click", handleOptionsClick);
    optionsEl.addEventListener("keydown", handleOptionsKeydown);
    if (searchEl !== null) {
      const el = searchEl;
      el.addEventListener("input", handleSearchInput);
      el.addEventListener("keydown", handleSearchKeydown);
    }
    return {
      getValue() {
        return multiple ? Array.from(selectedValues) : Array.from(selectedValues)[0] || "";
      },
      getSelected,
      setValue(value) {
        selectedValues.clear();
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) {
          if (flatOptions.some((opt) => opt.value === v)) {
            selectedValues.add(v);
          }
        }
        updateTriggerContent();
        renderOptions();
      },
      open,
      close,
      toggle,
      isOpen() {
        return isOpenState;
      },
      focus() {
        triggerEl.focus();
      },
      setOptions(newOptions) {
        options = newOptions;
        flatOptions = flattenOptions(options);
        for (const value of selectedValues) {
          if (!flatOptions.some((opt) => opt.value === value)) {
            selectedValues.delete(value);
          }
        }
        updateTriggerContent();
        if (isOpenState) {
          renderOptions();
        }
      },
      clear() {
        clearSelection();
      },
      setDisabled(value) {
        disabled = value;
        triggerEl.disabled = disabled;
        if (disabled) {
          triggerEl.setAttribute(ATTRS11.DISABLED, "");
          close();
        } else {
          triggerEl.removeAttribute(ATTRS11.DISABLED);
        }
      },
      destroy() {
        close();
        triggerEl.removeEventListener("click", handleTriggerClick);
        triggerEl.removeEventListener("keydown", handleTriggerKeydown);
        optionsEl.removeEventListener("click", handleOptionsClick);
        optionsEl.removeEventListener("keydown", handleOptionsKeydown);
        if (searchEl) {
          searchEl.removeEventListener("input", handleSearchInput);
          searchEl.removeEventListener("keydown", handleSearchKeydown);
        }
        contentEl.remove();
        container.innerHTML = "";
      }
    };
  }
  var AtlasSelect = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._select = null;
      this._options = [];
    }
    static get observedAttributes() {
      return ["placeholder", "disabled", "multiple", "searchable", "clearable", "value"];
    }
    connectedCallback() {
      this._parseOptions();
      this._init();
    }
    disconnectedCallback() {
      this._select?.destroy();
      this._select = null;
    }
    attributeChangedCallback(name, _oldValue, newValue) {
      if (!this._select) return;
      switch (name) {
        case "disabled":
          this._select.setDisabled(newValue !== null);
          break;
        case "value":
          if (newValue) {
            const values = newValue.includes(",") ? newValue.split(",") : newValue;
            this._select.setValue(values);
          }
          break;
      }
    }
    _parseOptions() {
      const dataOptions = this.getAttribute("data-options");
      if (dataOptions) {
        try {
          this._options = JSON.parse(dataOptions);
          return;
        } catch {
          console.warn("[AtlasSelect] Invalid JSON in data-options");
        }
      }
      const options = [];
      for (const child of Array.from(this.children)) {
        if (child.tagName === "OPTGROUP") {
          const group = {
            label: child.getAttribute("label") || "",
            options: []
          };
          for (const opt of Array.from(child.children)) {
            if (opt.tagName === "OPTION") {
              group.options.push({
                value: opt.getAttribute("value") || opt.textContent || "",
                label: opt.textContent || "",
                disabled: opt.hasAttribute("disabled")
              });
            }
          }
          options.push(group);
        } else if (child.tagName === "OPTION") {
          options.push({
            value: child.getAttribute("value") || child.textContent || "",
            label: child.textContent || "",
            disabled: child.hasAttribute("disabled")
          });
        }
      }
      this._options = options;
    }
    _init() {
      this.innerHTML = "";
      this._select = createSelect(this, {
        options: this._options,
        placeholder: this.getAttribute("placeholder") || void 0,
        disabled: this.hasAttribute("disabled"),
        multiple: this.hasAttribute("multiple"),
        searchable: this.hasAttribute("searchable"),
        clearable: this.hasAttribute("clearable"),
        value: this.getAttribute("value") || void 0,
        onChange: (value, options) => {
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: { value, options },
              bubbles: true
            })
          );
        }
      });
    }
    // Public API
    get value() {
      return this._select?.getValue() || "";
    }
    set value(val) {
      this._select?.setValue(val);
    }
    get selected() {
      return this._select?.getSelected() || [];
    }
    open() {
      this._select?.open();
    }
    close() {
      this._select?.close();
    }
    clear() {
      this._select?.clear();
    }
  };
  if (isBrowser() && !customElements.get("atlas-select")) {
    customElements.define("atlas-select", AtlasSelect);
  }
  function createSeparator(element, options = {}) {
    if (!isBrowser()) {
      return createNoopSeparatorState();
    }
    const { orientation: initialOrientation = "horizontal", decorative = true, label } = options;
    let orientation = initialOrientation;
    element.classList.add("atlas-separator");
    applyOrientation(orientation);
    if (decorative) {
      element.setAttribute("role", "none");
      element.setAttribute("aria-hidden", "true");
    } else {
      element.setAttribute("role", "separator");
      element.setAttribute("aria-orientation", orientation);
      if (label) {
        element.setAttribute("aria-label", label);
      }
    }
    function applyOrientation(orient) {
      element.classList.remove("atlas-separator-horizontal", "atlas-separator-vertical");
      element.classList.add(`atlas-separator-${orient}`);
      if (!decorative) {
        element.setAttribute("aria-orientation", orient);
      }
      if (orient === "horizontal") {
        element.style.height = "1px";
        element.style.width = "100%";
      } else {
        element.style.width = "1px";
        element.style.height = "100%";
      }
    }
    const setOrientation = (newOrientation) => {
      orientation = newOrientation;
      applyOrientation(orientation);
    };
    const destroy = () => {
      element.classList.remove(
        "atlas-separator",
        "atlas-separator-horizontal",
        "atlas-separator-vertical"
      );
      element.removeAttribute("role");
      element.removeAttribute("aria-hidden");
      element.removeAttribute("aria-orientation");
      element.removeAttribute("aria-label");
      element.style.width = "";
      element.style.height = "";
    };
    return {
      get orientation() {
        return orientation;
      },
      setOrientation,
      destroy
    };
  }
  function createNoopSeparatorState() {
    return {
      get orientation() {
        return "horizontal";
      },
      setOrientation: () => {
      },
      destroy: () => {
      }
    };
  }
  function springStep(current, target, velocity, config2, deltaTime) {
    const { stiffness, damping, mass } = config2;
    const springForce = -stiffness * (current - target);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    const newVelocity = velocity + acceleration * deltaTime;
    const newValue = current + newVelocity * deltaTime;
    const done = Math.abs(target - newValue) < 1e-3 && Math.abs(newVelocity) < 1e-3;
    return {
      value: done ? target : newValue,
      velocity: done ? 0 : newVelocity,
      done
    };
  }
  function animateSpring(from, to, config2 = {}, onUpdate, onComplete) {
    if (!isBrowser()) {
      onUpdate(to);
      onComplete?.();
      return () => {
      };
    }
    const fullConfig = {
      stiffness: config2.stiffness ?? 100,
      damping: config2.damping ?? 10,
      mass: config2.mass ?? 1,
      velocity: config2.velocity ?? 0
    };
    let current = from;
    let velocity = fullConfig.velocity;
    let lastTime = performance.now();
    let frameId = null;
    function tick(now) {
      const deltaTime = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const frame = springStep(current, to, velocity, fullConfig, deltaTime);
      current = frame.value;
      velocity = frame.velocity;
      onUpdate(current);
      if (frame.done) {
        frameId = null;
        onComplete?.();
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }
    frameId = requestAnimationFrame(tick);
    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };
  }
  var ANIMATION_PRESETS = {
    fade: {
      enter: "opacity: 0 -> opacity: 1",
      exit: "opacity: 1 -> opacity: 0"
    },
    "slide-up": {
      enter: "transform: translateY(10px); opacity: 0 -> transform: translateY(0); opacity: 1",
      exit: "transform: translateY(0); opacity: 1 -> transform: translateY(-10px); opacity: 0"
    },
    "slide-down": {
      enter: "transform: translateY(-10px); opacity: 0 -> transform: translateY(0); opacity: 1",
      exit: "transform: translateY(0); opacity: 1 -> transform: translateY(10px); opacity: 0"
    },
    "slide-left": {
      enter: "transform: translateX(10px); opacity: 0 -> transform: translateX(0); opacity: 1",
      exit: "transform: translateX(0); opacity: 1 -> transform: translateX(-10px); opacity: 0"
    },
    "slide-right": {
      enter: "transform: translateX(-10px); opacity: 0 -> transform: translateX(0); opacity: 1",
      exit: "transform: translateX(0); opacity: 1 -> transform: translateX(10px); opacity: 0"
    },
    scale: {
      enter: "transform: scale(0.95); opacity: 0 -> transform: scale(1); opacity: 1",
      exit: "transform: scale(1); opacity: 1 -> transform: scale(0.95); opacity: 0"
    },
    "scale-up": {
      enter: "transform: scale(0.9); opacity: 0 -> transform: scale(1); opacity: 1",
      exit: "transform: scale(1); opacity: 1 -> transform: scale(1.1); opacity: 0"
    },
    "scale-down": {
      enter: "transform: scale(1.1); opacity: 0 -> transform: scale(1); opacity: 1",
      exit: "transform: scale(1); opacity: 1 -> transform: scale(0.9); opacity: 0"
    },
    "flip-x": {
      enter: "transform: perspective(400px) rotateX(90deg); opacity: 0 -> transform: perspective(400px) rotateX(0); opacity: 1",
      exit: "transform: perspective(400px) rotateX(0); opacity: 1 -> transform: perspective(400px) rotateX(-90deg); opacity: 0"
    },
    "flip-y": {
      enter: "transform: perspective(400px) rotateY(90deg); opacity: 0 -> transform: perspective(400px) rotateY(0); opacity: 1",
      exit: "transform: perspective(400px) rotateY(0); opacity: 1 -> transform: perspective(400px) rotateY(-90deg); opacity: 0"
    },
    rotate: {
      enter: "transform: rotate(-10deg) scale(0.95); opacity: 0 -> transform: rotate(0) scale(1); opacity: 1",
      exit: "transform: rotate(0) scale(1); opacity: 1 -> transform: rotate(10deg) scale(0.95); opacity: 0"
    },
    blur: {
      enter: "filter: blur(8px); opacity: 0 -> filter: blur(0); opacity: 1",
      exit: "filter: blur(0); opacity: 1 -> filter: blur(8px); opacity: 0"
    },
    "blur-fade": {
      enter: "filter: blur(12px); opacity: 0; transform: scale(1.02) -> filter: blur(0); opacity: 1; transform: scale(1)",
      exit: "filter: blur(0); opacity: 1; transform: scale(1) -> filter: blur(12px); opacity: 0; transform: scale(0.98)"
    }
  };
  function parsePresetStyles(definition) {
    const [fromStr, toStr] = definition.split(" -> ");
    const from = {};
    const to = {};
    for (const part of fromStr.split(";")) {
      const [key, value] = part.split(":").map((s2) => s2.trim());
      if (key && value) from[key] = value;
    }
    for (const part of toStr.split(";")) {
      const [key, value] = part.split(":").map((s2) => s2.trim());
      if (key && value) to[key] = value;
    }
    return { from, to };
  }
  function createTransition(element, options = {}) {
    const {
      duration = 200,
      easing = "ease-out",
      delay = 0,
      preset = "fade",
      onStart,
      onEnd
    } = options;
    let state = "idle";
    let cancelFn = null;
    const presetDef = ANIMATION_PRESETS[preset];
    const enterStyles = parsePresetStyles(presetDef.enter);
    const exitStyles = parsePresetStyles(presetDef.exit);
    function applyStyles2(styles) {
      for (const [key, value] of Object.entries(styles)) {
        element.style.setProperty(key, value);
      }
    }
    function animate2(from, to, newState) {
      return new Promise((resolve) => {
        if (!isBrowser()) {
          applyStyles2(to);
          state = newState === "entering" ? "entered" : "exited";
          resolve();
          return;
        }
        cancelFn?.();
        state = newState;
        onStart?.(state);
        applyStyles2(from);
        element.offsetHeight;
        const properties = Object.keys(to);
        element.style.transition = properties.map((prop) => `${prop} ${duration}ms ${easing} ${delay}ms`).join(", ");
        applyStyles2(to);
        const handleEnd = (e) => {
          if (e && e.target !== element) return;
          element.removeEventListener("transitionend", handleEnd);
          element.style.transition = "";
          cancelFn = null;
          state = newState === "entering" ? "entered" : "exited";
          onEnd?.(state);
          resolve();
        };
        cancelFn = () => {
          element.removeEventListener("transitionend", handleEnd);
          element.style.transition = "";
          cancelFn = null;
        };
        element.addEventListener("transitionend", handleEnd, { once: false });
        setTimeout(
          () => {
            if (cancelFn) handleEnd();
          },
          duration + delay + 50
        );
      });
    }
    return {
      get state() {
        return state;
      },
      enter() {
        return animate2(enterStyles.from, enterStyles.to, "entering");
      },
      exit() {
        return animate2(exitStyles.from, exitStyles.to, "exiting");
      },
      async toggle() {
        if (state === "idle" || state === "exited") {
          await this.enter();
        } else {
          await this.exit();
        }
      },
      cancel() {
        cancelFn?.();
        state = "idle";
      },
      destroy() {
        cancelFn?.();
        element.style.transition = "";
      }
    };
  }
  var EASING_PRESETS = {
    // Basic
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    // Cubic bezier presets
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    // Expressive
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    elastic: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
    // Smooth
    smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    smoothIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    smoothOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    smoothInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    // Sharp
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    sharpIn: "cubic-bezier(0.55, 0, 1, 0.45)",
    sharpOut: "cubic-bezier(0, 0.55, 0.45, 1)"
  };
  var easingFn = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    easeOutElastic: (t) => {
      const p = 0.3;
      return 2 ** (-10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    easeOutBounce: (t) => {
      let tVal = t;
      if (tVal < 1 / 2.75) {
        return 7.5625 * tVal * tVal;
      } else if (tVal < 2 / 2.75) {
        tVal -= 1.5 / 2.75;
        return 7.5625 * tVal * tVal + 0.75;
      } else if (tVal < 2.5 / 2.75) {
        tVal -= 2.25 / 2.75;
        return 7.5625 * tVal * tVal + 0.9375;
      } else {
        tVal -= 2.625 / 2.75;
        return 7.5625 * tVal * tVal + 0.984375;
      }
    }
  };
  var DURATION = {
    instant: 0,
    fastest: 50,
    faster: 100,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 400,
    slowest: 500,
    // Named durations
    micro: 100,
    short: 150,
    medium: 250,
    long: 400,
    // Specific use cases
    tooltip: 150,
    modal: 250,
    page: 400,
    loading: 1e3
  };
  var registry = /* @__PURE__ */ new Map();
  function registerAnimation(name, definition) {
    registry.set(name, { name, ...definition });
  }
  function getAnimation(name) {
    return registry.get(name);
  }
  function getAnimations() {
    return new Map(registry);
  }
  var fadeIn = {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.smooth, fill: "forwards" }
  };
  var fadeOut = {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.smooth, fill: "forwards" }
  };
  var scaleIn = {
    keyframes: [
      { opacity: 0, transform: "scale(0.95)" },
      { opacity: 1, transform: "scale(1)" }
    ],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.decelerate, fill: "forwards" }
  };
  var scaleOut = {
    keyframes: [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.95)" }
    ],
    options: { duration: DURATION.fast, easing: EASING_PRESETS.accelerate, fill: "forwards" }
  };
  var slideInUp = {
    keyframes: [
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.decelerate, fill: "forwards" }
  };
  var slideInDown = {
    keyframes: [
      { opacity: 0, transform: "translateY(-10px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.decelerate, fill: "forwards" }
  };
  var slideInLeft = {
    keyframes: [
      { opacity: 0, transform: "translateX(-10px)" },
      { opacity: 1, transform: "translateX(0)" }
    ],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.decelerate, fill: "forwards" }
  };
  var slideInRight = {
    keyframes: [
      { opacity: 0, transform: "translateX(10px)" },
      { opacity: 1, transform: "translateX(0)" }
    ],
    options: { duration: DURATION.normal, easing: EASING_PRESETS.decelerate, fill: "forwards" }
  };
  var slideOutUp = {
    keyframes: [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-10px)" }
    ],
    options: { duration: DURATION.fast, easing: EASING_PRESETS.accelerate, fill: "forwards" }
  };
  var slideOutDown = {
    keyframes: [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(10px)" }
    ],
    options: { duration: DURATION.fast, easing: EASING_PRESETS.accelerate, fill: "forwards" }
  };
  var bounceIn = {
    keyframes: [
      { opacity: 0, transform: "scale(0.3)" },
      { opacity: 1, transform: "scale(1.05)" },
      { transform: "scale(0.9)" },
      { transform: "scale(1.03)" },
      { transform: "scale(0.97)" },
      { transform: "scale(1)" }
    ],
    options: { duration: DURATION.slow, easing: EASING_PRESETS.bounce, fill: "forwards" }
  };
  var bounceOut = {
    keyframes: [
      { transform: "scale(1)" },
      { transform: "scale(0.9)" },
      { opacity: 1, transform: "scale(1.1)" },
      { opacity: 0, transform: "scale(0.3)" }
    ],
    options: { duration: DURATION.slow, easing: EASING_PRESETS.bounce, fill: "forwards" }
  };
  var shake = {
    keyframes: [
      { transform: "translateX(0)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0)" }
    ],
    options: { duration: DURATION.slow, easing: EASING_PRESETS.smooth }
  };
  var pulse = {
    keyframes: [{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
    options: { duration: DURATION.medium, easing: EASING_PRESETS.smooth }
  };
  var wiggle = {
    keyframes: [
      { transform: "rotate(0deg)" },
      { transform: "rotate(-5deg)" },
      { transform: "rotate(5deg)" },
      { transform: "rotate(-5deg)" },
      { transform: "rotate(5deg)" },
      { transform: "rotate(0deg)" }
    ],
    options: { duration: DURATION.slow, easing: EASING_PRESETS.smooth }
  };
  var heartbeat = {
    keyframes: [
      { transform: "scale(1)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1.25)" },
      { transform: "scale(1)" }
    ],
    options: { duration: DURATION.slow, easing: EASING_PRESETS.smooth }
  };
  var breathe = {
    keyframes: [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.02)", opacity: 0.9 },
      { transform: "scale(1)", opacity: 1 }
    ],
    options: {
      duration: 2e3,
      easing: EASING_PRESETS.smooth,
      iterations: Infinity
    }
  };
  var spin = {
    keyframes: [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    options: {
      duration: DURATION.loading,
      easing: EASING_PRESETS.linear,
      iterations: Infinity
    }
  };
  registerAnimation("fadeIn", { ...fadeIn, description: "Fade in" });
  registerAnimation("fadeOut", { ...fadeOut, description: "Fade out" });
  registerAnimation("scaleIn", { ...scaleIn, description: "Scale in with fade" });
  registerAnimation("scaleOut", { ...scaleOut, description: "Scale out with fade" });
  registerAnimation("slideInUp", { ...slideInUp, description: "Slide in from bottom" });
  registerAnimation("slideInDown", { ...slideInDown, description: "Slide in from top" });
  registerAnimation("slideInLeft", { ...slideInLeft, description: "Slide in from left" });
  registerAnimation("slideInRight", { ...slideInRight, description: "Slide in from right" });
  registerAnimation("slideOutUp", { ...slideOutUp, description: "Slide out to top" });
  registerAnimation("slideOutDown", { ...slideOutDown, description: "Slide out to bottom" });
  registerAnimation("bounceIn", { ...bounceIn, description: "Bouncy entrance" });
  registerAnimation("bounceOut", { ...bounceOut, description: "Bouncy exit" });
  registerAnimation("shake", { ...shake, description: "Shake horizontally" });
  registerAnimation("pulse", { ...pulse, description: "Subtle pulse" });
  registerAnimation("wiggle", { ...wiggle, description: "Wiggle rotation" });
  registerAnimation("heartbeat", { ...heartbeat, description: "Heartbeat pulse" });
  registerAnimation("breathe", { ...breathe, description: "Continuous breathing" });
  registerAnimation("spin", { ...spin, description: "Continuous spin" });
  function animate(element, animation, overrides) {
    const def = typeof animation === "string" ? getAnimation(animation) : animation;
    if (!def) {
      console.warn(`[Atlas Animation] Animation "${animation}" not found`);
      return element.animate([], {});
    }
    const options = { ...def.options, ...overrides };
    return element.animate(def.keyframes, options);
  }
  async function animateAsync(element, animation, overrides) {
    const anim = animate(element, animation, overrides);
    await anim.finished;
  }
  function createSpring(config2 = {}) {
    const { stiffness = 100, damping = 10, mass = 1 } = config2;
    let velocity = config2.velocity ?? 0;
    return (current, target) => {
      const force = -stiffness * (current - target);
      const dampingForce = -damping * velocity;
      const acceleration = (force + dampingForce) / mass;
      velocity += acceleration * (1 / 60);
      const newPosition = current + velocity * (1 / 60);
      return newPosition;
    };
  }
  var plugins = [];
  function registerPlugin(plugin2) {
    plugins.push(plugin2);
    return () => {
      const index = plugins.indexOf(plugin2);
      if (index > -1) plugins.splice(index, 1);
    };
  }
  function createEventEmitter() {
    const listeners2 = /* @__PURE__ */ new Map();
    return {
      on(event, handler4) {
        if (!listeners2.has(event)) {
          listeners2.set(event, /* @__PURE__ */ new Set());
        }
        listeners2.get(event)?.add(handler4);
        return () => this.off(event, handler4);
      },
      off(event, handler4) {
        listeners2.get(event)?.delete(handler4);
      },
      emit(event, data2) {
        listeners2.get(event)?.forEach((handler4) => {
          try {
            handler4(data2);
          } catch (error2) {
            console.error(`[Atlas] Error in event handler for "${String(event)}":`, error2);
          }
        });
      }
    };
  }
  function createComponentFactory(config2) {
    const { name: _name, defaults, createState, setup, onUpdate, cleanup: cleanup2, noopState } = config2;
    return (element, options) => {
      if (!isBrowser()) {
        return createNoopInstance(noopState);
      }
      const mergedOptions = { ...defaults, ...options };
      let state = createState(element, mergedOptions);
      const emitter = createEventEmitter();
      const cleanupFns = [];
      const rafIds = [];
      const timeoutIds = [];
      const intervalIds = [];
      const context = {
        element,
        get state() {
          return state;
        },
        set state(newState) {
          state = newState;
        },
        options: mergedOptions,
        on(target, event, handler4, opts) {
          target.addEventListener(event, handler4, opts);
          cleanupFns.push(() => target.removeEventListener(event, handler4, opts));
        },
        onEvent(target, event, handler4, opts) {
          target.addEventListener(event, handler4, opts);
          cleanupFns.push(() => target.removeEventListener(event, handler4, opts));
        },
        emit(event, data2) {
          emitter.emit(event, data2);
        },
        setState(patch) {
          const prev = { ...state };
          state = { ...state, ...patch };
          onUpdate?.(context, prev);
          emitter.emit("change", state);
          for (const plugin2 of plugins) {
            plugin2.onStateChange?.(instance, state);
          }
        },
        onCleanup(fn) {
          cleanupFns.push(fn);
        },
        raf(fn) {
          const id = requestAnimationFrame(fn);
          rafIds.push(id);
          return id;
        },
        timeout(fn, ms) {
          const id = window.setTimeout(fn, ms);
          timeoutIds.push(id);
          return id;
        },
        interval(fn, ms) {
          const id = window.setInterval(fn, ms);
          intervalIds.push(id);
          return id;
        }
      };
      setup(context);
      if (mergedOptions.className) {
        element.classList.add(...mergedOptions.className.split(" "));
      }
      const instance = {
        get state() {
          return state;
        },
        element,
        on(event, handler4) {
          return emitter.on(event, handler4);
        },
        update(patch) {
          context.setState(patch);
        },
        destroy() {
          cleanup2?.(context);
          rafIds.forEach((id) => cancelAnimationFrame(id));
          timeoutIds.forEach((id) => clearTimeout(id));
          intervalIds.forEach((id) => clearInterval(id));
          cleanupFns.forEach((fn) => fn());
          if (mergedOptions.className) {
            element.classList.remove(...mergedOptions.className.split(" "));
          }
          emitter.emit("destroy", void 0);
          for (const plugin2 of plugins) {
            plugin2.onComponentDestroy?.(instance);
          }
          mergedOptions.onDestroy?.();
        }
      };
      for (const plugin2 of plugins) {
        plugin2.onComponentCreate?.(instance, mergedOptions);
      }
      return instance;
    };
  }
  function createNoopInstance(state) {
    return {
      state,
      element: null,
      on: () => () => {
      },
      update: () => {
      },
      destroy: () => {
      }
    };
  }
  function wrapComponent(createFn, getState, getDestroy) {
    return (element, options) => {
      if (!isBrowser()) {
        return createNoopInstance({});
      }
      const result = createFn(element, options);
      const emitter = createEventEmitter();
      let state = getState(result);
      return {
        get state() {
          return state;
        },
        element,
        on: emitter.on.bind(emitter),
        update(patch) {
          state = { ...state, ...patch };
          emitter.emit("change", state);
        },
        destroy() {
          getDestroy(result)();
          emitter.emit("destroy", void 0);
        }
      };
    };
  }
  var plugins2 = /* @__PURE__ */ new Map();
  function getPlugins() {
    return Array.from(plugins2.values());
  }
  function createStore(initialState, options = {}) {
    const {
      history: enableHistory = false,
      maxHistory = 50,
      persist,
      compare = shallowEqual,
      middleware = []
    } = options;
    let state = initialState;
    if (persist && typeof localStorage !== "undefined") {
      try {
        const saved = localStorage.getItem(persist);
        if (saved) {
          state = { ...initialState, ...JSON.parse(saved) };
        }
      } catch {
      }
    }
    const stateHistory = enableHistory ? [state] : [];
    let historyIndex = 0;
    const undoneStates = [];
    const subscribers = /* @__PURE__ */ new Set();
    const watchers = /* @__PURE__ */ new Map();
    function notify(prev) {
      for (const subscriber of subscribers) {
        try {
          subscriber(state, prev);
        } catch (error2) {
          console.error("[Atlas State] Error in subscriber:", error2);
        }
      }
      for (const [selector, callbacks] of watchers) {
        const prevValue = selector(prev);
        const newValue = selector(state);
        if (prevValue !== newValue) {
          for (const callback of callbacks) {
            try {
              callback(newValue, prevValue);
            } catch (error2) {
              console.error("[Atlas State] Error in watcher:", error2);
            }
          }
        }
      }
    }
    function persistState() {
      if (persist && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(persist, JSON.stringify(state));
        } catch {
        }
      }
    }
    function applyMiddleware(prev, next) {
      let result = next;
      for (const mw of middleware) {
        const modified = mw(prev, result, store2);
        if (modified !== void 0) {
          result = modified;
        }
      }
      return result;
    }
    const store2 = {
      get() {
        return state;
      },
      select(selector) {
        return selector(state);
      },
      set(patch) {
        const prev = state;
        let next = { ...state, ...patch };
        next = applyMiddleware(prev, next);
        if (compare(prev, next)) {
          return;
        }
        state = next;
        if (enableHistory) {
          undoneStates.length = 0;
          stateHistory.push(state);
          if (stateHistory.length > maxHistory) {
            stateHistory.shift();
          }
          historyIndex = stateHistory.length - 1;
        }
        persistState();
        notify(prev);
      },
      update(updater) {
        const patch = updater(state);
        this.set(patch);
      },
      subscribe(subscriber) {
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      },
      watch(selector, callback) {
        if (!watchers.has(selector)) {
          watchers.set(selector, /* @__PURE__ */ new Set());
        }
        const callbacks = watchers.get(selector);
        if (!callbacks) return () => {
        };
        callbacks.add(callback);
        return () => {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            watchers.delete(selector);
          }
        };
      },
      reset() {
        const prev = state;
        state = initialState;
        if (enableHistory) {
          stateHistory.length = 0;
          stateHistory.push(state);
          historyIndex = 0;
          undoneStates.length = 0;
        }
        persistState();
        notify(prev);
      },
      history() {
        return [...stateHistory];
      },
      undo() {
        if (!enableHistory || historyIndex <= 0) {
          return false;
        }
        const prev = state;
        undoneStates.push(state);
        historyIndex--;
        state = stateHistory[historyIndex];
        persistState();
        notify(prev);
        return true;
      },
      redo() {
        if (!enableHistory || undoneStates.length === 0) {
          return false;
        }
        const prev = state;
        const redoState = undoneStates.pop();
        if (!redoState) return false;
        historyIndex++;
        state = redoState;
        stateHistory[historyIndex] = state;
        persistState();
        notify(prev);
        return true;
      },
      destroy() {
        subscribers.clear();
        watchers.clear();
        stateHistory.length = 0;
        undoneStates.length = 0;
      }
    };
    return store2;
  }
  function shallowEqual(a, b) {
    if (a === b) return true;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }
  function derivedStore(source, derive) {
    let derivedState = derive(source.get());
    const subscribers = /* @__PURE__ */ new Set();
    const unsubscribe = source.subscribe((state, _prev) => {
      const prevDerived = derivedState;
      derivedState = derive(state);
      for (const subscriber of subscribers) {
        subscriber(derivedState, prevDerived);
      }
    });
    return {
      get() {
        return derivedState;
      },
      select(selector) {
        return selector(derivedState);
      },
      subscribe(subscriber) {
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      },
      watch(selector, callback) {
        let prevValue = selector(derivedState);
        return this.subscribe((state, _prev) => {
          const newValue = selector(state);
          if (newValue !== prevValue) {
            callback(newValue, prevValue);
            prevValue = newValue;
          }
        });
      },
      history() {
        return [];
      },
      destroy() {
        unsubscribe();
        subscribers.clear();
      }
    };
  }
  function combineStores(stores2) {
    function getCombined() {
      const result = {};
      for (const key in stores2) {
        result[key] = stores2[key].get();
      }
      return result;
    }
    const subscribers = /* @__PURE__ */ new Set();
    const unsubscribes = [];
    for (const key in stores2) {
      const unsub = stores2[key].subscribe(() => {
        const state = getCombined();
        for (const subscriber of subscribers) {
          subscriber(state, state);
        }
      });
      unsubscribes.push(unsub);
    }
    return {
      get: getCombined,
      select(selector) {
        return selector(getCombined());
      },
      subscribe(subscriber) {
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      },
      watch(selector, callback) {
        let prevValue = selector(getCombined());
        return this.subscribe((state) => {
          const newValue = selector(state);
          if (newValue !== prevValue) {
            callback(newValue, prevValue);
            prevValue = newValue;
          }
        });
      },
      history() {
        return [];
      },
      destroy() {
        unsubscribes.forEach((unsub) => unsub());
        subscribers.clear();
      }
    };
  }
  function loggerMiddleware(name) {
    return (prev, next) => {
      console.group(`[Atlas State] ${name}`);
      console.log("Previous:", prev);
      console.log("Next:", next);
      console.groupEnd();
      return next;
    };
  }
  function validatorMiddleware(validators) {
    return (_prev, next) => {
      for (const key in validators) {
        const validator = validators[key];
        if (validator && key in next) {
          const result = validator(next[key]);
          if (result !== true) {
            console.warn(`[Atlas State] Validation failed for "${key}": ${result}`);
            return void 0;
          }
        }
      }
      return next;
    };
  }
  var ATTRS12 = {
    OVERLAY: "data-atlas-sheet-overlay",
    CONTENT: "data-atlas-sheet-content",
    TITLE: "data-atlas-sheet-title",
    DESCRIPTION: "data-atlas-sheet-description",
    CLOSE: "data-atlas-sheet-close"
  };
  var CLASSES12 = {
    ROOT: "atlas-sheet",
    OVERLAY: "atlas-sheet-overlay",
    OPEN: "atlas-sheet--open",
    CLOSING: "atlas-sheet--closing"
  };
  var SIDE_CLASSES = {
    top: "atlas-sheet--top",
    right: "atlas-sheet--right",
    bottom: "atlas-sheet--bottom",
    left: "atlas-sheet--left"
  };
  var SIZE_CLASSES4 = {
    sm: "atlas-sheet--sm",
    default: "atlas-sheet--default",
    lg: "atlas-sheet--lg",
    xl: "atlas-sheet--xl",
    full: "atlas-sheet--full"
  };
  function createSheet(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState82();
    }
    const {
      side = "right",
      size: size2 = "default",
      modal = true,
      closeOnEsc = true,
      closeOnOverlay = true,
      open: initialOpen = false
    } = options;
    let isOpenState = false;
    let currentSide = side;
    let currentSize = size2;
    let previouslyFocused = null;
    const id = generateId("sheet");
    let overlay = null;
    let content = null;
    let focusTrap = null;
    let dismissHandler = null;
    let unlockScrollFn = null;
    function init() {
      element.classList.add(CLASSES12.ROOT);
      element.setAttribute("data-atlas-sheet", "");
      element.setAttribute("role", "dialog");
      element.setAttribute("aria-modal", modal ? "true" : "false");
      element.id = id;
      applySideClass();
      applySizeClass();
      overlay = element.querySelector(`[${ATTRS12.OVERLAY}]`);
      if (!overlay && modal) {
        overlay = document.createElement("div");
        overlay.className = CLASSES12.OVERLAY;
        overlay.setAttribute(ATTRS12.OVERLAY, "");
        element.insertBefore(overlay, element.firstChild);
      }
      content = element.querySelector(`[${ATTRS12.CONTENT}]`);
      if (content) {
        content.setAttribute("tabindex", "-1");
      }
      const title = element.querySelector(`[${ATTRS12.TITLE}]`);
      if (title) {
        const titleId = `${id}-title`;
        title.id = titleId;
        element.setAttribute("aria-labelledby", titleId);
      }
      const description = element.querySelector(`[${ATTRS12.DESCRIPTION}]`);
      if (description) {
        const descId = `${id}-desc`;
        description.id = descId;
        element.setAttribute("aria-describedby", descId);
      }
      setupCloseButtons();
      if (closeOnOverlay && overlay) {
        overlay.addEventListener("click", handleOverlayClick);
      }
      if (initialOpen) {
        requestAnimationFrame(() => open());
      }
    }
    function setupCloseButtons() {
      const closeButtons = element.querySelectorAll(`[${ATTRS12.CLOSE}]`);
      closeButtons.forEach((btn) => {
        btn.addEventListener("click", close);
        if (!btn.getAttribute("aria-label")) {
          btn.setAttribute("aria-label", "Close sheet");
        }
      });
    }
    function handleOverlayClick(event) {
      if (event.target === overlay) {
        close();
      }
    }
    function applySideClass() {
      Object.values(SIDE_CLASSES).forEach((cls) => {
        element.classList.remove(cls);
      });
      element.classList.add(SIDE_CLASSES[currentSide]);
    }
    function applySizeClass() {
      Object.values(SIZE_CLASSES4).forEach((cls) => {
        element.classList.remove(cls);
      });
      element.classList.add(SIZE_CLASSES4[currentSize]);
    }
    function open() {
      if (isOpenState) return;
      isOpenState = true;
      previouslyFocused = document.activeElement;
      element.classList.add(CLASSES12.OPEN);
      element.removeAttribute("hidden");
      if (modal) {
        unlockScrollFn = lockScroll();
      }
      const trapTarget = content ?? element;
      focusTrap = createFocusTrap({
        container: trapTarget,
        initialFocus: "container",
        returnFocus: previouslyFocused ?? "previous"
      });
      focusTrap.activate();
      if (closeOnEsc) {
        dismissHandler = createDismissHandler(element, {
          escapeKey: true,
          clickOutside: false,
          onDismiss: close
        });
      }
      requestAnimationFrame(() => {
        (content ?? element).focus();
      });
      options.onOpen?.();
    }
    function close() {
      if (!isOpenState) return;
      isOpenState = false;
      element.classList.add(CLASSES12.CLOSING);
      setTimeout(() => {
        element.classList.remove(CLASSES12.OPEN, CLASSES12.CLOSING);
        element.setAttribute("hidden", "");
        focusTrap?.deactivate();
        focusTrap = null;
        dismissHandler?.destroy();
        dismissHandler = null;
        unlockScrollFn?.();
        unlockScrollFn = null;
        previouslyFocused?.focus();
        previouslyFocused = null;
        options.onClose?.();
      }, ANIMATION_DURATION.normal);
    }
    function toggle() {
      if (isOpenState) {
        close();
      } else {
        open();
      }
    }
    function setSide(newSide) {
      currentSide = newSide;
      applySideClass();
    }
    function setSize(newSize) {
      currentSize = newSize;
      applySizeClass();
    }
    function destroy() {
      if (isOpenState) {
        element.classList.remove(CLASSES12.OPEN, CLASSES12.CLOSING);
        focusTrap?.deactivate();
        dismissHandler?.destroy();
        unlockScrollFn?.();
      }
      overlay?.removeEventListener("click", handleOverlayClick);
      const closeButtons = element.querySelectorAll(`[${ATTRS12.CLOSE}]`);
      closeButtons.forEach((btn) => {
        btn.removeEventListener("click", close);
      });
      element.classList.remove(
        CLASSES12.ROOT,
        CLASSES12.OPEN,
        ...Object.values(SIDE_CLASSES),
        ...Object.values(SIZE_CLASSES4)
      );
      element.removeAttribute("data-atlas-sheet");
    }
    init();
    return {
      isOpen: () => isOpenState,
      open,
      close,
      toggle,
      setSide,
      getSide: () => currentSide,
      setSize,
      getSize: () => currentSize,
      destroy
    };
  }
  function createNoopState82() {
    return {
      isOpen: () => false,
      open: () => {
      },
      close: () => {
      },
      toggle: () => {
      },
      setSide: () => {
      },
      getSide: () => "right",
      setSize: () => {
      },
      getSize: () => "default",
      destroy: () => {
      }
    };
  }
  var TYPE_DEFAULTS = {
    text: { height: "1em", borderRadius: "4px" },
    avatar: { width: "48px", height: "48px", borderRadius: "50%" },
    card: { height: "200px", borderRadius: "8px" },
    image: { height: "200px", borderRadius: "8px" },
    custom: {}
  };
  var LINE_WIDTHS = ["100%", "95%", "85%", "90%", "75%"];
  function createSkeleton(container, options = {}) {
    if (!isBrowser()) {
      return createNoopSkeletonState();
    }
    const {
      type = "text",
      animation = "shimmer",
      lines = 1,
      width = "100%",
      height,
      borderRadius,
      className,
      ariaLabel = "Loading..."
    } = options;
    const defaults = TYPE_DEFAULTS[type];
    const finalHeight = height || defaults.height || "1em";
    const finalRadius = borderRadius || defaults.borderRadius || "4px";
    const finalWidth = type === "avatar" ? defaults.width : width;
    let isVisible = true;
    const elements = [];
    let wrapperElement = null;
    wrapperElement = createElement("div", {
      className: `atlas-skeleton-wrapper ${className || ""}`.trim(),
      attributes: {
        "data-atlas-skeleton": "",
        role: "status",
        "aria-busy": "true",
        "aria-label": ariaLabel
      },
      styles: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: finalWidth
      }
    });
    if (!wrapperElement) {
      return createNoopSkeletonState();
    }
    const createSkeletonElement = (elementWidth, elementHeight) => {
      const baseStyles = {
        width: elementWidth,
        height: elementHeight,
        borderRadius: finalRadius,
        backgroundColor: "#e5e7eb",
        position: "relative",
        overflow: "hidden"
      };
      const skeleton = createElement("div", {
        className: "atlas-skeleton",
        styles: baseStyles
      });
      if (skeleton && animation !== "none") {
        const overlay = createElement("div", {
          className: "atlas-skeleton-animation",
          styles: {
            position: "absolute",
            inset: "0",
            ...animation === "shimmer" ? {
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              animation: `atlas-skeleton-shimmer 1.5s ${EASING.standard} infinite`
            } : {
              animation: `atlas-skeleton-pulse 1.5s ${EASING.standard} infinite`,
              backgroundColor: "rgba(255,255,255,0.3)"
            }
          }
        });
        if (overlay) {
          skeleton.appendChild(overlay);
        }
      }
      return skeleton;
    };
    if (type === "text") {
      for (let i = 0; i < lines; i++) {
        const lineWidth = LINE_WIDTHS[i % LINE_WIDTHS.length];
        const element = createSkeletonElement(lineWidth, finalHeight);
        if (element) {
          elements.push(element);
          wrapperElement.appendChild(element);
        }
      }
    } else if (type === "avatar") {
      const element = createSkeletonElement(finalWidth || "48px", finalHeight);
      if (element) {
        elements.push(element);
        wrapperElement.appendChild(element);
      }
    } else if (type === "card") {
      const imageElement = createSkeletonElement("100%", "120px");
      if (imageElement) {
        imageElement.style.borderRadius = `${finalRadius} ${finalRadius} 0 0`;
        elements.push(imageElement);
        wrapperElement.appendChild(imageElement);
      }
      const contentWrapper = createElement("div", {
        styles: {
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }
      });
      if (contentWrapper) {
        const titleElement = createSkeletonElement("60%", "1.25em");
        if (titleElement) {
          elements.push(titleElement);
          contentWrapper.appendChild(titleElement);
        }
        for (let i = 0; i < 2; i++) {
          const lineElement = createSkeletonElement(LINE_WIDTHS[i], "0.875em");
          if (lineElement) {
            elements.push(lineElement);
            contentWrapper.appendChild(lineElement);
          }
        }
        wrapperElement.appendChild(contentWrapper);
      }
    } else if (type === "image") {
      const element = createSkeletonElement("100%", finalHeight);
      if (element) {
        elements.push(element);
        wrapperElement.appendChild(element);
      }
    } else {
      const element = createSkeletonElement(finalWidth || "100%", finalHeight);
      if (element) {
        elements.push(element);
        wrapperElement.appendChild(element);
      }
    }
    container.appendChild(wrapperElement);
    const show = () => {
      if (isVisible || !wrapperElement) return;
      isVisible = true;
      wrapperElement.style.display = "flex";
      wrapperElement.setAttribute("aria-busy", "true");
    };
    const hide = () => {
      if (!isVisible || !wrapperElement) return;
      isVisible = false;
      wrapperElement.style.transition = `opacity 200ms ${EASING.accelerate}`;
      wrapperElement.style.opacity = "0";
      setTimeout(() => {
        if (wrapperElement) {
          wrapperElement.style.display = "none";
          wrapperElement.setAttribute("aria-busy", "false");
        }
      }, 200);
    };
    const toggle = () => {
      if (isVisible) {
        hide();
      } else {
        show();
      }
    };
    const destroy = () => {
      wrapperElement?.remove();
      wrapperElement = null;
      elements.length = 0;
    };
    return {
      get isVisible() {
        return isVisible;
      },
      get elements() {
        return [...elements];
      },
      show,
      hide,
      toggle,
      destroy
    };
  }
  function createNoopSkeletonState() {
    return {
      get isVisible() {
        return false;
      },
      get elements() {
        return [];
      },
      show: () => {
      },
      hide: () => {
      },
      toggle: () => {
      },
      destroy: () => {
      }
    };
  }
  function getAnimationStyles(animation, distance) {
    const styles = {
      fade: {
        initial: { opacity: "0" },
        final: { opacity: "1" }
      },
      "fade-up": {
        initial: { opacity: "0", transform: `translateY(${distance}px)` },
        final: { opacity: "1", transform: "translateY(0)" }
      },
      "fade-down": {
        initial: { opacity: "0", transform: `translateY(-${distance}px)` },
        final: { opacity: "1", transform: "translateY(0)" }
      },
      "fade-left": {
        initial: { opacity: "0", transform: `translateX(${distance}px)` },
        final: { opacity: "1", transform: "translateX(0)" }
      },
      "fade-right": {
        initial: { opacity: "0", transform: `translateX(-${distance}px)` },
        final: { opacity: "1", transform: "translateX(0)" }
      },
      scale: {
        initial: { opacity: "0", transform: "scale(0.8)" },
        final: { opacity: "1", transform: "scale(1)" }
      },
      "scale-up": {
        initial: {
          opacity: "0",
          transform: `scale(0.8) translateY(${distance}px)`
        },
        final: { opacity: "1", transform: "scale(1) translateY(0)" }
      },
      flip: {
        initial: {
          opacity: "0",
          transform: "perspective(400px) rotateX(-90deg)"
        },
        final: { opacity: "1", transform: "perspective(400px) rotateX(0)" }
      },
      "slide-up": {
        initial: { transform: `translateY(${distance * 2}px)` },
        final: { transform: "translateY(0)" }
      },
      "slide-down": {
        initial: { transform: `translateY(-${distance * 2}px)` },
        final: { transform: "translateY(0)" }
      },
      "slide-left": {
        initial: { transform: `translateX(${distance * 2}px)` },
        final: { transform: "translateX(0)" }
      },
      "slide-right": {
        initial: { transform: `translateX(-${distance * 2}px)` },
        final: { transform: "translateX(0)" }
      },
      zoom: {
        initial: { opacity: "0", transform: "scale(0)" },
        final: { opacity: "1", transform: "scale(1)" }
      }
    };
    return styles[animation];
  }
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  function prefersReducedMotion() {
    if (!isBrowser()) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function applyStyles(element, styles) {
    if (styles.opacity !== void 0) {
      element.style.opacity = styles.opacity;
    }
    if (styles.transform !== void 0) {
      element.style.transform = styles.transform;
    }
  }
  function stagger(elements, options = {}) {
    if (!isBrowser()) {
      return () => {
      };
    }
    const {
      animation = "fade-up",
      delay = 50,
      initialDelay = 0,
      duration = ANIMATION_DURATION.normal,
      easing = EASING.spring,
      order = "normal",
      trigger: trigger2 = "immediate",
      threshold = 0.1,
      once: once2 = true,
      distance = 20,
      onComplete,
      onElementAnimate
    } = options;
    let elementArray = Array.from(elements);
    if (elementArray.length === 0) {
      return () => {
      };
    }
    if (prefersReducedMotion()) {
      elementArray.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "";
      });
      onComplete?.();
      return () => {
      };
    }
    switch (order) {
      case "reverse":
        elementArray = elementArray.reverse();
        break;
      case "random":
        elementArray = shuffleArray(elementArray);
        break;
    }
    const { initial, final } = getAnimationStyles(animation, distance);
    let animatedCount = 0;
    let observer22 = null;
    const timeouts = [];
    const originalStyles = /* @__PURE__ */ new Map();
    elementArray.forEach((el) => {
      originalStyles.set(el, el.style.cssText);
      applyStyles(el, initial);
      el.style.transition = "none";
    });
    const animateElement = (element, index) => {
      const elementDelay = initialDelay + index * delay;
      const timeout = setTimeout(() => {
        element.style.transition = `
        opacity ${duration}ms ${easing},
        transform ${duration}ms ${easing}
      `.replace(/\s+/g, " ").trim();
        applyStyles(element, final);
        onElementAnimate?.(element, index);
        animatedCount++;
        if (animatedCount === elementArray.length) {
          setTimeout(() => {
            onComplete?.();
          }, duration);
        }
      }, elementDelay);
      timeouts.push(timeout);
    };
    if (trigger2 === "immediate") {
      elementArray.forEach((el, index) => {
        animateElement(el, index);
      });
    } else if (trigger2 === "scroll") {
      const animatedElements = /* @__PURE__ */ new Set();
      observer22 = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const element = entry.target;
            if (entry.isIntersecting && !animatedElements.has(element)) {
              animateElement(element, animatedElements.size);
              if (once2) {
                animatedElements.add(element);
                observer22?.unobserve(element);
              }
            } else if (!entry.isIntersecting && !once2 && animatedElements.has(element)) {
              animatedElements.delete(element);
              applyStyles(element, initial);
              animatedCount = Math.max(0, animatedCount - 1);
            }
          });
        },
        { threshold }
      );
      elementArray.forEach((el) => observer22?.observe(el));
    }
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      if (observer22) {
        observer22.disconnect();
      }
      elementArray.forEach((el) => {
        const original = originalStyles.get(el);
        if (original !== void 0) {
          el.style.cssText = original;
        }
      });
    };
  }
  function createSwitch(element, options = {}) {
    if (!isBrowser()) {
      return createNoopSwitchState();
    }
    const {
      checked: initialChecked = false,
      disabled: initialDisabled = false,
      size: size2 = "md",
      name,
      value,
      onChange
    } = options;
    let isChecked = initialChecked;
    let isDisabled = initialDisabled;
    let isLoading = false;
    let thumbElement = null;
    const cleanupListeners = [];
    element.classList.add("atlas-switch", `atlas-switch-${size2}`);
    element.setAttribute("role", "switch");
    element.setAttribute("tabindex", isDisabled ? "-1" : "0");
    if (name) element.setAttribute("data-name", name);
    if (value) element.setAttribute("data-value", value);
    thumbElement = element.querySelector(".atlas-switch-thumb");
    if (!thumbElement) {
      thumbElement = document.createElement("span");
      thumbElement.className = "atlas-switch-thumb";
      thumbElement.setAttribute("aria-hidden", "true");
      element.appendChild(thumbElement);
    }
    element.style.transition = `background-color ${ANIMATION_DURATION.fast}ms ${EASING.standard}`;
    thumbElement.style.transition = `transform ${ANIMATION_DURATION.fast}ms ${EASING.spring}`;
    function updateState() {
      element.setAttribute("aria-checked", String(isChecked));
      if (isChecked) {
        element.classList.add("atlas-switch-checked");
      } else {
        element.classList.remove("atlas-switch-checked");
      }
      if (isDisabled) {
        element.setAttribute("aria-disabled", "true");
        element.setAttribute("tabindex", "-1");
        element.classList.add("atlas-switch-disabled");
      } else {
        element.removeAttribute("aria-disabled");
        element.setAttribute("tabindex", "0");
        element.classList.remove("atlas-switch-disabled");
      }
      if (isLoading) {
        element.classList.add("atlas-switch-loading");
        element.setAttribute("aria-busy", "true");
      } else {
        element.classList.remove("atlas-switch-loading");
        element.removeAttribute("aria-busy");
      }
    }
    function handleToggle() {
      if (isDisabled || isLoading) return;
      isChecked = !isChecked;
      updateState();
      onChange?.(isChecked);
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    }
    cleanupListeners.push(
      addListener(element, "click", handleToggle),
      handleActivation(element, handleToggle, [" "])
      // Only space, not Enter
    );
    updateState();
    const setChecked = (checked) => {
      if (isChecked === checked) return;
      isChecked = checked;
      updateState();
      onChange?.(isChecked);
    };
    const toggle = () => {
      handleToggle();
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      updateState();
    };
    const setLoading = (loading) => {
      isLoading = loading;
      updateState();
    };
    const focus = () => {
      element.focus();
    };
    const destroy = () => {
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.classList.remove(
        "atlas-switch",
        `atlas-switch-${size2}`,
        "atlas-switch-checked",
        "atlas-switch-disabled",
        "atlas-switch-loading"
      );
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      element.removeAttribute("aria-checked");
      element.removeAttribute("aria-disabled");
      element.removeAttribute("aria-busy");
      if (thumbElement && thumbElement.parentElement === element) {
        thumbElement.remove();
      }
    };
    return {
      get isChecked() {
        return isChecked;
      },
      get isDisabled() {
        return isDisabled;
      },
      get isLoading() {
        return isLoading;
      },
      setChecked,
      toggle,
      setDisabled,
      setLoading,
      focus,
      destroy
    };
  }
  function createNoopSwitchState() {
    return {
      get isChecked() {
        return false;
      },
      get isDisabled() {
        return false;
      },
      get isLoading() {
        return false;
      },
      setChecked: () => {
      },
      toggle: () => {
      },
      setDisabled: () => {
      },
      setLoading: () => {
      },
      focus: () => {
      },
      destroy: () => {
      }
    };
  }
  var ATTRS13 = {
    HEADER: "data-atlas-table-header",
    BODY: "data-atlas-table-body",
    ROW: "data-atlas-table-row",
    CELL: "data-atlas-table-cell",
    SORTABLE: "data-atlas-table-sortable",
    CHECKBOX: "data-atlas-table-checkbox"
  };
  var CLASSES13 = {
    ROOT: "atlas-table",
    WRAPPER: "atlas-table-wrapper",
    TABLE: "atlas-table-element",
    HEADER: "atlas-table-header",
    HEADER_ROW: "atlas-table-header-row",
    HEADER_CELL: "atlas-table-header-cell",
    BODY: "atlas-table-body",
    ROW: "atlas-table-row",
    ROW_SELECTED: "atlas-table-row--selected",
    CELL: "atlas-table-cell",
    CHECKBOX: "atlas-table-checkbox",
    SORT_ICON: "atlas-table-sort-icon",
    SORT_ASC: "atlas-table-sort--asc",
    SORT_DESC: "atlas-table-sort--desc",
    STRIPED: "atlas-table--striped",
    HOVERABLE: "atlas-table--hoverable",
    COMPACT: "atlas-table--compact",
    STICKY: "atlas-table--sticky-header"
  };
  function createTable(element, options = {}) {
    if (!isBrowser()) {
      return createNoopState92();
    }
    const {
      columns: initialColumns = [],
      data: initialData = [],
      selectable = false,
      multiSelect = true,
      striped = false,
      hoverable = true,
      compact = false,
      stickyHeader = false,
      rowKey
    } = options;
    let currentColumns = initialColumns;
    let currentData = initialData;
    const selectedRows = /* @__PURE__ */ new Set();
    let sortKey = null;
    let sortDirection = null;
    const id = generateId("table");
    let tableEl = null;
    let theadEl = null;
    let tbodyEl = null;
    const cleanups = [];
    function init() {
      element.classList.add(CLASSES13.ROOT);
      element.setAttribute("data-atlas-table", "");
      element.id = id;
      if (striped) element.classList.add(CLASSES13.STRIPED);
      if (hoverable) element.classList.add(CLASSES13.HOVERABLE);
      if (compact) element.classList.add(CLASSES13.COMPACT);
      if (stickyHeader) element.classList.add(CLASSES13.STICKY);
      const wrapper = document.createElement("div");
      wrapper.className = CLASSES13.WRAPPER;
      tableEl = document.createElement("table");
      tableEl.className = CLASSES13.TABLE;
      tableEl.setAttribute("role", "grid");
      theadEl = document.createElement("thead");
      theadEl.className = CLASSES13.HEADER;
      theadEl.setAttribute(ATTRS13.HEADER, "");
      tbodyEl = document.createElement("tbody");
      tbodyEl.className = CLASSES13.BODY;
      tbodyEl.setAttribute(ATTRS13.BODY, "");
      tableEl.appendChild(theadEl);
      tableEl.appendChild(tbodyEl);
      wrapper.appendChild(tableEl);
      element.appendChild(wrapper);
      renderHeader();
      renderBody();
    }
    function getRowKey(row, index) {
      if (typeof rowKey === "function") {
        return rowKey(row);
      }
      if (rowKey && typeof row === "object" && row !== null) {
        return String(row[rowKey]);
      }
      return String(index);
    }
    function renderHeader() {
      if (!theadEl) return;
      theadEl.innerHTML = "";
      const tr = document.createElement("tr");
      tr.className = CLASSES13.HEADER_ROW;
      if (selectable && multiSelect) {
        const th = document.createElement("th");
        th.className = `${CLASSES13.HEADER_CELL} ${CLASSES13.CHECKBOX}`;
        th.innerHTML = `
        <input type="checkbox" ${ATTRS13.CHECKBOX} aria-label="Select all rows" />
      `;
        const checkbox = th.querySelector("input");
        if (!checkbox) return;
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            selectAll();
          } else {
            clearSelection();
          }
        });
        tr.appendChild(th);
      }
      currentColumns.forEach((col) => {
        if (col.hidden) return;
        const th = document.createElement("th");
        th.className = CLASSES13.HEADER_CELL;
        th.setAttribute("data-key", col.key);
        if (col.width) {
          th.style.width = col.width;
        }
        if (col.align) {
          th.style.textAlign = col.align;
        }
        if (col.sortable) {
          th.setAttribute(ATTRS13.SORTABLE, "");
          th.setAttribute("role", "columnheader");
          th.setAttribute(
            "aria-sort",
            sortKey === col.key ? sortDirection === "asc" ? "ascending" : "descending" : "none"
          );
          th.style.cursor = "pointer";
          const isSorted = sortKey === col.key;
          th.innerHTML = `
          <span class="atlas-table-header-content">
            <span>${escapeHtml3(col.header)}</span>
            <span class="${CLASSES13.SORT_ICON} ${isSorted && sortDirection === "asc" ? CLASSES13.SORT_ASC : ""} ${isSorted && sortDirection === "desc" ? CLASSES13.SORT_DESC : ""}" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </span>
          </span>
        `;
          th.addEventListener("click", () => handleSort(col.key));
        } else {
          th.textContent = col.header;
        }
        tr.appendChild(th);
      });
      theadEl.appendChild(tr);
    }
    function renderBody() {
      if (!tbodyEl) return;
      tbodyEl.innerHTML = "";
      currentData.forEach((row, index) => {
        const key = getRowKey(row, index);
        const isSelected = selectedRows.has(key);
        const tr = document.createElement("tr");
        tr.className = `${CLASSES13.ROW} ${isSelected ? CLASSES13.ROW_SELECTED : ""}`;
        tr.setAttribute(ATTRS13.ROW, "");
        tr.setAttribute("data-row-key", key);
        tr.setAttribute("data-row-index", String(index));
        if (isSelected) {
          tr.setAttribute("aria-selected", "true");
        }
        if (selectable) {
          const td = document.createElement("td");
          td.className = `${CLASSES13.CELL} ${CLASSES13.CHECKBOX}`;
          td.innerHTML = `
          <input type="checkbox" ${ATTRS13.CHECKBOX} ${isSelected ? "checked" : ""} aria-label="Select row" />
        `;
          const checkbox = td.querySelector("input");
          if (checkbox) {
            checkbox.addEventListener("change", (e) => {
              e.stopPropagation();
              toggleRowSelection(row, index);
            });
          }
          tr.appendChild(td);
        }
        currentColumns.forEach((col) => {
          if (col.hidden) return;
          const td = document.createElement("td");
          td.className = CLASSES13.CELL;
          td.setAttribute(ATTRS13.CELL, "");
          td.setAttribute("data-key", col.key);
          if (col.align) {
            td.style.textAlign = col.align;
          }
          const value = row[col.key];
          if (col.render) {
            const rendered = col.render(value, row, index);
            if (typeof rendered === "string") {
              td.innerHTML = rendered;
            } else {
              td.appendChild(rendered);
            }
          } else {
            td.textContent = value != null ? String(value) : "";
          }
          tr.appendChild(td);
        });
        tr.addEventListener("click", (e) => {
          const target = e.target;
          if (target.tagName === "INPUT") return;
          if (selectable && !multiSelect) {
            toggleRowSelection(row, index);
          }
          options.onRowClick?.(row, index);
        });
        tbodyEl?.appendChild(tr);
      });
      updateSelectAllCheckbox();
    }
    function handleSort(key) {
      if (sortKey === key) {
        sortDirection = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc";
      } else {
        sortKey = key;
        sortDirection = "asc";
      }
      if (sortDirection === null) {
        sortKey = null;
      }
      renderHeader();
      options.onSortChange?.(key, sortDirection);
    }
    function toggleRowSelection(row, index) {
      const key = getRowKey(row, index);
      if (multiSelect) {
        if (selectedRows.has(key)) {
          selectedRows.delete(key);
        } else {
          selectedRows.add(key);
        }
      } else {
        if (selectedRows.has(key)) {
          selectedRows.clear();
        } else {
          selectedRows.clear();
          selectedRows.add(key);
        }
      }
      renderBody();
      emitSelectionChange();
    }
    function selectAll() {
      selectedRows.clear();
      currentData.forEach((row, index) => {
        selectedRows.add(getRowKey(row, index));
      });
      renderBody();
      emitSelectionChange();
    }
    function clearSelection() {
      selectedRows.clear();
      renderBody();
      emitSelectionChange();
    }
    function select(rows) {
      selectedRows.clear();
      rows.forEach((row) => {
        const index = currentData.indexOf(row);
        if (index !== -1) {
          selectedRows.add(getRowKey(row, index));
        }
      });
      renderBody();
    }
    function updateSelectAllCheckbox() {
      if (!selectable || !multiSelect) return;
      const selectAllCheckbox = theadEl?.querySelector(
        `input[${ATTRS13.CHECKBOX}]`
      );
      if (!selectAllCheckbox) return;
      const allSelected = currentData.length > 0 && selectedRows.size === currentData.length;
      const someSelected = selectedRows.size > 0 && selectedRows.size < currentData.length;
      selectAllCheckbox.checked = allSelected;
      selectAllCheckbox.indeterminate = someSelected;
    }
    function emitSelectionChange() {
      const selected = currentData.filter((row, index) => selectedRows.has(getRowKey(row, index)));
      options.onSelectionChange?.(selected);
    }
    function getSelected() {
      return currentData.filter((row, index) => selectedRows.has(getRowKey(row, index)));
    }
    function setData(data2) {
      currentData = data2;
      selectedRows.clear();
      renderBody();
    }
    function setColumns(columns) {
      currentColumns = columns;
      renderHeader();
      renderBody();
    }
    function setSort(key, direction) {
      sortKey = direction ? key : null;
      sortDirection = direction;
      renderHeader();
    }
    function refresh() {
      renderHeader();
      renderBody();
    }
    function destroy() {
      cleanups.forEach((cleanup2) => cleanup2());
      element.classList.remove(
        CLASSES13.ROOT,
        CLASSES13.STRIPED,
        CLASSES13.HOVERABLE,
        CLASSES13.COMPACT,
        CLASSES13.STICKY
      );
      element.removeAttribute("data-atlas-table");
      element.innerHTML = "";
    }
    init();
    return {
      getData: () => [...currentData],
      setData,
      getColumns: () => [...currentColumns],
      setColumns,
      getSelected,
      select,
      clearSelection,
      selectAll,
      getSort: () => sortKey ? { key: sortKey, direction: sortDirection } : null,
      setSort,
      refresh,
      destroy
    };
  }
  function createNoopState92() {
    return {
      getData: () => [],
      setData: () => {
      },
      getColumns: () => [],
      setColumns: () => {
      },
      getSelected: () => [],
      select: () => {
      },
      clearSelection: () => {
      },
      selectAll: () => {
      },
      getSort: () => null,
      setSort: () => {
      },
      refresh: () => {
      },
      destroy: () => {
      }
    };
  }
  function escapeHtml3(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
  function createToggle(element, options = {}) {
    if (!isBrowser()) {
      return createNoopToggleState();
    }
    const {
      pressed: initialPressed = false,
      disabled: initialDisabled = false,
      variant = "default",
      size: size2 = "md",
      onChange
    } = options;
    let isPressed = initialPressed;
    let isDisabled = initialDisabled;
    const cleanupListeners = [];
    element.classList.add("atlas-toggle", `atlas-toggle-${variant}`, `atlas-toggle-${size2}`);
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", isDisabled ? "-1" : "0");
    element.style.transition = `
    background-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
    border-color ${ANIMATION_DURATION.fast}ms ${EASING.standard},
    color ${ANIMATION_DURATION.fast}ms ${EASING.standard}
  `.replace(/\s+/g, " ").trim();
    function updateState() {
      element.setAttribute("aria-pressed", String(isPressed));
      if (isPressed) {
        element.classList.add("atlas-toggle-pressed");
        element.dataset.state = "on";
      } else {
        element.classList.remove("atlas-toggle-pressed");
        element.dataset.state = "off";
      }
      if (isDisabled) {
        element.setAttribute("aria-disabled", "true");
        element.setAttribute("tabindex", "-1");
        element.classList.add("atlas-toggle-disabled");
      } else {
        element.removeAttribute("aria-disabled");
        element.setAttribute("tabindex", "0");
        element.classList.remove("atlas-toggle-disabled");
      }
    }
    function handleToggle() {
      if (isDisabled) return;
      isPressed = !isPressed;
      updateState();
      if (element.animate) {
        element.animate([{ transform: "scale(0.97)" }, { transform: "scale(1)" }], {
          duration: ANIMATION_DURATION.fast,
          easing: EASING.bounce
        });
      }
      onChange?.(isPressed);
    }
    cleanupListeners.push(
      addListener(element, "click", handleToggle),
      handleActivation(element, handleToggle)
    );
    updateState();
    const setPressed = (pressed) => {
      if (isPressed === pressed) return;
      isPressed = pressed;
      updateState();
      onChange?.(isPressed);
    };
    const toggle = () => {
      handleToggle();
    };
    const setDisabled = (disabled) => {
      isDisabled = disabled;
      updateState();
    };
    const focus = () => {
      element.focus();
    };
    const destroy = () => {
      cleanupListeners.forEach((cleanup2) => cleanup2());
      element.classList.remove(
        "atlas-toggle",
        `atlas-toggle-${variant}`,
        `atlas-toggle-${size2}`,
        "atlas-toggle-pressed",
        "atlas-toggle-disabled"
      );
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      element.removeAttribute("aria-pressed");
      element.removeAttribute("aria-disabled");
      delete element.dataset.state;
    };
    return {
      get isPressed() {
        return isPressed;
      },
      get isDisabled() {
        return isDisabled;
      },
      setPressed,
      toggle,
      setDisabled,
      focus,
      destroy
    };
  }
  function createNoopToggleState() {
    return {
      get isPressed() {
        return false;
      },
      get isDisabled() {
        return false;
      },
      setPressed: () => {
      },
      toggle: () => {
      },
      setDisabled: () => {
      },
      focus: () => {
      },
      destroy: () => {
      }
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-IONIVXWP.js
  function rafThrottle(func) {
    let rafId = null;
    let lastArgs = null;
    let lastThis = null;
    const throttled = function(...args) {
      lastArgs = args;
      lastThis = this;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (lastArgs !== null) {
            func.apply(lastThis, lastArgs);
          }
          rafId = null;
          lastArgs = null;
          lastThis = null;
        });
      }
    };
    throttled.cancel = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        lastArgs = null;
        lastThis = null;
      }
    };
    return throttled;
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-ZP6AW5OK.js
  var StyleManager = class {
    constructor() {
      this.originalStyles = /* @__PURE__ */ new Map();
    }
    /**
     * Saves the current value of a CSS property.
     *
     * @param element - The target element
     * @param property - The CSS property name
     */
    saveStyle(element, property) {
      if (!this.originalStyles.has(element)) {
        this.originalStyles.set(element, /* @__PURE__ */ new Map());
      }
      const elementStyles = this.originalStyles.get(element);
      if (elementStyles && !elementStyles.has(property)) {
        const computedValue = element.style.getPropertyValue(property);
        elementStyles.set(property, computedValue);
      }
    }
    /**
     * Sets a CSS property value while preserving the original value.
     *
     * @param element - The target element
     * @param property - The CSS property name
     * @param value - The new value to set
     */
    setStyle(element, property, value) {
      this.saveStyle(element, property);
      element.style.setProperty(property, value);
    }
    /**
     * Sets multiple CSS properties at once.
     *
     * @param element - The target element
     * @param styles - An object of CSS property-value pairs
     */
    setStyles(element, styles) {
      Object.entries(styles).forEach(([property, value]) => {
        this.setStyle(element, property, value);
      });
    }
    /**
     * Restores all original styles for an element.
     *
     * @param element - The target element
     */
    restore(element) {
      const elementStyles = this.originalStyles.get(element);
      if (!elementStyles) return;
      elementStyles.forEach((value, property) => {
        if (value === "") {
          element.style.removeProperty(property);
        } else {
          element.style.setProperty(property, value);
        }
      });
      this.originalStyles.delete(element);
    }
    /**
     * Restores all styles for all managed elements.
     */
    restoreAll() {
      this.originalStyles.forEach((-, element) => {
        this.restore(element);
      });
    }
    /**
     * Clears all stored styles without restoring them.
     * Use this if the element has been removed from the DOM.
     */
    clear(element) {
      if (element) {
        this.originalStyles.delete(element);
      } else {
        this.originalStyles.clear();
      }
    }
  };
  function createStyleManager() {
    return new StyleManager();
  }
  function ensurePositioned(element) {
    const computedStyle = window.getComputedStyle(element);
    const originalPosition = computedStyle.position;
    if (originalPosition === "static") {
      const originalValue = element.style.position;
      element.style.position = "relative";
      return () => {
        element.style.position = originalValue;
      };
    }
    return () => {
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-XYB77AYA.js
  function shouldReduceMotion() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function resolveElement(target) {
    if (!target) {
      return null;
    }
    if (typeof target === "string") {
      return document.querySelector(target);
    }
    return target;
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-AMYXJLF7.js
  function tilt(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Tilt] Element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Tilt] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const {
      intensity = 20,
      scale = 1.05,
      perspective = 1e3,
      speed = 300,
      glareEffect = true
    } = options;
    const styleManager = createStyleManager();
    let glareElement = null;
    if (glareEffect) {
      glareElement = document.createElement("div");
      glareElement.className = "atlas-tilt-glare";
      glareElement.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%);
      opacity: 0;
      pointer-events: none;
      transition: opacity ${speed}ms ease;
    `;
      element.appendChild(glareElement);
    }
    styleManager.setStyles(element, {
      "transform-style": "preserve-3d",
      transition: `transform ${speed}ms ease`
    });
    const handleMouseMove = rafThrottle((e) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const rotateX = -y * intensity;
      const rotateY = x * intensity;
      const transformValue = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      styleManager.setStyle(element, "transform", transformValue);
      if (glareElement) {
        glareElement.style.opacity = "1";
        const angle = Math.atan2(y, x) * 180 / Math.PI + 90;
        glareElement.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)`;
      }
    });
    const handleMouseLeave = () => {
      const transformValue = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      styleManager.setStyle(element, "transform", transformValue);
      if (glareElement) {
        glareElement.style.opacity = "0";
      }
    };
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      handleMouseMove.cancel();
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      if (glareElement?.parentNode) {
        glareElement.parentNode.removeChild(glareElement);
      }
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-WX3EQFKS.js
  function createSimpleAnimationLoop(callback) {
    let animationId = null;
    let running = true;
    const animate2 = () => {
      if (!running) return;
      callback();
      animationId = requestAnimationFrame(animate2);
    };
    animationId = requestAnimationFrame(animate2);
    return () => {
      running = false;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-7J2CH7R4.js
  function glow(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Glow] Element not found:", target);
      return () => {
      };
    }
    const {
      color = "#3b82f6",
      intensity = 0.5,
      size: size2 = 20,
      animated = true,
      interactive = true
    } = options;
    const styleManager = createStyleManager();
    const cleanupFunctions = [];
    const applyGlow = (glowIntensity = intensity, glowSize = size2) => {
      const shadowValue = `0 0 ${glowSize}px ${Math.round(glowIntensity * glowSize)}px ${color}`;
      styleManager.setStyle(element, "box-shadow", shadowValue);
    };
    const reduceMotion = shouldReduceMotion();
    if (animated && !reduceMotion) {
      let phase = 0;
      const stopAnimation = createSimpleAnimationLoop(() => {
        const pulseIntensity = Math.sin(phase) * 0.3 + 0.7;
        applyGlow(intensity * pulseIntensity);
        phase += 0.02;
      });
      cleanupFunctions.push(stopAnimation);
    } else {
      applyGlow();
    }
    if (interactive) {
      const handleMouseEnter = () => applyGlow(intensity * 1.5, size2 * 1.2);
      const handleMouseLeave = () => applyGlow();
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      cleanupFunctions.push(() => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    }
    return () => {
      cleanupFunctions.forEach((cleanup2) => cleanup2());
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-IT5NADLR.js
  function morphing(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Morphing] Element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Morphing] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const {
      shapes = ["50%", "0%", "25%", "50%"],
      duration = 2e3,
      autoPlay = true,
      loop: loop2 = true
    } = options;
    const styleManager = createStyleManager();
    let currentIndex = 0;
    let intervalId = null;
    const morph = (shapeIndex) => {
      styleManager.setStyles(element, {
        "border-radius": shapes[shapeIndex],
        transition: `border-radius ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
      });
    };
    const nextShape = () => {
      currentIndex = (currentIndex + 1) % shapes.length;
      morph(currentIndex);
      if (!loop2 && currentIndex === shapes.length - 1 && intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    if (autoPlay) {
      intervalId = setInterval(nextShape, duration + 100);
    }
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-JHVEHKOJ.js
  function wave(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Wave] Element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Wave] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const { amplitude = 10, frequency = 0.02, speed = 0.05, direction = "horizontal" } = options;
    const styleManager = createStyleManager();
    let time = 0;
    const stopAnimation = createSimpleAnimationLoop(() => {
      const offset = Math.sin(time * frequency * 100) * amplitude;
      const transformValue = direction === "horizontal" ? `translateY(${offset}px)` : `translateX(${offset}px)`;
      styleManager.setStyle(element, "transform", transformValue);
      time += speed;
    });
    return () => {
      stopAnimation();
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-QDN5CXXW.js
  function magnetic(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Magnetic] Element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Magnetic] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const { strength = 0.3, threshold = 100, returnSpeed = 0.1 } = options;
    const styleManager = createStyleManager();
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const lerp = (start2, end, factor) => start2 + (end - start2) * factor;
    const handleMouseMove = rafThrottle((e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < threshold) {
        const force = (threshold - distance) / threshold;
        targetX = deltaX * strength * force;
        targetY = deltaY * strength * force;
      } else {
        targetX = 0;
        targetY = 0;
      }
    });
    const stopAnimation = createSimpleAnimationLoop(() => {
      currentX = lerp(currentX, targetX, returnSpeed);
      currentY = lerp(currentY, targetY, returnSpeed);
      const transformValue = `translate(${currentX}px, ${currentY}px)`;
      styleManager.setStyle(element, "transform", transformValue);
    });
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      handleMouseMove.cancel();
      document.removeEventListener("mousemove", handleMouseMove);
      stopAnimation();
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-IGNN6O4E.js
  function typewriter(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Typewriter] Element not found:", target);
      return () => {
      };
    }
    const reduceMotion = shouldReduceMotion();
    const {
      texts = ["Hello World!"],
      speed = 100,
      deleteSpeed = 50,
      pause = 1e3,
      loop: loop2 = true,
      cursor = true,
      cursorChar = "|"
    } = options;
    if (reduceMotion) {
      element.textContent = texts[0];
      return () => {
        element.textContent = "";
      };
    }
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId = null;
    const updateText = () => {
      const currentText = texts[currentTextIndex];
      const displayText = isDeleting ? currentText.substring(0, currentCharIndex - 1) : currentText.substring(0, currentCharIndex + 1);
      element.textContent = displayText + (cursor ? cursorChar : "");
      if (!isDeleting && currentCharIndex < currentText.length) {
        currentCharIndex++;
        timeoutId = setTimeout(updateText, speed);
      } else if (isDeleting && currentCharIndex > 0) {
        currentCharIndex--;
        timeoutId = setTimeout(updateText, deleteSpeed);
      } else if (!isDeleting && currentCharIndex === currentText.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          updateText();
        }, pause);
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = loop2 ? (currentTextIndex + 1) % texts.length : Math.min(currentTextIndex + 1, texts.length - 1);
        timeoutId = setTimeout(updateText, 500);
      }
    };
    updateText();
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      element.textContent = "";
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-IHOHEWWO.js
  function ripple(target, options = {}) {
    const el = resolveElement(target);
    if (!el) {
      console.warn("[Atlas Ripple] Element not found:", target);
      return () => {
      };
    }
    const { strength = 0.5, duration = 600, color = "rgba(255, 255, 255, 0.3)" } = options;
    const restorePosition = ensurePositioned(el);
    const activeRipples = /* @__PURE__ */ new Set();
    const onPointerDown = (e) => {
      if (shouldReduceMotion()) {
        return;
      }
      const pointerEvent = e;
      const rect = el.getBoundingClientRect();
      const x = pointerEvent.clientX - rect.left;
      const y = pointerEvent.clientY - rect.top;
      const ripple2 = document.createElement("div");
      const size2 = Math.max(rect.width, rect.height) * 2 * strength;
      ripple2.className = "atlas-ripple";
      ripple2.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      transition: transform ${duration}ms ease-out, opacity ${duration}ms ease-out;
      width: ${size2}px;
      height: ${size2}px;
      left: ${x}px;
      top: ${y}px;
      opacity: 1;
      z-index: 1000;
    `;
      el.appendChild(ripple2);
      activeRipples.add(ripple2);
      requestAnimationFrame(() => {
        ripple2.style.transform = "translate(-50%, -50%) scale(1)";
        ripple2.style.opacity = "0";
      });
      setTimeout(() => {
        if (ripple2.parentNode) {
          ripple2.parentNode.removeChild(ripple2);
        }
        activeRipples.delete(ripple2);
      }, duration);
    };
    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      activeRipples.forEach((ripple2) => {
        if (ripple2.parentNode) {
          ripple2.parentNode.removeChild(ripple2);
        }
      });
      activeRipples.clear();
      restorePosition();
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-IF5S7JM2.js
  function orbs(target, options = {}) {
    const container = resolveElement(target);
    if (!container) {
      console.warn("[Atlas Orbs] Container element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Orbs] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const {
      count = 5,
      minSize = 20,
      maxSize = 60,
      speed = 0.5,
      color = "rgba(255, 255, 255, 0.1)"
    } = options;
    const orbs2 = [];
    const cleanupFunctions = [];
    const styleManager = createStyleManager();
    styleManager.setStyles(container, {
      position: container.style.position || "relative",
      overflow: "hidden"
    });
    cleanupFunctions.push(() => styleManager.restore(container));
    const getContainerRect = () => container.getBoundingClientRect();
    const rect = getContainerRect();
    for (let i = 0; i < count; i++) {
      const size2 = minSize + Math.random() * (maxSize - minSize);
      const orb = {
        x: Math.random() * (rect.width - size2),
        y: Math.random() * (rect.height - size2),
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: size2,
        element: document.createElement("div")
      };
      orb.element.className = "atlas-orb";
      orb.element.style.cssText = `
      position: absolute;
      width: ${size2}px;
      height: ${size2}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: transform 0.1s ease-out;
      will-change: transform;
    `;
      container.appendChild(orb.element);
      orbs2.push(orb);
    }
    const stopAnimation = createSimpleAnimationLoop(() => {
      const currentRect = getContainerRect();
      orbs2.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x <= 0 || orb.x >= currentRect.width - orb.size) {
          orb.vx *= -1;
          orb.x = Math.max(0, Math.min(currentRect.width - orb.size, orb.x));
        }
        if (orb.y <= 0 || orb.y >= currentRect.height - orb.size) {
          orb.vy *= -1;
          orb.y = Math.max(0, Math.min(currentRect.height - orb.size, orb.y));
        }
        orb.element.style.transform = `translate(${orb.x}px, ${orb.y}px)`;
      });
    });
    cleanupFunctions.push(stopAnimation);
    return () => {
      cleanupFunctions.forEach((cleanup2) => cleanup2());
      orbs2.forEach((orb) => {
        if (orb.element.parentNode) {
          orb.element.parentNode.removeChild(orb.element);
        }
      });
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-GITFLOBJ.js
  function parallax(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas Parallax] Element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Parallax] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const { speed = 0.5, direction = "vertical", offset = 0 } = options;
    const styleManager = createStyleManager();
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const elementBottom = elementTop + elementHeight;
      const viewportTop = scrollTop;
      const viewportBottom = scrollTop + windowHeight;
      if (elementBottom >= viewportTop && elementTop <= viewportBottom) {
        const scrolled = scrollTop - elementTop + offset;
        let transformValue = "";
        switch (direction) {
          case "vertical":
            transformValue = `translateY(${scrolled * speed}px)`;
            break;
          case "horizontal":
            transformValue = `translateX(${scrolled * speed}px)`;
            break;
          case "both":
            transformValue = `translate(${scrolled * speed}px, ${scrolled * speed}px)`;
            break;
        }
        styleManager.setStyle(element, "transform", transformValue);
      }
    };
    const onScroll = rafThrottle(() => {
      updatePosition();
    });
    const onResize = rafThrottle(() => {
      updatePosition();
    });
    updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      onScroll.cancel();
      onResize.cancel();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-F3KESEUA.js
  function glassEffects(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas GlassEffects] Element not found:", target);
      return () => {
      };
    }
    const {
      intensity = 0.15,
      blurAmount = 16,
      animated = true,
      interactiveBlur = true,
      color = "rgba(255, 255, 255, 0.1)"
    } = options;
    const styleManager = createStyleManager();
    const cleanupFunctions = [];
    const applyGlassStyle = (blur = blurAmount, opacity = intensity) => {
      styleManager.setStyles(element, {
        background: `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`,
        "backdrop-filter": `blur(${blur}px) saturate(1.2)`,
        "-webkit-backdrop-filter": `blur(${blur}px) saturate(1.2)`,
        border: `1px solid color-mix(in srgb, ${color} ${Math.round(opacity * 200)}%, transparent)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      });
    };
    if (interactiveBlur) {
      const handleMouseMove = rafThrottle((e) => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const distanceFromCenter = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
        const dynamicBlur = blurAmount * (0.7 + distanceFromCenter * 0.6);
        const dynamicOpacity = intensity * (1.2 - distanceFromCenter * 0.4);
        applyGlassStyle(dynamicBlur, Math.max(0.05, dynamicOpacity));
      });
      const handleMouseLeave = () => {
        applyGlassStyle();
      };
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
      cleanupFunctions.push(() => {
        handleMouseMove.cancel();
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    }
    if (animated && !shouldReduceMotion()) {
      let phase = 0;
      const stopAnimation = createSimpleAnimationLoop(() => {
        const pulseIntensity = Math.sin(phase) * 0.3 + 1;
        const pulseBlur = blurAmount * pulseIntensity;
        const pulseOpacity = intensity * pulseIntensity;
        applyGlassStyle(pulseBlur, pulseOpacity);
        phase += 0.02;
      });
      cleanupFunctions.push(stopAnimation);
    } else {
      applyGlassStyle();
    }
    if (!animated || shouldReduceMotion()) {
      applyGlassStyle();
    }
    return () => {
      cleanupFunctions.forEach((cleanup2) => cleanup2());
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-4AYCY5MJ.js
  function scrollReveal(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas ScrollReveal] Element not found:", target);
      return () => {
      };
    }
    const {
      distance = "20px",
      duration = 800,
      delay = 0,
      easing = "cubic-bezier(0.16, 1, 0.3, 1)",
      origin = "bottom",
      scale = 0.95,
      opacity = [0, 1],
      threshold = 0.1,
      once: once2 = true
    } = options;
    const reduceMotion = shouldReduceMotion();
    if (reduceMotion) {
      element.setAttribute("style", `opacity: ${opacity[1]};`);
      return () => {
        element.removeAttribute("style");
      };
    }
    const styleManager = createStyleManager();
    let hasAnimated = false;
    const setInitialState = () => {
      const transforms = [];
      switch (origin) {
        case "top":
          transforms.push(`translateY(-${distance})`);
          break;
        case "bottom":
          transforms.push(`translateY(${distance})`);
          break;
        case "left":
          transforms.push(`translateX(-${distance})`);
          break;
        case "right":
          transforms.push(`translateX(${distance})`);
          break;
      }
      if (scale !== 1) {
        transforms.push(`scale(${scale})`);
      }
      styleManager.setStyles(element, {
        opacity: opacity[0].toString(),
        transform: transforms.join(" "),
        transition: `all ${duration}ms ${easing} ${delay}ms`,
        "will-change": "transform, opacity"
      });
    };
    const reveal = () => {
      if (hasAnimated && once2) return;
      styleManager.setStyles(element, {
        opacity: opacity[1].toString(),
        transform: "translateX(0) translateY(0) scale(1)"
      });
      hasAnimated = true;
    };
    const hide = () => {
      if (once2) return;
      setInitialState();
      hasAnimated = false;
    };
    const observer3 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
          } else if (!once2) {
            hide();
          }
        });
      },
      {
        threshold,
        rootMargin: "50px 0px -50px 0px"
      }
    );
    setInitialState();
    observer3.observe(element);
    return () => {
      observer3.unobserve(element);
      observer3.disconnect();
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-ADRMXDYZ.js
  function particles(target, options = {}) {
    const container = resolveElement(target);
    if (!container) {
      console.warn("[Atlas Particles] Container element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas Particles] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const {
      count = 30,
      size: size2 = [2, 8],
      speed = [0.1, 0.5],
      color = ["#3b82f6", "#8b5cf6", "#ec4899"],
      opacity = [0.3, 0.8],
      interactive = true,
      connectLines = false,
      maxDistance = 100
    } = options;
    const particles2 = [];
    const colors = Array.isArray(color) ? color : [color];
    const cleanupFunctions = [];
    let canvas = null;
    let ctx = null;
    if (connectLines) {
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("[Atlas Particles] Failed to create canvas context");
        return () => {
        };
      }
      canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
      container.appendChild(canvas);
    }
    const restorePosition = ensurePositioned(container);
    cleanupFunctions.push(restorePosition);
    const getContainerRect = () => container.getBoundingClientRect();
    const rect = getContainerRect();
    for (let i = 0; i < count; i++) {
      const particleSize = size2[0] + Math.random() * (size2[1] - size2[0]);
      const particleSpeed = speed[0] + Math.random() * (speed[1] - speed[0]);
      const particle = {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
        size: particleSize,
        opacity: opacity[0] + Math.random() * (opacity[1] - opacity[0]),
        element: document.createElement("div")
      };
      const particleColor = colors[Math.floor(Math.random() * colors.length)];
      particle.element.style.cssText = `
      position: absolute;
      width: ${particleSize}px;
      height: ${particleSize}px;
      background: ${particleColor};
      border-radius: 50%;
      pointer-events: none;
      opacity: ${particle.opacity};
      will-change: transform;
      z-index: 2;
    `;
      container.appendChild(particle.element);
      particles2.push(particle);
    }
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = rafThrottle((e) => {
      if (!interactive) return;
      const containerRect = getContainerRect();
      mouseX = e.clientX - containerRect.left;
      mouseY = e.clientY - containerRect.top;
    });
    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove);
      cleanupFunctions.push(() => {
        handleMouseMove.cancel();
        container.removeEventListener("mousemove", handleMouseMove);
      });
    }
    const drawConnections = () => {
      if (!ctx || !canvas) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < particles2.length; i++) {
        for (let j = i + 1; j < particles2.length; j++) {
          const dx = particles2[i].x - particles2[j].x;
          const dy = particles2[i].y - particles2[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles2[i].x, particles2[i].y);
            ctx.lineTo(particles2[j].x, particles2[j].y);
            ctx.stroke();
          }
        }
      }
    };
    const stopAnimation = createSimpleAnimationLoop(() => {
      const currentRect = getContainerRect();
      particles2.forEach((particle) => {
        if (interactive) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const force = (100 - distance) / 100 * 0.01;
            particle.vx += dx * force;
            particle.vy += dy * force;
          }
        }
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x <= 0 || particle.x >= currentRect.width) {
          particle.vx *= -0.9;
          particle.x = Math.max(0, Math.min(currentRect.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= currentRect.height) {
          particle.vy *= -0.9;
          particle.y = Math.max(0, Math.min(currentRect.height, particle.y));
        }
        particle.vx *= 0.999;
        particle.vy *= 0.999;
        particle.element.style.transform = `translate(${particle.x - particle.size / 2}px, ${particle.y - particle.size / 2}px)`;
      });
      if (connectLines) {
        drawConnections();
      }
    });
    cleanupFunctions.push(stopAnimation);
    return () => {
      cleanupFunctions.forEach((cleanup2) => cleanup2());
      particles2.forEach((particle) => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      if (canvas?.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }

  // node_modules/@casoon/atlas-effects/dist/chunk-Z6DNVY5A.js
  function cursorFollow(target, options = {}) {
    const element = resolveElement(target);
    if (!element) {
      console.warn("[Atlas CursorFollow] Element not found:", target);
      return () => {
      };
    }
    if (shouldReduceMotion()) {
      console.info("[Atlas CursorFollow] Effect disabled due to prefers-reduced-motion");
      return () => {
      };
    }
    const {
      speed = 0.1,
      offset = { x: 0, y: 0 },
      magnetic: magnetic2 = false,
      magneticThreshold = 100
    } = options;
    const styleManager = createStyleManager();
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const lerp = (start2, end, factor) => start2 + (end - start2) * factor;
    const handleMouseMove = rafThrottle((e) => {
      if (magnetic2) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < magneticThreshold) {
          targetX = e.clientX + offset.x;
          targetY = e.clientY + offset.y;
        }
      } else {
        targetX = e.clientX + offset.x;
        targetY = e.clientY + offset.y;
      }
    });
    const stopAnimation = createSimpleAnimationLoop(() => {
      currentX = lerp(currentX, targetX, speed);
      currentY = lerp(currentY, targetY, speed);
      const transformValue = `translate(${currentX}px, ${currentY}px)`;
      styleManager.setStyle(element, "transform", transformValue);
    });
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      handleMouseMove.cancel();
      document.removeEventListener("mousemove", handleMouseMove);
      stopAnimation();
      styleManager.restore(element);
    };
  }

  // node_modules/@casoon/atlas-effects/dist/index.js
  var presets = /* @__PURE__ */ new Map();
  var trackedEffects = /* @__PURE__ */ new WeakMap();
  var effectCount = 0;
  function resolveElement2(target) {
    if (typeof target === "string") {
      return document.querySelector(target);
    }
    return target;
  }
  function createBuilder(element) {
    const effects2 = [];
    const builder = {
      add(effect3) {
        effects2.push({ effect: effect3, name: effect3.name || "anonymous" });
        return builder;
      },
      addWith(factory, options) {
        const effect3 = factory(options);
        effects2.push({ effect: effect3, name: factory.name || "anonymous" });
        return builder;
      },
      when(condition, effect3) {
        const shouldApply = typeof condition === "function" ? condition() : condition;
        if (shouldApply) {
          effects2.push({ effect: effect3, name: effect3.name || "conditional" });
        }
        return builder;
      },
      preset(name) {
        const preset = presets.get(name);
        if (!preset) {
          console.warn(`[Atlas fx] Preset "${name}" not found`);
          return builder;
        }
        for (const def of preset.effects) {
          const effect3 = typeof def === "function" ? def : def.effect;
          effects2.push({ effect: effect3, name: `${name}:${effect3.name || "anonymous"}` });
        }
        return builder;
      },
      apply() {
        const cleanups = [];
        for (const { effect: effect3 } of effects2) {
          try {
            const cleanup2 = effect3(element);
            cleanups.push(cleanup2);
            effectCount++;
            if (!trackedEffects.has(element)) {
              trackedEffects.set(element, /* @__PURE__ */ new Set());
            }
            trackedEffects.get(element)?.add(cleanup2);
          } catch (error2) {
            console.error(`[Atlas fx] Error applying effect:`, error2);
          }
        }
        return () => {
          for (const cleanup2 of cleanups) {
            try {
              cleanup2();
              effectCount--;
              trackedEffects.get(element)?.delete(cleanup2);
            } catch (error2) {
              console.error(`[Atlas fx] Error during cleanup:`, error2);
            }
          }
        };
      },
      list() {
        return effects2.map(({ name }) => name);
      }
    };
    return builder;
  }
  var fx = Object.assign(
    (element) => {
      const el = resolveElement2(element);
      if (!el) {
        console.warn(`[Atlas fx] Element not found: ${element}`);
        return {
          add: () => fx(element),
          addWith: () => fx(element),
          when: () => fx(element),
          preset: () => fx(element),
          apply: () => () => {
          },
          list: () => []
        };
      }
      return createBuilder(el);
    },
    {
      preset(name, effects2, description) {
        presets.set(name, { name, effects: effects2, description });
      },
      presets() {
        return new Map(presets);
      },
      track(element, cleanup2) {
        if (!trackedEffects.has(element)) {
          trackedEffects.set(element, /* @__PURE__ */ new Set());
        }
        trackedEffects.get(element)?.add(cleanup2);
        effectCount++;
      },
      cleanup(element) {
        const cleanups = trackedEffects.get(element);
        if (cleanups) {
          for (const cleanup2 of cleanups) {
            try {
              cleanup2();
              effectCount--;
            } catch (error2) {
              console.error(`[Atlas fx] Error during cleanup:`, error2);
            }
          }
          trackedEffects.delete(element);
        }
      },
      cleanupAll() {
        effectCount = 0;
      },
      count() {
        return effectCount;
      },
      create(name, fn) {
        const factory = (options) => {
          const effect3 = (element) => fn(element, options);
          Object.defineProperty(effect3, "name", { value: name });
          return effect3;
        };
        Object.defineProperty(factory, "name", { value: name });
        return factory;
      }
    }
  );

  // node_modules/@casoon/atlas/dist/index.js
  var ui = {
    // Layout
    accordion: createAccordion,
    card: createCard,
    separator: createSeparator,
    resizable: createResizable,
    scrollArea: createScrollArea,
    sidebar: createSidebar,
    bentoGrid: createBentoGrid,
    // Navigation
    breadcrumb: createBreadcrumb,
    menu: createMenu,
    menubar: createMenubar,
    navigationMenu: createNavigationMenu,
    tabs: createTabs,
    pagination: createPagination,
    // Forms
    button: createButton,
    checkbox: createCheckbox,
    input: createInput,
    inputOtp: createInputOtp,
    label: createLabel,
    radioGroup: createRadioGroup,
    select: createSelect,
    combobox: createCombobox,
    slider: createSlider,
    switch: createSwitch,
    textarea: createTextarea,
    form: createForm,
    // Data Display
    avatar: createAvatar,
    avatarGroup: createAvatarGroup,
    badge: createBadge,
    calendar: createCalendar,
    carousel: createCarousel,
    progress: createProgress,
    skeleton: createSkeleton,
    table: createTable,
    marquee: createMarquee,
    // Overlays
    dialog: createDialog,
    drawer: createDrawer,
    dropdown: createDropdown,
    modal: createModal,
    popover: createPopover,
    sheet: createSheet,
    tooltip: createTooltip,
    // Utility
    command: createCommand,
    datePicker: createDatePicker,
    toast: createToastManager,
    toggle: createToggle,
    toggleGroup: createToggleGroup
  };
  var effects = {
    ripple,
    orbs,
    parallax,
    scrollReveal,
    glass: glassEffects,
    particles,
    cursorFollow,
    tilt,
    glow,
    morphing,
    wave,
    magnetic,
    typewriter
  };
  var utils = {
    // Component factory
    createComponentFactory,
    createEventEmitter,
    registerPlugin,
    getPlugins,
    wrapComponent,
    // State management
    createStore,
    derivedStore,
    combineStores,
    shallowEqual,
    loggerMiddleware,
    validatorMiddleware,
    // Animations
    animate,
    animateAsync,
    stagger,
    createSpring,
    animateSpring,
    createTransition,
    registerAnimation,
    getAnimation,
    getAnimations,
    // Constants
    EASING,
    DURATION,
    easingFn,
    // DOM
    isBrowser,
    createElement,
    addListener,
    getFocusableElements,
    // ARIA
    generateId,
    announce
  };
  var atlas = {
    init: atlasInit,
    destroy: atlasDestroy,
    ui,
    effects,
    utils
  };
  var src_default2 = atlas;

  // ns-hugo-imp:/Users/paulbrown/Library/Mobile Documents/com~apple~CloudDocs/1-Projects/0-websites/ascent/themes/embrace/assets/js/butterfy-system.js
  document.addEventListener("alpine:init", () => {
    Alpine.data("butterflySystem", () => ({
      mode: "wander",
      // States: wander -> seek -> landed
      landed: false,
      // Physics State
      x: -50,
      y: 100,
      angle: 45,
      zAngle: 0,
      // 3D tilt
      time: 0,
      init() {
        const prefersReducedMotion2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion2) {
          this.mode = "landed";
          this.landed = true;
          return;
        }
        setTimeout(() => {
          this.mode = "seek";
        }, 3e3);
        requestAnimationFrame(() => this.loop());
      },
      loop() {
        if (this.mode === "wander") {
          this.time += 0.05;
          this.x += Math.cos(this.time) * 3 + 2;
          this.y += Math.sin(this.time * 1.5) * 5;
          this.angle = Math.sin(this.time) * 30;
        } else if (this.mode === "seek") {
          this.time += 0.1;
          const rect = this.$refs.ctaTarget.getBoundingClientRect();
          const parentRect = this.$el.getBoundingClientRect();
          const targetX = rect.left - parentRect.left + 20;
          const targetY = rect.top - parentRect.top - 20;
          this.x += (targetX - this.x) * 0.04;
          this.y += (targetY - this.y) * 0.04;
          this.x += Math.cos(this.time) * 2;
          this.y += Math.sin(this.time) * 2;
          const dist = Math.hypot(targetX - this.x, targetY - this.y);
          if (dist < 5) {
            this.mode = "landed";
            this.landed = true;
            this.angle = -15;
            this.zAngle = 60;
          }
        }
        if (!this.landed) {
          requestAnimationFrame(() => this.loop());
        }
      }
    }));
  });

  // <stdin>
  window.Alpine = module_default;
  module_default.start();
  var atlas2 = src_default2;
  if (atlas2 && typeof atlas2.init === "function") {
    window.atlas = atlas2;
    atlas2.init();
  }
})();
