<script setup>
import { ref } from "vue"

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
    <h1>Register</h1>

    <form @submit.prevent="submitRegister">
        <input
            type="text"
            placeholder="Username"
            v-model="username"
            required
        />

        <input
            type="email"
            placeholder="Email"
            v-model="email"
            required
        />

        <input
            type="password"
            placeholder="Password"
            v-model="password"
            required
        />

        <button type="submit">Register</button>
    </form>
</template>
