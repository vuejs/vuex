declare namespace Vuex {
  class Store<S> {
    constructor(options: StoreOption<S>);

    state: S;

    dispatch(mutationName: string, ...args: any[]): void;
    dispatch<P>(mutation: MutationObject<P>): void;

    watch(path: string, cb: (value: any) => void, options?: WatchOption): void;
    watch<T>(getter: Getter<S, T>, cb: (value: T) => void, options?: WatchOption): void;

    hotUpdate(options: {
      mutations?: MutationTree<S>;
      modules?: ModuleTree;
    }): void;
  }

  function install(Vue: vuejs.VueStatic): void;

  interface StoreOption<S> {
    state?: S;
    mutations?: MutationTree<S>;
    modules?: ModuleTree;
    middlewares?: (Middleware<S> | SnapshotMiddleware<S>)[];
    strict?: boolean;
  }

  type Getter<S, T> = (state: S) => T;
  type Action<S> = (store: Store<S>, ...args: any[]) => any;
  type Mutation<S> = (state: S, ...args: any[]) => void;

  interface MutationTree<S> {
    [key: string]: Mutation<S>;
  }

  interface MutationObject<P> {
    type: string;
    silent?: boolean;
    payload?: P;
  }

  interface Module<S> {
    state: S;
    mutations: MutationTree<S>;
  }

  interface ModuleTree {
    [key: string]: Module<any>;
  }

  interface Middleware<S> {
    snapshot?: boolean;
    onInit?(state: S, store: Store<S>): void;
    onMutation?(mutation: MutationObject<any>, state: S, store: Store<S>): void;
  }

  interface SnapshotMiddleware<S> {
    snapshot: boolean;
    onInit?(state: S, store: Store<S>): void;
    onMutation?(mutation: MutationObject<any>, nextState: S, prevState: S, store: Store<S>): void;
  }

  interface ComponentOption<S> {
    getters: { [key: string]: Getter<S, any> };
    actions: { [key: string]: Action<S> };
  }

  interface WatchOption {
    deep?: boolean;
    immidiate?: boolean;
  }

  function createLogger<S>(option: LoggerOption<S>): SnapshotMiddleware<any>;

  interface LoggerOption<S> {
    collapsed?: boolean;
    transformer?: (state: S) => any;
    mutationTransformer?: (mutation: MutationObject<any>) => any;
  }
}

declare namespace vuejs {
  interface ComponentOption {
    vuex?: Vuex.ComponentOption<any>;
    store?: Vuex.Store<any>;
  }

  interface Vue {
    $store?: Vuex.Store<any>;
  }
}

declare module 'vuex' {
  export = Vuex
}

declare module 'vuex/logger' {
  export default Vuex.createLogger;
}
