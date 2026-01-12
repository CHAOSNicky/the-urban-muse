import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHome from './pages/MainHome';
import Login from './components/Login';
import Admin from './components/Admin'
import Product from './pages/ProductPage'
import {LoginProvider} from './Contexts/LoginContexts'

export default function App(){
        
        return (
        <LoginProvider>
        <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/admin" element={<Admin />}/>
            <Route path="/product" element={<Product />} />
        </Routes>
        </ LoginProvider>
        )
    }