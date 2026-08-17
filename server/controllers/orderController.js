import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    // Get order data from frontend
    const { tableNumber, items, totalAmount } = req.body;

    // User comes from protect middleware
    const userId = req.user._id;

    // Validation
    if (!tableNumber) {
      return res.status(400).json({
        message: "Table number is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    if (totalAmount === undefined || totalAmount === null) {
      return res.status(400).json({
        message: "Total amount is required",
      });
    }

    const newOrder = await Order.create({
      user: userId,
      tableNumber,
      items,
      totalAmount,
      status: "pending",
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.menuItem", "name color price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });

  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.menuItem", "name color price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email phone")
      .populate("items.menuItem", "name color price");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};