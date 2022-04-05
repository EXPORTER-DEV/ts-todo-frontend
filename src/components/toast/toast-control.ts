import { store } from "../../store";
import { Toast } from "../../types/toast/toast";
import type { IToastCreation } from "../../types/toast/toast.interface";

export class ToastControl {
    create(data: IToastCreation){
        const duration = data.duration ?? 15000;
        const id = Math.random();
        const toast = new Toast({
            id,
            timestamp: Date.now(),
            body: data.body,
            type: data.type,
        });
        store.dispatch('addToast', toast);
        setTimeout(() => store.dispatch('removeToast', id), duration);
    }
    remove(id: number){
        store.dispatch('removeToast', id);
    }
}