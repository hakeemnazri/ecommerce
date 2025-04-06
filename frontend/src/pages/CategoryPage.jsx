import React, { useEffect } from 'react'
import { useGetProductsByCategory } from '../../hooks/useProducts'
import { useParams } from 'react-router-dom'
import { selectProducts } from '../../redux/productSlice'
import { useSelector } from 'react-redux'
import { motion } from "framer-motion";
import ProductCard from '../components/ProductCard'


function CategoryPage() {

    const { GetProductsByCategory, loading } = useGetProductsByCategory()
    const {category} = useParams()
    const products = useSelector(selectProducts)

    useEffect(()=>{
        GetProductsByCategory(category)
    },[GetProductsByCategory, category])

	if(loading){
		<div className='flex items-center justify-center min-h-screen bg-gray-900'>
		<div className='relative'>
			<div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />
			<div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
			<div className='sr-only'>Loading</div>
		</div>
	</div>
	}

  return (
    <div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{products?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
  )
}

export default CategoryPage