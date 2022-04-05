import { Todo } from "../../types/todo/todo";
import { api } from "../api";
import type { ITodoFetchResponse, ITodoRepository } from "./todo.interface";

export class TodoRepository implements ITodoRepository {
    async fetch(): Promise<Todo[] | false> {
        const result: false | ITodoFetchResponse = await api.get('/todo')
        .then((res) => res.data);
        if(result !== false && result.status === true && result.data !== undefined){
            return result.data?.map((item) => new Todo(item));
        }
        return false;
    }
    async setCompleted(id: number, state: boolean): Promise<boolean> {
        const result: false | ITodoFetchResponse = await api.put(`/todo/${id}/completed?state=${state === true ? 'true' : 'false'}`)
        .then((res) => res.data);
        if(result !== false && result.status === true){
            return true
        }
        return false;
    }
}