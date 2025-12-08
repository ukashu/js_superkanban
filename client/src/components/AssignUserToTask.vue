<template>
  <div>
    <h3>Assign user to task {{ taskId }}</h3>

    <div v-if="loadingUsers">Loading users...</div>

    <div v-else>
      <select v-model="selectedUser">
        <option disabled value="">-- choose user --</option>
        <option v-for="u in users" :key="u.user_id" :value="u.user_id">
          {{ u.name }} ({{ u.email }})
        </option>
      </select>

      <button @click="assign">Confirm</button>
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: ["projectId", "taskId"],

  data() {
    return {
      users: [],
      selectedUser: "",
      loadingUsers: true,
      message: "",
    };
  },

  async mounted() {
    const res = await fetch(
      `http://localhost:5000/api/projects/${this.projectId}/tasks`
    );
    const json = await res.json();
    this.users = json.data;
    this.loadingUsers = false;
  },

  methods: {
    async assign() {
      const res = await fetch(
        `http://localhost:5000/api/projects/${this.projectId}/tasks/${this.taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignee_id: this.selectedUser,
            status: "DOING",
          }),
        }
      );

      const json = await res.json();
      this.message = json.message || "Assigned!";
      this.$emit("assigned");
    },
  },
};
</script>
