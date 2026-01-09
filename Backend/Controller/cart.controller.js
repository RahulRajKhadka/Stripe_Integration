export const addTocart =async (req, res)=>{

    try{


        const {productId}=req.body;
        const user =req.user;

        const existingItem =user.cartItems.find (item => item.id == productId);
        if(existingItem){

            existingItem.quantity+1;

        }else{

            user.cartItems.push(productId)
        }

        await user.save();
        res.json(user.cartItems)
    }catch(error) {
    console.log("Error in addtTocart controller ",error.message);
    res.status(500).json({message:"server error", error:error.message})


    }
}



export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;

    const productIds = user.cartItems.map(item => item.productId);

    const products = await Product.find({ _id: { $in: productIds } });

  

    const cartProducts = products.map(product => {
      const cartItem = user.cartItems.find(
        item => item.productId.toString() === product._id.toString()
      );
      return {
        product,
        quantity: cartItem.quantity,
      };
    });

    res.json(cartProducts);
  } catch (error) {
    console.log("Error in getCartProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const removeAllFromCart = async (req, res) => {
  try {
    const user = req.user;

    user.cartItems = [];

    await user.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.log("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;   // 👈 from params
    const { quantity } = req.body;
    const user = req.user;

    const cartItem = user.cartItems.find(
      item => item.id.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // remove item if quantity is 0 or less
      user.cartItems = user.cartItems.filter(
        item => item.id.toString() !== productId
      );
    } else {
      cartItem.quantity = quantity;
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
