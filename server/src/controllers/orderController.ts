import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors";
import Order from "../models/Order";
import Merch from "../models/Merch";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const createOrder = async (req: Request, res: Response) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new BadRequestError("Please provide order items");
    }

    let totalAmount = 0;

    // Validate and process each item
    for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.merchId)) {
            throw new BadRequestError(`Invalid merchandise ID: ${item.merchId}`);
        }

        const merch = await Merch.findById(item.merchId);
        if (!merch) {
            throw new NotFoundError(`No merchandise found with id ${item.merchId}`);
        }

        // Add item price to total
        totalAmount += merch.price * item.quantity;
        item.price = merch.price;
    }

    const order = await Order.create({
        items,
        totalAmount
    });

    res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('items.merchId');
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid order ID");
    }

    const order = await Order.findById(id).populate('items.merchId');
    
    if (!order) {
        throw new NotFoundError(`No order found with id ${id}`);
    }

    res.status(StatusCodes.OK).json({ order });
};

const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid order ID");
    }

    if (!status) {
        throw new BadRequestError("Please provide order status");
    }

    const order = await Order.findById(id);
    
    if (!order) {
        throw new NotFoundError(`No order found with id ${id}`);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    ).populate('items.merchId');

    res.status(StatusCodes.OK).json({ order: updatedOrder });
};

const verifyOrder = async (req: Request, res: Response) => {
    const { id, secretCode } = req.body;

    if (!id || !secretCode) {
        throw new BadRequestError("Please provide order ID and secret code");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid order ID");
    }

    const order = await Order.findById(id);
    
    if (!order) {
        throw new NotFoundError(`No order found with id ${id}`);
    }

    if (order.secretCode !== secretCode) {
        throw new UnauthenticatedError("Invalid secret code");
    }

    if (order.status !== 'Pending') {
        throw new BadRequestError("Order has already been verified");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status: 'Verified' },
        { new: true, runValidators: true }
    ).populate('items.merchId');

    res.status(StatusCodes.OK).json({ order: updatedOrder });
};

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    verifyOrder
};