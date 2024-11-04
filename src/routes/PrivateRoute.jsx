import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = localStorage.getItem("access_token") ? true : false;
    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
