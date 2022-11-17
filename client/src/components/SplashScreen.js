import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'
export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <span id='playlister-title'>Playlister</span>

            <span class='splash-screen-text'>Join dozens of users in creating, sharing, and rating playlists!</span>
            <span id='splash-screen-button-box'>
                <Link className='splash-screen-button' to='/login/'>Login</Link>
                <Link className='splash-screen-button' to='/register/'>Register</Link>
                <Button className='splash-screen-button' id="register-button" href='/register/'>Register</Button>
                <Button className='splash-screen-button' id="guest-button">Continue as Guest</Button>
            </span>
            <span class='splash-screen-text'>Created by Trevor Johannessen</span>





        </div>
    )
}