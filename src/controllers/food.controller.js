import { createFoodService, getAllFoodsService, getFoodByIdService } from "../services/food.service.js";
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
export const getAllFoods = async (req, res)=> {
  try{ 
    const foods = await getAllFoodsService();
 
      return res.status(200).json({
        success:true,
        count: foods.length,
        data:foods,
      });
    
  }catch(error){
    return res.status(500).json({
      success:false,
      message:error.message,
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