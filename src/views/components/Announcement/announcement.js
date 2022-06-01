import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import config from '../../../config';
import { format } from 'timeago.js';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const useStyles = makeStyles({
    container: {
        // margin: 10,
        minWidth: '15rem',
        width: '15rem',
        height: '80%',
        padding: 10,
        // backgroundColor: '#f8006d',

        display: 'flex',
        alignItems: 'center',
        borderRadius: '0.25rem'
    },
    content: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',

        border: '1px solid lightblue'
    },
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'lightblue',
        padding: 10
    }
});

const Announcement = ({ post, posts, setPosts }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const account = useSelector((q) => q.account);
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
    const deletePost = async () => {
        try {
            axios.delete(config.API_SERVER + 'posts/' + post._id);
            setPosts(posts.filter((u) => u._id !== post._id));
        } catch (error) {
            console.log(error);
        }
    };
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            {loading === false && (
                <div className={classes.content}>
                    <div className={classes.header}>
                        <Typography variant="overline" color="black" style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="subtitle2" color="black" style={{ fontFamily: 'Poppins', fontWeight: '300' }}>
                            {format(post.createdAt)}
                        </Typography>
                    </div>
                    <Typography variant="overline" color="black" style={{ fontFamily: 'Poppins', padding: 10 }}>
                        {post.content}
                    </Typography>
                    {post.attachment.length > 0 && (
                        <a component={Link} href={config.CONTENT + post.attachment[0].actualName} target="_blank">
                            {post.attachment[0].displayName}
                        </a>
                    )}
                    {post.userId === account.user._id && (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginRight: '5px' }}>
                            <Button variant="outlined" color="error" style={{ width: '20%' }} onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Container>
    );
};

export default Announcement;
