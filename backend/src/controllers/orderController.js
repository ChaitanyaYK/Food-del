import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async (req, res) => {
    const userId = req.user._id;
    const { items, amount, address } = req.body;
    const frontend_url = "http://localhost:5173" || process.env.FRONTEND_SERVER_URL;

    try {
        if (!userId || !items || !amount || !address) {
            res.status(400).json({ success: false, message: "All fields required" });
        }
        const newOrder = await Order.create({
            userId: userId,
            items: items,
            amount: amount,
            address: address
        })

        if (!newOrder) {
            res.status(400).json({success: false, message: "New Order is not Avaiable"});
        }

        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData:{} });

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("placeOrder error:", error);
        
        res.status(500).json({ success: false, message: error.message });
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true" || success === true) {
            await Order.findByIdAndUpdate(orderId, { payment: true });
            res.status(200).json({ success: true, message: "Paid" });
        } else {
            await Order.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Not paid" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// user orders for frontend 
const userOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({userId});
        res.status(200).json({success:true, orders, message:"User order"});
    } catch (error) {
        console.log(error); 
        res.status(500).json({ success: false, message: error.message });
    }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await Order.find({});

        if (!orders) {
           return res.status(404).json({success: true, message: "No Order Data" });
        }

        res.status(200).json({success: true, orders, message: "order list fetch successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// api for updating order status
const updateStatus = async (req ,res) => {
    try {
        const {orderId, status} = req.body;
        const orderUpdated = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!orderUpdated) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }
        res.status(200).json({success:true, orderUpdated, message:"Status Updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };