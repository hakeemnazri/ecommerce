import React from 'react'
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { clearCart } from '../../redux/cartSlice';

function PurchaseSuccess() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()

  useEffect(()=>{
    const handleCheckoutSuccess = async(sessionId)=>{
      setLoading(true)
      try {
        const res = await fetch(`/api/payments/checkout-success`,{
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({sessionId})
        });
        const data = await res.json()
        if(data.error){
          throw new Error(data.error)
        }
        toast.success(data.message, {id: "success"})
        dispatch(clearCart())
      } catch (error) {
        toast.error(error.message, {id: "success"})
      }finally{
        setLoading(false)
      }
    }

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if(sessionId){
      handleCheckoutSuccess(sessionId) 
    }else{
      setError("No session id found") 
    }
  },[])

  if(loading){
    return (
      <div className='h-screen flex items-center justify-center px-4'>
        <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
          <div className='p-6 sm:p-8'>
            <div className='flex justify-center'>
              <HandHeart className='text-emerald-400 w-16 h-16 mb-4' />
            </div>
            <h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
              Loading...
            </h1>
          </div>
        </div>
      </div>
    )
  }

  if(error){
    return (
      <div className='h-screen flex items-center justify-center px-4'>
        <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
          <div className='p-6 sm:p-8'>
            <div className='flex justify-center'>
              <HandHeart className='text-emerald-400 w-16 h-16 mb-4' />
            </div>
            <h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
              {error}
            </h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen flex items-center justify-center px-4'>

			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
						Purchase Successful!
					</h1>

					<p className='text-gray-300 text-center mb-2'>
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className='text-emerald-400 text-center text-sm mb-6'>
						Check your email for order details and updates.
					</p>
					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-gray-400'>Order number</span>
							<span className='text-sm font-semibold text-emerald-400'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to={"/"}
							className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 
            rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
  )
}

export default PurchaseSuccess