import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import {Link} from 'react-router-dom'

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

    return (
        <div id='comments'>
            {comments}
        </div>
    )

}