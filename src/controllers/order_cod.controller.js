import { asyncHandler } from "../utils/asyncHandler.js"
import { apierror } from "../utils/Apierror.js"
import { apiresponse } from "../utils/Apiresponse.js"

import { Cart } from "../models/cart.models.js"
import { Address } from "../models/address.models.js"
import { Product } from "../models/product.models.js"
import { Order } from "../models/order.models.js"


const placecodorder = asyncHandler(async (req, res) => {

    const { addressId } = req.body

    // 1. Check address
    if (!addressId) {
        throw new apierror(400, "Address is required")
    }

    const address = await Address.findOne({
        _id: addressId,
        user: req.user._id
    })

    if (!address) {
        throw new apierror(404, "Address not found")
    }


    // 2. Get user's cart
    const cart = await Cart.findOne({
        user: req.user._id
    }).populate({
        path: "items.product",
        select: "name price discount finalprice image stock"
    })

    if (!cart || cart.items.length === 0) {
        throw new apierror(400, "Cart is empty")
    }


    // 3. Validate cart + calculate total
    const orderItems = []

    let subtotal = 0

    for (const item of cart.items) {

        const product = item.product

        if (!product) {
            throw new apierror(
                400,
                "One of the products no longer exists"
            )
        }

        if (item.quantity > product.stock) {
            throw new apierror(
                400,
                `Only ${product.stock} units of ${product.name} are available`
            )
        }

        const itemSubtotal =
            product.finalprice * item.quantity

        subtotal += itemSubtotal

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.finalprice,
            quantity: item.quantity,
            subtotal: itemSubtotal
        })
    }


    // 4. Calculate charges

    const discount = 0

    const shippingCharge =
        subtotal >= 500 ? 0 : 50

    const tax = 0

    const totalAmount =
        subtotal
        - discount
        + shippingCharge
        + tax


    // 5. Reduce stock

    for (const item of cart.items) {

        const updatedProduct =
            await Product.findOneAndUpdate(
                {
                    _id: item.product._id,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: {
                        stock: -item.quantity
                    }
                },
                {
                    new: true
                }
            )

        if (!updatedProduct) {

            throw new apierror(
                400,
                `Insufficient stock for ${item.product.name}`
            )
        }
    }


    // 6. Create order

    const order = await Order.create({

        user: req.user._id,

        items: orderItems,

        shippingAddress: {
            fullname: address.fullname,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            landmark: address.landmark
        },

        subtotal,

        discount,

        shippingCharge,

        tax,

        totalAmount,

        paymentMethod: "COD",

        paymentStatus: "pending",

        orderStatus: "confirmed"
    })


    // 7. Clear cart

    cart.items = []

    await cart.save()


    // 8. Send response

    return res.status(201).json(
        new apiresponse(
            201,
            order,
            "order confirmed,please pay the amount at delivery"
        )
    )
})

const getmyorders = asyncHandler(async (req, res) => {

    const orders = await Order.find({
        user: req.user._id
    })
    .populate("items.product", "name image")
    .sort({ createdAt: -1 })


    return res.status(200).json(
        new apiresponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    )
})

const getorderbyid = asyncHandler(async (req, res) => {

    const { orderid } = req.params

    const order = await Order.findOne({
        _id: orderid,
        user: req.user._id
    })
    .populate("items.product", "name image")


    if (!order) {
        throw new apierror(
            404,
            "Order not found"
        )
    }


    return res.status(200).json(
        new apiresponse(
            200,
            order,
            "Order fetched successfully"
        )
    )
})

const cancelorder = asyncHandler(async (req, res) => {

    const { orderid } = req.params

    const { reason } = req.body


    // 1. Find user's order

    const order = await Order.findOne({
        _id: orderid,
        user: req.user._id
    })


    if (!order) {
        throw new apierror(
            404,
            "Order not found"
        )
    }


    // 2. Check whether cancellation is allowed

    if (
        order.orderStatus === "shipped" ||
        order.orderStatus === "delivered" ||
        order.orderStatus === "cancelled"
    ) {

        throw new apierror(
            400,
            "Order cannot be cancelled now"
        )
    }


    // 3. Restore stock

    for (const item of order.items) {

        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    stock: item.quantity
                }
            }
        )
    }

    // 5. Update order

    order.orderStatus = "cancelled"

    order.cancelledAt = new Date()

    order.cancelledBy = "user"

    order.cancellationReason =
        reason || "Customer cancelled the order"


    await order.save()


    return res.status(200).json(
        new apiresponse(
            200,
            order,
            "Order cancelled successfully"
        )
    )
})

const updateorderstatus = asyncHandler(async (req, res) => {

    const { orderid } = req.params

    const { status } = req.body


    const allowedStatuses = [
        "confirmed",
        "processing",
        "shipped",
        "delivered"
    ]


    if (!allowedStatuses.includes(status)) {

        throw new apierror(
            400,
            "Invalid order status"
        )
    }


    const order = await Order.findById(orderid)


    if (!order) {
        throw new apierror(
            404,
            "Order not found"
        )
    }


    // Don't update cancelled order

    if (order.orderStatus === "cancelled") {

        throw new apierror(
            400,
            "Cancelled order cannot be updated"
        )
    }


    // SHIPPED

    if (status === "shipped") {

        order.shippedAt = new Date()

        if (!order.trackingId) {
            order.trackingId =
                `TRK${Date.now()}`
        }
    }


    // DELIVERED

    if (status === "delivered") {

        order.deliveredAt = new Date()
    }


    order.orderStatus = status


    await order.save()


    return res.status(200).json(
        new apiresponse(
            200,
            order,
            `Order marked as ${status}`
        )
    )
})

export { placecodorder, getmyorders, getorderbyid , cancelorder, updateorderstatus }