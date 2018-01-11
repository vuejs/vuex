import { ActionContext, Module } from './index'

/**
 * Type level utility to annotate types of module state/getters/actions/mutations (module assets).
 * To use this helper, the user should declare corresponding assets type at first.
 *
 * A getters type should be an object that the keys indicate getter names
 * and its corresponding values indicate return types of the getter.
 *
 * Actions type and mutations type should be an object that the keys indicate
 * action/mutation names as same as the getters type.
 * Its values should be declared as payload types of the actions/mutation.
 *
 * After declare the above types, the user put them on the generic parameters
 * of the utility type. Then the real assets object must follow the passed types
 * and type inference will work.
 *
 * The declared types will be used on mapXXX helpers to safely use module assets
 * by annotating its types.
 */
export interface DefineModule<
  State,
  Getters,
  Mutations,
  Actions,
  ExtraGetters = {},
  ExtraMutations = {},
  ExtraActions = {},
  RootState = {},
  RootGetters = {},
  RootMutations = {},
  RootActions = {}
> extends Module<State, never> {
  getters?: DefineGetters<Getters, State, ExtraGetters, RootState, RootGetters>
  mutations?: DefineMutations<Mutations, State>
  actions?: DefineActions<Actions, State, Getters, Mutations & ExtraMutations, ExtraActions, RootState, RootGetters, RootMutations, RootActions>
}

/**
 * Infer getters object type from passed generic types.
 * `Getters` is an object type that the keys indicate getter names and
 * its corresponding values are return types of the getters.
 * `State` is a module state type which is accessible in the getters.
 * `ExtraGetters` is like `Getters` type but will be not defined in the infered getters object.
 * `RootState` and `RootGetters` are the root module's state and getters type.
 */
export type DefineGetters<
  Getters,
  State,
  ExtraGetters = {},
  RootState = {},
  RootGetters = {}
> = {
  [K in keyof Getters]: (
    state: State,
    getters: Getters & ExtraGetters,
    rootState: RootState,
    rootGetters: RootGetters
  ) => Getters[K]
}

/**
 * Infer mutations object type from passed generic types.
 * `Mutations` is an object type that the keys indicate mutation names and
 * its corresponding values are payload types of the mutations.
 * `State` is a module state type which will be mutated in the mutations.
 */
export type DefineMutations<Mutations, State> = {
  [K in keyof Mutations]: (state: State, payload: Mutations[K]) => void
}

/**
 * Infer actions object type from passed generic types.
 * `Actions` is an object type that the keys indicate action names and
 * its corresponding values are payload types of the actions.
 * `State`, `Getters`, `Mutations` are module state/getters/mutations type
 *  which can be accessed in actions.
 * `ExtraActions` is like `Actions` type but will be not defined in the infered actions object.
 * `RootState`, `RootGetters`, `RootMutations`, `RootActions` are the root module's asset types.
 */
export type DefineActions<
  Actions,
  State,
  Getters,
  Mutations,
  ExtraActions = {},
  RootState = {},
  RootGetters = {},
  RootMutations = {},
  RootActions = {}
> = {
  [K in keyof Actions]: (
    ctx: ActionContext<State, RootState, Getters, RootGetters, Mutations, RootMutations, Actions & ExtraActions, RootActions>,
    payload: Actions[K]
  ) => Promise<any> | void
}
