import Vue from "vue";
import * as Vuex from "../index";
import createLogger from "../../dist/logger";

Vue.use(Vuex);

namespace StoreInstance {
  const store = new Vuex.Store({
    state: {
      value: 0
    }
  });

  store.state.value;
  store.getters.foo;

  store.dispatch("foo", { amount: 1 }).then(() => {});
  store.dispatch({
    type: "foo",
    amount: 1
  }).then(() => {});

  store.commit("foo", { amount: 1 });
  store.commit({
    type: "foo",
    amount: 1
  });

  store.watch(state => state.value, value => {
    value = value + 1;
  }, {
    immediate: true,
    deep: true
  });

  store.subscribe((mutation, state) => {
    mutation.type;
    mutation.payload;
    state.value;
  });

  store.subscribeAction((mutation, state) => {
    mutation.type;
    mutation.payload;
    state.value;
  });

  store.replaceState({ value: 10 });
}

namespace RootModule {
  const store = new Vuex.Store({
    state: {
      value: 0
    },
    getters: {
      count: state => state.value,
      plus10: (_, { count }) => count + 10
    },
    actions: {
      foo ({ state, getters, dispatch, commit }, payload) {
        this.state.value;
        state.value;
        getters.count;
        dispatch("bar", {});
        commit("bar", {});
      }
    },
    mutations: {
      bar (state, payload) {
        this.state.value;
      }
    },
    strict: true
  });
}

namespace RootDefaultModule {
  const store = new Vuex.default.Store({
    state: {
      value: 0
    },
    getters: {
      count: state => state.value,
      plus10: (_, { count }) => count + 10
    },
    actions: {
      foo ({ state, getters, dispatch, commit }, payload) {
        this.state.value;
        state.value;
        getters.count;
        dispatch("bar", {});
        commit("bar", {});
      }
    },
    mutations: {
      bar (state, payload) {
        this.state.value;
      }
    },
    strict: true
  });
}

namespace NestedModules {
  interface RootState {
    a: {
      value: number;
    };
    b: {
      c: {
        value: number;
      };
      d: {
        value: number;
      },
      e: {
        value: number;
      }
    };
  }

  type ActionStore = Vuex.ActionContext<{ value: number }, RootState>

  const module = {
    state: {
      value: 0
    },
    actions: {
      foo (
        { state, getters, dispatch, commit, rootState }: ActionStore,
        payload: { amount: number }
      ) {
        state.value;
        getters.root;
        rootState.b.c.value;
        dispatch("bar", {});
        commit("bar", payload);
      }
    },
    mutations: {
      bar (state: { value: number }, payload: { amount: number }) {
        state.value += payload.amount;
      }
    }
  };

  const store = new Vuex.Store<RootState>({
    getters: {
      root: state => state
    },
    modules: {
      a: module,
      b: {
        modules: {
          c: module,
          d: module,
          e: {
            state: {
              value: 0
            },
            actions: {
              foo(context: ActionStore, payload) {
                this.state.a;
              }
            },
            mutations: {
              bar(state, payload) {
                this.state.b.e;
              }
            }
          }
        }
      }
    }
  });
}

namespace NamespacedModule {
  const store = new Vuex.Store({
    state: { value: 0 },
    getters: {
      rootValue: state => state.value
    },
    actions: {
      foo () {}
    },
    mutations: {
      foo () {}
    },
    modules: {
      a: {
        namespaced: true,
        state: { value: 1 },
        actions: {
          test: {
            root: true,
            handler ({ dispatch }) {
              dispatch('foo')
            }
          },
          test2: {
            handler ({ dispatch }) {
              dispatch('foo')
            }
          }
        },
        modules: {
          b: {
            state: { value: 2 }
          },
          c: {
            namespaced: true,
            state: { value: 3 },
            getters: {
              constant: () => 10,
              count (state, getters, rootState, rootGetters) {
                getters.constant;
                rootGetters.rootValue;
              }
            },
            actions: {
              test ({ dispatch, commit, getters, rootGetters }) {
                getters.constant;
                rootGetters.rootValue;

                dispatch("foo");
                dispatch("foo", null, { root: true });

                commit("foo");
                commit("foo", null, { root: true });
              },
              foo () {}
            },
            mutations: {
              foo () {}
            }
          }
        }
      }
    }
  });
}

namespace RegisterModule {
  interface RootState {
    value: number;
    a?: {
      value: number;
      b?: {
        value: number;
      }
    };
  }

  const store = new Vuex.Store<RootState>({
    state: {
      value: 0
    }
  });

  store.registerModule("a", {
    state: { value: 1 }
  });

  store.registerModule(["a", "b"], {
    state: { value: 2 }
  });

  store.registerModule(["a", "b"], {
    state: { value: 2 }
  }, { preserveState: true });

  store.unregisterModule(["a", "b"]);
  store.unregisterModule("a");
}

namespace HotUpdate {
  interface RootState {
    value: number;
    a: {
      b: {
        value: number;
      };
    };
  };

  type ActionStore = Vuex.ActionContext<{ value: number }, RootState>

  const getters = {
    rootValue: (state: RootState) => state.value
  };

  const actions = {
    foo (store: ActionStore, payload: number) {}
  };

  const mutations = {
    bar (state: { value: number }, payload: number) {}
  };

  const module = {
    state: {
      value: 0
    },
    getters: {
      count: (state: { value: number }) => state.value
    },
    actions,
    mutations
  };

  const modules = {
    a: {
      modules: {
        b: module
      }
    }
  };

  const store = new Vuex.Store<RootState>({
    state: {
      value: 0
    } as any,
    getters,
    actions,
    mutations,
    modules
  });

  store.hotUpdate({
    getters,
    actions,
    mutations,
    modules
  });
}

namespace Plugins {
  function plugin (store: Vuex.Store<{ value: number }>) {
    store.subscribe((mutation, state) => {
      mutation.type;
      state.value;
    });
  }

  const logger = createLogger<{ value: number }>({
    collapsed: true,
    transformer: state => state.value,
    mutationTransformer: (mutation: { type: string }) => mutation.type
  });

  const store = new Vuex.Store<{ value: number }>({
    state: {
      value: 0
    },
    plugins: [plugin, logger]
  });
}
