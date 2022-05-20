import React from 'react';
import { Grid, Typography, Button, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import MainCard from './../../../ui-component/cards/MainCard';

const useStyles = makeStyles((theme) => ({
    cover: {
        zIndex: 1,
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '5px'
    },
    profileContainer: {
        padding: '10px',
        fontSize: '16px'
    },
    profile: {
        width: '154px',
        height: '154px',
        float: 'left',
        borderRadius: '50%',
        margin: '-90px 10px 0  0',
        position: 'relative',
        zIndex: 111,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    container: {
        // display:'flex',
        // justifyContent:'center',
        // alignItems:'center',
        width: '970',
        height: 'auto 13',
        borderRadius: '5px',
        overflow: 'hidden'
    }
}));

const ProfileHeader = ({ user }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.coverContainer}>
                <img className={classes.cover} src={`/uploads/profilePictures/${user.profilePicture}`} alt="Loading" />
            </div>
            <div className={classes.profileContainer}>
                <img className={classes.profile} src={`/uploads/profilePictures/${user.profilePicture}`} alt="Loading" />
                <Typography variant="h3" className={classes.title}>
                    {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                    THIS IS BIO
                </Typography>
            </div>
        </div>
    );
};

export default ProfileHeader;
