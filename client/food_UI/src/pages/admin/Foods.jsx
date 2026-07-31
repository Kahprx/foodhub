import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import FoodTable from "../../components/admin/FoodTable";

const initialForm = {
  name: "",
  price: "",
  category: "",
  restaurant: "",
  description: "",
  image: "",
};

const categories = ["LEGO", "Action Figures", "Dolls", "RC Cars", "Educational Toys", "Plush Toys"];

function Foods() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [restaurants, setRestaurants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [reload, setReload] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [editingFood, setEditingFood] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    api
      .get("/restaurants")
      .then((res) => setRestaurants(res.data.data || []))
      .catch(() => {});
  }, []);
useEffect(() => {
  setPage(1);
}, [keyword, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.price || Number(form.price) <= 0) next.price = "Price must be > 0";
    if (!form.category) next.category = "Toy Category is required";
    if (!form.restaurant) next.restaurant = "Brand is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    setOpen(false);
    setEditingFood(null);
    setForm(initialForm);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      const payload = {
  name: form.name.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  image: form.image.trim(),
  category: form.category,
  restaurant: form.restaurant,
};

if (editingFood) {
  await api.put(`/foods/${editingFood._id}`, payload);

  toast.success("Toy updated successfully!");
} else {
  await api.post("/foods", payload);

  toast.success("Toy created successfully!");
}

      setReload((prev) => !prev);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create toy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
    <div className="flex items-center justify-between mb-8">

  <h1 className="text-3xl font-bold">
    Toy Management
  </h1>

  <div className="flex gap-3">

    <input
        type="text"
        placeholder="Search toy..."
        className="border rounded-xl px-4 py-2 w-72"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    <select
      value = {category}
      onChange={(e) => setCategory(e.target.value)}
      className="border rounded-xl px-4 py-2"
    >
      <option value="">All Categories</option>
      {categories.map((item)=> (
        <option 
        key={item}
        value={item}
        >
          {item}

        </option>
      ))}
    </select>

    <button
      onClick={() => setOpen(true)}
      className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600"
    >
      + Add Toy
    </button>

  </div>

</div>
      <FoodTable
        reload={reload}
        keyword={keyword}
        category={category}
        page={page}
        setPage={setPage}
        onEdit={(food) => {
          setEditingFood(food);
          setForm({
            name: food.name,
            price: food.price,
            category: food.category,
            restaurant: food.restaurant?._id || food.restaurant,
            description: food.description,
            image: food.image,
          });
          setOpen(true);
        }}
      />

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">{editingFood ? "Edit Toy" : "Add Toy"}</h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${errors.name ? "border-red-500" : ""}`}
                placeholder="e.g. LEGO Star Wars"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Price (VND)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${errors.price ? "border-red-500" : ""}`}
                placeholder="e.g. 75000"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Toy Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${errors.category ? "border-red-500" : ""}`}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Restaurant */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Brand</label>
              <select
                name="restaurant"
                value={form.restaurant}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${errors.restaurant ? "border-red-500" : ""}`}
              >
                <option value="">Select Brand</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.restaurant && <p className="text-red-500 text-sm mt-1">{errors.restaurant}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="Toy description..."
              />
            </div>

            {/* Image URL */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="https://..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2 border rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingFood
                    ? "Update"
                    : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Foods;
