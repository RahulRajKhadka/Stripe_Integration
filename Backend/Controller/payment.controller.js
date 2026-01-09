/**
 * Stripe Checkout Session Controller
 * Handles creating checkout sessions, applying coupons, 
 * generating new coupons for high-value orders, and related helpers.
 */


import {stripe} from "../lib/stripe.js"
import Coupon from "../models/coupon.model.js";



export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const unitAmount = Math.round(product.price * 100);
      totalAmount += unitAmount * (product.quantity || 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: product.quantity || 1,
      };
    });

    let appliedCoupon = null;

    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (appliedCoupon) {
        totalAmount -= Math.round(
          (totalAmount * appliedCoupon.discountPercentage) / 100
        );
      }
    }

    let discounts = [];
    if (appliedCoupon) {
      const stripeCouponId = await createStripeCoupon(appliedCoupon.discountPercentage);
      discounts = [{ coupon: stripeCouponId }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: discounts,
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products:JSON .stringify(
            products.map((p)=>({

                id:p._id,
                quantity:p.quantity,
                price:p.price, 
            }))
        )
      },
    });

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id.toString());
    }

    res.status(200).json({ 
      url: session.url,
      id: session.id, 
      totalAmount: totalAmount / 100 
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function createStripeCoupon(discountPercentage) {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: discountPercentage,
      duration: "once",
    });
    return coupon.id;
  } catch (error) {
    console.error("Error creating Stripe coupon:", error);
    throw error;
  }
}

async function createNewCoupon(userId) {
  try {
    const code = "SAVE" + Math.floor(Math.random() * 1000000);

    const newCoupon = new Coupon({
      code: code,
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: userId,
      isActive: true,
    });

    await newCoupon.save();
    console.log("New coupon created:", newCoupon.code);
    return newCoupon;
  } catch (error) {
    console.error("Error creating new coupon:", error);
    throw error;
  }
}


export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, error: "Payment not completed" });
    }

    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: session.metadata.couponCode, userId: session.metadata.userId },
        { isActive: false },
        { new: true }
      );
    }

    const products = JSON.parse(session.metadata.products || '[]');

    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map(product => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: sessionId,
      status: "completed",
      paymentStatus: "paid"
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Payment successful, order created, and coupon deactivated if used.",
      orderId: newOrder._id,
      orderDetails: {
        totalAmount: newOrder.totalAmount,
        productsCount: newOrder.products.length,
        orderDate: newOrder.createdAt
      }
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};

export const webhookHandler = async (req, res) => {
  // Handle Stripe webhooks
};

export const getSessionStatus = async (req, res) => {
  // Get session status
};



