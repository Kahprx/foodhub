import Hero from "../components/hero";
import FoodCard from "../components/FoodCard";
function Home() {

 
  return (
    <>
      <Hero />
      <section className="container mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">
          Món ăn nổi bật
        </h2>
        <div className="grid grid-cols03 gap-8">
          <FoodCard
          name="burrger Gà"
          restaurant="KFC QUẬN 1"
          price={95000}
          image="https://img.mservice.com.vn/common/u/2e02fb5fe4f64fb55bc713540643c6f8eae702d101cea8c59afc49cfc505fc37/50144ac0-1933-42a6-af3c-bc642fb6120eyqbv9hjr.jpeg"
          />
          <FoodCard 
          name  ="Pizaa hải sản"
          restaurant="Pizza HUT"
          price={100000}
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6DeDHi-8wKSsNtSyI4Z-e7wdkWdU4q-fCfX5k6_IrNw&s"
          />
          

        </div>
      </section>
    </>
  );
}

export default Home;