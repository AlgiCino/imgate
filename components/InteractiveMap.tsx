'use client';
import { useEffect } from 'react';

export default function InteractiveMap() {
  useEffect(() => {
    // Placeholder for map initialization
  }, []);

  return (
    <section id="map" className="py-20 bg-black/80 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="heading text-center mb-12">Explore Dubai Properties</h2>
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-white/70 mb-4">Interactive map coming soon</p>
          <div className="h-96 bg-white/5 rounded-lg flex items-center justify-center">
            <p className="text-white/50">Map View</p>
          </div>
        </div>
      </div>
    </section>
  );
}
