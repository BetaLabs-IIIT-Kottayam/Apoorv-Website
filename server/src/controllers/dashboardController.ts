import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Order from "../models/Order";

const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Get basic stats
        const basicStats = await Order.aggregate([
            {
                $match: { status: "Paid" }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Get detailed merch stats
        const merchSalesSummary = await Order.aggregate([
            {
                $match: { status: "Paid" }
            },
            // Unwind items array to process each item separately
            { $unwind: "$items" },
            // Lookup merch details
            {
                $lookup: {
                    from: "merches",
                    localField: "items.merchId",
                    foreignField: "_id",
                    as: "merchDetails"
                }
            },
            { $unwind: "$merchDetails" },
            // Group by merch, color, and size
            {
                $group: {
                    _id: {
                        merchId: "$items.merchId",
                        merchName: "$merchDetails.name",
                        color: "$items.color",
                        size: "$items.size"
                    },
                    quantitySold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            // Group by merch and color to organize sizes
            {
                $group: {
                    _id: {
                        merchId: "$_id.merchId",
                        merchName: "$_id.merchName",
                        color: "$_id.color"
                    },
                    sizes: {
                        $push: {
                            size: "$_id.size",
                            quantity: "$quantitySold",
                            revenue: "$revenue"
                        }
                    },
                    totalColorQuantity: { $sum: "$quantitySold" },
                    totalColorRevenue: { $sum: "$revenue" }
                }
            },
            // Final grouping by merch
            {
                $group: {
                    _id: {
                        merchId: "$_id.merchId",
                        merchName: "$_id.merchName"
                    },
                    colors: {
                        $push: {
                            color: "$_id.color",
                            sizes: "$sizes",
                            totalQuantity: "$totalColorQuantity",
                            totalRevenue: "$totalColorRevenue"
                        }
                    },
                    totalMerchQuantity: { $sum: "$totalColorQuantity" },
                    totalMerchRevenue: { $sum: "$totalColorRevenue" }
                }
            },
            // Format the output
            {
                $project: {
                    _id: 0,
                    merchName: "$_id.merchName",
                    colors: 1,
                    totalQuantity: "$totalMerchQuantity",
                    totalRevenue: "$totalMerchRevenue"
                }
            },
            // Sort by total revenue
            { $sort: { totalRevenue: -1 } }
        ]);

        const dashboardStats = {
            summary: {
                totalOrders: basicStats[0]?.totalOrders || 0,
                totalAmount: basicStats[0]?.totalAmount || 0
            },
            merchSalesSummary
        };

        res.status(StatusCodes.OK).json(dashboardStats);
    } catch (error) {
        throw new Error("Error fetching dashboard statistics");
    }
};

export {
    getDashboardStats
};
