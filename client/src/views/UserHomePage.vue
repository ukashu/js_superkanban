<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Card from "primevue/card"
import UserKanban from "../components/UserKanban.vue"
import UserEdit from "../components/UserEdit.vue"

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
    <div class="flex flex-col gap-4">
        <Card v-if="user" class="mb-4">
            <template #title>Profile</template>
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

        <section v-if="user">
            <UserEdit :user="user" />
        </section>

        <section v-if="user">
            <UserKanban :userId="user.user_id" />
        </section>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}
.flex-col {
    flex-direction: column;
}
.gap-4 {
    gap: 1rem;
}
.gap-2 {
    gap: 0.5rem;
}
.mb-4 {
    margin-bottom: 1rem;
}
.font-bold {
    font-weight: bold;
}
</style>
