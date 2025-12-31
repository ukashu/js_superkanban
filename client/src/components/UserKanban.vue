<script setup>
import Task from "./Task.vue"
import { ref, onMounted, computed, defineEmits } from "vue"
import { authFetch } from "../helpers/helpers"

defineEmits(["drop-task"])

const props = defineProps({
    userId: [Number, String],
})

const tasks = ref(null)
const error = ref(null)
const loading = ref(true)

const projects = computed(() => {
    if (tasks.value) {
        return new Map(
            tasks.value.map((t) => [
                t.project_id,
                { id: t.project_id, name: t.project_name },
            ]),
        ).values()
    } else {
        return []
    }
})

onMounted(async () => {
    console.log("Backlog userId = ", props.userId)

    try {
        const res = await authFetch(
            `http://localhost:5000/api/users/${props.userId}/tasks`,
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
    <div v-else-if="tasks" class="kanban">
        <h3>IN PROGRESS</h3>
        <h3>REVIEW</h3>
        <h3>DONE</h3>
        <template v-for="project in projects">
            <p class="separator">
                {{ project.id ? project.name : "uncategorized" }}
            </p>
            <template
                v-for="task in tasks.filter((t) => t.project_id === project.id)"
                :key="task.task_id"
            >
                <Task :class="task.status" :task />
            </template>
        </template>
    </div>
</template>
<style>
.kanban {
    background-color: red;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
.separator {
    grid-column-start: 1;
    grid-column-end: 4;
}
.DOING {
    grid-column: 1;
}
.REVIEW {
    grid-column: 2;
}
.DONE {
    grid-column: 3;
}
</style>
