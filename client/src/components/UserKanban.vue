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

const projectsWithTasks = computed(() => {
    if (!tasks.value) return []

    const map = new Map()

    tasks.value.forEach((t) => {
        if (!map.has(t.project_id)) {
            map.set(t.project_id, {
                projectId: t.project_id,
                projectName: t.project_name,
                tasks: [],
            })
        }
        map.get(t.project_id).tasks.push(t)
    })

    return Array.from(map.values())
})

const loadTasks = async () => {
    loading.value = true
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
}

onMounted(loadTasks)

const draggedTask = ref(null) // id: number, status: 'DOING'|'REVIEW'|'DONE'

const changeTaskStatus = async (e, newStatus) => {
    if (newStatus != draggedTask.value.status) {
        try {
            const res = await fetch(
                `http://localhost:5000/api/projects/${draggedTask.value.projectId}/tasks/${draggedTask.value.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                },
            )
            if (!res.ok) {
                throw new Error("Failed to update task status")
            }
            const json = await res.json()
            console.log(json)
            loadTasks()
        } catch (err) {
            error.value = err.message
        }
    }
    console.log({ draggedTask: draggedTask.value })
    draggedTask.value = null
}

const dragStart = (task) => {
    draggedTask.value = {
        id: task.task_id,
        status: task.status,
        projectId: task.project_id,
    }
}
const dragEnd = () => {
    draggedTask.value = null
}
</script>
<template>
    <div v-if="loading">Loading tasks...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tasks" class="kanban">
        <h3>IN PROGRESS</h3>
        <h3>REVIEW</h3>
        <h3>DONE</h3>
        <div
            class="review-dropzone"
            :class="{ droppable: draggedTask?.status === 'DOING' }"
            @dragover.prevent="dragEnter"
            @dragleave.prevent="dragLeave"
            @drop="changeTaskStatus($event, 'REVIEW')"
        >
            <p>DROP ZONE</p>
        </div>
        <div
            class="doing-dropzone"
            :class="{ droppable: draggedTask?.status === 'REVIEW' }"
            @dragover.prevent="dragEnter"
            @dragleave.prevent="dragLeave"
            @drop="changeTaskStatus($event, 'DOING')"
        >
            <p>DROP ZONE</p>
        </div>
        <template v-for="project in projectsWithTasks" :key="project.projectId">
            <p class="separator">
                {{ project.projectName || "uncategorized" }}
            </p>
            <template v-for="task in project.tasks" :key="task.task_id">
                <Task
                    :draggable="
                        task.status === 'DOING' || task.status === 'REVIEW'
                    "
                    @dragstart="dragStart(task)"
                    @dragend.prevent="dragEnd"
                    :class="task.status"
                    :task
                />
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
.review-dropzone {
    position: absolute;
    width: 33.3%;
    height: 100%;
    left: 33.3%;
}
.doing-dropzone {
    position: absolute;
    width: 33.3%;
    height: 100%;
    left: 0;
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
