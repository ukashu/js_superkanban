<script setup>
import Card from "primevue/card"
import Button from "primevue/button"

defineProps({
    task: {
        type: Object,
        required: true,
    },
    changeStatus: {
        type: Function,
        required: false,
    },
})
</script>

<template>
    <Card class="task-card mb-4">
        <template #title>
            <div class="flex items-center justify-between">
                <p class="text-lg font-bold">
                    {{ task.title }}
                </p>
                <p class="ml-auto sm:hidden">
                    {{ task.status }}
                </p>
            </div>
        </template>
        <template #content>
            <p class="m-0 text-gray-700">{{ task.description }}</p>
        </template>
        <template #footer>
            <div class="text-sm text-gray-500 sm:hidden">
                Change status: {{ task.assignee_name }}
            </div>
            <div class="flex items-between justify-around sm:hidden">
                <Button
                    label="DOING"
                    class="DOING"
                    @click="changeStatus(task, 'DOING')"
                />
                <Button
                    label="REVIEW"
                    class="REVIEW"
                    @click="changeStatus(task, 'REVIEW')"
                />
                <Button
                    label="DONE"
                    class="DONE"
                    @click="changeStatus(task, 'DONE')"
                />
            </div>
        </template>
    </Card>
</template>

<style scoped>
.DOING {
    background-color: #ebf8ff;
    color: #2c5282;
}
.REVIEW {
    background-color: #fffff0;
    color: #744210;
}
.DONE {
    background-color: #f0fff4;
    color: #276749;
}
</style>
