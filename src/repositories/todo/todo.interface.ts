import type { Todo } from "../../types/todo/todo";

export interface ITodoFetchResponse {
    status: boolean;
    data?: Todo[];
}

export interface ITodoRepository {
    fetch(): Promise<Todo[] | false>;
    setCompleted(id: number, state: boolean): Promise<boolean>;
    create(content: string, scheduled?: number): Promise<Todo | false>;
}

export interface ITodoSetCompletedResponse {
    status: boolean;
}

export interface ITodoCreateResponse {
    status: boolean;
    data?: Todo;
}