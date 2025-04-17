import React, { use, useEffect } from 'react'
import {Routes, Route,Navigate } from "react-router-dom";
import NavBar from '../components/Navbar/NavBar';
import Login from '../components/Login/Login';
import CreateRoom from '../components/Login/CreateRoom';
import NotFound from '../components/404page/404page';
import ProtectedRoute from './ProtectedRoute';
export default function () {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/:roomid" element={<ProtectedRoute><NavBar/></ProtectedRoute>}/>
        <Route path="/create-room" element={<CreateRoom/>}/>
        <Route path="/404" element={<NotFound/>}/>
        <Route path="*" element={<Navigate to ="/404"/>}/>
    </Routes>

  )
}
