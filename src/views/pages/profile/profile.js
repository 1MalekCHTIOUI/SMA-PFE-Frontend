import React from 'react';
import {useParams} from 'react-router'
import axios from 'axios'
import { Grid, Typography, Button, Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import config from '../../../config'
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileContent from '../../components/Profile/ProfileContent'
import ProfileSidebar from '../../components/Profile/ProfileSidebar'
import MainCard from './../../../ui-component/cards/MainCard'
const Profile = () => {
    const {userId} = useParams()
    const [user, setUser] = React.useState({})    

    React.useEffect(()=>{
        const getUser = async () =>{
            try {
                const users = await axios.get(config.API_SERVER+'user/users/'+userId)
                setUser(users.data)
            } catch (error) {
                console.log(error);
            }
        }
        getUser()
    }, [])

    return (
        <MainCard border={false} style={{height:'100%', width:"100%"}}>
            <Container style={{ width: '85%'}}>
                <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)', gap:'2vh' }}>
                    <ProfileHeader user={user} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 9fr', gap:'5vw' }}>
                            <div>
                            <ProfileSidebar user={user}/>
                            </div>
                            <div>
                            <ProfileContent user={user} />
                            </div>
                   
                    </Box>
                </Box>
            </Container>
        </MainCard>
    );
}

export default Profile;
