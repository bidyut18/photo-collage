<script setup lang="ts"></script>

<template>
  <nav>
    <div class="container is-fullhd">
      <div>
        <h1 class="title is-3">Photo-Collage</h1>
      </div>
      <h3 class="subtitle is-4">Create Your collage from photos</h3>
    </div>
  </nav>
</template>

<style scoped>
@media (max-width: 800px) {
  div > h1,
  h3 {
    margin-bottom: 0.2rem;
    text-align: center;
  }
}
@media (min-width: 1024px) {
  h1 {
    margin-bottom: 0.4rem;
  }
}
h1 {
  font-family: "Open Sans", sans-serif;
}
</style>
