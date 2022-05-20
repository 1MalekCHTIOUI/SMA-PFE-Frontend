import React from 'react';
import { Container, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Share from '../Share/Share';
import Post from '../Post/Post';
const useStyles = makeStyles((theme) => ({}));

const ProfileContent = ({ user, posts, setPosts, postsLoading }) => {
    return (
        <Container>
            <div style={{ height: '100%' }}>
                <Share user={user} setPosts={setPosts} />
                {postsLoading && <CircularProgress />}
                {posts && postsLoading === false && posts.map((post) => <Post post={post} />)}
            </div>
        </Container>
    );
};

export default ProfileContent;
