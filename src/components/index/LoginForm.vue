<script setup lang="ts">
    import { onMounted, ref, watch, type PropType } from 'vue';
    import type { IMessage } from '../../views/IndexView.vue';
    import IconEyeOf from '~icons/mdi/eye-off';
    import IconEye from '~icons/mdi/eye';
    
    const props = defineProps({
        email: String,
        password: String,
        message: Object as PropType<IMessage>,
    });

    const email = ref<string>(props.email ?? "");
    const password = ref<string>(props.password ?? "");

    const passwordHidden = ref<boolean>(true);

    const emit = defineEmits<{
        (e: 'submit', credentials: {
            email: string,
            password: string
        }): void,
        (e: 'update:email', value: string): void,
        (e: 'update:password', value: string): void,
        (e: 'switchView', link: string): void,
    }>()

    const validated = ref<boolean>(false);

    const submit = () => {
        if(email.value.length > 0 && password.value.length > 0){
            emit('submit', {
                email: email.value,
                password: password.value,
            });
        }else{
            validated.value = true;
        }
    }

    watch([email, password], ([newEmail, newPassword]) => {
        emit('update:email', newEmail);
        emit('update:password', newPassword);
        validated.value = false;
    });

    const emailInput = ref<HTMLInputElement | null>(null);

    onMounted(() => {
        if(emailInput.value !== null){
            emailInput.value.focus();
        }
    });

</script>
<template>
    <form @submit.prevent="submit" class="needs-validation" v-bind:class="{'was-validated': validated}" novalidate>
        <div class="mb-3">
            <label for="email" class="form-label">e-Mail</label>
            <input type="email" ref="emailInput" class="form-control" id="email" v-model="email" required>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
                <span class="input-group-text" @click="passwordHidden = !passwordHidden" required>
                    <IconEyeOf v-if="passwordHidden !== false"></IconEyeOf>
                    <IconEye v-else></IconEye>
                </span>
                <input :type="passwordHidden === false ? 'text' : 'password'" v-model="password" class="form-control" id="password" required>
            </div>
        </div>
        <div class="mb-3" v-if="message !== undefined">
            <div class="is-invalid" v-if="message.success !== true"></div>
            <div class="invalid-feedback">
                {{message.message}}
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
                <button type="submit" class="btn btn-primary">Login!</button>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-link" @click="emit('switchView', 'register')">Register</button>
            </div>
        </div>
    </form>
</template>