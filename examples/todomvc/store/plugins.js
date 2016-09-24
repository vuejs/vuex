import { STORAGE_KEY } from './index'
import createLogger from '../../../src/plugins/logger'

const localStoragePlugin = store => {
  store.subscribe((mutation, { todos }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  })
}

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin]
