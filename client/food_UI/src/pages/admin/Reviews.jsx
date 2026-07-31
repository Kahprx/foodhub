import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // "", "pending", "approved", "hidden"
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status === "pending") params.set("status", "pending");
      else if (status === "approved") params.set("isApproved", "true");
      else if (status === "hidden") params.set("isApproved", "false");
      if (rating) params.set("rating", rating);
      params.set("page", page);
      params.set("limit", 10);

      const res = await api.get(`/reviews/all?${params.toString()}`);
      setReviews(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setPendingCount(res.data.pendingCount || 0);
    } catch {
      toast.error("Không tải được đánh giá");
    } finally {
      setLoading(false);
    }
  }, [status, rating, page]);

  useEffect(() => {
    setPage(1);
  }, [status, rating]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (id, isApproved) => {
    try {
      await api.patch(`/reviews/${id}/approve`, { isApproved });
      toast.success(isApproved ? "Đã duyệt đánh giá" : "Đã ẩn đánh giá");
      fetchReviews();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      await api.delete(`/reviews/${id}/admin`);
      toast.success("Đã xóa đánh giá");
      fetchReviews();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const renderStars = (ratingValue) => (
    <span className="text-amber-400">
      {"★".repeat(ratingValue)}
      <span className="text-gray-300">{"★".repeat(5 - ratingValue)}</span>
    </span>
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Đánh giá</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} đánh giá
            {pendingCount > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-600">⚠️ {pendingCount} chờ duyệt</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="hidden">Đã ẩn</option>
          </select>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            <option value="">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Người đánh giá</th>
              <th className="p-4 text-left">Sản phẩm</th>
              <th className="p-4 text-left">Nội dung</th>
              <th className="p-4 text-center">Đánh giá</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Ngày</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">Đang tải...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">Không có đánh giá.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="border-t align-top">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.user?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.user?.fullName || "?")}
                        alt=""
                        className="h-9 w-9 rounded-full bg-gray-100 object-cover"
                      />
                      <div>
                        <p className="font-medium">{review.user?.fullName || "Ẩn danh"}</p>
                        <p className="text-xs text-gray-400">{review.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {review.food?.image && (
                        <img src={review.food.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
                      )}
                      <span className="max-w-[150px] truncate text-sm">{review.food?.name || "Đã xóa"}</span>
                    </div>
                  </td>
                  <td className="max-w-xs p-4">
                    <p className="text-sm text-gray-600">{review.comment || "—"}</p>
                    {review.images?.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {review.images.slice(0, 3).map((img, idx) => (
                          <img key={idx} src={img} alt="" className="h-8 w-8 rounded object-cover" />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">{renderStars(review.rating)}</td>
                  <td className="p-4 text-center">
                    {review.isApproved ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600">Đã duyệt</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-600">Chờ duyệt</span>
                    )}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleApprove(review._id, !review.isApproved)}
                      className="mr-3 font-semibold text-green-600 hover:underline"
                    >
                      {review.isApproved ? "Ẩn" : "Duyệt"}
                    </button>
                    <button onClick={() => handleDelete(review._id)} className="font-semibold text-red-500 hover:underline">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-end gap-3 border-t p-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50 hover:bg-gray-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-500">Trang {page}/{totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50 hover:bg-gray-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reviews;
