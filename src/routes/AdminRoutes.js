import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';
import AdminGuard from './../utils/route-guard/AdminGuard';

// dashboard routing
const management = Loadable(lazy(() => import('../views/pages/management/index')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/management'
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <AdminGuard>
                            <Route path="/management" component={management} />
                        </AdminGuard>
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
