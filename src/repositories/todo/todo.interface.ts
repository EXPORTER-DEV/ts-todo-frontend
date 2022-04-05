import type { Todo } from "../../types/todo/todo";

export interface ITodoFetchResponse {
    status: boolean;
    data?: Todo[];
}

export interface ITodoRepository {
    fetch(): Promise<Todo[] | false>;
}