import { Routes, Route } from 'react-router-dom';
import MainHome from './pages/MainHome';
import Login from './components/Login';

export default function App(){
        return (
        <Routes>
            <Route path="/" element={<MainHome/>} />
            <Route path="/login" element={<Login/>}/>
        </Routes>
        )
    }