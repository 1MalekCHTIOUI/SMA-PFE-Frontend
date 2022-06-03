import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import styled from 'styled-components';
import { CircularProgress, Grid, Modal, Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PhoneDisabled } from '@material-ui/icons';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import MainCard from '../../../ui-component/cards/MainCard';
import { useSelector } from 'react-redux';
const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    justify-content: space-evenly;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 100%;
    width: 100%;
`;
const StyledGuestVideo = styled.video`
    height: fit-content;
    width: fit-content;
`;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: 'none',
    borderRadius: '0.25rem',
    p: 4
};

const useStyles = makeStyles({
    container: {
        height: '100vh',
        position: 'relative'
    },
    chatContainer: {
        display: 'flex',
        position: 'absolute',
        zIndex: 1,
        height: '80vh',
        width: '100%'
    },
    myContainer: {
        zIndex: 3,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        width: '23%',
        height: '29%',
        border: '2px solid red'
    },
    userContainer: {
        position: 'absolute',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '70%',
        top: 0
    },
    typography: {
        position: 'absolute',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        // alignItems: 'center',
        top: 0
        // left: '40%'
    },
    userGroupContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on('stream', (stream) => {
            ref.current.srcObject = stream;
        });
    }, []);

    return <StyledVideo muted playsInline autoPlay ref={ref} />;
};
const GuestVideo = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on('stream', (stream) => {
            ref.current.srcObject = stream;
        });
    }, []);

    return <StyledGuestVideo muted playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Modals = (props) => {
    return (
        <>
            <Modal
                keepMounted
                open={props.show}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <h3 align="center">{props.message}</h3>
                </Box>
            </Modal>
        </>
    );
};
const handleCheck = (arr, val) => {
    if (arr.length === 0) {
        return false;
    } else {
        return arr.some((item) => val._id === item.user._id);
    }
};
const Room = (props) => {
    const { roomCode } = useParams();
    const [peers, setPeers] = useState([]);
    const [joinedUsersArray, setJoinedUsersArray] = useState([]);
    const account = useSelector((s) => s.account);
    const socketRef = useRef(io('https://sma-socket-01.herokuapp.com/'));
    const userVideo = useRef();
    const peersRef = useRef([]);
    const location = useLocation();

    const roomID = roomCode;
    const classes = useStyles();
    React.useEffect(() => {
        return () => {
            setJoinedUsers(0);
            window.location.reload(false);
        };
    }, []);
    React.useEffect(() => {
        console.log(peers);
        // peers.map((peer) => {
        //     if (peer.readable) {
        //         console.log(peer);
        //     } else {
        //         console.log(peer.user);
        //     }
        // });
    }, [peers]);
    useEffect(() => {
        location.state &&
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then((stream) => {
                userVideo.current.srcObject = stream;
                socketRef.current.emit('join room', { roomID: roomID, user: account.user });
                socketRef.current.on('all users', (users) => {
                    const peers = [];
                    // setJoinedUsersArray((prev) => [...prev, users.user]);
                    users
                        .filter((u) => u.user._id !== account.user._id)
                        .forEach((socket) => {
                            const peer = createPeer(socket.socket, socketRef.current.id, stream, socket.user);
                            peersRef.current.push({
                                peerID: socket.socket,
                                peer
                            });
                            // if (peers.length === 0) {
                            peers.push({ peer: peer, user: socket.user });
                            // }
                        });
                    setPeers(peers);
                });

                socketRef.current.on('user joined', (payload) => {
                    const peer = addPeer(payload.signal, payload.callerID, stream, payload.user);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer
                    });
                    console.log('ADD PEERS');

                    handleCheck(peers, payload.user) == false && setPeers((users) => [...users, { peer: peer, user: payload.user }]);
                });

                socketRef.current.on('receiving returned signal', (payload) => {
                    const item = peersRef.current.find((p) => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                    setJoinedUsers(joinedUsers + 1);
                });
            });
    }, []);

    function createPeer(userToSignal, callerID, stream, user) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on('signal', (signal) => {
            socketRef.current.emit('sending signal', { userToSignal, callerID, signal, user: account.user });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream, user) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        peer.on('signal', (signal) => {
            setJoinedUsers(joinedUsers + 1);
            socketRef.current.emit('returning signal', { signal, callerID, user });
        });

        peer.signal(incomingSignal);

        return peer;
    }
    const history = useHistory();
    const [joinedUsers, setJoinedUsers] = React.useState(0);

    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        if (joinedUsers === 1) {
            setShow(true);
            const timeId = setTimeout(() => {
                setShow(false);
            }, 3000);
            return () => {
                clearTimeout(timeId);
            };
        } else {
            setShow(false);
        }
    }, [joinedUsers]);

    React.useState(() => {
        if (location.state) {
            console.log(location.state);
        } else {
            <Modals show={show} allowed={location.state.allowed} message="Your're not allowed!" />;
            history.push('/chat');
        }
    }, []);
    // title={`${account.user.first_name} ${account.user.last_name}`}
    // title={location.state.callData.caller || location.state.callData.receiver}
    return (
        <>
            <MainCard
                title={
                    <Button variant="outlined" color="error" onClick={() => props.history.push('/chat')}>
                        <PhoneDisabled />
                    </Button>
                }
                className={classes.container}
            >
                <div className={classes.chatContainer}>
                    <div className={classes.myContainer}>
                        <Typography
                            className={classes.typography}
                            variant="overline"
                        >{`${account.user.first_name} ${account.user.last_name}`}</Typography>
                        <StyledVideo muted ref={userVideo} autoPlay playsInline />
                    </div>
                    {location.state.type === 'PRIVATE' && (
                        <div className={classes.userContainer}>
                            <div>{joinedUsers === 0 && <CircularProgress />}</div>
                            {location.state.type === 'PRIVATE' && (
                                <>
                                    <Typography className={classes.typography} variant="overline">
                                        {peers[0]?.user.first_name + ' ' + peers[0]?.user.last_name}
                                    </Typography>
                                    {peers[0]?.peer.readable && <Video key={1} peer={peers[0].peer} />}
                                </>
                            )}
                        </div>
                    )}
                    {location.state.type === 'PUBLIC' && (
                        <Grid container xs={12}>
                            {peers
                                ?.filter((p) => p.user._id !== account.user._id)
                                .map((peer, index) => {
                                    // if (peer.readable) {
                                    return (
                                        <Grid item style={{ height: '35vh', width: '35vw' }}>
                                            <div>{joinedUsers === 0 && <CircularProgress />}</div>
                                            <Typography className={classes.typography} variant="overline">
                                                {peer.user.first_name + ' ' + peer.user.last_name}
                                            </Typography>
                                            <GuestVideo key={index} peer={peer.peer} />
                                        </Grid>
                                    );
                                    // }
                                })}
                        </Grid>
                    )}

                    {/* // peer.readable && (
                            //     <Grid item style={{ backgroundColor: 'red' }}>
                            //         <MainCard
                            //             style={{ width: 'fit-content' }}
                            //             title={location.state.callData.caller || location.state.callData.receiver}
                            //         >
                            //             <div>{joinedUsers === 0 && <CircularProgress />}</div>
                            //             <Video key={index} peer={peer} />
                            //         </MainCard>
                            //     </Grid>
                            // );
                            // }
                        // })} */}
                </div>
                <Modals show={show} allowed={location.state.allowed} history={history} message={'User joined!'} />
            </MainCard>
        </>
    );
};

export default Room;
