import { VuexModule, VuexActionPayload, VuexActionTypes, VuexDispatch, VuexModuleNamespace, VuexModuleByNamespace } from "..";
import { ArrayEntries, IsRequired } from "../helpers";

type VuexActionsObjectMapping<TModule extends VuexModule>
  = { [mapped: string]: VuexActionsMappingEntry<TModule> }

type VuexActionsArrayMapping<TModule extends VuexModule>
  = (VuexActionTypes<TModule>)[]

type VuexActionsMapping<TModule extends VuexModule>
  = VuexActionsObjectMapping<TModule>
  | VuexActionsArrayMapping<TModule>

export type VuexActionsMappingFunctionEntry<TModule extends VuexModule, TArgs extends any[] = any[]>
  = ((commit: VuexDispatch<TModule>, ...args: TArgs) => void)

export type VuexActionsMappingEntry<TModule extends VuexModule, TArgs extends any[] = any[]> 
  = VuexActionTypes<TModule>
  | VuexActionsMappingFunctionEntry<TModule, TArgs>

export type VuexMappedActions<
  TModule extends VuexModule,
  TMapping extends VuexActionsMapping<TModule>,
> = TMapping extends VuexActionsObjectMapping<TModule> ? VuexMappedActionsFromObject<TModule, TMapping>
  : TMapping extends VuexActionsArrayMapping<TModule> ? VuexMappedActionsFromArray<TModule, TMapping>
  : never

type VuexMappedActionByName<TModule extends VuexModule, TAction extends VuexActionTypes<TModule>>
 = true extends IsRequired<VuexActionPayload<TModule, TAction>>
 ? (payload: VuexActionPayload<TModule, TAction>) => void
 : (payload?: VuexActionPayload<TModule, TAction>) => void

export type VuexMappedAction<
  TModule extends VuexModule, 
  TAction extends VuexActionsMappingEntry<TModule>
> = TAction extends VuexActionTypes<TModule> ? VuexMappedActionByName<TModule, TAction>
  : TAction extends VuexActionsMappingFunctionEntry<TModule, infer TArgs> ? (...args: TArgs) => void 
  : unknown

export type VuexMappedActionsFromObject<
  TModule extends VuexModule,
  TMapping extends VuexActionsObjectMapping<TModule>,
> = { [TKey in keyof TMapping]: VuexMappedAction<TModule, TMapping[TKey]> }

export type VuexMappedActionsFromArray<
  TModule extends VuexModule,
  TMapping extends VuexActionsArrayMapping<TModule>,
> = VuexMappedActionsFromObject<TModule, { [TProp in ArrayEntries<TMapping, VuexActionTypes<TModule>>]: TProp }>

export interface VuexBoundMapActionsHelper<TModule extends VuexModule> {
  <TMapping extends VuexActionsObjectMapping<TModule>>(mapping: TMapping): VuexMappedActionsFromObject<TModule, TMapping>;
}

export interface VuexMapActionsHelper<TModule extends VuexModule> extends VuexBoundMapActionsHelper<TModule> {
  <TPath extends VuexModuleNamespace<TModule>, TMapping extends VuexActionsMapping<TNamespaced>, TNamespaced = VuexModuleByNamespace<TModule>[TPath]>(path: TPath, mapping: TMapping): VuexMappedActions<TNamespaced, TMapping>;
}

export declare const mapActions: VuexMapActionsHelper<any>;