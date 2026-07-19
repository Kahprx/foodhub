import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
function Checkout() {
  const navigate = useNavigate();
  const [form , setForm] = useState ({
    name :"",
    phone : "",
    address : "",
    note :""
});
const [errors , setErrors] = useState({});

 const handleChange = (e) =>{
    const {name, value } = e.target;

    setForm ((prev) =>  ({

        ...prev,
        [name]: value,
    }));
 };
 const validateForm = () =>{
    console.log("VALIDATE")
   const newErrors = {};
   if (!form.name.trim ()){
    newErrors.name = "vui lòng nhập họ tên";
   } 
   if (!form.phone.trim ()){
    newErrors.phone ="vui lòng nhập số điện thoại";
   }
   if(!form.address.trim ()){
    newErrors.address="vui lòng nhập địa chỉ";
    
   
   }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
 };
 const handlePlaceOrder = () => {
  if (!validateForm()) return;

  clearCart();

  navigate("/success");
};  
 const {cartItems , clearCart,} = useCart();
 const subtotal = cartItems.reduce(
  (total , item)=> total + item.price * item.quantity, 0
 );
 const shippingFee = subtotal > 0 ? 20000 : 0;

const total = subtotal + shippingFee;
  return (
    <section className="container mx-auto px-6 py-28">
      <h1 className="text-5xl font-bold mb-10">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Delivery Information
          </h2>

          <div className ="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">
                Họ và tên
              </label>

              <input  
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
              "
              />
              {
                errors.name && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.name}
                  </p>
                )
              }
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Số điện thoại
              </label>

              <input type="text" name="phone" value={form.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="
               w-full
               border
               rounded-xl
               px-4
               py-3
               focus:outline-none
               focus:ring-2
               focus:ring-orange-500
              "
              />
              {
                errors.phone && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.phone}
                  </p>
                )
              }
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Địa chỉ giao hàng 
              </label>
              <textarea 
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập địa chỉ "
              className="
               w-full
               border
               rounded-xl
               px-4
               py-3
               resize-none
               focus:outline-none
               focus:ring-2
               focus:ring-orange-500
              "
              />
              {
                errors.address && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.address}
                  </p>
                )
              }
            </div>
             <div>
    <label className="block mb-2 font-semibold">
      Ghi chú
    </label>

    <textarea
      name="note"
      value={form.note}
      onChange={handleChange}
      rows="3"
      placeholder="Ví dụ: Không cay, giao sau 18h..."
      className="
        w-full
        border
        rounded-xl
        px-4
        py-3
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-orange-500
      "
    />
  </div>

          </div>

        </div>

        {/* Right */}
        <div className="bg-white rounded-3xl shadow-lg p-8 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-5">

  {
    cartItems.map((item) => (

      <div
        key={item._id}
        className="flex justify-between items-center"
      >

        <div>

          <p className="font-semibold">
            {item.name}
          </p>

          <p className="text-gray-500 text-sm">

            x{item.quantity}

          </p>

        </div>

        <span className="font-bold">

          {(item.price * item.quantity).toLocaleString()}đ

        </span>

      </div>

    ))
  }

  <hr />

  <div className="flex justify-between">

    <span>Tạm tính</span>

    <span>

      {subtotal.toLocaleString()}đ

    </span>

  </div>

  <div className="flex justify-between">

    <span>Ship</span>

    <span>

      {shippingFee.toLocaleString()}đ

    </span>

  </div>

  <hr />

  <div className="flex justify-between text-xl font-bold">

    <span>Tổng</span>

    <span className="text-orange-500">

      {total.toLocaleString()}đ

    </span>

  </div>

  <button
  type="button"
   onClick={handlePlaceOrder}
className="
w-full
mt-6
py-4
rounded-2xl
bg-orange-500
hover:bg-orange-600
text-white
font-bold
transition
"
  >

    Đặt hàng

  </button>

</div>

        </div>

      </div>
    </section>
  );
}

export default Checkout;