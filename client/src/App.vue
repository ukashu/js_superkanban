<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    router.push("/login")
}
</script>

<template>
    <nav class="navbar">
        <RouterLink to="/users/1">Go to User</RouterLink>
        <RouterLink to="/users/1/projects">Go to Project</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>

        <!-- 🔴 LOGOUT -->
        <button @click="logout">Logout</button>
    </nav>

    <main>
        <RouterView />
    </main>
</template>

<style scoped>
.navbar {
    display: flex;
    gap: 1rem;
}
</style>
