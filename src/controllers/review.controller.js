import { apierror } from "../utils/Apierror.js"
import { apiresponse } from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Review} from "../models/review.models.js"
import {Order} from "../models/order.models.js"
import {Product} from "../models/product.models.js"

const updateProductRating = async (productid) => {

    const result = await Review.aggregate([
        {
            $match: {
                product: new mongoose.Types.ObjectId(productid)
            }
        },
        {
            $group: {
                _id: "$product",
                averageRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (result.length === 0) {
        await Product.findByIdAndUpdate(productid, {
            rating: 0,
            numReviews: 0
        });

        return;
    }

    await Product.findByIdAndUpdate(productid, {
        rating: Number(result[0].averageRating.toFixed(1)),
        numReviews: result[0].totalReviews
    });
};

const createreview = asyncHandler(async (req, res) => {

    const { productid } = req.params

    const { rating, comment } = req.body


    if (!rating) {
        throw new apierror(
            400,
            "Rating is required"
        )
    }

    if (rating < 1 || rating > 5) {
        throw new apierror(
            400,
            "Rating must be between 1 and 5"
        )
    }


    // Check whether user has a delivered order
    // containing this product

    const order = await Order.findOne({
        user: req.user._id,
        orderStatus: "delivered",
        "items.product": productid
    })


    if (!order) {
        throw new apierror(
            403,
            "You can review only products you purchased and received"
        )
    }


    // Prevent duplicate review

    const existingReview = await Review.findOne({
        user: req.user._id,
        product: productid
    })


    if (existingReview) {
        throw new apierror(
            400,
            "You have already reviewed this product"
        )
    }


    const review = await Review.create({

        user: req.user._id,

        product: productid,

        order: order._id,

        rating,

        comment
    })


    // Update product rating
    await updateProductRating(productid);


    return res.status(201).json(
        new apiresponse(
            201,
            review,
            "Review added successfully"
        )
    )
})

const getproductreviews = asyncHandler(async (req, res) => {

    const { productid } = req.params

    const reviews = await Review.find({
        product: productid
    })
    .populate(
        "user",
        "fullname username avatar"
    )
    .sort({ createdAt: -1 })


    return res.status(200).json(
        new apiresponse(
            200,
            reviews,
            "Reviews fetched successfully"
        )
    )
})

const updatereview = asyncHandler(async (req, res) => {

    const { reviewid } = req.params

    const { rating, comment } = req.body


    const review = await Review.findOne({
        _id: reviewid,
        user: req.user._id
    })


    if (!review) {
        throw new apierror(
            404,
            "Review not found"
        )
    }


    if (rating !== undefined) {

        if (rating < 1 || rating > 5) {
            throw new apierror(
                400,
                "Rating must be between 1 and 5"
            )
        }

        review.rating = rating
    }


    if (comment !== undefined) {
        review.comment = comment
    }


    await review.save()

     updateProductRating(review.product)
    return res.status(200).json(
        new apiresponse(
            200,
            review,
            "Review updated successfully"
        )
    )
})

const deletereview = asyncHandler(async (req, res) => {

    const { reviewid } = req.params


    const review = await Review.findOneAndDelete({
        _id: reviewid,
        user: req.user._id
    })


    if (!review) {
        throw new apierror(
            404,
            "Review not found"
        )
    }
  updateProductRating(review.product)

    return res.status(200).json(
        new apiresponse(
            200,
            {},
            "Review deleted successfully"
        )
    )
})

export {
    createreview,
    getproductreviews,
    updatereview,
    deletereview
}