import React from 'react';
import axios from 'axios'
import { io } from "socket.io-client"
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles';
import {Paper, Grid,CircularProgress , Box, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Room from '../../components/Room'
import Message from '../../components/Message'
import configData from '../../../config'
import MainCard from "../../../ui-component/cards/MainCard"


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
    const [newMessage, setNewMessage] = React.useState("")
    const [onlineUsers, setOnlineUsers] = React.useState([])
    const [arrivalMessage, setArrivalMessage] = React.useState(null)
    const [existInRoom, setExistInRoom] = React.useState(null)
    const [currentChatUser, setCurrentChatUser] = React.useState(null)
    const socket = React.useRef(io("ws://localhost:8900"))
    const account = useSelector(state => state.account)
    const scrollRef = React.useRef(null)
    const userFirstName = account.user.first_name
    const userLastName = account.user.last_name

    React.useEffect(()=>{
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    },[])

    React.useEffect(()=>{
        arrivalMessage && 
        currentChat?.members.includes(arrivalMessage.sender) && 
        setMessages(prev => [...prev, arrivalMessage])
    },[arrivalMessage])

    React.useEffect(()=>{
        socket.current.emit("addUser", account.user._id)
        socket.current.on("getUsers", users => {
            setOnlineUsers(users)
        })
    },[account.user])

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

    React.useEffect(() =>{
        console.log(currentChat);
    },[currentChat])

/*****************T E S T I N G */
    // React.useEffect(()=>{
    //     console.log(onlineUsers);
    // },[onlineUsers])
/******************************* */
    const [id, setId] = React.useState("")

    React.useEffect(()=>{
        const createUser = async () => {
            if(existInRoom === false) {
                try {
                    console.log("Room is about to be created...")
                    const members = {
                        senderId: account.user._id,
                        receiverId: id
                    }
                    const res = await axios.post(configData.API_SERVER + "rooms", members)
                    setCurrentChat(res.data)
                } catch(err) {
                    console.log(err)
                }
            }
        }
        createUser()
    },[existInRoom])

    const userHasRoom = async (user) => {
        try {
            setId(user._id)
            setCurrentChatUser(user)
            const res = await axios.get(configData.API_SERVER + "rooms/" + user._id)
            if(res.data.length === 0) {
                console.log("No room found");
            }
            const resp = res.data.map(room => {
                if(room.members.includes(account.user._id)){
                    setCurrentChat(room)
                    return true
                }
                else {
                    return false
                }
            })

            if(resp.includes(true)) {
                setExistInRoom(true)
            } else {
                setExistInRoom(false)
            }

        } catch (error) {
            console.log(error)
        }
    }


    React.useEffect(()=>{
        const getMessages = async () => {
            try {
                const res = await axios.get(configData.API_SERVER + "messages/" + currentChat?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error.message)
            }
        }
        getMessages()
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message= {
            roomId: currentChat._id,
            sender: account.user._id,
            text: newMessage
        }
        const receiverId = currentChat.members.find(m => m !== account.user._id)
        socket.current.emit("sendMessage", {
            senderId: account.user._id,
            receiverId,
            text: newMessage
        })
        try {
            const res = await axios.post(configData.API_SERVER+"messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (error) {
            console.log(error);
        }
    }


    React.useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages])
    return (
        <MainCard title="Chat">
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
                            <List onClick={()=>userHasRoom(user)}>
                                <Room 
                                    users={user} 
                                    room={rooms} 
                                    onlineUsers={onlineUsers}
                                    currentUser={account.user} 
                                    mk={index} 
                                    key={index}/>
                            </List>
                        ))
                    }
                </Grid>
                <Grid item xs={9}>
                    {
                        currentChat && currentChatUser && (
                            <Grid container xs={12} direction="row" justifyContent="center" alignItems="center">
                                <Typography variant="outline">{currentChatUser?.first_name} {currentChatUser?.last_name}</Typography>
                            </Grid>
                        )
                    }

                    <Divider />
                    <List className={classes.messageArea}>
                        {
                            currentChat? 
                                messages? 
                                    messages.map((m, i) => (
                                        <Message message={m} own={m.sender === account.user._id} key={i} mk={i}/>
                                    )) 
                                :
                                    <p align="center">You no conversation with this user, start now!</p> 
                            : <p align="center">Open conversation to start chat!</p>
                        }
                        <div ref={scrollRef} />
                    </List>
                    <Divider />
                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                            <TextField 
                            id="outlined-basic-email" 
                            label="Type Something" 
                            fullWidth 
                            onChange={(e)=>{setNewMessage(e.target.value)}}
                            value={newMessage}/>
                        </Grid>
                        <Grid item xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={handleSubmit}><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
}

export default Chat;