import React, { useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidV4 } from 'uuid';
import { makeStyles } from '@material-ui/styles';
import {
    ImageList,
    ImageListItem,
    Paper,
    Grid,
    Collapse,
    CircularProgress,
    Box,
    Divider,
    TextField,
    ButtonGroup,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Fab,
    Container,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    Modal,
    Checkbox,
    OutlinedInput,
    Input,
    Fade
} from '@material-ui/core';
import { Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Alert as CopiedAlert } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import ScrollToBottom from 'react-scroll-to-bottom';
import ScrollableFeed from 'react-scrollable-feed';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import {CSSTransition} from 'react-transition-group';
import moment from 'moment';
import SendIcon from '@material-ui/icons/Send';
import {
    Add,
    ExpandLess,
    ExpandMore,
    Check,
    PersonRemove,
    Remove,
    VideoCall,
    Delete,
    AttachFile,
    PictureAsPdf,
    Close,
    VideoLibrary,
    KeyboardReturn
} from '@material-ui/icons';
import Room from './Room';
import Message from './Message';
import configData from '../../config';
import MainCard from '../../ui-component/cards/MainCard';
import loader from '../../assets/images/planet.gif';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../utils/socket/SocketContext';
import config from '../../config';
import ModalC from './ModalC';
import { addStr, generateRandomString, randomNumber } from '../../utils/scripts';
import USER1 from '../../assets/images/users/user.svg';
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650
    },
    chatSection: {
        width: '100%',
        height: 'min(70vh, 100%)'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        position: 'relative',
        height: '70vh',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    message: {
        position: 'absolute'
    },
    items: {
        marginLeft: '0.1rem',
        letterSpacing: '0.03rem'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoicon: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    spaceBetween: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '10px'
    },
    paddingBottom: {
        paddingBottom: '20px'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tool: {
        cursor: 'pointer',
        marginRight: '0.75rem',
        marginLeft: '0.75rem',
        '&:hover': {
            background: 'rgba(0,0,0,0.1)'
        }
    },

    X: {
        position: 'absolute',
        top: '-5px',
        color: 'black',
        // left: '10vw',
        right: '15px',
        cursor: 'pointer'
    },
    selectedItem: {
        // padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '5rem',
        position: 'relative'
    },
    disableTextSelection: {
        userSelect: 'none'
    },
    scrollBar: {
        height: 'auto',
        maxHeight: '30vh !important'
    }
}));

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
};

const defaultStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
};
const chatStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0
};

