import { createWebHistory, createRouter } from "vue-router"

import UserHomePage from "./views/UserHomePage.vue"
import ProjectPage from "./views/ProjectPage.vue"
import TasksView from "./views/TasksView.vue"
import LoginView from "./views/LoginView.vue"
import RegisterView from "./views/RegisterView.vue"

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/users/:userId", component: UserHomePage },
    { path: "/users/:userId/projects", component: ProjectPage },
    { path: "/login", component: LoginView },
    { path: "/register", component: RegisterView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("token")
    const userId = localStorage.getItem("user_id")

    if (to.path === "/") {
        if (!isLoggedIn) return next("/login")
        return next(`/users/${userId}`)
    }

    if (!isLoggedIn && to.path !== "/login" && to.path !== "/register") {
        return next("/login")
    }

    next()
})

export default router
