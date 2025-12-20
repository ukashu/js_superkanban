import { createWebHistory, createRouter } from "vue-router"

import UserHomePage from "./views/UserHomePage.vue"
import ProjectPage from "./views/ProjectPage.vue"
import TasksView from "./views/TasksView.vue"
import LoginView from "./views/LoginView.vue"
import RegisterView from "./views/RegisterView.vue"

const routes = [
    { path: "/users/:userId", component: UserHomePage },
    { path: "/projects/:projectId", component: ProjectPage },
    { path: "/projects/:projectId/tasks", component: TasksView },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
