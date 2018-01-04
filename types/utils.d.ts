import { ActionContext } from './index'

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

export type DefineMutations<Mutations, State> = {
  [K in keyof Mutations]: (state: State, payload: Mutations[K]) => void
}

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
