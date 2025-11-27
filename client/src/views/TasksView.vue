<template>
  <div>
    <h1>Taski projektu</h1>

    <div v-if="loading">Ładowanie...</div>

    <div v-else>
      <div v-for="task in tasks" :key="task.task_id" class="task-item">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <small>Status: {{ task.status }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Ustaw na ID projektu jaki chcesz pobierać
const projectId = 1;

const tasks = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/projects/${projectId}/tasks`
    );
    tasks.value = await response.json();
  } catch (err) {
    console.error("Błąd przy pobieraniu tasków:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.task-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 8px;
}
</style>
