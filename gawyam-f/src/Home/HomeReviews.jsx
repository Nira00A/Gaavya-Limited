const GawyamReviews = () => {
  const stats = [
    { label: "Happy Customers", value: "10,000+", icon: "😊", color: "bg-green-50" },
    { label: "Orders Delivered", value: "1.2 Lakh+", icon: "📦", color: "bg-blue-50" },
    { label: "Trust Score", value: "4.9/5", icon: "⭐", color: "bg-orange-50" },
  ];

  // User review data (Max 3)
  const reviews = [
    {
      id: 1,
      name: "Anjali Sharma",
      location: "Kolkata",
      comment: "The milk is incredibly fresh and reminds me of the farm. The timely morning delivery is a lifesaver!",
      rating: 5
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Uttar Pradesh",
      comment: "Finally found a source I can trust. The packaging is very hygienic and the quality is consistent.",
      rating: 5
    },
    {
      id: 3,
      name: "Gurpreet Singh",
      location: "Punjab",
      comment: "Excellent service! The subscription model is very flexible and easy to manage through the app.",
      rating: 4
    }
  ];

  return (
    <section className="bg-white py-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Stat Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.color} p-6 rounded-[24px] border border-white shadow-sm flex items-center gap-5 transition-transform hover:scale-105`}
            >
              <div className="text-4xl max-[425px]:text-2xl">{stat.icon}</div>
              <div>
                <div className="text-lg max-[425px]:text-xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-[12px] max-[425px]:text-xs font-semibold text-gray-500 uppercase tracking-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="text-center mb-10">
          <h2 className="md:text-3xl text-xl font-bold text-gray-900">What Our Community Says</h2>
          <p className="text-green-600 font-medium mt-2 md:text-[15px] text-[12px]">Real experiences from our Gawyam family</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-[#f1f8e9] md:p-8 p-4 md:rounded-[32px] rounded-[24px] relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Quotation Mark Decoration */}
              <div className="absolute top-4 right-6 text-6xl text-green-200 font-serif">“</div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-orange-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic mb-6 md:text-base text-[12px]">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-green-100 pt-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-green-600 border border-green-200">
                  {review.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                  <div className="text-xs text-green-700 font-medium">{review.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GawyamReviews;