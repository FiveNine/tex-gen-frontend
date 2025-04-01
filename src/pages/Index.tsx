
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TextureGallery from '@/components/TextureGallery';
import GenerationForm from '@/components/GenerationForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        <div className="py-16 text-center">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">
              AI-Powered Texture Generation
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              TexGen uses cutting-edge AI models to transform your text descriptions or reference images into high-quality, 
              seamless textures for games, 3D modeling, digital art, and design projects.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-secondary/50 rounded-lg p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Describe Your Texture</h3>
                <p className="text-sm text-muted-foreground">
                  Enter a detailed description of the texture you need or upload a reference image.
                </p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">AI Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your request and generates a high-quality seamless texture within seconds.
                </p>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Download & Use</h3>
                <p className="text-sm text-muted-foreground">
                  Download your texture in up to 4K resolution and use it in your projects immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <GenerationForm />
        <TextureGallery isHomePage={true} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
