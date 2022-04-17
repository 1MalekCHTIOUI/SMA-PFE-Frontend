import React, {createContext, useState, useRef, useEffect} from 'react'
import {io} from 'socket.io-client'
import {useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
const SocketContext = createContext()
const socket = io('http://localhost:8900')

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


    React.useEffect(()=>{
        if(account.token){
            socket.emit("addUser", account.user._id)
        }

        socket.on("getCallerID", (data)=>{
            setCallerId(data)
        })

        socket.on("notif", data => {
            console.log("receing call");
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
    
    },[socket])

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
    
    return (
        <SocketContext.Provider value={{ isReceivingCall, callAccepted, declineInfo, callDeclined, callerMsg, ROOM_ID, join, cleanup, handleAnswer, handleHangup, handleCallButton }}>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext}