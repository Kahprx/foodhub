import {
  FaCircleCheck,
  FaSpinner,
  FaTruck,
  FaCheck,
  FaCircleXmark,
  FaClock,
} from "react-icons/fa6";

const statusMeta = {
  Pending: { icon: <FaClock />, color: "bg-amber-500", ring: "ring-amber-100", label: "Chờ xác nhận" },
  Confirmed: { icon: <FaCircleCheck />, color: "bg-blue-500", ring: "ring-blue-100", label: "Đã xác nhận" },
  Preparing: { icon: <FaSpinner />, color: "bg-purple-500", ring: "ring-purple-100", label: "Đang chuẩn bị" },
  Delivering: { icon: <FaTruck />, color: "bg-indigo-500", ring: "ring-indigo-100", label: "Đang giao hàng" },
  Completed: { icon: <FaCheck />, color: "bg-green-500", ring: "ring-green-100", label: "Hoàn thành" },
  Cancelled: { icon: <FaCircleXmark />, color: "bg-red-500", ring: "ring-red-100", label: "Đã hủy" },
};

function OrderTimeline({ order }) {
  const history = order?.statusHistory || [];
  const currentStatus = order?.status;

  const events =
    history.length > 0
      ? history
      : currentStatus
        ? [{ status: currentStatus, changedAt: order.createdAt, note: "" }]
        : [];

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Lịch sử đơn hàng</h2>

      <div className="relative space-y-0">
        {events.map((entry, index) => {
          const meta = statusMeta[entry.status] || {
            icon: <FaClock />,
            color: "bg-gray-400",
            label: entry.status,
          };
          const isLast = index === events.length - 1;
          const cancelled = entry.status === "Cancelled";

          return (
            <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span className="absolute left-[19px] top-10 h-full w-0.5 bg-gray-100" />
              )}

              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md ${meta.color}`}>
                <span className="text-lg">{meta.icon}</span>
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">
                    {cancelled ? (
                      <span className="text-red-600">{meta.label}</span>
                    ) : (
                      meta.label
                    )}
                    {entry.status === currentStatus && !cancelled && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-xs font-bold text-teal">
                        hiện tại
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {entry.changedAt
                      ? new Date(entry.changedAt).toLocaleString("vi-VN")
                      : ""}
                  </p>
                </div>
                {entry.note && (
                  <p className="mt-1 text-sm text-gray-500">{entry.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTimeline;
