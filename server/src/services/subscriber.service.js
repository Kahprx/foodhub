import Subscriber from "../models/Subscriber.js";

export const subscribeService = async (email) => {
  if (!email) throw new Error("Email là bắt buộc");

  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await existing.save();
    }
    return existing;
  }

  return Subscriber.create({ email });
};

export const unsubscribeService = async (email) => {
  return Subscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isActive: false },
    { returnDocument: "after" }
  );
};

export const getAllSubscribersService = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.keyword) {
    filter.email = { $regex: query.keyword, $options: "i" };
  }

  const [subscribers, total] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Subscriber.countDocuments(filter),
  ]);

  return { subscribers, total, page, limit };
};

export const getSubscriberCountService = async () => {
  return Subscriber.countDocuments({ isActive: true });
};
