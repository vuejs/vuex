import { VuexModule, VuexModuleByNamespace, VuexModuleNamespace, VuexState } from "..";
import { ArrayEntries, PickByValue } from "../helpers";

type VuexStateObjectMapping<TModule extends VuexModule>
  = { [mapped: string]: VuexStateMappingEntry<VuexState<TModule>> }

type VuexStateArrayMapping<TModule extends VuexModule>
  = (keyof VuexState<TModule>)[]

type VuexStateMapping<TModule extends VuexModule>
  = VuexStateObjectMapping<TModule>
  | VuexStateArrayMapping<TModule>

export type VuexStateMappingEntry<TState, TReturn = any> 
  = keyof TState 
  | ((state: TState) => TReturn)
  ;

export type VuexMappedStateByFunction<
  TModule extends VuexModule,
  TMapping extends { [TKey in keyof TMapping]: (state: VuexState<TModule>) => any }
> = { [TKey in keyof TMapping]: () => ReturnType<TMapping[TKey]> }

export type VuexMappedStateByPropertyName<
  TModule extends VuexModule,
  TMapping extends { [TKey in keyof TMapping]: keyof VuexState<TModule> }
> = { [TKey in keyof TMapping]: () => VuexState<TModule>[TMapping[TKey]] }

export type VuexMappedStateFromObject<
  TModule extends VuexModule,
  TMapping extends VuexStateObjectMapping<TModule>,
> = VuexMappedStateByPropertyName<TModule, PickByValue<TMapping, keyof VuexState<TModule>>>
  & VuexMappedStateByFunction<TModule, PickByValue<TMapping, Function>>

export type VuexMappedStateFromArray<
  TModule extends VuexModule,
  TMapping extends VuexStateArrayMapping<TModule>,
> = VuexMappedStateFromObject<TModule, { [TProp in ArrayEntries<TMapping, keyof VuexState<TModule>>]: TProp }>

export type VuexMappedState<
  TModule extends VuexModule,
  TMapping extends VuexStateMapping<TModule>,
> = TMapping extends VuexStateObjectMapping<TModule> ? VuexMappedStateFromObject<TModule, TMapping>
  : TMapping extends VuexStateArrayMapping<TModule> ? VuexMappedStateFromArray<TModule, TMapping>
  : never


export interface VuexBoundMapStateHelper<TModule extends VuexModule> {
  <TMapping extends VuexStateMapping<TModule>>(mapping: TMapping): VuexMappedState<TModule, TMapping>;
}

export interface VuexMapStateHelper<TModule extends VuexModule> extends VuexBoundMapStateHelper<TModule> {
  <TPath extends VuexModuleNamespace<TModule>, TMapping extends VuexStateMapping<TNamespaced>, TNamespaced = VuexModuleByNamespace<TModule>[TPath]>(path: TPath, mapping: TMapping): VuexMappedState<TNamespaced, TMapping>;
}

export declare const mapState: VuexMapStateHelper<any>;