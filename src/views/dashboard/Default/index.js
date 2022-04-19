import React, { useContext, useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';
import {SocketContext} from '../../../utils/socket/SocketContext'
import config from '../../../config';
import axios from 'axios';
import { useSelector } from 'react-redux';
//-----------------------|| DEFAULT DASHBOARD ||-----------------------//

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const {onlineUsers} = useContext(SocketContext);
    const account = useSelector(s => s.account)
    const [roles, setRoles] = useState([])
    const [onliners, setOnliners] = useState(0)
    

    useEffect(() => {
        setLoading(false);
        
    }, []);

    const getRoles = async () => {
        console.log("Online users: "+onliners);
        console.log("Roles: "+roles.length);
        try {
            if(onliners > roles.length){
                console.log("add role");
                for(let i=0; i<onlineUsers.length;i++){
                    const user = await axios.get(config.API_SERVER+"user/users/"+onlineUsers[i].userId)
                    console.log(user.data);
                    setRoles(roles => [...roles, {count: 1, role: user.data.role[0]}])
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(()=>{
        isLoading===false && setOnliners(onlineUsers.length)
    },[onlineUsers])

    React.useEffect(()=>{
        console.log("Online users: "+onliners);
        console.log("Roles: "+roles.length);
        getRoles()

        

    },[onliners])

    // React.useEffect(()=>{
    //     console.log(roles.length);
    //     // if(user.data.role.includes(roles[i]?.role && user.data._id !== roles[i]._id)){
    //     //     console.log(roles[i].role+ " has more than 1");
    //     //     setRoles(roles.splice(i, 1, {
    //     //         count: roles[i].count++, 
    //     //         role: user.data.role[0]
    //     //     }))
    //     // } else {
    //     //     setRoles([...roles, {count: 1, role: user.data.role[0]}])
    //     // }
    // },[roles])

    



    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} roles={roles} onlineUsers={onlineUsers}/>
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
