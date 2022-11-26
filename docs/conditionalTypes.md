
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
