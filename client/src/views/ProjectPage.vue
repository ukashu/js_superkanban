<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const project = ref(null);
const loading = ref(true);
const error = ref(null);
const route = useRoute();

onMounted(async () => {
  const projectId = route.params.projectId;
  try {
    const response = await fetch(`/api/projects/${projectId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }
    const result = await response.json();
    project.value = result.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else-if="error">
      <p>Error: {{ error }}</p>
    </div>
    <div v-else-if="project">
      <h1>{{ project.name }}</h1>
      <p>{{ project.description }}</p>
    </div>
    <div v-else>
        <p>No project data found.</p>
    </div>
  </div>
</template>