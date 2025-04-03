<script setup lang="ts">
import { reactive } from 'vue';
import { useTokenInformationStore, useLoggedInInformationStore, useUserInformationStore, useBookInformationStore } from '@/stores/store';
import { useRoute } from 'vue-router';

</script>
<template>
    <div v-if="storeLoggedIn.loggedIn === true && cleanUsername(storeUserInformation.username) == username"
        id="profile">
        <div class="profile-container">
            <div class="grid-title" id="volume-title">{{ username }}</div>
            <div id="profile-wrapper">
                <div class="grid-item-profile">
                    <div id="grid-content-profile-wrapper">
                        <h1>Currently reading</h1>
                        <div id="grid-content-profile" @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent>
                            <div v-if="bookCollection.length == 0">
                                <div class="reading-list-wrapper">
                                    <p>Add books to keep track of what you are reading</p>
                                </div>
                            </div>
                            <div v-else-if="bookCollection.length > 0">
                                <div class="reading-list-wrapper">
                                    <li id="list-without-decoration" v-for="item in bookCollection" draggable="true"
                                        @dragstart="startDrag($event, item)">
                                        <div v-if="item.reading === true">
                                            <div id="reading-list-entry">
                                                <span id="reading-list-element">{{ item.bookTitle }}</span>
                                                <button id="reading-list-button-delete"
                                                    @click="handleRemoveBook(username, item.bookId)">Delete</button>
                                                <button id="reading-list-button"
                                                    @click="handleChangeReading(username, item.bookId, false)">&rarr;</button>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid-item-profile">
                    <div id="grid-content-profile-wrapper">
                        <h1>Read books</h1>
                        <div id="grid-content-profile-read" @drop="onDrop($event, 2)" @dragenter.prevent
                            @dragover.prevent>
                            <div class="reading-list-wrapper">
                                <li id="list-without-decoration" v-for="item in bookCollection" draggable="true"
                                    @dragstart="startDrag($event, item)">
                                    <div v-if="item.reading === false">
                                        <div id="reading-list-entry">
                                            <button id="reading-list-button"
                                                @click="handleChangeReading(username, item.bookId, true)">&larr;</button>
                                            <button id="reading-list-button-delete"
                                                @click="handleRemoveBook(username, item.bookId)">Delete</button>
                                            <span id="reading-list-element-read">{{ item.bookTitle }}</span>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </div>
                    </div>
                    <div v-if="storeLoggedIn.loggedIn === false">
                        <div>
                            Please log in to view your profile
                        </div>
                    </div>
                    <div
                        v-if="storeLoggedIn.loggedIn === true && cleanUsername(storeUserInformation.username) == username">
                        <div id="grid-item-description-profile">
                            <button id="logout-btn" @click="logOut">Log out</button>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    </div>
    <div v-else-if="cleanUsername(storeUserInformation.username) != username">
        <div class="profile-page-container">
            <div class="grid-title" id="volume-title">{{ username }}</div>
            <div id="profile-wrapper">
                <div class="grid-item-profile">
                    <div id="grid-content-profile-wrapper">
                        <h1>Currently reading</h1>
                        <div id="reading-list-wrapper">
                            <div v-if="bookCollection.length == 0">
                                <p>This user is not reading any books</p>
                            </div>
                            <div v-else-if="bookCollection.length > 0">
                                <div class="reading-list-wrapper">
                                    <li id="list-without-decoration" v-for="item in bookCollection">
                                        <div v-if="item.reading === true">
                                            <div id="reading-list-entry">
                                                <span id="reading-list-element">{{ item.bookTitle }}</span>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid-item-profile">
                    <div id="grid-content-profile-wrapper">
                        <h1>Read books</h1>
                        <div id="grid-content-profile-read">
                            <div class="reading-list-wrapper">
                                <li id="list-without-decoration" v-for="item in bookCollection">
                                    <div v-if="item.reading === false">
                                        <div id="reading-list-entry">
                                            <span id="reading-list-element-read">{{ item.bookTitle }}</span>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="css">
.profile-container {
    margin: auto;
    padding-top: 5rem;
    text-align: center;
    min-height: 95vh;
    max-height: 95vh;
    max-width: 100vw;
}

#logout-btn {
    background-color: #575757;
    border: solid 1px #a1afe0;
    color: #fff;
    padding-right: 15px;
    padding-left: 15px;
    margin-left: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    height: 40px;
}

#logout-btn:hover {
    outline: 3px solid rgb(59, 68, 95);
}

#grid-sub-header {
    font-size: 20px;
    font-weight: 600;
}

#list-without-decoration {
    list-style-type: none;
}

#reading-list-element {
    text-align: left;
    padding-left: 1rem;
    width: 75%;
}

#reading-list-element-read {
    text-align: right;
    padding-right: 1rem;
    width: 75%;
}

.reading-list-wrapper {
    border-top: 1px solid rgb(219, 219, 219);
}

#grid-content-profile {
    background-color: transparent;
}

#reading-list-entry {
    justify-content: space-between;
    font-size: 14px;
    border-bottom: 1px solid rgb(219, 219, 219);
    display: flex;
}

#reading-list-entry:hover {
    justify-content: space-between;
    font-size: 14px;
    background-color: #1d1d27;
    -webkit-transition: background-color 300ms linear;
    -ms-transition: background-color 300ms linear;
    transition: background-color 300ms linear;
    border-bottom: 1px solid rgb(219, 219, 219);
    display: flex;
    cursor: pointer;
    transform: 0.5s;
}

#reading-list-entry:hover #reading-list-button {
    visibility: visible;
}

#reading-list-entry:hover #reading-list-button-delete {
    visibility: visible;
}

