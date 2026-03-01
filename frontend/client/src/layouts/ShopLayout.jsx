import React from 'react';
import { Outlet } from 'react-router-dom';
import TopScrollingBanner from '../components/TopScrollingBanner';
import HeaderNav from '../components/HeaderNav';
import TrendingCategory from '../pages/TrendingCategory';

export default function ShopLayout() {
    return (
        <>
            <TopScrollingBanner />
            <HeaderNav overlay={false} />
            <TrendingCategory variant="compact" />
            <Outlet />
        </>
    );
}
