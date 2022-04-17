import React from 'react';
import {Modal, Container, Box, Button} from '@material-ui/core'
import Typography from '../utilities/Typography';

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
const Modal_c = (props) => {
    return (
        <Modal
        keepMounted
        open={props.isReceivingCall || props.callAccepted===true || props.callDeclined || props.show}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <h3>
                    {props.isReceivingCall && props.callerMsg}
                    {props.declineInfo!==null && props.declineInfo}        
                </h3>
                { props.isReceivingCall &&        
                    <Container style={{display:"flex", justifyContent: "space-evenly"}} id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        <Button variant="outlined" color="success" onClick={props.handleAnswer}>Accept</Button>
                        <Button variant="outlined" color="error" onClick={props.handleHangup}>Hangup</Button>
                    </Container>
                }
            </Box>
        </Modal>
    )
    
}

export default Modal_c;
