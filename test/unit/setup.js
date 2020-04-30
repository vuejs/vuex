import 'babel-polyfill'
import Vue from 'vue'
import Vuex from '../../src/index'

Vue.use(Vuex)

global.__DEV__ = true
