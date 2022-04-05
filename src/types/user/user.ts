import type { IUser } from "./user.interface";

export class User implements IUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    constructor(data: IUser){
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
    }
}