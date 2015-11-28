export default class Cursor {

  /**
   * @param {Vue} vm
   * @param {String} path
   */

  constructor (vm, path) {
    this.cb = null
    this.vm = vm
    this.path = path
    this.dispose = vm.$watch(path, value => {
      if (this.cb) {
        this.cb.call(null, value)
      }
    })
  }

  /**
   * Get the latest value.
   *
   * @return {*}
   */

  get () {
    return this.vm.$get(this.path)
  }

  /**
   * Set the subscribe callback.
   *
   * @param {Function} cb
   */

  subscribe (cb) {
    this.cb = cb
  }
}
