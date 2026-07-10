import Button from "./ui/Button";

function Hero(){
    return (
        <section className="bg-orange-50 py-20">
            <div className="container mx-auto px-8">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-bold leading-tight">
                        Đặt món ngay
                        <span className="text-orange-500">
                            {" "} chỉ trong vài phút
                        </span>
                    </h1>
                    <p>
                        <div className="mt-8 flex gap-4">
                            <input 
                            type="text"
                            placeholder="🔍 Tìm món ăn"
                            className="
                            flex-1
                            border
                            rounded-xl
                            px-5
                            py-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-orange-400
                            "
                             />
                             <Button variant="primary">
                                Đặt món ngay
                             </Button>
                        </div>
                    </p>
                </div>
            </div>

        </section>
    );
}
export default Hero;