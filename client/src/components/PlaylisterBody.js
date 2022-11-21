import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';

export default function PlaylisterBody() {
    const { store } = useContext(GlobalStoreContext);
    
    return(
        <div id='playlister-body'>
            <div id='playlister-body-statusbar'>
                <div id='playlister-body-statusbar-left' style={{paddingRight: '8%'}}>
                    <HomeIcon style={{ width: '50px', height: '50px'}} onClick={store.loadLoggedInUsersPlaylists}/>
                    <GroupsIcon style={{ width: '50px', height: '50px'}} onClick={store.loadPlaylists}/>
                    <PersonIcon style={{ width: '50px', height: '50px'}}/>
                </div>
                <TextField className='searchbar' label='Search'></TextField>
                <div id='playlister-body-statusbar-right' style={{paddingLeft: '27%'}} >
                    <span style={{fontSize: '30px', textAlign: 'center'}}>Sort By</span>
                    <MenuIcon style={{ width: '50px', height: '50px'}}/>
                </div>
            </div>
        </div>
    )
}