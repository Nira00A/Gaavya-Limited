import React from 'react';
import { Heart, Truck, Users } from 'react-feather';
import farmHero from '../Assets/g1.png'; 

const About = () => {
  return (
    <div className="bg-white text-gray-900 font-sans">
      
      {/* 1. HERO SECTION: The "Why" */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={farmHero} 
            alt="Gavyam Farm" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight">
            More Than Just <span className="text-green-400">Milk.</span>
          </h1>
          <p className="text-white text-lg md:text-2xl max-w-2xl mx-auto font-medium opacity-90">
            We’re bringing the soul of the farm back to your breakfast table. No labs, no long storage—just nature, bottled.
          </p>
        </div>
      </section>

      {/* 2. THE HUMAN STORY: The "How it Started" */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-green-900 mb-6">
              It started with a simple question...
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                "Where did this milk actually come from?" We realized that most of us had lost touch with the source of our food. 
              </p>
              <p>
                Gavyam was born out of a desire to bypass the industrial machines. We spent months visiting local farmers, talking to cattle herders, and understanding the rhythm of a healthy farm.
              </p>
              <p className="font-bold text-green-700 italic">
                Our mission is simple: If we wouldn’t give it to our own children, we won’t deliver it to yours.
              </p>
            </div>
          </div>
          <div className="bg-green-100 rounded-[2rem] p-8 relative">
            <div className="bg-white p-6 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform select-none duration-500">
               <p className="text-4xl mb-4">🥛</p>
               <h3 className="text-xl font-bold mb-2">Our Promise</h3>
               <p className="text-gray-500">Every drop is tested for purity, chilled within 2 hours, and delivered fresh.</p>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
          </div>
        </div>
      </section>

      {/* 3.The Process */}
      <section className="bg-green-900 py-10 px-6 text-white rounded-[0.1rem] md:rounded-[2rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black mb-4">Our Standards</h2>
            <p className="md:text-lg text-sm text-green-200">We take our dairy very seriously. Maybe too seriously.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-green-300" />
              </div>
              <h4 className="text-xl font-bold mb-2">Zero Adulteration</h4>
              <p className="text-green-100/70 text-sm">No urea, no preservatives, no shortcuts. Just pure milk tested against 20+ parameters.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-green-300" />
              </div>
              <h4 className="text-xl font-bold mb-2">Happy Cows</h4>
              <p className="text-green-100/70 text-sm">Ethically sourced from farms where cattle are treated with respect, fed organic fodder, and live stress-free.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-green-300" />
              </div>
              <h4 className="text-xl font-bold mb-2">Morning Magic</h4>
              <p className="text-green-100/70 text-sm">Our supply chain is a race against time. From farm to your doorstep before the sun hits its peak.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-green-300" />
              </div>
              <h4 className="text-xl font-bold mb-2">Community First</h4>
              <p className="text-green-100/70 text-sm">We ensure our farmers get a fair price, empowering the local rural economy with every bottle sold.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION: The Invitation */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-8">
          Join the Gavyam Family
        </h2>
        <p className="text-gray-500 mb-10 max-w-xl mx-auto  md:text-base text-sm">
          Switch to a healthier lifestyle today. Your body (and your taste buds) will thank you.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white md:px-12 md:py-5 py-3 px-6 rounded-full md:text-xl text-sm shadow-xl transition-all transform hover:scale-110 active:scale-95">
          Start Your Subscription
        </button>
      </section>

    </div>
  );
};

export default About;