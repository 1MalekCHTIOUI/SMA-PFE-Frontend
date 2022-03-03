import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import {LOGOUT} from "../../store/actions"
//-----------------------|| AUTH GUARD ||-----------------------//

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */


const AuthGuard = ({ children }) => {
    const account = useSelector((state) => state.account);
    const dispatch = useDispatch();
    const { isLoggedIn, token } = account;



    React.useEffect(() =>{
        if(token) {
            let expired = jwt_decode(token).exp * 1000 < Date.now()
            if(expired) dispatch({ type: LOGOUT })
        }
    },[])


    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }



    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
