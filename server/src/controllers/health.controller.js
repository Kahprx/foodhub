import { successResponse } from "../utils/response.js";

export const heathCheck = (req,res) => {
    return successResponse(
        res, 
        {
            api :"FoodHub",
            version : "1.0.0",
        
        }, 
        "API is running"
    );
};