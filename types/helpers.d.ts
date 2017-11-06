import Vue from 'vue';
import { Dispatch, Commit } from './index';

type Computed<R> = () => R;
type MutationMethod<P> = (payload: P) => void;
type ActionMethod<P> = (payload: P) => Promise<any>;

type StateAccessor<T, State, Getters> = {
  [K in keyof T]: (this: Vue, state: State, getters: Getters) => T[K];
} & {
  [key: string]: (this: Vue, state: State, getters: Getters) => any;
}

interface BaseType { [key: string]: any }

type BaseMethodMap<F> = { [key: string]: (this: Vue, fn: F, ...args: any[]) => any }

interface MapGetters<Getters> {
  <T = Getters, Key extends keyof T = keyof T>(map: Key[]): { [K in Key]: Computed<T[K]> };
  <T = Getters, Map extends Record<string, keyof T> = Record<string, keyof T>>(map: Map): { [K in keyof Map]: Computed<T[Map[K]]> };
}

interface RootMapGetters<Getters> extends MapGetters<Getters> {
  <T = Getters, Key extends keyof T = keyof T>(namespace: string, map: Key[]): { [K in Key]: Computed<T[K]> };
  <T = Getters, Map extends Record<string, keyof T> = Record<string, keyof T>>(namespace: string, map: Map): { [K in keyof Map]: Computed<T[Map[K]]> };
}

interface MapState<State> extends MapGetters<State> {
  <State, Getters, T>(map: StateAccessor<T, State, Getters>): { [K in keyof T]: Computed<T[K]> };
}

type CombinedMapState<State> = MapState<State> & RootMapGetters<State>
interface RootMapState<State> extends CombinedMapState<State> {
  <State, Getters, T>(namespace: string, map: StateAccessor<T, State, Getters>): { [K in keyof T]: Computed<T[K]> };
}

interface MapMutations<Mutations> {
  <T = Mutations, Key extends keyof T = keyof T>(map: Key[]): { [K in Key]: MutationMethod<T[K]> };
  <T = Mutations, Map extends Record<string, keyof T> = Record<string, keyof T>>(map: Map): { [K in keyof Map]: MutationMethod<T[Map[K]]> };
  <T extends BaseMethodMap<Commit>>(map: T): { [K in keyof T]: Function };
}

interface RootMapMutations<Mutations> extends MapMutations<Mutations> {
  <T = Mutations, Key extends keyof T = keyof T>(namespace: string, map: Key[]): { [K in Key]: MutationMethod<T[K]> };
  <T = Mutations, Map extends Record<string, keyof T> = Record<string, keyof T>>(namespace: string, map: Map): { [K in keyof Map]: MutationMethod<T[Map[K]]> };
  <T extends BaseMethodMap<Commit>>(namespace: string, map: T): { [K in keyof T]: Function };
}

interface MapActions<Actions> {
  <T = Actions, Key extends keyof T = keyof T>(map: Key[]): { [K in Key]: ActionMethod<T[K]> };
  <T = Actions, Map extends Record<string, keyof T> = Record<string, keyof T>>(map: Map): { [K in keyof Map]: ActionMethod<T[Map[K]]> };
  <T extends BaseMethodMap<Dispatch>>(map: T): { [K in keyof T]: Function };
}

interface RootMapActions<Actions> extends MapActions<Actions> {
  <T = Actions, Key extends keyof T = keyof T>(namespace: string, map: Key[]): { [K in Key]: ActionMethod<T[K]> };
  <T = Actions, Map extends Record<string, keyof T> = Record<string, keyof T>>(namespace: string, map: Map): { [K in keyof Map]: ActionMethod<T[Map[K]]> };
  <T extends BaseMethodMap<Dispatch>>(namespace: string, map: T): { [K in keyof T]: Function };
}

interface NamespacedMappers<State, Getters, Mutations, Actions> {
  mapState: MapState<State>;
  mapMutations: MapMutations<Getters>;
  mapGetters: MapGetters<Mutations>;
  mapActions: MapActions<Actions>;
}

export declare const mapState: RootMapState<BaseType>;

export declare const mapMutations: RootMapMutations<BaseType>;

export declare const mapGetters: RootMapGetters<BaseType>;

export declare const mapActions: RootMapActions<BaseType>;

export declare function createNamespacedHelpers<State = BaseType, Getters = BaseType, Mutations = BaseType, Actions = BaseType>(namespace: string): NamespacedMappers<BaseType, BaseType, BaseType, BaseType>;
