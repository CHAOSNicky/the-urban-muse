import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHome from './pages/MainHome';
import Login from './components/Login';
import {LoginProvider} from './Contexts/LoginContexts'

export default function App(){
        
        return (
        <LoginProvider>
        <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/login" element={<Login />}/>
        </Routes>
        </ LoginProvider>
        )
    }