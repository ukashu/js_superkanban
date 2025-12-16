<script setup></script>

<template>
    <nav className="navbar">
        <RouterLink to="/users/1">Go to User</RouterLink>
        <RouterLink to="/projects/1">Go to Project</RouterLink>
        <RouterLink to="/projects/1/tasks">Go to Tasks</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<script setup></script>

<style scoped></style>
