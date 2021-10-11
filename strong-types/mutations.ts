import { AddPrefix, IsRequired, UndefinedToOptional, UnionToIntersection } from "./helpers";
import { NamespacedVuexModule, VuexModule, VuexModulesTree } from "./modules";
import { VuexStore, VuexStoreDefinition } from "./store";

export type VuexMutationHandler<
  TState, 
  TPayload = never, 
  TDefinition extends VuexStoreDefinition = any,
> = [TPayload] extends [never] 
  ? (this: VuexStore<TDefinition>, state: TState) => void
  : (this: VuexStore<TDefinition>, state: TState, payload: TPayload) => void

export type VuexMutationsTree<TState = any, TDefinition extends VuexStoreDefinition = any>
  = { [name: string]: VuexMutationHandler<TState, any, TDefinition>; }

export type VuexMutationHandlerPayload<TMutation extends VuexMutationHandler<any, any>> 
  = Parameters<TMutation>[1] extends undefined 
  ? never 
  : Parameters<TMutation>[1]

// Commit
export interface VuexCommitOptions {
  silent?: boolean;
  root?: boolean;
}

type VuexArgumentStyleCommitCallable<TMutation, TPayload> 
  = true extends IsRequired<TPayload>
  ? (mutation: TMutation, payload: TPayload, options?: VuexCommitOptions) => void
  : (mutation: TMutation, payload?: TPayload, options?: VuexCommitOptions) => void 

export type VuexArgumentStyleCommit<TModule extends VuexModule, TPrefix extends string = never> 
  = VuexArgumentStyleCommitOwn<TModule, TPrefix>
  & VuexArgumentStyleCommitModules<TModule["modules"], TPrefix>

export type VuexArgumentStyleCommitOwn<TModule extends VuexModule, TPrefix extends string = never> 
  = UnionToIntersection<{ 
    [TMutation in keyof TModule["mutations"]]: VuexArgumentStyleCommitCallable<
      AddPrefix<string & TMutation, TPrefix>,
      VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
    >;
  }[keyof TModule["mutations"]]>
  
export type VuexObjectStyleCommit<TModule extends VuexModule, TPrefix extends string = never>
  = (mutation: VuexMutations<TModule, TPrefix>, options?: VuexCommitOptions) => void

export type VuexCommit<TModule extends VuexModule, TPrefix extends string = never> 
  = VuexArgumentStyleCommit<TModule, TPrefix>
  & VuexObjectStyleCommit<TModule, TPrefix>

export type VuexArgumentStyleCommitModules<TModules extends VuexModulesTree, TPrefix extends string = never> 
  = (TModules extends never ? true : false) extends false
    ? UnionToIntersection<{ 
      [TKey in keyof TModules]: 
        VuexArgumentStyleCommit<
          TModules[TKey], 
          AddPrefix<TModules[TKey] extends NamespacedVuexModule ? (string & TKey) : never, TPrefix>
        > 
    }[keyof TModules]>
    : unknown

// Mutations
export type VuexMutation<TName extends string, TPayload = never> 
  = { type: TName } 
  & ([TPayload] extends [never] ? { } : UndefinedToOptional<{ payload: TPayload }>)

export type VuexMutations<TModule extends VuexModule, TPrefix extends string = never>
  = VuexOwnMutations<TModule, TPrefix>
  | VuexModulesMutations<TModule["modules"], TPrefix>;

export type VuexOwnMutations<TModule extends VuexModule, TPrefix extends string = never>
  = { 
    [TMutation in keyof TModule["mutations"]]: VuexMutation<
      AddPrefix<string & TMutation, TPrefix>,
      VuexMutationHandlerPayload<TModule["mutations"][TMutation]>
    >
  }[keyof TModule["mutations"]]

export type VuexModulesMutations<TModules extends VuexModulesTree, TPrefix extends string = never>
  = (TModules extends never ? true : false) extends false
  ? { 
    [TModule in keyof TModules]:
      VuexMutations<
        TModules[TModule], 
        AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
      > 
  }[keyof TModules]
  : never

export type VuexMutationTypes<TModule extends VuexModule, TPrefix extends string = never>
  = VuexOwnMutationTypes<TModule, TPrefix>
  | VuexModulesMutationTypes<TModule["modules"], TPrefix>

export type VuexOwnMutationTypes<TModule extends VuexModule, TPrefix extends string = never>
  = AddPrefix<string & keyof TModule["mutations"], TPrefix>

export type VuexModulesMutationTypes<TModules extends VuexModulesTree, TPrefix extends string = never>
  = { 
    [TModule in keyof TModules]:
      VuexOwnMutationTypes<
        TModules[TModule], 
        AddPrefix<TModules[TModule] extends NamespacedVuexModule ? (string & TModule) : never, TPrefix>
      > 
  }[keyof TModules]

export type VuexMutationByName<
  TModule extends VuexModule, 
  TMutation extends VuexMutationTypes<TModule>,
  TPrefix extends string = never,
> = Extract<VuexMutations<TModule, TPrefix>, VuexMutation<TMutation, any>>

export type VuexMutationPayload<
  TModule extends VuexModule, 
  TMutation extends VuexMutationTypes<TModule>,
  TPrefix extends string = never,
> = VuexMutationByName<TModule, TMutation, TPrefix> extends VuexMutation<TMutation, infer TPayload>
  ? TPayload
  : never
