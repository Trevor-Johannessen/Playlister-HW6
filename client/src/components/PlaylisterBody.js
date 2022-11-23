import { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';

export default function PlaylisterBody() {
    const { store } = useContext(GlobalStoreContext);
    const [bottomBarText, setText] = useState("");
    const [inHome, setHome] = useState(true);

    function detectEnter(event) {
        if (event.code === "Enter") {
            store.loadPlaylists(event.target.value);
            setText(`${event.target.value} Lists`)
        }
    }

    function addNewList(){
        console.log("add new list")
        if(store.currentEditingList){
            // add new list here
            console.log("there is a list open")
            // create new list
            
            // set list as edit active
        }
    }

    let bottomBar = (<div id="playlister-body-bottom-bar">{bottomBarText}</div>);
    if(inHome){
        bottomBar = (
            <div id="playlister-body-bottom-bar"
                onClick={(event) => {event.stopPropagation(); addNewList()}}>
                + YOUR LISTS
            </div>
        )
    }


    return(
        <div id='playlister-body'>
            <div id='playlister-body-statusbar'>
                <div id='playlister-body-statusbar-left' style={{paddingRight: '8%'}}>
                    <HomeIcon style={{ width: '50px', height: '50px'}} onClick={(event) => {event.stopPropagation(); setText("+ YOUR LISTS"); setHome(true); store.loadLoggedInUsersPlaylists();}}/>
                    <GroupsIcon style={{ width: '50px', height: '50px'}} onClick={(event) => {event.stopPropagation(); setText(""); setHome(false); store.loadPlaylists("", "ByName");}}/>
                    <PersonIcon style={{ width: '50px', height: '50px'}} onClick={(event) => {event.stopPropagation(); setText(""); setHome(false); store.loadPlaylists("", "ByUser");}}/>
                </div>
                <TextField className='searchbar' label='Search' onKeyPress={detectEnter}></TextField>
                <div id='playlister-body-statusbar-right' style={{paddingLeft: '27%'}} >
                    <span style={{fontSize: '30px', textAlign: 'center'}}>Sort By</span>
                    <MenuIcon style={{ width: '50px', height: '50px'}}/>
                </div>
            </div>
            {bottomBar}
        </div>
    )
}