<script>
export default {
    props: ["projectId"],

    data() {
        return {
            tasks: [],
            loading: true,
        }
    },

    computed: {
        backlog() {
            return this.tasks.filter((t) => t.status === "BACKLOG")
        },
    },

    async mounted() {
        console.log("Backlog projectId =", this.projectId)

        const res = await fetch(
            `http://localhost:5000/api/projects/${this.projectId}/tasks`,
        )

        const json = await res.json()
        this.tasks = json.data.tasks
        this.loading = false
    },
}
</script>
