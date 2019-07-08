import { STORAGE_KEY } from './mutations'
import createLogger from '../../../src/plugins/logger'
import { isProdEnv } from '../../../src/util'

const localStoragePlugin = store => {
  store.subscribe((mutation, { todos }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  })
}

export default !isProdEnv()
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin]
