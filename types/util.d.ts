/**
 * Pre-defined utility types for users.
 */

import { CommitType, DispatchType, StricterStore } from ".";

export type StoreCommitType<
  Store extends StricterStore<any, any, any, any, any>
> = Store extends StricterStore<
  infer RootState,
  any,
  infer Mutations,
  any,
  infer Modules
>
  ? CommitType<RootState, Mutations, Modules>
  : never;

export type StoreDispatchType<
  Store extends StricterStore<any, any, any, any, any>
> = Store extends StricterStore<
  infer RootState,
  any,
  any,
  infer Actions,
  infer Modules
>
  ? DispatchType<RootState, RootState, Actions, Modules>
  : never;
