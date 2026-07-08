import { createOrderService, getMyOrdersService, getOrderByIdService, updateOrderStatusService,
    cancelOrderService,getRevenueService,getAllOrdersService
 } from "../services/order.service.js";
import { successResponse } from "../utils/response.js";

export const createOrder = async (req,res) =>{
    try {
        const {deliveryAddress, paymentMethod} = req.body;
        const order = await createOrderService(
            req.user.id,
            deliveryAddress,
            paymentMethod,
        );
        return res.status(201).json({
            success: true,
            message:"Đặt hàng thành công",
            data: order,
        });

    } catch (error){
        return res.status(400).json({
            success : false,
            message:error.message,
        })
    }
}
export const getMyOrders = async(req, res) =>{
    try {
        const order = await getMyOrdersService(req.user.id);
        return res.status(200).json({
            success:true,
            count : order.length,
            data :order,
        })
    } catch(error){
        return res.status(500).json({
            success : false,
            message:error.message,
        });
    }
    
};
export const getOrderById = async (req, res) =>{
    try{
        const{ id } = req.params;
        const order = await getOrderByIdService(id);
        if (!order){
            return res.status(404).json({
                success : false,
                message :"Không tìm thấy đơn hàng",
            });
        }
        return res.status(200).json({
            success : true,
            data :order,
        })
    }catch (error){
        return res.status(500).json({
            success :false,
            message:error.message,
        })
    }
};
export const updateOrderStatus = async (req,res) =>{
    try{
        const {id} = req.params;
        const {status} = req.body;

        const order = await updateOrderStatusService(id,status);
        if (!order){
            return res.status(404).json({
                success :false,
                message :"không tìm thấy đơn hàng ",
        
            });
        }
        return res.status(200).json({
            success : true,
            message:"Cập nhật trạng thái thành công",
            data :order,
        })
    }catch (error){ 
        return res.status(500).json({
            success : false,
            message: error.message,
        });
    }
};
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await cancelOrderService(id);

    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getRevenue = async (req, res) => {
  try {
    const revenue = await getRevenueService();

    return res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};