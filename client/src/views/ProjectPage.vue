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
      throw new Error(`Error ${response.status}: Failed to fetch project`);
    }

    const result = await response.json();
    
    project.value = result.data; 

    console.log("Project Data Received:", project.value);

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="project-container">
    <div v-if="loading">
      <p>Loading project details...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else-if="project">
      <h1>{{ project.title }}</h1>
      
      <div class="meta">
        <span class="badge">ID: {{ project.project_id }}</span>
      </div>

      <p class="description">{{ project.description }}</p>
    </div>

    <div v-else>
        <p>No project data found.</p>
    </div>
  </div>
</template>