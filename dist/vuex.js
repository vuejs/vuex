/*!
 * Vuex v0.5.0
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vuex = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
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

  babelHelpers;

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
    } else if (obj && (typeof obj === 'undefined' ? 'undefined' : babelHelpers.typeof(obj)) === 'object') {
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

  var hook = typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  var devtoolMiddleware = {
    onInit: function onInit(state, store) {
      if (!hook) return;
      hook.emit('vuex:init', store);
      hook.on('vuex:travel-to-state', function (targetState) {
        var currentState = store._vm._data;
        Object.keys(targetState).forEach(function (key) {
          currentState[key] = targetState[key];
        });
      });
    },
    onMutation: function onMutation(mutation, state) {
      if (!hook) return;
      hook.emit('vuex:mutation', mutation, state);
    }
  };

  // export install function
  function override (Vue) {
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      var _this = this;

      options = options || {};
      var componentOptions = this.constructor.options;
      // store injection
      var store = options.store || componentOptions.store;
      if (store) {
        this.$store = store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
      // vuex option handling
      var vuex = options.vuex || componentOptions.vuex;
      if (vuex) {
        (function () {
          if (!_this.$store) {
            console.warn('[vuex] store not injected. make sure to ' + 'provide the store option in your root component.');
          }
          var state = vuex.state;
          var actions = vuex.actions;
          // state

          if (state) {
            options.computed = options.computed || {};
            Object.keys(state).forEach(function (key) {
              options.computed[key] = function vuexBoundGetter() {
                return state[key].call(this, this.$store.state);
              };
            });
          }
          // actions
          if (actions) {
            options.methods = options.methods || {};
            Object.keys(actions).forEach(function (key) {
              options.methods[key] = function vuexBoundAction() {
                var _actions$key;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                return (_actions$key = actions[key]).call.apply(_actions$key, [this, this.$store].concat(args));
              };
            });
          }
        })();
      }
      _init.call(this, options);
    };
  }

  var Vue = undefined;

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
      babelHelpers.classCallCheck(this, Store);

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
      var silent = Vue.config.silent;
      Vue.config.silent = true;
      this._vm = new Vue({
        data: state
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

    babelHelpers.createClass(Store, [{
      key: 'dispatch',


      /**
       * Dispatch an action.
       *
       * @param {String} type
       */

      value: function dispatch(type) {
        var _this2 = this;

        for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          payload[_key2 - 1] = arguments[_key2];
        }

        var mutation = this._mutations[type];
        var prevSnapshot = this._prevSnapshot;
        var state = this.state;
        var snapshot = undefined,
            clonedPayload = undefined;
        if (mutation) {
          this._dispatching = true;
          // apply the mutation
          if (Array.isArray(mutation)) {
            mutation.forEach(function (m) {
              return m.apply(undefined, [state].concat(payload));
            });
          } else {
            mutation.apply(undefined, [state].concat(payload));
          }
          this._dispatching = false;
          // invoke middlewares
          if (this._needSnapshots) {
            snapshot = this._prevSnapshot = deepClone(state);
            clonedPayload = deepClone(payload);
          }
          this._middlewares.forEach(function (m) {
            if (m.onMutation) {
              if (m.snapshot) {
                m.onMutation({ type: type, payload: clonedPayload }, snapshot, prevSnapshot, _this2);
              } else {
                m.onMutation({ type: type, payload: payload }, state, _this2);
              }
            }
          });
        } else {
          console.warn('[vuex] Unknown mutation: ' + type);
        }
      }

      /**
       * Watch state changes on the store.
       * Same API as Vue's $watch, except when watching a function,
       * the function gets the state as the first argument.
       *
       * @param {String|Function} expOrFn
       * @param {Function} cb
       * @param {Object} [options]
       */

    }, {
      key: 'watch',
      value: function watch(expOrFn, cb, options) {
        var _this3 = this;

        return this._vm.$watch(function () {
          return typeof expOrFn === 'function' ? expOrFn(_this3.state) : _this3._vm.$get(expOrFn);
        }, cb, options);
      }

      /**
       * Hot update actions and mutations.
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
        var setPath = Vue.parsers.path.setPath;

        Object.keys(modules).forEach(function (key) {
          setPath(state, key, modules[key].state || {});
        });
      }

      /**
       * Bind mutations for each module to its sub tree and
       * merge them all into one final mutations map.
       *
       * @param {Object} modules
       */

    }, {
      key: '_setupModuleMutations',
      value: function _setupModuleMutations(modules) {
        this._modules = modules;
        var getPath = Vue.parsers.path.getPath;

        var allMutations = [this._rootMutations];
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

              original.apply(undefined, [getPath(state, key)].concat(args));
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
        var _this4 = this;

        // a hack to get the watcher constructor from older versions of Vue
        // mainly because the public $watch method does not allow sync
        // watchers.
        var unwatch = this._vm.$watch('__vuex__', function (a) {
          return a;
        });
        var Watcher = this._vm._watchers[0].constructor;
        unwatch();
        /* eslint-disable no-new */
        new Watcher(this._vm, '$data', function () {
          if (!_this4._dispatching) {
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
        var _this5 = this;

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
            m.onInit(m.snapshot ? initialSnapshot : state, _this5);
          }
        });
      }
    }, {
      key: 'state',
      get: function get() {
        return this._vm._data;
      },
      set: function set(v) {
        throw new Error('[vuex] Vuex root state is read only.');
      }
    }]);
    return Store;
  }();

  function install(_Vue) {
    Vue = _Vue;
    override(Vue);
  }

  var index = {
    Store: Store,
    install: install
  };

  return index;

}));