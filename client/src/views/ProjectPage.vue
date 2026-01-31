<script setup>
import { ref, onMounted, watch, computed } from "vue"
import { useRoute } from "vue-router"

import { authFetch, getCurrentUser } from "../helpers/helpers.js"

import CreateTask from "../components/CreateTask.vue"
import CreateProject from "../components/CreateProject.vue"
import ProjectBacklog from "../components/ProjectBacklog.vue"
import AssignUserToTask from "../components/AssignUserToTask.vue"
import ProjectKanban from "../components/ProjectKanban.vue"

import Listbox from "primevue/listbox"
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import ProgressSpinner from "primevue/progressspinner"
import Message from "primevue/message"
import InputText from "primevue/inputtext"
import Textarea from "primevue/textarea"

const projects = ref([])
const currentProjectId = ref(null)
const selectedProject = ref(null)
const project = ref(null)
const loading = ref(true)
const error = ref(null)

const showAssignPopup = ref(false)
const showAddTaskPopup = ref(false)
const showAddProjectPopup = ref(false)
const selectedTaskId = ref(null)

const reloadBacklogKey = ref(0)

const route = useRoute()
const userId = route.params.userId

const currentUser = getCurrentUser()

const canManageProject = computed(() => {
    if (!project.value) return false
    return currentUser.isAdmin || project.value.owner_id === currentUser.userId
})

const canCreateProject = computed(() => {
    return currentUser.isAdmin || currentUser.userId === Number(userId)
})

const showProjectDetails = ref(false)
const isEditingProject = ref(false)

const editedProject = ref({
    title: "",
    description: "",
})

function openAssignUser(taskId) {
    selectedTaskId.value = taskId
    showAssignPopup.value = true
}

function onAssigned() {
    showAssignPopup.value = false
    reloadBacklogKey.value++
}

function onRefresh() {
    showAddProjectPopup.value = false
    reloadBacklogKey.value++
}

async function fetchUserProjects() {
    try {
        const res = await authFetch(`/api/users/${userId}/projects`)
        if (!res.ok) throw new Error("Failed to fetch user projects")
        const json = await res.json()
        if (json.success) {
            projects.value = json.data.projects
            if (projects.value.length > 0) {
                selectedProject.value = projects.value[0]
                selectProject(projects.value[0].project_id)
            } else {
                loading.value = false
                error.value = "No projects found for this user."
            }
        }
    } catch (e) {
        error.value = e.message
        loading.value = false
    }
}

