import Cookies from "js-cookie";
import { constants } from "../../constants";
import { User } from "../../types/user/user";
import { api } from "../api";
import type { IAuthGetUserResponse, IAuthLoginResponse, IAuthRefreshResponse, IAuthRegisterResponse, IAuthRepository } from "./auth.interface";

export class AuthRepository implements IAuthRepository {
    async login(email: string, password: string): Promise<boolean> {
        const result: false | IAuthLoginResponse = await api.post<IAuthLoginResponse>("/user/login", {
            email,
            password
        }).then((res) => res.data);
        if(result !== false){
            if(result.status === true && result.data !== undefined){
                Cookies.set(constants.ACCESS_TOKEN, result.data.access_token, {
                    expires: 7,
                });
                Cookies.set(constants.REFRESH_TOKEN, result.data.refresh_token, {
                    expires: 30,
                });
                return true;
            }
        }
        return false;
    }
    async refresh(token: string): Promise<boolean> {
        const result: false | IAuthRefreshResponse = await api.post<IAuthRefreshResponse>("/user/refresh", {
            token
        }).then((res) => res.data);
        if(result !== false){
            if(result.status === true && result.data !== undefined){
                Cookies.set(constants.ACCESS_TOKEN, result.data.access_token, {
                    expires: 7,
                });
                Cookies.set(constants.REFRESH_TOKEN, result.data.refresh_token, {
                    expires: 30,
                });
                return true;
            }
        }else{
            Cookies.remove(constants.ACCESS_TOKEN);
            Cookies.remove(constants.REFRESH_TOKEN);
        }
        return false;
    }
    async register(firstname: string, lastname: string, email: string, password: string): Promise<boolean> {
        const result: false | IAuthRegisterResponse = await api.post<IAuthRegisterResponse>("/user/register", {
            firstname,
            lastname,
            email,
            password
        }).then((res) => res.data);
        if(result !== false && result.status === true){
            return true;
        }
        return false;
    }
    async getUser(): Promise<User | false> {
        const result: false | IAuthGetUserResponse = await api.get<IAuthGetUserResponse>("/user/info")
        .then((res) => res.data);
        if(result !== false && result.status === true && result.data !== undefined){
            return new User(result.data);
        }
        return false;
    }
    async logout(): Promise<void> {
        Cookies.remove(constants.ACCESS_TOKEN);
        Cookies.remove(constants.REFRESH_TOKEN);
    }
}