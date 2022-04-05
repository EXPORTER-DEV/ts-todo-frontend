<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { useStore } from 'vuex';
    import { StoreKey } from '../../store';
    import type { Toast } from '../../types/toast/toast';
    import { ToastEnum } from '../../types/toast/toast.interface';
    import { ToastControl } from './toast-control';

    const store = useStore(StoreKey);
    const toastControl = new ToastControl();
    
    const items = computed<Toast[]>(() => store.getters.toasts);

    const toastClass = (type?: ToastEnum): Record<string, boolean> => {
        switch(type){
            case ToastEnum.FAILED:
                return {
                    'bg-danger': true,
                    'text-light': true,
                };
            case ToastEnum.SUCCESS:
                return {
                    'bg-success': true,
                    'text-light': true,
                };
            default:
                return {
                    'bg-info': true,
                };
        }
    }
</script>
<template>
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div v-for="item in items" v-bind:key="item.id" v-bind:class="toastClass(item.type)" style="display: block;" class="toast" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    {{item.body}}
                </div>
                <button type="button" class="btn-close me-2 m-auto" aria-label="Close" @click="toastControl.remove(item.id)"></button>
            </div>
        </div>
    </div>
</template>