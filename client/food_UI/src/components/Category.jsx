import {
  FaHamburger,
  FaPizzaSlice,
  FaIceCream,
  FaCoffee,
  FaFish,
} from "react-icons/fa";

const categories = [
  {
    icon: <FaHamburger />,
    name: "Burger",
  },
  {
    icon: <FaPizzaSlice />,
    name: "Pizza",
  },
  {
    icon: <FaFish />,
    name: "Sushi",
  },
  {
    icon: <FaCoffee />,
    name: "Coffee",
  },
  {
    icon: <FaIceCream />,
    name: "Dessert",
  },
];

function Category() {
  return (
    <section className="container mx-auto px-6 py-14">

      <h2 className="text-3xl font-bold mb-8">
        Danh mục
      </h2>

      <div
        className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-5
        gap-6
        "
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className="
            bg-white
            rounded-3xl
            shadow-md
            hover:shadow-xl
            hover:-translate-y-2
            transition-all
            duration-300
            cursor-pointer

            flex
            flex-col
            justify-center
            items-center

            aspect-square
            "
          >
            <div className="text-5xl text-orange-500">
              {item.icon}
            </div>

            <p className="mt-4 text-lg font-semibold">
              {item.name}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Category;