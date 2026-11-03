<template>
    <div
        class="card p-3"
        style="max-width: 460px;"
    >
        <div class="card-body" :class="{'loading': loading}">
            <header class="mb-4">
                <div
                    v-if="$slots.header"
                    class="mb-3"
                >
                    <slot name="header" />
                </div>
                <h2 class="fw-bold card-title">
                    {{ t('login.title') }}
                </h2>
            </header>

            <form
                @submit.stop.prevent="submit"
                class="d-flex flex-column gap-2 needs-validation"
                :class="{ 'was-validated': validated }"
                novalidate
            >
                <div>
                    <label
                        for="username"
                        class="mb-1 d-flex flex-row align-items-center gap-2 text-secondary fw-bold"
                    >
                        <FontAwesomeIcon :icon="faUser" />
                        {{ t('login.email_or_nick') }}
                    </label>

                    <input
                        id="username"
                        type="text"
                        class="form-control"
                        name="username"
                        v-model="username"
                        :disabled="loading"
                        autocomplete="username"
                        required
                        autofocus
                    >
                    <div class="invalid-feedback">
                        {{ t('validation.field_is_required') }}
                    </div>
                </div>

                <div>
                    <label
                        for="password"
                        class="mb-1 d-flex flex-row align-items-center gap-2 text-secondary fw-bold"
                    >
                        <FontAwesomeIcon :icon="faLock" />
                        {{ t('login.password') }}
                    </label>

                    <input
                        id="password"
                        type="password"
                        class="form-control"
                        v-model="password"
                        :disabled="loading"
                        name="password"
                        autocomplete="current-password"
                        required
                    >
                    <div class="invalid-feedback">
                        {{ t('validation.field_is_required') }}
                    </div>
                </div>

                <Alert
                    class="mt-3"
                    v-if="errorMessage"
                    type="error"
                    :message="errorMessage"
                />

                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <div
                            class="checkbox"
                            v-if="showRememberMe"
                        >
                            <label>
                                <input
                                    id="remember-me"
                                    class="form-check-input me-2"
                                    type="checkbox"
                                    name="remember"
                                    :disabled="loading"
                                    v-model="stayLoggedIn"
                                >
                                <label
                                    class="form-check-label user-select-none clickable cursor-pointer"
                                    for="remember-me"
                                >
                                    {{ t('login.remember_me') }}
                                </label>
                            </label>
                        </div>
                    </div>
                    <XButton
                        :loading="loading"
                        type="submit"
                        :button-class="'primary'"
                        style="min-width: 100px"
                        :class="{ 'w-100': !showRememberMe }"
                    >
                        {{ t('login.submit') }}
                    </XButton>
                </div>
            </form>
        </div>
    </div>
</template>

<script
    lang='ts'
    setup
>
    import {
        computed,
        ref
    } from 'vue';

    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import {
        faLock,
        faUser,
    } from '@fortawesome/free-solid-svg-icons';

    import Alert from '@/components/Notifications/Alert/Alert.vue';
    import XButton from '@/components/Button/XButton/XButton.vue';
    import { useGlobalI18n } from '@/composables/global-i18n'

    const { t } = useGlobalI18n();

    const props = withDefaults(defineProps<{
        action: Function,
        showRememberMe?: boolean,
    }>(), {
        showRememberMe: false
    });

    const emit = defineEmits([
        'success',
    ]);

    const username = ref('');
    const password = ref('');
    const stayLoggedIn = ref(false);
    const validated = ref(false);
    const errorMessage = ref('');
    const loading = ref(false);

    const submit = async (event: Event) => {
        if (loading.value) {
            return;
        }
        const form: HTMLFormElement = event.currentTarget as HTMLFormElement;
        validated.value = true;
        console.log("FORM SUBMIT", form.checkValidity(), form);
        if (form.checkValidity()) {
            loading.value = true;
            setInterval(() => {
                console.log("LOADING", loading.value);
            }, 100);
            try {
                await login();
            } finally {
                console.log("RESET LOADING");
                loading.value = false;
            }
        }
    };

    const login = async () => {
        const params: {
            username: string,
            password: string,
            stayLoggedIn?: boolean
        } = {
            username: username.value,
            password: password.value,
        };

        if (props.showRememberMe) {
            params['stayLoggedIn'] = stayLoggedIn.value;
        }
        try {
            await props.action(params)
            emit('success');
        } catch (error: any) {
            console.log(error)
            errorMessage.value = error?.message ?? error;
        };
    };
</script>