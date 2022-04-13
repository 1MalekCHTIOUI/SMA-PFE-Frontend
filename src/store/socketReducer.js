// action - state management
import { io } from 'socket.io-client';
import { RECEIVING_CALL, CALL_ACCEPTED, CALL_DECLINED } from './actions';

export const initialState = {
    isReceivingCall: false,
    message: ""
};
//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const socketReducer = (state = initialState, action) => {
    const socket = io.connect("http://localhost:8900")
    switch (action.type) {
        case RECEIVING_CALL: {
            const { isReceivingCall, message } = action.payload;
            return {
                ...state,
                isReceivingCall: isReceivingCall,
                message: message
            };
        }
        case CALL_ACCEPTED: {
            return {
                ...state,
                isReceivingCall: false,
                message: "CALL ACCEPTED"
            };
        }
        case CALL_DECLINED: {
            return {
                ...state,
                isReceivingCall: false,
                message: "CALL DECLINED"
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default socketReducer;
