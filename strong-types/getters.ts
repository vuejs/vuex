import { AddPrefix, UnionToIntersection } from "./helpers";
import { NamespacedVuexModule, VuexModule, VuexModulesTree } from "./modules";
import { VuexState } from "./state";

export type VuexGettersTree<TModule extends VuexModule = any, TRoot extends VuexModule = any>
  = { [name: string]: VuexGetter<TModule, any, TRoot, any>; }

export type VuexGetter<
  TModule extends VuexModule<any, any, any, any>, 
  TResult, 
  TRoot extends VuexModule<any, any, any, any> = any,
  TGetters = VuexGetters<TModule>
> 
  = (state: VuexState<TModule>, getters: TGetters, rootState: VuexState<TRoot>, rootGetters: VuexGetters<TRoot>) => TResult

export type VuexOwnGetters<TModule extends VuexModule, TPrefix extends string = never>
  = { [TGetter in keyof TModule["getters"] as `${AddPrefix<string & TGetter, TPrefix>}`]: ReturnType<TModule["getters"][TGetter]> }

export type VuexModulesGetters<TModules extends VuexModulesTree, TPrefix extends string = never>
  = (TModules extends never ? true : false) extends false
  ? UnionToIntersection<{ 
    [TModule in keyof TModules]: VuexGetters<
      TModules[TModule], 
      AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
    > 
  }[keyof TModules]>
  : unknown

export type VuexGetters<TModule extends VuexModule<any, any, any, any>, TPrefix extends string = never>
  = VuexOwnGetters<TModule, TPrefix>
  & VuexModulesGetters<TModule["modules"], TPrefix>
  
export type VuexGetterResult<TModule extends VuexModule, TGetter extends keyof VuexGetters<TModule>>
  = VuexGetters<TModule>[TGetter]

export type VuexGettersNames<TModule extends VuexModule>
  = keyof VuexGetters<TModule>
