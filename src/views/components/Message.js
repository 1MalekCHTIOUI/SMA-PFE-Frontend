import React from 'react'
import { Fade, Grid, ListItem, ListItemText, Box, Typography } from '@material-ui/core'
import {format} from 'timeago.js'
import { makeStyles } from '@material-ui/styles'
import config from '../../config'
import axios from 'axios'
import { replaceDash } from '../../utils/scripts'

const useStyles = makeStyles({

    freindMessageContainer: {
        margin: "0 100 0 auto",
        width:"30%",
        // minWidth:"fit-content",
        backgroundColor: "#d6d6d6",
        padding:"0.3rem",
        borderRadius: "0.2rem",
    },
    ownMessageContainer: {
        margin: "0 0 0 auto",
        width:"30%",
        // minWidth:"fit-content",
        backgroundColor: "#b0d7ff",
        padding:"0.3rem",
        borderRadius: "0.2rem",
    },
    sender: {
        // backgroundColor: "red",
        display:"flex", 
        justifyContent:"space-evenly",
        alignItems: "center",
    },
    message: {
        wordBreak: 'break-all',
    }

})

const Message = ({message, own, mk, type}) => {
    const classes = useStyles()
    const [user, setUser] = React.useState('')
    const [userRole, setUserRole] = React.useState('')
    React.useEffect(()=>{
        const getUsername = async () => {
            try {
                const user = await axios.get(config.API_SERVER+"user/users/"+message.sender)
                setUser(user.data)
                const role = replaceDash(user.data.role[0])
                setUserRole(role)
            } catch (error) {
                console.log(error);
            }
        }
        type && getUsername()
    }, [message])

    return (
        <Box>
            <Fade in={true}>
                <ListItem key={mk} >
                    <Grid container direction="row" className={own ? classes.ownMessageContainer : classes.freindMessageContainer }>
                        {type==='PUBLIC' &&
                            <Grid container direction="row" xs={12} className={classes.sender}>
                                <ListItemText><Typography variant="subtitle2">{`${user.first_name} ${user.last_name}`}</Typography></ListItemText>
                                <ListItemText><Typography variant="subtitle2">{userRole}</Typography></ListItemText>
                            </Grid>
                        }
 
                        <Grid item className={classes.message}>
                            <ListItemText align={own ? "right" : "left"} primary={message.text}></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItemText align={own ? "right" : "left"} secondary={format(message.createdAt)}></ListItemText>
                        </Grid>
                    </Grid>
                </ListItem>
            </Fade>
        </Box>

    )
}

export default Message;
