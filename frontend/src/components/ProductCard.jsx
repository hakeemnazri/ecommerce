import React from 'react'
import { ShoppingCart } from "lucide-react";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import toast from 'react-hot-toast';
import { useAddToCart } from '../../hooks/useCart';
function ProductCard({product}) {
    const user = useSelector(selectUser)
    const { addToCartHook, loading } = useAddToCart()


    const handleAddToCart = () => {
        if(!user){
            toast.error("You must be logged in to add a product to cart", id = "login")
        }
        toast.success("Product added to cart", {id:"login"})
        addToCartHook(product)
    }
  return (
    <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product?.image} alt='product image' />
				<div className='absolute inset-0 bg-black/20' />
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product?.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>${product?.price}</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to cart
				</button>
			</div>
		</div>
  )
}

export default ProductCard