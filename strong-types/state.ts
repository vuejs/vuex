import { VuexModule, VuexModulesTree } from "./modules";

export type VuexState<TModule extends VuexModule<any, any, any, any, any>>
  = VuexOwnState<TModule>
  & VuexModulesState<TModule["modules"]>

export type VuexOwnState<TModule extends VuexModule<any>>
  = VuexExtractState<TModule["state"]>

export type VuexModulesState<TModules extends VuexModulesTree>
  = { [TModule in keyof TModules]: VuexState<TModules[TModule]> }

export type VuexStateProvider<TState>
  = TState
  | (() => TState)

export type VuexExtractState<TState>
  = TState extends VuexStateProvider<infer TResult>
  ? TResult
  : unknown
