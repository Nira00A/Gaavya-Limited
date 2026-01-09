const PlacePopup = ({place , setPlace, onClose }) => {
    const locations = [
        { name: 'Kolkata', icon: 'ঔ' },
        { name: 'Uttar Pradesh', icon: 'ऊ' },
        { name: 'Punjab', icon: 'ਆ' }
    ];

    const handleCityClick = (city) => {
        setPlace(city);

        localStorage.setItem('Delivary_location' , JSON.stringify(city))
    };

    const handleClose = () => {
        onClose(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 transition-all">
            
            {/* Main Modal Card */}
            <div className="bg-white w-full max-w-[500px] rounded-[20px] shadow-2xl relative overflow-hidden transform transition-all animate-in zoom-in-95 fade-in duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-green-600 transition-colors bg-gray-50 hover:bg-green-50 p-2 rounded-full z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Section */}
                <div className="p-8 pb-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Select Location</h2>
                    <p className="text-gray-500 font-medium mt-1">Provide your location to serve you better</p>
                </div>

                <div className="px-8 pb-10">
                    <div className="h-[1px] w-full bg-gray-100 mb-8" />
                    
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Popular Cities</h4>

                    {/* Visually Appealing Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        {locations.map((city) => (
                            <div 
                                key={city.name}
                                onClick={() => handleCityClick(city.name)}
                                className={`group flex flex-col items-center cursor-pointer`}
                            >
                                {/* Icon Container - Styled like the reference image */}
                                <div className={`w-20 h-20 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center mb-3 ${place === city.name ? 'border-green-500' : ''} group-hover:border-green-500 group-hover:bg-green-50 transition-all duration-300 shadow-sm group-active:scale-90`}>
                                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                        {city.icon}
                                    </span>
                                </div>
                                
                                {/* City Name */}
                                <span className={`text-sm font-bold text-gray-700 ${place === city.name ? 'text-green-500' : ''} group-hover:text-green-600 transition-colors text-center`}>
                                    {city.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Info Section */}
                    <div className="mt-10 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                        <p className="text-xs font-bold text-green-600">
                            *We are currently expanding to more cities soon!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlacePopup;