import { VuexGetters } from "./getters";
import { AddPrefix, IsRequired, OmitUndefinedKeys, UndefinedToOptional, UnionToIntersection } from "./helpers";
import { NamespacedVuexModule, VuexModule, VuexModulesTree } from "./modules";
import { VuexCommit } from "./mutations";
import { VuexState } from "./state";
import { VuexStore, VuexStoreDefinition } from "./store";

export type VuexActionsTree<
  TModule extends VuexModule = any, 
  TDefinition extends VuexStoreDefinition = any
> = { [name: string]: VuexActionHandler<TModule, any, any, TDefinition>; }

export type VuexActionHandler<
  TModule extends VuexModule, 
  TPayload = never, 
  TResult = Promise<void>,
  TDefinition extends VuexStoreDefinition = any,
> = (
  this: VuexStore<TDefinition>, 
  context: VuexActionContext<TModule, TDefinition>, 
  payload: TPayload
) => TResult

export type VuexActionHandlerPayload<TAction extends VuexActionHandler<any, any, any, any>> 
  = Parameters<TAction>[1] extends undefined 
  ? never 
  : Parameters<TAction>[1]

export interface VuexActionContext<
  TModule extends VuexModule,
  TRoot extends VuexModule<any, any, any, any, any> = VuexModule<any, any, any, any, any>
> {
  commit: VuexCommit<TModule>,
  dispatch: VuexDispatch<TModule>,
  state: VuexState<TModule>,
  getters: VuexGetters<TModule>,
  rootState: VuexState<TRoot>,
  rootGetters: VuexGetters<TRoot>,
}

// Actions

export type VuexAction<TName extends string, TPayload = never> 
  = { type: TName } 
  & ([TPayload] extends [never] ? { } : UndefinedToOptional<{ payload: TPayload }>)

export type VuexActions<TModule extends VuexModule, TPrefix extends string = never>
  = VuexOwnActions<TModule, TPrefix>
  | VuexModulesActions<TModule["modules"], TPrefix>

export type VuexOwnActions<TModule extends VuexModule, TPrefix extends string = never>
  = { 
    [TAction in keyof TModule["actions"]]: VuexAction<
      AddPrefix<string & TAction, TPrefix>,
      VuexActionHandlerPayload<TModule["actions"][TAction]>
    > 
  }[keyof TModule["actions"]]

export type VuexModulesActions<TModules extends VuexModulesTree, TPrefix extends string = never>
  = { 
    [TModule in keyof TModules]: 
      VuexActions<
        TModules[TModule], 
        AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
      > 
  }[keyof TModules]

// Dispatch

type VuexArgumentStyleDispatchCallable<TAction, TPayload, TResult> 
  = true extends IsRequired<TPayload>
  ? (action: TAction, payload: TPayload, options?: VuexDispatchOptions) => TResult
  : (action: TAction, payload?: TPayload, options?: VuexDispatchOptions) => TResult

export interface VuexDispatchOptions { 
  root?: boolean
}

export type VuexDispatch<TModule extends VuexModule, TPrefix extends string = never>
  = VuexObjectStyleDispatch<TModule, TPrefix>
  & VuexArgumentStyleDispatch<TModule, TPrefix>

// todo: figure out how to get proper return value
export type VuexObjectStyleDispatch<TModule extends VuexModule, TPrefix extends string = never>
  = <TAction extends VuexActionTypes<TModule>>(
      action: VuexActionByName<TModule, TAction, TPrefix>, 
      options?: VuexDispatchOptions
    ) => VuexActionResult<TModule, TAction, TPrefix>

export type VuexArgumentStyleDispatch<TModule extends VuexModule, TPrefix extends string = never>
  = VuexArgumentStyleDispatchOwn<TModule, TPrefix>
  & VuexArgumentStyleDispatchModules<TModule["modules"], TPrefix>

export type VuexArgumentStyleDispatchOwn<TModule extends VuexModule, TPrefix extends string = never>
  = UnionToIntersection<{
    [TAction in keyof TModule["actions"]]: VuexArgumentStyleDispatchCallable<
      AddPrefix<string & TAction, TPrefix>,
      VuexActionHandlerPayload<TModule["actions"][TAction]>,
      ReturnType<TModule["actions"][TAction]>
    >
  }[keyof TModule["actions"]]>

export type VuexArgumentStyleDispatchByModules<TModules extends VuexModulesTree, TPrefix extends string = never>
  = (TModules extends never ? true : false) extends false
  ? OmitUndefinedKeys<{ 
    [TModule in keyof TModules]: 
      VuexArgumentStyleDispatch<
        TModules[TModule], 
        AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
      > 
  }>
  : never

export type VuexArgumentStyleDispatchModules<TModules extends VuexModulesTree, TPrefix extends string = never>
  = UnionToIntersection<VuexArgumentStyleDispatchByModules<TModules, TPrefix>[keyof VuexArgumentStyleDispatchByModules<TModules, TPrefix>]>

export type VuexActionTypes<TModule extends VuexModule, TPrefix extends string = never>
  = VuexOwnActionTypes<TModule, TPrefix>
  | VuexModulesActionTypes<TModule["modules"], TPrefix>

export type VuexOwnActionTypes<TModule extends VuexModule, TPrefix extends string = never>
  = AddPrefix<string & keyof TModule["actions"], TPrefix>

export type VuexModulesActionTypes<TModules extends VuexModulesTree, TPrefix extends string = never>
  = (TModules extends never ? true : false) extends false
  ? { 
    [TModule in keyof TModules]:
      VuexOwnActionTypes<
        TModules[TModule], 
        AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
      > 
  }[keyof TModules]
  : never

export type VuexActionByName<
  TModule extends VuexModule, 
  TAction extends VuexActionTypes<TModule>,
  TPrefix extends string = never,
> = (TModule extends never ? true : false) extends false
  ? Extract<VuexActions<TModule, TPrefix>, VuexAction<TAction, any>>
  : VuexAction<string, any>

export type VuexActionPayload<
  TModule extends VuexModule, 
  TMutation extends VuexActionTypes<TModule>,
  TPrefix extends string = never,
> = VuexActionByName<TModule, TMutation, TPrefix> extends VuexAction<TMutation, infer TPayload>
  ? TPayload
  : never

export type VuexActionResult<
  TModule extends VuexModule, 
  TMutation extends VuexActionTypes<TModule>,
  TPrefix extends string = never,
> = ReturnType<Extract<VuexArgumentStyleDispatch<TModule, TPrefix>, (action: TMutation, ...args: any[]) => any>>
