<script setup>
import { ref, watch } from "vue"
import Dialog from "primevue/dialog"
import InputText from "primevue/inputtext"
import Button from "primevue/button"

const props = defineProps({
    user: Object,
})

const emit = defineEmits(["user-updated"])

const name = ref("")
const email = ref("")
const visible = ref(false)

watch(
    () => props.user,
    (u) => {
        if (u) {
            name.value = u.name
            email.value = u.email
        }
    },
    { immediate: true },
)

const save = async () => {
    const res = await fetch(`/api/users/${props.user.user_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
        }),
    })
    if (res.ok) {
        emit("user-updated", { name: name.value, email: email.value })
        visible.value = false
    }
}
</script>

<template>
    <Button
        icon="pi pi-pencil"
        text
        rounded
        aria-label="Edit"
        @click="visible = true"
    />

    <Dialog
        v-model:visible="visible"
        modal
        header="Edit User"
        :style="{ width: '25rem' }"
    >
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="name" class="font-bold">Name</label>
                <InputText id="name" v-model="name" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="email" class="font-bold">Email</label>
                <InputText id="email" v-model="email" />
            </div>
            <div class="flex justify-end gap-2">
                <Button
                    label="Cancel"
                    severity="secondary"
                    @click="visible = false"
                />
                <Button label="Save" @click="save" />
            </div>
        </div>
    </Dialog>
</template>
