import { App, WatchOptions, InjectionKey } from "vue";

// augment typings of Vue.js
import "./vue";

import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from "./helpers";
import { createLogger } from "./logger";

export * from "./helpers";
export * from "./logger";
export * from "./util";

export declare class Store<S> {
  constructor(options: StoreOptions<S>);

  readonly state: S;
  readonly getters: any;

  install(app: App, injectKey?: InjectionKey<Store<any>> | string): void;

  replaceState(state: S): void;

  dispatch: Dispatch;
  commit: Commit;

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

export function createStore<S>(options: StoreOptions<S>): Store<S>;

export function useStore<StoreType extends Store<any> | StricterStore<any, any, any, any, any>>(injectKey: InjectionKey<StoreType>): StoreType;
export function useStore<State = any>(injectKey?: InjectionKey<Store<State>> | string): Store<State>;

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

export interface Payload<Type extends string = string> {
  type: Type;
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

// Stricter Types

export function createStore<Options extends StoreOptions<any>>(
  options: Options & { stricterTypes: true }
): StricterStore<
  Options extends StoreOptions<infer State> ? State : never,
  NonNullable<Options["getters"]>,
  NonNullable<Options["mutations"]>,
  NonNullable<Options["actions"]>,
  NonNullable<Options["modules"]>
>;

export interface StricterStore<
  RootState,
  Getters extends GetterTree<RootState, RootState>,
  Mutations extends MutationTree<RootState>,
  Actions extends ActionTree<RootState, RootState>,
  Modules extends ModuleTree<RootState>
> extends Omit<Store<RootState>, "state" | "getters" | "dispatch" | "commit"> {
  readonly state: StoreState<RootState, RootState, Modules>;
  readonly getters: StoreGetters<RootState, RootState, Getters, Modules>;

  dispatch: StricterDispatch<RootState, RootState, Actions, Modules>;
  commit: StricterCommit<RootState, Mutations, Modules>;
}
export type StoreState<
  State,
  RootState,
  Modules extends ModuleTree<RootState>
> = State &
  {
    [Name in keyof Modules]: Modules[Name]["state"] &
      (Modules[Name]["modules"] extends ModuleTree<RootState>
        ? StoreState<
            Modules[Name]["state"],
            RootState,
            Modules[Name]["modules"]
          >
        : {});
  };

export type StoreGetters<
  State,
  RootState,
  Getters extends GetterTree<State, RootState>,
  Modules extends ModuleTree<RootState>
> = {
  [Name in keyof Getters]: ReturnType<Getters[Name]>;
} &
  {
    [Path in ExtractNamespacedPaths<
      RootState,
      Modules,
      "getters"
    >]: ResolveNamespacedPath<
      Path,
      "getters",
      RootState,
      Modules
    > extends infer Getter
      ? Getter extends () => infer ReturnType
        ? ReturnType
        : never
      : never;
  };

export interface StricterDispatch<
  State = any,
  RootState = any,
  Actions extends ActionTree<State, RootState> = any,
  Modules extends ModuleTree<RootState> = any
> {
  <Type extends DispatchType<State, RootState, Actions, Modules>>(
    type: Type,
    payload?: ExtractPayloadType<
      DispatchAction<State, RootState, Actions, Modules, Type>
    >,
    options?: DispatchOptions
  ): ReturnType<DispatchAction<State, RootState, Actions, Modules, Type>>;

  <Type extends DispatchType<State, RootState, Actions, Modules>>(
    payloadWithType: Payload<Type> &
      ExtractPayloadType<
        DispatchAction<State, RootState, Actions, Modules, Type>
      >,
    options?: DispatchOptions
  ): Promise<any>;
}
export type DispatchType<
  State,
  RootState,
  Actions extends ActionTree<State, RootState>,
  Modules extends ModuleTree<RootState>
> =
  | (string & keyof Actions)
  | ExtractNamespacedPaths<RootState, Modules, "actions">;
export type DispatchAction<
  State,
  RootState,
  Actions extends ActionTree<State, RootState>,
  Modules extends ModuleTree<RootState>,
  Type extends DispatchType<State, RootState, Actions, Modules>
> = Type extends string & keyof Actions
  ? EnsureActionHandler<State, RootState, Actions[Type]>
  : Type extends ExtractNamespacedPaths<RootState, Modules, "actions">
  ? ResolveNamespacedPath<
      Type,
      "actions",
      RootState,
      Modules
    > extends infer ActionType
    ? ActionType extends Action<State, RootState>
      ? EnsureActionHandler<State, RootState, ActionType>
      : never
    : never
  : never;
export type EnsureActionHandler<
  State,
  RootState,
  ActionType extends Action<State, RootState>
> = ActionType extends ActionObject<State, RootState>
  ? ActionType["handler"]
  : ActionType;

export interface StricterCommit<
  RootState = any,
  Mutations extends MutationTree<RootState> = any,
  Modules extends ModuleTree<RootState> = any
> {
  <Type extends CommitType<RootState, Mutations, Modules>>(
    type: Type,
    payload?: ExtractPayloadType<
      CommitMutation<RootState, Mutations, Modules, Type>
    >,
    options?: CommitOptions
  ): void;

  <Type extends CommitType<RootState, Mutations, Modules>>(
    payloadWithType: Payload<Type> &
      ExtractPayloadType<CommitMutation<RootState, Mutations, Modules, Type>>,
    options?: CommitOptions
  ): void;
}
export type CommitType<
  RootState,
  Mutations extends MutationTree<RootState>,
  Modules extends ModuleTree<RootState>
> =
  | (string & keyof Mutations)
  | ExtractNamespacedPaths<RootState, Modules, "mutations">;
export type CommitMutation<
  RootState,
  Mutations extends MutationTree<RootState>,
  Modules extends ModuleTree<RootState>,
  Type extends CommitType<RootState, Mutations, Modules>
> = Type extends string & keyof Mutations
  ? Mutations[Type]
  : Type extends ExtractNamespacedPaths<RootState, Modules, "mutations">
  ? ResolveNamespacedPath<
      Type,
      "mutations",
      RootState,
      Modules
    > extends infer MutationType
    ? MutationType extends Mutation<any>
      ? MutationType
      : never
    : never
  : never;

export type ExtractPayloadType<
  T extends (_: any, payload: any, ...args: any[]) => any
> = Parameters<T>[1];

export type ExtractNamespacedPaths<
  RootState,
  Modules extends ModuleTree<RootState>,
  KeysFrom extends keyof Module<unknown, unknown>
> = {
  [Name in string & keyof Modules]: Modules[Name]["namespaced"] extends true
    ?
        | `${Name}/${string & keyof Modules[Name][KeysFrom]}`
        | `${Name}/${Modules[Name]["modules"] extends ModuleTree<RootState>
            ? ExtractNamespacedPaths<
                RootState,
                Modules[Name]["modules"],
                KeysFrom
              >
            : never}`
    : never;
} extends infer T
  ? T[keyof T]
  : never;
export type ResolveNamespacedPath<
  Path extends string,
  KeysFrom extends keyof Module<unknown, unknown>,
  RootState,
  Modules extends ModuleTree<RootState>
> = Path extends `${infer ModuleName}/${infer RestPathOrKey}`
  ? RestPathOrKey extends keyof Modules[ModuleName][KeysFrom]
    ? Modules[ModuleName][KeysFrom][RestPathOrKey]
    : ResolveNamespacedPath<
        RestPathOrKey,
        KeysFrom,
        RootState,
        NonNullable<Modules[ModuleName]["modules"]>
      >
  : never;
