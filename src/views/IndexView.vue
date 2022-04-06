<script setup lang="ts">
    import { inject, ref } from 'vue';
    import LoginFormVue from '../components/index/LoginForm.vue';
    import RegisterForm from '../components/index/RegisterForm.vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { StoreKey } from '../store';
    import { RepositoriesKey, type IRepositories } from '../repositories';
    import { ToastControl } from '../components/toast/toast-control';
    import { ToastEnum } from '../types/toast/toast.interface';
    
    export interface IMessage {
        success: boolean;
        message: string;
    }

    export interface ILoginCredentials {
        email: string;
        password: string;
    }

    export interface IRegisterCredentials {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
    }

    const message = ref<IMessage | undefined>(undefined);

    const currentView = ref<"login" | "register">("login");

    const repositories = inject<IRepositories>(RepositoriesKey);

    const store = useStore(StoreKey);

    const router = useRouter();

    const toastControl = new ToastControl();

    const login = async (credentials: ILoginCredentials): Promise<void> => {
        store.dispatch('setLoadingActive', true);
        message.value = undefined;
        const result = await repositories!.authRepository.login(
            credentials.email, 
            credentials.password
        ).catch((e): false => {
            if(e?.response?.status === 403){
                message.value = { success: false, message: 'Probably already authenticated, try to refresh page.' };
            }
            return false;
        });
        if(result){
            const user = await repositories!.authRepository.getUser();
            if(user !== false){
                store.dispatch('setUser', user);
                toastControl.create({
                    body: `Successfully logged in ${user.email} account.`,
                    type: ToastEnum.SUCCESS,
                });
                router.push('/todo');
            }else{
                message.value = { success: false, message: 'Failed to load user data.' };
            }
        }else {
            if(message.value === undefined){
                message.value = { success: false, message: 'Invalid login credentials.' };
            }
        }
        store.dispatch('setLoadingActive', false);
    }

    const register = async (credentials: IRegisterCredentials): Promise<void> => {
        message.value = undefined;
        const result = await repositories!.authRepository.register(
            credentials.firstname, 
            credentials.lastname, 
            credentials.email,
            credentials.password
        ).catch((e) => {
            if(e?.response?.status === 500){
                message.value = { success: false, message: 'Failed to register.' };
            }
        });
        if(result === true){
            message.value = { success: true, message: `Successfully registered user with email: ${credentials.email}` };
        }else{
            if(message.value === undefined){
                message.value = { success: false, message: 'Incorrect credentials, please check and try register again.' };
            }
        }
    }

    const switchView = (link: string): void => {
        message.value = undefined;
        switch(link){
            case 'register':
                if(!store.getters.isLogined){
                    currentView.value = "register";
                }
                break;
            case 'login':
                currentView.value = "login";
                break;
        }
    }
</script>

<template>
    <div class="container content">
        <div class="center">
            <LoginFormVue v-on:submit="login" v-on:switchView="switchView($event)" v-bind:message="message" v-if="currentView === 'login'" />
            <RegisterForm v-on:submit="register" v-else v-on:switchView="switchView($event)" v-bind:message="message" />
        </div>
    </div>
</template>