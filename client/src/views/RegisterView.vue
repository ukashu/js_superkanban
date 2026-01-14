<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import Card from "primevue/card"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import Button from "primevue/button"
import Message from "primevue/message"

const router = useRouter()

const username = ref("")
const email = ref("")
const password = ref("")
const loading = ref(false)
const errorMsg = ref("")

const submitRegister = async () => {
  errorMsg.value = ""
  loading.value = true

  const payload = {
    username: username.value,
    email: email.value,
    password: password.value,
  }

  try {
    const response = await fetch("/api/session/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const jsonResponse = await response.json()

    if (!response.ok) {
      errorMsg.value =
        jsonResponse?.message ||
        jsonResponse?.error ||
        "Nie udało się utworzyć konta."
      return
    }

    // token (jeśli backend zwraca)
    if (jsonResponse?.data?.token) {
      localStorage.setItem("token", jsonResponse.data.token)
    }

    const userId = jsonResponse?.data?.user?.id
    if (!userId) {
      errorMsg.value = "Rejestracja udana, ale brak userId w odpowiedzi backendu."
      return
    }

    localStorage.setItem("user_id", userId)

    await router.push(`/users/${userId}`)
    location.reload()
  } catch (error) {
    console.error("REGISTER error:", error)
    errorMsg.value = "Błąd połączenia z serwerem."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <template #title>Rejestracja</template>
      <template #subtitle>Załóż konto i zacznij korzystać z aplikacji</template>

      <template #content>
        <form @submit.prevent="submitRegister" class="flex flex-col gap-4">
          <Message v-if="errorMsg" severity="error" :closable="false">
            {{ errorMsg }}
          </Message>

          <div class="flex flex-col gap-2">
            <label for="username" class="font-medium">Nazwa użytkownika</label>
            <InputText
              id="username"
              v-model="username"
              placeholder="np. ula123"
              autocomplete="username"
              required
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="font-medium">Email</label>
            <InputText
              id="email"
              v-model="email"
              placeholder="np. ula@gmail.com"
              type="email"
              autocomplete="email"
              required
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-medium">Hasło</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Wpisz hasło"
              toggleMask
              :feedback="true"
              inputClass="w-full"
              class="w-full"
              autocomplete="new-password"
              required
            />
          </div>

          <Button
            type="submit"
            label="Zarejestruj"
            icon="pi pi-user-plus"
            :loading="loading"
            class="w-full"
          />

          <div class="text-center text-sm opacity-80">
            Masz już konto?
            <RouterLink to="/login" class="text-primary font-medium">
              Zaloguj się
            </RouterLink>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
