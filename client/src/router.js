import { createWebHistory, createRouter } from "vue-router"

import UserHomePage from "./views/UserHomePage.vue"
import ProjectPage from "./views/ProjectPage.vue"
import TasksView from "./views/TasksView.vue"
import LoginView from "./views/LoginView.vue"
import RegisterView from "./views/RegisterView.vue"

const routes = [
    { path: "/" },
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

    // root
    if (to.path === "/") {
        return isLoggedIn ? next(`/users/${userId}`) : next("/login")
    }

    // auth guard
    if (!isLoggedIn && !["/login", "/register"].includes(to.path)) {
        return next("/login")
    }

    next()
})

export default router
