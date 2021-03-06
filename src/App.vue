<script setup lang="ts">
	import { RouterView, useRouter } from 'vue-router';
	import { computed, onMounted, provide, ref, type ComputedRef, type Ref } from 'vue';
	import { useStore } from 'vuex';
	import './assets/base.scss';
	import { StoreKey } from './store';
	import { AuthRepository } from './repositories/auth/auth';
	import Header from './components/Header.vue';
	import Cookies from 'js-cookie';
	import { constants } from './constants';
	import { repositories, RepositoriesKey } from './repositories';
	import Loader from './components/Loader.vue';
	import ToastList from './components/toast/ToastList.vue';
	import { ToastControl } from './components/toast/toast-control';
	import { ToastEnum } from './types/toast/toast.interface';

	provide(RepositoriesKey, repositories());

	const router = useRouter();
	const store = useStore(StoreKey);

  	router.beforeEach((to, from) => {
		store.dispatch('setLoadingNavigationActive', true);
		store.dispatch('setMenuActive', false);
		if(to.matched.length === 0){
			return {
				name: 'about',
			}
		}
		if(to.meta?.authenticated === undefined){
			return true;
		}else if(to.meta?.authenticated === true && isAuthenticated.value){
			return true;
		}else if(to.meta?.authenticated === false && !isAuthenticated.value){
			return true;
		}else{
			return {
				name: 'about',
			}
		}
  	});

	router.afterEach((to, from) => {
		store.dispatch('setLoadingNavigationActive', false);
	});

	const isAuthenticated = computed<boolean>(() => store.getters.isLogined);
	const authRepository = new AuthRepository();

	const isLoadingActive = computed<boolean>(() => store.getters.isLoadingActive);

	const toastControl = new ToastControl();
	
	onMounted(async () => {
		const access = Cookies.get(constants.ACCESS_TOKEN);
		if(access !== undefined){
			const user = await authRepository.getUser().catch(async (e) => {
				toastControl.create({
					body: 'Failed to load user info, please login again.',
					type: ToastEnum.FAILED,
				});
				await authRepository.logout();
				return false;
			});
			if(user !== false){
				store.dispatch('setUser', user);
				router.push('/todo');
			}
		}
	});
</script>

<template>
  <div class="wrapper">
    <Header></Header>
	<RouterView />
	<Loader v-show="isLoadingActive"></Loader>
	<ToastList></ToastList>
  </div>
</template>

<style lang="scss">
	#app {
		margin: 0 auto;
		font-weight: normal;
		display: flex;
		flex-direction: column;
		height: 100vh;
		> .wrapper {
			display: flex;
			flex-direction: column;
			height: 100%;
			> .content {
				padding: 5px;
				margin-top: auto;
				margin-bottom: auto;
				display: flex;
				overflow-y: auto;
				overflow-x: hidden;
				// justify-content: center;
				flex-direction: column;
				> .center {
					display: flex;
					align-self: center;
				}
				> .body {
					display: flex;
					flex-direction: column;
					overflow-y: auto;
				}
				> .control {
					padding: 15px 5px;
				}
			}
		}
	}
</style>
