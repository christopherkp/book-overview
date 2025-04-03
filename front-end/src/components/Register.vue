<script setup lang="ts">
import { userInformation } from '@/stores/store';
import { useLoggedInInformationStore, useUserInformationStore } from '@/stores/store';
</script>

<template>
  <div class="register-container">
    <div v-if="storeLoggedIn.loggedIn === false">
      <div class="register-wrapper">
        <h1 id="register-title">Register</h1>
        <div class="register-form">
          <p>Please enter a username and password</p>
          <div id="register-form-username">
            <label for="username">Username: </label>
            <input type="text" id="username" maxlength="10" v-model="form.username" required>
          </div>
          <div id="register-form-password">
            <label for="password">Password: &nbsp;</label>
            <input type="password" id="password" maxlength="15" v-model="form.password" required>
          </div>
          <div id="register-form-submit-btn">
            <button type="submit" id="register-submit-btn"
              @click="postUserInformation(form.username, form.password)">Register</button>
          </div>
          <div id="register-form-to-login">
            <router-link to="/login">Back to login</router-link>
          </div>
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
.register-container {
  padding-top: 100px;
  color: #F2EAEB;
  width: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

#register-title {
  text-align: center;
  font-size: 50px;
  padding-top: 100px;
}

.register-form {
  height: 400px;
  text-align: center;
  padding: 1rem;
}

.register-form>* {
  margin: 30px 0;
}

#register-form-to-login {
  text-align: center;
}

#register-submit-btn {
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

#register-submit-btn:hover {
  outline: 1.5px solid rgb(125, 104, 180);
}
</style>

<script lang="ts">
const storeLoggedIn = useLoggedInInformationStore();
const storeUsername = useUserInformationStore();

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
        userInformation.length = 0;
        var obj = {
          username: user,
          password: pass
        }

        userInformation.push(obj);
        fetch('http://localhost:3000/user', {
          method: 'POST',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj)
        }).then(res => res.json())
          .then(res => { console.log(res) });
        this.$router.push("/login");
      }

    }
  }
}

</script>