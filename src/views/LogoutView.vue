<script setup lang="ts">
    import { inject, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { RepositoriesKey, type IRepositories } from '../repositories';
    import { StoreKey } from '../store';
    import { ToastControl } from '../components/toast/toast-control';
    import { ToastEnum } from '../types/toast/toast.interface';
    
    const repositories = inject<IRepositories>(RepositoriesKey);
    const router = useRouter();
    const store = useStore(StoreKey);

    const toastControl = new ToastControl();

    onMounted(async () => {
        store.dispatch('setUser', false);
        await repositories!.authRepository.logout();
        toastControl.create({
            body: `Successfully logged out.`,
            type: ToastEnum.SUCCESS,
        });
        router.push('/');
    });
</script>
<template></template>