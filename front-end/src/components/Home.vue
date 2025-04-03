<script setup lang="ts">
import { useTokenInformationStore, useLoggedInInformationStore, useUserInformationStore } from '../stores/store.ts'
import { ref } from 'vue';

</script>
<template>
    <div class="home-container">
        <div class="home-wrapper">
            <div id="home-content" v-if="userLoggedIn.loggedIn === false">
                <div id="home-title">Welcome</div>
                <div id="home-welcome">
                    <div class="home-text-content">
                        <p>To get started it is suggested to create a user account and search for books that you are
                            currently reading or have previously
                            read. You can then view and manage your collection from your profile.</p>
                    </div>
                </div>
                <div id="home-title-about">
                    <div class="home-text-content">
                        <p>This website uses Google Books API.</p>
                    </div>
                </div>
            </div>
            <div id="home-wrapper" v-if="userLoggedIn.loggedIn === true">
                <div id="home-title">Hi, {{ cleanUsername(loggedInUsername.username) }}!</div>
                <div id="home-welcome-wrapper">
                    <h1 class="center"></h1>
                    <div class="home-text-content">
                        <p>You can view your current collection of books by navigating to your profile.</p>
                    </div>
                </div>
                <div id="home-about-wrapper">
                    <div class="home-text-content">
                        <p>You can add books you are reading or have previously read by navigating to find books and
                            using the search functionality.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css">
.home-container {
    padding-top: 10rem;
    width: 50%;
    margin: auto;
}

#home-wrapper {
    background-color: transparent;
    border-radius: 25px;
    margin-top: 1rem;
    color: #fff;
    width: 100%;
    display: inline-block;
    height: 300px;
}

.home-content {
    width: 100%;
    padding-top: 100px;
    height: 800px;
    text-align: center;
}

#home-title {
    text-align: center;
    font-size: 50px;
    width: 100%;
}

#home-welcome-wrapper {
    display: inline-block;
    max-width: 500px;
    min-width: 250px;
    vertical-align: top;
}

.home-text-content {
    padding: 2rem;
}

#home-about-wrapper {
    display: inline-block;
    vertical-align: top;
}
</style>

<script lang="ts">
const isLoggedIn = ref(false);

export default {
    data: () => ({
        store: useTokenInformationStore(),
        userLoggedIn: useLoggedInInformationStore(),
        loggedInUsername: useUserInformationStore()
    }),

    methods: {
        isUserLoggedIn() {
            if (this.store.token.length > 0) {
                this.handleSetLoggedInValue(true);
                isLoggedIn.value = true;
                return true;
            }
            else {
                this.handleSetLoggedInValue(false);
                isLoggedIn.value = false;
                return false;
            }
        },
        handleSetLoggedInValue(bool: boolean) {
            this.userLoggedIn.setValue(bool)
        },
        cleanUsername(text: string) {
            var newText = text.replace(/["]/g, "");
            return newText;
        },
    },
    created() {
        this.store;
        this.userLoggedIn;
        this.loggedInUsername;
        this.isUserLoggedIn();
    },
}
</script>
