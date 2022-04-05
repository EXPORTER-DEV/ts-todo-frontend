export interface IUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

export type UserType = IUser | false;