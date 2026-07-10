import {FaHamburger , FaShoppingCart , FaUser} from "react-icons/fa";


function Navbar(){
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaHamburger className="text-orange-500 text-2xl"/>
          <h1 className="text-orange-500 text-2xl">
            FoodHub
          </h1>
        </div>
      <div className="flex gap-8 font-medium">
        <a href="/">Home</a>
        <a href="/">Restaurant</a>
        <a href="/">Orders</a>
      </div>
      <div className="flex items-center gap-5">
        <FaShoppingCart className="text-xl cursor-pointer" />
        <FaUser className="text-xl cursor-pointer" />
      </div>
      </div>
    </nav>
  );
}
export default Navbar;