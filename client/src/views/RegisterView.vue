<script setup>
import { ref } from "vue"
import Card from "primevue/card"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import { useRouter } from "vue-router"

const router = useRouter()

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

    const jsonResponse = await response.json()
    console.log("REGISTER response:", jsonResponse)

    // ✅ jeśli backend zwraca token:
    if (jsonResponse?.data?.token) {
      localStorage.setItem("token", jsonResponse.data.token)
    }

    // ✅ jeśli backend zwraca usera:
    const userId = jsonResponse?.data?.user?.id

    if (!userId) {
      console.error("Brak userId po rejestracji!", jsonResponse)
      return
    }

    localStorage.setItem("user_id", userId)

    // ✅ redirect na /users/<id>
    router.push(`/users/${userId}`)
  } catch (error) {
    console.error("REGISTER error:", error)
  }
}
</script>

<template>
  <h1>Register</h1>

  <form @submit.prevent="submitRegister">
    <input type="text" placeholder="Username" v-model="username" required />

    <input type="email" placeholder="Email" v-model="email" required />

    <input type="password" placeholder="Password" v-model="password" required />

    <button type="submit">Register</button>
  </form>
</template>

<style scoped></style>
