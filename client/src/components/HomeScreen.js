import React, { useContext, useEffect, useState} from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import PlaylisterBody from './PlaylisterBody.js'
import Comments from './Comments'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [playerOpen, setPlayer] = useState(false);
    const [stupidInt, setStupid] = useState(0);

    useEffect(() => {
        store.loadPlaylists();
        store.loadIdNamePairs();
    }, []);


    let swapPlayerView = () => {
        setPlayer(!playerOpen);
       playerOpen ? console.log('opened') : console.log('closed');
    }
    
    let youtubeButtonColor = playerOpen ? {backgroundColor : 'white'} : {alpha: 0};
    let commentButtonColor = playerOpen ? {alpha: 0} : {backgroundColor : 'white'};

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '100%', height: '100%'}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        playlist={pair}
                    />
                ))
            }
            </List>;
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
        </div>)
}

export default HomeScreen;