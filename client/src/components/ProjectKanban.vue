<script setup>
import Task from "./Task.vue"
import { ref, onMounted, computed, defineEmits } from "vue"
import { authFetch } from "../helpers/helpers"

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
        <h3>IN PROGRESS</h3>
        <h3>REVIEW</h3>
        <h3>DONE</h3>
        <template v-for="assignee in assignees">
            <p class="separator">
                {{ assignee.id ? assignee.name : "unassigned" }}
            </p>
            <template
                v-for="task in tasks.filter(
                    (t) => t.assignee_id === assignee.id,
                )"
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
    position: relative;
}
.separator {
    grid-column-start: 1;
    grid-column-end: 4;
}
.droppable {
    border: 10px solid white;
}
.DOING {
    grid-column: 1;
    z-index: 1;
}
.REVIEW {
    grid-column: 2;
    z-index: 1;
}
.DONE {
    grid-column: 3;
    z-index: 1;
}
</style>
