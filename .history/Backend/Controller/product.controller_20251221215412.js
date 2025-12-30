import Product from "../models/product.model"

export const getAllProducts=async(req,res)=>{

    try{

        const products=await Product.find({})
        res.josn({product});
    }catch(error)
    {
        console.log("Error in getAllProducts controller ",error:error.message);
        res.status(500).json({message:"Server error",error:error.message})
    }
}