#reading-list-button {
    background-color: transparent;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    font-weight: 1000;
    width: 25%;
    height: 50px;
    bottom: 0;
    right: 0;
    visibility: hidden;
}

#reading-list-button-delete {
    background-color: transparent;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    width: 25%;
    height: 50px;
    top: 0;
    visibility: hidden;
}

#reading-list-button:hover {
    background-color: rgb(86, 87, 114);
    -webkit-transition: background-color 300ms linear;
    -ms-transition: background-color 300ms linear;
    transition: background-color 300ms linear;
}

#reading-list-button-delete:hover {
    background-color: rgb(86, 87, 114);
    -webkit-transition: background-color 300ms linear;
    -ms-transition: background-color 300ms linear;
    transition: background-color 300ms linear;
}

#add-btn {
    background-color: #575757;
    border: none;
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
    outline: 1.5px solid rgb(168, 104, 194);
}

#grid-content-profile {
    border-radius: 20px;
    overflow: auto;
    padding: 10px;
    width: 300px;
    width: auto;
    height: 300px;
}

#grid-content-profile-read {
    border-radius: 20px;
    overflow: auto;
    padding: 10px;
    width: 300px;
    width: auto;
    height: 300px;
}


.profile-container {
    padding: 2rem;
}

#volume-description {
    height: 75%;
}

#grid-subitems-wrapperr {
    padding-top: 1rem;
}

#image {
    width: 260px;
    height: 390px;
    border: 5px solid #a1afe0;
    box-shadow: 5px 5px 0 #b7aedf;
}

.grid-title {
    font-size: 50px;
    font-weight: 400;
    padding-top: 100px;
    color: #F2EAEB;
    text-align: center;
}

#profile-wrapper {
    color: #F2FBEB;
    display: grid;
    grid-gap: 15px;
    border-radius: 30px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 2fr 2fr;
    grid-template-columns: repeat(2, 1fr);
    padding-left: 2rem;
    padding-right: 2rem;
    height: 100%;
    justify-content: space-evenly;
    width: 100%;
}

.grid-item-profile {
    width: 100%;
    min-width: 100%;
    border-radius: 3px;
    padding-top: 0.5rem;
    color: #F2EAEB;
    font-weight: 600;
}

#grid-item-description-profile {
    font-size: 14px;
    bottom: 0;
    right: 0;
    padding-bottom: 2rem;
    display: inline-block;
    position: absolute;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
}
</style>

<script lang="ts">
const storeUserInformation = useUserInformationStore();
const storeLoggedIn = useLoggedInInformationStore();
const storeToken = useTokenInformationStore();
const storeSearchResult = useBookInformationStore();
const route = useRoute();

var bookCollection: Array<Object> = reactive([{}]);
var username = "";

export default {
    data: () => ({
        loggedInUsername: useUserInformationStore()
    }),
    methods: {
        getRouteId() {
            const route = useRoute();
            username = route.params.username.toString();
        },
        getToRouteId(route: object) {
            username = route.params.username.toString();;
        },
        handleShowCollection() {
            var name = this.cleanUsername(username);
            this.getUserInformation(name);
        },

        getUserInformation(user: string) {
            var obj = {
                username: user,
            }
            fetch('http://localhost:3000/user/books', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + storeToken.token
                },
                body: JSON.stringify(obj)
            }).then(res => res.json())
                .then(res => {
                    bookCollection.length = 0;
                    res.bookCollection.forEach((value: Object) => {
                        bookCollection.push(value);
                    });
                })
        },

        handleChangeReading(username: string, bookId: number, reading: boolean) {
            var name = this.cleanUsername(username);
            this.changeReading(name, bookId, reading);
        },

        changeReading(username: string, bookId: number, reading: boolean) {
            var obj = {
                username: username,
                bookId: bookId,
                reading: reading
            }
            fetch('http://localhost:3000/user/reading', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + storeToken.token
                },
                body: JSON.stringify(obj)
            }).then(res => res.json())
                .then(res => {
                    this.handleShowCollection();
                })
        },

        handleRemoveBook(username: string, bookId: number) {
            var name = this.cleanUsername(username);
            this.removeBook(name, bookId);
        },

        removeBook(username: string, bookId: number) {
            var obj = {
                username: username,
                bookId: bookId,
            }
            fetch('http://localhost:3000/user/remove', {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + storeToken.token
                },
                body: JSON.stringify(obj)
            }).then(res => res.json())
                .then(res => {
                    this.handleShowCollection();
                })
        },

        outputBookCollection(collection: object) {
            var text = JSON.stringify(collection);
            var textReplaceQuotations = text.replace(/["]/g, " ");
            var textReplaceBrackets = textReplaceQuotations.replace(/[\[\]']+/g, '');
            return textReplaceBrackets;
        },

        startDrag(event, item) {
            event.dataTransfer.dropEffect = "move";
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("bookId", item.bookId);
        },

        onDrop(event: Event, location: number) {
            const itemID = event.dataTransfer.getData("bookId");
            for (let entry of bookCollection) {
                if (entry.bookId == itemID && location == 1) {
                    this.handleChangeReading(storeUserInformation.username, entry.bookId, true);
                }
                else if (entry.bookId == itemID && location == 2) {
                    this.handleChangeReading(storeUserInformation.username, entry.bookId, false);
                }
            }
            this.handleShowCollection();
        },

        cleanUsername(text: string) {
            var newText = text.replace(/["]/g, "");
            return newText;
        },

        logOut() {
            storeToken.clearToken();
            storeUserInformation.clearUserInformation();
            storeSearchResult.clearSearchResult();
            this.$router.push("/");
        },
    },
    created() {
        this.getRouteId();
        this.handleShowCollection();
    },
    watch: {
        $route(to, from) {
            this.getToRouteId(to);
            this.handleShowCollection();
        }
    }
}
</script>
