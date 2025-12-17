<script setup>
import Task from "./Task.vue"
import { ref, onMounted } from "vue"

const props = defineProps({
    projectId: [Number, String],
})

const tasks = ref(null)
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
    console.log("Backlog projectId = ", props.projectId)

    try {
        const res = await fetch(
            `http://localhost:5000/api/projects/${props.projectId}/tasks`,
        )
        if (!res.ok) {
            throw new Error("Failed to fetch tasks")
        }

        const json = await res.json()
        console.log(json)
        tasks.value = json.data.tasks
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
</script>
<template>
    <div v-if="loading">Loading tasks...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tasks">
        <table>
            <tbody>
                <tr>
                    <th>IN PROGRESS</th>
                    <th>REVIEW</th>
                    <th>DONE</th>
                </tr>
                <tr v-for="task in tasks">
                    <td><Task v-if="task.status === 'DOING'" :task /></td>
                    <td><Task v-if="task.status === 'REVIEW'" :task /></td>
                    <td><Task v-if="task.status === 'DONE'" :task /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
