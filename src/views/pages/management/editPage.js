import React from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, Container, Typography, Divider} from '@material-ui/core'

import configData from '../../../config'
import MainCard from '../../../ui-component/cards/MainCard'
import Form from '../../components/Form';
import moment from 'moment'
import config from '../../../config';
const EditPage = () => {
    const [user, setUser] = React.useState([])
    const location = useLocation();
    const [date, setDate] = React.useState()

    React.useEffect(()=> {
        const fetchUser = async () => {
            try {
                const res = await axios.get(config.API_SERVER+"user/users/"+location.state.user._id)
                setDate(res.data.createdAt)
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser()
    }
    ,[])


    React.useEffect(()=> console.log(location.state),[location.state])
    return (
        <MainCard title="Account information">
            <Typography variant="h4" align="center" style={{marginBottom:"1rem"}}>With us since: {moment(date).format("D MMM YYYY")}</Typography>
            <Typography variant="subtitle2" align="center" style={{marginBottom:"1rem"}}>{moment().diff(date, "days")} Days and counting!</Typography>
            <Divider />
            <Container style={{width: "70%"}}>
                <Form accessFrom={location.state.accessFrom} user={location.state.user}/>
            </Container>
        </MainCard>
    )
}

export default EditPage