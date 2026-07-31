import {
  createFoodService,
  getAllFoodsService,
  getRecommendedFoodsService,
  getFoodByIdService,
  updateFoodService,
  deleteFoodService,
  getAllFoodsAdminService,
  duplicateFoodService,
  adjustStockService,
  getStockLogsService,
} from "../services/food.service.js";
import ExcelJS from "exceljs";
import Food from "../models/Food.js";

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

export const getAllFoodsAdmin = async (req, res) => {
  try {
    const result = await getAllFoodsAdminService(req.query);
    return res.status(200).json({
      success: true,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
      lowStockCount: result.lowStockCount,
      outOfStockCount: result.outOfStockCount,
      data: result.foods,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateFood = async (req, res) => {
  try {
    const food = await duplicateFoodService(req.params.id);
    return res.status(201).json({
      success: true,
      message: "Nhân bản sản phẩm thành công",
      data: food,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const food = await adjustStockService(req.params.id, req.body, req.user.id);
    return res.status(200).json({
      success: true,
      message: "Cập nhật tồn kho thành công",
      data: food,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getStockLogs = async (req, res) => {
  try {
    const result = await getStockLogsService(req.query);
    return res.status(200).json({
      success: true,
      total: result.total,
      data: result.logs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const exportFoodsExcel = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HappyHomes";
    const sheet = workbook.addWorksheet("SanPham");

    sheet.columns = [
      { header: "ID", key: "id", width: 28 },
      { header: "Tên sản phẩm", key: "name", width: 30 },
      { header: "Danh mục", key: "category", width: 16 },
      { header: "Thương hiệu", key: "brand", width: 16 },
      { header: "Giá", key: "price", width: 12 },
      { header: "Giá KM", key: "discountPrice", width: 12 },
      { header: "Tồn kho", key: "stock", width: 10 },
      { header: "Đã bán", key: "soldCount", width: 10 },
      { header: "Đánh giá", key: "rating", width: 10 },
      { header: "Cửa hàng", key: "restaurant", width: 20 },
      { header: "Hoạt động", key: "isAvailable", width: 10 },
      { header: "Ngày tạo", key: "createdAt", width: 20 },
    ];

    foods.forEach((f) => {
      sheet.addRow({
        id: String(f._id),
        name: f.name,
        category: f.category,
        brand: f.brand?.name || "",
        price: f.price,
        discountPrice: f.discountPrice ?? "",
        stock: f.stock ?? 0,
        soldCount: f.soldCount ?? 0,
        rating: f.rating,
        restaurant: f.restaurant?.name || "",
        isAvailable: f.isAvailable ? "Có" : "Không",
        createdAt: f.createdAt?.toISOString().slice(0, 10),
      });
    });

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3C8" },
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=products-${Date.now()}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const importFoodsExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "Vui lòng upload file Excel" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const sheet = workbook.worksheets[0];

    let created = 0;
    let skipped = 0;
    const errors = [];
    const restaurantId = req.body.restaurant;

    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      const name = row.getCell(1).value?.toString()?.trim();
      const price = Number(row.getCell(2).value);
      const category = row.getCell(3).value?.toString()?.trim() || "Đồ chơi";
      const stock = Number(row.getCell(4).value) || 0;

      if (!name || !Number.isFinite(price)) {
        errors.push(`Dòng ${r}: thiếu tên hoặc giá không hợp lệ`);
        continue;
      }
      if (!restaurantId) {
        errors.push("Thiếu ID cửa hàng (restaurant) trong request body");
        break;
      }

      const existing = await Food.findOne({ name });
      if (existing) {
        skipped += 1;
        continue;
      }

      await Food.create({
        name,
        price,
        category,
        stock,
        restaurant: restaurantId,
        isAvailable: true,
      });
      created += 1;
    }

    return res.status(200).json({
      success: true,
      message: "Import hoàn tất",
      data: { created, skipped, errors },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await getFoodByIdService(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "khong tim thay mon an",
      });
    }
    return res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await deleteFoodService(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy món ăn",
      });
    }
    return res.status(200).json({
      success: true,
      message: "xóa món ăn thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecommendedFoods = async (req, res) => {
  try {
    const foods = await getRecommendedFoodsService(req.query);
    return res.status(200).json({ success: true, data: foods });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
