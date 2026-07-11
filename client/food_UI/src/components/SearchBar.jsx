import { FaSearch  } from "react-icons/fa";

function SearchBar() {
    return (
        <div className="container mx-auto px-8 py-6">
            <div className="relative max-w-2xl mx-auto">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input 
                type="text" 
                placeholder="Tìm món ăn hoặc nhà hàng..."
                className="
                w-full
                py-4
                pl-14
                pr-4
                rounded-full
                border
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-orange-500
                "
                />
            </div>
        </div>
    );
}
export default SearchBar;