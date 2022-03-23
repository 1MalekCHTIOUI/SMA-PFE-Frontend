import React from 'react'
import { Grid, ListItem, ListItemText } from '@material-ui/core'
import {format} from 'timeago.js'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({

    freindMessageContainer: {
        margin: "0 100 0 auto",
        width:"fit-content",
        backgroundColor: "#d6d6d6",
        padding:"0.3rem",
        borderRadius: "0.2rem",
    },
    ownMessageContainer: {
        margin: "0 0 0 auto",
        width:"fit-content",
        backgroundColor: "#b0d7ff",
        padding:"0.3rem",
        borderRadius: "0.2rem",
    },

})

const Message = ({message, own, mk}) => {
    const classes = useStyles()
    
    return (
        <ListItem key={mk} >
            <Grid container direction="row" className={own ? classes.ownMessageContainer : classes.freindMessageContainer }>
                <Grid item xs={12}>
                    <ListItemText align={own ? "right" : "left"} primary={message.text}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align={own ? "right" : "left"} secondary={format(message.createdAt)}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>

    )
}

export default Message;
