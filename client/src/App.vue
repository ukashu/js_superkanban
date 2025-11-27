<script setup>
</script>

<template>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <nav>
        <RouterLink to="/users">Go to User</RouterLink>
        <RouterLink to="/projects/:projectId">Go to Project</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<style scoped>
</style>
