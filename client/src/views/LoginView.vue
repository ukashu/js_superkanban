<script setup>
import { ref } from "vue"
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

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
                        <InputText id="email" v-model="email" type="email" required />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <InputText id="password" v-model="password" type="password" required />
                    </div>
                    <Button type="submit" label="Login" />
                </form>
            </template>
        </Card>
    </div>
</template>

<style scoped>
/* Utility classes if PrimeFlex is not available, or I can rely on plain CSS */
.flex { display: flex; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.min-h-screen { min-height: 100vh; }
.w-full { width: 100%; }
.flex-col { flex-direction: column; }
.gap-4 { gap: 1rem; }
.gap-2 { gap: 0.5rem; }
/* PrimeVue often uses PrimeFlex, but I will include basic CSS here to be safe since I didn't install PrimeFlex */
</style>
