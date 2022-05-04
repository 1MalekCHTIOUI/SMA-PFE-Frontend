import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {CircularProgress, Grid, Modal, Box, Button} from '@material-ui/core'
import { useHistory, useLocation, useParams } from "react-router-dom";
import Typography from '../../utilities/Typography';
import MainCard from '../../../ui-component/cards/MainCard'
import { useSelector } from "react-redux";
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
    height: 30rem;
    width: 30rem;
`;
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

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight,
    width: window.innerWidth
};

const Modals = (props) => {
    return <>
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
        <Grid justifyContent="center" direction="row">
        {props.allowed && <Button variant="outlined" color="error" onClick={()=>props.history.push("/chat")}>Hang UP</Button>}
        </Grid>
    </>
}
const Room = (props) => {
    const {roomCode} = useParams()
    const [peers, setPeers] = useState([]);
    const account = useSelector(s => s.account)
    const socketRef = useRef(io("http://localhost:8900"));
    const userVideo = useRef();
    const peersRef = useRef([]);
    const location = useLocation()
    const roomID = roomCode
    React.useEffect(() => {
        return () => {
            setJoinedUsers(0)
            window.location.reload(false)
        }
    },[])
    
    useEffect(() => {
        
        location.state && navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
                setJoinedUsers(joinedUsers+1)
            });
        })

    }, []);


    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            setJoinedUsers(joinedUsers+1)
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    const history = useHistory()
    const [joinedUsers, setJoinedUsers]= React.useState(0)

    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        if(joinedUsers===1) {
            setShow(true)
            const timeId = setTimeout(() => {
                setShow(false)
              }, 3000)
              return () => {
                clearTimeout(timeId)
              }
        } else {
            setShow(false)
        }

    }, [joinedUsers]);

    // React.useState(()=>{
    //     console.log(location.state);
    // }, [location.state])


    React.useState(()=>{
        if(location.state){
            console.log(location.state.callData);
        } 
        else {
            <Modals show={show} allowed={location.state} message="Your're not allowed!" />
            history.push("/chat")
        }

    },[])
    return (
        <>
            <MainCard title="Video chat" style={{height:"100%"}}>
                <Grid style={{display:"flex",justifyContent:'space-between'}} xs={12} direction="column">
                    <Grid item>
                        <MainCard style={{width: 'fit-content'}} title={`${account.user.first_name} ${account.user.last_name}`}>
                            <StyledVideo muted ref={userVideo} autoPlay playsInline />
                        </MainCard>
                    </Grid>
                    
                    {peers.map((peer, index) => {
                        if(index <= joinedUsers+1) {
                            return peer.readable ? <Grid item><MainCard style={{width: 'fit-content'}} title={location.state.callData.caller || location.state.callData.receiver}><div>{joinedUsers===0 && <CircularProgress/>}</div><Video muted key={index} peer={peer} /></MainCard></Grid> : console.log("LOADING");
                        }
                    })}
                    


                </Grid>
                <Modals show={show} allowed={location.state.allowed} history={history} message={"User joined!"} />
            </MainCard>

        </>
    );
};

export default Room;
