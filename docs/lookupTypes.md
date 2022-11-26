# Lookup types 

## keyof and Lookup Types [📑](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#keyof-and-lookup-types)

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