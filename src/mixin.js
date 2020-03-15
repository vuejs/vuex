import { storeKey } from './injectKey'

export default function (app, store, injectKey) {
  app.provide(injectKey || storeKey, store)

  // TODO: Refactor this to use `provide/inject`. It's currently
  // not possible because Vue 3 doesn't work with `$` prefixed
  // `provide/inject` at the moment.
  app.mixin({
    beforeCreate () {
      if (!this.parent) {
        this.$store = typeof store === 'function' ? store() : store
      } else {
        this.$store = this.parent.$options.$store
      }
    }
  })
}
