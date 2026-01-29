<script setup>
import { ref } from "vue"
import InputText from "primevue/inputtext"
import Textarea from "primevue/textarea"
import Button from "primevue/button"
import { authFetch } from "../helpers/helpers.js"

const title = ref("")
const description = ref("")
const message = ref("")

const userId = ref(null)
userId.value = localStorage.getItem("user_id")

async function submitForm() {
    try {
        const res = await authFetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                owner_id: userId.value,
            }),
        })

        const json = await res.json()
        message.value = json.message || "Created!"
        if (res.ok) {
            title.value = ""
            description.value = ""
        }
    } catch (err) {
        console.error(err)
        message.value = "Error creating project"
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <h2 class="text-xl font-bold">Create New Project</h2>

        <div class="flex flex-col gap-2">
            <label for="p-title" class="font-bold">Project Title</label>
            <InputText id="p-title" v-model="title" required />
        </div>

        <div class="flex flex-col gap-2">
            <label for="p-desc" class="font-bold">Description</label>
            <Textarea id="p-desc" v-model="description" rows="3" />
        </div>

        <Button label="Create" @click="submitForm" />

        <p v-if="message" class="text-green-600">{{ message }}</p>
    </div>
</template>

<style scoped></style>
