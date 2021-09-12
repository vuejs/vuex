import { createStore, VuexActionTypes, VuexMutationTypes } from "..";
import { Validate } from "../helpers";

type ActionTypesOfAnyShouldBeString = Validate<VuexActionTypes<any>, string>
type MutationTypesOfAnyShouldBeString = Validate<VuexMutationTypes<any>, string>