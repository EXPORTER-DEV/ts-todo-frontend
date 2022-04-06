<script setup lang="ts">
	import { computed } from '@vue/reactivity';
	import { inject, onMounted, ref } from 'vue';
	import { useStore } from 'vuex';
	import { ToastControl } from '../components/toast/toast-control';
	import { RepositoriesKey, type IRepositories } from '../repositories';
	import { StoreKey } from '../store';
	import { ToastEnum } from '../types/toast/toast.interface';
	import type { Todo } from '../types/todo/todo';
	import moment from 'moment';

	import IconCircleOutline from '~icons/mdi/circle-outline';
	import IconCheckboxCircle from '~icons/mdi/checkbox-multiple-marked-circle';
	import CreateTodo from '../components/todo/CreateTodo.vue';

	moment.locale('en');
	
	const store = useStore(StoreKey);
	const repositories = inject<IRepositories>(RepositoriesKey);

	const loaded = ref<boolean>(false);
	const todoList = ref<Todo[]>([]);

	const toastControl = new ToastControl();

	const load = async () => {
		store.dispatch('setLoadingActive', true);
		const items = await repositories!.todoRepository.fetch()
			.catch((e): false => {
				toastControl.create({
					body: 'Failed load todo list',
					type: ToastEnum.FAILED,
				})
				return false;
			});
		if(items !== false){
			loaded.value = true;
			todoList.value = items;
		}
		store.dispatch('setLoadingActive', false);
	}

	const setCompleted = async (id: number, state: boolean = true) => {
		const result = await repositories!.todoRepository.setCompleted(id, state)
			.catch((e) => {
				toastControl.create({
					body: 'Failed to update todo',
					type: ToastEnum.FAILED,
				})
			});
		if(result === true){
			const item = todoList.value.find((item) => item.id === id);
			if(item !== undefined){
				item.completed = state;
				toastControl.create({
					body: `Task marked as ${state === true ? 'completed' : 'uncompleted'}.`,
					type: ToastEnum.SUCCESS,
				})
			}
		}
	}

	const formatTimestamp = (timestamp: number): string => {
		return moment(timestamp).format('Do MMMM YYYY HH:mm');
	}

	const createdTodo = (todo: Todo) => {
		todoList.value.push(todo);
	}

	const completed = computed<Todo[]>(() => todoList.value.filter((item) => item.completed === true));
	const active = computed<Todo[]>(() => todoList.value.filter((item) => item.completed === false && item.scheduled === null));
	const scheduled = computed<Todo[]>(() => todoList.value.filter((item) => item.completed === false && item.scheduled !== null));

	onMounted(() => load());

</script>

<template>
	<div class="container content" v-show="loaded">
		<div class="body">
			<h3>Active ({{active.length}})</h3>
			<br>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Completed</th>
						<th scope="col">Content</th>
						<th scope="col">Created at</th>
					</tr>
				</thead>
				<tbody v-if="active.length > 0">
					<tr v-for="item in active">
						<th class="clickable" @click="setCompleted(item.id, true)"><IconCircleOutline></IconCircleOutline></th>
						<td>{{item.content}}</td>
						<td class="text-muted">{{formatTimestamp(item.created_at)}}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<th colspan="3" class="text-center fs-6 text fw-light">No active todos.</th>
					</tr>
				</tbody>
			</table>
			<h3>Scheduled ({{scheduled.length}})</h3>
			<br>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Completed</th>
						<th scope="col">Content</th>
						<th scope="col">Scheduled at</th>
					</tr>
				</thead>
				<tbody v-if="scheduled.length > 0">
					<tr v-for="item in scheduled">
						<th class="clickable" @click="setCompleted(item.id, true)"><IconCircleOutline></IconCircleOutline></th>
						<td>{{item.content}}</td>
						<td class="text-muted">{{formatTimestamp(item.scheduled)}}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<th colspan="3" class="text-center fs-6 text fw-light">No scheduled todos.</th>
					</tr>
				</tbody>
			</table>
			<h3>Completed ({{completed.length}})</h3>
			<br>
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Completed</th>
						<th scope="col">Content</th>
						<th scope="col">Completed at</th>
					</tr>
				</thead>
				<tbody v-if="completed.length > 0">
					<tr v-for="item in completed">
						<th class="clickable" @click="setCompleted(item.id, false)"><IconCheckboxCircle></IconCheckboxCircle></th>
						<td>{{item.content}}</td>
						<td class="text-muted">{{formatTimestamp(item.created_at)}}</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<th colspan="3" class="text-center fs-6 text fw-light">No completed todos.</th>
					</tr>
				</tbody>
			</table>
		</div>
		<CreateTodo @created="createdTodo"></CreateTodo>
	</div>
</template>

<style lang="scss">
	.clickable {
		cursor: pointer;
	}
</style>