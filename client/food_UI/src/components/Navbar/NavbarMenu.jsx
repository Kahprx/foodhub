import PillNav from "../bits/PillNav";

function NavbarMenu() {
  const menus = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/menu" },
    { name: "Cart", path: "/cart" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  return (
    <div className="hidden lg:block">
      <PillNav items={menus} />
    </div>
  );
}

export default NavbarMenu;
