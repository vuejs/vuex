import { storeKey } from './injectKey'

export default function (app, store, injectKey) {
  app.provide(injectKey || storeKey, store)

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
