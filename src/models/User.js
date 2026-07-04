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
},
{
    timestamps : true,

}
);
const User = mongoose.model("User", userSchema);

export default User;