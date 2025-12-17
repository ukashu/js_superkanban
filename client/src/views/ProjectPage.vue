<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

import CreateTask from "../components/CreateTask.vue"
import ProjectBacklog from "../components/ProjectBacklog.vue"
import AssignUserToTask from "../components/AssignUserToTask.vue"
import ProjectKanban from "../components/ProjectKanban.vue"

const project = ref(null)
const loading = ref(true)
const error = ref(null)

const showAssignPopup = ref(false)
const showAddTaskPopup = ref(false)
const selectedTaskId = ref(null)

const reloadBacklogKey = ref(0)

const route = useRoute()
const projectId = route.params.projectId

function openAssignUser(taskId) {
    selectedTaskId.value = taskId
    showAssignPopup.value = true
}

function onAssigned() {
    showAssignPopup.value = false
    reloadBacklogKey.value++
}

function onRefresh() {
    showAddTaskPopup.value = false
    reloadBacklogKey++
}

onMounted(async () => {
    try {
        const res = await fetch(
            `http://localhost:5000/api/projects/${projectId}`,
        )
        if (!res.ok) {
            throw new Error("Failed to fetch project")
        }

        const json = await res.json()
        project.value = json.data
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="project-container">
        <div v-if="loading">Loading project details...</div>

        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else-if="project">
            <h1>{{ project.title }}</h1>
            <p>{{ project.description }}</p>

            <CreateTask
                v-if="showAddTaskPopup"
                :projectId="projectId"
                @refresh="onRefresh"
            />
            <div class="project-tasks">
                <ProjectBacklog
                    :key="reloadBacklogKey"
                    :projectId="projectId"
                    @assign="openAssignUser"
                    class="project-backlog"
                />

                <AssignUserToTask
                    v-if="showAssignPopup"
                    :projectId="projectId"
                    :taskId="selectedTaskId"
                    @assigned="onAssigned"
                />
                <ProjectKanban :projectId="projectId" class="project-kanban" />
            </div>
            <div class="project-controls">
                <button @click="showAddTaskPopup = !showAddTaskPopup">
                    Add task
                </button>
            </div>
        </div>

        <div v-else>No project data found.</div>
    </div>
</template>
<style>
.project-tasks {
    background-color: red;
    display: flex;
}

.project-backlog {
    background-color: green;
    flex: 1;
}

.project-kanban {
    background-color: rgb(141, 63, 63);
    flex: 3;
}
</style>
