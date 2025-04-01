
import React from 'react';
import Navbar from '@/components/Navbar';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4 text-center">Pricing Plans</h1>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Choose the plan that fits your needs. Whether you're just starting out or need professional features.
            </p>
          </div>
        </div>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
