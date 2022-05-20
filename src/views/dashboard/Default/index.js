import React, { useContext, useEffect, useState } from 'react';

// material-ui
import {
    Grid,
    Typography,
    Container,
    CircularProgress,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import MainCard from './../../../ui-component/cards/MainCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';
import { SocketContext } from '../../../utils/socket/SocketContext';
import config from '../../../config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Post from '../../components/Post/Post';
import DashboardRoom from '../../components/DashboardRoom';
//-----------------------|| DEFAULT DASHBOARD ||-----------------------//
const useStyles = makeStyles((theme) => ({
    content: {
        padding: '20px !important'
    },
    carousel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '6.8rem',
        position: 'relative'
    },
    posts: {
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50rem',
        flexDirection: 'column',
        minHeight: '6.8rem'
    },
    item: {
        marginLeft: '10px',
        marginRight: '10px'
    },
    carouselItems: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden'
    },
    postItems: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    mainCard: {
        display: 'flex',
        justifyContent: 'center',
        width: '50vw'
    }
}));
const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const { onlineUsers } = useContext(SocketContext);
    const account = useSelector((s) => s.account);
    const [roles, setRoles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [onliners, setOnliners] = useState([]);

    const classes = useStyles();
    useEffect(() => {
        setLoading(false);
    }, []);

    const [usersLoading, setUsersLoading] = React.useState(false);
    React.useEffect(() => {
        const getOnlineUsers = () => {
            onlineUsers?.map(async (item) => {
                try {
                    setUsersLoading(true);
                    const users = await axios.get(config.API_SERVER + 'user/users/' + item.userId);
                    onliners.find((u) => u._id === users.data._id) === undefined && setOnliners((prev) => [...prev, users.data]);
                    setUsersLoading(false);
                } catch (error) {
                    setUsersLoading(false);
                    console.log(error);
                }
            });
        };
        getOnlineUsers();
    }, [onlineUsers]);

    React.useEffect(() => {
        const fetchPublicPosts = async () => {
            try {
                const fetchPosts = await axios.get(config.API_SERVER + 'posts');
                setPosts(fetchPosts.data.filter((p) => p.visibility === true));
            } catch (error) {
                console.log(error);
            }
        };
        fetchPublicPosts();
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={6} sm={6} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <MainCard border={false} className={classes.mainCard} contentClass={classes.content}>
                            <Container className={classes.carousel}>
                                <Typography style={{ fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
                                    Online users: {onliners.length}
                                </Typography>
                                {usersLoading && <CircularProgress />}
                                <Container className={classes.carouselItems}>
                                    {usersLoading === false && onliners?.map((item, index) => <DashboardRoom item={item} index={index} />)}
                                </Container>
                            </Container>
                        </MainCard>
                    </Grid>
                    <Grid item lg={12} md={6} sm={6} xs={12}>
                        <Grid item lg={12} md={6} sm={6} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            <MainCard border={false} className={classes.mainCard}>
                                <Container className={classes.posts}>
                                    <Typography
                                        style={{ fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.2)' }}
                                    >
                                        Posts: {posts.length}
                                    </Typography>
                                    {usersLoading && <CircularProgress />}
                                    <Container className={classes.postItems}>
                                        {usersLoading === false && posts?.map((post) => <Post post={post} />)}
                                    </Container>
                                </Container>
                            </MainCard>
                        </Grid>
                    </Grid>

                    {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid> */}
                    {/* <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    );
};

export default Dashboard;
