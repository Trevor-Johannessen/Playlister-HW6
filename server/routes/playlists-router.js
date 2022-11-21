/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/playlist/comments/:id', PlaylistController.commentPlaylist)
router.get('/playlist/user/:id', PlaylistController.getUsersPlaylists)
router.put('/playlist/like/:id', PlaylistController.likePlaylist)
router.put('/playlist/dislike/:id', PlaylistController.dislikePlaylist)
router.get('/playlist/getLoggedInUser/:id', PlaylistController.getLoggedInUserPlaylists)
module.exports = router