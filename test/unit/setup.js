import 'babel-polyfill'
import Vue from 'vue/dist/vue.common.js'
import Vuex from '../../dist/vuex.js'
import { Observable } from 'rxjs/Observable'

Vue.use(Vuex, Observable)
