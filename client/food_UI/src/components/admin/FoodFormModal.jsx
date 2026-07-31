export default function FoodFormModal({
  food,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-2xl p-8 w-[600px]">

        <h2 className="text-2xl font-bold mb-6">

          {food ? "Edit Toy" : "Create Toy"}

        </h2>

        <div className="space-y-4">

          <input
            placeholder="Toy name"
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="Price"
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="Toy Category"
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="Image URL"
            className="w-full border rounded-xl p-3"
          />

          <textarea
            placeholder="Description"
            className="w-full border rounded-xl p-3 h-32"
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-blue-500 rounded-xl text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}