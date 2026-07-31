const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "HappyHomes API",
    version: "1.0.0",
    description: "API cho cửa hàng đồ chơi HappyHomes - FoodHub",
  },
  servers: [
    { url: "/api/v1", description: "Local server" },
  ],
  tags: [
    { name: "Auth", description: "Xác thực người dùng" },
    { name: "Products", description: "Quản lý sản phẩm" },
    { name: "Orders", description: "Quản lý đơn hàng" },
    { name: "Admin", description: "Quản trị hệ thống" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["customer", "admin", "restaurant"] },
          avatar: { type: "string" },
        },
      },
      Food: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image: { type: "string" },
          images: { type: "array", items: { type: "string" } },
          category: { type: "string" },
          brand: { type: "string", description: "Brand ObjectId" },
          stock: { type: "number" },
          discountPrice: { type: "number" },
          isAvailable: { type: "boolean" },
        },
      },
      Order: {
        type: "object",
        properties: {
          user: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                food: { type: "string" },
                quantity: { type: "number" },
                price: { type: "number" },
              },
            },
          },
          totalPrice: { type: "number" },
          status: { type: "string" },
          paymentMethod: { type: "string", enum: ["COD", "Momo", "Banking"] },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Đăng ký tài khoản",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password"],
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Đăng ký thành công" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Đăng nhập",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Đăng nhập thành công, trả về token" } },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Làm mới access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: { refreshToken: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Trả về accessToken + refreshToken mới" } },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Gửi email đặt lại mật khẩu",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Đã gửi email" } },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Đặt lại mật khẩu với token",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                  token: { type: "string" },
                  newPassword: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Đặt lại thành công" } },
      },
    },
    "/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Lấy thông tin cá nhân",
        responses: { 200: { description: "Thông tin người dùng" } },
      },
    },
    "/foods": {
      get: {
        tags: ["Products"],
        summary: "Lấy danh sách sản phẩm (có phân trang, lọc, sắp xếp)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "keyword", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["price", "-price", "name", "rating", "sold", "-name"] } },
        ],
        responses: { 200: { description: "Danh sách sản phẩm" } },
      },
      post: {
        tags: ["Products"],
        summary: "Tạo sản phẩm (admin)",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Food" },
            },
          },
        },
        responses: { 201: { description: "Đã tạo" } },
      },
    },
    "/foods/{id}": {
      get: {
        tags: ["Products"],
        summary: "Chi tiết sản phẩm",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Chi tiết" } },
      },
      put: {
        tags: ["Products"],
        summary: "Cập nhật sản phẩm (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/Food" } } },
        },
        responses: { 200: { description: "Đã cập nhật" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Xóa sản phẩm (admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Đã xóa" } },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "Đơn hàng của tôi",
        responses: { 200: { description: "Danh sách đơn" } },
      },
      post: {
        tags: ["Orders"],
        summary: "Tạo đơn hàng từ giỏ hàng",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["deliveryAddress", "paymentMethod"],
                properties: {
                  deliveryAddress: { type: "string" },
                  paymentMethod: { type: "string", enum: ["COD", "Momo", "Banking"] },
                  couponCode: { type: "string" },
                  shippingFee: { type: "number" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Đặt hàng thành công" } },
      },
    },
    "/orders/all": {
      get: {
        tags: ["Orders"],
        summary: "Tất cả đơn hàng (admin, có lọc/phân trang)",
        responses: { 200: { description: "Danh sách đơn" } },
      },
    },
    "/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Thống kê tổng quan (admin)",
        responses: { 200: { description: "Stats" } },
      },
    },
    "/dashboard/top-selling": {
      get: {
        tags: ["Admin"],
        summary: "Sản phẩm bán chạy (admin)",
        responses: { 200: { description: "Danh sách" } },
      },
    },
    "/dashboard/top-customers": {
      get: {
        tags: ["Admin"],
        summary: "Khách hàng chi tiêu nhiều nhất (admin)",
        responses: { 200: { description: "Danh sách" } },
      },
    },
    "/categories": {
      get: {
        tags: ["Products"],
        summary: "Danh sách danh mục",
        responses: { 200: { description: "Danh sách" } },
      },
    },
    "/brands": {
      get: {
        tags: ["Products"],
        summary: "Danh sách thương hiệu",
        responses: { 200: { description: "Danh sách" } },
      },
    },
    "/coupons": {
      get: {
        tags: ["Products"],
        summary: "Danh sách mã giảm giá",
        responses: { 200: { description: "Danh sách" } },
      },
    },
    "/banners": {
      get: {
        tags: ["Products"],
        summary: "Danh sách banner",
        responses: { 200: { description: "Danh sách" } },
      },
    },
    "/banners/active": {
      get: {
        tags: ["Products"],
        summary: "Banner đang hoạt động",
        responses: { 200: { description: "Danh sách" } },
      },
    },
  },
};

export default swaggerSpec;
