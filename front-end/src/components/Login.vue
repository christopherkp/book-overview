<script setup lang="ts">
import { useTokenInformationStore, useLoggedInInformationStore, useUserInformationStore } from '@/stores/store';
</script>

<template>
  <div class="login-container">
    <div v-if="storeLoggedIn.loggedIn === false">
      <h1 id="login-title">Log in</h1>
      <div class="login-form">
        <p>Please enter your login credentials</p>
        <div id="login-form-username">
          <label for="username">Username: </label>
          <input type="text" id="username" maxlength="10" v-model="form.username" required>
        </div>
        <div id="login-form-password">
          <label for="password">Password: &nbsp;</label>
          <input type="password" id="password" maxlength="15" v-model="form.password" required>
        </div>
        <div id="login-form-submit-btn">
          <button type="submit" id="login-submit-btn"
            @click="postUserInformation(form.username, form.password)">Login</button>
        </div>
        <div id="register-form-to-login">
          <router-link to="/register">Don't have an account?</router-link>
        </div>
      </div>
    </div>
    <div v-if="storeLoggedIn.loggedIn === true">
      <div>
        You are already logged in as {{ storeUsername.username }}
      </div>
    </div>
  </div>

</template>

<style lang="css">
.login-container {
  padding-top: 100px;
  color: #F2EAEB;
  width: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

#login-title {
  text-align: center;
  font-size: 50px;
  padding-top: 100px;
}

.login-form {
  height: 400px;
  text-align: center;
  padding: 1rem;
}

.login-form>* {
  margin: 30px 0;
}

#login-submit-btn {
  background-color: #575757;
  border: solid 1px #a1afe0;
  color: white;
  padding-right: 15px;
  padding-left: 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  height: 40px;
}

#login-submit-btn:hover {
  outline: 1.5px solid rgb(119, 118, 180);
}
</style>

<script lang="ts">
const storeUsername = useUserInformationStore();
const storeLoggedIn = useLoggedInInformationStore();
const storeToken = useTokenInformationStore();

const handleStoreUsername = (username: string) => {
  storeUsername.setUserInformation(username);
}

const handleStoreToken = (responseToken: string) => {
  storeToken.storeToken(responseToken);
}
const handleClearToken = () => {
  storeToken.clearToken();
}

export default {
  data: () => {
    return {
      form: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    postUserInformation(user: string, pass: string) {
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      var validated = false;
      if (username.length > 0 && password.length > 0) {
        validated = true;
      }
      else {
        alert("You are missing a required field.");
        validated = false;
      }
      if (validated) {
        var obj = {
          username: user,
          password: pass
        }
        var tokenData = {};
        var tokenToString = "";

        fetch('http://localhost:3000/user/login', {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Bearer',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(obj)
        }).then(Response => Response.json())
          .then(data => {
            handleClearToken();
            tokenData = data;
            tokenToString = tokenData.accessToken;
            var username = JSON.stringify(obj.username);
            handleStoreUsername(username);
            handleStoreToken(tokenToString);
            this.$router.push('/');
            this.$router.go(1);
            this.$forceUpdate();
          })
      }

    },
  }
}

</script>