import shopMorePic from '../Assets/shopmore-pic.png';

const ShopMore = () => {
  return (
    <section className="bg-white w-full py-10 md:py-20">
      <div className="max-w-7xl mx-auto bg-green-50/50 rounded-[30px] md:rounded-[50px] border border-green-200 overflow-hidden shadow-sm">
        
        {/* Main Flex Container: Column on Mobile, Row on Desktop */}
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Content Area */}
          <div className="flex-1 p-5 md:p-16 lg:p-20 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              Pure Dairy Goodness, <br />
              <span className="text-green-600">Just a Click Away</span>
            </h2>
            
            <p className="text-gray-600 text-base md:text-lg lg:text-xl mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
              Explore our wide range of farm-fresh milk, organic ghee, and artisanal 
              dairy products delivered straight to your home.
            </p>

            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white max-[425px]:px-4 px-10 py-4 rounded-2xl font-bold text-lg max-[425px]:text-sm shadow-lg hover:shadow-green-200 transition-all active:scale-95 transform ">
              Shop All Products →
            </button>
          </div>

          {/* Image Area */}
          <div className="flex-1 w-full flex justify-center items-end p-6 md:p-0">
            <img 
              src={shopMorePic} 
              alt="Fresh Gawyam Dairy Products" 
              className="w-full max-w-[400px] md:max-w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ShopMore;