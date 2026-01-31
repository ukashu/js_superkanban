<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Card from "primevue/card"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Message from "primevue/message"

const router = useRouter()

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const loading = ref(false)

const submitLogin = async () => {
    errorMessage.value = ""
    loading.value = true

    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        })

        const json = await response.json()

        if (!response.ok) {
            errorMessage.value =
                json?.message || json?.error || "Nie udało się zalogować."
            return
        }

        const userId = json.data.user.id
        const token = json.data.token
        const isAdmin = json.data.user.is_admin

        localStorage.setItem("token", token)
        localStorage.setItem("user_id", userId)
        if (isAdmin) localStorage.setItem("is_admin", isAdmin)

        await router.push(`/users/${userId}`)
        location.reload()
    } catch (err) {
        console.error("LOGIN error:", err)
        errorMessage.value = "Server error. Try again later."
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex justify-center items-center min-h-screen">
        <Card class="w-full md:w-25rem">
            <template #title>Login</template>

            <template #content>
                <form @submit.prevent="submitLogin" class="flex flex-col gap-4">
                    <Message
                        v-if="errorMessage"
                        severity="error"
                        :closable="false"
                    >
                        {{ errorMessage }}
                    </Message>

                    <div class="flex flex-col gap-2">
                        <label for="email">Email</label>
                        <InputText
                            id="email"
                            v-model="email"
                            type="email"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <InputText
                            id="password"
                            v-model="password"
                            type="password"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        label="Login"
                        :loading="loading"
                        :disabled="loading"
                    />
                </form>
            </template>
        </Card>
    </div>
</template>
