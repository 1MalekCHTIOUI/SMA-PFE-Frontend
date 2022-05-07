import React from 'react'
import { Fade, Grid, ListItem, ListItemText, Box, Typography, Container, Divider } from '@material-ui/core'
import {format} from 'timeago.js'
import { makeStyles } from '@material-ui/styles'
import config from '../../config'
import axios from 'axios'
import { replaceDash } from '../../utils/scripts'
import { Image, PictureAsPdf } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { SocketContext } from '../../utils/socket/SocketContext'

const useStyles = makeStyles(theme => ({

    freindMessageContainer: {
        margin: "0 100 0 auto",
        width:"30%",
        // minWidth:"fit-content",
        backgroundColor: theme.palette.grey[300],
        padding:"0.3rem",
        borderRadius: "0.2rem",
    },
    ownMessageContainer: {
        margin: "0 0 0 auto",
        width:"30%",
        // minWidth:"fit-content",
        backgroundColor: 'rgba(144, 202, 249, 0.6)',
        padding:"0.3rem",
        borderRadius: "0.2rem",
    },
    chatMessage: {
        width:"40%",
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
        padding:"0.3rem",
        border: "0.2px solid rgba(0,0,0,0.2)",
        borderRadius: "0.2rem",
        display:"flex",
        color:"black",
        justifyContent:"center",
        alignItems: "center",
    },
    sender: {
        // backgroundColor: "red",
        display:"flex", 
        justifyContent:"space-evenly",
        alignItems: "center",
    },
    message: {
        wordBreak: 'break-all',
    },
    center: {
        display:"flex", 
        justifyContent:"center",
        alignItems: "center",
    },
    divider: {
        display:"flex", 
        justifyContent:"center",
        width:"60%", 
        margin: "0 auto",
        height:'0.1rem', 
        backgroundColor:"rgba(0,0,0,0.1)"
    },

}))

const Message = ({message, own, mk, type}) => {
    const classes = useStyles()
    const [user, setUser] = React.useState('')
    const [userRole, setUserRole] = React.useState('')
    const {join} = React.useContext(SocketContext)
    React.useEffect(()=>{
        const getUsername = async () => {
            try {
                if(message.sender==='CHAT') return
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

    
    const returnClassName = () => {
        if(message.sender==='CHAT') return classes.chatMessage

        if(own) return classes.ownMessageContainer
        else return classes.freindMessageContainer
    } 


    const RE_URL = /\w+:\/\/\S+/g;
    const roomType = "PUBLIC"
    function linkify(str) {
        let match;
        const results = [];
        let lastIndex = 0;
        // let codeIndex = str.indexOf('http://localhost:3000/videoChat/')
        let codeIndex = str.indexOf(config.HOST + 'videoChat/')
        let roomCode = ''
        if(codeIndex!==-1 ) {
            roomCode = str.substring(codeIndex+32, codeIndex+52)
        }
        while (match = RE_URL.exec(str)) {
            const link = match[0];
            if (lastIndex !== match.index) {
            const text = str.substring(lastIndex, match.index);
            results.push(
                <span key={results.length}>{text}</span>,
            );
            }
            results.push(
            <a key={results.length} onClick={()=>join(roomCode, roomType)} target="_blank">{link}</a>
            );
            lastIndex = match.index + link.length;
        }
        if (results.length === 0) {
            return str;
        }
        if (lastIndex !== str.length) {
            results.push(<span key={results.length}>{str.substring(lastIndex)}</span>,);
        }
        return results;
    }
    return (
        <Box>
            <Fade in={true} className={`${message.sender==='CHAT' ? classes.center : ''}`}>
                <ListItem key={mk}>
                    <Grid container direction="row" className={returnClassName()}>
                        {type==='PUBLIC' &&
                            <Grid container direction="row" xs={12} className={classes.sender}>
                                {message.sender!=='CHAT' && <ListItemText><Typography variant="subtitle2">{`${user.first_name} ${user.last_name}`}</Typography></ListItemText>}
                                {message.sender!=='CHAT' && <ListItemText><Typography variant="subtitle2">{userRole}</Typography></ListItemText>}
                            </Grid>
                        }
 
                        <Grid item className={classes.message}>
                            {message.sender!=='CHAT' && <ListItemText align="left"><Typography style={{fontFamily: 'Poppins, sans-serif'}}>{linkify(message.text)}</Typography></ListItemText>}
                            {message.sender==='CHAT' && <ListItemText align="center"><Typography variant="overline">{message.text}</Typography></ListItemText>}

                            {message.attachment && message.attachment.map(file => (
                                <Container>
                                    {file.displayName.includes('.pdf') && <a component={Link} href={`/uploads/files/${file.actualName}`} target="_blank"><PictureAsPdf /> {file.displayName}</a>}
                                    {(file.displayName.includes('.jpg') || file.displayName.includes('.png')) && <a component={Link} href={`/uploads/files/${file.actualName}`} target="_blank"><Image /> {file.displayName}</a>}
                                </Container>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <ListItemText align="left" secondary={format(message.createdAt)}></ListItemText>
                        </Grid>
                    </Grid>
                    
                </ListItem>


            </Fade>
            {message.sender === 'CHAT' && <Divider className={classes.divider} /> }
        </Box>

    )
}

export default Message;