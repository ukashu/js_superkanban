<script setup>
import Task from "./Task.vue"
import { ref, onMounted, computed, defineEmits } from "vue"
import { authFetch } from "../helpers/helpers";

defineEmits(["drop-task"])

const props = defineProps({
    projectId: [Number, String],
})

const tasks = ref(null)
const error = ref(null)
const loading = ref(true)

const assignees = computed(() => {
    if (tasks.value) {
        return new Map(
            tasks.value.map((t) => [
                t.assignee_id,
                { id: t.assignee_id, name: t.assignee_name },
            ]),
        ).values()
    } else {
        return []
    }
})

onMounted(async () => {
    console.log("Backlog projectId = ", props.projectId)

    try {
        const res = await authFetch(
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
    <div
        v-else-if="tasks"
        class="kanban"
        @dragover.prevent
        @drop="$emit('drop-task')"
    >
        <table>
            <tbody>
                <tr>
                    <th>IN PROGRESS</th>
                    <th>REVIEW</th>
                    <th>DONE</th>
                </tr>
                <template v-for="assignee in assignees">
                    <tr colspan="3">
                        {{
                            assignee.id ? assignee.name : "unassigned"
                        }}
                    </tr>
                    <tr
                        v-for="task in tasks.filter(
                            (t) => t.assignee_id === assignee.id,
                        )"
                        :key="task.task_id"
                    >
                        <td><Task v-if="task.status === 'DOING'" :task /></td>
                        <td><Task v-if="task.status === 'REVIEW'" :task /></td>
                        <td><Task v-if="task.status === 'DONE'" :task /></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
