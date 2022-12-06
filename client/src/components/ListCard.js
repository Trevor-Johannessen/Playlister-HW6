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
import ThumbUpIconOutlined from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIconOutlined from '@mui/icons-material/ThumbDownOutlined';
import AuthContext from '../auth'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import Tooltip from '@mui/material/Tooltip';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editingTitle, setEdit] = useState(false);
    const { playlist, selected } = props;
    const { auth } = useContext(AuthContext);


    let openCard = () => {
        if(store.currentEditingList == null){
            store.setCurrentEditingList(playlist)
        }
        console.log(auth.user)
    }

    let closeCard = () => {
        store.closeCurrentEditingList();
    }

    let likeList = (event, remove) => {
        event.stopPropagation();
        if(auth.user != null){
            let hasDisliked = false;
            for(let i = 0; i < playlist.dislikes.length; i++) // check if user has already disliked
                if(playlist.dislikes[i] == auth.user.email)
                    hasDisliked = true;
            if(!hasDisliked)
                store.likePlaylist(playlist, remove)
        }else{
            console.log("Can't like list as guest.")
        }
    }
    let dislikeList = (event, remove) => {
        event.stopPropagation();
        if(auth.user != null){
            let hasLiked = false;
            for(let i = 0; i < playlist.likes.length; i++) // check if the user has already liked
                if(playlist.likes[i] == auth.user.email)
                    hasLiked = true;
            if(!hasLiked)
                store.dislikePlaylist(playlist, remove);
        }else{
            console.log("Can't dislike list as guest.")
        }
    }
    let handleTextUpdate = async (event) => {
        if (event.code === "Enter") {
            let oldname = playlist.name
            playlist.name = event.target.value;
            let response = await store.renamePlaylist(playlist).then((response => {
                return response;
            }))
            if(!response){ // if update fails, change playlist name back.
                console.log(`Setting name back to ${oldname}`);
                playlist.name = oldname;
            }
            setEdit(false) // disable text box;
            //store.setSort(store.sortMethod);
        }
    }

    let publishedFeatures;
    let cardExpandIcon = (<span className='list-card-expand-icon'><KeyboardDoubleArrowDownIcon onClick={(event) => {event.stopPropagation(); openCard()}}/></span>);
    let cardClass = 'list-card'; // setOpened(true); 
    let songCards;
    let title = "";

    if(editingTitle){
        // SET TITLE TO TEXTBOX
        title = 
        (<TextField
            className='list-card-title-editing'
            onKeyPress={handleTextUpdate}
            onClick={(event) => event.stopPropagation()}
            defaultValue={playlist.name}
            autoFocus
        />)
    }else{
        // SET TITLE TO REGULAR TEXT
        title = <span 
        className='list-card-title' 
        onDoubleClick={(event) => {
            event.stopPropagation();
            if(!editingTitle && playlist.published == "")
                setEdit(true);
        }}
        >{playlist.name}</span>;
    }

    let ownerEditingFeatures = (<div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); if(auth.user != null)store.duplicateList(playlist);}}>Duplicate</div>);
    // make sure to check if auth is null
    if(auth.user != null && auth.user.username == playlist.ownerUsername)
    ownerEditingFeatures= (
    <div>
        <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); store.markListForDeletion(playlist._id)}}>Delete</div>
        <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); if(auth.user != null)store.duplicateList(playlist);}}>Duplicate</div>
    </div>);
    // if published
    if(playlist.published != ""){
        let hasLiked = false;
        let hasDisliked = false;

        if(auth.user != null){ // Guests cannot like playlists 
            for(let i = 0; i < playlist.likes.length; i++)
                if(playlist.likes[i] == auth.user.email)
                    hasLiked = true;
            for(let i = 0; i < playlist.dislikes.length; i++)
                if(playlist.dislikes[i] == auth.user.email)
                    hasDisliked = true;
        }

        let likeButton = (<span className='list-card-ratings-like'><Tooltip title={auth.user != null ? "" : "Guests cannot like playlists."}><ThumbUpIconOutlined onClick={(event) => likeList(event, false)}/></Tooltip>{playlist.likes.length}</span>)
        let dislikeButton = (<span className='list-card-ratings-dislike'><Tooltip title={auth.user != null ? "" : "Guests cannot dislike playlists."}><ThumbDownIconOutlined onClick={(event) => dislikeList(event, false)}/></Tooltip>{playlist.dislikes.length}</span>)
            
        if(hasLiked)
            likeButton = (<span className='list-card-ratings-like'><ThumbUpIcon onClick={(event) => likeList(event, true)}/>{playlist.likes.length}</span>)
        else if(hasDisliked)
            dislikeButton = (<span className='list-card-ratings-dislike'><ThumbDownIcon onClick={(event) => dislikeList(event, true)}/>{playlist.dislikes.length}</span>)


        publishedFeatures = 
        (
        <div>
            <span className='list-card-listens'>Listens: <span style={{color: 'red'}}>{playlist.listens}</span></span>
            <span className="list-card-published">Published: <span style={{color: 'green'}}>{playlist.published}</span></span>
            {likeButton}
            {dislikeButton}
        </div>
        )
    }else if(store.currentEditingList != null && playlist._id == store.currentEditingList._id){ // if playlist not published and card is opened
        ownerEditingFeatures = (
            <div>
                <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); store.undo()}}>Undo</div>
                <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); store.redo()}}>Redo</div>
                <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); store.markListForDeletion(playlist._id)}}>Delete</div>
                <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); store.publishList(); closeCard();}}>Publish</div>
                <div className='list-card-editing-button' onClick={(event) => {event.stopPropagation(); console.log("Trying to duplicate"); store.duplicateList(playlist);}}>Duplicate</div>
            </div>
        )
    }

    if(store.currentEditingList != null && playlist._id == store.currentEditingList._id){
        cardClass += '-opened'
        cardExpandIcon = (<span className='list-card-expand-icon'><KeyboardDoubleArrowUpIcon onClick={(event) => {event.stopPropagation(); closeCard()}}/></span>)
        songCards = (
        <div className='list-card-selector'>
        {
        playlist.songs.map((song, index) => (
            <SongCard
                id={'playlist-song-' + (index)}
                key={'playlist-song-' + (index)}
                index={index}
                song={song}
            />   
        ))
        }
        {
            playlist.published == "" ? 
            <SongCard
                id={'add-song-song-card'}
                key={'add-song-song-card'}
                index={playlist.songs.length}
                song={"ADD BUTTON"}
            /> : <div/> 
        }
        </div>)
    }


    if(store.currentList != null && store.currentList == playlist)
        cardClass += " selected-list";



    let cardElement =
        <ListItem
            id={playlist._id}
            key={playlist._id}
            sx={{}}
            button
            onClick={(event) => {
                store.setCurrentList(playlist)
            }}
            
        >
            <div className={cardClass}>
                {title}
                <span className="list-card-owner">By: <Link onClick={(event) => {event.stopPropagation(); if(auth.user == null || store.searchCriteria != ""){store.loadPlaylists(playlist.ownerUsername, "ByUser");}}} to=''>{playlist.ownerUsername}</Link></span>
                {songCards}
                {publishedFeatures}
                <span className='list-card-editing-buttons'>{ownerEditingFeatures}</span>
                {cardExpandIcon}
            </div>
        </ListItem>

    return (
        cardElement
    );
}

export default ListCard;