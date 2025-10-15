'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = async () => {
      try {
        await v.play();
      } catch {
        setVideoError(true);
      }
    };
    play();
  }, []);

  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center">
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source
            src="https://cdn.prod.website-files.com/67f8ad4886c292f39d3f80d8/67f9071e01d375d3a0b7be3d_Atelis_microsite_video_20sec%20v2-transcode.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <img
          src="/fallback-hero.jpg"
          alt="Luxury Dubai skyline"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/60" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="chip mb-4 inline-flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Luxury Redefined
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.95] text-white"
        >
          Dubai Reimagined
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25 }}
          className="mt-3 md:mt-4 text-2xl sm:text-4xl md:text-5xl accent-alt font-semibold"
        >
          Luxury • Architecture • Legacy
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45 }}
          className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-white/80"
        >
          An ultra-premium portfolio of beachfront towers, golf communities, and skyline residences across Dubai.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.65 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a href="#projects" className="btn-alt">
            Explore Properties
          </a>
          <a href="#contact" className="btn-ghost">
            Book a Private Tour
          </a>
        </motion.div>
      </div>
    </section>
  );
}
