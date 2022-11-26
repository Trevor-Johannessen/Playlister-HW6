import React, { useContext, useEffect, useState} from 'react'
import { GlobalStoreContext, SortingOption } from '../store'
import ListCard from './ListCard.js'
import PlaylisterBody from './PlaylisterBody.js'
import Comments from './Comments'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUIDeleteModal from './MUIDeleteModal'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import AuthContext from '../auth';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [playerOpen, setPlayer] = useState(false);
    const [stupidInt, setStupid] = useState(0);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if(auth.user != null)
            store.loadLoggedInUsersPlaylists();
        else
            store.loadPlaylists("", "ByName");
        //store.loadIdNamePairs();
    }, []);


    let swapPlayerView = () => {
        setPlayer(!playerOpen);
       playerOpen ? console.log('opened') : console.log('closed');
    }
    
    let youtubeButtonColor = playerOpen ? {backgroundColor : 'white'} : {alpha: 0};
    let commentButtonColor = playerOpen ? {alpha: 0} : {backgroundColor : 'white'};

    let listCard = "";
    if (store) {
        let playlists = store.storedPlaylists;
        switch(store.sortMethod){
            case SortingOption.NAME:
                playlists.sort((a, b) => {return a.name.localeCompare(b.name)})
                break;
            case SortingOption.LIKES:
                playlists.sort((a, b) => {return a.likes.length < b.likes.length});
                break;
            case SortingOption.DISLIKES:
                playlists.sort((a, b) => {return a.dislikes.length < b.dislikes.length});
                break;
            case SortingOption.LISTENS:
                playlists.sort((a, b) => {return a.listens < b.listens});
                break;
            case SortingOption.PUBLISH_DATE:
                playlists.sort((a, b) => {return new Date(b.published) - new Date(a.published)});
                break;
            case SortingOption.CREATION_DATE:
                playlists.sort((a, b) => {return new Date(a.createdAt) - new Date(b.createdAt)});
                break;
            case SortingOption.LAST_EDIT_DATE:
                playlists.sort((a, b) => {return new Date(b.updatedAt) - new Date(a.updatedAt)});
                break;
        }
        listCard = 
            <List sx={{ width: '100%', height: '100%'}}>
            {
                playlists.map((pair) => (
                    <ListCard
                        key={pair._id}
                        playlist={pair}
                    />
                ))
            }
            </List>;
    }
    
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if(store.isDeleteListModalOpen()){
        modalJSX = <MUIDeleteModal />
    }


    return (
        
        <div id="playlist-selector" style={{height: 'inherit'}}>
            <PlaylisterBody/>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
            <div className='player-buttons'>
                <div id='youtube-button' className='player-button' style={youtubeButtonColor} onClick={swapPlayerView}>Player</div>
                <div id='comments-button' className='player-button' style={commentButtonColor} onClick={swapPlayerView}>Comments</div>
            </div>
            {playerOpen ? /* TODO: Add youtube player */ null : <Comments/>}
            
            <button onClick={() => store.loadUsersPlaylists('obama@gmail.com')}>Load Obamas Secret Playlists</button>
            {modalJSX}
        </div>)
}

export default HomeScreen;