import { createApp } from "vue";
import * as Vuex from "../index";

const store = new Vuex.Store({
  state: {
    value: 1
  }
});

const app = createApp({
  store
});

const vm = app.mount('#el')

vm.$store.state.value;
