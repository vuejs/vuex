import { createStore } from "..";

const store = createStore({
  state: { value: 0 },
  actions: {
    refresh(context) {
      context.state;
      
      // non-type-safe commit
      context.commit("add", "test")
      context.commit("add")
      context.commit({ type: "add", payload: "test" })
      context.commit({ type: "add" })

      // non-type-safe dispatch
      context.dispatch("test", "test")
      context.dispatch("test")
      context.dispatch({ type: "add", payload: "test" })
      context.dispatch({ type: "add" })

      // non-type-safe getters
      context.getters["test"]

      context.rootGetters["test"]
      context.rootState.whatever;
    },
    load(context, strings: string[]) {}
  }
})

// actually type-safe
store.dispatch("load", ["test"]);