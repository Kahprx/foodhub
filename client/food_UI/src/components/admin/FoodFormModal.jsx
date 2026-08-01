export default function FoodFormModal({
  food,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-3xl p-8 w-[600px]">

        <h2 className="text-2xl font-bold mb-6">

          {food ? "Sửa sản phẩm" : "Tạo sản phẩm"}

        </h2>

        <div className="space-y-4">

          <input
            placeholder="Tên sản phẩm"
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="Giá"
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="Danh mục sản phẩm"
            className="w-full border rounded-xl p-3"
          />

          <input
            placeholder="URL hình ảnh"
            className="w-full border rounded-xl p-3"
          />

          <textarea
            placeholder="Mô tả"
            className="w-full border rounded-xl p-3 h-32"
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl"
          >
            Hủy
          </button>

          <button
            className="px-5 py-2 bg-blue-500 rounded-xl text-white"
          >
            Lưu
          </button>

        </div>

      </div>

    </div>
  );
}