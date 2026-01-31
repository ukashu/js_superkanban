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
    changeStatus: {
        type: Function,
        required: false,
    },
})

const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

const emit = defineEmits(["taskDeleted", "taskUpdated", "refresh"])

const showDetails = ref(false)
const isEditing = ref(false)

const editedTask = ref({ ...props.task })

const statuses = ["todo", "in_progress", "done"]

const saveEdit = async () => {
    try {
        console.log({ edited: editedTask.value })
        await fetch(
            `http://localhost:5000/api/projects/${editedTask.value.project_id}/tasks/${editedTask.value.task_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(editedTask.value),
            },
        )

        emit("refresh")
        isEditing.value = false
    } catch (err) {
        console.error("Błąd edycji taska:", err)
    }
}

const deleteTask = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten task?")) return

    try {
        await fetch(
            `http://localhost:5000/api/projects/${editedTask.value.project_id}/tasks/${props.task.task_id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        )

        emit("refresh")
    } catch (err) {
        console.error("Błąd usuwania taska:", err)
    }
}
</script>

<template>
    <Card class="task-card mb-4">
        <template #title>
            <div class="flex justify-between items-center">
                <span class="sm:text-lg font-bold">{{ task.title }}</span>
                <div>
                    <p class="ml-auto text-sm sm:hidden">
                        {{ task.status }}
                    </p>
                    <Button
                        label="Details"
                        size="small"
                        text
                        @click="showDetails = !showDetails"
                    />
                </div>
            </div>
        </template>

        <template #content>
            <p
                class="m-0 text-gray-700"
                :title="formatDateTime(task.assignment_date)"
            >
                {{ formatDate(task.assignment_date) }}
            </p>

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
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            @click="saveEdit"
                        />
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
            <div class="flex items-between justify-around sm:hidden">
                <Button
                    label="DOING"
                    class="DOING"
                    @click="changeStatus(task, 'DOING')"
                />
                <Button
                    label="REVIEW"
                    class="REVIEW"
                    @click="changeStatus(task, 'REVIEW')"
                />
                <Button
                    label="DONE"
                    class="DONE"
                    @click="changeStatus(task, 'DONE')"
                />
            </div>
        </template>
    </Card>
</template>

<style scoped>
.DOING {
    background-color: #ebf8ff;
    color: #2c5282;
}
.REVIEW {
    background-color: #fffff0;
    color: #744210;
}
.DONE {
    background-color: #f0fff4;
    color: #276749;
}
.task-card {
    max-width: 600px;
}
</style>
