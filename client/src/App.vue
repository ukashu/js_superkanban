<script setup>
import { ref } from "vue"
import Menubar from "primevue/menubar"
import Button from "primevue/button"
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const userId = ref(null)
const isLoggedIn = ref(false)

const refreshAuth = () => {
  userId.value = localStorage.getItem("user_id")
  isLoggedIn.value = !!localStorage.getItem("token")
}

onMounted(() => {
  refreshAuth()
})

const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user_id")
  refreshAuth()
  router.push("/login")
}

const items = ref([
    {
        label: "User",
        icon: "pi pi-user",
        route: "/users/1",
    },
    {
        label: "Projects",
        icon: "pi pi-folder",
        route: "/users/1/projects",
    },
    {
        label: "Login",
        icon: "pi pi-sign-in",
        route: "/login",
    },
    {
        label: "Register",
        icon: "pi pi-user-plus",
        route: "/register",
    },
])
</script>

<template>
  <nav class="navbar">
    <!-- tylko dla zalogowanych -->
    <RouterLink v-if="isLoggedIn && userId" :to="`/users/${userId}`">Go to User</RouterLink>
    <RouterLink v-else to="/login">Go to User</RouterLink>

    <RouterLink v-if="isLoggedIn && userId" :to="`/users/${userId}/projects`">Go to Project</RouterLink>
    <RouterLink v-else to="/login">Go to Project</RouterLink>

    <!-- tylko dla niezalogowanych -->
    <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    <RouterLink v-if="!isLoggedIn" to="/register">Register</RouterLink>

    <!-- tylko dla zalogowanych -->
    <button v-if="isLoggedIn" @click="logout">Logout</button>
  </nav>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 1rem;
.app-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.app-content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}
</style>
