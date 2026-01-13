<script setup>
import Task from "./Task.vue"
import { ref, onMounted, computed, defineEmits, watch } from "vue"
import ProgressSpinner from "primevue/progressspinner"
import Message from "primevue/message"
import Divider from "primevue/divider"

const emit = defineEmits(["drop-task"])

const props = defineProps({
    projectId: [Number, String],
})

const tasks = ref(null)
const error = ref(null)
const loading = ref(true)

const assigneesWithTasks = computed(() => {
    if (!tasks.value) return []

    const map = new Map()

    tasks.value.forEach((t) => {
        if (t.status != "BACKLOG") {
            if (!map.has(t.assignee_id)) {
                map.set(t.assignee_id, {
                    assigneeId: t.assignee_id,
                    assigneeName: t.assignee_name,
                    tasks: [],
                })
            }
            map.get(t.assignee_id).tasks.push(t)
        }
    })

    return Array.from(map.values())
})

const loadTasks = async () => {
    try {
        const res = await fetch(`/api/projects/${props.projectId}/tasks`)
        if (!res.ok) {
            throw new Error("Failed to fetch tasks")
        }

        const json = await res.json()
        tasks.value = json.data.tasks
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

onMounted(loadTasks)
watch(() => props.projectId, loadTasks)

const draggedTask = ref(null)

const changeTaskStatus = async (e, newStatus) => {
    if (newStatus != draggedTask.value.status) {
        try {
            const res = await fetch(
                `/api/projects/${draggedTask.value.projectId}/tasks/${draggedTask.value.id}`,
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
    <div v-if="loading" class="flex justify-center p-4">
        <ProgressSpinner />
    </div>
    <div v-else-if="error" class="p-4">
        <Message severity="error">{{ error }}</Message>
    </div>
    <div v-else-if="tasks" class="kanban-wrapper">
        <div class="grid grid-cols-3 gap-4 mb-4 text-center font-bold">
            <div class="custom-bg-blue-100 p-2 rounded">IN PROGRESS</div>
            <div class="custom-bg-yellow-100 p-2 rounded">REVIEW</div>
            <div class="custom-bg-green-100 p-2 rounded">DONE</div>
        </div>

        <div class="kanban-board relative">
            <div
                class="dropzone doing-dropzone"
                :class="{
                    'active-zone':
                        draggedTask && draggedTask?.status !== 'DOING',
                }"
                @dragover.prevent
                @drop="
                    draggedTask
                        ? changeTaskStatus($event, 'DOING')
                        : $emit('drop-task')
                "
            ></div>
            <div
                class="dropzone review-dropzone"
                :class="{
                    'active-zone':
                        draggedTask && draggedTask?.status !== 'REVIEW',
                }"
                @dragover.prevent
                @drop="changeTaskStatus($event, 'REVIEW')"
            ></div>
            <div
                class="dropzone done-dropzone"
                :class="{
                    'active-zone':
                        draggedTask && draggedTask?.status !== 'DONE',
                }"
                @dragover.prevent
                @drop="changeTaskStatus($event, 'DONE')"
            ></div>

            <template
                v-for="assignee in assigneesWithTasks"
                :key="assignee.assigneeId"
            >
                <div class="assignee-separator col-span-3">
                    <Divider align="left">
                        <span class="p-tag">{{
                            assignee.assigneeId
                                ? assignee.assigneeName
                                : "Unassigned"
                        }}</span>
                    </Divider>
                </div>
                <template v-for="task in assignee.tasks" :key="task.task_id">
                    <div class="task-row col-span-3">
                        <div :class="['task-item', task.status]">
                            <Task
                                :draggable="true"
                                @dragstart="dragStart(task)"
                                @dragend="dragEnd"
                                :task="task"
                            />
                        </div>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>
<style scoped>
.kanban-board {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    position: relative;
    min-height: 500px;
    overflow: auto;
}

.task-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.col-span-3 {
    grid-column: 1 / 4;
}

.task-item.DOING {
    grid-column: 1;
}
.task-item.REVIEW {
    grid-column: 2;
}
.task-item.DONE {
    grid-column: 3;
}

.dropzone {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 0;
}

.doing-dropzone {
    left: 0;
    width: 33.33%;
}
.review-dropzone {
    left: 33.33%;
    width: 33.33%;
}
.done-dropzone {
    left: 66.66%;
    width: 33.33%;
}

.active-zone {
    background-color: rgba(255, 255, 200, 0.3);
    border: 2px dashed #ecc94b;
    z-index: 10;
}

.task-item {
    z-index: 20;
    position: relative;
}

.custom-bg-blue-100 {
    background-color: #ebf8ff;
    color: #2c5282;
}
.custom-bg-yellow-100 {
    background-color: #fffff0;
    color: #744210;
}
.custom-bg-green-100 {
    background-color: #f0fff4;
    color: #276749;
}
</style>
