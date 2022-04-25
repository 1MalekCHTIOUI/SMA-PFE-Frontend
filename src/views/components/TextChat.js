import React, { useContext } from 'react';
import axios from 'axios'
import { io } from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidV4 } from 'uuid'
import { makeStyles } from '@material-ui/styles';
import {Paper, Grid,CircularProgress , Box, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab, Container, MenuItem, Select, FormControl, InputLabel, Button, Modal, Checkbox, OutlinedInput } from '@material-ui/core';
import {Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'

import SendIcon from '@material-ui/icons/Send';
import {Add, Check, PersonRemove, Remove, VideoCall, Delete} from '@material-ui/icons';
import Room from './Room'
import Message from './Message'
import configData from '../../config'
import MainCard from "../../ui-component/cards/MainCard"
import loader from "../../assets/images/planet.gif"
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../utils/socket/SocketContext';
import config from '../../config';
import ModalC from './ModalC';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '100vh'
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
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems:"center",
    },
    tool: {
        cursor: 'pointer',
        marginRight: "0.75rem",
        marginLeft: "0.75rem",
        "&:hover": {
            background:"rgba(0,0,0,0.1)"
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

const ConfirmDialog = (props) => {
    const { title, children, openConfirm, setOpenConfirm, onClose, onConfirm, status } = props;
    return (
      <Dialog
        open={openConfirm}
        onClose={onClose}
        aria-labelledby="confirm-dialog"
      >
        <DialogTitle id="confirm-dialog">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
            {status===0 && (
                <>
                    <Button onClick={() => setOpenConfirm(false)}>No</Button>
                    <Button onClick={() => onConfirm()}>Yes</Button>
                </>
            )}
            {status===1 && (
                <>
                    <Button onClick={() => setOpenConfirm(false)}>Ok</Button>
                </>
            )}

        </DialogActions>
      </Dialog>
    );
};

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v._id === val ? a + 1 : a), 0);

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

    const {submitAddMember,submitRemoveMember, arrivalMessage, onlineUsers, sendMessage, handleCallButton} = useContext(SocketContext)
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


    const [userGroups, setUserGroups] = React.useState([])
    const [groupMembers, setGroupMembers] = React.useState([])

    const getGroupMembers = async () => {
        try {
            const members = await axios.get(config.API_SERVER+"rooms/room/"+ currentChat?._id)
            members.data.members.map(async m => {
                try {
                    if(account.user._id !== m) {
                        const member = await axios.get(config.API_SERVER+"user/users/"+ m)
                        setGroupMembers(prev => [...prev, member.data])    
                    }
                } catch(e) {console.log(e)}
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(()=>{
        const getUserGroups = async() => {
            try {
                const res = await axios.get(configData.API_SERVER + "rooms/" + account.user._id)
                res.data.map(room => {
                    const duplicate = userGroups.some(group => group._id === room._id)
                    if(room.type==='PUBLIC' && duplicate===false){
                        setUserGroups(prev => [...prev, room])
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        getUserGroups()
    },[account.user])


    const getGroupRoom = (group) => {
        setCurrentChat(group)
    }
    // React.useEffect(()=>{
    //     console.log("groupMembers");
    //     console.log(groupMembers);
    // }, [groupMembers])

    const [type, setType] = React.useState('')

    const [addedMembers, setAddedMembers] = React.useState([])

    const onChangeAddedMembers = (e) => {
        setAddedMembers(e.target.value)
    }
    const addMember = () => 
    {
        getGroupMembers()
        setType('add')
        setOpenMenu(true)
    }

    const removeMember = () => {
        getGroupMembers()
        setType('remove')
        setOpenMenu(true)
        setGroupMembers(groupMembers.filter(m => addedMembers.includes(m._id)))
        console.log(groupMembers);
    }

    const handleCreate = () => {
        getGroupMembers()
        setType('create')
        setOpenMenu(true)
    }

    const listMembers = () => {
        getGroupMembers()
        setType('list')
        setOpenMenu(true)
    }

    const handleClose = () => {
        setOpenMenu(false)
        setGroupName("")
        setAddedMembers([])
        setGroupMembers([])
        setStatus(0)
    }
    const [status, setStatus] = React.useState(0)


    const groups = () => {
        // console.log(userGroups);
        return userGroups.map((group, index) => {
            return <List onClick={()=>getGroupRoom(group)}>
                <Room group={group} listKey={index} key={index}/>
            </List>
        })
    }
    // React.useEffect(()=>{
    //     console.log(userGroups);
    // }, [userGroups])

    const [openConfirm, setOpenConfirm] = React.useState(false)

    const submitRemoveGroup = async () => {
        try {
            await axios.delete(config.API_SERVER + `rooms/removeGroup/${currentChat?._id}`)
            setStatus(1)
            window.location.reload(false)   
        } catch (error) {
            console.log(error);
        }
    }
    const submitCreateGroup = async () => {
        let data = {
            name: groupName,
            type: "PUBLIC",
            members: []
        }
        addedMembers.map(m => {
            data.members.push(m._id)
        })

        try{
            await axios.post(config.API_SERVER+"rooms/newGroup", data)
            setStatus(1)
        }catch(e){console.log(e)}
    }
    return (
        <>     
            <MainCard title="Chat">
                <ConfirmDialog
                    title="Please confirm"
                    openConfirm={openConfirm}
                    setOpenConfirm={setOpenConfirm}
                    onConfirm={submitRemoveGroup}
                    status={status}
                >
                    {status===0 ? <Typography align="center">Are you sure you want to delete this group?</Typography> : <Typography align="center">Group deleted!</Typography>}
                </ConfirmDialog>
                {<ModalC
                    groupMembers={groupMembers} 
                    users={users} 
                    type={type} 
                    handleChange={handleChange} 
                    setGroupName={setGroupName} 
                    groupName={groupName} 
                    classes={classes} 
                    setOpenMenu={setOpenMenu} 
                    submitCreateGroup={submitCreateGroup} 
                    openMenu={openMenu}
                    addedMembers={addedMembers}
                    onChangeAddedMembers={onChangeAddedMembers}
                    submitAddMember={submitAddMember}
                    submitRemoveMember={submitRemoveMember}
                    handleClose={handleClose}
                    status={status}
                    currentChat={currentChat}
                    setStatus={setStatus}
                    setOpenConfirm={setOpenConfirm}
                    current={account?.user._id}
                />}
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
                                {account?.user.role[0]!== "USER" && <Button variant="outlined" onClick={handleCreate}>Create Group Chat</Button>}
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

                                {groups()}


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
                                currentChat && currentChatUser && currentChat.type==='PRIVATE' && (
                                    <Grid container xs={12} direction="column" className={classes.center}>
                                        <Typography variant="outline">{currentChatUser?.first_name} {currentChatUser?.last_name}</Typography>
                                        {checkUserOnline(currentChatUser._id) ? <VideoCall className={classes.videoicon} onClick={() => handleCallButton(currentChatUser)}/>: <Typography variant="subtitle2">User offline</Typography>}
                                    </Grid>
                                )
                            }
                            {currentChat && currentChat.type==='PUBLIC' && (
                                <Grid container xs={12} direction="column" className={classes.center}>
                                    <Grid item className={classes.toolbar}>
                                        <Typography variant="outline" style={{cursor:"pointer"}} onClick={listMembers}>{currentChat.name}</Typography>
                                        {account?.user.role[0]!== "USER" && <Delete color="error" style={{cursor:"pointer"}} className={classes.center} onClick={() => setOpenConfirm(true)} />}
                                    </Grid>
                                    <Divider />
                                    {account?.user.role[0]!== "USER" &&
                                    <Grid item className={classes.toolbar}>
                                        <Remove className={classes.tool} onClick={removeMember} />
                                        <Add className={classes.tool} onClick={addMember}/>
                                    </Grid>
                                    }
                                </Grid>
                            )}

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
                                {/* <div ref={scrollRef} /> */}
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