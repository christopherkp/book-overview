<script setup lang="ts">
import { useTokenInformationStore, useLoggedInInformationStore, useUserInformationStore } from '@/stores/store';
import { bookInformation } from '@/stores/store';
import { useRoute } from 'vue-router';

</script>
<template>
  <div class="book-container">
    <div v-for="(value, index) in bookInformation" :key="index">
      <div class="book-content-wrapper">
        <div class="grid-title">{{ value.volumeInfo.title }}</div>
        <div class="grid-item" id="grid-subitems">
          <h1 id="grid-sub-header"> </h1>
          <div v-if="value.volumeInfo.averageRating != null" class="grid-subitem">Average
            Rating:
            {{ value.volumeInfo.averageRating }}</div>
          <div v-if="value.volumeInfo.publishedDate != null" class="grid-subitem">Published: {{
            value.volumeInfo.publishedDate }}</div>
          <div v-if="value.volumeInfo.publisher != null" class="grid-subitem">Publisher: {{
            value.volumeInfo.publisher }}</div>
          <div v-if="value.volumeInfo.pageCount != null" class="grid-subitem">Page count: {{
            value.volumeInfo.pageCount }}</div>
        </div>
        <div class="grid-item-image"><img id="image" v-bind:src=getImage(value.volumeInfo.imageLinks)>
        </div>
        <div v-if="value.volumeInfo.description != null" id="grid-item-description"><i>"{{
          cleanDescription(value.volumeInfo.description) }}"</i></div>
        <div v-else>Description is not available for this book.</div>
        <div v-if="storeLoggedIn.loggedIn === true">
          <div id="add-btn-wrapper"> <button id="add-btn"
              @click="handleAddBookToCollection(storeUsername.username, value.volumeInfo.title, true)">Add to currently
              reading</button>
            <button id="add-btn"
              @click="handleAddBookToCollection(storeUsername.username, value.volumeInfo.title, false)">Add to
              previously
              read</button>
          </div>
        </div>
        <div v-if="storeLoggedIn.loggedIn === false">
          <div id="login-notice">Please log in if you want to add this book to your collection</div>
        </div>
      </div>
    </div>
  </div>

</template>
<style lang="css">
.book-container {
  width: 50%;
  margin: auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-content-wrapper {
  border-radius: 25px;
  margin-top: 1rem;
  color: #fff;
  width: 100%;
  display: inline-block;
  min-height: 100vh;
}

.grid-title {
  font-size: 40px;
  font-weight: 400;
  padding-top: 100px;
  text-align: center;
  color: #F2EAEB;
}

.grid-item {
  max-height: 350px;
  min-width: 350px;
  max-width: 350px;
  width: 100%;
  align-items: center;
  text-align: center;
  border-radius: 3px;
  padding-top: 0.5rem;
  padding-left: 5rem;
  color: #F2EAEB;
  font-weight: 600;
}

#grid-subitems {
  padding-top: 1rem;
}

.grid-subitem {
  grid-column: 3 / 6;
  grid-row: 1 / 3;
  font-weight: 600;
  color: #F2EAEB;
}

#grid-sub-header {
  font-size: 20px;
  font-weight: 600;
}

.grid-item-image {
  max-height: 350px;
  min-width: 350px;
  max-width: 350px;
  width: 100%;
  align-items: center;
  text-align: center;
  border-radius: 3px;
  padding-top: 0.5rem;
  padding-left: 5rem;
  color: #F2EAEB;
  font-weight: 600;
  font-size: 14px;
  bottom: 0;
  display: inline-block;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}

#image {
  width: 260px;
  height: 390px;
  border: 5px solid #a1afe0;
  box-shadow: 5px 5px 0 #b7aedf;
}

#grid-item-description {
  font-size: 14px;
  bottom: 0;
  display: inline-block;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}


#add-btn-wrapper {
  padding-top: 2rem;
}

#add-btn {
  background-color: #575757;
  border: solid 1px #a1afe0;
  color: white;
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  height: 40px;
}

#add-btn:hover {
  outline: 3px solid rgb(59, 68, 95);
}

#login-notice {
  background-color: rgb(99, 96, 250);
  color: #fff;
  width: 415px;
  padding-left: 10px;
}
</style>

<script lang="ts">
var terms = "";
const storeToken = useTokenInformationStore();
const storeUsername = useUserInformationStore();
const storeLoggedIn = useLoggedInInformationStore();

export default {

  methods: {

    getRouteId() {
      bookInformation.length = 0;
      const route = useRoute();
      terms = route.params.id.toString();
    },

    // Find the selected book
    getBook(id: String) {
      const searchUrl = "https://www.googleapis.com/books/v1/volumes/" + id + "?q="
      fetch(searchUrl).then(function (response) {
        return response.json();
      }).then(function (data) {
        bookInformation.length = 0;
        if (data.length >= 1) {
          data.forEach((element: { id: String; }) => {
            if (element.id != id) {
              const index = data.indexOf(element);
              if (index > -1) {
                data.items.splice(index, 1)
              }
            }
          });
        }
        bookInformation.push(data);
      }).catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
    },

    addBookToCollection(username: string, bookTitle: string, reading: boolean) {
      var obj = {
        username: username,
        bookTitle: bookTitle,
        reading: reading
      }
      fetch('http://localhost:3000/user', {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + storeToken.token
        },
        body: JSON.stringify(obj)
      }).then(res => res.json())
        .then(res => {
          console.log(res);
        })
    },

    handleAddBookToCollection(username: string, bookTitle: string, reading: boolean) {
      var name = this.cleanUsername(username);
      this.addBookToCollection(name, bookTitle, reading)
    },

    cleanDescription(description: string) {
      var newDescription = description.replace(/<\/?[^>]+(>|$)/g, "");
      var maxLength = 1000;
      var suffix = "...";
      var newDescription = newDescription.substring(0, maxLength);
      if (newDescription.length >= 1000) {
        newDescription += suffix;
      }
      return newDescription;
    },

    cleanUsername(username: string) {
      var newUsername = username.replace(/["]/g, "");
      return newUsername;
    },

    getImage(images: object) {
      var returnImage = " ";
      var found = false;
      var result = Object.entries(images);
      for (const resolution of result) {
        if (resolution[0] == "medium") {
          returnImage = resolution[1];
          continue;

        }
        else if (resolution[0] == "small") {
          returnImage = resolution[1];
          continue;

        }
        else if (resolution[0] == "thumbnail") {

          returnImage = resolution[1];
          continue;

        }
        else if (resolution[0] == "thumbnailsmall") {

          returnImage = resolution[1];
          continue;
        }
        found = true;
      }
      if (returnImage.length > 0 && found == true) {

        return returnImage;
      }
    },
  },
  created() {
    this.getRouteId();
    this.getBook(terms);
  },
}
</script>
