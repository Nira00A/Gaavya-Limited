import { useCart } from '../context/cartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, Trash } from 'react-feather';
import { useEffect , useRef, useState} from 'react';
import { useCoupon } from '../context/couponContext';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

const Cart = () => {
  const { cart, increaseQuantity , decreaseQuantity , removeItem, clearCart , totalPrice } = useCart();
  const { user } = useAuth()
  const [discountAmount, setDiscountAmount] = useState(0);

  const { checkAutoApply , couponLoading , couponOnCart} = useCoupon()
  const [address , setAddress] = useState()
  const isCheckInitial = useRef(false)

  const navigate = useNavigate()

  useEffect(() => {
    if(totalPrice <= 0 || isCheckInitial.current) return

    const applyDiscount = async () => {
      try{
        isCheckInitial.current = true
        const discountValue = await checkAutoApply(totalPrice);
        
        setDiscountAmount(discountValue);
        toast.info('Discount applied')
      } catch (error){
        isCheckInitial.current = false
        toast.error(error.message)
      }
    };

    applyDiscount();
  }, [totalPrice , isCheckInitial]);

  if (cart.length === 0) {
    return (
      <div className="py-48 flex flex-col items-center justify-center bg-white px-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-500">Your basket is empty</h2>
        <p className="text-gray-500 mb-8">Add some farm-fresh goodness to get started!</p>
        <Link to={'/product'} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold">Browse Products</Link>
      </div>
    );
  }

  const handleClear = () => {
    clearCart()
  }

  const discounted_total_price = totalPrice - discountAmount
  const formattedPrice = discounted_total_price.toFixed(2);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">
        
        {/* Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className='w-full flex justify-between'>
            <h2 className="text-2xl font-bold text-green-900 mb-6">Your Daily Selection</h2>

            <button className='flex flex-row items-center text-xl font-semibold text-red-500 mb-6' onClick={handleClear}>
              <Trash size={22}/>
            </button>
          </div>
          {cart.map((item) => (
            <div onClick={()=>navigate(`/product/${item.id}`)} key={item.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
              <img src={item.image_url} className="w-20 h-20 rounded-2xl object-cover bg-slate-50" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-neutral-500">{item.name}</h4>
                <p className="text-green-600 font-bold">₹{item.price}</p>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl">
                <button onClick={(e) => {
                  e.stopPropagation()
                  decreaseQuantity(item.id, -1)}} className="p-1 hover:text-green-600"><Minus size={16}/></button>
                <span className="font-bold w-4 text-center">{item.quantity}</span>
                <button onClick={(e) => {
                  e.stopPropagation()
                  increaseQuantity(item.id, 1)}} className="p-1 hover:text-green-600"><Plus size={16}/></button>
              </div>

              <button onClick={(e) => {
                e.stopPropagation()
                removeItem(item.id)}} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      <div >
        {/* Bill Summary */}
        <div className="bg-white p-8 rounded-2xl border border-green-50 h-fit">
          <h3 className="text-xl font-bold mb-6 text-neutral-500">Bill Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-500">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 items-center">
               <span>Discount</span>
               {couponLoading ? (
                   <span className="text-xs text-orange-500 font-bold animate-pulse">Calculating...</span>
               ) : (
                   <span className="text-green-600 font-bold">- ₹{discountAmount}</span>
               )}
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span className="text-green-600 font-bold uppercase">Free</span>
            </div>
            <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-end">
              <span className="text-lg font-bold">Total Amount</span>
              {discountAmount ? <span className="text-3xl font-bold text-green-700">₹{formattedPrice}</span>
              :
              <span className="text-3xl font-bold text-green-700">₹{totalPrice}</span>}
            </div>
          </div>
          
          <button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-100 transition-all active:scale-95">
            Proceed to Checkout <ArrowRight size={20}/>
          </button>
        </div>

        {/*Aplied Coupon */}
        <div className='w-full h-32 mt-6 bg-white p-3 rounded-xl shadow-sm'>
            <div className='w-full h-full flex items-center bg-green-50/50 rounded-lg border border-dashed border-green-300 relative overflow-hidden px-4'>
                
                {/* Decorative: Ticket Cutouts */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-green-100"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-green-100"></div>

                {/* Left Side: The Value */}
                <div className="flex flex-col items-center justify-center border-r-2 border-dotted border-green-200 pr-4 mr-4 min-w-[70px]">
                    <span className="text-2xl font-black text-green-600">
                        {couponOnCart.discount_type === 'PERCENTAGE' ? `${couponOnCart.discount_value}%` : `₹${couponOnCart.discount_value}`}
                    </span>
                    <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest">OFF</span>
                </div>

                {/* Right Side: The Info */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Applied
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-700 tracking-tight">
                        {couponOnCart.code}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                        {couponOnCart.description || "Loyalty discount applied to order"}
                    </p>
                </div>
            </div>
          </div>
</div>
      </div>
    </div>
  );
};

export default Cart;