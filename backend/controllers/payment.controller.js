import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { stripe } from "../utils/stripe.js";
import dotenv from "dotenv";

dotenv.config() 


async function createCouponcode(discountPrecentage){
    const coupon = await stripe.coupons.create({
        duration: 'once',
        percent_off: discountPrecentage,
      });

      return coupon.id
}

async function createNewCoupon(userId){
    const newCoupon = new Coupon({
    code: 'GIFT'+ Math.random().toString(36).substring(2,8).toUpperCase(),
    discountPrecentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId
    })

    await newCoupon.save()
}

export const createCheckoutSession = async(req, res) =>{
    try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({error: "Invalid empty products array"})
        }

        let totalAmount = 0; 

        const lineItems = products.map((product)=>{
            const amount = Math.round(product.product.price * 100);
            totalAmount += amount;
            return{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name: product.product.name,
                        description: product.product.description,
                        images: [product.product.image]
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity
            }
        })

        let coupon = null;    
        if(couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId: req.user._id,isActive: true})
            totalAmount = totalAmount - (totalAmount * (coupon?.discountPrecentage / 100)) 
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            cancel_url: `${process.env.APP_URL}/purchase-cancel`,
            success_url: `${process.env.APP_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            payment_method_types: ["card"],
            discounts: couponCode ? (
                [
                    {
                        coupon: await createCouponcode(couponCode.discountPrecentage),
                    }
                ]
                ) :(
                [{}]
                ),
            metadata:{
                userId: req.user._id.toString(), 
                couponCode: JSON.stringify(couponCode) || "",
                products: JSON.stringify(products.map((p)=>({
                    id: p._id,
                    quantity:p.quantity,
                    price: p.product.price
                }))),
                totalAmount:totalAmount/100, 
            },
            line_items: lineItems 
        })

        if(totalAmount > 20000){
            await createNewCoupon(req.user)
        }

        // res.redirect(303, session.url);
        res.json({url: session.url})

    } catch (error) {
        console.log("Error in createCheckoutSession controller: ", error.message)
       return  res.status(500).json({error:`Error in createCheckoutSession controller: ${error.message}`})
    }
}

export const successCheckout = async(req, res) => {
    try {  
        const {sessionId} = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if(session.payment_status === 'paid'){
            const user = await User.findById(req.user._id)
            user.cartItems = []
            await user.save()
        }
 
        if(session.payment_status === 'paid' && session.metadata.couponCode){
            await Coupon.findOneAndUpdate({code: session.metadata.couponCode, userId: session.metadata.userId},
            {isActive: false})
        } 

        const products = JSON.parse(session.metadata.products) 

        const newOrder = new Order({  
            user: session.metadata.userId,
            products: products.map((p)=>({
                product: p.id,
                quantity: p.quantity,
                price: p.price 
            })),
            totalAmount: session.amount_total / 100,
            stripeSessionId: session.id,
        }) 

        await newOrder.save()
        res.status(200).json({message:"Order placed successfully"})

    } catch (error) {
        console.log("Error in successCheckout controller: ", error.message)
        res.status(500).json({error:`Error in successCheckout controller: ${error.message}`})
    } 
} 