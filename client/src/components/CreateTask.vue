<template>
    <div class="create-task">
        <h3>Create Task</h3>

        <form @submit.prevent="createTask">
            <label>Title:</label>
            <input v-model="title" required />

            <label>Description:</label>
            <textarea v-model="description"></textarea>

            <button type="submit">Create task</button>
        </form>

        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
export default {
    props: ["projectId"],

    data() {
        return {
            title: "",
            description: "",
            message: "",
        }
    },

    methods: {
        async createTask() {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/projects/${this.projectId}/tasks`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: this.title,
                            description: this.description,
                        }),
                    },
                )

                const json = await res.json()
                this.message = json.message || "Task created!"
                this.$emit("refresh")
            } catch (err) {
                console.log("Error creating task: ", err)
            }
        },
    },
}
</script>
