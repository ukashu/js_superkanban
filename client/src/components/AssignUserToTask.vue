<script setup>
import { ref, defineEmits } from "vue"
import InputText from "primevue/inputtext"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"

const props = defineProps(["projectId", "taskId"])
const emit = defineEmits(["assigned"])

const searchEmail = ref("")
const users = ref([])
const selectedUser = ref(null)
const message = ref("")
const loadingUsers = ref(false)

async function findUser() {
    loadingUsers.value = true
    try {
        const res = await fetch(`/api/users?email=${searchEmail.value}`)
        const json = await res.json()
        users.value = json.data
    } catch (err) {
        console.error(err)
    } finally {
        loadingUsers.value = false
    }
}

async function assign() {
    if (!selectedUser.value) {
        message.value = "Please select a user."
        return
    }

    try {
        const res = await fetch(
            `/api/projects/${props.projectId}/tasks/${props.taskId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignee_id: selectedUser.value,
                    status: "DOING",
                }),
            },
        )

        const json = await res.json()
        message.value = json.message || "Assigned!"
        emit("assigned")
    } catch (err) {
        message.value = "Error assigning user."
        console.error(err)
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <h3 class="text-lg font-bold">Assign user to task {{ taskId }}</h3>

        <div class="flex flex-col gap-2">
            <label for="search" class="font-bold">Search User by Email</label>
            <InputText
                id="search"
                v-model="searchEmail"
                @input="findUser"
                placeholder="Type email to search..."
            />
            <small v-if="loadingUsers">Searching...</small>
        </div>

        <div class="flex flex-col gap-2" v-if="users.length > 0 || searchEmail">
            <label for="userSelect" class="font-bold">Select User</label>
            <Dropdown
                id="userSelect"
                v-model="selectedUser"
                :options="users"
                optionLabel="email"
                optionValue="user_id"
                placeholder="Select a user"
                class="w-full"
                :disabled="users.length === 0"
            >
                <template #option="slotProps">
                    <div class="flex flex-col">
                        <span class="font-bold">{{
                            slotProps.option.name
                        }}</span>
                        <span class="text-sm">{{
                            slotProps.option.email
                        }}</span>
                    </div>
                </template>
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex flex-col">
                        <span>{{
                            users.find((u) => u.user_id === slotProps.value)
                                ?.email || slotProps.value
                        }}</span>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
            </Dropdown>
            <small v-if="users.length === 0 && searchEmail && !loadingUsers"
                >No users found.</small
            >
        </div>

        <div class="flex justify-end gap-2 mt-2">
            <Button label="Confirm" @click="assign" :disabled="!selectedUser" />
        </div>

        <p v-if="message" class="text-green-600">{{ message }}</p>
    </div>
</template>

<style scoped></style>
