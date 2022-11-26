# PropertyKey

`propertyKey` is a built in type, it return the key of what iterable you will pass 

```ts
type validKey = keyof any // string | number | symbol
// here validKey is equal to PropertyKey
// but you could also use this for literal type of keyof an Array
type validArrayKeyLiteral = PropertyKey[] // = keyof any[] but literal
type validArrayKeyNotLiteral = keyof any[]
```