// router/index.js
import React from 'react';
import Home from '../container/Home';
import Data from '../container/Data';
import User from '../container/User';
import UserInfo from '../container/UserInfo';
import Login from '../container/Login';
import Detail from '../container/Detail';
import Account from '@/container/Account'

const routes = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "data",
        element: <Data />
    },
    {
        path: "user",
        element: <User />,
    },
    {
        path: "user/userinfo",
        element: <UserInfo />,
    },
    {
        path: "user/account",
        element: <Account />,
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: 'detail/:id',
        element: <Detail />
    },

];

export default routes;