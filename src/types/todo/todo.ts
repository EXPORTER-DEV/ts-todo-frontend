import type { ITodo } from "./todo.interface";

export class Todo implements ITodo {
    id: number;
    content: string;
    created_at: number;
    updated_at: number;
    favourite: boolean;
    scheduled: number;
    completed: boolean;
    constructor(data: ITodo){
        this.id = data.id;
        this.content = data.content;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.favourite = data.favourite;
        this.scheduled = data.scheduled;
        this.completed = data.completed;
    }
}