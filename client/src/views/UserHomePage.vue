<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const user = ref(null);
const tasks = ref([]);
const route = useRoute();

onMounted(async () => {
  const userId = route.params.userId;

  try {
    const userRes = await fetch(`/api/users/${userId}`);
    // TODO zająć się error handlingiem
    if (userRes.ok) {
      const resJson = await userRes.json();
      if (resJson.success) {
        user.value = resJson.data.user;
      }
    }

    /*
        const tasksRes = await fetch(`/api/users/${userId}/tasks`)
        if (tasksRes.ok) {
            tasks.value = await tasksRes.json()
        }
        */
  } catch (err) {
    console.log({ err });
  }
});
</script>

<template>
  <section v-if="user">
    <h2>Profile</h2>
    <p>Username: {{ user.name }}</p>
    <p>Email: {{ user.email }}</p>
    <p>Id: {{ user.user_id }}</p>
  </section>

  <section v-if="tasks.length">
    <h2>Your Tasks</h2>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} - {{ task.description }}
      </li>
    </ul>
  </section>
</template>
