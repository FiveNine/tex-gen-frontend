
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image as ImageIcon, Sparkles, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mockTextures } from '@/utils/mockData';

const GenerationForm = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolution, setResolution] = useState([2]); // 1=1K, 2=2K, 3=4K
  const [generatedTexture, setGeneratedTexture] = useState<null | string>(null);

  const resolutionMap = {
    1: '1K',
    2: '2K',
    3: '4K'
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate texture generation with a random one from our mock data
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockTextures.length);
      setGeneratedTexture(mockTextures[randomIndex].imageUrl);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <section className="py-16">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Generate Your Texture</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Describe the texture you need or upload a reference image, and our AI will generate a high-quality seamless texture for your project.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="prompt" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">
                  <Sparkles className="mr-2 h-4 w-4" /> Text Prompt
                </TabsTrigger>
                <TabsTrigger value="image">
                  <ImageIcon className="mr-2 h-4 w-4" /> Reference Image
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompt" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Describe your texture in detail</Label>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., Weathered red brick wall with moss growing between bricks, seamless texture pattern"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="resize-none"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                      <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 font-medium">Drop your reference image here</p>
                      <p className="text-sm text-muted-foreground mb-4">PNG, JPG up to 5MB</p>
                      <Input 
                        type="file" 
                        className="hidden" 
                        id="image-upload" 
                        accept="image/png, image/jpeg" 
                      />
                      <Button 
                        variant="secondary" 
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Add text details (optional)</Label>
                  <Input
                    id="image-prompt"
                    placeholder="E.g., Make it more weathered and add more contrast"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Resolution</Label>
                  <span className="text-sm text-muted-foreground">{resolutionMap[resolution[0] as 1 | 2 | 3]}</span>
                </div>
                <Slider
                  value={resolution}
                  onValueChange={setResolution}
                  max={3}
                  min={1}
                  step={1}
                />
              </div>
              
              <Button 
                onClick={handleGenerate} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Texture'
                )}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Pro tip: For best results, include details about:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Material (brick, stone, wood, etc.)</li>
                <li>Colors and patterns</li>
                <li>Surface properties (rough, smooth, glossy)</li>
                <li>Weathering or aging effects</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-center font-medium text-lg">Creating your texture...</p>
                  <p className="text-center text-muted-foreground mt-2">This may take a few seconds</p>
                </div>
              ) : generatedTexture ? (
                <>
                  <img 
                    src={generatedTexture} 
                    alt="Generated texture" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button size="sm">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Upload className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <ImageIcon className="h-16 w-16 mb-4 text-muted-foreground/50" />
                  <p className="font-medium text-lg">Your texture will appear here</p>
                  <p className="text-muted-foreground mt-2">
                    Start by entering a detailed prompt or uploading a reference image
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenerationForm;
