
import React, { useState, useEffect } from 'react';
import { mockTextures } from '@/utils/mockData';
import TextureCard from './TextureCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const TextureGallery = () => {
  const [textures, setTextures] = useState(mockTextures);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const texturesPerPage = 8;

  // Filter textures based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = mockTextures.filter(
        texture => 
          texture.title.toLowerCase().includes(lowercaseQuery) || 
          texture.prompt.toLowerCase().includes(lowercaseQuery) ||
          texture.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
      setTextures(filtered);
    } else {
      setTextures(mockTextures.slice(0, page * texturesPerPage));
    }
  }, [searchQuery, page]);

  // Load more textures when scrolling
  const loadMoreTextures = () => {
    if (isLoading || textures.length >= mockTextures.length) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setPage(prevPage => prevPage + 1);
      setIsLoading(false);
    }, 800);
  };

  // Detect when user scrolls to bottom to load more textures
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreTextures();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between gap-4">
          <h2 className="text-3xl font-bold">Texture Gallery</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search textures..." 
              className="w-full md:w-80 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {textures.map((texture) => (
            <TextureCard key={texture.id} texture={texture} />
          ))}
        </div>

        {isLoading && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-secondary loading-shimmer"></div>
                <div className="p-4 space-y-2 bg-secondary">
                  <div className="h-6 w-2/3 rounded bg-muted loading-shimmer"></div>
                  <div className="h-4 w-full rounded bg-muted loading-shimmer"></div>
                  <div className="h-4 w-4/5 rounded bg-muted loading-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && searchQuery && textures.length === 0 && (
          <div className="mt-12 text-center">
            <h3 className="text-xl font-medium mb-2">No textures found</h3>
            <p className="text-muted-foreground">Try using different keywords</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TextureGallery;
