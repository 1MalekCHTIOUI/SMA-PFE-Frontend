import React from 'react';
import { Grid, Typography, Button, Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import User1 from './../../../assets/images/users/user.svg';
import MainCard from './../../../ui-component/cards/MainCard';
import config from '../../../config';

const useStyles = makeStyles((theme) => ({
    cover: {
        zIndex: 1,
        minWidth: '100%',
        minHeight: '200px',
        objectFit: 'cover',
        borderRadius: '5px',
        background: 'gray'
    },
    profileContainer: {
        padding: '10px',
        fontSize: '16px'
    },
    profile: {
        width: '154px',
        height: '154px',
        objectFit: 'cover',
        borderRadius: '50%',
        zIndex: 111,
        backgroundColor: 'white',
        overflow: 'hidden',
        border: '2px solid white'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '100%',
        minHeight: '200px',
        borderRadius: '5px',
        overflow: 'hidden'
    }
}));

const ProfileHeader = ({ user }) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {/* <div className={classes.coverContainer}>
                <img className={classes.cover} src={user.coverPicture ? config.CONTENT + user.coverPicture : ''} alt="" />
            </div> */}
            <div className={classes.profileContainer}>
                <img className={classes.profile} src={user.profilePicture ? config.CONTENT + user.profilePicture : User1} />
                <Typography variant="h3" style={{ textAlign: 'center' }} className={classes.title}>
                    {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="subtitle2" style={{ textAlign: 'center' }} className={classes.subtitle}>
                    {user.bio ? user.bio : <i>This user has no bio</i>}
                </Typography>
            </div>
        </div>
    );
};

export default ProfileHeader;
