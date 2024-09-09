
import React from 'react'
import { useProductStore } from '../store/useProductStore'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
const CategoryPage = () => {
  const { fetchProductsByCategory , loading , products } = useProductStore() ;  
  const {category } = useParams() ;
  useEffect(() => {
    fetchProductsByCategory(category) ;
  }, [category]);
  console.log(category) ; 
  console.log(products) ; 

    return (
    <div>
        Products
      
    </div>
  )
}

export default CategoryPage
