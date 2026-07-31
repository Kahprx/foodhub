import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function FoodTable({
  reload,
  keyword,
  category,
  page,
  setPage,
  onEdit,
  lowStockOnly,
}) {
  const [foods, setFoods] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await api.get("/foods/admin", {
        params: {
          keyword,
          category,
          page,
          limit: 10,
          lowStock: lowStockOnly,
        },
      });
      setFoods(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
      setLowStockCount(res.data.lowStockCount || 0);
      setOutOfStockCount(res.data.outOfStockCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/foods/${id}`);
      toast.success("Đã xóa sản phẩm!");
      fetchFoods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/foods/${id}/duplicate`);
      toast.success("Đã nhân bản sản phẩm!");
      fetchFoods();
    } catch (err) {
      toast.error(err.response?.data?.message || "Nhân bản thất bại");
    }
  };

  const handleToggleAvailable = async (food) => {
    try {
      await api.put(`/foods/${food._id}`, { isAvailable: !food.isAvailable });
      toast.success(food.isAvailable ? "Đã ẩn sản phẩm" : "Đã hiện sản phẩm");
      fetchFoods();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [reload, keyword, category, page, lowStockOnly]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          Tổng: {total} sản phẩm
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
          Sắp hết (≤10): {lowStockCount}
        </span>
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          Hết hàng: {outOfStockCount}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4">Ảnh</th>
              <th className="p-4">Tên</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Tồn kho</th>
              <th className="p-4">Đã bán</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">Đang tải...</td>
              </tr>
            ) : foods.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">Không có sản phẩm.</td>
              </tr>
            ) : (
              foods.map((food) => (
                <tr key={food._id} className="border-t">
                  <td className="p-4">
                    <img
                      src={food.image || food.images?.[0] || "https://placehold.co/100x100?text=Toy"}
                      alt={food.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{food.name}</p>
                    {food.brand?.name && (
                      <p className="text-xs text-gray-400">{food.brand.name}</p>
                    )}
                    {food.isFeatured && (
                      <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-600">
                        ⭐ Nổi bật
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{food.price?.toLocaleString("vi-VN")}đ</p>
                    {food.discountPrice && (
                      <p className="text-xs text-green-600">
                        KM: {food.discountPrice.toLocaleString("vi-VN")}đ
                      </p>
                    )}
                  </td>
                  <td className="p-4">{food.category}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        food.stock === 0
                          ? "bg-red-100 text-red-600"
                          : food.stock <= 10
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {food.stock}
                    </span>
                  </td>
                  <td className="p-4">{food.soldCount || 0}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        food.isAvailable ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {food.isAvailable ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5 text-sm">
                      <button onClick={() => onEdit(food)} className="text-left text-blue-500 hover:underline">
                        ✏️ Sửa
                      </button>
                      <button onClick={() => handleDuplicate(food._id)} className="text-left text-indigo-500 hover:underline">
                        📋 Nhân bản
                      </button>
                      <button onClick={() => handleToggleAvailable(food)} className="text-left text-amber-500 hover:underline">
                        {food.isAvailable ? "🙈 Ẩn" : "👁️ Hiện"}
                      </button>
                      <button onClick={() => handleDelete(food._id)} className="text-left text-red-500 hover:underline">
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && foods.length > 0 && (
          <div className="flex items-center justify-end gap-3 border-t p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-4 py-2 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-500">
              Trang {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-4 py-2 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodTable;
