import Setting from "../models/Setting.js";

export const getAllSettingsService = async (group = null) => {
  const filter = {};
  if (group) filter.group = group;
  const settings = await Setting.find(filter).sort({ group: 1, key: 1 });
  const map = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });
  return { list: settings, map };
};

export const getSettingService = async (key) => {
  return Setting.findOne({ key });
};

export const upsertSettingService = async (key, value, { label, group } = {}) => {
  const setting = await Setting.findOneAndUpdate(
    { key },
    { value, label: label || "", group: group || "general" },
    { returnDocument: "after", upsert: true, new: true, runValidators: true }
  );
  return setting;
};

export const updateManySettingsService = async (data) => {
  const updated = [];
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || Array.isArray(value)) {
      const setting = await upsertSettingService(key, value);
      updated.push(setting);
    }
  }
  return updated;
};
