// a set of four specific things
type MyExtract<T,U> = T & U
type FavoriteColors =
  | "dark sienna"
  | "van dyke brown"
  | "yellow ochre"
  | "sap green"
  | "titanium white"
  | "phthalo green"
  | "prussian blue"
  | "cadium yellow"
  | [number, number, number]
  | { red: number; green: number; blue: number }

type StringColors = MyExtract<FavoriteColors, string>
//    ^?
type ObjectColors = MyExtract<FavoriteColors, { red: number }>
//    ^?
// prettier-ignore
type TupleColors
//     ^?
  = MyExtract<FavoriteColors, [number, number, number]>