const ConfirmDialog = (props) => {
    const { title, children, openConfirm, setOpenConfirm, onClose, onConfirm, status, code, isCode } = props;
    const [copied, setCopied] = React.useState(false);
    return (
        <Dialog open={openConfirm} onClose={onClose} aria-labelledby="confirm-dialog">
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>

            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {status === 0 && (
                    <>
                        <Button onClick={() => setOpenConfirm(false)}>No</Button>
                        <Button onClick={() => onConfirm()}>Yes</Button>
                    </>
                )}
                {status === 1 && (
                    <>
                        <Button onClick={() => setOpenConfirm(false)}>Ok</Button>
                    </>
                )}
                {!status && isCode && (
                    <>
                        <Button onClick={onConfirm}>Generate room link</Button>
                        {
                            <CopyToClipboard text={`http://localhost:3000/videoChat/${code}`} onCopy={() => setCopied(true)}>
                                <Button disabled={code === '' || copied}>{copied ? 'Link copied' : 'Copy link'}</Button>
                            </CopyToClipboard>
                        }
                        <Button
                            onClick={() => {
                                setOpenConfirm(false);
                                setCopied(false);
                            }}
                        >
                            Close
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v._id === val ? a + 1 : a), 0);

const Chat = () => {
    const classes = useStyles();
    const [users, setUsers] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);
    // const [currentChat, setCurrentChat] = React.useState(null)
    const [messages, setMessages] = React.useState(null);
    const [newMessage, setNewMessage] = React.useState('');
    const [existInRoom, setExistInRoom] = React.useState(null);
    const [currentChatUser, setCurrentChatUser] = React.useState(null);
    const [id, setId] = React.useState('');
    const [startCall, set_StartCall] = React.useState(false);
    const [filter, setFilter] = React.useState('');
    const [filteredList, setFilteredList] = React.useState([]);
    const [ROOM_ID, setROOM_ID] = React.useState(null);
    const [name, setName] = React.useState('');
    const [foundUsers, setFoundUsers] = React.useState(null);
    const [inviteCode, setInviteCode] = React.useState(null);
    const [groupName, setGroupName] = React.useState('');
    const [roomsLoading, setRoomsLoading] = React.useState(true);

    const [openMenu, setOpenMenu] = React.useState(false);

    const {
        submitAddMember,
        submitRemoveMember,
        arrivalMessage,
        userGroups,
        setUserGroups,
        createGroup,
        currentChat,
        setCurrentChat,
        removeMessagesFromRoom,
        removeGroup,
        adminMessage,
        onlineUsers,
        sendMessage,
        handleCallButton,
        exitGroup
    } = useContext(SocketContext);
    const account = useSelector((state) => state.account);
    const scrollRef = React.useRef(null);

    const { roomCode } = useParams();
    const userFirstName = account.user.first_name;
    const userLastName = account.user.last_name;
    const userService = account.user.service;

    React.useEffect(() => {
        setFilteredList(users.filter((user) => user._id !== account.user._id));
        setRoomsLoading(false);
    }, [account.user, users]);

    const handleFilter = (e) => {
        setFilter(e.target.value);
    };

    const handleChange = (e) => {
        setGroupName(e.target.value);
    };

    React.useEffect(() => {
        if (filter !== '') {
            setFilteredList(users.filter((user) => user.service === filter && user._id !== account?.user._id));
            if (filter === 'ALL') {
                setFilteredList(users);
            }
        }
    }, [filter]);

    React.useEffect(() => {
        console.log(arrivalMessage);
        arrivalMessage &&
            currentChat?.members.some((u) => u.userId === arrivalMessage.sender) &&
            currentChat?._id === arrivalMessage.currentChat &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    React.useEffect(() => {
        console.log(adminMessage);
        adminMessage && currentChat?._id === adminMessage.currentChat && setMessages((prev) => [...prev, adminMessage]);
    }, [adminMessage]);

    React.useEffect(() => {
        console.log('CHANGED');
        console.log(currentChat);
    }, [currentChat]);

    React.useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await axios.get(configData.API_SERVER + 'user/users');
                setUsers(res.data);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchUsers();
    }, []);

    React.useEffect(() => {
        async function getRooms() {
            try {
                const res = await axios.get(configData.API_SERVER + 'rooms/' + account.user._id);
                setRooms(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        getRooms();
    }, [account]);

    React.useEffect(() => {
        const createUser = async () => {
            if (existInRoom === false) {
                try {
                    console.log('Room is about to be created...');
                    const members = {
                        senderId: account.user._id,
                        receiverId: id
                    };
                    const res = await axios.post(configData.API_SERVER + 'rooms', members);
                    setCurrentChat(res.data);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        createUser();
    }, [existInRoom]);

    const userHasRoom = async (user) => {
        console.log('userHasRoom called');

        try {
            setId(user._id);
            setCurrentChatUser(user);
            const res = await axios.get(configData.API_SERVER + 'rooms/' + user._id);
            if (res.data.length === 0) {
                console.log('No room found');
            }
            const resp = res.data.map((room) => {
                if (room.members.some((u) => u.userId === account.user._id) && room.type === 'PRIVATE') {
                    setCurrentChat(room);
                    return true;
                } else {
                    return false;
                }
            });

            if (resp.includes(true)) {
                setExistInRoom(true);
            } else {
                setExistInRoom(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [messagesLoading, setMessagesLoading] = React.useState(true);
    React.useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(configData.API_SERVER + 'messages/' + currentChat?._id);
                setMessages(res.data);
                setMessagesLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        // const readMessages = async () => {
        //     console.log('Setting as read');
        //     messages?.map(async (m) => {
        //         try {
        //             if (m.read[account.user._id] === false) {
        //                 axios.put(config.API_SERVER + 'messages/readMessages/' + m.roomId, {
        //                     currentUserId: account.user._id
        //                 });
        //             }
        //         } catch (error) {
        //             console.log(error.message);
        //         }
        //     });
        // };
        getMessages();
        // readMessages();
    }, [currentChat]);

    const [file, setFile] = React.useState(null);
    // const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [uploadError, setUploadError] = React.useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '' && file === null) return;
        const formData = new FormData();

        const receiverId = currentChat.members.find((m) => m.userId !== account.user._id)
            ? currentChat.members.find((m) => m.userId !== account.user._id)
            : null;

        const message = {
            roomId: currentChat._id,
            sender: account.user._id,
            text: newMessage,
            attachment: [],
            read: {
                [account.user._id]: true,
                [receiverId.userId]: false
            }
        };
        try {
            let success = true;
            if (file !== null) {
                formData.append('file', file);
                try {
                    const x = await axios.post(configData.API_SERVER + 'upload', formData);
                    message.attachment = [
                        {
                            displayName: file.name,
                            actualName: x.data.upload
                        }
                    ];
                    success = true;
                    setUploadError('');
                } catch (error) {
                    setUploadError(error.response.data.message);
                    console.log(error);
                    success = false;
                }
            }
            console.log(message.attachment);
            if (success) {
                const res = await axios.post(configData.API_SERVER + 'messages', message);
                setMessages([...messages, res.data]);
                setNewMessage('');
                sendMessage(message.sender, receiverId.userId, newMessage, currentChat._id, message.attachment);

                setFile(null);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const checkUserOnline = (id) => {
        return onlineUsers.some((user) => user.userId === id);
    };

    React.useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    React.useEffect(() => {
        setInviteCode(roomCode);
    }, []);

    React.useEffect(() => {
        setFoundUsers(filteredList);
    }, [filteredList]);

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

    // const [userGroups, setUserGroups] = React.useState([])
    const [groupMembers, setGroupMembers] = React.useState([]);

    const getGroupMembers = async () => {
        try {
            const room = await axios.get(config.API_SERVER + 'rooms/room/' + currentChat?._id);
            room.data.members?.map(async (m) => {
                try {
                    if (account.user._id !== m.userId) {
                        const member = await axios.get(config.API_SERVER + 'user/users/' + m.userId);
                        console.log(member.data);
                        setGroupMembers((prev) => [...prev, member.data]);
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        const getUserGroups = async () => {
            try {
                const res = await axios.get(configData.API_SERVER + 'rooms/' + account.user._id);
                res.data.map((room) => {
                    const duplicate = userGroups.some((group) => group._id === room._id);
                    if (room.type === 'PUBLIC' && duplicate === false) {
                        setUserGroups((prev) => [...prev, room]);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
        getUserGroups();
    }, [account.user]);

    const getGroupRoom = (group) => {
        setCurrentChat(group);
    };
    // React.useEffect(()=>{
    //     console.log("groupMembers");
    //     console.log(groupMembers);
    // }, [groupMembers])

    const [type, setType] = React.useState('');
    const [showGroups, setShowGroups] = React.useState(true);
    const [showUsers, setShowUsers] = React.useState(true);

    const [addedMembers, setAddedMembers] = React.useState([]);

    const onChangeAddedMembers = (e) => {
        setAddedMembers(e.target.value);
    };
    const addMember = () => {
        getGroupMembers();
        setType('add');
        setOpenMenu(true);
    };

    const removeMember = () => {
        getGroupMembers();
        setType('remove');
        setOpenMenu(true);
        setGroupMembers(groupMembers.filter((m) => addedMembers.includes(m._id)));
    };
    const [confirmExistGroup, setConfirmExistGroup] = React.useState(false);
    const exitFromGroup = () => {
        setConfirmExistGroup(true);
    };

    const handleCreate = () => {
        getGroupMembers();
        setType('create');
        setOpenMenu(true);
    };

    const listMembers = () => {
        getGroupMembers();
        setType('list');
        setOpenMenu(true);
    };

    const handleClose = () => {
        setOpenMenu(false);
        setGroupName('');
        setAddedMembers([]);
        setGroupMembers([]);
        setStatus(0);
    };
    const [status, setStatus] = React.useState(0);

    const groups = () => {
        // console.log(userGroups);
        return userGroups.map((group, index) => {
            return (
                <List onClick={() => getGroupRoom(group)}>
                    <Room group={group} listKey={index} key={index} />
                </List>
            );
        });
    };
    // React.useEffect(()=>{
    //     console.log(userGroups);
    // }, [userGroups])

    const [openConfirm, setOpenConfirm] = React.useState(false);

    const submitRemoveGroup = async () => {
        try {
            const temp = currentChat;
            try {
                await axios.delete(config.API_SERVER + `rooms/removeGroup/${currentChat?._id}`);
            } catch (error) {
                console.log(error);
            }
            removeGroup(temp);
            setStatus(1);
            removeMessagesFromRoom(temp._id);
            // window.location.reload(false)
        } catch (error) {
            console.log(error);
        }
    };
    const submitCreateGroup = async () => {
        let data = {
            name: groupName,
            type: 'PUBLIC',
            members: []
        };
        addedMembers.map((m) => {
            data.members.push({ userId: m._id, joinedIn: moment().toISOString(), leftIn: '' });
        });

        if (account.user.role[0] !== 'USER') {
            data.members.push({ userId: account.user._id, joinedIn: moment().toISOString(), leftIn: '' });
        }
        try {
            const res = await axios.post(config.API_SERVER + 'rooms/newGroup', data);
            createGroup(res.data);
            setStatus(1);
        } catch (e) {
            console.log(e);
        }
    };

    const onChangeFileUpload = (e) => {
        // setSelectedFiles((prev) => [...prev, e.target.files[0]]);
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const removeItem = (val) => {
        // setSelectedFiles((prev) => prev.filter((item) => item.name !== val));
        setFile(null);
    };

    const handleGroupCallButton = () => {
        setOpenGenerateCode(true);
    };
    const [openGenerateCode, setOpenGenerateCode] = React.useState(false);
    const [generatedCode, setGeneratedCode] = React.useState('');

    const generateCode = () => {
        const randomString = generateRandomString();
        setGeneratedCode(randomString);
    };
    const hiddenFileInput = React.useRef(null);
    const handleFileButton = () => {
        hiddenFileInput.current.click();
    };

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
                    {status === 0 ? (
                        <Typography align="center">Are you sure you want to delete this group?</Typography>
                    ) : (
                        <Typography align="center">Group deleted!</Typography>
                    )}
                </ConfirmDialog>
                <ConfirmDialog
                    title="Please confirm"
                    openConfirm={confirmExistGroup}
                    setOpenConfirm={setConfirmExistGroup}
                    onConfirm={() => exitGroup(currentChat, account.user)}
                    status={status}
                >
                    <Typography align="center">Are you sure you want to exit the group?</Typography>
                </ConfirmDialog>
                <ConfirmDialog
                    title="Generate Link"
                    openConfirm={openGenerateCode}
                    setOpenConfirm={setOpenGenerateCode}
                    onConfirm={generateCode}
                    isCode={true}
                    code={generatedCode}
                >
                    <div className={classes.center} style={{ marginTop: '1rem' }}>
                        <OutlinedInput
                            style={{ width: '100%' }}
                            className={classes.disableTextSelection}
                            id="generate-code"
                            type="text"
                            value={generatedCode}
                            name="generate"
                            disabled
                        />
                    </div>
                </ConfirmDialog>

                <ModalC
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
                    setCurrentChat={setCurrentChat}
                    status={status}
                    currentChat={currentChat}
                    setStatus={setStatus}
                    setOpenConfirm={setOpenConfirm}
                    current={account?.user._id}
                />

                {inviteCode ||
                    (startCall === false && (
                        <Grid container component={Paper} className={classes.chatSection}>
                            <Grid item xs={12} md={4} style={{ overflowY: 'auto' }} className={classes.borderRight500}>
                                <List>
                                    <ListItem button key={userFirstName}>
                                        <ListItemIcon>
                                            <Avatar
                                                alt={userFirstName}
                                                src={account.user.profilePicture ? config.CONTENT + account.user.profilePicture : ' '}
                                            />
                                        </ListItemIcon>

                                        <Grid direction="row">
                                            <ListItemText className={classes.items} primary={`${userFirstName} ${userLastName}`} />
                                            <ListItemText className={classes.items}>
                                                <Typography variant="subtitle2">{userService.replaceAll('_', ' ')}</Typography>
                                            </ListItemText>
                                        </Grid>
                                    </ListItem>
                                </List>
                                <Grid item xs={12} style={{ padding: '10px' }}>
                                    {account?.user.role[0] !== 'USER' && (
                                        <Button variant="outlined" onClick={handleCreate}>
                                            Create Group Chat
                                        </Button>
                                    )}
                                </Grid>
                                <Divider />
                                <Grid item xs={12} style={{ padding: '10px' }}>
                                    <TextField
                                        id="outlined-basic-email"
                                        label="Search"
                                        variant="outlined"
                                        value={name}
                                        className={classes.select}
                                        onChange={searchFilter}
                                        fullWidth
                                    />
                                </Grid>
                                <Divider />
                                <Grid item xs={12} style={{ padding: '10px' }}>
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
                                            <MenuItem value="UI/UX_DESIGNER">UI/UX designer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Divider />
                                <Typography
                                    variant="overline"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => setShowGroups(!showGroups)}
                                >
                                    Groups {showGroups ? <ExpandLess /> : <ExpandMore />}
                                </Typography>
                                <Container className={classes.center}>
                                    {userGroups.length === 0 && <Typography variant="subtitle2">No groups</Typography>}
                                </Container>
                                <Collapse orientation="vertical" in={showGroups}>
                                    <PerfectScrollbar component="div" className={classes.scrollBar}>
                                        {groups()}
                                    </PerfectScrollbar>
                                </Collapse>

                                <Divider />
                                <Typography
                                    variant="overline"
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => setShowUsers(!showUsers)}
                                >
                                    Users {showUsers ? <ExpandLess /> : <ExpandMore />}
                                </Typography>
                                <Collapse orientation="vertical" in={showUsers}>
                                    <PerfectScrollbar component="div" className={classes.scrollBar}>
                                        {foundUsers?.map((user, index) => (
                                            <List onClick={() => userHasRoom(user)}>
                                                <Room
                                                    roomsLoading={roomsLoading}
                                                    users={user}
                                                    room={rooms}
                                                    onlineUsers={onlineUsers}
                                                    currentUser={account.user}
                                                    mk={index}
                                                    key={index}
                                                />
                                            </List>
                                        ))}
                                    </PerfectScrollbar>
                                </Collapse>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                {currentChat && currentChatUser && currentChat.type === 'PRIVATE' && (
                                    <Grid container xs={12} direction="column" className={classes.center}>
                                        <Typography variant="outline">
                                            {currentChatUser?.first_name} {currentChatUser?.last_name}
                                        </Typography>
                                        {checkUserOnline(currentChatUser._id) ? (
                                            <VideoCall className={classes.videoicon} onClick={() => handleCallButton(currentChatUser)} />
                                        ) : (
                                            <Typography variant="subtitle2">User offline</Typography>
                                        )}
                                    </Grid>
                                )}
                                {currentChat && currentChat.type === 'PUBLIC' && (
                                    <Grid container xs={12} direction="column" className={classes.center}>
                                        <Grid item className={classes.toolbar}>
                                            <Typography variant="outline" style={{ cursor: 'pointer' }} onClick={listMembers}>
                                                {currentChat.name}
                                            </Typography>
                                            {account?.user.role[0] !== 'USER' && (
                                                <Delete
                                                    color="error"
                                                    style={{ cursor: 'pointer' }}
                                                    className={classes.center}
                                                    onClick={() => setOpenConfirm(true)}
                                                />
                                            )}
                                        </Grid>
                                        <Divider />
                                        {account?.user.role[0] !== 'USER' && (
                                            <Grid item className={classes.toolbar}>
                                                <Remove className={classes.tool} onClick={removeMember} />
                                                <Add className={classes.tool} onClick={addMember} />
                                                <KeyboardReturn className={classes.tool} onClick={exitFromGroup} />
                                            </Grid>
                                        )}
                                        <Grid item className={classes.toolbar}>
                                            <VideoCall className={classes.tool} onClick={handleGroupCallButton} />
                                        </Grid>
                                    </Grid>
                                )}
                                <Divider />

                                {currentChat && currentChat.type === 'PRIVATE' && messages?.length === 0 && currentChat && (
                                    <Typography variant="subtitle2" className={classes.center} align="center">
                                        You no conversation with this user, start now!
                                    </Typography>
                                )}
                                {currentChat ? (
                                    <Grid item className={classes.messageArea}>
                                        {messagesLoading && <CircularProgress />}

                                        {/* <ScrollableFeed> */}
                                        {messages &&
                                            messages.map((m, i) => (
                                                <Message
                                                    messagesLoading={messagesLoading}
                                                    message={m}
                                                    own={m.sender === account.user._id}
                                                    type={currentChat.type}
                                                    key={i}
                                                    mk={i}
                                                />
                                            ))}
                                        {/* </ScrollableFeed> */}

                                        {/* <div ref={scrollRef} /> */}
                                    </Grid>
                                ) : (
                                    <Container className={classes.center}>
                                        <img width="700vw" height="700vh" src={loader} />
                                    </Container>
                                )}
                                <Divider />
                                {currentChat && (
                                    <>
                                        <Grid item container style={{ padding: '20px' }}>
                                            <Grid item xs={10}>
                                                <TextField
                                                    id="outlined-basic-email"
                                                    label="Type Something"
                                                    fullWidth
                                                    onChange={(e) => {
                                                        setNewMessage(e.target.value);
                                                    }}
                                                    value={newMessage}
                                                />
                                            </Grid>
                                            <Grid item xs={2} align="right">
                                                <ButtonGroup
                                                    variant="outlined"
                                                    className={classes.center}
                                                    style={{ height: '100%' }}
                                                    aria-label="outlined primary button group"
                                                >
                                                    <Button
                                                        color="error"
                                                        onClick={handleFileButton}
                                                        aria-label="attach"
                                                        style={{ height: '100%' }}
                                                    >
                                                        <AttachFile />
                                                        <input
                                                            style={{ display: 'none' }}
                                                            type="file"
                                                            ref={hiddenFileInput}
                                                            onChange={onChangeFileUpload}
                                                        />
                                                    </Button>
                                                    <Button
                                                        onClick={handleSubmit}
                                                        color="primary"
                                                        aria-label="send"
                                                        style={{ height: '100%' }}
                                                    >
                                                        <SendIcon />
                                                    </Button>
                                                    {/* <Fab color="primary" aria-label="add" style={{width: '2rem', height: '2rem'}} onClick={handleSubmit}><SendIcon /></Fab> */}
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>
                                        {file !== null && (
                                            <Grid container style={{ padding: '20px', overflowY: 'hidden', height: '15vh' }}>
                                                <Grid item xs={10}>
                                                    {uploadError && (
                                                        <Typography variant="subtitle2" color="error">
                                                            {uploadError}
                                                        </Typography>
                                                    )}
                                                    <ImageList sx={{ width: 500, height: 500 }} cols={3} rowHeight={100}>
                                                        {/* {selectedFiles?.map((item, i) => { */}
                                                        {/* return ( */}
                                                        <ImageListItem>
                                                            {(file?.name.includes('.png') || file?.name.includes('.jpg')) && (
                                                                <Container style={{ width: 'fit-content' }}>
                                                                    <img
                                                                        className={classes.selectedItem}
                                                                        src={`${URL.createObjectURL(file)}`}
                                                                    />
                                                                    <Close className={classes.X} onClick={() => removeItem(file.name)} />
                                                                </Container>
                                                            )}
                                                            {(file?.name.includes('.pdf') || file?.name.includes('.docx')) && (
                                                                <Typography className={classes.selectedItem}>
                                                                    <PictureAsPdf />
                                                                    {file.name}
                                                                    <Close className={classes.X} onClick={() => removeItem(file.name)} />
                                                                </Typography>
                                                            )}
                                                            {file?.name.includes('.mp4') && (
                                                                <Typography className={classes.selectedItem}>
                                                                    <video
                                                                        className={classes.selectedItem}
                                                                        controls
                                                                        src={`${URL.createObjectURL(file)}`}
                                                                    />
                                                                    {file.name}
                                                                    <Close className={classes.X} onClick={() => removeItem(file.name)} />
                                                                </Typography>
                                                            )}
                                                        </ImageListItem>
                                                        {/* );
                                                        })} */}
                                                    </ImageList>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    ))}
            </MainCard>
        </>
    );
};

export default Chat;
