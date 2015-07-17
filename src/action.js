var Vue = require('vue')
var _ = Vue.util
var actionRE = /^([\w_$]+)(\(.*\))?$/
var action = _.extend({}, Vue.directive('on'))

action.bind = function () {
  var exp = this.expression
  var actionMatch = exp.match(actionRE)
  if (actionMatch) {
    var actionName = actionMatch[1]
    var action = this.vm.$actions[actionName]
    if (action) {
      this._watcherExp = this.expression = '$actions.' + exp
    } else {
      process.env.NODE_ENV !== 'production' && _.warn(
        'Unknown action: ' + actionName
      )
    }
  } else {
    process.env.NODE_ENV !== 'production' && _.warn(
      'Invalid v-action expression: ' + exp
    )
  }
}

module.exports = action
