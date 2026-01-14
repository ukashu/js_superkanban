<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Card from "primevue/card"
import InputText from "primevue/inputtext"
import Button from "primevue/button"

const router = useRouter()
const email = ref("")
const password = ref("")

const submitLogin = async () => {
    const payload = {
        email: email.value,
        password: password.value,
    }

    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        const jsonResponse = await response.json()

        const userId = jsonResponse.data.user.id
        const token = jsonResponse.data.token

        localStorage.setItem("token", token)
        localStorage.setItem("user_id", userId)

        await router.push(`/users/${userId}`)
        location.reload()
    } catch (error) {
        console.error("LOGIN error:", error)
    }
}
</script>

<template>
    <div class="flex justify-center items-center min-h-screen">
        <Card class="w-full md:w-25rem">
            <template #title>Login</template>
            <template #content>
                <form @submit.prevent="submitLogin" class="flex flex-col gap-4">
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

                    <Button type="submit" label="Login" />
                </form>
            </template>
        </Card>
    </div>
</template>
