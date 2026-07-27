import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Calendar, Gift, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Sparkles,
      title: 'Welcome to Reveal Clinic',
      subtitle: 'Premium skin, laser & aesthetic care tailored to your unique elegance.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
      badge: 'Luxury Medical Care'
    },
    {
      icon: Calendar,
      title: 'Instant Booking & Digital Check-In',
      subtitle: 'Choose top board-certified dermatologists, select time slots, and skip waiting lines with QR check-in.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
      badge: 'Seamless Convenience'
    },
    {
      icon: Gift,
      title: 'Packages, Reports & Rewards',
      subtitle: 'Access PDF skin diagnostic reports, track session packages, and earn loyalty credits on every treatment.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      badge: 'All-In-One PWA Portal'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Top Skip button */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-100">REVEAL</span>
        </div>
        <button
          id="onboarding-skip-btn"
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-white transition px-3 py-1 bg-slate-800/80 rounded-full"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            {/* Image container */}
            <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-sky-400 border border-slate-700">
                {slide.badge}
              </div>
            </div>

            {/* Slide Title & Text */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-sky-400 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-6 pb-4 z-10">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-sm transition"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started Now' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
