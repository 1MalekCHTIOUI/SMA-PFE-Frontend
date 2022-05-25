import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container, Typography } from '@material-ui/core';
import axios from 'axios';
import config from '../../../config';
import { format } from 'timeago.js';
const useStyles = makeStyles({
    container: {
        margin: 10,
        minWidth: '15rem',
        height: '80%',
        backgroundColor: '#f8006d',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0.25rem'
    },
    content: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

const Announcement = ({ post }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const getUser = async () => {
        try {
            setLoading(true);
            const res = await axios.get(config.API_SERVER + 'user/users/' + post.userId);
            setUser(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            {loading === false && (
                <div className={classes.content}>
                    <div className={classes.header}>
                        <Typography variant="overline" color="white" style={{ fontFamily: 'Poppins' }}>
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="subtitle2" color="white" style={{ fontFamily: 'Poppins' }}>
                            {format(post.createdAt)}
                        </Typography>
                    </div>
                    <Typography variant="overline" color="white" style={{ fontFamily: 'Poppins' }}>
                        {post.content}
                    </Typography>
                </div>
            )}
        </Container>
    );
};

export default Announcement;
