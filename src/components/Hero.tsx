
import React from 'react';
import { Button } from '@/components/ui/button';
import { mockTextures } from '@/utils/mockData';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-900/20 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-700/10 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-700/10 rounded-full filter blur-3xl"></div>
      
      <div className="container relative z-10 py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
          Generate Beautiful <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 glow-effect">Textures</span> with AI
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Create high-quality, seamless textures for your 3D models, game assets, and design projects in seconds with our AI texture generator.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            Start Creating
          </Button>
          <Button size="lg" variant="outline">
            View Gallery
          </Button>
        </div>
        
        <div className="mt-16 md:mt-24 w-full max-w-5xl relative">
          {/* Featured textures showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {mockTextures.slice(0, 5).map((texture, index) => (
              <div 
                key={texture.id} 
                className={`rounded-lg overflow-hidden aspect-square ${
                  index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
              >
                <img 
                  src={texture.imageUrl} 
                  alt={texture.title} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                />
              </div>
            ))}
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
