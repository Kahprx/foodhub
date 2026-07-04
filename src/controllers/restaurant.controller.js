import { createRestaurantService ,
    getAllRestaurantsService,
    getRestaurantByIdService,
    updateRestaurantService,
    deleteRestaurantService,
} from "../services/restaurant.service.js";

export const createRestaurant = async (req, res)=> {
    try {
        const restaurantData = {
            ...req.body,
            owner :req.user.id,
        };
        const restaurant = await createRestaurantService(restaurantData);

        return res.status(201).json({
            success : true,
            message :"nhà hàng tạo thành công",
            data : restaurant,
        });

    }catch (error)
    {
        return  res.status(400).json({
            success : false,
            message : error.message,
        });
    }
};
export const getAllRestaurants = async (req, res) => {
  try {
    const { keyword, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllRestaurantsService(
      keyword,
      page,
      limit,
      sort
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      count: result.restaurants.length,
      data: result.restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getRestaurantById = async (req , res)=>{
  try {
    const {id} = req.params;
    
    const restaurant = await getRestaurantByIdService(id);

    if (!restaurant) {
      return res.status(404).json({
        success:true,
        message:"nhà hàng không tìm thấy",
      });
    }
    return res.status(200).json({
      success:true,
      data :restaurant,
    });
  } catch (error){
    return res.status(500).json({
      success :false,
      message:error.message,
    });
  }
};
export const updateRestaurant = async (req,res)=>{
  try{
    const {id} = req.params;
    
    const restaurant = await updateRestaurantService(id, req.body);
    if(!restaurant) {
      return res.status(404).json({
        success :false,
        message:"nhà hàng ko tìm thấy",

      });
    }
    return res.status(200).json({
      success :true,
      message:"nhà hàng đã được nâng cấp",
      data :restaurant,
    });
  }catch(error){
    return res.status(400).json({
      success:false,
      message: error.message,
    });
  };
};
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await deleteRestaurantService(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Nhà hàng không tìm thấy",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nhà hàng đã xóa thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};