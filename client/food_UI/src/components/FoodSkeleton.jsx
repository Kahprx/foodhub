function FoodSkeleton() {
  return (
    <section className="container mx-auto px-6 py-32">

      <div className="grid lg:grid-cols-2 gap-16">

        {/* Image */}

        <div
          className="
          w-full
          h-[500px]
          rounded-3xl
          bg-gray-200
          animate-pulse
          "
        />

        {/* Info */}

        <div>

          <div className="h-12 w-2/3 bg-gray-200 rounded animate-pulse" />

          <div className="h-6 w-40 mt-6 bg-gray-200 rounded animate-pulse" />

          <div className="h-8 w-32 mt-10 bg-gray-200 rounded animate-pulse" />

          <div className="space-y-3 mt-10">

            <div className="h-4 bg-gray-200 rounded animate-pulse" />

            <div className="h-4 bg-gray-200 rounded animate-pulse" />

            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />

          </div>

          <div className="h-14 w-52 mt-12 rounded-xl bg-gray-200 animate-pulse" />

        </div>

      </div>

    </section>
  );
}

export default FoodSkeleton;