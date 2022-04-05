export enum ToastEnum {
    SUCCESS = 'success',
    FAILED = 'failed',
    DEFAULT = 'default',
}

export interface IToast {
    id: number;
    timestamp: number;
    header?: string;
    body: string;
    type?: ToastEnum; 
}

export interface IToastButton {

}

export interface IToastCreation {
    body: string;
    type: ToastEnum;
    duration?: number;
}