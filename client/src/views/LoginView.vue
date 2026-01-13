<script setup>
import { ref } from "vue"
import Card from "primevue/card"
import InputText from "primevue/inputtext"
import Button from "primevue/button"

const email = ref("")
const password = ref("")

const submitLogin = async () => {
    const payload = {
        email: email.value,
        password: password.value,
    }

    console.log("LOGIN payload:", payload)

    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        const jsonResponse = await response.json()
        localStorage.setItem("token", jsonResponse.data.token)
        localStorage.setItem("user_id", jsonResponse.data.user.id)
        console.log("LOGIN response:", jsonResponse)
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

<style scoped></style>
