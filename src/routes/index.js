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
//-----------------------|| ROUTING RENDER ||-----------------------//

const Routes = () => {
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
