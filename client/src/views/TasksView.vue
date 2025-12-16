<template>
    <div>
        <h1>Taski projektu</h1>

        <div v-if="loading">Ładowanie...</div>

        <div v-else>
            <Task v-for="task in tasks" :key="task.task_id" :task="task" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import Task from "../components/Task.vue"

// Ustaw na ID projektu jaki chcesz pobierać
const projectId = 1

const tasks = ref([])
const loading = ref(true)

const route = useRoute()
const projectId = route.params.projectId

onMounted(async () => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/projects/${projectId}/tasks`,
        )
        tasks.value = await response.json()
    } catch (err) {
        console.error("Błąd przy pobieraniu tasków:", err)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.task-item {
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 8px;
}
</style>
