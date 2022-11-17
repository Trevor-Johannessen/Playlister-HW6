import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    let text ="";
    if (store.currentList)
        text = store.currentList.name;

    let buttonclick = () => {
        store.tryAccessingOtherAccountPlaylist();
    }

    return (
        <div id="playlister-statusbar">
            <Typography variant="h4"><a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' style={{color: 'inherit', textDecoration: 'inherit'}}>{text}</a></Typography>
        </div>
    );
}

export default Statusbar;