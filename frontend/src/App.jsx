import { Navigate, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Navbar from "./components/Navbar"
import toast, { Toaster } from "react-hot-toast"
import { useSelector } from "react-redux"
import { selectUser } from "../redux/userSlice"
import { useCheckAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import AdminPage from "./pages/AdminPage"
import CategoryPage from "./pages/CategoryPage"
import PurchaseSuccess from "./pages/PurchaseSuccess"
import CartPage from "./pages/CartPage"

function App() {
  const user = useSelector(selectUser)
  const {checkAuth, loading, isAuth} = useCheckAuth()

  useEffect(()=>{
      checkAuth()
  },[checkAuth])

  if(loading || isAuth) return(
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
			<div className='relative'>
				<div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />
				<div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
  )

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      	<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

      <div className='relative z-50 pt-20'>
      {user && <Navbar/>}
      <Routes>
        <Route path="/" element={user ? <Homepage/> : <Navigate to="/login"/>} />
        <Route path="/login" element={user ? <Navigate to={"/"}/> :<Login/>} />
        <Route path="/signup" element={ user ? <Navigate to={"/"}/> : <Signup/>} />
        <Route path="/secret-dashboard" element={ user?.role ==="admin" ? <AdminPage/> : <Navigate to={"/"}/>} />      
        <Route path="/category/:category" element={ user ? <CategoryPage/> : <Navigate to={"/login"}/>} />          
        <Route path="/cart" element={ user ? <CartPage/> : <Navigate to={"/login"}/> } /> 
        <Route path="/purchase-success" element={ <PurchaseSuccess/> } />      
     
        </Routes>
      </div>

    <Toaster/>
    </div>
  )
};

export default App
