
import React from 'react';
import Navbar from '@/components/Navbar';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
