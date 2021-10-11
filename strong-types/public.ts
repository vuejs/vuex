import { VuexStore, VuexStoreDefinition } from "./store";

// vuex 4
export declare function createStore<TDefinition extends VuexStoreDefinition>(definition: TDefinition): VuexStore<TDefinition>;
export declare function install(...args: any[]): any;

export type InstallFunction = typeof install;

export declare class Store<TDefinition extends VuexStoreDefinition> {
  constructor(definition: TDefinition);
};

export interface Store<TDefinition extends VuexStoreDefinition> extends VuexStore<TDefinition> {}