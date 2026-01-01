<script setup></script>

<template>
    <nav className="navbar">
        <RouterLink to="/users/1">Go to User</RouterLink>
        <RouterLink to="/users/1/projects">Go to Project</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<script setup></script>

<style scoped></style>
