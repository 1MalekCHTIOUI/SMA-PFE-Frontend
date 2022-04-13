import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import RegisterRoutes from './RegisterRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoutes from './AdminRoutes';

// project imports
import config from './../config';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

//-----------------------|| ROUTING RENDER ||-----------------------//

const Routes = () => {
    const socket = useSelector(state => state.socket)
    const history = useHistory()
    React.useEffect(() => {
        console.log(socket);
            if(socket.isReceivingCall===true){
                history.push("/chat")
            }
            // 
        
    },[socket])
    return (
        <Switch>
            <Redirect exact from="/" to={config.defaultPath} />
            <React.Fragment>
                {/* Routes for authentication pages */}
                <AuthenticationRoutes />

                {/* Routes for admin pages */}
                <AdminRoutes />

                {/* Route for login */}
                <LoginRoutes />        

                {/* Route for register */}
                <RegisterRoutes />

                {/* Routes for main layouts */}
                <MainRoutes />

            </React.Fragment>
        </Switch>
    );
};

export default Routes;
