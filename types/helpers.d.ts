import Vue from 'vue';
import { Dispatch, Commit } from './index';

type Computed<R> = () => R;
type MutationMethod<P> = (payload: P) => void;
type ActionMethod<P> = (payload: P) => Promise<any>;
type CustomVue = Vue & Record<string, any>

type StateAccessor<T, State, Getters> = {
  [K in keyof T]: (this: CustomVue, state: State, getters: Getters) => T[K];
} & {
  [key: string]: (this: CustomVue, state: State, getters: Getters) => any;
}

interface BaseType { [key: string]: any }

type BaseMethodMap<F> = { [key: string]: (this: CustomVue, fn: F, ...args: any[]) => any }

interface MapGetters<Getters> {
  <Key extends keyof Getters>(map: Key[]): { [K in Key]: Computed<Getters[K]> };
  <Map extends Record<string, keyof Getters>>(map: Map): { [K in keyof Map]: Computed<Getters[Map[K]]> };
}

interface RootMapGetters<Getters> extends MapGetters<Getters> {
  <Key extends keyof Getters>(namespace: string, map: Key[]): { [K in Key]: Computed<Getters[K]> };
  <Map extends Record<string, keyof Getters>>(namespace: string, map: Map): { [K in keyof Map]: Computed<Getters[Map[K]]> };
}

interface MapState<State, Getters> extends MapGetters<State> {
  <T>(map: StateAccessor<T, State, Getters>): { [K in keyof T]: Computed<T[K]> };
}

type CombinedMapState<State, Getters> = MapState<State, Getters> & RootMapGetters<State>
interface RootMapState<State, Getters> extends CombinedMapState<State, Getters> {
  <T>(namespace: string, map: StateAccessor<T, State, Getters>): { [K in keyof T]: Computed<T[K]> };
}

interface MapMutations<Mutations> {
  <Key extends keyof Mutations>(map: Key[]): { [K in Key]: MutationMethod<Mutations[K]> };
  <Map extends Record<string, keyof Mutations>>(map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]]> };
  <T extends BaseMethodMap<Commit<Mutations>>>(map: T): { [K in keyof T]: Function };
}

interface RootMapMutations<Mutations> extends MapMutations<Mutations> {
  <Key extends keyof Mutations>(namespace: string, map: Key[]): { [K in Key]: MutationMethod<Mutations[K]> };
  <Map extends Record<string, keyof Mutations>>(namespace: string, map: Map): { [K in keyof Map]: MutationMethod<Mutations[Map[K]]> };
  <T extends BaseMethodMap<Commit<Mutations>>>(namespace: string, map: T): { [K in keyof T]: Function };
}

interface MapActions<Actions> {
  <Key extends keyof Actions>(map: Key[]): { [K in Key]: ActionMethod<Actions[K]> };
  <Map extends Record<string, keyof Actions>>(map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]]> };
  <T extends BaseMethodMap<Dispatch<Actions>>>(map: T): { [K in keyof T]: Function };
}

interface RootMapActions<Actions> extends MapActions<Actions> {
  <Key extends keyof Actions>(namespace: string, map: Key[]): { [K in Key]: ActionMethod<Actions[K]> };
  <Map extends Record<string, keyof Actions>>(namespace: string, map: Map): { [K in keyof Map]: ActionMethod<Actions[Map[K]]> };
  <T extends BaseMethodMap<Dispatch<Actions>>>(namespace: string, map: T): { [K in keyof T]: Function };
}

interface NamespacedMappers<State, Getters, Mutations, Actions> {
  mapState: MapState<State, Getters>;
  mapGetters: MapGetters<Getters>;
  mapMutations: MapMutations<Mutations>;
  mapActions: MapActions<Actions>;
}

export declare const mapState: RootMapState<BaseType, BaseType>;

export declare const mapMutations: RootMapMutations<BaseType>;

export declare const mapGetters: RootMapGetters<BaseType>;

export declare const mapActions: RootMapActions<BaseType>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers<BaseType, BaseType, BaseType, BaseType>;
export declare function createNamespacedHelpers<State, Getters, Mutations, Actions>(namespace: string): NamespacedMappers<State, Getters, Mutations, Actions>;
