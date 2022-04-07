import { App, WatchOptions, InjectionKey } from "vue";

// augment typings of Vue.js
import "./vue";

import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from "./helpers";
import { createLogger } from "./logger";

export * from "./helpers";
export * from "./logger";

export declare class Store<S, Opt extends StoreOptions<S> = Obj > {
  constructor(options: Opt);


  install(app: App, injectKey?: InjectionKey<Store<any>> | string): void;

  replaceState(state: S): void;

  readonly getters: AllGetter<Opt>
  readonly state: AllState<Opt>
  dispatch: AllDispatch<Opt>
  commit: AllCommit<Opt>

  subscribe<P extends MutationPayload>(fn: (mutation: P, state: S) => any, options?: SubscribeOptions): () => void;
  subscribeAction<P extends ActionPayload>(fn: SubscribeActionOptions<P, S>, options?: SubscribeOptions): () => void;
  watch<T>(getter: (state: S, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

  registerModule<T>(path: string, module: Module<T, S>, options?: ModuleOptions): void;
  registerModule<T>(path: string[], module: Module<T, S>, options?: ModuleOptions): void;

  unregisterModule(path: string): void;
  unregisterModule(path: string[]): void;

  hasModule(path: string): boolean;
  hasModule(path: string[]): boolean;

  hotUpdate(options: {
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
    getters?: GetterTree<S, S>;
    modules?: ModuleTree<S>;
  }): void;
}

export const storeKey: string;
type ExStoreOptions<Opt extends StoreOptions<any>, S> = StoreOptions<S> & Opt

export function createStore<S, Opt>(options: ExStoreOptions<Opt, S>): Store<S,Opt>;

export function useStore<S = any>(injectKey?: InjectionKey<S> | string): S;
type Obj<T = any> = Record<string, T>

type AddPrefix<Keys, Prefix = ''> = `${Prefix & string}${Prefix extends '' ? '' : '/'}${Keys & string}`
type AddNs<K, P, N> = N extends { namespaced: boolean } ? (N['namespaced'] extends true ? AddPrefix<K, P> : P) : P
type GetParam<F> = F extends (context: any, ...params: infer P) => infer R ? [P, R] : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I extends Obj
    ? I
    : never
  : never

type AllState<Opt> = (Opt extends { state: infer S } ? Readonly<S extends () => infer P ? P : S> : undefined) &
  (Opt extends { modules: infer SubM }
    ? Readonly<
        {
          [K in keyof SubM]: AllState<SubM[K]>
        }
      >
    : unknown)

type GetMap<Opt, Target extends string, Pre = ''> = UnionToIntersection<
  | (Opt extends { [_ in Target]: infer MM }
      ? {
          [K in keyof MM as AddPrefix<K, Pre>]: GetParam<MM[K]>
        }
      : never)
  | GetModulesMap<Opt, Target, Pre>
>

type GetModulesMap<Opt, Target extends string, Pre = ''> = Opt extends { modules: infer SubM }
  ? {
      [K in keyof SubM]: GetMap<SubM[K], Target, AddNs<K, Pre, SubM[K]>>
    }[keyof SubM]
  : never

type AllGetter<Opt, G extends Obj = GetMap<Opt, 'getters'>> = {
  readonly [K in keyof G]: G[K][1]
}
type AllCommit<Opt, G extends Obj = GetMap<Opt, 'mutations'>> = {
  <K extends keyof G>(
    type: K,
    ...payload: [...a: G[K][0] extends [] ? [payload?: null] : G[K][0], options?: CommitOptions]
  ): void
  // <S extends { type: keyof G }>(payloadWithType: S, options?: CommitOptions): void
}
type AllDispatch<Opt, G extends Obj = GetMap<Opt, 'actions'>> = {
  <S extends keyof G>(type: S, ...payload: G[S][0]): Promise<G[S][1]>
}

export interface Dispatch {
  (type: string, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends Payload>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

export interface Commit {
  (type: string, payload?: any, options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}

export interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

export interface Payload {
  type: string;
}

export interface MutationPayload extends Payload {
  payload: any;
}

export interface ActionPayload extends Payload {
  payload: any;
}

export interface SubscribeOptions {
  prepend?: boolean
}

export type ActionSubscriber<P, S> = (action: P, state: S) => any;
export type ActionErrorSubscriber<P, S> = (action: P, state: S, error: Error) => any;

export interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
  error?: ActionErrorSubscriber<P, S>;
}

export type SubscribeActionOptions<P, S> = ActionSubscriber<P, S> | ActionSubscribersObject<P, S>;

export interface DispatchOptions {
  root?: boolean;
}

export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

export interface StoreOptions<S> {
  state?: S | (() => S);
  getters?: GetterTree<S, S>;
  actions?: ActionTree<S, S>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
  devtools?: boolean;
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

export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
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
  mapState: typeof mapState,
  mapMutations: typeof mapMutations,
  mapGetters: typeof mapGetters,
  mapActions: typeof mapActions,
  createNamespacedHelpers: typeof createNamespacedHelpers,
  createLogger: typeof createLogger
};
export default _default;
