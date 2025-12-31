<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import UserKanban from "../components/UserKanban.vue"

const user = ref(null)
const route = useRoute()

onMounted(async () => {
    const userId = route.params.userId

    try {
        const userRes = await fetch(`/api/users/${userId}`)
        // TODO zająć się error handlingiem
        if (userRes.ok) {
            const resJson = await userRes.json()
            if (resJson.success) {
                user.value = resJson.data.user
            }
        }
    } catch (err) {
        console.log({ err })
    }
})
</script>

<template>
    <section v-if="user">
        <h2>Profile</h2>
        <p>Username: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Id: {{ user.user_id }}</p>
    </section>

    <section v-if="user">
        <UserKanban :userId="user.user_id" />
    </section>
</template>
