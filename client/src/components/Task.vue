<script setup>
import Card from "primevue/card"

defineProps({
    task: {
        type: Object,
        required: true,
    },
})
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
            <div class="text-sm text-gray-500">
                Assigned to: {{ task.assignee_name }}
            </div>
        </template>
    </Card>
</template>

<style scoped></style>
