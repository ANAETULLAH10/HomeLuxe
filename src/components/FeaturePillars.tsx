import React from 'react';
import { Home, Users, ShieldCheck, Tag } from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const pillars = [
    {
      icon: Home,
      title: 'Find The Perfect Home',
      description: 'Browse thousands of verified listings that match your needs.'
    },
    {
      icon: Users,
      title: 'Expert Agents',
      description: 'Work with experienced agents who guide you at every step.'
    },
    {
      icon: ShieldCheck,
      title: 'Trusted & Secure',
      description: 'Transparent process and secure property transactions.'
    },
    {
      icon: Tag,
      title: 'Best Deals',
      description: 'Get the best value with exclusive property deals.'
    }
  ];

  return (
    <section className="bg-white py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-2 rounded-2xl hover:bg-slate-50/80 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#08182b] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 leading-snug font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
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
