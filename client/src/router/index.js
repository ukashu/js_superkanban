import { createRouter, createWebHistory } from "vue-router"
import TasksView from "../views/TasksView.vue"
import UserHomePage from "../views/UserHomePage.vue"  

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
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
