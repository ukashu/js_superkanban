import { createWebHistory, createRouter } from 'vue-router'

import UserHomePage from './views/UserHomePage.vue'
import ProjectPage from './views/ProjectPage.vue'
import TasksView from "./views/TasksView.vue"

const routes = [
    { path: '/users/:userId', component: UserHomePage },
    { path: '/projects/:projectId', component: ProjectPage },
    { path: '/projects/:projectId/tasks', component: TasksView }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;