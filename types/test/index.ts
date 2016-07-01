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
  interface IModuleAState {
    value: number;
  }

  interface IModuleBState {
    value: string;
  }

  interface IModuleState {
    a: IModuleAState;
    b: IModuleBState;
  }

  const aState: IModuleAState = { value: 1 };
  const bState: IModuleBState = { value: 'test' };

  const aMutations: Vuex.MutationTree<IModuleAState> = {
    INCREMENT (state: IModuleAState) {
      state.value = state.value + 1;
    }
  };

  const bMutations: Vuex.MutationTree<IModuleBState> = {
    APPEND (state: IModuleBState, value: string) {
      state.value = state.value + value;
    }
  };

  const a = { state: aState, mutations: aMutations };
  const b = { state: bState, mutations: bMutations };

  const store = new Vuex.Store<IModuleState>({
    modules: { a, b }
  });

  const valA: number = store.state.a.value;
  const valB: string = store.state.b.value;
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

  store.hotUpdate({
    mutations: {
      INCREMENT (state) {
        state.count += 10;
      }
    }
  });

  store.hotUpdate({
    modules: {
      a: {
        state: 1,
        mutations: {
          INCREMENT (state) {
            state.value++;
          }
        }
      },
      b: {
        state: 'test',
        mutations: {
          APPEND (state, value) {
            state.value += value;
          }
        }
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
