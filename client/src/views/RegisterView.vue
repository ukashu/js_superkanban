<script setup>
import { ref } from "vue"
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const username = ref("")
const email = ref("")
const password = ref("")

const submitRegister = async () => {
    const payload = {
        username: username.value,
        email: email.value,
        password: password.value,
    }

    console.log("REGISTER payload:", payload)

    try {
        const response = await fetch("/api/session/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        const data = await response.json()
        console.log("REGISTER response:", data)
    } catch (error) {
        console.error("REGISTER error:", error)
    }
}
</script>

<template>
    <div class="flex justify-center items-center min-h-screen">
        <Card class="w-full md:w-25rem">
            <template #title>Register</template>
            <template #content>
                <form @submit.prevent="submitRegister" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="username">Username</label>
                        <InputText id="username" v-model="username" type="text" required />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="email" type="email" required />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <InputText id="password" v-model="password" type="password" required />
                    </div>
                    <Button type="submit" label="Register" />
                </form>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.flex { display: flex; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.min-h-screen { min-height: 100vh; }
.w-full { width: 100%; }
.flex-col { flex-direction: column; }
.gap-4 { gap: 1rem; }
.gap-2 { gap: 0.5rem; }
</style>
