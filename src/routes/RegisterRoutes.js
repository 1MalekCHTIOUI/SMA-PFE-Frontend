import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import GuestGuard from './../utils/route-guard/GuestGuard';
import AuthGuard from './../utils/route-guard/AuthGuard';
import SAGuard from './../utils/route-guard/SAGuard';
import MinimalLayout from './../layout/MinimalLayout';
import NavMotion from './../layout/NavMotion';
import Loadable from '../ui-component/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('../views/pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('../views/pages/authentication/register')));

//-----------------------|| AUTH ROUTING ||-----------------------//

const LoginRoutes = () => {
    const location = useLocation();

    return (
        <Route path={['/register']}>
            <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                    <NavMotion>
                        <AuthGuard>
                            <SAGuard>
                                <Route path="/register" component={AuthRegister} />
                            </SAGuard>
                        </AuthGuard>                    
                    </NavMotion>

                </Switch>
            </MinimalLayout>
        </Route>
    );
};

export default LoginRoutes;
