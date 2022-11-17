import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

export default function Comments(props){
    const { store } = useContext(GlobalStoreContext);

    return (
        <div id='comments'>
            {store.currentList ? store.currentList.name : ""}
            {/*props.name*/}
        </div>
    )

}