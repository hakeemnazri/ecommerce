import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

function PeopleAlsoBought() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products/recommendation');
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }finally{
        setLoading(false);
      }
    };
    fetchRecommendations();
  },[])
  
  if(loading) return(<div className='flex items-center justify-center min-h-screen bg-gray-900'>
    <div className='relative'>
      <div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />
      <div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
      <div className='sr-only'>Loading</div>
    </div>
  </div>)

  return (
    <div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{recommendations.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
  )
}

export default PeopleAlsoBought