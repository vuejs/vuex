declare namespace Vuex {
  class Store<S> {
    constructor(options: StoreOption<S>);

    state: S;

    dispatch(mutationName: string, ...args: any[]): void;
    dispatch<P>(mutation: MutationObject<P>): void;

    replaceState(state: S): void;

    watch<T>(getter: Getter<S, T>, cb: (value: T) => void, options?: WatchOption): void;

    hotUpdate(options: {
      mutations?: MutationTree<S>;
      modules?: ModuleTree;
    }): void;

    on(event: string, cb: (...args: any[]) => void): void;
    once(event: string, cb: (...args: any[]) => void): void;
    off(event?: string, cb?: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
  }

  function install(Vue: vuejs.VueStatic): void;

  interface StoreOption<S> {
    state?: S;
    mutations?: MutationTree<S>;
    modules?: ModuleTree;
    plugins?: Plugin<S>[];
    strict?: boolean;
  }

  type Getter<S, T> = (state: S) => T;
  type Action<S> = (store: Store<S>, ...args: any[]) => any;
  type Mutation<S> = (state: S, ...args: any[]) => void;
  type Plugin<S> = (store: Store<S>) => void;

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

  interface ComponentOption<S> {
    getters: { [key: string]: Getter<S, any> };
    actions: { [key: string]: Action<S> };
  }

  interface WatchOption {
    deep?: boolean;
    immidiate?: boolean;
  }

  function createLogger<S>(option: LoggerOption<S>): Plugin<any>;

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
