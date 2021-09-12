import { VuexModule, VuexModuleByNamespace, VuexModuleNamespace } from "..";
import { VuexBoundMapStateHelper } from "./state";
import { VuexBoundMapGettersHelper } from "./getters";
import { VuexBoundMapMutationsHelper } from "./mutations";
import { VuexBoundMapActionsHelper } from "./actions";

export interface VuexNamespaceHelpers<TModule extends VuexModule> {
  mapState: VuexBoundMapStateHelper<TModule>;
  mapGetters: VuexBoundMapGettersHelper<TModule>;
  mapMutations: VuexBoundMapMutationsHelper<TModule>;
  mapActions: VuexBoundMapActionsHelper<TModule>;
}

export interface VuexCreateNamespacedHelpers<TModule extends VuexModule> {
  <TPath extends VuexModuleNamespace<TModule>>(path: TPath): VuexNamespaceHelpers<VuexModuleByNamespace<TModule>[TPath]>;
}

export declare const createNamespacedHelpers: VuexCreateNamespacedHelpers<any>;

export * from "./state";
export * from "./getters";
export * from "./mutations";
export * from "./actions";