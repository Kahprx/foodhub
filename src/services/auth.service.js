import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";


export const registerService = async (userData) => {
    const {fullName , email , password } = userData;

    if(!fullName || !email || !password){
        throw new Error("tất cả vừa nhập đều sai hoặc không tỉm thấy thông tin");
        
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email sai vui lòng nhập lại");
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new Error("Email đã tồn tại trên hệ thống ");
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        fullName,
        email,
        password :hashedPassword,
    });
    return{
        id : user._id,
        fullName: user.fullName,
        email: user.email,
        role : user.role,
    };
};
export const loginService = async(userData)=>{
    const {email , password } = userData;
    if (!email || !password ) {
        throw new Error("Email và password đều sai ");
    } 
    const user = await User.findOne({email});
     
    if(!user) {
        throw new Error("Email đã tồn tai");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("password không đúng");
    }
    const token = jwt.sign({
        id: user._id,
        role: user.role,

    },
    process.env.JWT_SECRET,
    {
        expiresIn:"7d",
    }
    );
    return {
        token,
        user:{
            id: user._id,
            fullName : user.fullName,
            email: user.email,
            role : user.role,
        },
    };
};