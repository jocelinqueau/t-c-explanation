interface Todo {
    title: string;
    description: string;
}

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

const todo: MyReadonly<Todo> = {
    title: "Hey",
    description: "foobar",
};

// @ts-expect-error
todo.title = "Hello"; // Error: cannot reassign a readonly property
// @ts-expect-error
todo.description = "barFoo"; // Error: cannot reassign a readonly property


