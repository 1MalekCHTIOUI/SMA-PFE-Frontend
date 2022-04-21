import React, { useContext } from 'react';
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
import { CALL_ACCEPTED, CALL_DECLINED, RECEIVING_CALL, CLEAR_DATA } from '../../store/actions';
import { SocketContext } from '../../utils/socket/SocketContext';
import config from '../../config';
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
        overflowY: 'scroll'
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
    },
    spaceBetween: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems:"center",
        padding:"10px"
    }, 
    paddingBottom: {
        paddingBottom:"20px"
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

const ModalC = ({groupName, setGroupName, handleChange, classes, openMenu, setOpenMenu, handleClose, createGroup}) => {

    return <Modal
        open={openMenu}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>

            <Typography className={classes.spaceBetween} id="modal-modal-title" variant="h6" component="h2">
            Create a group chat
            </Typography>

            <TextField 
                id="outlined-basic-email" 
                label="Group name" 
                variant="outlined"
                value={groupName}
                onChange={handleChange}
                fullWidth />

            <Container className={classes.spaceBetween}>
                <Button variant="outlined" color="primary" onClick={createGroup}>Create</Button>
                <Button variant="outlined" color="error" onClick={()=>{setOpenMenu(false);setGroupName("")}}>Go back</Button>
            </Container>
        </Box>
        </Modal>
}

const Chat = () => {
    const classes = useStyles()
    const [users, setUsers] = React.useState([])
    const [rooms, setRooms] = React.useState([])
    const [currentChat, setCurrentChat] = React.useState(null)
    const [messages, setMessages] = React.useState(null)
    const [newMessage, setNewMessage] = React.useState("")
    const [existInRoom, setExistInRoom] = React.useState(null)
    const [currentChatUser, setCurrentChatUser] = React.useState(null)
    const [id, setId] = React.useState("")
    const [startCall, set_StartCall] = React.useState(false)
    const [filter, setFilter] = React.useState("")
    const [filteredList, setFilteredList] = React.useState([])
    const [ROOM_ID, setROOM_ID] = React.useState(null)
    const [name, setName] = React.useState('');
    const [foundUsers, setFoundUsers] = React.useState(null);
    const [inviteCode, setInviteCode] = React.useState(null)
    const [groupName, setGroupName] = React.useState('')
    
    const [openMenu, setOpenMenu] = React.useState(false)

    const {arrivalMessage, onlineUsers, sendMessage, handleCallButton} = useContext(SocketContext)
    const account = useSelector(state => state.account)
    const scrollRef = React.useRef(null)

    const {roomCode} = useParams()
    const userFirstName = account.user.first_name
    const userLastName = account.user.last_name
    const userService = account.user.service

    React.useEffect(()=>{
        setFilteredList(users.filter(user => user._id !== account.user._id))
    },[account.user, users])

    const handleFilter = (e) => {
        setFilter(e.target.value)
    }

    const handleChange = (e) => {
        setGroupName(e.target.value)
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
        console.log("userHasRoom called");

        try {
            setId(user._id)
            setCurrentChatUser(user)
            const res = await axios.get(configData.API_SERVER + "rooms/" + user._id)
            if(res.data.length === 0) {
                console.log("No room found");
            }
            const resp = res.data.map(room => {
                if(room.members.includes(account.user._id) && room.type==='PRIVATE'){
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
            console.log("Get messages");
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
        sendMessage(message.sender, receiverId, newMessage)
        try {
            const res = await axios.post(configData.API_SERVER+"messages", message)
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (error) {
            console.log(error);
        }
    }
    
    const checkUserOnline = (id) => {
        return onlineUsers.some(user => user.userId === id)
    }

    React.useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    },[messages])


    React.useEffect(()=>{
        setInviteCode(roomCode)
    },[])

    
    React.useEffect(()=>{
        setFoundUsers(filteredList)
    }, [filteredList])



    const searchFilter = (e) => {
      const keyword = e.target.value;
      if (keyword !== '') {
        const results = foundUsers.filter((user) => {
          return user.first_name.toLowerCase().startsWith(keyword.toLowerCase());
        });
        setFoundUsers(results);

      } else {
        setFoundUsers(filteredList);
      }

      setName(keyword);
    };
    // const [newGroup, setNewGroup] = useState(null)
    const createGroup = async () => {
        const data = {
            name: groupName,
            type: "PUBLIC"
        }
        try{
            await axios.post(config.API_SERVER+"rooms/newGroup", data)
            // setNewGroup(group.data);

        }catch(e){console.log(e)}
    }

    const [userGroups, setUserGroups] = React.useState([])

    React.useEffect(()=>{
        const getUserGroups = async() => {
            console.log("getUserGroups called");
            try {
                const res = await axios.get(configData.API_SERVER + "rooms/" + account.user._id)
                res.data.map(room => {
                    if(room.type==='PUBLIC'){
                        if(userGroups.length > 0) {
                            userGroups.map(item => {
                                if (item._id !== room._id) {
                                    setUserGroups([...userGroups, room])
                                }
                            })
                        } else {
                            setUserGroups([...userGroups, room])
                        }

                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        getUserGroups()
    },[account])
    const getGroupRoom = (group) => {
        console.log(group._id);
        setCurrentChat(group)
    }

    React.useEffect(() => {
        console.log(currentChat);
    }, [currentChat])
    return (
        <>     
            <MainCard title="Chat">
                {<ModalC handleChange={handleChange} setGroupName={setGroupName} groupName={groupName} classes={classes} setOpenMenu={setOpenMenu} createGroup={createGroup} openMenu={openMenu}/>}
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
                            <Grid item xs={12} style={{padding: '10px'}}>
                                <Button variant="outlined" onClick={()=>setOpenMenu(true)}>Create Group Chat</Button>
                            </Grid>
                            <Divider />
                            <Grid item xs={12} style={{padding: '10px'}}>
                                <TextField 
                                    id="outlined-basic-email" 
                                    label="Search" 
                                    variant="outlined" 
                                    value={name} 
                                    className={classes.select}
                                    onChange={searchFilter} 
                                    fullWidth />
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
                                        onChange={handleFilter}
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
                                <Divider />
                                <Typography variant="overline">Groups</Typography>
                                <Container className={classes.center}>
                                    {userGroups.length===0 &&<Typography variant="subtitle2">No groups</Typography> }
                                </Container>
                                {userGroups?.map(group => (
                                    <List onClick={()=>getGroupRoom(group)}>
                                        <Room
                                            group={group}
                                            currentUser={account.user} />
                                    </List>
                                ))}


                                <Divider />
                                <Typography variant="overline">Users</Typography>
                                {foundUsers?.map((user, index) => (
                                    <List onClick={()=>userHasRoom(user)}>
                                        <Room
                                            users={user}
                                            room={rooms}
                                            onlineUsers={onlineUsers}
                                            currentUser={account.user}
                                            mk={index}
                                            key={index}/>
                                    </List>
                                ))}
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
                            <Container className={classes.messageArea}>
                                {
                                    currentChat? 
                                        messages && messages.map((m, i) => (
                                            <Message message={m} own={m.sender === account.user._id} type={currentChat.type} key={i} mk={i}/>
                                        ))
                                    : <Container className={classes.center}><img src={loader} /></Container>
                                }
                                {
                                    messages?.length === 0 && currentChat && <Typography variant="subtitle2" align="center">You no conversation with this user, start now!</Typography>

                                }
                                <div ref={scrollRef} />
                            </Container>
                            <Divider />
                            {currentChat && 
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
                            }
                        </Grid>
                    </Grid>
                )}
                </MainCard>

           
        </>
    );
}

export default Chat;