<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h3>
      Book Overview
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
  margin: 0 auto;
  padding-top: 0.5rem;
  background-color: #2a2d38;

}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: center;
    margin: 0 auto;
    color: #F2EAEB;
    background-color: #2a2d38;
    font-size: 30px;
    font-weight: 600;

  }
}
</style>
