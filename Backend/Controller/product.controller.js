import Product from "../models/product.model.js";
import redis from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products }); 
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


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required"
      });
    }

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "",
      category
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getRecommendedProducts=async (req, res)=>{

  try{
    const products = await Prodcut.aggregate([
      {
        $smaple:{size:3}
      },
      {
        $project:{

          _id:1,
          name:1,
          description:1,
          image:1,
          price:1
        }
      }
    ]);
    res.json(products)

  }catch (error){
    console.log("Eror in  getRecommendedProducts controller", error.message);
    res.status(500).json ({ message:"server error",error:error.message});
  }
}

export const getProductsByCategory =async (req,res)=>{

  const {category}=req.params;
  try{

    const product=await Products.find ({category});
    res.json(Product);

  }catch(error){

    console.log("Error in getProdcutsByCategroy controller ",error.message);
    res.status(500).json({message:"Server error ",error:error.message})
  }
}

export const toggleFeaturedProduct=async (req,res)=>{

  try{

    const product =await Product.findById(req.params.id);
    if(product){

      product.isFeatured=!product.isFeatured;
      const updateProduct=await product.save();
      await updateFeaturedProdcutCache();
      res.json(updateProduct);

    }
    else {
      res.status(404).json({message:"Product not found"})
    }
  }catch(error){


    console.log("Error in toogleFeaturedProduct controller",error.message);
    res.status(500).json({message:"SErver error",error:erro.message})
  }

}

async function updateFeaturedProductsCache() {
  try{

    const featuredproducts=await Product.find( {isFeatured:true}).lean();

    await redis.set("featured_prodcuts",JSON.stringify( featuredproducts));
  }catch(error){

    console.log("error in update cache function")
  }
  
}