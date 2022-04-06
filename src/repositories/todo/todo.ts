import { Todo } from "../../types/todo/todo";
import { api } from "../api";
import type { ITodoCreateResponse, ITodoFetchResponse, ITodoRepository, ITodoSetCompletedResponse } from "./todo.interface";

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
        const result: false | ITodoSetCompletedResponse = await api.put(`/todo/${id}/completed?state=${state === true ? 'true' : 'false'}`)
        .then((res) => res.data);
        if(result !== false && result.status === true){
            return true
        }
        return false;
    }
    async create(content: string, scheduled?: number): Promise<Todo | false> {
        const result: false | ITodoCreateResponse = await api.post('/todo/create', {
            content,
            scheduled
        })
        .then((res) => res.data);
        if(result !== false && result.status === true && result.data !== undefined){
            return new Todo(result.data);
        }
        return false;
    }
}