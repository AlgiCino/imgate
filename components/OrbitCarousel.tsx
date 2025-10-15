'use client';
import { useState, useEffect } from 'react';

export default function OrbitCarousel() {
  const [developers] = useState([
    { name: 'EMAAR', color: 'from-blue-500/20 to-blue-600/20' },
    { name: 'DAMAC', color: 'from-purple-500/20 to-purple-600/20' },
    { name: 'Nakheel', color: 'from-green-500/20 to-green-600/20' },
    { name: 'Sobha', color: 'from-orange-500/20 to-orange-600/20' },
  ]);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-black/80">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="heading text-center mb-12">Premium Developers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {developers.map((dev, idx) => (
            <div
              key={idx}
              className={`glass rounded-2xl p-8 text-center hover:scale-105 transition-transform bg-gradient-to-br ${dev.color}`}
            >
              <h3 className="text-2xl font-bold text-white">{dev.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
