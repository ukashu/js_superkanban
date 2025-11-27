<template>
  <div>
    <nav style="margin-bottom: 20px">
      <a href="/tasks">Taski</a>
    </nav>

    <router-view />
  </div>
</template>

<script setup></script>

<style scoped>
nav a {
  margin-right: 16px;
  font-weight: bold;
  text-decoration: none;
  color: #42b883;
}

nav a:hover {
  text-decoration: underline;
}
</style>
