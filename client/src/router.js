import { createMemoryHistory, createRouter } from 'vue-router'

import UserHomePage from './views/UserHomePage.vue'
import ProjectPage from './views/ProjectPage.vue'

const routes = [
    { path: '/users/:userId', component: UserHomePage },
    { path: '/projects/:projectId', component: ProjectPage },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router;