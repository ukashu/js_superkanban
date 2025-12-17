<template>
    <div>
        <p>BACKLOG</p>
        <ul>
            <li v-for="task in backlog">
                {{ task.title }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import Task from "./Task.vue"

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
        const res = await fetch(
            `http://localhost:5000/api/projects/${props.projectId}/tasks`,
        )
        const json = await res.json()
        tasks.value = json.data.tasks
    } catch (err) {
        console.error("Błąd przy pobieraniu tasków do backlogu:", err)
    } finally {
        loading.value = false
    }
})
</script>
