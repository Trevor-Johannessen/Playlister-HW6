import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import SongCard from './SongCard'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import {Link} from 'react-router-dom'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [opened, setOpened] = useState(false);
    const [text, setText] = useState("");
    const { playlist, selected } = props;

    let reverseOpenState = () => {
        setOpened(!opened);
        opened ? console.log('opened') : console.log('closed');
    }


    let publishedFeatures;

    // if published
    if(true)
    publishedFeatures = 
    (
    <div>
        <span className='list-card-listens'>Listens: <span style={{color: 'red'}}>1234567{playlist.listens}</span></span>
        <span className="list-card-published">Published: <span style={{color: 'green'}}>{playlist.createdAt}</span></span>
        <span className='list-card-ratings-like'><ThumbUpIcon/>6969{playlist.likes}</span><span className='list-card-ratings-dislike'><ThumbDownIcon/>420{playlist.dislikes}</span>
    </div>
    )
    
    let cardElement =
        <ListItem
            id={playlist._id}
            key={playlist._id}
            sx={{}}
            button
            onClick={(event) => {
                console.log(playlist)
            }}
        >
            <div className='list-card'>
                {/* TODO: ADD DELETE BUTTON WHEN USER OWNS PLAYLIST */}
                <span className='list-card-title'>{playlist.name}</span>
                <span className="list-card-owner">By: <Link to=''>{playlist.ownerEmail}</Link></span>
                {publishedFeatures}
                <button className="list-card-duplicate-button">Duplicate</button>
                <span className='list-card-expand-icon'><KeyboardDoubleArrowDownIcon onClick={reverseOpenState}/></span>
            </div>
        </ListItem>

    // if Opened
    if(opened){
        let songCards = 
        playlist.songs.map((song, index) => (
            <SongCard
                id={'playlist-song-' + (index)}
                key={'playlist-song-' + (index)}
                index={index}
                song={song}
            />
        ))

        cardElement =
        <ListItem
            id={playlist._id}
            key={playlist._id}
            sx={{}}
            button
            onClick={(event) => {
                store.setCurrentList(playlist)
            }}
        >
            <div className='list-card-opened'>
                <span className='list-card-title'>{playlist.name}</span>
                <span className="list-card-owner">By: <Link to=''>{playlist.ownerEmail}</Link></span>
                <div className='list-card-selector'>
                    {songCards}
                </div>
                {publishedFeatures}
                <button className="list-card-duplicate-button">Duplicate</button>
                <span className='list-card-expand-icon'><KeyboardDoubleArrowUpIcon onClick={reverseOpenState}/></span>
            </div>
        </ListItem>
    }

    return (
        cardElement
    );
}

export default ListCard;