import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../config';
import axios from 'axios';
import { Button, notification } from 'antd';
import { v4 } from 'uuid';
import { makeStyles } from '@material-ui/styles';
import { Message, Notifications } from '@material-ui/icons';
import moment from 'moment';
const SocketContext = createContext();

const socket = io('https://sma-socket-01.herokuapp.com/');

const useStyles = makeStyles({
    notif: {
        marginTop: '6vh',
        width: 'fit-content'
    }
});

const ContextProvider = ({ children }) => {
    const history = useHistory();
    const account = useSelector((s) => s.account);
    const dispatch = useDispatch();
    const [callerId, setCallerId] = useState('');
    const [ROOM_ID, setROOM_ID] = useState(null);
    const [declineInfo, setDeclineInfo] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callDeclined, setCallDeclined] = useState(false);
    const [callerMsg, setCallerMsg] = useState('');
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [arrivalMessage, setArrivalMessage] = React.useState(null);
    const [adminMessage, setAdminMessage] = React.useState(null);
    const [groupMembers, setGroupMembers] = React.useState([]);
    const [currentChat, setCurrentChat] = React.useState(null);

    const [userGroups, setUserGroups] = React.useState([]);

    const [arrivalNotification, setArrivalNotification] = React.useState(null);
    const [onlineUsers, setOnlineUsers] = React.useState([]);
    const classes = useStyles();
    React.useEffect(() => {
        if (account.token) {
            socket.emit('addUser', { userId: account.user._id, user: account.user });
            socket.on('getUsers', (users) => {
                setOnlineUsers(users);
                console.log(onlineUsers);
            });
        }
    }, [account.user]);

    // React.useEffect(()=>{
    //     console.log(userGroups);

    // },[userGroups])

    const [callData, setCallData] = React.useState({ caller: '', receiver: '' });

    React.useEffect(() => {
        socket.on('getCallerID', (data) => {
            setCallerId(data);
        });
        socket.on('notif', (data) => {
            console.log('receiving call');
            setCallerMsg(data.msg);
            setCallData((prev) => ({ ...prev, receiver: data.caller }));
            setIsReceivingCall(true);
        });

        socket.on('callAccepted', (acceptName, status) => {
            setCallData((prev) => ({ ...prev, receiver: acceptName.acceptName }));
            socket.on('getRoomID', (data) => setROOM_ID(data));
            setIsReceivingCall(false);
            setCallAccepted(true);
        });

        socket.on('callDeclined', (data) => {
            console.log('call declined');
            setIsReceivingCall(false);
            setCallDeclined(true);
            setDeclineInfo(data.msg);
        });

        socket.on('getMessage', async (data) => {
            if (data.senderId === 'CHAT') {
                setAdminMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                    currentChat: data.currentChat
                });
            } else {
                try {
                    console.log(data);
                    const res = await axios.get(config.API_SERVER + 'user/users/' + data.senderId);
                    const name = `${res.data.first_name} ${res.data.last_name}`;
                    try {
                        const x = await axios.get(config.API_SERVER + 'rooms/room/' + data.currentChat);
                        openNotification(x.data.type === 'PRIVATE' ? name : `${name} to ${x.data.name}`, data.text, 'message');
                        setArrivalMessage({
                            sender: data.senderId,
                            text: data.text,
                            attachment: data.attachement,
                            createdAt: Date.now(),
                            currentChat: data.currentChat
                        });
                        setArrivalNotification({
                            title: x.data.type === 'PRIVATE' ? name : `${name} to ${x.data.name}`,
                            sender: data.senderId,
                            content: data.text,
                            createdAt: Date.now(),
                            read: false
                        });
                    } catch (e) {
                        console.log(e);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });

        socket.on('getNotification', async (data) => {
            console.log('got notif');
            try {
                const res = await axios.get(config.API_SERVER + 'user/users/' + data.senderId);
                openNotification(`${res.data.first_name} ${res.data.last_name}`, data.content, 'notif');
                setArrivalNotification({
                    title: 'Group',
                    sender: data.senderId,
                    content: data.content,
                    createdAt: Date.now(),
                    read: false
                });
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('getRoomID', (data) => setROOM_ID(data));

        socket.on('removedFromGroup', (data) => {
            setUserGroups((prev) => prev.filter((group) => group._id !== data.currentChat._id));
            setCurrentChat(null);
        });

        socket.on('addedToGroup', (data) => {
            console.log('You have been added!');
            setUserGroups((prev) => [...prev, data.currentChat]);
        });

        socket.on('groupCreated', (data) => {
            console.log('New group created!');
            setUserGroups((prev) => [...prev, data]);
        });
        socket.on('groupRemoved', (data) => {
            console.log(data);
            setUserGroups((prev) => prev.filter((group) => group._id !== data._id));
            setCurrentChat(null);
        });
        socket.on('newPost', (data) => {
            if (account.user._id !== data.senderId) {
                openNotification('New post', data.content, 'notif');
                saveNotificationToDB({
                    actor: data.senderId,
                    content: data.content
                });
                setArrivalNotification({
                    title: 'New post',
                    sender: data.senderId,
                    content: data.content,
                    createdAt: Date.now(),
                    read: false
                });
            }

            // saveNotificationToDB({
            //     actor: account.user.first_name + ' ' + account.user.last_name,
            //     content: `${account.user.first_name} ${account.user.last_name} liked your post`
            // });
        });
        socket.on('newLike', (data) => {
            if (account.user._id !== data.senderId) {
                openNotification('New like', data.content, 'notif');
                saveNotificationToDB({
                    actor: data.senderId,
                    content: data.content
                });
                setArrivalNotification({
                    title: 'New like',
                    sender: data.senderId,
                    content: data.content,
                    createdAt: Date.now(),
                    read: false
                });
            }
        });
    }, [socket]);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (callData) {
            setLoaded(true);
        }
    }, [callData]);

    const openNotification = (title, description, type) => {
        notification.open({
            className: classes.notif,
            message: title,
            icon: type === 'message' ? <Message /> : <Notifications />,
            description: description,
            onClick: () => {
                console.log('Notification Clicked!');
            }
        });
    };

    const cleanup = () => {
        console.log('clean');
        setCallDeclined(false);
    };

    const createGroup = (data) => {
        console.log(data);
        socket.emit('createGroup', data);
        data.members.map(async (item) => {
            if (account.user._id !== item.userId) {
                socket.emit('sendNotification', {
                    senderId: account.user._id,
                    receiverId: item.userId,
                    content: `You have been added to the new group ${data.name}!`
                });
                await sendNotification(account.user._id, item.userId, `You have been added to the new group ${data.name}!`);
            }
        });
    };
    const removeGroup = (data) => {
        console.log(data);

        data.members.map(async (item) => {
            if (account.user._id !== item.userId) {
                socket.emit('sendNotification', {
                    senderId: account.user._id,
                    receiverId: item.userId,
                    content: `${data.name} has been removed!`
                });
                await sendNotification(account.user._id, item.userId, `${data.name} has been removed!`);
            }
        });
        socket.emit('removeGroup', data);
    };

    const handleCallButton = (val) => {
        const uid = v4();
        socket.emit('callNotif', {
            caller: { fullName: `${account?.user.first_name} ${account?.user.last_name}`, id: account?.user._id },
            id: val._id,
            room: uid
        });
        setROOM_ID(uid);
    };
    const emitNewPost = async (uid, priority) => {
        // sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
        try {
            const u = await axios.get(config.API_SERVER + 'user/users/' + uid);
            socket.emit('newPost', {
                senderId: account.user._id,
                content: `${u.data.first_name} ${u.data.last_name} uploaded a new ${priority ? 'announcement' : 'post'}!`
            });
        } catch (error) {
            console.log(error);
        }
    };

    const emitNewLike = async (senderId, receiverId) => {
        // sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
        try {
            // const u = await axios.get(config.API_SERVER + 'user/users/' + uid);
            socket.emit('newLike', {
                senderId,
                receiverId: receiverId,
                content: `${account.user.first_name} ${account.user.last_name} liked your post!`
            });
        } catch (error) {
            console.log(error);
        }
    };
    const handleAnswer = async () => {
        setCallAccepted(true);
        setIsReceivingCall(false);

        socket.emit('acceptCall', { callerId: callerId, acceptName: `${account.user.first_name} ${account.user.last_name}` });

        try {
            const user = await axios.get(config.API_SERVER + 'user/users/' + callerId);
            setCallData((prev) => ({ ...prev, caller: `${user.data.first_name} ${user.data.last_name}` }));
        } catch (e) {
            console.log(e);
        }
    };

    const join = (ROOM_ID, type) => {
        history.push({ pathname: `/videochat/${ROOM_ID}`, state: { allowed: true, callData, type } });
    };

    const handleHangup = () => {
        setIsReceivingCall(false);
        setCallAccepted(false);
        if (callerId) {
            socket.emit('declineCall', { callerId: callerId, declinerName: `${account.user.first_name} ${account.user.last_name}` });
        }
    };
    const sendMessageNotification = async (sender, to, message) => {
        try {
            const u = await axios.get(config.API_SERVER + 'user/users/' + sender);
            try {
                const data = {
                    title: u.data.first_name + ' ' + u.data.last_name,
                    userId: to,
                    sender: sender,
                    content: message
                };
                const res = await axios.post(config.API_SERVER + 'notifications', data);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const saveNotificationToDB = async (props) => {
        try {
            const u = await axios.get(config.API_SERVER + 'user/users/' + props.actor);
            try {
                const data = {
                    title: u.data.first_name + ' ' + u.data.last_name,
                    content: props.content
                };
                await axios.post(config.API_SERVER + 'notifications', data);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const sendNotification = async (sender, to, message) => {
        try {
            const data = {
                title: 'Group',
                userId: to,
                sender: sender,
                content: message
            };
            await axios.post(config.API_SERVER + 'notifications', data);
        } catch (error) {
            console.log(error);
        }
    };
    const sendMessage = (senderId, receiverId, newMessage, currentChat, attachement = []) => {
        sendMessageNotification(senderId, receiverId, newMessage);
        console.log(currentChat);
        socket.emit('sendMessage', {
            senderId: senderId,
            receiverId,
            text: newMessage,
            attachement,
            currentChat
        });
    };

    const removeMessagesFromRoom = async (roomId) => {
        console.log('removing messages from: ' + roomId);
        try {
            await axios.delete(config.API_SERVER + 'rooms/removeMessages/' + roomId);
        } catch (error) {
            console.log(error);
        }
    };

    const submitAddMember = async (currentChat, addedMembers) => {
        try {
            addedMembers?.map(async (m) => {
                try {
                    const res = await axios.put(config.API_SERVER + 'rooms/addNewGroupMember/' + currentChat._id, {
                        members: { userId: m._id, joinedIn: moment().toISOString(), leftIn: '' }
                    });
                    socket.emit('sendNotification', {
                        senderId: account.user._id,
                        receiverId: m._id,
                        content: `You have been added to the group ${res.data.name}!`
                    });
                    await sendNotification(account.user._id, m._id, `You have been added to the group ${res.data.name}!`);
                    socket.emit('addToGroup', { currentChat, addedUser: m._id });
                    try {
                        const user = await axios.get(config.API_SERVER + 'user/users/' + m._id);
                        try {
                            const data = {
                                roomId: currentChat._id,
                                sender: 'CHAT',
                                text: `${user.data.first_name} ${user.data.last_name} has been added to the group!`
                            };
                            const res = await axios.post(config.API_SERVER + 'messages', data);
                            try {
                                const room = await axios.get(config.API_SERVER + 'rooms/room/' + currentChat._id);
                                if (room.data.type === 'PUBLIC') {
                                    room.data.members.map((member) => {
                                        sendMessage('CHAT', member.userId, res.data.text, currentChat._id);
                                    });
                                }
                                setAdminMessage(data);
                            } catch (e) {
                                console.log(e);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } catch (e) {
                    console.log(e.response.data.message);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    const exitGroup = async (currentChat, user) => {
        try {
            try {
                await axios.put(config.API_SERVER + `rooms/removeGroupMember/${currentChat._id}/${user._id}`);

                try {
                    const data = {
                        roomId: currentChat._id,
                        sender: 'CHAT',
                        text: `${user.first_name} ${user.last_name} has exited the group!`
                    };
                    try {
                        const res = await axios.post(config.API_SERVER + 'messages', data);
                        try {
                            const room = await axios.get(config.API_SERVER + 'rooms/room/' + currentChat._id);
                            try {
                                if (room.data.type === 'PUBLIC') {
                                    room.data.members?.map((member) => {
                                        if (member.userId !== account.user._id)
                                            sendMessage('CHAT', member.userId, res.data.text, currentChat._id);
                                    });
                                }
                                setAdminMessage(data);
                            } catch (e) {
                                console.log(e);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    window.location.reload();
                } catch (e) {
                    console.log(e);
                }
            } catch (e) {
                console.log(e);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submitRemoveMember = (currentChat, addedMembers) => {
        try {
            addedMembers?.map(async (m) => {
                try {
                    const res = await axios.put(config.API_SERVER + `rooms/removeGroupMember/${currentChat._id}/${m._id}`);
                    sendNotification(account.user._id, m._id, `You have been removed from the group ${res.data.name}!`);
                    socket.emit('sendNotification', {
                        senderId: account.user._id,
                        receiverId: m._id,
                        content: `You have been removed from the group ${res.data.name}!`
                    });
                    socket.emit('removeFromGroup', { currentChat, removedUser: m._id });
                    try {
                        const user = await axios.get(config.API_SERVER + 'user/users/' + m._id);
                        const data = {
                            roomId: currentChat._id,
                            sender: 'CHAT',
                            text: `${user.data.first_name} ${user.data.last_name} has been removed from the group!`
                        };
                        try {
                            const res = await axios.post(config.API_SERVER + 'messages', data);
                            try {
                                const room = await axios.get(config.API_SERVER + 'rooms/room/' + currentChat._id);
                                try {
                                    if (room.data.type === 'PUBLIC') {
                                        room.data.members?.map((member) => {
                                            if (member.userId !== account.user._id)
                                                sendMessage('CHAT', member.userId, res.data.text, currentChat._id);
                                        });
                                    }
                                    setAdminMessage(data);
                                } catch (e) {
                                    console.log(e);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SocketContext.Provider
            value={{
                isReceivingCall,
                userGroups,
                currentChat,
                arrivalNotification,
                loaded,
                arrivalMessage,
                adminMessage,
                onlineUsers,
                callAccepted,
                declineInfo,
                callDeclined,
                callerMsg,
                ROOM_ID,
                sendNotification,
                removeMessagesFromRoom,
                createGroup,
                removeGroup,
                setUserGroups,
                setCurrentChat,
                sendNotification,
                submitAddMember,
                submitRemoveMember,
                join,
                sendMessage,
                cleanup,
                handleAnswer,
                handleHangup,
                handleCallButton,
                exitGroup,
                emitNewPost,
                emitNewLike
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
