import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

import g1 from '../Assets/g1.png';
import g2 from '../Assets/g2.png';

const CustomCarousel = () => {
    const slides = [
        { id: 1, asset: g1 },
        { id: 2, asset: g2 }
    ];

    return (
        <div className="w-full max-w-[1000px] mx-auto rounded-xl overflow-hidden shadow-lg">
            <Carousel
                autoPlay={true}
                infiniteLoop={true}
                interval={3000}
                showThumbs={false}      // Hides the small thumbnail images at the bottom
                showStatus={false}      // Hides the "1 of 2" text
                swipeable={true}        // Allows mobile users to swipe
                emulateTouch={true}     // Allows mouse-drag to feel like touch
                stopOnHover={true}      // Pauses autoPlay when hovering
                showArrows={true}
            >
                {slides.map((s) => (
                    <div key={s.id} className="w-full h-full object-contain">
                        <img 
                            src={s.asset} 
                            alt={`Slide ${s.id}`} 
                            className="w-full h-full"
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CustomCarousel;