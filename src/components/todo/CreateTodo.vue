<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
    import moment from 'moment';
    import IconPlus from '~icons/mdi/plus';
	import IconUpdate from '~icons/mdi/update';
    import { ToastControl } from '../toast/toast-control';
    import { ToastEnum } from '../../types/toast/toast.interface';
    import { RepositoriesKey, type IRepositories } from '../../repositories';
    import type { Todo } from '../../types/todo/todo';

    const isScheduled = ref<boolean>(false);

    const content = ref<string>('');
    const scheduled = ref<string>('');

    const validated = ref<boolean>(false);

    const toastControl = new ToastControl();
    const repositories = inject<IRepositories>(RepositoriesKey);

    const emit = defineEmits<{
        (e: 'created', item: Todo): void,
    }>();

    watch([content, scheduled], ([newContent, newScheduled]) => {
        validated.value = false;
    });

    watch(isScheduled, () => {
        scheduled.value = '';
    });

    const submit = async () => {
        if(content.value.length > 0 && (!isScheduled.value || scheduled.value.length > 0)){
            const scheduledTimestamp: undefined | number = isScheduled.value ? parseScheduled(scheduled.value) : undefined;
            const now = moment().seconds(0).valueOf();
            if(scheduledTimestamp !== undefined && scheduledTimestamp < now){
                toastControl.create({
					body: `Scheduled date should be in future.`,
					type: ToastEnum.FAILED,
				});
                return;
            }
            const result = await repositories!.todoRepository.create(content.value, scheduledTimestamp)
                .catch((e): false => {
                    toastControl.create({
                        body: `Failed to create new task.`,
                        type: ToastEnum.FAILED,
                    }); 
                    return false;
                });
            if(result !== false){
                toastControl.create({
                    body: `Successfully created new task.`,
                    type: ToastEnum.SUCCESS,
                });
                emit('created', result);
                content.value = '';
                scheduled.value = '';
                isScheduled.value = false;
            }
        }else{
            validated.value = true;
        }
    }

    const calculateMinScheduled = () => {
        minScheduled.value = moment().add(1, 'minute').format('YYYY-MM-DDTHH:mm');
    }

    const parseScheduled = (scheduled: string): number => {
        return moment(scheduled, 'YYYY-MM-DDTHH:mm').seconds(0).valueOf();
    }

    const minScheduled = ref<string>('');

    const interval = ref<any>();

    onMounted(() => {
        calculateMinScheduled();
        interval.value = setInterval(() => {
            calculateMinScheduled();
        }, 1000);
    });

    onUnmounted(() => {
        if(interval.value){
            clearInterval(interval.value);
        }
    })



</script>
<template>
    <form class="control needs-validation" v-bind:class="{'was-validated': validated}" @submit.prevent="submit" novalidate>
        <div class="input-group">
            <span class="input-group-text clickable" @click="submit"><IconPlus></IconPlus></span>
            <input type="text" class="form-control" v-model="content" placeholder="Create new task" required>
            <span class="input-group-text clickable" @click="isScheduled = !isScheduled"><IconUpdate></IconUpdate></span>
            <input v-show="isScheduled" type="datetime-local" v-model="scheduled" class="form-control" placeholder="Schedule task" required v-bind:min="minScheduled">
        </div>
    </form>
</template>