import { 
  addToCartService, 
  getCarService, 
  updateCartItemService, 
  removeCartItemService,
  clearCartService,
} from "../services/cart.service.js";

export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    console.log(req.body);
    const cart = await addToCartService(
      req.user.id,
      foodId,
      quantity
    );
  
    return res.status(201).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async(req,res) => {
  try{
    const result = await getCarService(req.user.id);
    if(!result){
      return res.status(404).json({
        success:false,
        message:"Không tìm thấy món ăn",
      })
    }
    return res.status(200).json({
      success : true,
      totalPrice:result.totalPrice,
      data : result.cart,
    })
  } catch(error){
    return res.status(500).json({
      success :false,
      message : error.message,
    });
  }
};
export const updateCartItem = async (req,res)=>{
  try{
    const {foodId, quantity} = req.body;
    
    const cart = await updateCartItemService(
      req.user.id,
      foodId,
      quantity
    );
    if (!cart) {
      return res.status(404).json({
        success : false ,
        message:"không tìm thấy giỏ hàng  hoac món ăn",
      });
    }
    return res.status(200).json({
      success : true,
      message :"cập nhật số lượng thành công",
      data: cart,
    });
  } catch(error){
      return res.status(500).json({
        success: false,
        message : error.message,
      });

  }
};
export const removeCartItem = async (req, res) => {
  try {
    const {foodId} = req.params;
 
    const cart = await removeCartItemService(
      req.user.id,
      foodId
    );
  
    if (!cart){
      return res.status(404).json({
        success:false,
        message:"Không tìm thấy giỏ hàng",
      });
    }
    return res.status(200).json({
      success : true,
      message :"Xóa món ăn khỏi giỏ hàng",
      data : cart,
    });
  }catch(error){
    return res.status(500).json({
      success:false,
      message : error.message,
    });
  }
};
export const clearCart = async (req,res) => {
  try {
    const cart = await clearCartService(req.user.id);
    if(!cart){
      return res.status(404).json({
        success:false,
        message:"không tìm thấy giỏ hàng",
      });
    }
    return res.status(200).json({
      success:true,
      message:"Đã xóa toàn bộ giỏ hàng thành công",
      data : cart,
    });
  }catch (error){
    return res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};