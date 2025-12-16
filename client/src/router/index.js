import { createRouter, createWebHistory } from "vue-router"
import TasksView from "../views/TasksView.vue"

const routes = [
    {
        path: "/tasks",
        name: "Tasks",
        component: TasksView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
