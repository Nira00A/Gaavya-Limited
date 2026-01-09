const categories = [
  { id: 1, name: 'Fresh Milk', icon: '🥛' },
  { id: 2, name: 'Organic Ghee', icon: '🥛' },
  { id: 3, name: 'Organic Ghee', icon: '🥛' },
  { id: 4, name: 'Organic Ghee', icon: '🥛' },
  { id: 5, name: 'Organic Ghee', icon: '🥛' },
  { id: 6, name: 'Organic Ghee', icon: '🥛' },
];

const ExploreCategories = () => {
  return (
    <section className="bg-white py-12 px-6">
      <div className="">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-lg font-bold text-green-800">Explore Categories</h2>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Image Placeholder Circle */}
              <div className="w-24 h-24 md:w-22 md:h-22 rounded-full bg-white border-2 border-green-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-green-500 transition-all duration-300 mb-4 overflow-hidden">
                {/* This is the placeholder for your actual image */}
                <div className="w-full h-full bg-green-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                   {category.icon}
                </div>
              </div>

              {/* Category Name */}
              <span className="text-gray-700 font-medium group-hover:text-green-600 transition-colors text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;