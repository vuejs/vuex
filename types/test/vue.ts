import Vue from "vue";
import * as Vuex from "../index";

const store = new Vuex.Store({
  state: {
    value: 1
  }
});

const vm = new Vue({
  store
});

vm.$store.state.value;
