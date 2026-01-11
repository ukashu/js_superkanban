<script setup>
import { ref, defineEmits } from "vue";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const props = defineProps(["projectId", "taskId"]);
const emit = defineEmits(["assigned"]);

const searchEmail = ref("");
const users = ref([]);
const selectedUser = ref(null);
const message = ref("");
const loadingUsers = ref(false);

async function findUser() {
    loadingUsers.value = true;
    try {
        // Debounce could be added here if needed, but keeping it simple as per original
        const res = await fetch(`/api/users?email=${searchEmail.value}`);
        const json = await res.json();
        users.value = json.data;
    } catch (err) {
        console.error(err);
    } finally {
        loadingUsers.value = false;
    }
}

async function assign() {
    if (!selectedUser.value) {
        message.value = "Please select a user.";
        return;
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
        );

        const json = await res.json();
        message.value = json.message || "Assigned!";
        emit("assigned");
    } catch (err) {
        message.value = "Error assigning user.";
        console.error(err);
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
                        <span class="font-bold">{{ slotProps.option.name }}</span>
                        <span class="text-sm">{{ slotProps.option.email }}</span>
                    </div>
                </template>
                 <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex flex-col">
                         <!-- slotProps.value is the user_id (optionValue), we need to find the user object to display details if we want rich display, 
                              but standard dropdown behavior displays the optionLabel (email) if not templated or simple string.
                              Actually, standard Dropdown displays optionLabel.
                              To display rich content for selected value, we need to find the option. 
                              However, `slotProps.value` is just the ID. 
                              Let's just let it display the email (default behavior) or customize if we had the object.
                              If `optionValue` is set, `v-model` is the value. 
                              Let's stick to default display for selected item (email) to avoid complexity finding the object again.
                         -->
                         <span>{{ users.find(u => u.user_id === slotProps.value)?.email || slotProps.value }}</span>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
            </Dropdown>
            <small v-if="users.length === 0 && searchEmail && !loadingUsers">No users found.</small>
        </div>

        <div class="flex justify-end gap-2 mt-2">
            <Button label="Confirm" @click="assign" :disabled="!selectedUser" />
        </div>

        <p v-if="message" class="text-green-600">{{ message }}</p>
    </div>
</template>

<style scoped>
.flex { display: flex; }
.flex-col { flex-direction: column; }
.gap-4 { gap: 1rem; }
.gap-2 { gap: 0.5rem; }
.text-lg { font-size: 1.125rem; }
.font-bold { font-weight: bold; }
.w-full { width: 100%; }
.text-sm { font-size: 0.875rem; }
.justify-end { justify-content: flex-end; }
.mt-2 { margin-top: 0.5rem; }
.text-green-600 { color: #059669; }
</style>
