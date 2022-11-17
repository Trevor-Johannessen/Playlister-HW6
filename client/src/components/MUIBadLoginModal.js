import { useContext } from 'react'
import AuthContext from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIBadLoginModal() {
    const { auth } = useContext(AuthContext);
    function handleClose(event) {
        auth.resetBadLogin()
    }
    return (
        <Modal
            open={auth.badLogin}
        >
            <Box sx={style}>
            <Alert severity="warning">{auth.errorMsg}</Alert>
            <Button onClick={handleClose}>Close</Button>
            </Box>
        </Modal>
    );
}