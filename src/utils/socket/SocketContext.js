import React, {createContext, useState, useRef, useEffect} from 'react'
import {io} from 'socket.io-client'
import {useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from '../../config'
import axios from 'axios'
import { Button, notification } from 'antd';
import { v4 } from 'uuid'
import { makeStyles } from '@material-ui/styles'
import { Message, Notifications } from '@material-ui/icons'

const SocketContext = createContext()

const socket = io('https://sma-socket-01.herokuapp.com/')

const useStyles = makeStyles({
    notif : {
        marginTop: '6vh',
        width: 'fit-content'
    }
})

const ContextProvider = ({children}) => {
    const history = useHistory()
    const account = useSelector(s => s.account)
    const dispatch = useDispatch()
    const [callerId, setCallerId] = useState('')
    const [ROOM_ID, setROOM_ID] = useState(null)
    const [declineInfo, setDeclineInfo] = useState(null)
    const [callAccepted, setCallAccepted] = useState(false)
    const [callDeclined, setCallDeclined] = useState(false)
    const [callerMsg, setCallerMsg] = useState("")
    const [isReceivingCall, setIsReceivingCall] = useState(false)
    const [arrivalMessage, setArrivalMessage] = React.useState(null)
    const [adminMessage, setAdminMessage] = React.useState(null)
    const [groupMembers, setGroupMembers] = React.useState([])
    const [currentChat, setCurrentChat] = React.useState(null)

    const [userGroups, setUserGroups] = React.useState([])

    const [arrivalNotification, setArrivalNotification] = React.useState(null)
    const [onlineUsers, setOnlineUsers] = React.useState([])
    const classes = useStyles()
    React.useEffect(()=>{
        if(account.token){
            socket.emit("addUser", account.user._id)
            socket.on("getUsers", users => {
                setOnlineUsers(users)
            })
        }

    },[account.user])

    // React.useEffect(()=>{
    //     console.log(userGroups);

    // },[userGroups])

    const [callData, setCallData] = React.useState({caller: '', receiver: ''})

    React.useEffect(()=>{
        socket.on("getCallerID", (data)=>{
            setCallerId(data)
        })
        socket.on("notif", data => {
            console.log("receiving call");
            setCallerMsg(data.msg)
            setCallData(prev => ({...prev, receiver: data.caller}))
            setIsReceivingCall(true)
        })
    
        socket.on("callAccepted", (acceptName, status) => {
            setCallData(prev => ({...prev, receiver: acceptName.acceptName}))
            socket.on("getRoomID", data => setROOM_ID(data))
            setIsReceivingCall(false)
            setCallAccepted(true)
        })
    
        socket.on("callDeclined", (data) => {
            console.log("call declined");
            setIsReceivingCall(false)
            setCallDeclined(true)
            setDeclineInfo(data.msg)
        })
    
        socket.on("getMessage", async data => {
            try {
                if(data.senderId==='CHAT') {
                    setAdminMessage({
                        sender: data.senderId,
                        text: data.text,
                        createdAt: Date.now(),
                        currentChat: data.currentChat
                    })
                } 

                const res = await axios.get(config.API_SERVER+'user/users/'+data.senderId)
                openNotification(`${res.data.first_name} ${res.data.last_name}`,  data.text, 'message')
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                    currentChat: data.currentChat
                })
                
            } catch (error) {
                console.log(error);
            }
        })

        socket.on('getNotification', async data => {
            console.log("got notif");
            try {
                const res = await axios.get(config.API_SERVER+'user/users/'+data.senderId)
                openNotification(`${res.data.first_name} ${res.data.last_name}`, data.content, 'notif')
                setArrivalNotification({
                    title: 'Group',
                    sender: data.senderId,
                    content: data.content,
                    createdAt: Date.now(),
                    read: false
                })
            } catch(e) {console.log(e)}

        })

        socket.on("getRoomID", data => setROOM_ID(data))

        socket.on('removedFromGroup', data => {
            setUserGroups(prev => prev.filter(group => group._id !== data.currentChat._id))
            setCurrentChat(null)
        })
        
        socket.on('addedToGroup', data => {
            console.log('You have been added!');
            setUserGroups(prev => [...prev, data.currentChat])
        })

        socket.on('groupCreated', data => {
            console.log('New group created!');
            setUserGroups(prev => [...prev, data])
        })
        socket.on('groupRemoved', data => {
            console.log(data);
            setUserGroups(prev => prev.filter(group => group._id !== data._id))
            setCurrentChat(null)
        })

    },[socket])
    const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
        if(callData) {
            setLoaded(true)
        }
    }, [callData])

    const openNotification = (title, description, type) => {
        notification.open({
            className: classes.notif,
            message: description.sender,
            icon: type==='message' ? <Message />: <Notifications />,
            description: description,
            onClick: () => {
            console.log('Notification Clicked!');
            },
        });
    };

    const cleanup = () => {
        console.log("clean");
        setCallDeclined(false)
    }

    const createGroup = (data) => {
        console.log(data);
        socket.emit('createGroup', data)
        data.members.map(async item => {
            if(account.user._id !== item) {
                socket.emit('sendNotification', {
                    senderId: account.user._id,
                    receiverId: item,
                    content: `You have been added to the new group ${data.name}!`,
                })
                await sendNotification(account.user._id, item, `You have been added to the new group ${data.name}!`)    
    
            }
        })
    }
    const removeGroup = (data) => {
        console.log(data);
        
        data.members.map(async item => {
            if(account.user._id !== item) {
                socket.emit('sendNotification', {
                    senderId: account.user._id,
                    receiverId: item,
                    content: `${data.name} has been removed!`,
                })
                await sendNotification(account.user._id, item, `${data.name} has been removed!`)
            }
        })
        socket.emit('removeGroup', data)
        
    }

    const handleCallButton = (val) => {
        const uid = v4()
        socket.emit("callNotif", {
            caller: {fullName: `${account?.user.first_name} ${account?.user.last_name}`, id: account?.user._id}, 
            id: val._id,
            room: uid
        })
        setROOM_ID(uid)

    }

    const handleAnswer = async () =>{
        setCallAccepted(true)
        setIsReceivingCall(false)

        socket.emit("acceptCall", {callerId: callerId, acceptName: `${account.user.first_name} ${account.user.last_name}`})

        try {
            const user = await axios.get(config.API_SERVER+'user/users/'+callerId)
            setCallData(prev => ({...prev, caller: `${user.data.first_name} ${user.data.last_name}`}))

        } catch(e) {console.log(e)}

    }


    const join = (ROOM_ID, type) => {
        history.push({pathname: `/videochat/${ROOM_ID}`, state: {allowed: true, callData, type}})
    }

    const handleHangup = () => {
        setIsReceivingCall(false)
        setCallAccepted(false)
        if(callerId) {
            socket.emit("declineCall", {callerId: callerId, declinerName: `${account.user.first_name} ${account.user.last_name}`})
        }
    }
    const sendMessageNotification = async (sender, to, message) => {
        try {
            const u = await axios.get(config.API_SERVER+'user/users/'+sender)
            try {
                const data = {
                    title: u.data.first_name +' '+ u.data.last_name,
                    userId: to,
                    sender: sender,
                    content: message,
                }
                const res = await axios.post(config.API_SERVER+"notifications", data)
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const sendNotification = async (sender, to, message) => {
        try {
            const data = {
                title: "Group",
                userId: to,
                sender: sender,
                content: message,
            }
            await axios.post(config.API_SERVER+"notifications", data)
        } catch (error) {
            console.log(error);
        }
    }
    const sendMessage = async (senderId, receiverId, newMessage, currentChat) => {
        await sendMessageNotification(senderId, receiverId, newMessage)
        socket.emit("sendMessage", {
            senderId: senderId,
            receiverId,
            text: newMessage,
            currentChat
        })
    }

    const removeMessagesFromRoom = async (roomId) => {
        console.log('removing messages from: '+roomId);
        try {
            await axios.delete(config.API_SERVER+'rooms/removeMessages/'+roomId)
        } catch (error) {
            console.log(error);
        }
    }

    const submitAddMember = async (currentChat, addedMembers) => {
        try {
            addedMembers?.map(async m => {
                try {
                    const res = await axios.put(config.API_SERVER + 'rooms/addNewGroupMember/'+currentChat._id, {members: m._id})
                    socket.emit('sendNotification', {
                        senderId: account.user._id,
                        receiverId: m._id,
                        content: `You have been added to the group ${res.data.name}!`,
                    })
                    await sendNotification(account.user._id, m._id, `You have been added to the group ${res.data.name}!`)
                    socket.emit('addToGroup', {currentChat, addedUser: m._id})
                    try {
                        const user = await axios.get(config.API_SERVER+'user/users/'+m._id)
                        try{
                            const data = {
                                roomId: currentChat._id,
                                sender: "CHAT",
                                text: `${user.data.first_name} ${user.data.last_name} has been added to the group!`
                            }
                            const res = await axios.post(config.API_SERVER+"messages", data)
                            try {
                                const room = await axios.get(config.API_SERVER + 'rooms/room/'+currentChat._id)
                                if(room.data.type==='PUBLIC') {
                                    room.data.members.map(member => {
                                        if(member !== account.user._id) sendMessage('CHAT', member, res.data.text, currentChat._id)
                                    })
                                }
                                setAdminMessage(data)
                            }catch(e){console.log(e)}
                        }catch(e){console.log(e)}
                    } catch(e) {console.log(e)}
                } catch(e) {console.log(e.response.data.message)}
            })


        } catch (error) {
            console.log(error);
        }
    }

    const submitRemoveMember = (currentChat, addedMembers) => {

        try {
            addedMembers?.map(async m => {
                try{
                    const res = await axios.put(config.API_SERVER + `rooms/removeGroupMember/${currentChat._id}/${m._id}`)
                    sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`)
                    socket.emit('sendNotification', {
                        senderId: account.user._id,
                        receiverId: m._id,
                        content: `You have been removed from the group ${res.data.name}!`
                    })
                    socket.emit('removeFromGroup', {currentChat, removedUser: m._id})
                    try {
                        const user = await axios.get(config.API_SERVER+'user/users/'+m._id)
                        const data = {
                            roomId: currentChat._id,
                            sender: "CHAT",
                            text: `${user.data.first_name} ${user.data.last_name} has been removed from the group!`
                        }
                        try {
                            const res = await axios.post(config.API_SERVER+"messages", data)
                            try {
                                const room = await axios.get(config.API_SERVER + 'rooms/room/'+currentChat._id)
                                try {
                                    if(room.data.type==='PUBLIC') {
                                        room.data.members?.map(member => {
                                            if(member !== account.user._id) sendMessage('CHAT', member, res.data.text, currentChat._id)
                                        })
                                    }
                                    setAdminMessage(data)
                                } catch(e) {console.log(e)}
                            } catch(e) {console.log(e)}
                        } catch(e) {console.log(e)}
                    } catch(e) {console.log(e)}
                }catch(e){console.log(e)}
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <SocketContext.Provider value={{ 
            isReceivingCall,userGroups, currentChat, arrivalNotification, loaded, arrivalMessage, adminMessage, onlineUsers, callAccepted, declineInfo, callDeclined, callerMsg, ROOM_ID,
            sendNotification, removeMessagesFromRoom, createGroup, removeGroup, setUserGroups, setCurrentChat, sendNotification, submitAddMember,submitRemoveMember, join,sendMessage, cleanup, handleAnswer, handleHangup, handleCallButton }}>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext}