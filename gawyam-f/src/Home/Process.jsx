const GawyamProcess = () => {
  const features = [
    {
      title: "Authenticated Sourcing",
      desc: "Sourced from authenticated, certified dairy farms."
    },
    {
      title: "Hygienic Packaging",
      desc: "Hygienically processed & packaged for maximum purity."
    },
    {
      title: "Timely Delivery",
      desc: "Timely morning delivery, fresh to your doorstep."
    },
    {
      title: "Flexible Subscriptions",
      desc: "Flexible subscriptions to suit your family's needs."
    }
  ];

  return (
    <div className="bg-white py-6">
      <h2 className="text-gray-800 font-bold mb-8 max-[425px]:text-sm md:text-xl">
          How we make it work for you
      </h2>
      <section className="bg-[#f1f8e9] max-w-[1400px] mx-auto rounded-[40px] overflow-hidden">
        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] shadow-sm flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side: Large Branding Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#10b981] rounded-[30px] flex items-center justify-center shadow-lg relative">
              {/* White Placeholder for Logo */}
              <div className="w-16 h-16 bg-white/20 rounded-xl border-2 border-dashed border-white/50 flex items-center justify-center">
                <span className="text-white text-xs font-bold">LOGO</span>
              </div>
              {/* Small "Verified" badge placeholder */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-green-100">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Middle Section: Text Content */}
          <div className="flex-1 lg:border-r border-dashed border-gray-200 lg:pr-12">
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-5 leading-tight">
              Fresh, Pure, and Timely: <br />
              <span className="text-[#10b981]">From Farm to Doorstep</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-[12px] md:text-[16px]">
              We partner with authenticated, certified dairy farms to source only the highest quality milk. 
              Our milk is collected under strict hygienic conditions, processed with minimal human contact, 
              and packaged in sterilized, eco-friendly containers to seal in freshness and nutrients. 
              We ensure a temperature-controlled supply chain for prompt, reliable delivery, 
              bringing the purity of the farm directly to your home every morning.
            </p>
          </div>

          {/* Right Side: Feature List with White Placeholders */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex flex-col gap-8">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-5 group">
                  {/* White Circle Placeholder for Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-green-50 flex-shrink-0 flex items-center justify-center shadow-sm group-hover:border-[#10b981] transition-colors duration-300">
                    <div className="w-6 h-6 rounded-md bg-green-50"></div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 text-[14px] md:text-[15px]">
                      {item.title}
                    </h4>
                    <p className="md:text-sm text-[12px] text-gray-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default GawyamProcess;