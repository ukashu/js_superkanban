<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Card from "primevue/card"
import UserKanban from "../components/UserKanban.vue"
import UserEdit from "../components/UserEdit.vue"

const user = ref(null)
const route = useRoute()

onMounted(async () => {
    console.log("UserHomePage current route:", route.fullPath)
    console.log("UserHomePage params:", route.params)
    const userId = route.params.userId
    console.log("UserHomePage userId:", userId)

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

const onUserUpdated = (updatedUser) => {
    user.value = { ...user.value, ...updatedUser }
}
</script>

<template>
    <div class="flex flex-col h-full min-h-0 gap-4">
        <Card v-if="user" class="mb-4">
            <template #title>
                <div class="flex items-center justify-center gap-2">
                    Profile
                    <UserEdit :user="user" @user-updated="onUserUpdated" />
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <div>
                        <span class="font-bold">Username:</span> {{ user.name }}
                    </div>
                    <div>
                        <span class="font-bold">Email:</span> {{ user.email }}
                    </div>
                    <div>
                        <span class="font-bold">Id:</span> {{ user.user_id }}
                    </div>
                </div>
            </template>
        </Card>

        <UserKanban v-if="user" :userId="user.user_id" />
    </div>
</template>

<style scoped></style>
