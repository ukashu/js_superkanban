<script setup>
import Task from "./Task.vue"
import { ref, onMounted, computed, defineEmits, watch, toRef } from "vue"
import { useFetchTasks } from "../composables/useFetchTasks.js"
import { useDragTask } from "../composables/useDragTask.js"
import ProgressSpinner from "primevue/progressspinner"
import Message from "primevue/message"
import Divider from "primevue/divider"

const emit = defineEmits(["drop-task", "refresh"])

const props = defineProps({
    projectId: [Number, String],
})

const { tasks, loading, error, sentinel, loadTasks } = useFetchTasks(
    "projectKanban",
    toRef(props, "projectId"),
)

const {
    draggedTask,
    changeTaskStatus,
    changeNonDragTaskStatus,
    dragStart,
    dragEnd,
} = useDragTask(tasks)

const assigneesWithTasks = computed(() => {
    if (!tasks.value) return []

    const map = new Map()

    tasks.value.forEach((t) => {
        if (t.status != "BACKLOG") {
            if (!map.has(t.assignee_id)) {
                map.set(t.assignee_id, {
                    assigneeId: t.assignee_id,
                    assigneeName: t.assignee_name,
                    tasks: [],
                })
            }
            map.get(t.assignee_id).tasks.push(t)
        }
    })

    return Array.from(map.values())
})
</script>
<template>
    <div v-if="error" class="p-4">
        <Message severity="error">{{ error }}</Message>
    </div>
    <div v-else-if="tasks" class="h-full">
        <div
            class="hidden sm:grid grid-cols-3 gap-4 mb-4 text-center font-bold"
        >
            <div class="custom-bg-blue-100 p-2 rounded">IN PROGRESS</div>
            <div class="custom-bg-yellow-100 p-2 rounded">REVIEW</div>
            <div class="custom-bg-green-100 p-2 rounded">DONE</div>
        </div>

        <div
            class="sm:grid grid-cols-3 gap-4 mb-4 min-h-full text-center relative content-start"
        >
            <div
                class="dropzone doing-dropzone"
                :class="{
                    'active-zone':
                        draggedTask && draggedTask?.status !== 'DOING',
                }"
                @dragover.prevent
                @drop="
                    draggedTask
                        ? changeTaskStatus($event, 'DOING')
                        : $emit('drop-task')
                "
            ></div>
            <div
                class="dropzone review-dropzone"
                :class="{
                    'active-zone':
                        draggedTask && draggedTask?.status !== 'REVIEW',
                }"
                @dragover.prevent
                @drop="changeTaskStatus($event, 'REVIEW')"
            ></div>
            <div
                class="dropzone done-dropzone"
                :class="{
                    'active-zone':
                        draggedTask && draggedTask?.status !== 'DONE',
                }"
                @dragover.prevent
                @drop="changeTaskStatus($event, 'DONE')"
            ></div>

            <template
                v-for="assignee in assigneesWithTasks"
                :key="assignee.assigneeId"
            >
                <div class="assignee-separator col-span-3">
                    <Divider align="left">
                        <span class="p-tag">{{
                            assignee.assigneeId
                                ? assignee.assigneeName
                                : "Unassigned"
                        }}</span>
                    </Divider>
                </div>
                <template v-for="task in assignee.tasks" :key="task.task_id">
                    <div class="task-row col-span-3">
                        <div :class="['task-item', task.status]">
                            <Task
                                :draggable="true"
                                @dragstart="(e) => dragStart(e, task)"
                                @dragend="dragEnd"
                                @refresh="emit('refresh')"
                                :task="task"
                                :change-status="changeNonDragTaskStatus"
                            />
                        </div>
                    </div>
                </template>
            </template>
            <div ref="sentinel" class="h-10"></div>
            <div v-if="loading" class="flex justify-center p-4">
                <ProgressSpinner />
            </div>
        </div>
    </div>
</template>
<style scoped>
.task-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.col-span-3 {
    grid-column: 1 / 4;
}

.task-item.DOING {
    grid-column: 1;
}
.task-item.REVIEW {
    grid-column: 2;
}
.task-item.DONE {
    grid-column: 3;
}

.dropzone {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 0;
}

.doing-dropzone {
    left: 0;
    width: 33.33%;
}
.review-dropzone {
    left: 33.33%;
    width: 33.33%;
}
.done-dropzone {
    left: 66.66%;
    width: 33.33%;
}

.active-zone {
    background-color: rgba(255, 255, 200, 0.3);
    border: 2px dashed #ecc94b;
    z-index: 10;
}

.task-item {
    z-index: 20;
    position: relative;
}

.custom-bg-blue-100 {
    background-color: #ebf8ff;
    color: #2c5282;
}
.custom-bg-yellow-100 {
    background-color: #fffff0;
    color: #744210;
}
.custom-bg-green-100 {
    background-color: #f0fff4;
    color: #276749;
}
</style>
