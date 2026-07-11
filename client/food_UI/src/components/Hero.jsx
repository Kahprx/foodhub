import Button from "./ui/Button";

function Hero() {
  return (
    <section className="bg-orange-50 py-20">

      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left */}

          <div className="md:w-1/2">

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">

              Đặt món ngon

              <span className="text-orange-500">
                {" "}chỉ trong vài phút
              </span>

            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8">

              Đặt món từ hàng trăm nhà hàng yêu thích.
              Giao nhanh, giá tốt và nhiều ưu đãi mỗi ngày.

            </p>

            <div className="mt-8 flex flex-col md:flex-row gap-4">

              <input
                type="text"
                placeholder="🔍 Tìm món ăn..."
                className="
                flex-1
                border
                rounded-xl
                px-5
                py-4
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
                "
              />

              <Button variant="primary">
                Đặt món ngay
              </Button>

            </div>

          </div>

          {/* Right */}

          <div className="md:w-1/2">

            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
              alt="Food"
              className="w-full rounded-3xl shadow-xl"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;