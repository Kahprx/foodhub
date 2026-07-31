import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { FaFileExcel, FaFilePdf, FaChartLine } from "react-icons/fa";

function Reports() {
  const [days, setDays] = useState(30);
  const [downloading, setDownloading] = useState(null);

  const download = async (url, filename, id) => {
    try {
      setDownloading(id);
      const res = await api.get(url, {
        responseType: "blob",
        params: url.includes("revenue") ? { days } : {},
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Đã tải báo cáo.");
    } catch {
      toast.error("Tải báo cáo thất bại.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Báo cáo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xuất báo cáo doanh thu và tổng quan hoạt động.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md">
        <label className="font-semibold text-gray-600">Số ngày gần nhất:</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-xl border px-4 py-2"
        >
          <option value={7}>7 ngày</option>
          <option value={30}>30 ngày</option>
          <option value={90}>90 ngày</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <FaChartLine className="text-2xl text-coral" />
            <h2 className="text-xl font-bold">Báo cáo doanh thu</h2>
          </div>
          <p className="mb-6 text-gray-500">
            Thống kê doanh thu theo ngày của các đơn hàng hoàn thành trong {days} ngày gần nhất.
          </p>
          <button
            onClick={() =>
              download("/reports/revenue/excel", `revenue-report-${Date.now()}.xlsx`, "revenue")
            }
            disabled={downloading === "revenue"}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-40"
          >
            <FaFileExcel /> {downloading === "revenue" ? "Đang tải..." : "Xuất Excel"}
          </button>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center gap-3">
            <FaFilePdf className="text-2xl text-red-500" />
            <h2 className="text-xl font-bold">Báo cáo tổng quan</h2>
          </div>
          <p className="mb-6 text-gray-500">
            Tổng đơn hàng, doanh thu, trạng thái đơn, người dùng và sản phẩm dạng PDF.
          </p>
          <button
            onClick={() =>
              download("/reports/orders/pdf", `orders-report-${Date.now()}.pdf`, "orders")
            }
            disabled={downloading === "orders"}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-40"
          >
            <FaFilePdf /> {downloading === "orders" ? "Đang tải..." : "Xuất PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
