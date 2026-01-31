<script setup>
import { ref, computed, onMounted } from "vue"
import Menubar from "primevue/menubar"
import Button from "primevue/button"
import { useRouter } from "vue-router"

const router = useRouter()

const userId = ref(null)
const isLoggedIn = ref(false)
const isAdmin = ref(false)
const refreshAuth = () => {
    userId.value = localStorage.getItem("user_id")
    isLoggedIn.value = !!localStorage.getItem("token")
    isAdmin.value = !!localStorage.getItem("is_admin")
}

onMounted(() => {
    refreshAuth()
    console.log({ isAdmin: isAdmin.value })
})

const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("is_admin")
    isLoggedIn.value = false
    isAdmin.value = false
    router.push("/login")
}

const items = computed(() => {
    if (isLoggedIn.value && isAdmin.value) {
        return [
            {
                label: "User (admin)",
                icon: "pi pi-hashtag text-red-600",
                route: `/users/${userId.value}`,
            },
            {
                label: "Projects",
                icon: "pi pi-folder",
                route: `/users/${userId.value}/projects`,
            },
        ]
    }
    if (isLoggedIn.value) {
        return [
            {
                label: "User",
                icon: "pi pi-user",
                route: `/users/${userId.value}`,
            },
            {
                label: "Projects",
                icon: "pi pi-folder",
                route: `/users/${userId.value}/projects`,
            },
        ]
    } else {
        return [
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
        ]
    }
})
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
                        v-if="isLoggedIn"
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
