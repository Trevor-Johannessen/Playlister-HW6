/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = (newListName, newSongs, userEmail, username) => {
    return api.post(`/playlist/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        songs: newSongs,
        ownerEmail: userEmail,
        comments: [],
        likes: [],
        dislikes: [],
        listens: 0,
        published: "",
        ownerUsername: username,
    })
}
export const getPlaylists = () => api.get(`/playlists`)
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const getPlaylistPairs = () => api.get(`/playlistpairs/`)
export const getUsersPlaylists = (id) => api.get(`/playlist/user/${id}`)
export const listenPlaylist = (id) => api.put(`playlist/listens/${id}`)
export const getLoggedInUsersPlaylists = (id) => api.get(`/playlist/getLoggedInUser/${id}`)
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        playlist : playlist
    })
}
export const commentPlaylistById = (id, comment) => {
    return api.put(`/playlist/comments/${id}`, {
        comment : comment
    })
}
export const likePlaylistById = (id, email, remove) => {
    console.log("Sending like request");
    return api.put(`/playlist/like/${id}`, {
        email: email,
        remove: remove
    });
}
export const dislikePlaylistById = (id, email, remove) => {
    console.log("Sending dislike request")
    return api.put(`/playlist/dislike/${id}`, {
        email: email,
        remove: remove
    })
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    getPlaylists,
    commentPlaylistById,
    getUsersPlaylists,
    likePlaylistById,
    dislikePlaylistById,
    getLoggedInUsersPlaylists,
    listenPlaylist
}

export default apis
