import { successResponse } from "../utils/response.js";

export const healthCheck = (req, res) => {
  return successResponse(
    res,
    {
      api: "FoodHub",
      version: "1.0.0",
      status: "OK",
    },
    "FoodHub API is running"
  );
};