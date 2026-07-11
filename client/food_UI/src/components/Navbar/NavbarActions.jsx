import { FaBars } from "react-icons/fa";

function NavbarActions({ onOpen }) {
  return (
    <button className="md:hidden text-2xl" onClick={onOpen}>
      <FaBars />
    </button>
  );
}
export default NavbarActions;
