<script setup>
</script>

<template>
    <nav className="navbar">
        <RouterLink to="/users/1">Go to User</RouterLink>
        <RouterLink to="/projects/1">Go to Project</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<style scoped>
</style>
