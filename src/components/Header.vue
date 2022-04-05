<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useStore } from 'vuex';
    import { StoreKey } from '../store';
    import type { UserType } from '../types/user/user.interface';
    import IconLogout from '~icons/mdi/logout-variant';

    interface menuItem {
        name: string;
        link: string; 
        linkName: string;
        authenticated?: boolean;
        current?: boolean;
    }

    const store = useStore(StoreKey);
    const router = useRouter();
    
    const isMenuActive = computed<boolean>(() => store.getters.isMenuActive);
    const setMenuActive = (status: boolean) => {
        store.dispatch('setMenuActive', status);
    }

    const isAuthenticated = computed<boolean>(() => store.getters.isLogined);
    const user = computed<UserType>(() => store.state.user);

    const menuItems = computed<menuItem[]>((): menuItem[] => {
        const items: menuItem[] = [
            {
                name: 'Index',
                link: '/',
                linkName: 'index',
                authenticated: false,
            },
            {
                name: 'About',
                link: '/about',
                linkName: 'about',
            },
            {
                name: 'Todo list',
                link: '/todo',
                authenticated: true,
                linkName: 'todo',
            }
        ];
        return items.map((item) => {
            if(router.currentRoute.value.name === item.linkName){
                item.current = true;
            }else{
                item.current = false;
            }
            return item;
        }).filter((item) => {
            if(item.authenticated === true && isAuthenticated.value !== true){
                return false;
            }else if(item.authenticated === false && isAuthenticated.value === true){
                return false;
            }
            return true;
        });
    });

    const isUserDropdownActive = ref<boolean>(false);
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Todo App</a>
        <button class="navbar-toggler" @click="setMenuActive(!isMenuActive)" type="button" data-bs-toggle="collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" v-bind:class="{collapse: !isMenuActive}">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li v-for="item in menuItems">
              <a class="nav-link" v-bind:class="{active: item.current}" aria-current="page" v-bind:href="item.link" @click.prevent="router.push(item.link)">{{item.name}}</a>
            </li>
            <li class="nav-item dropdown" v-if="isAuthenticated && user !== false">
                <a class="nav-link dropdown-toggle" href="#" @click.prevent="isUserDropdownActive = !isUserDropdownActive" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{user.email}}
                </a>
                <div class="dropdown-menu" v-bind:class="{show: isUserDropdownActive}" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item">{{user.firstname}} {{user.lastname}}</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="/logout" @click.prevent="router.push('/logout')"><IconLogout></IconLogout> Log out</a>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>