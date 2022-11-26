type PrimitiveRecording = {
    a: string,
    b: number,
    c: boolean,
    d: bigint,
    e: undefined,
    f: symbol,
    g: null
}

type PickOfPrimitiveRecording = {
    [Key in keyof PrimitiveRecording]: PrimitiveRecording[Key]
}

//let e:PickOfPrimitiveRecording = {a:null}

type MyPick<T,K extends keyof T> = {[P in K]: T[P]}

type c = MyPick<PrimitiveRecording, "a">

