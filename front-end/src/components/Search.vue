<script setup lang="ts">
import { booksInSearchResult, bookInformation, useBookInformationStore } from '../stores/store.ts'
import { ref } from 'vue';
</script>

<template>
  <div class="search-container">
    <div id="search-wrapper">
      <div id="searchbar-wrapper">
        <input id="search" placeholder="Search for books by title, subtitle or author(s)" maxlength="50" :value="terms"
          @input="event => terms = event.target.value">
        <button id="search-result-btn" @click="getSearchResults(terms)">Search</button>
      </div>
      <div id="results-wrapper" v-if="showSearchResults === true">
        <li id="search-result-element" v-for="(value, index) in store.bookResults" :key="index">
          <router-link :to="`/book/${value.id}`" @click="toBook(value)">{{ value.volumeInfo.title }}</router-link>
          <div>{{ convertAuthorsType(value.volumeInfo.authors) }}</div>
          <div id="search-result-description"><i>{{ truncateDescription(value.volumeInfo.description) }}</i></div>
        </li>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.search-container {
  padding-top: 100px;
  color: #F2EAEB;
  width: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

#search-result-element {
  list-style: none;
}

#search-wrapper {
  height: 100%;
  background-color: transparent;
}

#searchbar-wrapper {
  padding-top: 2rem;
  text-align: center;
}

#search-bar {
  width: 500px;
}

ul {
  list-style-type: number;
}

#search-result-description {
  text-align: left;
}

#results-wrapper {
  padding-top: 1rem;

}

#search {
  width: 500px;
  padding: 0.5rem;
  height: 100%;
}

#search-result-btn {
  background-color: #575757;
  border: 1px solid #a1afe0;
  color: white;
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

#search-result-btn:hover {
  outline: 3px solid rgb(59, 68, 95);
}
</style>

<script lang="ts">

const terms = "";
const store = useBookInformationStore();
const showSearchResults = true;

const handleSearchResults = (thisObj: object[]) => {
  store.pushToObject(thisObj);
}
const handleEmptySearchResults = () => {
  booksInSearchResult.length = 0;
  store.clearSearchResult();
}

export default {

  methods: {

    // Find available books from the given query
    getSearchResults(searchTerms: String) {
      const searchUrl = "https://www.googleapis.com/books/v1/volumes?q=" + searchTerms + "&langRestrict=en&printType=books&maxResults=20"
      fetch(searchUrl).then(function (response) {
        return response.json();
      }).then(function (data) {
        handleEmptySearchResults();
        data.items.forEach((element: { volumeInfo: { title: String; subtitle: String; }; }, imageLinks: { images: String }) => {
          if (element.volumeInfo.subtitle != null) {
            booksInSearchResult.push(element);
          }
          else {
            booksInSearchResult.push(element);
          }
        });
        handleSearchResults(booksInSearchResult);
      }).catch(function (err) {
        console.log('Fetch Error :-S', err);
      });

    },
    // Help for navigation to an individual book
    toBook(values: Object) {
      bookInformation.length = 0;
      if (values.id) {
        bookInformation.push(values);
      }
    },
    truncateDescription(description: String) {
      if (description) {
        var length = 200;
        var suffix = "...";
        var truncatedDescription = description.substring(0, length);
        truncatedDescription += suffix;
        return truncatedDescription;
      }
      else {
        return '';
      }
    },
    convertAuthorsType(authors: string) {
      if (authors) {
        var result = authors.toString();
        return result;
      }
      else {
        ''
      }
    },
  },
}

</script>