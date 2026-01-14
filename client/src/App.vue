<script setup>
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
</script>

<template>
  <nav class="navbar">
    <RouterLink v-if="isLoggedIn && userId" :to="`/users/${userId}`">Go to User</RouterLink>
    <RouterLink v-else to="/login">Go to User</RouterLink>

    <RouterLink v-if="isLoggedIn && userId" :to="`/users/${userId}/projects`">Go to Project</RouterLink>
    <RouterLink v-else to="/login">Go to Project</RouterLink>

    <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
    <RouterLink v-if="!isLoggedIn" to="/register">Register</RouterLink>

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
}
</style>
