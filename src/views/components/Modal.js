import React from 'react';
import {Modal, Container, Box, Button} from '@material-ui/core'
import {useDispatch, useSelector} from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import Typography from '../utilities/Typography';
import {CLEAR_DATA, CALL_DECLINED, CALL_ACCEPTED, RECEIVING_CALL} from '../../store/actions'
import { io } from 'socket.io-client';
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
const Modal_c = ({socketInfo, ROOM_ID, account, declineInfo, callerId}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const socket = React.useRef(io("http://localhost:8900"))

    const handleHangup = () => {
        callerId && socket.current.emit("declineCall", {callerId: callerId, declinerName: `${account.user.first_name} ${account.user.last_name}`})
    }

    React.useEffect(()=>{
        return () => dispatch({type: CLEAR_DATA})
    })

    const join = () => {
        if(ROOM_ID!=null) {
            history.push({
                pathname: `/videochat/${ROOM_ID}`,
                state: {
                    user: currentUsername
                } 
            })
        }
    }
    const [currentUsername, setCurrentUsername] = React.useState('')
    const handleAnswer = () =>{
        socket.current.emit("acceptCall", {callerId: callerId, acceptName: `${account.user.first_name} ${account.user.last_name}`})
        setCurrentUsername(`${account.user.first_name} ${account.user.last_name}`)
        dispatch({type: CALL_ACCEPTED})
        join()
    }

    const [show, setShow] = React.useState(false)
    React.useEffect(() => {

        if(declineInfo!==null) {
            setShow(true)
            const timeId = setTimeout(() => {
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
        <Modal
        keepMounted
        open={socketInfo?.isReceivingCall || (declineInfo!==null && show)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Typography align="center" id="keep-mounted-modal-title" variant="h4" component="h2">
                    {socketInfo?.isReceivingCall && socketInfo?.message}
                    {declineInfo!==null && declineInfo}
                </Typography>
                { socketInfo?.isReceivingCall &&        
                    <Container style={{display:"flex", justifyContent: "space-evenly"}} id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <Button variant="outlined" color="success" onClick={handleAnswer}>Accept</Button>
                        <Button variant="outlined" color="error" onClick={handleHangup}>Hangup</Button>
                    </Container>
                }
            </Box>
        </Modal> 
    );
}

export default Modal_c;
