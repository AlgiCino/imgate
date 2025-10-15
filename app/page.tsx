'use client';
import Header from '@/components/Header';
import HeroVideo from '@/components/HeroVideo';
import InteractiveMap from '@/components/InteractiveMap';
import OrbitCarousel from '@/components/OrbitCarousel';
import ProjectsGrid from '@/components/ProjectsGrid';

export default function Page() {
  // 🔹 API Key الخاص بإعمار (يجب أن يُخزن في .env)
  // المعالجة الفعلية تُدار في /api/emaar/sales/route.ts

  // 🧩 دالة لإرسال المبيعات اليومية أو الشهرية إلى API داخلي
  const sendSales = async (type: 'daily' | 'monthly') => {
    try {
      const response = await fetch('/api/emaar/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });

      const data = await response.text();
      console.log(`${type === 'daily' ? 'Daily' : 'Monthly'} Sales Response:\n${data}`);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  return (
    <main className="relative">
      <Header />
      <HeroVideo />
      <OrbitCarousel />
      <ProjectsGrid />
      <InteractiveMap />
      <section id="contact" className="py-20 bg-black/80 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="heading mb-6">e-Tenant API Integration</h3>
          <p className="text-white/70 mb-10">
            Click below to push test sales data directly to Emaar API (DEV environment).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => sendSales('daily')} className="btn-gold">
              Push Daily Sales
            </button>
            <button onClick={() => sendSales('monthly')} className="btn-ghost">
              Push Monthly Sales
            </button>
          </div>
        </div>
      </section>
      <footer className="py-10 bg-black/70 border-t border-white/10 text-center text-white/60">
        © 2025 Imperium Gate. All rights reserved.
      </footer>
    </main>
  );
}
