import mongoose, { Schema } from "mongoose"

const addressSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fullname: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true
        },

        addressline: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        },

        landmark: {
            type: String
        },

        addresstype: {
            type: String,
            enum: ["home", "work", "other"],
            default: "home"
        },

        isdefault: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Address = mongoose.model("Address", addressSchema)

export { Address }