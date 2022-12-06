import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import {Link} from 'react-router-dom'
import TextField from '@mui/material/TextField';
import { borders } from '@mui/system';
import { sizing } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';




export default function Comments(props){
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let comments = [];
    
    if (store.currentList && store.currentList.comments){
        console.log("PRINTING COMMENTS")
        for(let i = 0; i < store.currentList.comments.length; i++){
            console.log(store.currentList.comments[i][0])
            console.log(store.currentList.comments[i][1])
            comments.push((
                <div className='comment-card'>
                    <span className='comment-author'><Link to=''>{store.currentList.comments[i][0]}</Link></span>
                    <span className='comment-content'>{store.currentList.comments[i][1]}</span>
                </div>
            ));
        }
    }

    let keyPress = (e) => {
        if(e.keyCode == 13 && e.target.value.replaceAll(' ', '') != ""){
            store.submitComment(e.target.value);
            e.target.value = "";
        }
     }

    let getCommentTooltip = () => {
        if(auth.user == null)
            return "Guests cannot comment.";
        else if(store.currentList == null)
            return "You must have a list open to comment."
    }

    return (
        <div id='comments'>
            <div id='comment-card-holder'>
                {comments}
            </div>
            <div id='comment-textbox'>
                <Tooltip title={getCommentTooltip()}><TextField className='comment-textbox-mui' size='small' id="outlined-basic" label="Comment" disabled={auth.user == null || store.currentList == null} variant="outlined" sx={{width : '100%'}} onKeyDown={keyPress}/></Tooltip>
            </div>
        </div>
    )

}