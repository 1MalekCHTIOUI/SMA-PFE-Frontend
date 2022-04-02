// action - state management
import { io } from 'socket.io-client';
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
};
//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    const socket = io("ws://localhost:8900")
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user, token } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token,
                user
            };
        }
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            const userId = action.payload;
            socket.emit("logout", userId)
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                user: null,
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
