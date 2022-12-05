import { useState, useContext, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'
import AuthContext from '../auth'
import logo from '../images/Playlister.png'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    return (
        <div id="splash-screen">
            <img id="playlister-title" src={logo} style={{maxWidth: "40%", maxHeight: "40%", paddingTop: "10px"}} alt="Playlister"></img>

            <span class='splash-screen-text'>Join dozens of users in creating, sharing, and rating playlists!</span>
            <span id='splash-screen-button-box'>
                <Link className='splash-screen-button' to='/login/'>Login</Link>
                <Link className='splash-screen-button' to='/register/'>Register</Link>
                <Link className='splash-screen-button' onClick={(event) => auth.loginGuest()} to='/'>Continue as Guest</Link>
            </span>
            <span class='splash-screen-text'>Created by Trevor Johannessen</span>





        </div>
    )
}