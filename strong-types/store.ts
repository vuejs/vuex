import { WatchOptions } from "vue";
import { VuexActions, VuexActionsTree, VuexDispatch } from "./actions";
import { VuexGetter, VuexGetters, VuexGettersTree } from "./getters";
import { GlobalVuexModule, VuexModuleByPath, VuexModuleOptions, VuexModulePath, VuexModulesTree } from "./modules";
import { VuexArgumentStyleCommit, VuexMutations, VuexMutationsTree, VuexObjectStyleCommit } from "./mutations";
import { InstallFunction } from "./public";
import { VuexState } from "./state";

export type VuexPlugin<TStore> 
  = (store: TStore) => any;

export type VuexStoreDefinition<
  TState extends {} = any,
  TMutations extends VuexMutationsTree = VuexMutationsTree,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexGettersTree = VuexGettersTree,
  TModules extends VuexModulesTree = {} | undefined,
> = Omit<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>, "namespaced">
  & {
    strict?: boolean,
    devtools?: boolean,
    plugins?: VuexPlugin<VuexStoreDefinition<TState, TMutations, TActions, TGetters, TModules>>[]
  }

export type VuexWatchOptions 
  = WatchOptions

export interface VuexSubscribeOptions {
  prepend?: boolean
}

export interface VuexMutationSubscriber<TDefinition extends VuexStoreDefinition> {
  (mutation: VuexMutations<TDefinition>): any
}

export type VuexActionSubscriber<TDefinition extends VuexStoreDefinition>
  = VuexActionSubscriberCallback<TDefinition>
  | VuexActionSubscriberObject<TDefinition>

export interface VuexActionSubscriberCallback<TDefinition extends VuexStoreDefinition> {
  (action: VuexActions<TDefinition>, state: VuexState<TDefinition>): any
}
  
export interface VuexActionErrorSubscriberCallback<TDefinition extends VuexStoreDefinition> {
  (action: VuexActions<TDefinition>, state: VuexState<TDefinition>, error: Error): any;
}

export interface VuexActionSubscriberObject<TDefinition extends VuexStoreDefinition> {
  before?: VuexActionSubscriberCallback<TDefinition>
  after?: VuexActionSubscriberCallback<TDefinition>
  error?: VuexActionErrorSubscriberCallback<TDefinition>
}

export type VuexUnsubscribeFunction = () => void

export interface VuexStore<TDefinition extends VuexStoreDefinition> {
  new (definition: TDefinition);

  // vuex 4
  install: InstallFunction;

  commit: VuexArgumentStyleCommit<TDefinition> & VuexObjectStyleCommit<TDefinition>;
  dispatch: VuexDispatch<TDefinition>;
  getters: VuexGetters<TDefinition>;
  state: VuexState<TDefinition>;

  replaceState(state: VuexState<TDefinition>): void;

  hotUpdate(options: {
    actions?: VuexActionsTree,
    mutations?: VuexMutationsTree,
    getters?: VuexGettersTree,
    modules?: VuexModulesTree,
  }): void

  watch<T>(
    getter: VuexGetter<TDefinition, T>, 
    callback: (value: T, oldValue: T) => void, 
    options?: VuexWatchOptions
  ): VuexUnsubscribeFunction

  subscribe(
    mutation: VuexMutationSubscriber<TDefinition>,
    options?: VuexSubscribeOptions
  ): VuexUnsubscribeFunction

  subscribeAction(
    mutation: VuexActionSubscriber<TDefinition>,
    options?: VuexSubscribeOptions
  ): VuexUnsubscribeFunction

  registerModule<TPath extends VuexModulePath<TDefinition>>(path: TPath, module: VuexModuleByPath<TDefinition, TPath>, options?: VuexModuleOptions): void;
  unregisterModule(path: VuexModulePath<TDefinition>): void;

  hasModule(path: VuexModulePath<TDefinition>): boolean;
}