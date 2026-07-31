import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Food from "./models/Food.js";
import Restaurant from "./models/Restaurant.js";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Coupon from "./models/Coupon.js";
import Banner from "./models/Banner.js";
import Order from "./models/Order.js";
import Review from "./models/review.js";
import Subscriber from "./models/Subscriber.js";
const IMAGES = {
  bear: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500",
  robot: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500",
  puzzle: "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=500",
  car: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500",
  blocks: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500",
  doll: "https://images.unsplash.com/photo-1559454403-b8fb8c44c85d?w=500",
  train: "https://images.unsplash.com/photo-1595893900996-a6a011717a3b?w=500",
  kite: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500",
  teddy: "https://images.unsplash.com/photo-1559717201-fbb671ff56b7?w=500",
  lego: "https://images.unsplash.com/photo-1561715276-a2d1e9e0db5f?w=500",
};

const CATEGORIES = [
  { name: "Gấu bông", description: "Thú nhồi bông mềm mại" },
  { name: "Đồ chơi giáo dục", description: "Phát triển tư duy cho bé" },
  { name: "Xe điều khiển", description: "Xe RC tốc độ cao" },
  { name: "Lego & Lắp ráp", description: "Bộ xếp hình sáng tạo" },
  { name: "Búp bê", description: "Búp bê thời trang cao cấp" },
];

const BRANDS = [
  { name: "LEGO", description: "Thương hiệu lắp ráp hàng đầu thế giới" },
  { name: "Mattel", description: "Nhà sản xuất búp bê Barbie" },
  { name: "Hot Wheels", description: "Xe đồ chơi siêu tốc" },
  { name: "Gund", description: "Gấu bông cao cấp" },
  { name: "Vtech", description: "Đồ chơi thông minh" },
];

