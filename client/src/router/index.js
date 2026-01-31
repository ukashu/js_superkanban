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

router.beforeEach((to, from, next) => {
    const publicPages = ["/login", "/register"]
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem("token")
    const userId = Number(localStorage.getItem("user_id"))
    const isAdmin = localStorage.getItem("is_admin") === "1"

    if (authRequired && !loggedIn) {
        return next("/login")
    }

    // Check if the route is user-specific (starts with /users/:id)
    if (to.path.startsWith("/users/")) {
        const routeUserId = Number(to.params.id)
        if (routeUserId) {
            if (isAdmin || userId === routeUserId) {
                return next()
            } else {
                // Redirect to own home page or show error
                // If we redirect to own home page, we might create a loop if that also fails,
                // so let's redirect to login for now or the correct user page.
                if (userId) {
                    return next(`/users/${userId}`)
                } else {
                    return next("/login")
                }
            }
        }
    }

    next()
})

export default router
