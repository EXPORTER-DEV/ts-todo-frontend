export interface ITodo {
    id: number;
    content: string;
    created_at: number;
    updated_at: number;
    favourite: boolean;
    scheduled: number;
    completed: boolean;
}