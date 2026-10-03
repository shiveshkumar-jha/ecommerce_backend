import {asyncHandler} from "../utils/asyncHandler.js";
import { apierror } from "../utils/Apierror.js";
import { apiresponse } from "../utils/Apiresponse.js";

import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { Category } from "../models/category.models.js";
import { Review } from "../models/review.models.js";

const getoverview = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments({
    });

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
        orderStatus: "pending"
    });

    const deliveredOrders = await Order.countDocuments({
        orderStatus: "delivered"
    });

    const cancelledOrders = await Order.countDocuments({
        orderStatus: "cancelled"
    });

    const lowStockProducts = await Product.countDocuments({
        stock: { $lte: 5 },
        isActive: true
    });

    const revenueResult = await Order.aggregate([
        {
            $match: {
                orderStatus: { $ne: "cancelled" },
                paymentStatus: { $in: ["paid", "pending"] }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const revenue =
        revenueResult.length > 0
            ? revenueResult[0].totalRevenue
            : 0;

    return res.status(200).json(
        new apiresponse(
            200,
            {
                totalUsers,
                totalProducts,
                totalOrders,
                revenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                lowStockProducts
            },
            "Admin overview fetched successfully"
        )
    );
});

const getsalesanalytics = asyncHandler(async (req, res) => {

    const result = await Order.aggregate([
        {
            $match: {
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: null,

                totalRevenue: {
                    $sum: "$totalAmount"
                },

                totalOrders: {
                    $sum: 1
                },

                averageOrderValue: {
                    $avg: "$totalAmount"
                }
            }
        }
    ]);

    const analytics = result.length > 0
        ? result[0]
        : {
            totalRevenue: 0,
            totalOrders: 0,
            averageOrderValue: 0
        };

    return res.status(200).json(
        new apiresponse(
            200,
            {
                totalRevenue: analytics.totalRevenue,
                totalOrders: analytics.totalOrders,
                averageOrderValue: Number(
                    analytics.averageOrderValue.toFixed(2)
                )
            },
            "Sales analytics fetched successfully"
        )
    );
});

const salesovertime = asyncHandler(async (req, res) => {

    const result = await Order.aggregate([
        {
            $match: {
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },

                revenue: {
                    $sum: "$totalAmount"
                },

                orders: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id": 1
            }
        }
    ]);

    return res.status(200).json(
        new apiresponse(
            200,
            result,
            "Sales over time fetched successfully"
        )
    );
});


const topcustomers = asyncHandler(async (req, res) => {

    const result = await Order.aggregate([

        {
            $match: {
                orderStatus: { $ne: "cancelled" }
            }
        },

        {
            $group: {
                _id: "$user",

                totalOrders: {
                    $sum: 1
                },

                totalSpent: {
                    $sum: "$totalAmount"
                }
            }
        },

        {
            $sort: {
                totalSpent: -1
            }
        },

        {
            $limit: 10
        },

        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },

        {
            $unwind: "$user"
        },

        {
            $project: {
                _id: 0,
                userId: "$user._id",
                username: "$user.username",
                fullname: "$user.fullname",
                totalOrders: 1,
                totalSpent: 1
            }
        }
    ]);

    return res.status(200).json(
        new apiresponse(
            200,
            result,
            "Top customers fetched successfully"
        )
    );
});

const topcategories = asyncHandler(async (req, res) => {

    const result = await Order.aggregate([

        {
            $match: {
                orderStatus: { $ne: "cancelled" }
            }
        },

        {
            $unwind: "$items"
        },

        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product"
            }
        },

        {
            $unwind: "$product"
        },

        {
            $group: {
                _id: "$product.category",

                totalSold: {
                    $sum: "$items.quantity"
                },

                revenue: {
                    $sum: "$items.subtotal"
                }
            }
        },

        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
            }
        },

        {
            $unwind: "$category"
        },

        {
            $sort: {
                revenue: -1
            }
        },

        {
            $limit: 10
        },

        {
            $project: {
                _id: 0,
                categoryId: "$category._id",
                categoryName: "$category.name",
                totalSold: 1,
                revenue: 1
            }
        }
    ]);

    return res.status(200).json(
        new apiresponse(
            200,
            result,
            "Top categories fetched successfully"
        )
    );
});

const topproducts = asyncHandler(async (req, res) => {

    const result = await Order.aggregate([

        {
            $match: {
                orderStatus: { $ne: "cancelled" }
            }
        },

        {
            $unwind: "$items"
        },

        {
            $group: {
                _id: "$items.product",

                totalSold: {
                    $sum: "$items.quantity"
                },

                revenue: {
                    $sum: "$items.subtotal"
                }
            }
        },

        {
            $sort: {
                totalSold: -1
            }
        },

        {
            $limit: 10
        },

        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }
        },

        {
            $unwind: "$product"
        },

        {
            $project: {
                _id: 0,
                productId: "$product._id",
                name: "$product.name",
                image: "$product.image",
                totalSold: 1,
                revenue: 1
            }
        }
    ]);

    return res.status(200).json(
        new apiresponse(
            200,
            result,
            "Top products fetched successfully"
        )
    );
});

export { topcategories , topcustomers, salesovertime, getsalesanalytics, getoverview,topproducts }