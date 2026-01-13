<script setup>
import { ref } from "vue"
import Menubar from "primevue/menubar"
import Button from "primevue/button"
import { useRouter } from "vue-router"

const router = useRouter()

const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    router.push("/login")
}

const items = ref([
    {
        label: "User",
        icon: "pi pi-user",
        route: "/users/1",
    },
    {
        label: "Projects",
        icon: "pi pi-folder",
        route: "/users/1/projects",
    },
    {
        label: "Login",
        icon: "pi pi-sign-in",
        route: "/login",
    },
    {
        label: "Register",
        icon: "pi pi-user-plus",
        route: "/register",
    },
])
</script>

<template>
    <div class="app-layout">
        <div class="card">
            <Menubar :model="items">
                <template #item="{ item, props, hasSubmenu }">
                    <router-link
                        v-if="item.route"
                        v-slot="{ href, navigate }"
                        :to="item.route"
                        custom
                    >
                        <a :href="href" v-bind="props.action" @click="navigate">
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a
                        v-else
                        :href="item.url"
                        :target="item.target"
                        v-bind="props.action"
                    >
                        <span :class="item.icon" />
                        <span class="ml-2">{{ item.label }}</span>
                        <span
                            v-if="hasSubmenu"
                            class="pi pi-fw pi-angle-down ml-2"
                        />
                    </a>
                </template>
                <template #end>
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        @click="logout"
                    />
                </template>
            </Menubar>
        </div>
        <main class="app-content p-4">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.app-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.app-content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
}
</style>
