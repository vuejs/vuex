import _Vue, { WatchOptions } from "vue";

// augment typings of Vue.js
import "./vue";

import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from "./helpers";

export * from "./helpers";

export declare class Store<S, M extends MutationTree<S> = MutationTree<S>, A extends ActionTree<S, S> = ActionTree<S, S>> {
  constructor(options: StoreOptions<S, M, A>);

  readonly state: S;
  readonly getters: any;

  replaceState(state: S): void;

  dispatch: Dispatch<A>;
  commit: Commit<M>;

  subscribe<P extends MutationPayload<M>>(fn: (mutation: P, state: S) => any): () => void;
  subscribeAction<P extends ActionPayload<A>>(fn: SubscribeActionOptions<P, S>): () => void;
  watch<T>(getter: (state: S, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

  registerModule<T>(path: string, module: Module<T, S>, options?: ModuleOptions): void;
  registerModule<T>(path: string[], module: Module<T, S>, options?: ModuleOptions): void;

  unregisterModule(path: string): void;
  unregisterModule(path: string[]): void;

  hotUpdate<M, A>(options: {
    actions?: A;
    mutations?: M;
    getters?: GetterTree<S, S>;
    modules?: ModuleTree<S>;
  }): void;
}

export declare function install(Vue: typeof _Vue): void;
export interface Dispatch<A> {
  (type: keyof A, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends Payload<A>>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

export interface Commit<M> {
  (type: keyof M, payload?: any, options?: CommitOptions): void;
  <P extends Payload<M>>(payloadWithType: P, options?: CommitOptions): void;
}

export interface ActionContext<S, R, M extends MutationTree<S> = MutationTree<S>, A extends ActionTree<S, R> = ActionTree<S, R>> {
  dispatch: Dispatch<A>;
  commit: Commit<M>;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

export interface Payload<T> {
  type: keyof T;
}

export interface MutationPayload<M> extends Payload<M> {
  payload: any;
}

export interface ActionPayload<A> extends Payload<A> {
  payload: any;
}

export type ActionSubscriber<P, S> = (action: P, state: S) => any;

export interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
}

export type SubscribeActionOptions<P, S> = ActionSubscriber<P, S> | ActionSubscribersObject<P, S>;

export interface DispatchOptions {
  root?: boolean;
}

export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

export interface StoreOptions<S, M, A> {
  state?: S | (() => S);
  getters?: GetterTree<S, S>;
  actions?: A;
  mutations?: M;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
}
export type ActionHandler<S, R> = (this: Store<R>, injectee: ActionContext<S, R>, payload?: any) => any;
export interface ActionObject<S, R> {
  root?: boolean;
  handler: ActionHandler<S, R>;
}

export type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
export type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>;
export type Mutation<S> = (state: S, payload?: any) => any;
export type Plugin<S> = (store: Store<S>) => any;

export interface Module<S, R, M extends MutationTree<S> = MutationTree<S>, A extends ActionTree<S, S> = ActionTree<S, S>> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: A;
  mutations?: M;
  modules?: ModuleTree<R>;
}

export interface ModuleOptions {
  preserveState?: boolean;
}

export interface GetterTree<S, R> {
  [key: string]: Getter<S, R>;
}

export interface ActionTree<S, R> {
  [key: string]: Action<S, R>;
}

export interface MutationTree<S> {
  [key: string]: Mutation<S>;
}

export interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}

declare const _default: {
  Store: typeof Store;
  install: typeof install;
  mapState: typeof mapState,
  mapMutations: typeof mapMutations,
  mapGetters: typeof mapGetters,
  mapActions: typeof mapActions,
  createNamespacedHelpers: typeof createNamespacedHelpers,
};
export default _default;
