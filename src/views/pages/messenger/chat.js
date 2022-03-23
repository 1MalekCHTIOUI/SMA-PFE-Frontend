import React from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles';
import {Paper, Grid,CircularProgress , Box, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Room from '../../components/Room'
import Message from '../../components/Message'
import configData from '../../../config';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    },
    items: {
        marginLeft:"0.1rem",
        letterSpacing: '0.03rem'
    }

});

const Chat = () => {
    const classes = useStyles()
    const [users, setUsers] = React.useState([])
    const [rooms, setRooms] = React.useState([])
    const [currentChat, setCurrentChat] = React.useState(null)
    const [messages, setMessages] = React.useState(null)
    const account = useSelector(state => state.account)
    const userFirstName = account.user.first_name
    const userLastName = account.user.last_name
    React.useEffect(()=>{
        async function fetchUsers() {
            try {
                const res = await axios.get(configData.API_SERVER + "user/users")
                setUsers(res.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchUsers()
    }, [])

    React.useEffect(()=>{
        async function getRooms() {
            try {
                const res = await axios.get(configData.API_SERVER + "rooms/" + account.user._id)
                setRooms(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getRooms()
    }, [account])

/*****************T E S T I N G */
    // React.useEffect(()=>{
    //     console.log(currentChat);
    // },[currentChat])
/******************************* */

    const userHasRoom = async (id) => {
        try {
            const res = await axios.get(configData.API_SERVER + "rooms/" + id)
            if(res.data.length > 0) 
                setCurrentChat(res.data)
            else {
                try {
                    const members = {
                        senderId: account.user._id,
                        receiverId: id
                    }
                    const res = await axios.post(configData.API_SERVER + "rooms", members)
                    setRooms(rooms + res.data)
                    setCurrentChat(res.data)
                } catch(err) {
                    console.log(err)
                }
            }        
        } catch (error) {
            console.log(error)
        }
    }


    React.useEffect(()=>{
        const getMessages = async () => {
            try {
                const res = await axios.get(configData.API_SERVER + "messages/" + currentChat[0]?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        getMessages()
    }, [currentChat])

    return (
        <div>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h5" className="header-message">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem button key={userFirstName}>
                            <ListItemIcon>
                            <Avatar alt={userFirstName} src="../../assets/images/users/user.svg" />
                            </ListItemIcon>
                            <ListItemText className={classes.items} primary={`${userFirstName} ${userLastName}`} />
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    {
                        users.map((user, index) => (
                            <List onClick={()=>userHasRoom(user._id)}>
                                <Room users={user} room={rooms} currentUser={account.user} key={index}/>
                            </List>
                        ))
                    }
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {
                            currentChat ? 
                                messages?.map((m, i) => (
                                    <Message message={m} own={m.sender === account.user._id} key={i} mk={i}/>
                                ))
                            : <p align="center">Open conversation to start chat!</p>
                        }
                    </List>
                    <Divider />
                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                            <TextField id="outlined-basic-email" label="Type Something" fullWidth />
                        </Grid>
                        <Grid item xs={1} align="right">
                            <Fab color="primary" aria-label="add"><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;