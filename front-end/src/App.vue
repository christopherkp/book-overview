<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Title from './components/Title.vue'
import { useTokenInformationStore, useUserInformationStore, useLoggedInInformationStore } from './stores/store';
</script>

<template>
  <header>
    <div class="wrapper">
      <Title msg="Book Overview"></Title>
      <nav v-if="userLoggedIn.loggedIn === false">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/search">Find books</RouterLink>
        <RouterLink to="/login">Log in</RouterLink>
      </nav>
      <nav v-if="userLoggedIn.loggedIn === true">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/search">Find books</RouterLink>
        <RouterLink :to="`/profile/${cleanUsername(loggedInUsername.username)}`">Profile</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: #2a2d38;
  top: 0;
  left: 0;
  position: absolute;
  color: #F2EAEB;
  width: 100%;
  justify-content: left;
  border-bottom: 3px solid #a1afe0;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  color: #fff;

}

nav a.router-link-exact-active {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-color: rgb(255, 255, 255);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: #fff;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: left;
    left: 0;
    padding-right: calc(var(--section-gap) / 2);
    position: fixed;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    justify-content: left;
    align-items: left;
    margin-left: 2rem;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<script lang="ts">

export default {
  data: () => ({
    store: useTokenInformationStore(),
    userLoggedIn: useLoggedInInformationStore(),
    loggedInUsername: useUserInformationStore()
  }),

  methods: {
    handleSetLoggedInValue(bool: boolean) {
      this.userLoggedIn.setValue(bool)
    },
    cleanUsername(username: string) {
      var newUsername = username.replace(/["]/g, "");
      return newUsername;
    },
    isUserLoggedIn() {
      if (this.store.token.length > 0) {
        this.handleSetLoggedInValue(true);
        return true;
      }
      else {
        this.handleSetLoggedInValue(false);
        return false;
      }
    }
  },
  created() {
    this.store;
    this.userLoggedIn;
    this.isUserLoggedIn();
  },
}
</script>
