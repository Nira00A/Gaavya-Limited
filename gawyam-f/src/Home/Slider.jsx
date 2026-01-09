import { useRef, useState } from 'react';

const products = [
  { id: 1, name: 'Mixed Flower Online - 100 Gm', qty: '100', price: '49 - 75', img: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Marigold (Yellow) | Buy Online', qty: '100 gm', price: '22 - 60', img: 'https://via.placeholder.com/150' },
  { id: 3, name: 'High Protein Buffalo Milk', qty: '450ml', price: '60', img: 'https://via.placeholder.com/150' },
  { id: 4, name: 'High Protein Milk', qty: '450ml', price: '55', img: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Oat Milk | Oat Beverage', qty: '400ml', price: '52', img: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Sona Masoori Rice Online', qty: '4kg', price: '420', img: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Tomato Soup', qty: '30gm', price: '48', img: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Aloo Bhujia', qty: '120gm', price: '68', img: 'https://via.placeholder.com/150' },
];

const DragScrollSlider = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplied by 1.5 for better drag feel
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    // 1. Changed to w-full and added responsive padding
    <div className="w-full bg-white py-6 md:py-10 select-none overflow-hidden"> 
      
      {/* 2. Container: Changed max-width and removed fixed px for small screens */}
      <section className="bg-[#f1f8e9] py-8 px-4 sm:px-6 md:px-10 rounded-3xl">
        <h3 className="text-center text-gray-800 font-bold mb-8 text-lg md:text-xl">New Launches</h3>

        {/* 3. The Slider: Ensure touch-action is managed for mobile browsers */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUpOrLeave}
          onMouseUp={handleMouseUpOrLeave}
          onMouseMove={handleMouseMove}
          className={`flex flex-nowrap overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar touch-pan-x ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ 
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-[160px] xs:w-[180px] md:w-[220px] bg-white rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 pointer-events-none transition-transform hover:scale-[1.02]" 
            >
              <div className="w-full h-28 md:h-36 flex items-center justify-center mb-4">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="max-h-full object-contain" 
                />
              </div>

              <div className="mt-2">
                <h4 className="text-[12px] md:text-[14px] text-gray-800 font-bold leading-tight line-clamp-2 h-8 md:h-10 mb-1">
                  {product.name}
                </h4>
                <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-4">{product.qty}</p>
                <p className="text-[14px] md:text-[16px] font-extrabold text-gray-900">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-[#10b981] text-white w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-all shadow-lg active:scale-95">
            Available on App
          </button>
        </div>

        <style jsx='true'>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </section>
    </div>
  );
};

export default DragScrollSlider;