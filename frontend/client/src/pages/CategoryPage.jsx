import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/ProductCard';
import API_BASE_URL from '../Constants/CommonConst';

export default function CategoryPage() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${API_BASE_URL}/api/product/get/by-cat/${categoryName}`,
                    { method: 'GET', credentials: 'include' }
                );
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                if (!cancelled) setProducts(data);
            } catch (err) {
                console.error('CategoryPage fetch error:', err);
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (categoryName) fetchProducts();
        return () => { cancelled = true; };
    }, [categoryName]);

    const displayName = categoryName
        ? categoryName.replace(/[-_]/g, ' ').toUpperCase()
        : '';

    if (loading) {
        return (
            <div className="bg-[#edeaf5] py-12 text-center">
                <p className="text-black text-lg">Loading {displayName}…</p>
            </div>
        );
    }

    return (
        <div className="bg-[#edeaf5] py-8 md:py-12 relative">

            {/* Back button */}
            {/* <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-8 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
                aria-label="Back to home"
            >
                <ArrowLeftIcon className="h-5 w-5 text-black" />
            </button> */}

            <h2 className="text-2xl md:text-4xl text-center text-black font-medium font-sans mb-6 md:mb-11">
                {displayName}
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-black py-8 md:py-12">No products found.</p>
            ) : (
                <div className="text-black grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 sm:px-6 md:px-8">
                    {products.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            )}

        </div>
    );
}
