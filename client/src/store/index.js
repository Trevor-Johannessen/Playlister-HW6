import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api, { getUsersPlaylists } from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
import { Experimental_CssVarsProvider } from '@mui/material'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    LOGOUT_USER: "LOGOUT_USER",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    SET_PLAYLIST_SEARCH: "SET_PLAYLIST_SEARCH",
    SET_CURRENT_EDITING_LIST: "SET_CURRENT_EDITING_LIST",
    SET_SORT: "SET_SORT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

export const SortingOption = {
    NONE : "NONE",
    NAME : "NAME",
    LISTENS : "LISTENS",
    LIKES : "LIKES",
    DISLIKES : "DISLIKES",
    PUBLISH_DATE : "PUBLISH_DATE"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        storedPlaylists: [],
        currentEditingList : null,
        searchCriteria: "",
        sortMethod: SortingOption.NONE
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : payload,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                })
            }
            case GlobalStoreActionType.LOGOUT_USER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            case GlobalStoreActionType.LOAD_PLAYLISTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: payload.playlist,
                    currentEditingList : payload.currentEditingList != null ? payload.currentEditingList : null,
                    searchCriteria: payload.criteria != null ? payload.criteria : store.searchCriteria,
                    sortMethod: store.sortMethod 
                });
            }
            case GlobalStoreActionType.SET_PLAYLIST_SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: payload,
                    sortMethod: store.sortMethod
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            // UNMARK A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : null,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : store.currentEditingList,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_EDITING_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : payload,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: payload.bool,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : payload,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : store.currentEditingList,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : store.currentEditingList,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : store.currentEditingList,
                    searchCriteria: store.searchCriteria,
                    sortMethod: store.sortMethod
                });
            }
            case GlobalStoreActionType.SET_SORT: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    storedPlaylists: store.storedPlaylists,
                    currentEditingList : store.currentEditingList,
                    searchCriteria: store.searchCriteria,
                    sortMethod : payload
                });
            }
            
            default:
                return store;
        }
    }

    store.tryAcessingOtherAccountPlaylist = function(){
        let id = "6360166ffc1b88d5eec64fc1";
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/6360166ffc1b88d5eec64fc1");
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentEditingList = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_EDITING_LIST,
            payload: null
        });
        tps.clearAllTransactions();
    }
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: null
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        async function asyncCreateNewList(){
            let newListName = "Untitled-" + auth.user.playlists.length; // TODO: replace this with users counter
            const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.username);
            console.log("createNewList response: " + response.status);
            if (response.status === 201) {
                tps.clearAllTransactions();
                let newList = response.data.playlist;
                auth.user.playlists.push("Placeholder")
                store.loadLoggedInUsersPlaylists(newList);
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
            console.log(`editing list = ${store.currentEditingList}`)
        }
        asyncCreateNewList();
        console.log(`editing list = ${store.currentEditingList}`)
    }


    store.duplicateList = async function(playlist){
        async function asyncDuplicateList(playlist){
            let newListName = playlist.name // TODO: check if duplicated list name is already taken here

            // MAKE SURE DUPLICATED LIST DOESNT CAUSE A NAME CLASH
            const usersPlaylists = (await api.getLoggedInUsersPlaylists(auth.user.email)).data.data;
            const playlistNames = usersPlaylists.reduce((prev, curr) => {return [curr.name, ...prev]}, [])
            let attempt = 0;
            while(playlistNames.indexOf(newListName) != -1){
                    console.log(`Playlist name ${playlist.name} already taken. Trying ${playlist.name}-${attempt}`);
                    attempt++;            
                    newListName = `${playlist.name}-${attempt}`
            }
            console.log(`Playlist name found  : ${newListName}`);
            
            const response = await api.createPlaylist(newListName, playlist.songs, auth.user.email, auth.user.username);
            console.log("createNewList response: " + response.status);
            if (response.status === 201) {
                if(store.searchCriteria == "")
                    store.loadLoggedInUsersPlaylists();
                else
                    store.loadPlaylists("", "");
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
        }
        asyncDuplicateList(playlist);
    }



    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            //const response = await api.getPlaylistPairs();
            const response = await api.getPlaylists();
            if (response.data.success) {
                //let pairsArray = response.data.idNamePairs;
                let pairsArray = response.data.data;
                console.log(pairsArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }


    store.loadPlaylists = function (searchString, criteria) {
        console.log(`Searching ${store.searchCriteria}`);
        console.log(`Search String = ${searchString}`)
        async function asyncLoadPlaylists() {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let playlistArray = response.data.data;
                if(store.searchCriteria=="ByName" && searchString != "")
                    playlistArray = playlistArray.filter((item) => item.name.toLowerCase().includes(searchString.toLowerCase()));
                if(store.searchCriteria=="ByUser" && searchString != "")
                    playlistArray = playlistArray.filter((item) => item.ownerUsername.toLowerCase().includes(searchString.toLowerCase()));
                console.log('playlistArray = ')
                console.log(playlistArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlist: playlistArray, criteria: criteria}
                });
            }
            else {
                console.log("API FAILED TO GET THE Playlist");
            }
        }
        asyncLoadPlaylists();

    }

    store.setPlaylistSearch = function(type){
        console.log(`Setting search criteria = ${type}`)
        async function asyncSetPlaylist(type){
            await storeReducer({
                type: GlobalStoreActionType.SET_PLAYLIST_SEARCH,
                payload: type
            });
        }
        asyncSetPlaylist(type)
    }


    store.loadUsersPlaylists = function (email) {
        async function asyncLoadPlaylists() {
            const response = await api.getUsersPlaylists(email);
            if (response.data.success) {
                let playlistArray = response.data.data;
                console.log('playlistArray = ')
                console.log(playlistArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlist: playlistArray, criteria : null}
                });
            }
            else {
                console.log("API FAILED TO GET THE Playlist");
            }
        }
        asyncLoadPlaylists();
    }

    store.loadLoggedInUsersPlaylists = function (inputCurrentEditingList) {
        async function asyncLoadLoggedInPlaylists(){
            const response = await api.getLoggedInUsersPlaylists(auth.user.email);
            if(response.data.success){
                let playlistArray = response.data.data;
                console.log('playlistArray = ')
                console.log(playlistArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlist: playlistArray, criteria : "", currentEditingList: inputCurrentEditingList}
                });
            }else{
                console.log("API FAILED TO GET PLAYLISTS")
            }
        }
        asyncLoadLoggedInPlaylists();
    }

    /*
    store.loadPlaylists = function () {
        async function asyncGetPlaylists(){
            const response = await api.getPlaylists();
            if(response.data.success){
                let playlistArray = response.data.data;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlist: playlistArray, criteria : null}
                });
            }else{
                console.log("API FAILED TO GET THE PLAYLISTS");
            }
        }
        asyncGetPlaylists();
    }
    */


    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        console.log('marking list for deletion')
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: {}
        });
    }


    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            console.log(`RESPONSE = ${response.data.success}`)
            if (response.data.success) {
                store.loadLoggedInUsersPlaylists();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.setListOpened = (input) => {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_OPENED,
            payload: input
        });    
        console.log(`NEW STORE VALUE = ${store.listOpened}`);
            
    }

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });    
            
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        console.log("Trying to show remove song modal")
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }



    store.logoutUser = () => {
        storeReducer({
            type: GlobalStoreActionType.LOGOUT_USER,
            payload: {}
        });
    }
    store.hello = () => {
        console.log("HELLO WORLD!")
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    /*store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }*/

    store.setSort = function(newSort){
        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: SortingOption[newSort]
        })
    }


    store.setCurrentList = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist
        })
    }

    store.setCurrentEditingList = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_EDITING_LIST,
            payload: playlist
        })
    }

    store.getPlaylistSize = function() {
        return store.currentEditingList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "Li4j82QbBvk");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentEditingList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.submitComment = function(comment){
        if (store.currentList){
            
            async function asyncCommentCurrentList() {
                console.log(store.currentList)
                console.log('user = ')
                console.log(auth.user)
                const response = await api.commentPlaylistById(store.currentList._id, [`${auth.user.firstName} ${auth.user.lastName}`, comment]);
                if (response.data.success) {
                    store.currentList.comments.push([`${auth.user.firstName} ${auth.user.lastName}`, comment]);
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: store.currentList
                    });
                }
            }
            asyncCommentCurrentList();
        }
    }

    store.likePlaylist = function(playlist, remove){
    remove ? console.log("Removing Like") : console.log("Liking Playlist");
        async function asyncLikePlaylist(playlist, email, remove) {
            const response = await api.likePlaylistById(playlist._id, email, remove);
            if(response.data.success){
                console.log("SUCCESS")
                if(remove){
                    for(let i = 0; i < playlist.likes.length; i++)
                        if(playlist.likes[i] == email){
                            playlist.likes.splice(i, 1);
                            break;
                        }
                }else{
                    playlist.likes.push(email)
                }
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncLikePlaylist(playlist,auth.user.email,remove)
    }
    store.dislikePlaylist = function(playlist, remove){
        remove ? console.log("Removing Dislike") : console.log("Disliking Playlist");
        async function asyncDislikePlaylist(playlist, email, remove) {
            const response = await api.dislikePlaylistById(playlist._id, email, remove);
            if(response.data.success){
                if(remove){
                    for(let i = 0; i < playlist.dislikes.length; i++)
                        if(playlist.dislikes[i] == email){
                            playlist.dislikes.splice(i, 1);
                            break;
                        }
                }else{
                    playlist.dislikes.push(email)
                }
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncDislikePlaylist(playlist,auth.user.email,remove)
    }

    store.publishList = function(){
        console.log("Recieved publish list")
        let list = store.currentEditingList;      
        list.published = new Date().toLocaleString()
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }


    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentEditingList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentEditingList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "Li4j82QbBvk");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentEditingList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentEditingList._id, store.currentEditingList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_EDITING_LIST,
                    payload: store.currentEditingList
                });
            }
        }
        asyncUpdateCurrentList();
    }

    store.renamePlaylist = function(newList){
        async function asyncRenamePlaylist(newList){
            const playlistResponse = await api.getLoggedInUsersPlaylists(auth.user.email);
            const usersPlaylists = playlistResponse.data.data
            for (let i=0; i < usersPlaylists.length; i++){
                if(usersPlaylists[i].name == newList.name){
                    console.log(`Playlist name ${newList.name} already taken.\nName not changed.`);
                    return false;
                }
            }
            const response = await api.updatePlaylistById(newList._id, newList);
            if(response.data.success){
                // Update playlist in the store
                let playlists = store.storedPlaylists;
                for (let i=0; i < playlists.length; i++){
                    if(playlists[i]._id == newList._id)
                        playlists.splice(i, 1, newList)
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: {playlist: playlists, criteria : null, currentEditingList: null}
                });
                console.log("Playlist successfully renamed.");
                return true;
            }else{
                console.log("Playlist not renamed.");
                return false;
            }
        }
        return asyncRenamePlaylist(newList);
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function (input) {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: {bool: input}
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };