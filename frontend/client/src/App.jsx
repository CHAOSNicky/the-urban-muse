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
import ProfilePage from './pages/Profile/ProfilePage'
import { LoginProvider } from './Contexts/LoginContexts'
import { CartProvider } from './Contexts/CartContext'
import CartDrawer from './components/CartDrawer'
import CheckoutContainer from './pages/Checkout/CheckoutContainer'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProductHub from './pages/Admin/ProductHub'
import CategoryHub from './pages/Admin/CategoryHub'
import OrderManagement from './pages/Admin/OrderManagement'
import AdminSettings from './pages/Admin/AdminSettings'

export default function App() {

    return (
        <LoginProvider>
            <CartProvider>
                <CartDrawer />
                <Routes>
                    <Route path="/" element={<MainHome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<ProductHub />} />
                    <Route path="/admin/categories" element={<CategoryHub />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/product" element={<MainImage />} />
                    <Route path="/checkout" element={<CheckoutContainer />} />
                    <Route element={<ShopLayout />}>
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                    </Route>
                    <Route element={<ProductLayout />}>
                        <Route path="/product/:productId" element={<SingleProductPage />} />
                    </Route>
                </Routes>
            </CartProvider>
        </LoginProvider>
    )
}