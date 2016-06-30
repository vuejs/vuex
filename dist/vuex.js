/*!
 * Vuex v0.8.2
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vuex = factory());
}(this, function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
   * Merge an array of objects into one.
   *
   * @param {Array<Object>} arr
   * @return {Object}
   */

  function mergeObjects(arr) {
    return arr.reduce(function (prev, obj) {
      Object.keys(obj).forEach(function (key) {
        var existing = prev[key];
        if (existing) {
          // allow multiple mutation objects to contain duplicate
          // handlers for the same mutation type
          if (Array.isArray(existing)) {
            existing.push(obj[key]);
          } else {
            prev[key] = [prev[key], obj[key]];
          }
        } else {
          prev[key] = obj[key];
        }
      });
      return prev;
    }, {});
  }

  /**
   * Deep clone an object. Faster than JSON.parse(JSON.stringify()).
   *
   * @param {*} obj
   * @return {*}
   */

  function deepClone(obj) {
    if (Array.isArray(obj)) {
      return obj.map(deepClone);
    } else if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      var cloned = {};
      var keys = Object.keys(obj);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        cloned[key] = deepClone(obj[key]);
      }
      return cloned;
    } else {
      return obj;
    }
  }

  /**
   * Hacks to get access to Vue internals.
   * Maybe we should expose these...
   */

  var Watcher = void 0;
  function getWatcher(vm) {
    if (!Watcher) {
      var noop = function noop() {};
      var unwatch = vm.$watch(noop, noop);
      Watcher = vm._watchers[0].constructor;
      unwatch();
    }
    return Watcher;
  }

  var Dep = void 0;
  function getDep(vm) {
    if (!Dep) {
      Dep = vm._data.__ob__.dep.constructor;
    }
    return Dep;
  }

  var hook = typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  var devtoolMiddleware = {
    onInit: function onInit(state, store) {
      if (!hook) return;
      hook.emit('vuex:init', store);
      hook.on('vuex:travel-to-state', function (targetState) {
        store._dispatching = true;
        store._vm.state = targetState;
        store._dispatching = false;
      });
    },
    onMutation: function onMutation(mutation, state) {
      if (!hook) return;
      hook.emit('vuex:mutation', mutation, state);
    }
  };

  function override (Vue) {
    var version = Number(Vue.version.split('.')[0]);

    if (version >= 2) {
      var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
      Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
    } else {
      (function () {
        // override init and inject vuex init procedure
        // for 1.x backwards compatibility.
        var _init = Vue.prototype._init;
        Vue.prototype._init = function () {
          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
          _init.call(this, options);
        };
      })();
    }

    /**
     * Vuex init hook, injected into each instances init hooks list.
     */

    function vuexInit() {
      var options = this.$options;
      var store = options.store;
      var vuex = options.vuex;
      // store injection

      if (store) {
        this.$store = store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
      // vuex option handling
      if (vuex) {
        if (!this.$store) {
          console.warn('[vuex] store not injected. make sure to ' + 'provide the store option in your root component.');
        }
        var state = vuex.state;
        var actions = vuex.actions;
        var getters = vuex.getters;
        // handle deprecated state option

        if (state && !getters) {
          console.warn('[vuex] vuex.state option will been deprecated in 1.0. ' + 'Use vuex.getters instead.');
          getters = state;
        }
        // getters
        if (getters) {
          options.computed = options.computed || {};
          for (var key in getters) {
            defineVuexGetter(this, key, getters[key]);
          }
        }
        // actions
        if (actions) {
          options.methods = options.methods || {};
          for (var _key in actions) {
            options.methods[_key] = makeBoundAction(this.$store, actions[_key], _key);
          }
        }
      }
    }

    /**
     * Setter for all getter properties.
     */

    function setter() {
      throw new Error('vuex getter properties are read-only.');
    }

    /**
     * Define a Vuex getter on an instance.
     *
     * @param {Vue} vm
     * @param {String} key
     * @param {Function} getter
     */

    function defineVuexGetter(vm, key, getter) {
      if (typeof getter !== 'function') {
        console.warn('[vuex] Getter bound to key \'vuex.getters.' + key + '\' is not a function.');
      } else {
        Object.defineProperty(vm, key, {
          enumerable: true,
          configurable: true,
          get: makeComputedGetter(vm.$store, getter),
          set: setter
        });
      }
    }

    /**
     * Make a computed getter, using the same caching mechanism of computed
     * properties. In addition, it is cached on the raw getter function using
     * the store's unique cache id. This makes the same getter shared
     * across all components use the same underlying watcher, and makes
     * the getter evaluated only once during every flush.
     *
     * @param {Store} store
     * @param {Function} getter
     */

    function makeComputedGetter(store, getter) {
      var id = store._getterCacheId;

      // cached
      if (getter[id]) {
        return getter[id];
      }
      var vm = store._vm;
      var Watcher = getWatcher(vm);
      var Dep = getDep(vm);
      var watcher = new Watcher(vm, function (vm) {
        return getter(vm.state);
      }, null, { lazy: true });
      var computedGetter = function computedGetter() {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value;
      };
      getter[id] = computedGetter;
      return computedGetter;
    }

    /**
     * Make a bound-to-store version of a raw action function.
     *
     * @param {Store} store
     * @param {Function} action
     * @param {String} key
     */

    function makeBoundAction(store, action, key) {
      if (typeof action !== 'function') {
        console.warn('[vuex] Action bound to key \'vuex.actions.' + key + '\' is not a function.');
      }
      return function vuexBoundAction() {
        for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return action.call.apply(action, [this, store].concat(args));
      };
    }

    // option merging
    var merge = Vue.config.optionMergeStrategies.computed;
    Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
      if (!toVal) return fromVal;
      if (!fromVal) return toVal;
      return {
        getters: merge(toVal.getters, fromVal.getters),
        state: merge(toVal.state, fromVal.state),
        actions: merge(toVal.actions, fromVal.actions)
      };
    };
  }

  var Vue = void 0;
  var uid = 0;

  var Store = function () {

    /**
     * @param {Object} options
     *        - {Object} state
     *        - {Object} actions
     *        - {Object} mutations
     *        - {Array} middlewares
     *        - {Boolean} strict
     */

    function Store() {
      var _this = this;

      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$state = _ref.state;
      var state = _ref$state === undefined ? {} : _ref$state;
      var _ref$mutations = _ref.mutations;
      var mutations = _ref$mutations === undefined ? {} : _ref$mutations;
      var _ref$modules = _ref.modules;
      var modules = _ref$modules === undefined ? {} : _ref$modules;
      var _ref$middlewares = _ref.middlewares;
      var middlewares = _ref$middlewares === undefined ? [] : _ref$middlewares;
      var _ref$strict = _ref.strict;
      var strict = _ref$strict === undefined ? false : _ref$strict;
      classCallCheck(this, Store);

      this._getterCacheId = 'vuex_store_' + uid++;
      this._dispatching = false;
      this._rootMutations = this._mutations = mutations;
      this._modules = modules;
      // bind dispatch to self
      var dispatch = this.dispatch;
      this.dispatch = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        dispatch.apply(_this, args);
      };
      // use a Vue instance to store the state tree
      // suppress warnings just in case the user has added
      // some funky global mixins
      if (!Vue) {
        throw new Error('[vuex] must call Vue.use(Vuex) before creating a store instance.');
      }
      var silent = Vue.config.silent;
      Vue.config.silent = true;
      this._vm = new Vue({
        data: {
          state: state
        }
      });
      Vue.config.silent = silent;
      this._setupModuleState(state, modules);
      this._setupModuleMutations(modules);
      this._setupMiddlewares(middlewares, state);
      // add extra warnings in strict mode
      if (strict) {
        this._setupMutationCheck();
      }
    }

    /**
     * Getter for the entire state tree.
     * Read only.
     *
     * @return {Object}
     */

    createClass(Store, [{
      key: 'dispatch',


      /**
       * Dispatch an action.
       *
       * @param {String} type
       */

      value: function dispatch(type) {
        for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          payload[_key2 - 1] = arguments[_key2];
        }

        var silent = false;
        // compatibility for object actions, e.g. FSA
        if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type.type && arguments.length === 1) {
          payload = [type.payload];
          if (type.silent) silent = true;
          type = type.type;
        }
        var mutation = this._mutations[type];
        var state = this.state;
        if (mutation) {
          this._dispatching = true;
          // apply the mutation
          if (Array.isArray(mutation)) {
            mutation.forEach(function (m) {
              return m.apply(undefined, [state].concat(toConsumableArray(payload)));
            });
          } else {
            mutation.apply(undefined, [state].concat(toConsumableArray(payload)));
          }
          this._dispatching = false;
          if (!silent) this._applyMiddlewares(type, payload);
        } else {
          console.warn('[vuex] Unknown mutation: ' + type);
        }
      }

      /**
       * Watch state changes on the store.
       * Same API as Vue's $watch, except when watching a function,
       * the function gets the state as the first argument.
       *
       * @param {Function} fn
       * @param {Function} cb
       * @param {Object} [options]
       */

    }, {
      key: 'watch',
      value: function watch(fn, cb, options) {
        var _this2 = this;

        if (typeof fn !== 'function') {
          console.error('Vuex store.watch only accepts function.');
          return;
        }
        return this._vm.$watch(function () {
          return fn(_this2.state);
        }, cb, options);
      }

      /**
       * Hot update mutations & modules.
       *
       * @param {Object} options
       *        - {Object} [mutations]
       *        - {Object} [modules]
       */

    }, {
      key: 'hotUpdate',
      value: function hotUpdate() {
        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var mutations = _ref2.mutations;
        var modules = _ref2.modules;

        this._rootMutations = this._mutations = mutations || this._rootMutations;
        this._setupModuleMutations(modules || this._modules);
      }

      /**
       * Attach sub state tree of each module to the root tree.
       *
       * @param {Object} state
       * @param {Object} modules
       */

    }, {
      key: '_setupModuleState',
      value: function _setupModuleState(state, modules) {
        Object.keys(modules).forEach(function (key) {
          Vue.set(state, key, modules[key].state || {});
        });
      }

      /**
       * Bind mutations for each module to its sub tree and
       * merge them all into one final mutations map.
       *
       * @param {Object} updatedModules
       */

    }, {
      key: '_setupModuleMutations',
      value: function _setupModuleMutations(updatedModules) {
        var modules = this._modules;
        var allMutations = [this._rootMutations];
        Object.keys(updatedModules).forEach(function (key) {
          modules[key] = updatedModules[key];
        });
        Object.keys(modules).forEach(function (key) {
          var module = modules[key];
          if (!module || !module.mutations) return;
          // bind mutations to sub state tree
          var mutations = {};
          Object.keys(module.mutations).forEach(function (name) {
            var original = module.mutations[name];
            mutations[name] = function (state) {
              for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
              }

              original.apply(undefined, [state[key]].concat(args));
            };
          });
          allMutations.push(mutations);
        });
        this._mutations = mergeObjects(allMutations);
      }

      /**
       * Setup mutation check: if the vuex instance's state is mutated
       * outside of a mutation handler, we throw en error. This effectively
       * enforces all mutations to the state to be trackable and hot-reloadble.
       * However, this comes at a run time cost since we are doing a deep
       * watch on the entire state tree, so it is only enalbed with the
       * strict option is set to true.
       */

    }, {
      key: '_setupMutationCheck',
      value: function _setupMutationCheck() {
        var _this3 = this;

        var Watcher = getWatcher(this._vm);
        /* eslint-disable no-new */
        new Watcher(this._vm, 'state', function () {
          if (!_this3._dispatching) {
            throw new Error('[vuex] Do not mutate vuex store state outside mutation handlers.');
          }
        }, { deep: true, sync: true });
        /* eslint-enable no-new */
      }

      /**
       * Setup the middlewares. The devtools middleware is always
       * included, since it does nothing if no devtool is detected.
       *
       * A middleware can demand the state it receives to be
       * "snapshots", i.e. deep clones of the actual state tree.
       *
       * @param {Array} middlewares
       * @param {Object} state
       */

    }, {
      key: '_setupMiddlewares',
      value: function _setupMiddlewares(middlewares, state) {
        var _this4 = this;

        this._middlewares = [devtoolMiddleware].concat(middlewares);
        this._needSnapshots = middlewares.some(function (m) {
          return m.snapshot;
        });
        if (this._needSnapshots) {
          console.log('[vuex] One or more of your middlewares are taking state snapshots ' + 'for each mutation. Make sure to use them only during development.');
        }
        var initialSnapshot = this._prevSnapshot = this._needSnapshots ? deepClone(state) : null;
        // call init hooks
        this._middlewares.forEach(function (m) {
          if (m.onInit) {
            m.onInit(m.snapshot ? initialSnapshot : state, _this4);
          }
        });
      }

      /**
       * Apply the middlewares on a given mutation.
       *
       * @param {String} type
       * @param {Array} payload
       */

    }, {
      key: '_applyMiddlewares',
      value: function _applyMiddlewares(type, payload) {
        var _this5 = this;

        var state = this.state;
        var prevSnapshot = this._prevSnapshot;
        var snapshot = void 0,
            clonedPayload = void 0;
        if (this._needSnapshots) {
          snapshot = this._prevSnapshot = deepClone(state);
          clonedPayload = deepClone(payload);
        }
        this._middlewares.forEach(function (m) {
          if (m.onMutation) {
            if (m.snapshot) {
              m.onMutation({ type: type, payload: clonedPayload }, snapshot, prevSnapshot, _this5);
            } else {
              m.onMutation({ type: type, payload: payload }, state, _this5);
            }
          }
        });
      }
    }, {
      key: 'state',
      get: function get() {
        return this._vm.state;
      },
      set: function set(v) {
        throw new Error('[vuex] Vuex root state is read only.');
      }
    }]);
    return Store;
  }();

  function install(_Vue) {
    if (Vue) {
      console.warn('[vuex] already installed. Vue.use(Vuex) should be called only once.');
      return;
    }
    Vue = _Vue;
    override(Vue);
  }

  // auto install in dist mode
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  var index = {
    Store: Store,
    install: install
  };

  return index;

}));