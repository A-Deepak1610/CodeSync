import React from 'react'
import Applayout from './applayout/Applayout'
import { BrowserRouter } from 'react-router'
export default function App() {
  return (
    <>
    <BrowserRouter>
    <Applayout/>
    </BrowserRouter>
    </>
  )
}