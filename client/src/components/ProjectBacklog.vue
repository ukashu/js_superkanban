<template>
    <div>
        <p>BACKLOG</p>
        <ul>
            <li
                v-for="task in backlog"
                :key="task.task_id"
                draggable="true"
                @dragstart="$emit('drag-task', task.task_id)"
            >
                {{ task.title }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from "vue"
import { authFetch } from "../helpers/helpers"

defineEmits(["drag-task"])

const props = defineProps({
    projectId: {
        type: [String, Number],
        required: true,
    },
})

const tasks = ref([])
const loading = ref(true)

const backlog = computed(() =>
    tasks.value.filter((t) => t.status === "BACKLOG"),
)

onMounted(async () => {
    console.log("Backlog projectId = ", props.projectId)

    try {
        const res = await authFetch(
            `http://localhost:5000/api/projects/${props.projectId}/tasks`,
        )
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
</script>
