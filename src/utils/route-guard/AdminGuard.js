import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import {LOGOUT} from "../../store/actions"
//-----------------------|| ADMIN GUARD ||-----------------------//

/**
 * Admin guard for routes
 * @param {PropTypes.node} children children element/node
 */


const AdminGuard = ({ children }) => {
    const account = useSelector((state) => state.account);

    const { user } = account;
    const [isAdmin, setIsAdmin] = React.useState(null)


    React.useEffect(() =>{
        if(user && user.role.includes("ADMIN")) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    },[])


    if (isAdmin === false) {
        return <Redirect to="/dashboard/default" />;
    }



    return children;
};

AdminGuard.propTypes = {
    children: PropTypes.node
};

export default AdminGuard;
