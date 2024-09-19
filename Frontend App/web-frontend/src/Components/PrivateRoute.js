import React from "react";
import { Navigate, useLocation} from "react-router-dom";
import { getUserFromLocalStorage } from "../DataModel/User";

export default function PrivateRoute({ children, allowedRoles }) {
    const location = useLocation();
    const decodedToken = JSON.parse(localStorage.getItem('token'));
    if (!decodedToken) {
        return <Navigate to='/login' />
    }
    else {
        const role = decodedToken.user_role;
        if (!allowedRoles.includes(role)) {
            return <Navigate to='/unauthorized' />
        }

        var u = getUserFromLocalStorage();
        if(decodedToken.user_role === "Driver" && !u.isVerified())
            return <Navigate to='/unauthorized' />

        if(role === "User"&& localStorage.getItem('inProgress') === true && location.pathname !== '/inprogress'){
            return <Navigate to='/inprogress' />}

        return children;
    
    }
};