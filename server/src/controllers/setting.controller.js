import {
  getAllSettingsService,
  getSettingService,
  updateManySettingsService,
} from "../services/setting.service.js";

export const getAllSettings = async (req, res) => {
  try {
    const { group } = req.query;
    const result = await getAllSettingsService(group);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSetting = async (req, res) => {
  try {
    const setting = await getSettingService(req.params.key);
    if (!setting) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cấu hình" });
    }
    return res.status(200).json({ success: true, data: setting });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    await updateManySettingsService(req.body);
    return res.status(200).json({
      success: true,
      message: "Lưu cấu hình thành công",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
