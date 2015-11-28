import Cursor from './cursor'

export default {

  /**
   * Patch the instance's data function so that we can
   * directly bind to cursors in the `data` option.
   */

  init () {
    const dataFn = this.$options.data
    if (dataFn) {
      this.$options.data = () => {
        const raw = dataFn()
        Object.keys(raw).forEach(key => {
          const val = raw[key]
          if (val instanceof Cursor) {
            raw[key] = val.get()
            if (val.cb) {
              throw new Error(
                '[vue-store] A vue-store can only be subscribed to once.'
              )
            }
            val.subscribe(value => {
              this[key] = value
            })
            if (!this._vue_store_cursors) {
              this._vue_store_cursors = []
            }
            this._vue_store_cursors.push(val)
          }
        })
        return raw
      }
    }
  },

  /**
   * Dispose cursors owned by this instance.
   */

  beforeDestroy () {
    if (this._vue_store_cursors) {
      this._vue_store_cursors.forEach(c => c.dispose())
    }
  }
}
