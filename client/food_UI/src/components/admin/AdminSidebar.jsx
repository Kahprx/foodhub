import { NavLink } from "react-router-dom";

const menu = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/foods", label: "Toys" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

function AdminSidebar() {
  return (
    <aside className="min-h-screen w-64 bg-gradient-to-b from-slate-900 to-blue-950 p-6 text-white">
      <h2 className="mb-10 text-2xl font-bold">🧸 HAPPYHOMES Admin</h2>

      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 font-bold shadow-lg"
                  : "hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/"
        className="mt-10 block rounded-xl px-4 py-3 text-gray-400 transition hover:bg-white/10"
      >
        ← Logout
      </NavLink>
    </aside>
  );
}

export default AdminSidebar;
