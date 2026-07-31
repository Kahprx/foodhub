import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [reload, setReload] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/users");

      setUsers(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Cannot load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reload]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/auth/users/${id}`);

      toast.success("User deleted");

      setReload((prev) => !prev);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Delete failed"
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (user.fullName || "").toLowerCase().includes(keyword.toLowerCase()) ||
      user.email?.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <input
          type="text"
          placeholder="Search user..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded-xl px-4 py-2 w-72"
        />

      </div>

      <div className="overflow-x-auto bg-white rounded-xl border">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Created
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-8"
                >
                  Loading...
                </td>

              </tr>

            ) : filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-8"
                >
                  No users found
                </td>

              </tr>

            ) : (

              filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {user.fullName}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Users;