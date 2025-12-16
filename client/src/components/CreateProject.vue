<template>
    <div class="create-project">
        <h2>Create New Project</h2>

        <form @submit.prevent="submitForm">
            <label>Project title:</label>
            <input v-model="title" required />

            <label>Description:</label>
            <textarea v-model="description"></textarea>

            <button type="submit">Create</button>
        </form>

        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: "",
            description: "",
            message: "",
        }
    },

    methods: {
        async submitForm() {
            const res = await fetch("http://localhost:5000/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: this.title,
                    description: this.description,
                }),
            })

            const json = await res.json()
            this.message = json.message || "Created!"
        },
    },
}
</script>
