import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,

    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password :{
        type : String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],  

    },
    role :{
        type: String,
        enum: ["customer", "admin", "restaurant"],
        default: "customer",

    },
    avatar: {
        type: String,
        default:"",
    },
    phone :{
        type : String,
        default : "",

    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
    }],
    recentlyViewed: [{
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
        },
        viewedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    verifyToken: {
        type: String,
        default: null,
    },
    verifyTokenExpires: {
        type: Date,
        default: null,
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetTokenExpires: {
        type: Date,
        default: null,
    },
    address: {
        type: String,
        default: "",
    },
    addresses: [{
        type: String,
        default: [],
    }],
    gender: {
        type: String,
        enum: ["male", "female", "other", ""],
        default: "",
    },
    birthday: {
        type: Date,
        default: null,
    },
},
{
    timestamps : true,

}
);
const User = mongoose.model("User", userSchema);

export default User;
