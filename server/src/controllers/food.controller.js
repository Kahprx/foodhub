import {
  createFoodService,
  getAllFoodsService,
  getFoodByIdService,
  updateFoodService,
  deleteFoodService,
} from "../services/food.service.js";
export const createFood = async (req, res) => {
  try {
    const food = await createFoodService(req.body);

    return res.status(201).json({
      success: true,
      message: "Tạo món ăn thành công",
      data: food,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllFoods = async (req, res) => {
  try {
    const result = await getAllFoodsService(req.query);

    return res.status(200).json({
      success: true,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      count: result.foods.length,
      data: result.foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getFoodById = async (req,res)=> {
 try{
  const{ id } = req.params;
  const food = await getFoodByIdService(id);
  if(!food){
    return res.status(404).json({
      success:false,
      message :"khong tim thay mon an"
    });
  } 
  return res.status(200).json({
    success : true,
    data:food,
  });
 }catch(error){
    return res.status(500).json({
      success:false,
      message:error.message,
    })
 }
};
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await updateFoodService(id, req.body);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật món ăn thành công",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteFood = async (req,res) =>{
  try{
    const {id} = req.params;
    
    const food = await deleteFoodService(id);

    if(!food){
      return res.status(404).json({
        success : false,
        message:"Không tìm thấy món ăn",
      });
    }
    return res.status(200).json({
      success :true,
      message :"xóa món ăn thành công",
    });
  }catch (error){
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};