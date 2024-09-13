import React, { useEffect } from 'react'
import CategoryItem from '../components/CategoryItem';
import { useProductStore } from '../store/useProductStore';
import FeaturedProducts from '../components/FeaturedProducts';
const categories = [
	{ href : '/MistyGaming',name : 'MistyGaming',imageUrl : '/MistyGaming.jpg'},
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
	{ href: "/phones", name: "Phones", imageUrl: "/phones.jpg" },
];

const HomePage = () => {
	const { getFeaturedProducts , loading , featuredProducts} = useProductStore() ; 
	useEffect(() => {
		getFeaturedProducts() ;     
		console.log(featuredProducts) ; 
	},[getFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
				
			{!loading && featuredProducts.length > 0 && <FeaturedProducts featuredProducts={featuredProducts} />}


			</div>

		</div>
	);
};
export default HomePage;