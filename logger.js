'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/**
 * Merge an array of objects into one.
 *
 * @param {Array<Object>} arr
 * @return {Object}
 */



/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find(list, f) {
  return list.filter(f)[0];
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
function deepCopy(obj) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // just return if obj is immutable value
  if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  var hit = find(cache, function (c) {
    return c.original === obj;
  });
  if (hit) {
    return hit.copy;
  }

  var copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy: copy
  });

  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

/**
 * Check whether the given value is Object or not
 *
 * @param {*} obj
 * @return {Boolean}
 */



/**
 * Get state sub tree by given keys.
 *
 * @param {Object} state
 * @param {Array<String>} nestedKeys
 * @return {Object}
 */

// Credits: borrowed code from fcomb/redux-logger

function createLogger() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$collapsed = _ref.collapsed,
      collapsed = _ref$collapsed === undefined ? true : _ref$collapsed,
      _ref$transformer = _ref.transformer,
      transformer = _ref$transformer === undefined ? function (state) {
    return state;
  } : _ref$transformer,
      _ref$mutationTransfor = _ref.mutationTransformer,
      mutationTransformer = _ref$mutationTransfor === undefined ? function (mut) {
    return mut;
  } : _ref$mutationTransfor;

  return function (store) {
    var prevState = deepCopy(store.state);

    store.subscribe(function (mutation, state) {
      if (typeof console === 'undefined') {
        return;
      }
      var nextState = deepCopy(state);
      var time = new Date();
      var formattedTime = ' @ ' + pad(time.getHours(), 2) + ':' + pad(time.getMinutes(), 2) + ':' + pad(time.getSeconds(), 2) + '.' + pad(time.getMilliseconds(), 3);
      var formattedMutation = mutationTransformer(mutation);
      var message = 'mutation ' + mutation.type + formattedTime;
      var startMessage = collapsed ? console.groupCollapsed : console.group;

      // render
      try {
        startMessage.call(console, message);
      } catch (e) {
        console.log(message);
      }

      console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState));
      console.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation);
      console.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState));

      try {
        console.groupEnd();
      } catch (e) {
        console.log('—— log end ——');
      }

      prevState = nextState;
    });
  };
}

function repeat(str, times) {
  return new Array(times + 1).join(str);
}

function pad(num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num;
}

module.exports = createLogger;
