import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainHome from './pages/MainHome';
import Login from './components/Login';
import Admin from './components/Admin'
import MainImage from './pages/MainImage'
import CategoryPage from './pages/CategoryPage'
import SingleProductPage from './pages/SingleProductPage'
import ShopLayout from './layouts/ShopLayout'
import ProductLayout from './layouts/ProductLayout'
import { LoginProvider } from './Contexts/LoginContexts'

export default function App() {

    return (
        <LoginProvider>
            <Routes>
                <Route path="/" element={<MainHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/product" element={<MainImage />} />
                <Route element={<ShopLayout />}>
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                </Route>
                <Route element={<ProductLayout />}>
                    <Route path="/product/:productId" element={<SingleProductPage />} />
                </Route>
            </Routes>
        </ LoginProvider>
    )
}