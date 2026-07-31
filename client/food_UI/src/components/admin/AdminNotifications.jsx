import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import api from "../../services/api";

function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/auth/notifications", { params: { limit: 8 } });
      setItems(res.data.data || []);
      setUnread(res.data.unread || 0);
    } catch {
      // bell stays empty when the call fails
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch("/auth/notifications/read-all");
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          if (!open) fetchNotifications();
        }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-cream text-lg text-ink transition hover:text-coral"
        aria-label="Thông báo"
      >
        <FaBell />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-black/5 bg-sunny/20 px-5 py-3">
            <h3 className="font-bold">Thông báo</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-coral hover:underline">
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">Chưa có thông báo</p>
            ) : (
              items.map((notification) => {
                const inner = (
                  <div className={`flex items-start gap-3 px-5 py-3 transition ${notification.isRead ? "" : "bg-teal/5"}`}>
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-gray-200" : "bg-coral"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{notification.title}</p>
                      {notification.message && <p className="mt-0.5 text-xs text-gray-500">{notification.message}</p>}
                      <p className="mt-1 text-[10px] text-gray-400">
                        {new Date(notification.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                );
                return notification.link ? (
                  <Link
                    key={notification._id}
                    to={notification.link}
                    onClick={() => setOpen(false)}
                    className="block border-t border-black/5 hover:bg-gray-50"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={notification._id} className="border-t border-black/5">
                    {inner}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;
