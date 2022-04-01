import React from 'react'
import axios from 'axios'
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Container, Typography, Divider} from '@material-ui/core'
import Usertable from "../../components/UserTable"

import configData from '../../../config'
import MainCard from '../../../ui-component/cards/MainCard'


const Management = () => {
    const [users, setUsers] = React.useState([])
    const [isEdited, setIsEdited] = React.useState(null)
    const [isDeleted, setIsDeleted] = React.useState(null)

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
                if(isEdited === true) {
                    const res = await axios.get(configData.API_SERVER + "user/users")
                    setUsers(res.data)
                }
                if(isDeleted) {
                    setUsers(users => users.filter(user => user._id !== isDeleted._id))
                    console.log(users);
                }
            } catch(e) {
                console.log(e);
            }
        }
        fetchUsers()
    },[isEdited, isDeleted])

    return (
        <MainCard title="User management">
            <Grid item xs={12}>
                <Grid container direction="column" alignItems="center" sx={{marginBottom:"1rem"}}>
                    <Typography
                        variant="subtitle1" 
                        gutterBottom
                        component={RouterLink}
                        to="/register"
                        sx={{ textDecoration: 'none' }}
                    >
                        Create an account
                    </Typography>
                </Grid>
            </Grid>

            <Grid container>
                <Usertable data={users} setIsEdited={setIsEdited} setIsDeleted={setIsDeleted}/>
            </Grid>
        </MainCard>
    )
}

export default Management