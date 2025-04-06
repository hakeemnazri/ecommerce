import Coupon from "../models/coupon.model.js"

export const getCoupon = async(req, res)=>{
    try {
        const coupon = await Coupon.findOne({userId: req.user._id, isActive:true});
        res.json(coupon||"");
    } catch (error) {
        console.log("Error in getCoupon controller: ", error.message);
        res.status(500).json({error:`Error in getCoupon controller: ${error.message}`});
    }
}

export const validateCoupon = async(req, res)=>{
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive:true});

        if(!coupon){
            return res.status(400).json({message:"Invalid coupon code"});
        }

        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({message:"Coupon expired"});
        }
        res.json({message:"Coupon is valid",
            message: "Coupon is valid",
            code:coupon.code,
            discountPrecentage:coupon.discountPrecentage
        });
    } catch (error) {
        console.log("Error in validateCoupon controller: ", error.message);
        res.status(500).json({error:`Error in validateCoupon controller: ${error.message}`});
    }    
}