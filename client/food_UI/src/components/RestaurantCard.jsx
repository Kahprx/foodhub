import { FaStar, FaMapMarkerAlt, FaMotorcycle } from "react-icons/fa";

function RestaurantCard({
  name,
  image,
  address,
  rating,
  deliveryTime,
}) {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      overflow-hidden
      shadow-md
      hover:shadow-xl
      hover:-translate-y-2
      transition-all
      duration-300
      "
    >
      {/* Banner */}

      <img
        src={image}
        alt={name}
        className="w-full h-52 object-cover"
      />

      {/* Content */}

      <div className="p-5">

        <h2 className="text-xl font-bold">
          {name}
        </h2>

        <div className="flex items-center gap-4 mt-3 text-gray-600">

          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {rating}
          </div>

          <span>
            ⏰ {deliveryTime}
          </span>

        </div>

        <div className="flex items-center gap-2 mt-3 text-gray-500">

          <FaMapMarkerAlt />

          <span>{address}</span>

        </div>

        <div className="flex items-center gap-2 mt-3 text-orange-500">

          <FaMotorcycle />

          <span>Miễn phí giao hàng</span>

        </div>

      </div>

    </div>
  );
}

export default RestaurantCard;