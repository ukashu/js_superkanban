<script setup>
import { ref, computed, onMounted, defineEmits } from "vue"
import ProgressSpinner from "primevue/progressspinner"
import { authFetch } from "../helpers/helpers.js"

const emit = defineEmits(["drag-task", "drag-end", "refresh"])

const props = defineProps({
    projectId: {
        type: [String, Number],
        required: true,
    },
    showAssignUserPopup: {
        type: Function,
        required: true,
    },
})

const tasks = ref([])
const loading = ref(true)

const backlog = computed(() => tasks.value.filter((t) => !t.assignee_id))

onMounted(async () => {
    console.log("Backlog projectId = ", props.projectId)

    try {
        const res = await authFetch(`/api/projects/${props.projectId}/tasks`)
        if (!res.ok) {
            throw new Error("Failed to fetch backlog tasks")
        }
        console.log(res)
        const json = await res.json()
        if (!json.success) {
            throw new Error(json.message)
        }
        tasks.value = json.data.tasks
    } catch (err) {
        console.error("Błąd przy pobieraniu tasków do backlogu:", err)
    } finally {
        loading.value = false
    }
})

function onDragStart(event, task) {
    event.dataTransfer.dropEffect = "move"
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", task.task_id.toString())
    emit("drag-task", task.task_id)
}

async function unassignTask(e) {
    console.log(`${e.dataTransfer.getData("text")}`)
    try {
        const res = await authFetch(
            `/api/projects/${props.projectId}/tasks/${e.dataTransfer.getData("text")}/unassign`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            },
        )
        if (!res.ok) {
            throw new Error("Failed to unassign task status")
        }
        const json = await res.json()
        console.log(json)
        emit("refresh")
    } catch (err) {
        console.error("Błąd przy unassign taska: ", err)
    }
}
</script>

<template>
    <div
        @dragover.prevent
        @drop="unassignTask($event)"
        class="h-full flex flex-col"
    >
        <div v-if="loading" class="flex justify-center p-4">
            <ProgressSpinner style="width: 50px; height: 50px" />
        </div>
        <div v-else class="flex-1 overflow-y-auto pr-2">
            <div
                v-if="backlog.length === 0"
                class="text-gray-500 text-center italic mt-4"
            >
                No tasks in backlog
            </div>
            <div
                v-for="task in backlog"
                :key="task.task_id"
                draggable="true"
                @dragstart="onDragStart($event, task)"
                @click="showAssignUserPopup(task.task_id)"
                class="backlog-item"
            >
                <span class="font-bold">{{ task.title }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.backlog-item {
    background-color: #ffffff;
    color: #374151;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: move;
    transition: all 0.2s ease;
    user-select: none;
}

.backlog-item:hover {
    background-color: #f9fafb;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #d1d5db;
    transform: translateY(-1px);
}
</style>
