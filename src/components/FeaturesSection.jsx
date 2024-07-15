import React from 'react';
import Image from 'next/image';

const FeaturesSection = () => {
  
  const features = [
    { icon: '🕒', title: 'Real-Time Updates', description: 'Stay informed with instant updates on the latest news and trends.' },
    { icon: '📊', title: 'Customizable Dashboards' },
    { icon: '🧠', title: 'AI-Powered Analytics' },
    { icon: '🔗', title: 'Multi-Platform Integration' },
  ];

  return (
    <div className="mt-20 text-white">
        <hr className="relative border-0 border-t border-solid border-[#B3B3B380] w-1568 h-0 m-0 p-0">
        
        </hr>
      <div className="flex justify-between items-center mb-10 mt-10 ">
        
        
        <Image 
                src="/images/proofsection.svg" 
                width={1700}
                height={1500}
                
                alt="social proof section"
                className="rounded-lg"
            />
        
        
      </div>

      <hr className="relative border-0 border-t border-solid border-[#B3B3B380] w-1568 h-0 m-0 p-0 mb-10">
        
        </hr>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 relative">
          Follow all your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">favorite news</span>
        </h2>
        <h2 className="text-4xl font-bold">in one place</h2>
      </div>

      <div className="text-[#898989] flex space-x-8">
        <div className="w-1/2 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className={`p-4 rounded-lg ${index === 0 ? 'bg-opacity-50' : 'bg-opacity-30'}`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              {index === 0 && (
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
        <div className="w-1/2">
          <Image 
            src="/images/fevritwebsites.png" 
            width={500} 
            height={300} 
            alt="News Feed Interface"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;