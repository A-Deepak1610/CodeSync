import React from 'react'
import {Routes, Route,Navigate } from "react-router-dom";
import NavBar from '../components/NavBar';
export default function () {
  return (
    <Routes>
        <Route path="/" element={<NavBar/>} />
    </Routes>

  )
}
