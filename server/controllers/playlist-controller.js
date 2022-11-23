const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const Auth = require('../auth')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        if(user.email !== body.ownerEmail){
            return res.status(400).json({
                success : false,
                errorMessage : "You cannot create another user's playlist"
            })
        }
        console.log("user found: " + JSON.stringify(user));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
    })
}
deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log(req)
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        if(Auth.verifyUser(req) === null){
            return res.status(400).json({
                errorMessage: 'Unauthorized in Delete'
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({success: true});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(403).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(list);
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        let filteredLists = playlists.filter((document) => document["published"] != "");
        return res.status(200).json({ success: true, data: filteredLists })
    }).catch(err => console.log(err))
}

getUsersPlaylists = async (req, res) => {
    console.log(req.params.id)

    await Playlist.find({ ownerEmail: req.params.id },  (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        let filteredLists = playlists.filter((document) => document["published"] != "");
        return res.status(200).json({ success: true, data: filteredLists })
    }).catch(err => console.log(err))
    
}

getLoggedInUserPlaylists = async (req, res) => {
    console.log(`Finding playlists of ${JSON.stringify(req.params.id)}`);
    await Playlist.find({ ownerEmail: req.params.id },  (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}


commentPlaylist = async (req, res) => {
    const body = req.body
    console.log(`commentBody = ${JSON.stringify(body)}`)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }


    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            console.log('PLAYLIST NOT FOUND IN COMMENT')
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }
        playlist.comments.push(body.comment);
        playlist
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: playlist._id,
                    message: 'Playlist updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not updated!',
                })
            })
    })
}
likePlaylist = async (req, res) => {
    console.log("In likePlaylist")
    const body = req.body;
    console.log(`commentBody = ${JSON.stringify(body)}`)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            console.log('PLAYLIST NOT FOUND IN COMMENT')
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }
        if(body.remove){ // removing like
            console.log("Removing like")
            for(let i = 0; i < playlist.likes.length; i++){
                if(playlist.likes[i] == body.email)
                    playlist.likes.splice(i, 1);
            }
        }else{ // adding like
            console.log("Adding like")
            playlist.likes.push(body.email);
        }
        playlist
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: playlist._id,
                    message: 'Playlist updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not updated!',
                })
            })
    });
}
dislikePlaylist = async (req, res) => {
    console.log("In Dislike")
    const body = req.body;
    console.log(`commentBody = ${JSON.stringify(body)}`)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            console.log('PLAYLIST NOT FOUND IN COMMENT')
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }
        if(body.remove){ // removing dislike
            for(let i = 0; i < playlist.dislikes.length; i++){
                if(playlist.dislikes[i] == body.email)
                    playlist.dislikes.splice(i, 1);
            }
        }else{ // adding dislike
            playlist.dislikes.push(body.email);
        }
        playlist
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: playlist._id,
                    message: 'Playlist updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Playlist not updated!',
                })
            })
    });
}

updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    if(Auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'Unauthorized in Update'
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.comments = body.playlist.comments;
                    list.published = body.playlist.published;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    commentPlaylist,
    getUsersPlaylists,
    likePlaylist,
    dislikePlaylist,
    getLoggedInUserPlaylists
}