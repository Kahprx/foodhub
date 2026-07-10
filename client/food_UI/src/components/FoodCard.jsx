import Button from "./ui/Button";
function FoodCard({
    name ,
    price,
    restaurant,
    image,
}) {
    return(
        <div
        className="
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
        hover:shadow-2xl
        transition-all
        duration-300
        "
        >

        <img src={image} alt={name} 
        className=" 
        w-full
        h-52
        obiject-cover"
        />
        <div className="p-5">
            <h2 className="text-xl font-bold">
                {name}
            </h2>
            <p className="text-gray-500 mt-2">
                {restaurant}
            </p>
            <div className="flex justify-between items-center mt-6">
                <span className="text-orange-500 font-bold text-xl">
                    {price.toLocaleString()}đ
                </span>
                <Button size="sm">
                    Đặt món
                </Button>
            </div>
        </div>
        </div>

    );
}
export default FoodCard;