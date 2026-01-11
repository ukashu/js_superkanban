<script setup>
import { ref } from "vue";
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

const props = defineProps(["projectId"]);
const emit = defineEmits(["refresh"]);

const title = ref("");
const description = ref("");
const message = ref("");

async function createTask() {
    try {
        const res = await fetch(
            `/api/projects/${props.projectId}/tasks`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.value,
                    description: description.value,
                }),
            },
        );

        const json = await res.json();
        message.value = json.message || "Task created!";
        title.value = "";
        description.value = "";
        emit("refresh");
    } catch (err) {
        console.log("Error creating task: ", err);
        message.value = "Error creating task";
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label for="title" class="font-bold">Title</label>
            <InputText id="title" v-model="title" required />
        </div>

        <div class="flex flex-col gap-2">
            <label for="description" class="font-bold">Description</label>
            <Textarea id="description" v-model="description" rows="5" />
        </div>

        <Button label="Create Task" @click="createTask" />

        <p v-if="message" class="text-green-600">{{ message }}</p>
    </div>
</template>

<style scoped>
.flex { display: flex; }
.flex-col { flex-direction: column; }
.gap-4 { gap: 1rem; }
.gap-2 { gap: 0.5rem; }
.font-bold { font-weight: bold; }
.text-green-600 { color: #059669; }
</style>
