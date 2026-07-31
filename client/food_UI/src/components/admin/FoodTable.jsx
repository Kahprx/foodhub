import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function FoodTable({
  reload,
  keyword,
  category,
  page,
  setPage,
  onEdit
}) {
  const [foods, setFoods] = useState([]);
  const [totalPages,setTotalPages]= useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods",{
        params:{
          keyword,
          category,
          page,
          limit: 5,
        },
      });
      setFoods(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this toy?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/foods/${id}`);

    toast.success("Toy deleted successfully!");

    fetchFoods();
  } catch (err) {
    console.log(err.response);
    toast.error(err.response?.data?.message || "Delete failed");
  }
};

  useEffect(() => {
    fetchFoods();
  }, [reload,keyword,category,page]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Price</th>
            <th className="p-4">Category</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {foods.map((food) => (
            <tr key={food._id} className="border-t">
              <td className="p-4">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </td>

              <td className="p-4 font-semibold">
                {food.name}
              </td>

              <td className="p-4">
                {food.price?.toLocaleString()}đ
              </td>

              <td className="p-4">
                {food.category}
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600">
                  Active
                </span>
              </td>

              <td className="p-4">
                <button 
                onClick={() => onEdit(food)}
                className="text-blue-500 mr-4">
                  Edit
                </button>

                <button 
                onClick={() => handleDelete(food._id)}
                className="text-red-500 hover:text-red-700"
                >
                   Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end items-center gap-3 p-4 border-t">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
        >
          Next
        </button>
      </div>
    </div>
    
  );
}

export default FoodTable;