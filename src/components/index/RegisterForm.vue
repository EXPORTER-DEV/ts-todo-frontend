<script setup lang="ts">
    import { onMounted, ref, watch, type PropType } from 'vue';
    import type { IMessage } from '../../views/IndexView.vue';
    import IconEyeOf from '~icons/mdi/eye-off';
    import IconEye from '~icons/mdi/eye';

    const props = defineProps({
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        message: Object as PropType<IMessage>
    });

    const firstname = ref<string>(props.firstname ?? "");
    const lastname = ref<string>(props.lastname ?? "");
    const email = ref<string>(props.email ?? "");
    const password = ref<string>(props.password ?? "");

    const passwordHidden = ref<boolean>(true);

    const emit = defineEmits<{
        (e: 'submit', credentials: {
            firstname: string,
            lastname: string,
            email: string,
            password: string,
        }): void,
        (e: 'switchView', link: string): void,
    }>()

    const validated = ref<boolean>(false);

    const submit = () => {
        if(firstname.value.length > 0 && lastname.value.length > 0 && email.value.length > 0 && password.value.length > 0){
            emit('submit', {
                firstname: firstname.value,
                lastname: lastname.value,
                email: email.value,
                password: password.value,
            });
        }else{
            validated.value = true;
        }
    }
</script>
<template>
    <form @submit.prevent="submit" class="needs-validation" v-bind:class="{'was-validated': validated}" novalidate>
        <div class="mb-3">
            <label for="firstname" class="form-label">Your Firstname</label>
            <input type="text" class="form-control" v-model="firstname" id="firstname" required>
        </div>
        <div class="mb-3">
            <label for="lastname" class="form-label">Your Lastname</label>
            <input type="text" class="form-control" v-model="lastname" id="lastname" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Your e-Mail</label>
            <input type="email" class="form-control" v-model="email" id="email" aria-describedby="emailHelp" required>
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
                <span class="input-group-text" @click="passwordHidden = !passwordHidden">
                    <IconEyeOf v-if="passwordHidden !== false"></IconEyeOf>
                    <IconEye v-else></IconEye>
                </span>
                <input :type="passwordHidden === false ? 'text' : 'password'" v-model="password" class="form-control" id="password" required>
            </div>
        </div>
        <div class="mb-3" v-if="message !== undefined">
            <div v-bind:class="{'is-invalid': message.success === false, 'is-valid': message.success === true}"></div>
            <div v-bind:class="{'invalid-feedback': message.success === false, 'valid-feedback': message.success === true}">
                {{message.message}}
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Register!</button>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-link" @click="emit('switchView', 'login')">Login</button>
            </div>
        </div>
    </form>
</template>