import mongoose, { Schema } from "mongoose"

const reviewSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    }

}, { timestamps: true })


// One user can review a product only once
reviewSchema.index(
    { user: 1, product: 1 },
    { unique: true }
)


export const Review =
    mongoose.model("Review", reviewSchema)