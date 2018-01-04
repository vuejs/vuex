import Vue from 'vue';
import { Dispatch, Commit } from './index';

type Dictionary<T> = { [key: string]: T };
type Computed = () => any;
type MutationMethod = (...args: any[]) => void;
type ActionMethod = (...args: any[]) => Promise<any>;
type CustomVue = Vue & Dictionary<any>
type TypedDictionary<K extends string, V> = { [key in K]: V }
type CompleteObject = { [key: string]: string };

interface Mapper<R> {
  <T extends CompleteObject, K extends keyof T>(map: K[]): TypedDictionary<K, R>;
  <T extends CompleteObject, K extends keyof T>(map: { [key in K]: string }): TypedDictionary<K, R>;
}

interface MapperWithNamespace<R> {
  <T extends CompleteObject, K extends keyof T>(namespace: string, map: K[]): TypedDictionary<K, R>;
  <T extends CompleteObject, K extends keyof T>(namespace: string, map: { [key in K]: string }): TypedDictionary<K, R>;
}

type MappingFunction<F> = (this: CustomVue, fn: F, ...args: any[]) => any

interface FunctionMapper<F, R> {
  <T extends CompleteObject, K extends keyof T>(map: { [key in K]: MappingFunction<F> }): TypedDictionary<K, R>;
}

interface FunctionMapperWithNamespace<F, R> {
  <T extends CompleteObject, K extends keyof T>(
    namespace: string,
    map: { [key in K]: MappingFunction<F> }
  ): TypedDictionary<K, R>;
}

type StateMappingFunction<S> = (this: CustomVue, state: S, getters: any) => any

interface MapperForState {
  <S, T extends CompleteObject, K extends keyof T>(
    map: { [key in K]: StateMappingFunction<S> }
  ): TypedDictionary<K, Computed>;
}

interface MapperForStateWithNamespace {
  <S, T extends CompleteObject, K extends keyof T>(
    namespace: string,
    map: { [key in K]: StateMappingFunction<S> }
  ): TypedDictionary<K, Computed>;
}

interface NamespacedMappers {
  mapState: Mapper<Computed> & MapperForState;
  mapMutations: Mapper<MutationMethod> & FunctionMapper<Commit, MutationMethod>;
  mapGetters: Mapper<Computed>;
  mapActions: Mapper<ActionMethod> & FunctionMapper<Dispatch, ActionMethod>;
}

export declare const mapState: Mapper<Computed>
  & MapperWithNamespace<Computed>
  & MapperForState
  & MapperForStateWithNamespace;

export declare const mapMutations: Mapper<MutationMethod>
  & MapperWithNamespace<MutationMethod>
  & FunctionMapper<Commit, MutationMethod>
  & FunctionMapperWithNamespace<Commit, MutationMethod>;

export declare const mapGetters: Mapper<Computed>
  & MapperWithNamespace<Computed>;

export declare const mapActions: Mapper<ActionMethod>
  & MapperWithNamespace<ActionMethod>
  & FunctionMapper<Dispatch, ActionMethod>
  & FunctionMapperWithNamespace<Dispatch, ActionMethod>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers;
