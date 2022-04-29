import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, StyledEngineProvider } from '@material-ui/core';
// routing
import Routes from './routes';

// defaultTheme
import theme from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';
import { SocketContext } from './utils/socket/SocketContext';
import Modal from './views/components/Modal';

//-----------------------|| APP ||-----------------------//

const App = () => {
    const customization = useSelector((state) => state.customization);
    const { isReceivingCall, callAccepted, loaded,callData, callerMsg ,ROOM_ID, cleanup, callDeclined, declineInfo, handleAnswer, handleHangup, join } = useContext(SocketContext)
    const [show, setShow] = React.useState(false)
    React.useEffect(()=>{
        if(callAccepted && ROOM_ID && loaded) {
            join(ROOM_ID)
        }
    },[callAccepted])

    React.useEffect(() => {
        if(callDeclined===true) {
            setShow(true)
            const timeId = setTimeout(() => {
                setShow(false)
                cleanup()
              }, 3000)
              return () => {
                clearTimeout(timeId)
              }
        } else {
            setShow(true)
        }
    }, [callDeclined]);
    
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                    {
                        isReceivingCall && (
                            <Modal callerMsg={callerMsg} isReceivingCall={isReceivingCall} callAccepted={callAccepted} callDeclined={callDeclined} declineInfo={declineInfo} handleAnswer={handleAnswer} handleHangup={handleHangup} show={show}/>
                        )
                    }
                    { 
                        callDeclined && (
                            <Modal isReceivingCall={isReceivingCall} callDeclined={callDeclined} declineInfo={declineInfo} handleAnswer={handleAnswer} handleHangup={handleHangup} show={show}/>
                        )
                    }
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
