import Vue = require("vue");

type Dictionary<T> = { [key: string]: T };
type Computed = () => any;
type MutationMethod = (...args: any[]) => void;
type ActionMethod = (...args: any[]) => Promise<any>;

interface Mapper<R> {
  (map: string[]): Dictionary<R>;
  (map: Dictionary<string>): Dictionary<R>;
}

interface MapperWithNamespace<R> {
  (namespace: string, map: string[]): Dictionary<R>;
  (namespace: string, map: Dictionary<string>): Dictionary<R>;
}

interface MapperForState {
  <S>(
    map: Dictionary<(this: typeof Vue, state: S, getters: any) => any>
  ): Dictionary<Computed>;
}

interface MapperForStateWithNamespace {
  <S>(
    namespace: string,
    map: Dictionary<(this: typeof Vue, state: S, getters: any) => any>
  ): Dictionary<Computed>;
}

interface NamespacedMappers {
  mapState: Mapper<Computed> & MapperForState;
  mapMutations: Mapper<MutationMethod>;
  mapGetters: Mapper<Computed>;
  mapActions: Mapper<ActionMethod>;
}

export declare const mapState: Mapper<Computed>
  & MapperWithNamespace<Computed>
  & MapperForState
  & MapperForStateWithNamespace;

export declare const mapMutations: Mapper<MutationMethod>
  & MapperWithNamespace<MutationMethod>;

export declare const mapGetters: Mapper<Computed>
  & MapperWithNamespace<Computed>;

export declare const mapActions: Mapper<ActionMethod>
  & MapperWithNamespace<ActionMethod>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers;
