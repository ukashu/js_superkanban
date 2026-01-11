<script setup>
import Card from 'primevue/card';

defineProps({
    task: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <Card class="task-card mb-4">
        <template #title>
            <div class="text-lg font-bold">{{ task.title }}</div>
        </template>
        <template #content>
            <p class="m-0 text-gray-700">{{ task.description }}</p>
        </template>
        <template #footer>
            <div class="text-sm text-gray-500">Assigned to: {{ task.assignee_name }}</div>
        </template>
    </Card>
</template>

<style scoped>
.mb-4 { margin-bottom: 1rem; }
.text-lg { font-size: 1.125rem; }
.font-bold { font-weight: bold; }
.m-0 { margin: 0; }
.text-gray-700 { color: #374151; }
.text-sm { font-size: 0.875rem; }
.text-gray-500 { color: #6b7280; }
</style>
