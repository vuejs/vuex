import _Vue, { WatchOptions } from "vue";

// augment typings of Vue.js
import "./vue";

export {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
  createNamespacedHelpers
} from "./helpers";

export {
  DefineModule,
  DefineGetters,
  DefineMutations,
  DefineActions
} from './utils'

export declare class Store<S> {
  constructor(options: StoreOptions<S>);

  readonly state: S;
  readonly getters: any;

  replaceState(state: S): void;

  dispatch: Dispatch;
  commit: Commit;

  subscribe<P extends MutationPayload>(fn: (mutation: P, state: S) => any): () => void;
  subscribeAction<P extends ActionPayload>(fn: (action: P, state: S) => any): () => void;
  watch<T>(getter: (state: S, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

  registerModule<T>(path: string, module: Module<T, S>, options?: ModuleOptions): void;
  registerModule<T>(path: string[], module: Module<T, S>, options?: ModuleOptions): void;

  unregisterModule(path: string): void;
  unregisterModule(path: string[]): void;

  hotUpdate(options: {
    actions?: ActionTree<S, S>;
    mutations?: MutationTree<S>;
    getters?: GetterTree<S, S>;
    modules?: ModuleTree<S>;
  }): void;
}

export declare function install(Vue: typeof _Vue): void;

export interface Dispatch<Actions = Record<string, any>, RootActions = Record<string, any>> {
  // Local
  <K extends keyof Actions>(type: K, payload?: Actions[K], options?: LocalDispatchOptions): Promise<any>;
  <K extends keyof Actions>(payloadWithType: InputPayload<K, Actions>, options?: LocalDispatchOptions): Promise<any>;

  // Root
  <K extends keyof RootActions>(type: K, options: RootDispatchOptions): Promise<any>;
  <K extends keyof RootActions>(type: K, payload: RootActions[K], options: RootDispatchOptions): Promise<any>;
  <K extends keyof RootActions>(payloadWithType: InputPayload<K, RootActions>, options: RootDispatchOptions): Promise<any>;
}

export interface Commit<Mutations = Record<string, any>, RootMutations = Record<string, any>> {
  // Local
  <K extends keyof Mutations>(type: K, payload?: Mutations[K], options?: LocalCommitOptions): void;
  <K extends keyof Mutations>(payloadWithType: InputPayload<K, Mutations>, options?: LocalCommitOptions): void;

  // Root
  <K extends keyof RootMutations>(type: K, options: RootCommitOptions): void;
  <K extends keyof RootMutations>(type: K, payload: RootMutations[K], options: RootCommitOptions): void;
  <K extends keyof RootMutations>(payloadWithType: InputPayload<K, RootMutations>, options: RootCommitOptions): void;
}

export interface ActionContext<
  S,
  RS,
  G = any,
  RG = any,
  M = Record<string, any>,
  RM = Record<string, any>,
  A = Record<string, any>,
  RA = Record<string, any>
> {
  dispatch: Dispatch<A, RA>;
  commit: Commit<M, RM>;
  state: S;
  getters: G;
  rootState: RS;
  rootGetters: RG;
}

export interface Payload {
  type: string;
}

type InputPayload<K extends keyof P, P> = { type: K } & P[K]

export interface MutationPayload extends Payload {
  payload: any;
}

export interface ActionPayload extends Payload {
  payload: any;
}

interface BaseDispatchOptions {}

interface LocalDispatchOptions extends BaseDispatchOptions {
  root?: false
}

interface RootDispatchOptions extends BaseDispatchOptions {
  root: true
}

interface BaseCommitOptions {
  silent?: boolean
}

interface LocalCommitOptions extends BaseCommitOptions {
  root?: false
}

interface RootCommitOptions extends BaseCommitOptions {
  root: true
}

// Leave for backward compatibility
export interface DispatchOptions extends BaseDispatchOptions {
  root?: boolean;
}

// Leave for backward compatibility
export interface CommitOptions extends BaseCommitOptions {
  root?: boolean;
}

export interface StoreOptions<S> {
  state?: S;
  getters?: GetterTree<S, S>;
  actions?: ActionTree<S, S>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S>;
  plugins?: Plugin<S>[];
  strict?: boolean;
}

type ActionHandler<S, R> = (injectee: ActionContext<S, R>, payload: any) => any;
interface ActionObject<S, R> {
  root?: boolean;
  handler: ActionHandler<S, R>;
}

export type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
export type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>;
export type Mutation<S> = (state: S, payload: any) => any;
export type Plugin<S> = (store: Store<S>) => any;

export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<R>;
}

export interface ModuleOptions{
  preserveState?: boolean
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
}
export default _default;
