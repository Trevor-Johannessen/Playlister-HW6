import { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

export default function PlaylisterBody() {
    const { store } = useContext(GlobalStoreContext);
    const [bottomBarText, setText] = useState("");
    const [inHome, setHome] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { auth } = useContext(AuthContext);

    function detectEnter(event) {
        if (event.code === "Enter") {
            let searchString = event.target.value;
            searchString = searchString == "" ? -1 : searchString;
            store.loadPlaylists(searchString, store.searchCriteria);
            setText(`${event.target.value} Lists`)
        }
    }

    const handleMenuOpen = (event) => {
        console.log("Clicked Hamburger")
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function addNewList(){
        // remember to change cursor to not text
        console.log("add new list")
        store.createNewList();
    }

    let bottomBar = (<div id="playlister-body-bottom-bar">{bottomBarText}</div>);
    if(inHome && auth.user != null){
        bottomBar = (
            <div id="playlister-body-bottom-bar">
                    <div id="your-lists-text"
                    onClick={(event) => {event.stopPropagation(); addNewList()}}
                    style={{display: "inline-block"}}>
                        + YOUR LISTS
                    </div>
                
            </div>
        )
    }

    const sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id='sort-menu'
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("NAME")}}>Name (A-Z)</MenuItem>
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("PUBLISH_DATE")}}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("LISTENS")}}>Listens (High-Low)</MenuItem>
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("LIKES")}}>Likes (High-Low)</MenuItem>
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("DISLIKES")}}>Dislikes (High-Low)</MenuItem>
        </Menu>
    );
    const sortMenuUser = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id='sort-menu'
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("CREATION_DATE")}}>Creation Date (Oldest)</MenuItem>
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("LAST_EDIT_DATE")}}>Last Edit Date (Newest)</MenuItem>
            <MenuItem onClick={(event) => {event.stopPropagation(); handleMenuClose(event); store.setSort("NAME")}}>Name (A-Z)</MenuItem>
        </Menu>
    );

    return(
        <div id='playlister-body'>
            <div id='playlister-body-statusbar'>
                <div id='playlister-body-statusbar-left' style={{paddingRight: '8%'}}>
                <Tooltip title={auth.user != null ? "" : "Guests cannot go home."}><HomeIcon style={{ width: '50px', height: '50px'}} onClick={(event) => {event.stopPropagation(); if(auth.user != null){setText("+ YOUR LISTS"); setHome(true); store.loadLoggedInUsersPlaylists();}else{console.log("Can't open home as guest");}}}/></Tooltip>
                    <GroupsIcon style={{ width: '50px', height: '50px'}} onClick={(event) => {event.stopPropagation(); setText(""); setHome(false); store.loadPlaylists("", "ByName");}}/>
                    <PersonIcon style={{ width: '50px', height: '50px'}} onClick={(event) => {event.stopPropagation(); setText(""); setHome(false); store.loadPlaylists("", "ByUser");}}/>
                </div>
                <TextField className='searchbar' label='Search' disabled={store.searchCriteria==""} onKeyPress={detectEnter}></TextField>
                <div id='playlister-body-statusbar-right' style={{paddingLeft: '27%'}} >
                    <span style={{fontSize: '30px', textAlign: 'center'}}>Sort By</span>
                    <MenuIcon 
                        style={{ width: '50px', height: '50px'}} 
                        onClick={handleMenuOpen}
                        aria-label="account of current user"
                        aria-controls='sort-menu'
                        aria-haspopup="true"
                        />

                
                </div>
            </div>
            {bottomBar}
            {store.searchCriteria == "" ? sortMenuUser : sortMenu}
        </div>
    )
}