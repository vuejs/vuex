export type UnionToIntersection<T> 
  = (T extends any ? (x: T) => any : never) extends (x: infer R) => any 
  ? R 
  : never

export type AddPrefix<TValue extends string, TPrefix extends string = never> 
  = [TPrefix] extends [never] ? TValue 
  : [TValue] extends [never] ? TPrefix
  : `${TPrefix}/${TValue}`

export type OptionalPropertyNames<T> 
  = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
  }[keyof T]

export type MakeOptional<TValue, TKeys extends keyof TValue>
  = { [TKey in TKeys]?: TValue[TKey] }

export type UndefinedToOptional<TValue extends {}>
  = Omit<TValue, OptionalPropertyNames<TValue>>
  & MakeOptional<TValue, OptionalPropertyNames<TValue>>

export type AllPartial<TValue> 
  = TValue extends {} 
  ? {
    [TKey in keyof TValue]?: AllPartial<TValue[TKey]>
  } 
  : TValue

export type Validate<TExpected, TValidated extends TExpected> 
  = TValidated

export type UndefinedKeys<T extends {}>
  = { [TKey in keyof T]: unknown extends T[TKey] ? TKey : never }[keyof T]

export type OmitUndefinedKeys<T extends {}>
  = Omit<T, UndefinedKeys<T>>

export type KeysMatching<TObject, TPattern> 
  = { 
    [TProp in keyof TObject]: TObject[TProp] extends TPattern ? TProp : never
  }[keyof TObject]

export type PickByValue<TObject, TPattern>
  = Pick<TObject, KeysMatching<TObject, TPattern>>

export type ArrayEntries<TArray extends TType[], TType = string>
  = Extract<TArray[keyof TArray], TType>

export type IsRequired<T> 
  = unknown extends T ? false 
  : [T] extends [undefined] ? false
  : [T] extends [never] ? false
  : true

export type OneOrMany<T> 
  = T 
  | T[]