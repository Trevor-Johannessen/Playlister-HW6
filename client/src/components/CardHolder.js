import { useContext } from 'react'
import { GlobalStoreContext } from '../store'


function CardHolder(){

    if (store) {
        listCard = 
            <List sx={{ width: '40%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    
    return (
        <div>

        </div>
    )
}