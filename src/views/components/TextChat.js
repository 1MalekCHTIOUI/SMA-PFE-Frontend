import React from 'react';
import axios from 'axios'
import { io } from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidV4 } from 'uuid'
import { makeStyles } from '@material-ui/styles';
import {Paper, Grid,CircularProgress , Box, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Container, MenuItem, Select, FormControl, InputLabel, Button, Modal } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import {VideoCall} from '@material-ui/icons';
import Room from './Room'
import Message from './Message'
import configData from '../../config'
import MainCard from "../../ui-component/cards/MainCard"
import loader from "../../assets/images/planet.gif"
import Videochat from '../pages/messenger/videoChat';
import { Transition } from 'react-transition-group';
import { useHistory, useParams } from 'react-router-dom';
import { CALL_ACCEPTED, CALL_DECLINED, RECEIVING_CALL } from '../../store/actions';
// import { ContextProvider } from '../../../utils/socket/SocketContext';

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
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems:"center"
    },
    videoicon: {
        "&:hover": {
            cursor: "pointer",
        }
    }

});

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}

const defaultStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: "1rem"
}
const chatStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: "none",
    borderRadius: "0.25rem",
    p: 4,
  };

const Chat = ({setShowText}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const callSocket = useSelector(s => s.socket)
    const [users, setUsers] = React.useState([])
    const [rooms, setRooms] = React.useState([])
    const [currentChat, setCurrentChat] = React.useState(null)
    const [messages, setMessages] = React.useState(null)
    const [newMessage, setNewMessage] = React.useState("")
    const [onlineUsers, setOnlineUsers] = React.useState([])
    const [arrivalMessage, setArrivalMessage] = React.useState(null)
    const [existInRoom, setExistInRoom] = React.useState(null)
    const [currentChatUser, setCurrentChatUser] = React.useState(null)
    const [id, setId] = React.useState("")
    const [startCall, set_StartCall] = React.useState(false)
    const [filter, setFilter] = React.useState("")
    const [filteredList, setFilteredList] = React.useState([])
    const [ROOM_ID, setROOM_ID] = React.useState(null)
    // const [isReceivingCall, setIsReceivingCall] = React.useState(false)
    
    const socket = React.useRef(io.connect("http://localhost:8900"))
    const videoSocketRef = React.useRef();
    const account = useSelector(state => state.account)
    const scrollRef = React.useRef(null)
    const userFirstName = account.user.first_name
    const userLastName = account.user.last_name
    const userService = account.user.service

    React.useEffect(()=>{
        videoSocketRef.current = io.connect("http://localhost:7000");
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    },[account.user])

    React.useEffect(()=>{
        setFilteredList(users.filter(user => user._id !== account.user._id))
    },[account.user, users])

    const handleFilter = (e) => {
        setFilter(e.target.value)
    }

    React.useEffect(()=>{
        if(filter !== "") {
            setFilteredList(users.filter(user => user.service === filter && user._id !== account?.user._id))
            if(filter === "ALL") {
                setFilteredList(users)
            }
        }
    },[filter])

    
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

    // React.useEffect(()=>{
    //     console.log(onlineUsers);
    // },[onlineUsers])

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


    const [selectedSocket, setSelectedSocket] = React.useState(null)

    

    const checkUserOnline = (id) => {
        return onlineUsers.some(user => user.userId === id)
    }

    const getUserSocket = (id) => {
        let socket = ""
        onlineUsers.map(user => {
            if(user.userId === id) {
                socket = user.socketId
            }
        })
        return socket
    }
    const getMySocket = () => {
        let socket = ""
        onlineUsers.map(user => {
            if(user.userId === account.user._id) {
                socket = user.socketId
            }
        })
        return socket
    }
    React.useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages])


    React.useEffect(()=>{
        socket.current.on("notif", data => {
            if(data.msg!==""){
                dispatch({type: RECEIVING_CALL, payload: {isReceivingCall: true, message: data.msg}})
            }
        })
        socket.current.on("getRoomID", data => setROOM_ID(data))
    },[socket])


    const handleCallButton = (val) => {
        socket.current.emit("callNotif", {
            caller: {firstName: account?.user.first_name, id: account?.user._id}, 
            id: val._id
        })
        join()
        set_StartCall(true)
    }

    const handleAnswer = () =>{
        dispatch({type: CALL_ACCEPTED})
        // console.log(incomingCallData?.socket);
        join()
    }
    const join = () => {
        if(ROOM_ID!=null){
            history.push(`/videochat/${ROOM_ID}`)
        }
    }
    socket.current.on("getCallerID", (data)=>{
        setCallerId(data)
    })
    const [callerId, setCallerId] = React.useState(null)
    const [declineInfo, setDeclineInfo] = React.useState(null)

    const handleHangup = () => {
        callerId && socket.current.emit("declineCall", {callerId: callerId, declinerName: `${account.user.first_name} ${account.user.last_name}`})
        dispatch({type: CALL_DECLINED})
    }

    socket.current.on("callDeclined", (data)=>{
        setDeclineInfo(data.msg)
    })



    const [showChat, setShowChat] = React.useState(true)
    const [inviteCode, setInviteCode] = React.useState(null)
    const {roomCode} = useParams()
    React.useEffect(()=>{
        setInviteCode(roomCode)
    },[])

    const history = useHistory()

    const [show, setShow] = React.useState(false)

    React.useEffect(() => {

        if(declineInfo!==null) {
            setShow(true)
            const timeId = setTimeout(() => {

                setDeclineInfo(null)
                setShow(false)
              }, 3000)
              console.log(timeId);
              return () => {
                clearTimeout(timeId)
              }
        } else {
            setShow(true)
        }
    }, [declineInfo]);

    return (
        <>     
            <MainCard title="Chat">
                <div>
                    <Modal
                        className={classes.modal}
                        keepMounted
                        open={callSocket?.isReceivingCall || (declineInfo!==null && show)}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
                            <Typography align="center" id="keep-mounted-modal-title" variant="h4" component="h2">
                                {callSocket?.isReceivingCall && callSocket?.message}
                                {declineInfo!==null && declineInfo}
                            </Typography>
                            { callSocket?.isReceivingCall &&        
                                <Container style={{display:"flex", justifyContent: "space-evenly"}} id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                                    <Button variant="outlined" color="success" onClick={handleAnswer}>Primary</Button>
                                    <Button variant="outlined" color="error" onClick={handleHangup}>Hangup</Button>
                                </Container>
                            }
                        </Box>
                    </Modal>
                </div>
                {inviteCode || startCall===false && (
                    <Grid container component={Paper} className={classes.chatSection}>
                        <Grid item xs={3} className={classes.borderRight500}>
                            <List>
                                <ListItem button key={userFirstName}>
                                    <ListItemIcon>
                                    <Avatar alt={userFirstName} src="../../assets/images/users/user.svg" />
                                    </ListItemIcon>

                                    <Grid direction="row">
                                        <ListItemText className={classes.items} primary={`${userFirstName} ${userLastName}`} />
                                        <ListItemText className={classes.items}>
                                            <Typography variant="subtitle2">
                                                {userService.replaceAll('_', ' ')}
                                            </Typography>
                                        </ListItemText>
                                    </Grid>
                            
                                </ListItem>
                            </List>
                            <Divider />
                            <Grid item xs={12} style={{padding: '10px'}}>
                                <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                            </Grid>
                            <Divider />
                            <Grid item xs={12} style={{padding: '10px'}}>
                                <FormControl fullWidth>
                                    <InputLabel id="filter">Filter</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Filter"
                                        name="filter"
                                        id="filter"
                                        type="text"
                                        value={filter}
                                        // onBlur={handleBlur}
                                        onChange={handleFilter}
                                        // className={classes.loginInput}
                                    >                        
                                    <MenuItem value="ALL">Show all</MenuItem>
                                    <MenuItem value="HUMAN_RESOURCES">Human resources manager</MenuItem>
                                    <MenuItem value="GRAPHIC_DESIGNER">Graphic designer</MenuItem>
                                    <MenuItem value="PRODUCT_MANAGER">Product manager</MenuItem>
                                    <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                                    <MenuItem value="FULLSTACK_DEVELOPER">Fullstack developer</MenuItem>
                                    <MenuItem value="BACKEND_DEVELOPER">Backend developer</MenuItem>
                                    <MenuItem value="FRONTEND_DEVELOPER">Frontend developer</MenuItem>
                                    <MenuItem value="UX/UI_DESIGNER">UX/UI designer</MenuItem>
                                    </Select>  
                                </FormControl>
                                                            
                            </Grid>
                                {filteredList.map((user, index) => (
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
                                    <Grid container xs={12} direction="column" justifyContent="center" alignItems="center">
                                        <Typography variant="outline">{currentChatUser?.first_name} {currentChatUser?.last_name}</Typography>
                                        {checkUserOnline(currentChatUser._id) ? <VideoCall className={classes.videoicon} onClick={() => handleCallButton(currentChatUser)}/>: <Typography variant="subtitle2">User offline</Typography>}
                                    </Grid>
                                )
                            }

                            <Divider />
                            <List className={classes.messageArea}>
                                {
                                    currentChat? 
                                        messages && messages.map((m, i) => (
                                            <Message message={m} own={m.sender === account.user._id} key={i} mk={i}/>
                                        ))
                                    : <Container className={classes.center}><img  src={loader} /></Container>
                                }
                                {
                                    messages?.length === 0 && currentChat && <Typography variant="subtitle2" align="center">You no conversation with this user, start now!</Typography>

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
                )}
                </MainCard>

           
        </>
    );
}

export default Chat;