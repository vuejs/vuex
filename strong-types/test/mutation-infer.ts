import { VuexGettersTree, VuexMutationHandler } from ".."
import { Validate } from "../helpers"

type State = { foo: string }

const mutations = {
  added(state: State, payload: string) {
    state.foo = payload
  }
}

type MutationInferenceTest = Validate<
  VuexGettersTree<State>,
  typeof mutations
>

type MutationHandlerInferenceTest = Validate<
  VuexMutationHandler<State, string>,
  typeof mutations["added"]
>