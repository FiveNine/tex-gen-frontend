
import React from 'react';
import GenerationForm from '@/components/GenerationForm';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-900/20 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-700/10 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-700/10 rounded-full filter blur-3xl"></div>
      
      <div className="container relative z-10 py-20 md:py-28 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
          Generate Beautiful <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 glow-effect">Textures</span> with AI
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Create high-quality, seamless textures for your 3D models, game assets, and design projects in seconds with our AI texture generator.
        </p>
        
        <div className="w-full max-w-4xl">
          <GenerationForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;
