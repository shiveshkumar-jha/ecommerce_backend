import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                image: {
                    type: String
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                subtotal: {
                    type: Number,
                    required: true
                }
            }
        ],

        shippingAddress: {
            fullname: String,
            phone: String,
            addressline: String,
            city: String,
            state: String,
            pincode: String,
            landmark: String
        },

        subtotal: {
            type: Number,
            required: true
        },

        discount: {
            type: Number,
            default: 0
        },

        shippingcharge: {
            type: Number,
            default: 0
        },

        tax: {
            type: Number,
            default: 0
        },

        totalamount: {
            type: Number,
            required: true
        },

        paymentmethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true
        },

        paymentstatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        },
                // cancellation
            cancelledAt: Date,

            cancellationReason: String,

            cancelledBy: {
                type: String,
                enum: ["user", "admin"]
            },

            // delivery
            trackingId: String,

            courierName: String,

            shippedAt: Date,

            deliveredAt: Date,

            estimatedDeliveryDate: Date,
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema)

export { Order }