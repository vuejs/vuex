import 'babel-polyfill'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<html><body></body></html>')

global.document = dom.window.document
global.window = dom.window
global.navigator = dom.window.navigator
