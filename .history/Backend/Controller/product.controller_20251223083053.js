import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products }); // ✅ Fixed typo
  } catch (error) {
    console.log("Error in getAllProducts controller:", error.message);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};


export const getFeaturerdProducts=async(req,res )=>{

  try{

    let featuredProducts=await redis.get("featured_products");
    if(featuredProducts){
      return res.json(JSON.parse(featuredProducts));
    }
    //if not in redis, fetch from mongodb
    featuredProducts=await Product.find({isFeatured:true}).lean();
}