# -

## Mapped Types  [📑](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

mapped types are for iterable, it either allow to create a structure that a type will respect, extract, exclude(ie: filter in a way or another).
Or even remap existing structure, plus it can add/remove (`modify`/`modifiers`) `readonly` or optional `?` props

### create a structure

```ts
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};
 
const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

### Remaps
```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};
 
type FeatureOptions = OptionsFlags<FeatureFlags>;
```
> remaps is more this 👇 but i like to call both those remaps
```ts
//generic
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

```ts
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;
```

>filtering out
```ts
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
    kind: "circle";
    radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;
```

Mapped types work well with other features in this type manipulation section, for example here is a mapped type using a conditional type

```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};
 
type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};
 
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
```
### Modifiers

You can remove or add these modifiers by prefixing with - or +. If you don’t add a prefix, then + is assumed.
```ts

// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;

// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
 
type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};
 
type User = Concrete<MaybeUser>;
```

### je sais pas ou mettre 
> You can map over arbitrary unions, not just unions of string | number | symbol, but unions of any type:
```ts
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}
 
type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };
 
type Config = EventConfig<SquareEvent | CircleEvent>
```


## Lookup Types 

### keyof and Lookup Types [📑](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types)

lookup types are also called indexed access types is the ability to get the types of an index from an `object` or also an `array`

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type P1 = Person["name"]; // string
type P2 = Person["name" | "age"]; // string | number
type P3 = string["charAt"]; // (pos: number) => string

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[]; // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person }; // string

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
}
let x = { foo: 10, bar: "hello!" };
let foo = getProperty(x, "foo"); // number
let bar = getProperty(x, "bar"); // string
let oops = getProperty(x, "wargarbl"); // Error! "wargarbl" is not "foo" | "bar"
setProperty(x, "foo", "string"); // Error!, string expected number
```

## PropertyKey

`propertyKey` is a built in type, it return the key of what iterable you will pass 

```ts
type validKey = keyof any // string | number | symbol
// here validKey is equal to PropertyKey
// but you could also use this for literal type of keyof an Array
type validArrayKeyLiteral = PropertyKey[] // = keyof any[] but literal
type validArrayKeyNotLiteral = keyof any[]
```


## Conditional Types [📑](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

```ts
type MessageOf<T> = T["message"];
Type '"message"' cannot be used to index type 'T'.

```

In this example, TypeScript errors because T isn’t known to have a property called message. We could constrain T, and TypeScript would no longer complain:

```ts
type MessageOf<T extends { message: unknown }> = T["message"];
 
interface Email {
  message: string;
}
 
type EmailMessageContents = MessageOf<Email>;
```

However, what if we wanted MessageOf to take any type, and default to something like never if a message property isn’t available? We can do this by *moving the constraint out and introducing a conditional type:*

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
 
interface Email {
  message: string;
}
 
interface Dog {
  bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;
              
// type EmailMessageContents = string
 
type DogMessageContents = MessageOf<Dog>;
             
// type DogMessageContents = never
```
As another example, we could also write a type called Flatten that flattens array types to their element types, but leaves them alone otherwise:

```ts
type Flatten<T> = T extends any[] ? T[number] : T;
type Str = Flatten<string[]>;
type Num = Flatten<number>;
```

When Flatten is given an array type, it uses an indexed access with number to fetch out string[]’s element type. Otherwise, it just returns the type it was given.

### Inferring Within Conditional Types

Conditional types provide us with a way to infer from types we compare against in the true branch using the infer keyword. For example, we could have inferred the element type in Flatten instead of fetching it out “manually” with an indexed access type:

```ts
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

Here, we used the infer keyword to declaratively introduce a new generic type variable named Item instead of specifying how to retrieve the element type of T within the true branch. This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in.

```ts
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;

type Str = GetReturnType<(x: string) => string>;

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
```

### Distributive Conditional Types

When conditional types act on a generic type, they become distributive when given a union type. For example, take the following:
If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.
```ts
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;
```

Typically, distributivity is the desired behavior. To avoid that behavior, you can surround each side of the extends keyword with square brackets.

```ts
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
```

## Suite

