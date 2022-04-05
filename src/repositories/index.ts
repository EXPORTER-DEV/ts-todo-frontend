import { AuthRepository } from "./auth/auth";
import { TodoRepository } from "./todo/todo";

export const RepositoriesKey = Symbol("repositories");

export interface IRepositories {
    authRepository: AuthRepository,
    todoRepository: TodoRepository,
}

export const repositories = (): IRepositories => ({
    authRepository: new AuthRepository(),
    todoRepository: new TodoRepository(),
})