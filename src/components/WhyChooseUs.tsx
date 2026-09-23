import React from 'react';
import { MapPin, UserCheck, Award, Headphones } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const items = [
    {
      icon: MapPin,
      title: 'Local Expertise',
      description: 'In-depth knowledge of local markets and neighborhoods.'
    },
    {
      icon: UserCheck,
      title: 'Personalized Service',
      description: 'Tailored solutions that fit your unique needs.'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'A track record of successful sales and happy clients.'
    },
    {
      icon: Headphones,
      title: 'Full Support',
      description: "From search to closing, we're with you all the way."
    }
  ];

  return (
    <section id="why-choose-us" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-[#2563eb] block mb-1 font-display">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08182b] tracking-tight font-display">
            We Make Real Estate Simple
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#e8f1fc] text-[#2563eb] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
