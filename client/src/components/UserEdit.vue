<script setup>
import { ref, watch } from "vue"

const props = defineProps({
    user: Object,
})

const name = ref("")
const email = ref("")

watch(
    () => props.user,
    (u) => {
        if (u) {
            name.value = u.name
            email.value = u.email
        }
    },
    { immediate: true }
)

const save = async () => {
    await fetch(`/api/users/${props.user.user_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
        }),
    })
}
</script>

<template>
    <section>
        <h3>Edit user</h3>
        <input v-model="name" placeholder="Name" />
        <input v-model="email" placeholder="Email" />
        <button @click="save">Save</button>
    </section>
</template>
