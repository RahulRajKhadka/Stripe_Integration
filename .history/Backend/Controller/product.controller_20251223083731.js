import Product from "../models/product.model.js";
import redis from "../lib/redis.js"

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
    if (!featuredProducts){

      return res.status(404).json ({message:"NO featured product found "});

      //store in rdis for future quick acess

      await redis.set("featured_products",JSON.stringify(featuredProducts));
    }
  } catch(error){
      console.log("Error in getFeaturedProducts controller",error.message);
      res.status(500).json({message:"Server error",error:error.message})


    }
  }
