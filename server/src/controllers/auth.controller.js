import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req, res)=> {
    try {
        const result = await registerService (req.body);
        
        return res.status(201).json({
            success : true,
            message :"Register successfully",
            data: result,

        });
    
    } catch(error){
        return res.status(400).json({
            success :false,
            message :error.message,
        });
    }
};

export const login = async (req, res) => {
   try{
    const result = await loginService(req.body);

    return res.status(200).json({
        success: true,
        message:"dang nhap thanh cong",
        data: result,
    });
   }catch (error){
    return res.status(400).json({
        success:false,
        message:error.message,
    })
   }
};

export const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};