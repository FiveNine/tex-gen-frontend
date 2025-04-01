
import React from 'react';
import Navbar from '@/components/Navbar';
import TextureGallery from '@/components/TextureGallery';
import Footer from '@/components/Footer';

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Texture Gallery</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our collection of AI-generated textures. Filter by tags, search by keywords, or browse your own creations.
            </p>
          </div>
        </div>
        <TextureGallery isHomePage={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
