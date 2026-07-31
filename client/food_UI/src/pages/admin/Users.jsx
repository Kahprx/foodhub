import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const roleColors = {
  admin: "bg-red-100 text-red-600",
  customer: "bg-green-100 text-green-600",
  restaurant: "bg-blue-100 text-blue-600",
};

function Users() {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword.trim()) params.set("keyword", keyword.trim());
      if (roleFilter) params.set("role", roleFilter);
      params.set("page", page);
      params.set("limit", 10);

      const res = await api.get(`/auth/users?${params.toString()}`);
      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Không tải được người dùng");
    } finally {
      setLoading(false);
    }
  }, [keyword, roleFilter, page]);

  const fetchDeleted = async () => {
    try {
      const res = await api.get("/auth/users/deleted");
      setDeletedUsers(res.data.data || []);
    } catch {
      setDeletedUsers([]);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  useEffect(() => {
    if (showDeleted) fetchDeleted();
  }, [showDeleted]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa (khóa) người dùng này?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/auth/users/${id}`);
      toast.success("Đã xóa người dùng");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.put(`/auth/users/${id}/restore`);
      toast.success("Đã khôi phục người dùng");
      fetchDeleted();
      fetchUsers();
    } catch (err) {
      toast.error("Khôi phục thất bại");
    }
  };

  const handleChangeRole = async (id, role) => {
    try {
      await api.patch(`/auth/users/${id}/role`, { role });
      toast.success("Đã cập nhật vai trò");
      fetchUsers();
    } catch (err) {
      toast.error("Cập nhật vai trò thất bại");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500">{total} người dùng</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Tìm tên, email..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="w-64 rounded-xl border px-4 py-2"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border px-4 py-2"
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="restaurant">Restaurant</option>
          </select>
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`rounded-xl px-4 py-2 font-semibold transition ${showDeleted ? "bg-amber-500 text-white" : "border"}`}
          >
            🗑️ Người đã xóa
          </button>
        </div>
      </div>

      {showDeleted ? (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr className="text-left">
                <th className="p-4">Tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Ngày xóa</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    Không có người dùng bị xóa.
                  </td>
                </tr>
              ) : (
                deletedUsers.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-4 font-medium">{user.fullName}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{new Date(user.updatedAt).toLocaleDateString("vi-VN")}</td>
                    <td className="p-4">
                      <button onClick={() => handleRestore(user._id)} className="font-semibold text-green-600 hover:underline">
                        ♻️ Khôi phục
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Người dùng</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Vai trò</th>
                <th className="p-4 text-left">SĐT</th>
                <th className="p-4 text-left">Ngày tạo</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">Đang tải...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">Không có người dùng.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName || "?")}
                          alt=""
                          className="h-10 w-10 rounded-full bg-gray-100 object-cover"
                        />
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${roleColors[user.role]}`}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                        <option value="restaurant">restaurant</option>
                      </select>
                    </td>
                    <td className="p-4">{user.phone || "—"}</td>
                    <td className="p-4">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(user._id)} className="font-semibold text-red-500 hover:text-red-700">
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
      )}
    </div>
  );
}

export default Users;
