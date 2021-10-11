import { VuexModule, VuexGetters, VuexModuleByNamespace, VuexModuleNamespace } from "..";
import { ArrayEntries, PickByValue } from "../helpers";

type VuexGettersObjectMapping<TModule extends VuexModule>
  = { [mapped: string]: VuexGettersMappingEntry<VuexGetters<TModule>> }

type VuexGettersArrayMapping<TModule extends VuexModule>
  = (keyof VuexGetters<TModule>)[]

type VuexGettersMapping<TModule extends VuexModule>
  = VuexGettersObjectMapping<TModule>
  | VuexGettersArrayMapping<TModule>

export type VuexGettersMappingEntry<TGetters> 
  = keyof TGetters 

export type VuexMappedGettersByPropertyName<
  TModule extends VuexModule,
  TMapping extends { [TKey in keyof TMapping]: keyof VuexGetters<TModule> }
> = { [TKey in keyof TMapping]: () => VuexGetters<TModule>[TMapping[TKey]] }

export type VuexMappedGettersFromObject<
  TModule extends VuexModule,
  TMapping extends VuexGettersObjectMapping<TModule>,
> = VuexMappedGettersByPropertyName<TModule, PickByValue<TMapping, keyof VuexGetters<TModule>>>

export type VuexMappedGettersFromArray<
  TModule extends VuexModule,
  TMapping extends VuexGettersArrayMapping<TModule>,
> = VuexMappedGettersFromObject<TModule, { [TProp in ArrayEntries<TMapping, keyof VuexGetters<TModule>>]: TProp }>

export type VuexMappedGetters<
  TModule extends VuexModule,
  TMapping extends VuexGettersMapping<TModule>,
> = TMapping extends VuexGettersObjectMapping<TModule> ? VuexMappedGettersFromObject<TModule, TMapping>
  : TMapping extends VuexGettersArrayMapping<TModule> ? VuexMappedGettersFromArray<TModule, TMapping>
  : never


export interface VuexBoundMapGettersHelper<TModule extends VuexModule> {
  <TMapping extends VuexGettersMapping<TModule>>(mapping: TMapping): VuexMappedGetters<TModule, TMapping>;
}

export interface VuexMapGettersHelper<TModule extends VuexModule> extends VuexBoundMapGettersHelper<TModule> {
  <TPath extends VuexModuleNamespace<TModule>, TMapping extends VuexGettersMapping<TNamespaced>, TNamespaced = VuexModuleByNamespace<TModule>[TPath]>(path: TPath, mapping: TMapping): VuexMappedGetters<TNamespaced, TMapping>;
}

export declare const mapGetters: VuexMapGettersHelper<any>;