async function selectProject(id) {
    currentProjectId.value = id
    loading.value = true
    error.value = null
    try {
        const res = await authFetch(`/api/projects/${id}`)
        if (!res.ok) {
            throw new Error("Failed to fetch project")
        }

        const json = await res.json()
        project.value = json.data
        editedProject.value = {
            title: project.value.title,
            description: project.value.description,
        }
        reloadBacklogKey.value++
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

function openProjectDetails() {
    showProjectDetails.value = !showProjectDetails.value
    isEditingProject.value = false

    editedProject.value = {
        title: project.value.title,
        description: project.value.description,
    }
}

async function saveProjectEdit() {
    try {
        const res = await fetch(`/api/projects/${project.value.project_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedProject.value),
        })

        if (!res.ok) throw new Error()

        project.value.title = editedProject.value.title
        project.value.description = editedProject.value.description

        isEditingProject.value = false
    } catch {
        alert("Błąd zapisu projektu")
    }
}

async function deleteProject() {
    if (!confirm("Na pewno usunąć projekt?")) return

    try {
        const res = await fetch(`/api/projects/${project.value.project_id}`, {
            method: "DELETE",
        })

        if (!res.ok) throw new Error()

        projects.value = projects.value.filter(
            (p) => p.project_id !== project.value.project_id,
        )

        project.value = null
        selectedProject.value = null
    } catch {
        alert("Błąd usuwania projektu")
    }
}

// Watch for listbox selection change
watch(selectedProject, (newVal) => {
    if (newVal && newVal.project_id) {
        selectProject(newVal.project_id)
    }
})

onMounted(() => {
    fetchUserProjects()
})

const draggedTaskId = ref(null)
function onDragTask(taskId) {
    draggedTaskId.value = taskId
}
function onDropTask() {
    selectedTaskId.value = draggedTaskId.value
    showAssignPopup.value = true
}

function showAssignUserPopup(taskId) {
    selectedTaskId.value = taskId
    showAssignPopup.value = true
}
</script>

<template>
    <div class="flex flex-col sm:flex-row h-full min-h-0">
        <aside
            class="sm:w-64 sm:h-full shrink-0 max-h-[20vh] sm:max-h-none bg-gray-200 flex flex-col gap-2 border-r border-gray-200 p-4 overflow-y-auto"
        >
            <div class="flex flex-row flex-1 justify-between sm:hidden">
                <h3 class="text-xl font-bold mb-4 text-gray-900">
                    My Projects
                </h3>
                <Button
                    v-if="canCreateProject"
                    label="New Project"
                    icon="pi pi-plus"
                    class="mt-auto"
                    @click="showAddProjectPopup = true"
                />
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-900 hidden sm:block">
                My Projects
            </h3>
            <Listbox
                v-model="selectedProject"
                :options="projects"
                optionLabel="title"
                class="w-full"
                listStyle="maxheight: 250px"
            />
            <div class="sm:block hidden mt-auto">
                <Button
                    v-if="canCreateProject"
                    label="New Project"
                    icon="pi pi-plus"
                    class="mt-auto"
                    @click="showAddProjectPopup = true"
                />
            </div>
        </aside>

        <main class="flex-1 p-4 bg-white overflow-y-auto min-h-0">
            <div v-if="loading && !project" class="flex justify-center mt-10">
                <ProgressSpinner />
            </div>

            <div v-else-if="error" class="p-4">
                <Message severity="error">{{ error }}</Message>
            </div>

            <div v-else-if="project" class="flex flex-col h-full min-h-0">
                <div class="hidden sm:flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">
                            {{ project.title }}
                        </h1>
                        <p class="text-gray-600">{{ project.description }}</p>
                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            @click="isEditingProject = true"
                        />
                    </div>

                    <Button
                        v-if="canManageProject"
                        label="Add Task"
                        icon="pi pi-plus"
                        @click="showAddTaskPopup = true"
                    />
                </div>

                <div v-if="isEditingProject" class="flex flex-col gap-3">
                    <InputText v-model="editedProject.title" />
                    <Textarea v-model="editedProject.description" rows="3" />

                    <div class="flex gap-2">
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            @click="saveProjectEdit"
                        />
                        <Button
                            label="Cancel"
                            severity="secondary"
                            @click="isEditingProject = false"
                        />
                        <Button
                            label="Delete"
                            severity="danger"
                            icon="pi pi-trash"
                            @click="deleteProject"
                        />
                    </div>
                </div>

                <div class="sm:grid sm:grid-cols-4 gap-6 flex-1 min-h-0">
                    <div
                        class="col-span-1 bg-gray-50 p-4 rounded-lg sm:overflow-y-auto border border-gray-200"
                    >
                        <h2 class="text-lg font-semibold mb-4 text-gray-900">
                            Backlog
                        </h2>
                        <ProjectBacklog
                            :key="currentProjectId + '-' + reloadBacklogKey"
                            :projectId="currentProjectId"
                            :showAssignUserPopup="showAssignUserPopup"
                            @drag-task="onDragTask"
                            @refresh="onRefresh"
                            class="project-backlog"
                        />
                        <Button
                            v-if="canManageProject"
                            label="Add Task"
                            icon="pi pi-plus"
                            @click="showAddTaskPopup = true"
                        />
                    </div>

                    <div
                        class="col-span-3 bg-gray-50 p-4 rounded-lg sm:overflow-y-auto border border-gray-200"
                    >
                        <h2 class="text-lg font-semibold mb-4 text-gray-900">
                            Kanban Board
                        </h2>
                        <ProjectKanban
                            :key="currentProjectId + '-' + reloadBacklogKey"
                            :projectId="currentProjectId"
                            class="project-kanban"
                            @drop-task="onDropTask"
                            @refresh="onRefresh"
                        />
                    </div>
                </div>
            </div>

            <div v-else class="text-center mt-10 text-gray-500">
                Select a project to view details.
            </div>
        </main>

        <Dialog
            v-model:visible="showAddTaskPopup"
            modal
            header="Create Task"
            class="w-[90vw] sm:w-[50vw]"
        >
            <CreateTask :projectId="currentProjectId" @refresh="onRefresh" />
        </Dialog>

        <Dialog
            v-model:visible="showAddProjectPopup"
            modal
            header="Create Project"
            class="w-[90vw] sm:w-[50vw]"
        >
            <CreateProject @project-created="onRefresh" />
        </Dialog>

        <Dialog
            v-model:visible="showAssignPopup"
            modal
            header="Assign User"
            class="w-[90vw] sm:w-[40vw]"
        >
            <AssignUserToTask
                :projectId="currentProjectId"
                :taskId="selectedTaskId"
                @assigned="onAssigned"
            />
        </Dialog>
    </div>
</template>

<style scoped></style>
