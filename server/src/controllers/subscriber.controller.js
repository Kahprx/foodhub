import {
  subscribeService,
  unsubscribeService,
  getAllSubscribersService,
  getSubscriberCountService,
} from "../services/subscriber.service.js";

export const subscribe = async (req, res) => {
  try {
    const subscriber = await subscribeService(req.body.email);
    return res.status(201).json({
      success: true,
      message: "Đăng ký nhận tin thành công!",
      data: subscriber,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const subscriber = await unsubscribeService(req.params.email);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Email chưa đăng ký" });
    }
    return res.status(200).json({
      success: true,
      message: "Đã hủy nhận tin",
      data: subscriber,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const result = await getAllSubscribersService(req.query);
    return res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.subscribers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscriberCount = async (req, res) => {
  try {
    const count = await getSubscriberCountService();
    return res.status(200).json({ success: true, data: count });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
