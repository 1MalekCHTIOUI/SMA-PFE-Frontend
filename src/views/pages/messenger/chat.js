import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TextChat from "../../components/TextChat"
import VideoChat from "./videoChat"
const Chat = () => {

    return (
        <PerfectScrollbar>
            <TextChat /> 
        </PerfectScrollbar>
    );
}

export default Chat;
