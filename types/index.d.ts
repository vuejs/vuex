import './vue'

export class Store<S> {
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

  subscribe(cb: (mutation: MutationObject<any>, state: S) => void): () => void;
}

export function install(Vue: vuejs.VueStatic): void;

export interface StoreOption<S> {
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

export interface MutationTree<S> {
  [key: string]: Mutation<S>;
}

export interface MutationObject<P> {
  type: string;
  silent?: boolean;
  payload?: P;
}

export interface Module<S> {
  state?: S;
  mutations?: MutationTree<S>;
  modules?: ModuleTree;
}

export interface ModuleTree {
  [key: string]: Module<any>;
}

export interface VuexComponentOption<S> {
  getters: { [key: string]: Getter<S, any> };
  actions: { [key: string]: Action<S> };
}

export interface WatchOption {
  deep?: boolean;
  immidiate?: boolean;
}
