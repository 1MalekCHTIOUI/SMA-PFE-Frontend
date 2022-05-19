import React, { useContext, useEffect, useState } from 'react';

// material-ui
import { Grid, Typography, Container,CircularProgress, Paper,Avatar,List,ListItem,ListItemIcon,ListItemText } from '@material-ui/core';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import MainCard from './../../../ui-component/cards/MainCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';
import {SocketContext} from '../../../utils/socket/SocketContext'
import config from '../../../config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Carousel from 'react-material-ui-carousel';
import DashboardRoom from '../../components/DashboardRoom'
//-----------------------|| DEFAULT DASHBOARD ||-----------------------//
const useStyles = makeStyles((theme) => ({
    content: {
        padding: '20px !important'
    },
    carousel: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'column',
        minHeight: '6.8rem',
        position:'relative'
    },
    item: {
        marginLeft: '10px',
        marginRight: '10px'
    },
    items: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden'
    }
}))
const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const {onlineUsers} = useContext(SocketContext);
    const account = useSelector(s => s.account)
    const [roles, setRoles] = useState([])
    const [onliners, setOnliners] = useState([])
    
    const classes = useStyles()
    useEffect(() => {
        setLoading(false);
    }, []);

    const [usersLoading, setUsersLoading] = React.useState(false)
    React.useEffect(()=>{
        const getOnlineUsers = () => {
            onlineUsers?.map(async item => {
                try {
                    setUsersLoading(true)
                    const users = await axios.get(config.API_SERVER + 'user/users/'+item.userId)
                    onliners.find(u=>u._id === users.data._id)===undefined && setOnliners(prev => [...prev, users.data])
                    setUsersLoading(false)
                } catch (error) {
                    setUsersLoading(false)
                    console.log(error);
                }
            })
        }
        getOnlineUsers()
    },[onlineUsers])

    // React.useEffect(()=>{
    //     console.log(onliners);
    // },[onliners])






    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={12} md={6} sm={6} xs={12} style={{display:'flex', justifyContent:'center',}}>
                        {/* <EarningCard isLoading={isLoading} roles={roles} onlineUsers={onlineUsers}/> */}
                            <MainCard border={false} style={{display:'flex', justifyContent:'center', width: '50vw'}} contentClass={classes.content}>
                                <Container className={classes.carousel}>
                                    <Typography style={{fontWeight: 500, marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.2)'}}>Online users: {onliners.length}</Typography>
                                    {usersLoading && <CircularProgress />}
                                    <Container className={classes.items}>
                                        {usersLoading===false && onliners?.map((item, index) => (
                                            <DashboardRoom item={item} index={index} />
                                        ))}
                                    </Container>
                                </Container>
                            </MainCard>
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
