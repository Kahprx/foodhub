export default function DeleteFoodModal({
  food,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-2xl p-8 w-[420px]">

        <h2 className="text-xl font-bold">
          Delete Toy
        </h2>

        <p className="mt-5">

          Delete <b>{food?.name}</b> ?

        </p>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-red-500 rounded-xl text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}