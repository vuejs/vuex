import { App, WatchOptions, InjectionKey } from "vue";

// augment typings of Vue.js
import "./vue";

import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers,
} from "./helpers";
import { createLogger } from "./logger";

export * from "./helpers";
export * from "./logger";

type YieldState<S, T extends ModuleTree<S> | undefined> = (S extends () => any
  ? ReturnType<S>
  : S) &
  (T extends ModuleTree<S>
    ? {
        [K in keyof T]: T extends ModuleTree<S>
          ? YieldState<
              T[K]["state"],
              T[K] extends { modules: object } ? T[K]["modules"] : {}
            >
          : never;
      }
    : {});

type YieldGetter<
  SO extends StoreOptions<any>,
  G = {} extends ExtractObjects<SO, "getters">
    ? any
    : ExtractObjects<SO, "getters">
> = {
  [K in keyof G]: G[K] extends (...args: any) => any ? ReturnType<G[K]> : any;
};

export declare class Store<
  _,
  SO extends StoreOptions<any> = StoreOptions<_>,
  S = SO["state"] extends _ ? SO["state"] : _
> {
  constructor(options: SO);

  readonly state: YieldState<S, SO["modules"]>;
  readonly getters: YieldGetter<SO>;

  install(app: App, injectKey?: InjectionKey<Store<any>> | string): void;

  replaceState(state: S): Store<S, SO>;

  dispatch: Dispatch<SO>;
  commit: Commit<SO>;

  subscribe<P extends MutationPayload>(
    fn: (mutation: P, state: S) => any,
    options?: SubscribeOptions
  ): () => void;
  subscribeAction<P extends ActionPayload>(
    fn: SubscribeActionOptions<P, S>,
    options?: SubscribeOptions
  ): () => void;
  watch<T>(
    getter: (state: S, getters: any) => T,
    cb: (value: T, oldValue: T) => void,
    options?: WatchOptions
  ): () => void;

  registerModule<T>(
    path: string,
    module: Module<T, S>,
    options?: ModuleOptions
  ): void;
  registerModule<T>(
    path: string[],
    module: Module<T, S>,
    options?: ModuleOptions
  ): void;

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

export function createStore<S, SO extends StoreOptions<any> = StoreOptions<S>>(
  options: SO
): Store<SO["state"], SO>;

export function useStore<
  S = any,
  SO extends StoreOptions<any> = StoreOptions<S>
>(injectKey?: InjectionKey<Store<S, SO>> | string): Store<S, SO>;

type StrictString<T> = T extends string ? T : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ExtractObjects<
  T,
  S extends string = "actions",
  P extends string = ""
> = (T extends {
  [_ in S]: infer O;
}
  ? { [K in keyof O as `${P}${StrictString<K>}`]: O[K] }
  : {}) &
  (T extends {
    modules: infer O;
  }
    ? UnionToIntersection<
        {
          [K in keyof O]: ExtractObjects<O[K], S, `${P}${StrictString<K>}/`>;
        }[keyof O]
      >
    : {});

export interface Dispatch<
  SO extends StoreOptions<any> = StoreOptions<any>,
  AT = StoreOptions<any> extends SO ? any : ExtractObjects<SO, "actions">
> {
  <T extends keyof AT, A extends AT[T]>(
    type: T,
    payload?: A extends ActionHandler<any, any>
      ? Parameters<A>[1]
      : A extends ActionObject<any, any>
      ? Parameters<A["handler"]>[1]
      : undefined,
    options?: DispatchOptions
  ): A extends ActionHandler<any, any>
    ? ReturnType<A>
    : A extends ActionObject<any, any>
    ? ReturnType<A["handler"]>
    : Promise<any>;
  <T extends keyof AT, A extends AT[T], P extends Payload<T>>(
    payloadWithType: P,
    options?: DispatchOptions
  ): A extends ActionHandler<any, any>
    ? ReturnType<A>
    : A extends ActionObject<any, any>
    ? ReturnType<A["handler"]>
    : Promise<any>;
}

export interface Commit<
  SO extends StoreOptions<any> = StoreOptions<any>,
  MT = StoreOptions<any> extends SO ? any : ExtractObjects<SO, "mutations">
> {
  <T extends keyof MT, M extends MT[T]>(
    type: T,
    payload?: M extends Mutation<any> ? Parameters<M>[1] : undefined,
    options?: CommitOptions
  ): void;
  <T extends keyof MT, P extends Payload<T>>(
    payloadWithType: P,
    options?: CommitOptions
  ): void;
}

export interface ActionContext<S, R> {
  dispatch: Dispatch;
  commit: Commit;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

export interface Payload<T = string> {
  type: T;
}

export interface MutationPayload extends Payload {
  payload: any;
}

export interface ActionPayload extends Payload {
  payload: any;
}

export interface SubscribeOptions {
  prepend?: boolean;
}

export type ActionSubscriber<P, S> = (action: P, state: S) => any;
export type ActionErrorSubscriber<P, S> = (
  action: P,
  state: S,
  error: Error
) => any;

export interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
  error?: ActionErrorSubscriber<P, S>;
}

export type SubscribeActionOptions<P, S> =
  | ActionSubscriber<P, S>
  | ActionSubscribersObject<P, S>;

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

export type ActionHandler<S, R> = (
  this: Store<R>,
  injectee: ActionContext<S, R>,
  payload?: any
) => any;
export interface ActionObject<S, R> {
  root?: boolean;
  handler: ActionHandler<S, R>;
}

export type Getter<S, R> = (
  state: S,
  getters: any,
  rootState: R,
  rootGetters: any
) => any;
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
  mapState: typeof mapState;
  mapMutations: typeof mapMutations;
  mapGetters: typeof mapGetters;
  mapActions: typeof mapActions;
  createNamespacedHelpers: typeof createNamespacedHelpers;
  createLogger: typeof createLogger;
};
export default _default;
