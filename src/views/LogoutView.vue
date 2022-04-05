<script setup lang="ts">
    import { inject, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { RepositoriesKey, type IRepositories } from '../repositories';
    import { StoreKey } from '../store';
    
    const repositories = inject<IRepositories>(RepositoriesKey);
    const router = useRouter();
    const store = useStore(StoreKey);

    onMounted(async () => {
        store.dispatch('setUser', false);
        await repositories!.authRepository.logout();
        router.push('/');
    });
</script>
<template></template>