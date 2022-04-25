import React, {createContext, useState, useRef, useEffect} from 'react'
import {io} from 'socket.io-client'
import {useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import config from '../../config'
import axios from 'axios'
import { Button, notification } from 'antd';

import { makeStyles } from '@material-ui/styles'
import { Message, Notifications } from '@material-ui/icons'

const SocketContext = createContext()

const socket = io.connect('http://localhost:8900')

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

    React.useEffect(()=>{

        socket.on("getCallerID", (data)=>{
            setCallerId(data)
        })

        socket.on("notif", data => {
            console.log("receiving call");
            setCallerMsg(data.msg)
            setIsReceivingCall(true)
        })
    
        socket.on("callAccepted", (acceptName, status) => {
            console.log("call accepted: ");
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
                const res = await axios.get(config.API_SERVER+'user/users/'+data.senderId)
                openNotification('New message', {sender: `${res.data.first_name} ${res.data.last_name}`, text: data.text}, 'message')
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now()
                })
                console.log("received");
            } catch (error) {
                console.log(error);
            }
        })

        socket.on('getNotification', async data => {
            console.log("got notif");
            const res = await axios.get(config.API_SERVER+'user/users/'+data.senderId)
            openNotification('Group', {sender: `${res.data.first_name} ${res.data.last_name}`, text: data.content}, 'notif')
        })
    },[socket])



    const openNotification = (title, description, type) => {
        notification.open({
            className: classes.notif,
            message: description.sender,
            icon: type==='message' ? <Message />: <Notifications />,
            description: description.text,
            onClick: () => {
            console.log('Notification Clicked!');
            },
        });
    };

    const cleanup = () => {
        console.log("clean");
        setCallDeclined(false)
    }

    const handleCallButton = (val) => {
        socket.emit("callNotif", {
            caller: {firstName: account?.user.first_name, id: account?.user._id}, 
            id: val._id
        })
    }
    const handleAnswer = () =>{
        setCallAccepted(true)
        setIsReceivingCall(false)
        socket.emit("acceptCall", {callerId: callerId, acceptName: `${account.user.first_name} ${account.user.last_name}`})

    }
    socket.on("getRoomID", data => setROOM_ID(data))

    const join = (ROOM_ID) => {
        history.push({pathname: `/videochat/${ROOM_ID}`, state: {allowed: true}})
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
            const data = {
                title: "New message",
                userId: to,
                sender: sender,
                content: message,
            }
            await axios.post(config.API_SERVER+"notifications", data)
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
    const sendMessage = (senderId, receiverId, newMessage) => {
        sendMessageNotification(senderId, receiverId, newMessage)
        socket.emit("sendMessage", {
            senderId: senderId,
            receiverId,
            text: newMessage
        })
    }

    const submitAddMember = async (currentChat, addedMembers) => {
        try {
            addedMembers?.map(async m => {
                const res = await axios.put(config.API_SERVER + 'rooms/addNewGroupMember/'+currentChat._id, {members: m._id})

                socket.emit('sendNotification', {
                    senderId: account.user._id,
                    receiverId: m._id,
                    content: `You have been added to the group ${res.data.name}!`
                })
                sendNotification(account.user._id, m._id, `You have been added to the group ${res.data.name}!`)
                // setStatus(1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const submitRemoveMember = (currentChat, addedMembers) => {
        console.log(addedMembers);
        try {
            addedMembers?.map(async m => {
                const res = await axios.put(config.API_SERVER + `rooms/removeGroupMember/${currentChat._id}/${m._id}`)
                sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`)
                socket.emit('sendNotification', {
                    senderId: account.user._id,
                    receiverId: m._id,
                    content: `You have been removed from the group ${res.data.name}!`
                })
                // setStatus(1)
                // setAddedMembers(addedMembers.filter(member => member._id !== m._id))
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <SocketContext.Provider value={{ isReceivingCall, arrivalMessage, onlineUsers, callAccepted, declineInfo, callDeclined, callerMsg, ROOM_ID,sendNotification,submitAddMember,submitRemoveMember, join,sendMessage, cleanup, handleAnswer, handleHangup, handleCallButton }}>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext}