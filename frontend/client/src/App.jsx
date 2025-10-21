import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHome from './pages/MainHome';
import Login from './components/Login';

export default function App(){
        const [name, setName] = useState(null);

        return (
        <Routes>
            <Route path="/" element={<MainHome name={name}/>} />
            <Route path="/login" element={<Login setName={setName}/>}/>
        </Routes>
        )
    }