<script setup>
import { ref } from "vue"
import Card from "primevue/card"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Textarea from "primevue/textarea"
import Dropdown from "primevue/dropdown"

const props = defineProps({
    task: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(["taskDeleted", "taskUpdated"])

const showDetails = ref(false)
const isEditing = ref(false)

const editedTask = ref({ ...props.task })

const statuses = ["todo", "in_progress", "done"]

const saveEdit = async () => {
    try {
        await fetch(`http://localhost:5000/api/tasks/${editedTask.value.task_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(editedTask.value),
        })

        emit("taskUpdated", editedTask.value)
        isEditing.value = false
    } catch (err) {
        console.error("Błąd edycji taska:", err)
    }
}

const deleteTask = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten task?")) return

    try {
        await fetch(`http://localhost:5000/api/tasks/${props.task.task_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        emit("taskDeleted", props.task.task_id)
    } catch (err) {
        console.error("Błąd usuwania taska:", err)
    }
}
</script>

<template>
    <Card class="task-card mb-4">
        <template #title>
            <div class="flex justify-between items-center">
                <span class="font-bold">{{ task.title }}</span>
                <Button
                    label="Details"
                    size="small"
                    text
                    @click="showDetails = !showDetails"
                />
            </div>
        </template>

        <template #content>
            <p>{{ task.description }}</p>

            <div v-if="showDetails" class="mt-3">
                <!-- VIEW MODE -->
                <div v-if="!isEditing">
                    <p><b>Status:</b> {{ task.status }}</p>
                    <p><b>Assigned:</b> {{ task.assignee_name }}</p>

                    <Button
                        label="Edit"
                        icon="pi pi-pencil"
                        size="small"
                        class="mt-2"
                        @click="isEditing = true"
                    />
                </div>

                <!-- EDIT MODE -->
                <div v-else class="flex flex-col gap-2">
                    <InputText v-model="editedTask.title" />
                    <Textarea v-model="editedTask.description" rows="3" />
                    <Dropdown
                        v-model="editedTask.status"
                        :options="statuses"
                        placeholder="Status"
                    />

                    <div class="flex gap-2 mt-2">
                        <Button label="Save" icon="pi pi-check" @click="saveEdit" />
                        <Button
                            label="Cancel"
                            severity="secondary"
                            @click="isEditing = false"
                        />
                        <Button
                            label="Delete"
                            severity="danger"
                            icon="pi pi-trash"
                            @click="deleteTask"
                        />
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <small class="text-gray-500">
                Assigned to: {{ task.assignee_name }}
            </small>
        </template>
    </Card>
</template>

<style scoped>
.task-card {
    max-width: 600px;
}
</style>
