
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/utils/mockData';

const PricingSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="pricing">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl"></div>

      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your needs. Whether you're just starting out or need professional features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={plan.name} 
              className={`relative rounded-xl border bg-card text-card-foreground shadow transition-all ${
                plan.popular ? 'scale-105 shadow-lg border-primary/50 md:-mt-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 pt-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check size={20} className="mr-2 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`mt-8 w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-secondary hover:bg-secondary/90'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
