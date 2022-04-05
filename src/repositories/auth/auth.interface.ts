import type { IUser } from "../../types/user/user.interface";

export interface IAuthLoginResponse {
    status: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
    }
}

export interface IAuthRefreshResponse {
    status: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
    }
}

export interface IAuthRegisterResponse {
    status: boolean;
}

export interface IAuthGetUserResponse {
    status: boolean;
    data?: IUser;
}

export interface IAuthRepository {
    login(email: string, password: string): Promise<boolean>,
    refresh(token: string): Promise<boolean>,
}