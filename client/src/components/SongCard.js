import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index, dbClickFunc } = props;

    function handleDragStart(event) {
        console.log("Picked up card");
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        console.log("Card Dropped")
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    let cardClass = "song-card";
    //console.log(`Song = `)
    //console.log(song)
    if(song === "ADD BUTTON"){
        return(
            <div
                key='song-add-card'
                id='song-add-card'
                draggable="false"
                onClick={(event) => {event.stopPropagation(); store.addNewSong()}}
            >
                +
            </div>)
    }

    let handleEditSong = () => {
        if(store.currentEditingList.published == "")
            store.showEditSongModal(index, store.currentEditingList.songs[index])
    }
    let deleteButton = ""
    if(store.currentEditingList && store.currentEditingList.published == "")
        deleteButton = 
            (
                <div id="delete-song-button"
                    className=''
                    onClick={(event) => {event.stopPropagation();  store.showRemoveSongModal(index, store.currentEditingList.songs[index])}}
                    >X</div>
            )

    let selectedClass = store.currentList != null && store.currentList.songs[store.currentSongIndex] == song ? " selected-card" : "";
    
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={'song-card-body' + selectedClass}
            draggable="true"
            onClick={(event) => {event.stopPropagation(); store.setSong(index)}}
            onDoubleClick={(event) => {event.stopPropagation(); handleEditSong() }}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
        >
            {index + 1}. {song.title} by {song.artist}
            
            {deleteButton}
        </div>
    );
}

export default SongCard;