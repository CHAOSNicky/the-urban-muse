import React, {useState, useEffect} from 'react';
import TopBanner from './TopBanner';
import TrendingCategory from './TrendingCategory';
import NewArrivals from './NewArrivals';
import ReviewPage from './ReviewPage';

function MainHome({name}){
    return(<div>
            <TopBanner name={name}/>
            <TrendingCategory />
            <NewArrivals />
            <ReviewPage />
    </div>)
}


export default MainHome;