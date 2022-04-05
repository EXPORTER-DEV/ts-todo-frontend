import { ToastEnum, type IToast } from "./toast.interface";

export class Toast implements IToast {
    id: number;
    timestamp: number;
    body: string;
    type?: ToastEnum | undefined;
    constructor(data?: IToast){
        if(data){
            this.id = +data.id;
            this.timestamp = +data.timestamp;
            this.body = data.body;
            if(data.type !== undefined){
                this.type = data.type;
            }else{
                this.type = ToastEnum.DEFAULT;
            }
        }
    }
}