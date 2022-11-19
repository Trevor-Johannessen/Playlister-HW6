import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import {Link} from 'react-router-dom'
import TextField from '@mui/material/TextField';
import { borders } from '@mui/system';
import { sizing } from '@mui/system';




export default function Comments(props){
    const { store } = useContext(GlobalStoreContext);
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

    this.keyPress = (e) => {
        if(e.keyCode == 13){
           console.log('value', e.target.value);
           // put the login here
        }
     }

    return (
        <div id='comments'>
            <div id='comment-card-holder'>
                {comments}
            </div>
            <div id='comment-textbox'>
                <TextField className='comment-textbox-mui' size='small' id="outlined-basic" label="Comment" variant="outlined" sx={{width : '100%'}} onKeyDown={this.keyPress}/>
            </div>
        </div>
    )

}