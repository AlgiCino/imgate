'use client';
import { Suspense } from 'react';
import ComparisonTool from '@/components/ComparisonTool';
import Header from '@/components/Header';

export default function ComparePage() {
  return (
    <main className="relative">
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
            <p className="text-white/60">Loading comparison tool...</p>
          </div>
        </div>
      }>
        <ComparisonTool />
      </Suspense>
    </main>
  );
}
