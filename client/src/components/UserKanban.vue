<script setup>
import Task from "./Task.vue"
import { ref, onMounted, computed } from "vue"
import { authFetch } from "../helpers/helpers"
import ProgressSpinner from "primevue/progressspinner"
import Message from "primevue/message"
import Divider from "primevue/divider"

const emit = defineEmits(["drop-task"])

const props = defineProps({
    userId: [Number, String],
})

const tasks = ref([])
const error = ref(null)
const loading = ref(false)
const hasMore = ref(true)
const limit = 10
const offset = ref(0)

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
    if (loading.value || !hasMore.value) return

    loading.value = true

    console.log("Backlog userId = ", props.userId)

    try {
        const res = await authFetch(
            `/api/users/${props.userId}/tasks?limit=${limit}&offset=${offset.value}`,
        )
        if (!res.ok) {
            throw new Error("Failed to fetch tasks")
        }

        const json = await res.json()
        tasks.value.push(...json.data.tasks)
        hasMore.value = json.data.hasMore
        offset.value += limit
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

const sentinel = ref(null)
onMounted(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                loadTasks()
            }
        },
        {
            root: null,
            threshold: 0.1,
        },
    )
    observer.observe(sentinel.value)
})

const draggedTask = ref(null)

const changeTaskStatus = async (e, newStatus) => {
    if (newStatus != draggedTask.value.status) {
        try {
            const res = await fetch(
                `/api/projects/${draggedTask.value.projectId}/tasks/${draggedTask.value.id}&sortBy=project_id`,
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

const changeNonDragTaskStatus = async (task, newStatus) => {
    try {
        const res = await fetch(
            `/api/projects/${task.project_id}/tasks/${task.task_id}`,
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
    <div v-if="error" class="p-4">
        <Message severity="error">{{ error }}</Message>
    </div>
    <div v-else-if="tasks" class="flex flex-col min-h-0">
        <div
            class="hidden sm:grid grid-cols-3 gap-4 mb-4 text-center font-bold"
        >
            <div class="custom-bg-blue-100 p-2 rounded">IN PROGRESS</div>
            <div class="custom-bg-yellow-100 p-2 rounded">REVIEW</div>
            <div class="custom-bg-green-100 p-2 rounded">DONE</div>
        </div>

        <div
            class="sm:grid sm:grid-cols-3 sm:gap-4 relative min-h-auto overflow-y-auto"
        >
            <div
                class="dropzone review-dropzone"
                :class="{ 'active-zone': draggedTask?.status === 'DOING' }"
                @dragover.prevent
                @drop="changeTaskStatus($event, 'REVIEW')"
            ></div>
            <div
                class="dropzone doing-dropzone"
                :class="{ 'active-zone': draggedTask?.status === 'REVIEW' }"
                @dragover.prevent
                @drop="changeTaskStatus($event, 'DOING')"
            ></div>

            <template
                v-for="project in projectsWithTasks"
                :key="project.projectId"
            >
                <div class="project-separator col-span-3">
                    <Divider align="left">
                        <span class="p-tag">{{
                            project.projectName || "Uncategorized"
                        }}</span>
                    </Divider>
                </div>
                <template v-for="task in project.tasks" :key="task.task_id">
                    <div :class="['task-item', task.status]">
                        <Task
                            :draggable="
                                task.status === 'DOING' ||
                                task.status === 'REVIEW'
                            "
                            @dragstart="dragStart(task)"
                            @dragend="dragEnd"
                            :task="task"
                            :change-status="changeNonDragTaskStatus"
                        />
                    </div>
                </template>
            </template>
            <div ref="sentinel" class="h-10"></div>
            <div v-if="loading" class="flex justify-center p-4">
                <ProgressSpinner />
            </div>
        </div>
    </div>
</template>
<style scoped>
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
    pointer-events: none;
}

.review-dropzone {
    left: 33.33%;
    width: 33.33%;
}

.doing-dropzone {
    left: 0;
    width: 33.33%;
}

.active-zone {
    background-color: rgba(255, 255, 200, 0.3);
    border: 2px dashed #ecc94b;
    pointer-events: auto;
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