const PRODUCTS = [
  { name: "Gấu bông Teddy khổng lồ 1m", description: "Gấu bông Teddy mềm mại size 1m, chất liệu nhung cao cấp", price: 350000, category: "Gấu bông", brand: "Gund", stock: 25, image: IMAGES.teddy, isFeatured: true, discountPrice: 280000 },
  { name: "Gấu bông chú gấu nâu 50cm", description: "Gấu nâu dễ thương, thích hợp làm quà tặng", price: 180000, category: "Gấu bông", brand: "Gund", stock: 40, image: IMAGES.bear, discountPrice: 144000 },
  { name: "Robot biến hình siêu nhân", description: "Robot có đèn và âm thanh, biến hình 3 kiểu", price: 450000, category: "Đồ chơi giáo dục", brand: "Vtech", stock: 18, image: IMAGES.robot, isFeatured: true, discountPrice: 360000 },
  { name: "Bộ xếp hình gỗ 100 chi tiết", description: "Xếp hình phát triển trí thông minh", price: 220000, category: "Đồ chơi giáo dục", brand: "Vtech", stock: 30, image: IMAGES.blocks },
  { name: "Xe điều khiển từ xa tốc độ cao", description: "Xe RC chạy 40km/h, pin sạc 30 phút", price: 550000, category: "Xe điều khiển", brand: "Hot Wheels", stock: 12, image: IMAGES.car, isFeatured: true, discountPrice: 440000 },
  { name: "Bộ puzzle 500 miếng thế giới động vật", description: "Puzzle 500 miếng, giúp rèn kiên nhẫn", price: 160000, category: "Đồ chơi giáo dục", brand: "LEGO", stock: 22, image: IMAGES.puzzle, discountPrice: 120000 },
  { name: "Búp bê Barbie thời trang", description: "Búp bê Barbie bộ váy dạ hội", price: 320000, category: "Búp bê", brand: "Mattel", stock: 15, image: IMAGES.doll, isFeatured: true },
  { name: "Bộ tàu hỏa chạy điện", description: "Đoàn tàu hỏa chạy pin, gồm 5 toa", price: 420000, category: "Lego & Lắp ráp", brand: "LEGO", stock: 20, image: IMAGES.train },
  { name: "Diều giấy hình rồng", description: "Diều giấy cao cấp, bay cao ổn định", price: 95000, category: "Đồ chơi giáo dục", brand: "Vtech", stock: 50, image: IMAGES.kite },
  { name: "LEGO City cứu hỏa", description: "Bộ LEGO City xe cứu hỏa 380 miếng", price: 650000, category: "Lego & Lắp ráp", brand: "LEGO", stock: 10, image: IMAGES.lego },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected MongoDB");

  // Xóa dữ liệu cũ
  await Promise.all([
    User.deleteMany({}),
    Food.deleteMany({}),
    Restaurant.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Coupon.deleteMany({}),
    Banner.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    Subscriber.deleteMany({}),
  ]);
  console.log("🧹 Đã xóa dữ liệu cũ");

  // Accounts
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);
  const admin = await User.create({
    fullName: "Quản trị viên",
    email: "admin@happyhomes.com",
    password: adminPass,
    role: "admin",
    isVerified: true,
    phone: "0901234567",
  });
  const customer = await User.create({
    fullName: "Khách hàng Demo",
    email: "user@happyhomes.com",
    password: userPass,
    role: "customer",
    isVerified: true,
    phone: "0909876543",
  });
  console.log("👤 Admin:", admin.email, "/ admin123");
  console.log("👤 User:", customer.email, "/ user123");

  // Categories & Brands
  const categories = await Category.create(CATEGORIES);
  const brands = await Brand.create(BRANDS);
  console.log(`🏷️  ${categories.length} danh mục, ${brands.length} thương hiệu`);

  // Restaurant
  const restaurant = await Restaurant.create({
    name: "HappyHomes Toy Store",
    description: "Cửa hàng đồ chơi cho mọi lứa tuổi",
    address: "123 Nguyễn Trãi, Hà Nội",
    phone: "02412345678",
    email: "store@happyhomes.com",
    owner: admin._id,
    category: "Toys",
    deliveryFee: 15000,
    estimatedDeliveryTime: 30,
  });

  // Products
  const brandMap = {};
  brands.forEach((b) => (brandMap[b.name] = b._id));

  const createdFoods = [];
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const food = await Food.create({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      images: [p.image],
      category: p.category,
      brand: brandMap[p.brand],
      stock: p.stock,
      soldCount: Math.floor(Math.random() * 40),
      rating: 4 + Math.round(Math.random() * 10) / 10,
      isAvailable: true,
      isFeatured: p.isFeatured || false,
      discountPrice: p.discountPrice || null,
      restaurant: restaurant._id,
    });
    createdFoods.push(food);
  }
  console.log(`🧸 ${createdFoods.length} sản phẩm`);

  // Coupons
  await Coupon.create([
    { code: "WELCOME10", type: "percent", value: 10, minOrder: 100000, maxDiscount: 50000, description: "Giảm 10% cho đơn từ 100k" },
    { code: "GIAM50K", type: "fixed", value: 50000, minOrder: 300000, description: "Giảm 50k cho đơn từ 300k" },
    { code: "SALE2026", type: "percent", value: 20, minOrder: 200000, maxDiscount: 100000, description: "Sale 20% cho đơn từ 200k" },
  ]);
  console.log("🎟️  3 mã giảm giá");

  // Banners
  await Banner.create([
    { title: "SALE MÙA HÈ 2026", subtitle: "Giảm đến 20% toàn bộ đồ chơi", image: IMAGES.teddy, link: "/menu", position: "hero", sortOrder: 1 },
    { title: "Bộ sưu tập LEGO mới", subtitle: "Khám phá bộ LEGO City mới nhất", image: IMAGES.lego, link: "/menu?category=Lego%20%26%20L%E1%BA%AFp%20r%C3%A1p", position: "hero", sortOrder: 2 },
    { title: "Gấu bông khổng lồ", subtitle: "Size 1m - mềm như ôm mây", image: IMAGES.bear, link: "/menu?category=G%E1%BA%A5u%20b%C3%B4ng", position: "promo", sortOrder: 3 },
  ]);
  console.log("🖼️  3 banner");

  // Demo order
  const demoItems = createdFoods.slice(0, 2).map((f) => ({
    food: f._id,
    quantity: 1,
    price: f.price,
  }));
  const subtotal = demoItems.reduce((s, i) => s + i.price * i.quantity, 0);
  await Order.create({
    user: customer._id,
    restaurant: restaurant._id,
    items: demoItems,
    subtotal,
    shippingFee: 15000,
    discountAmount: 0,
    totalPrice: subtotal + 15000,
    status: "Completed",
    paymentMethod: "COD",
    paymentStatus: "Paid",
    deliveryAddress: "456 Lê Lợi, Hà Nội",
    statusHistory: [
      { status: "Pending", note: "Đơn hàng được tạo" },
      { status: "Confirmed", note: "Admin xác nhận" },
      { status: "Completed", note: "Giao hàng thành công" },
    ],
  });
  console.log("📦 1 đơn hàng demo");

  await mongoose.disconnect();
  console.log("✅ Seed hoàn tất!");
}

seed().catch((err) => {
  console.error("❌ Seed lỗi:", err);
  process.exit(1);
});
