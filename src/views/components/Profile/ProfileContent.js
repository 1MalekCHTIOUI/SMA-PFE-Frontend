import React from 'react';
import { Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Share from '../Share/Share';
import Post from '../Post/Post';
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    posts: {
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'fit-content',
        minHeight: '6.8rem'
    },
    postItems: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
}));

const ProfileContent = ({ user, posts, setPosts, postsLoading }) => {
    const classes = useStyles();
    const account = useSelector((state) => state.account);
    return (
        <Container style={{ height: '100%', width: '100%' }}>
            <div>
                <div className={classes.center}>{postsLoading && <CircularProgress />}</div>

                <div className={classes.postItems}>
                    <Share user={user} setPosts={setPosts} />
                </div>

                {posts &&
                    postsLoading === false &&
                    posts.map((post) => {
                        if (account.user._id === user._id) {
                            return <Post post={post} />;
                        } else if (post.visibility === true) {
                            return <Post post={post} />;
                        }
                    })}
            </div>
        </Container>
    );
};

export default ProfileContent;
