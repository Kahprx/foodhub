import { FaSearch } from "react-icons/fa";

function NavbarSearch() {
  return (
    <div className="hidden lg:flex items-center relative group">
      <FaSearch className="absolute left-5 text-gray-400 transition-all duration-300 group-hover:text-orange-400 group-focus-within:text-orange-500" />
      <input type="text" placeholder="Tìm món ăn ..." className="w-96 pl-12 pr-5 py-2.5 rounded-full 
      border-2 border-gray-300 bg-white/80 backdrop-blur-xl shadow-sm transition-all
      duration-500 outline-none focus:border-orange-400 focus:shadow-lg focus:shadow-orange-200/50
      focus:scale-[1.02] hover:border-orange-300 hover:shadow-lg hover:shadow-orange-200/40 hover:scale-[1.02]
      placeholder:text-gray-500
      " />
      <div className="absolute inset-0 rounded-full bg-orange-300/20 blur-xl opacity-0 transition-all duration-500 group-hover:opacity-60 group-focus-within:opacity-100"/>
    </div>
  )
}
export default NavbarSearch;
