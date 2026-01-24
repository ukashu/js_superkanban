import { createRouter, createWebHistory } from "vue-router"
import TasksView from "../views/TasksView.vue"
import UserHomePage from "../views/UserHomePage.vue"
import LoginView from "../views/LoginView.vue"
import RegisterView from "../views/RegisterView.vue"

const routes = [
    {
        path: "/tasks",
        name: "Tasks",
        component: TasksView,
    },
    {
        path: "/users/:id",
        name: "UserHome",
        component: UserHomePage,
    },

    {
        path: "/login",
        name: "Login",
        component: LoginView,
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterView,
    },

    {
        path: "/",
        redirect: "/login",
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
