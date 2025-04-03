import { reactive, ref, watch} from 'vue'
import { defineStore } from 'pinia';

export const booksInSearchResult: object[] = reactive([]);
export const bookInformation: object[] = reactive([]);
export const userInformation: object[] = reactive([]);

export const useLoggedInInformationStore = defineStore("loggedIn", () => {
    const loggedIn = ref(false); 

    const setValue = (bool: boolean) => {
        loggedIn.value = bool; 
    }

    if (sessionStorage.getItem("loggedIn")) {
        loggedIn.value = JSON.parse(sessionStorage.getItem("loggedIn"));
    }

    watch(
        loggedIn,
        (loggedInVal) => {
            sessionStorage.setItem("loggedIn", JSON.stringify(loggedInVal));
        },
        {deep: true}
    );
    return {loggedIn, setValue}

})

export const useUserInformationStore = defineStore("username", () => {
    const username = ref(''); 

    const setUserInformation = (uname: string) => {
        username.value = uname; 
    }

    const clearUserInformation = () => {
        username.value = "";
    }
 
    if (sessionStorage.getItem("username")) {
        username.value = JSON.parse(sessionStorage.getItem("username"));
    }

    watch(
        username,
        (usernameVal) => {
            sessionStorage.setItem("username", JSON.stringify(usernameVal));
        },
        {deep: true}
    );
    return {username, setUserInformation, clearUserInformation}
})

export const useTokenInformationStore = defineStore("token", () => {
    const token = ref("");

    const storeToken = (responseToken: string)  => {
        token.value = responseToken;
    }

    const clearToken = () => {
        token.value = "";
    }

    if (sessionStorage.getItem("token")) {
        token.value = JSON.parse(sessionStorage.getItem("token"));
    }

    watch(
        token,
        (tokenVal) => {
            sessionStorage.setItem("token", JSON.stringify(tokenVal));
        },
        {deep: true}
    );
    return {token, storeToken, clearToken}
})

export const useBookInformationStore = defineStore("bookResults", () => {
    const bookResults = reactive(ref([{

    }]));

    const count = ref(0);

    const pushToObject = (newObject: any) => {
        bookResults.value = [];
        bookResults.value = newObject;
    }

    const clearSearchResult = () => {
        bookResults.value = [];
    }

    if (sessionStorage.getItem("bookResults")) {
        bookResults.value = JSON.parse(sessionStorage.getItem("bookResults"));
    }
    else if (!sessionStorage.getItem("bookResults")) {
        bookResults.value = [];
    }

    watch(
        bookResults,
        (bookVal) => {
            sessionStorage.setItem("bookResults", JSON.stringify(bookVal));
        },
        {deep: true}
    );
    return {bookResults, pushToObject, clearSearchResult}
})