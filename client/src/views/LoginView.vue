<script setup>
import { ref } from "vue"

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
        localStorage.setItem('token', jsonResponse.data.token)
        console.log("LOGIN response:", jsonResponse)
    } catch (error) {
        console.error("LOGIN error:", error)
    }
}
</script>

<template>
    <h1>Login</h1>

    <form @submit.prevent="submitLogin">
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

        <button type="submit">Login</button>
    </form>
</template>
