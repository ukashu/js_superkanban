<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"

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
const selectedProject = ref(null) // Object for Listbox
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
    fetchUserProjects()                 
}

function onProjectCreated() {
    showAddProjectPopup.value = false
    fetchUserProjects()
}

async function fetchUserProjects() {
    try {
        const res = await fetch(`/api/users/${userId}/projects`)
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
        const res = await fetch(`/api/projects/${id}`)
        if (!res.ok) {
            throw new Error("Failed to fetch project")
        }

        const json = await res.json()
        project.value = json.data
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
</script>

<template>
    <div class="flex h-full overflow-hidden">
        <aside
            class="w-64 h-full bg-gray-200 flex flex-col border-r border-gray-200 p-4 overflow-y-auto"
        >
            <h3 class="text-xl font-bold mb-4 text-gray-900">My Projects</h3>
            <Listbox
                v-model="selectedProject"
                :options="projects"
                optionLabel="title"
                class="w-full"
                listStyle="maxheight: 250px"
            />
            <Button
                label="New Project"
                icon="pi pi-plus"
                class="mt-auto"
                @click="showAddProjectPopup = true"
            />
        </aside>

        <main class="flex-1 p-4 bg-white">
            <div v-if="loading && !project" class="flex justify-center mt-10">
                <ProgressSpinner />
            </div>

            <div v-else-if="error" class="p-4">
                <Message severity="error">{{ error }}</Message>
            </div>

            <div v-else-if="project" class="flex flex-col h-full min-h-0">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">
                            {{ project.title }}
                        </h1>
                        <p class="text-gray-600">{{ project.description }}</p>

                        <Button
                            label="Details"
                            icon="pi pi-info-circle"
                            text
                            class="mt-2"
                            @click="openProjectDetails"
                        />
                    </div>

                    <Button
                        label="Add Task"
                        icon="pi pi-plus"
                        @click="showAddTaskPopup = true"
                    />
                </div>

                <div
                    v-if="showProjectDetails"
                    class="mb-6 p-4 border rounded-lg bg-gray-50"
                >
                    <div v-if="!isEditingProject">
                        <p><b>Title:</b> {{ project.title }}</p>
                        <p class="mb-4"><b>Description:</b> {{ project.description }}</p>

                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            @click="isEditingProject = true"
                        />
                    </div>

                    <div v-else class="flex flex-col gap-3">
                        <InputText v-model="editedProject.title" />
                        <Textarea v-model="editedProject.description" rows="3" />

                        <div class="flex gap-2">
                            <Button label="Save" icon="pi pi-check" @click="saveProjectEdit" />
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
                </div>

                <div class="grid grid-cols-4 gap-6 flex-1 min-h-0">
                    <div
                        class="col-span-1 bg-gray-50 p-4 rounded-lg overflow-y-auto border border-gray-200"
                    >
                        <h2 class="text-lg font-semibold mb-4 text-gray-900">
                            Backlog
                        </h2>
                        <ProjectBacklog
                            :key="currentProjectId + '-' + reloadBacklogKey"
                            :projectId="currentProjectId"
                            @drag-task="onDragTask"
                            class="project-backlog"
                        />
                    </div>

                    <div
                        class="col-span-3 bg-gray-50 p-4 rounded-lg overflow-y-auto border border-gray-200"
                    >
                        <h2 class="text-lg font-semibold mb-4 text-gray-900">
                            Kanban Board
                        </h2>
                        <ProjectKanban
                            :key="currentProjectId + '-' + reloadBacklogKey"
                            :projectId="currentProjectId"
                            class="project-kanban"
                            @drop-task="onDropTask"
                        />
                    </div>
                </div>
            </div>

            <div v-else class="text-center mt-10 text-gray-500">
                Select a project to view details.
            </div>
        </main>

        <!-- Dialogs -->
        <Dialog
            v-model:visible="showAddTaskPopup"
            modal
            header="Create Task"
            :style="{ width: '50vw' }"
        >
            <CreateTask :projectId="currentProjectId" @refresh="onRefresh" />
        </Dialog>

        <Dialog
            v-model:visible="showAddProjectPopup"
            modal
            header="Create Project"
            :style="{ width: '50vw' }"
        >
            <CreateProject @project-created="onProjectCreated" />
        </Dialog>

        <Dialog
            v-model:visible="showAssignPopup"
            modal
            header="Assign User"
            :style="{ width: '40vw' }"
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
