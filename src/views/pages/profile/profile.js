import React from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Grid, Typography, Button, Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import config from '../../../config';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileContent from '../../components/Profile/ProfileContent';
import ProfileSidebar from '../../components/Profile/ProfileSidebar';
import MainCard from './../../../ui-component/cards/MainCard';
const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = React.useState({});
    const [posts, setPosts] = React.useState(null);
    const [postsLoading, setPostsLoading] = React.useState(false);

    React.useEffect(() => {
        const getUser = async () => {
            try {
                const users = await axios.get(config.API_SERVER + 'user/users/' + userId);
                setUser(users.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
        const loadPosts = async () => {
            try {
                setPostsLoading(true);
                const fetchPosts = await axios.get(config.API_SERVER + 'posts/' + userId);
                setPosts(fetchPosts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                setPostsLoading(false);
            } catch (error) {
                setPostsLoading(false);
                console.log(error);
            }
        };
        loadPosts();
    }, []);

    return (
        <Container style={{ width: 'fit-content' }}>
            <MainCard border={false} style={{ minHeight: '100vh', minWidth: '60vw' }}>
                <ProfileHeader user={user} />
                <Grid xs={12} container direction="row">
                    <Grid item xs={12} md={4}>
                        <ProfileSidebar user={user} />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <ProfileContent setPosts={setPosts} user={user} posts={posts} postsLoading={postsLoading} />
                    </Grid>
                </Grid>
            </MainCard>
        </Container>
    );
};

export default Profile;
