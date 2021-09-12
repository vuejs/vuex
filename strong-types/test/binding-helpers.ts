import { BarMutations, MyStore } from "./basic"
import {
  mapState,
  mapGetters,
  mapMutations, 
  mapActions, 
  VuexMapStateHelper,
  VuexMapGettersHelper,
  VuexMapMutationsHelper,
  VuexMapActionsHelper, 
  createNamespacedHelpers,
  VuexCreateNamespacedHelpers
} from ".."
import { expectType } from "ts-expect";

const helpers = { 
  mapState: mapState as VuexMapStateHelper<MyStore>,
  mapGetters: mapGetters as VuexMapGettersHelper<MyStore>,
  mapMutations: mapMutations as any as VuexMapMutationsHelper<MyStore>,
  mapActions: mapActions as any as VuexMapActionsHelper<MyStore>,
  createNamespacedHelpers: createNamespacedHelpers as any as VuexCreateNamespacedHelpers<MyStore>,
}

const state = helpers.mapState({ 
  mappedGlobal: "global",
  mappedByFunction: state => state.foo.list
});

expectType<() => string>(state.mappedGlobal)
expectType<() => string[]>(state.mappedByFunction)

const getters = helpers.mapGetters({ 
  mappedFooFirst: "foo/first"
});

expectType<() => string>(getters.mappedFooFirst)

const mutations = helpers.mapMutations({ 
  mappedFooAdded: "foo/added",
  mappedBuzz: BarMutations.Buzz,
  mappedFizz: BarMutations.Fizz
})

mutations.mappedFooAdded("string")
mutations.mappedFizz(10)
// @ts-expect-error
mutations.mappedFizz("string") // wrong argument type
// @ts-expect-error
mutations.mappedFizz() // no argument
mutations.mappedBuzz()

const actions = helpers.mapActions({
  mappedFooLoad: "foo/load",
  mappedFooRefresh: "foo/refresh",
})

actions.mappedFooLoad(["string", "string2"])
actions.mappedFooRefresh()

const foo = helpers.createNamespacedHelpers("foo");

const fooMappedState = foo.mapState({ 
  mappedList: "list",
  mappedFromState: state => state.list[0],
});

expectType<() => string[]>(fooMappedState.mappedList)
expectType<() => string>(fooMappedState.mappedFromState)

const anotherFooMappedState = helpers.mapState("anotherFoo", { 
  mappedList: "list",
  mappedFromState: state => state.list[0],
});

expectType<() => string[]>(anotherFooMappedState.mappedList)
expectType<() => string>(anotherFooMappedState.mappedFromState)
