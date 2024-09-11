import React from 'react';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const PeopleAlsoBought = () => {
    const { data: RecommendedProducts, isLoading, isError, error } = useQuery({
        queryKey: ['peopleAlsoBought'],
        queryFn: async () => {
            const response = await axios.get('/api/products/recommendations');
            return response.data.products;
        },
    });

    if (isLoading) return <LoadingSpinner />;

    if (isError) return <div>Error: {error.message}</div>;

    return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{RecommendedProducts.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;
