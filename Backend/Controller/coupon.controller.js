import Coupon from "../models/coupon.model.js"



export const getCoupons = async (req, res) => {
  try {
    const userId = req.user._id;

    const coupons = await Coupon.find({ userId });

    res.json(coupons);
  } catch (error) {
    console.log("Error in getCoupons:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // Find coupon by code (case-insensitive)
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is inactive" });
    }

    if (new Date() > coupon.expirationDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // If valid, return discount percentage
    res.json({
      message: "Coupon is valid",
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
