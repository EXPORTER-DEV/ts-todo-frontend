import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import type { Toast } from '../types/toast/toast';
import type { IUser, UserType } from '../types/user/user.interface'

// define your typings for the store state
export interface State {
    user: UserType;
    menuActive: boolean;
    loadingActive: boolean;
    loadingNavigationActive: boolean;
    toasts: Toast[];
}

// define injection key
export const StoreKey: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        user: false,
        menuActive: false,
        loadingActive: false,
        loadingNavigationActive: true,
        toasts: [],
    },
    getters: {
        isLogined(state): boolean {
            return state.user !== false;
        },
        isMenuActive(state): boolean {
            return state.menuActive;
        },
        isLoadingActive(state): boolean {
            return state.loadingActive || state.loadingNavigationActive;
        },
        toasts(state): Toast[] {
            return state.toasts;
        }
    },
    mutations: {
        setUser(state, user: UserType){
            state.user = user;
        },
        setMenuActive(state, menuActive: boolean){
            state.menuActive = menuActive;
        },
        setLoadingActive(state, loadingActive: boolean){
            state.loadingActive = loadingActive;
        },
        setLoadingNavigationActive(state, loadingNavigationActive: boolean){
            state.loadingNavigationActive = loadingNavigationActive;
        },
        addToast(state, toast: Toast){
            state.toasts.push(toast);
        },
        removeToast(state, id: number){
            state.toasts = state.toasts.filter((item) => item.id !== id);
        }
    },
    actions: {
        setUser({commit}, user: UserType){
            commit('setUser', user);
        },
        setMenuActive({commit}, menuActive: boolean){
            commit('setMenuActive', menuActive);
        },
        setLoadingActive({commit}, loadingActive: boolean){
            commit('setLoadingActive', loadingActive);
        },
        setLoadingNavigationActive({commit}, loadingNavigationActive: boolean){
            commit('setLoadingNavigationActive', loadingNavigationActive);
        },
        addToast({commit}, toast: Toast){
            commit('addToast', toast);
        },
        removeToast({commit}, toastId: number){
            commit('removeToast', toastId);
        }
    }
})