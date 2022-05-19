import React from 'react';
import { Grid, Typography, Button, Container,Box, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import MainCard from './../../../ui-component/cards/MainCard';
import ProfilePost from './ProfilePost'
const useStyles = makeStyles((theme) => ({
    container: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
    }
}))

const ProfileContent = ({user}) => {
    const classes = useStyles()
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '3fr auto', gap:'1vw', padding: '0.25rem'}} >
            <div style={{height:'100%'}}>
                <ProfilePost user={user}/>
            </div>
        </Box>
    );
}

export default ProfileContent;
