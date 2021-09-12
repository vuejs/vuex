import { VuexActionsTree } from "./actions";
import { VuexGettersTree } from "./getters";
import { AddPrefix, OneOrMany, UndefinedToOptional, UnionToIntersection } from "./helpers";
import { VuexMutationsTree } from "./mutations";
import { VuexStateProvider } from "./state";

export type BaseVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree = VuexActionsTree | undefined,
  TGetters extends VuexGettersTree = VuexGettersTree | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = UndefinedToOptional<{
    state: VuexStateProvider<TState>;
    mutations: TMutations;
    modules: TModules;
    actions: TActions;
    getters: TGetters;
  }>

export type NamespacedVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree<NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined,
  TGetters extends VuexGettersTree = {} | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
  & { namespaced: true }

export type GlobalVuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree<GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>> = {} | undefined,
  TGetters extends VuexGettersTree = {} | undefined,
  TModules extends VuexModulesTree = {} | undefined,
> = BaseVuexModule<TState, TMutations, TActions, TGetters, TModules> 
  & { namespaced?: false }

export type VuexModule<
  TState extends {} = {},
  TMutations extends VuexMutationsTree<TState> = VuexMutationsTree<TState>,
  TActions extends VuexActionsTree = VuexActionsTree,
  TGetters extends VuexGettersTree = VuexGettersTree,
  TModules extends VuexModulesTree = {},
> = GlobalVuexModule<TState, TMutations, TActions, TGetters, TModules>
  | NamespacedVuexModule<TState, TMutations, TActions, TGetters, TModules>

export type VuexModulesTree 
  = { [name: string]: VuexModule<any, any, any, any, any> }

export type VuexModulePathOwn<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never>
  = [TPrefix] extends [never]
  ? keyof TModule["modules"] 
  | { [TName in keyof TModule["modules"]]: [TName] }[keyof TModule["modules"]]
  : { [TName in keyof TModule["modules"]]: [ ...TPrefix, TName ] }[keyof TModule["modules"]]

export type VuexModulePathModules<TModules, TPrefix extends string[] = never>
  = { 
    [TModule in keyof TModules]: 
      VuexModulePathOwn<
        TModules[TModule], 
        [TPrefix] extends [never] ? [TModule & string] : [...TPrefix, TModule & string]
      > 
  }[keyof TModules]

export type VuexModulesWithPath<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never>
  = VuexModulesWithPathOwn<TModule, TPrefix>
  | VuexModulesWithPathModules<TModule["modules"], TPrefix> 

export type VuexModulesWithPathOwn<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never>
  = [TPrefix] extends [never]
  ? { 
    [TName in keyof TModule["modules"]]: { 
      path: [TName], 
      definition: TModule["modules"][TName] 
    } 
  }[keyof TModule["modules"]]
  : { 
    [TName in keyof TModule["modules"]]: {
      path: [ ...TPrefix, TName ],
      definition: TModule["modules"][TName] 
    }
  }[keyof TModule["modules"]]

export type VuexModulesWithPathModules<TModules, TPrefix extends string[] = never>
  = { 
    [TModule in keyof TModules]: 
      VuexModulesWithPathOwn<
        TModules[TModule], 
        [TPrefix] extends [never] ? [TModule & string] : [...TPrefix, TModule & string]
      > 
  }[keyof TModules]

export type VuexModulePath<TModule extends VuexModule<any, any, any, any>, TPrefix extends string[] = never>
  = VuexModulePathOwn<TModule, TPrefix>
  | VuexModulePathModules<TModule["modules"], TPrefix> 

export type VuexModuleByPath<TModule extends VuexModule<any, any, any, any>, TPath extends VuexModulePath<TModule>>
  = Extract<
    { path: TPath, definition: any }, 
    VuexModulesWithPath<TModule>
  >["definition"]

export type VuexModuleByNamespaceOwn<TModule extends VuexModule, TPrefix extends string = never>
  = { 
    [TName in keyof TModule["modules"] as AddPrefix<TName & string, TPrefix>]: TModule["modules"][TName]
  }

export type VuexModuleByNamespaceModules<TModules, TPrefix extends string = never>
  = UnionToIntersection<{ 
    [TName in keyof TModules]: VuexModuleByNamespace<
      TModules[TName], 
      AddPrefix<TName & string, TPrefix>
    >
  }[keyof TModules]>

export type VuexModuleByNamespace<TModule extends VuexModule, TPrefix extends string = never> 
  = VuexModuleByNamespaceOwn<TModule, TPrefix>
  & VuexModuleByNamespaceModules<TModule["modules"], TPrefix>

export type VuexModuleNamespace<TModule extends VuexModule, TPrefix extends string = never>
  = keyof VuexModuleByNamespace<TModule, TPrefix>

export interface VuexModuleOptions {
  preserveState?: boolean;
}
