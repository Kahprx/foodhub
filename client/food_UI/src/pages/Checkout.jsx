import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();
  const [form , setForm] = useState ({
    name :"",
    phone : "",
    address : "",
    note :""
});
const [errors , setErrors] = useState({});
const [placingOrder, setPlacingOrder] = useState(false);
const [orderError, setOrderError] = useState("");

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
const handlePlaceOrder = async () => {
  if (!validateForm()) return;

  try {
    setPlacingOrder(true);
    setOrderError("");

    await api.post(
      "/orders",
      {
        deliveryAddress: `${form.name} - ${form.phone} - ${form.address}${
          form.note ? ` - Ghi chú: ${form.note}` : ""
        }`,
        paymentMethod: "COD",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    clearCart();
    navigate("/success");
  } catch (err) {
    setOrderError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
  } finally {
    setPlacingOrder(false);
  }
};
 const {cartItems , clearCart,} = useCart();
 const subtotal = cartItems.reduce(
  (total , item)=> total + item.price * item.quantity, 0
 );
 const shippingFee = subtotal > 0 ? 20000 : 0;

const total = subtotal + shippingFee;
  return (
    <section className="container mx-auto px-6 pt-28 lg:pt-32 pb-24">
      <h1 className="font-display text-4xl lg:text-5xl font-bold mb-10">
        Thanh toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-card ring-1 ring-black/5 p-8">

          <h2 className="font-display text-2xl font-bold mb-6">
            Thông tin giao hàng
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
              focus:ring-coral/30
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
               focus:ring-coral/30
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
               focus:ring-coral/30
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
       placeholder="Ví dụ: Gói quà tặng, giao giờ hành chính..."
      className="
        w-full
        border
        rounded-xl
        px-4
        py-3
        resize-none
        focus:outline-none
        focus:ring-2
        focus:ring-coral/30
      "
    />
  </div>

          </div>

        </div>

        {/* Right */}
        <div className="bg-white rounded-3xl shadow-card ring-1 ring-black/5 p-8 h-fit lg:sticky lg:top-28">

          <h2 className="font-display text-2xl font-bold mb-6">
            Tóm tắt đơn hàng
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

    <span className="text-coral">

      {total.toLocaleString()}đ

    </span>

  </div>

  <button
  type="button"
   onClick={handlePlaceOrder}
   disabled={placingOrder}
className="
w-full
mt-6
py-4
rounded-2xl
 bg-coral
 hover:bg-coral/90
 hover:shadow-soft
text-white
font-bold
transition
disabled:cursor-not-allowed
disabled:opacity-60
"
  >

    {placingOrder ? "Đang đặt hàng..." : "Đặt hàng"}

  </button>

  {orderError && (
    <p className="mt-3 text-center text-sm text-red-500">{orderError}</p>
  )}

</div>

        </div>

      </div>
    </section>
  );
}

export default Checkout;
