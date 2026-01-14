import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router.js"
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import "primeicons/primeicons.css"

const app = createApp(App)
app.use(router)
<<<<<<< HEAD
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
})
=======

console.log("ROUTES LOADED:", router.getRoutes().map(r => ({ name: r.name, path: r.path })))

>>>>>>> 7d60498 (zjazd_9)
app.mount("#app")
