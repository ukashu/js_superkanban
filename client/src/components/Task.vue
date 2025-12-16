<template>
  <div class="task-card">
    <div class="task-card__header">
      <h4 class="task-card__title">{{ task.title }}</h4>
    </div>
    <div class="task-card__body">
      <p class="task-card__description">{{ task.description }}</p>
    </div>
    <div class="task-card__footer">
        <p>Assigned to: {{ task.assignee_name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskCard",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.task-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
  color: #213547;
}

.task-card__title {
  margin: 0;
}
</style>
