import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import Usertable from "../../components/UserTable"
import axios from 'axios'
import configData from '../../../config'
import MainCard from '../../../ui-component/cards/MainCard'
import { Container } from '@material-ui/core'


const Management = () => {
    const [users, setUsers] = React.useState([])
    const [isEdited, setIsEdited] = React.useState(null)
    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(configData.API_SERVER + "user/users")
                setUsers(res.data)
            } catch(e) {
                console.log(e);
            }
        }
        fetchUsers()
    }, [])

    React.useEffect(()=> {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(configData.API_SERVER + "user/users")
                setUsers(res.data)
            } catch(e) {
                console.log(e);
            }
        }
        fetchUsers()
    },[isEdited])

    return (
        <MainCard title="User management">
            <Grid container>
                <Usertable data={users} setIsEdited={setIsEdited}/>
            </Grid>
        </MainCard>
    )
}

export default Management