import * as Vue from 'vue';
import * as Vuex from 'vuex';
import createLogger from 'vuex/logger';

Vue.use(Vuex);

interface ISimpleState {
  count: number;
}

const INCREMENT = 'INCREMENT';
const INCREMENT_OBJECT = 'INCREMENT_OBJECT';

function createStore(): Vuex.Store<ISimpleState> {
  const state: ISimpleState = {
    count: 0
  };

  const mutations: Vuex.MutationTree<ISimpleState> = {
    [INCREMENT] (state: ISimpleState, amount: number) {
      state.count = state.count + amount;
    },
    [INCREMENT_OBJECT] (state: ISimpleState, payload: number) {
      state.count = state.count + payload;
    }
  };

  return new Vuex.Store({
    state,
    mutations,
    strict: true
  });
}

namespace TestDispatch {
  const store = createStore();

  store.dispatch(INCREMENT, 1);
  store.dispatch({
    type: INCREMENT_OBJECT,
    silent: true,
    payload: 10
  });
}

namespace TestWithComponent {
  const store = createStore();

  const a: vuejs.ComponentOption = {
    vuex: {
      getters: {
        count: (state: ISimpleState) => state.count
      },
      actions: {
        incrementCounter({ dispatch, state }: Vuex.Store<ISimpleState>) {
          dispatch(INCREMENT, 1);
        }
      }
    }
  };

  const app = new Vue({
    el: '#app',
    components: { a },
    store
  });

  const b: number = app.$store.state.count;
}

namespace TestModules {

  interface INumberState {
    value: number;
  }

  interface INestedModuleState extends INumberState {
    a: INumberState;
    b: INumberState;
  }

  interface IModuleState {
    nested: INestedModuleState;
    c: INumberState;
  }

  const aState = { value: 1 };
  const bState = { value: 2 };
  const cState = { value: 3 };
  const nestedState = { value: 4 };

  const mutations: Vuex.MutationTree<INumberState> = {
    INCREMENT (state: INumberState) {
      state.value = state.value + 1;
    }
  };

  const a = {
    state: aState,
    mutations
  };

  const b = {
    state: bState,
    mutations
  };

  const nested = {
    state: nestedState,
    mutations,
    modules: { a, b }
  };

  const c = {
    state: cState,
    mutations
  };

  const store = new Vuex.Store<IModuleState>({
    modules: { nested, c }
  });

  const valA = store.state.nested.a.value;
  const valB = store.state.nested.b.value;
  const valC = store.state.c.value;
  const valNested = store.state.nested.value;
}

namespace TestPlugin {
  const a = (store: Vuex.Store<any>) => {};

  const b = (store: Vuex.Store<ISimpleState>) => {};

  new Vuex.Store<ISimpleState>({
    state: { count: 1 },
    plugins: [a, b]
  });
}

namespace TestReplaceState {
  const store = createStore();

  store.replaceState({ count: 10 });
}

namespace TestWatch {
  const store = createStore();

  store.watch(state => state.count, value => {
    const a: number = value;
  }, {
    deep: true,
    immidiate: true
  });
}

namespace TestHotUpdate {
  const store = createStore();

  const mutations: Vuex.MutationTree<ISimpleState> = {
    INCREMENT (state: ISimpleState) {
      state.count++;
    }
  };

  store.hotUpdate({
    mutations
  });

  store.hotUpdate({
    modules: {
      nested: {
        state: { count: 0 },
        mutations,
        modules: {
          a: {
            state: { count: 1 },
            mutations
          },
          b: {
            state: { count: 2 },
            mutations
          }
        }
      },
      c: {
        state: { count: 4 },
        mutations
      }
    }
  });
}

namespace TestEvents {
  const store = createStore();

  const handler = (mutation: Vuex.MutationObject<any>, state: ISimpleState) => {
    state.count += 1;
  };

  store.on('mutation', handler);
  store.once('mutation', handler);

  store.off();
  store.off('mutation');
  store.off('mutation', handler);

  store.emit('some-event', 1, 'a', []);
}

namespace TestLogger {
  const logger = createLogger<ISimpleState>({
    collapsed: false,
    transformer: state => state.count,
    mutationTransformer: m => m
  });

  new Vuex.Store<ISimpleState>({
    state: { count: 1 },
    plugins: [logger]
  });
}
