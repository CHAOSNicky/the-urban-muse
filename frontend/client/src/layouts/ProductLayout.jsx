import React from 'react';
import { Outlet } from 'react-router-dom';
import TopScrollingBanner from '../components/TopScrollingBanner';
import HeaderNav from '../components/HeaderNav';

export default function ProductLayout() {
    return (
        <>
            <TopScrollingBanner />
            <HeaderNav overlay={false} />
            <Outlet />
        </>
    );
}
