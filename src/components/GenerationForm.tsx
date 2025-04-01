
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Upload, Image as ImageIcon, Sparkles, RefreshCcw, Check, AlertCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mockTextures } from '@/utils/mockData';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Mock user subscription status - In a real app, this would come from authentication
const userSubscriptionPlan = {
  isPro: false, // Set to true to test Pro plan features
};

const GenerationForm = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [resolution, setResolution] = useState([2]); // 1=1K, 2=2K, 3=4K
  const [generatedTexture, setGeneratedTexture] = useState<null | string>(null);
  const [modificationCount, setModificationCount] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentPromptHistory, setCurrentPromptHistory] = useState<string[]>([]);
  const [upscaleProgress, setUpscaleProgress] = useState(0);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([]);

  const resolutionMap = {
    1: '1K',
    2: '2K',
    3: '4K'
  };

  // Maximum number of modifications allowed for free users
  const MAX_FREE_MODIFICATIONS = 3;
  const canModify = userSubscriptionPlan.isPro || modificationCount < MAX_FREE_MODIFICATIONS;
  
  const remainingModifications = userSubscriptionPlan.isPro 
    ? '∞' 
    : `${MAX_FREE_MODIFICATIONS - modificationCount}/${MAX_FREE_MODIFICATIONS}`;

  const handleGenerate = () => {
    if (!prompt.trim() && referenceImages.length === 0) {
      toast.error("Please provide a text prompt or reference image", {
        description: "We need at least one input to generate a texture"
      });
      return;
    }
    
    // Reset confirmation state when generating a new texture
    setIsConfirmed(false);
    setIsGenerating(true);
    
    // Add current prompt to history
    if (prompt.trim() && !currentPromptHistory.includes(prompt)) {
      setCurrentPromptHistory(prev => [...prev, prompt]);
    }
    
    // Increment modification count if not the first generation
    if (generatedTexture && !userSubscriptionPlan.isPro) {
      setModificationCount(prev => prev + 1);
    }
    
    // Simulate texture generation with a random one from our mock data (low resolution preview)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockTextures.length);
      setGeneratedTexture(mockTextures[randomIndex].imageUrl);
      setIsGenerating(false);
      
      toast.success("Texture preview generated!", {
        description: "This is a low-resolution preview. Finalize when ready for high-resolution."
      });
    }, 2000);
  };

  const handleUpscale = () => {
    setIsUpscaling(true);
    setUpscaleProgress(0);
    
    // Simulate upscaling process with progress updates
    const interval = setInterval(() => {
      setUpscaleProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUpscaling(false);
            setIsConfirmed(true);
            toast.success("High-resolution texture generated!", {
              description: "Your texture has been added to the gallery."
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 700);
  };

  const handleRegenerate = () => {
    if (!canModify) {
      toast.error("Modification limit reached", {
        description: "Upgrade to Pro for unlimited modifications."
      });
      return;
    }
    handleGenerate();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // Process up to 3 files
    const maxFiles = 3 - referenceImages.length;
    const filesToProcess = Math.min(files.length, maxFiles);
    
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        
        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === newFiles.length) {
              setReferenceImages(prev => [...prev, ...newFiles]);
              setReferenceImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Reset the input to allow uploading the same file again
    event.target.value = '';
    
    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} added`, {
        description: "Reference images will help guide the AI generation"
      });
    }
  };
  
  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
    setReferenceImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const getPromptInputPlaceholder = () => {
    if (modificationCount > 0) {
      return "Modify your prompt to refine the texture...";
    }
    return "E.g., Weathered red brick wall with moss growing between bricks, seamless texture pattern";
  };

  return (
    <section className="py-16">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Generate Your Texture</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Describe the texture you need and optionally upload reference images to help the AI understand what you're looking for.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Input</h3>
              
              {/* Modifications counter */}
              <Badge 
                variant={userSubscriptionPlan.isPro ? "default" : "outline"} 
                className={userSubscriptionPlan.isPro ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}
              >
                {userSubscriptionPlan.isPro ? "Pro: Unlimited" : `Modifications: ${remainingModifications}`}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" /> Describe your texture
                </Label>
                <Textarea
                  id="prompt"
                  placeholder={getPromptInputPlaceholder()}
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" /> Reference Images (Optional)
                </Label>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Display uploaded reference images */}
                  {referenceImagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden bg-secondary/50">
                      <img 
                        src={preview} 
                        alt={`Reference ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 w-6 h-6 rounded-full"
                        onClick={() => removeReferenceImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Image upload button if less than 3 images */}
                  {referenceImages.length < 3 && (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-6 w-6 mb-1 text-muted-foreground" />
                      <p className="text-xs text-center text-muted-foreground">Add Image</p>
                      <Input 
                        type="file" 
                        className="hidden" 
                        id="image-upload" 
                        accept="image/png, image/jpeg" 
                        onChange={handleImageUpload} 
                        multiple
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Upload up to 3 images (PNG, JPG up to 5MB each)
                </p>
              </div>
              
              {currentPromptHistory.length > 1 && (
                <div>
                  <Label className="text-sm mb-2 block">Prompt History</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto text-sm">
                    {currentPromptHistory.map((historyPrompt, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-secondary/50 rounded-md cursor-pointer hover:bg-secondary"
                        onClick={() => setPrompt(historyPrompt)}
                      >
                        {historyPrompt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mt-4">
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
                  disabled={(!prompt.trim() && referenceImages.length === 0) || isGenerating || isUpscaling}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Preview...
                    </>
                  ) : (
                    'Generate Texture Preview'
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mt-2">
                <p>Pro tip: For best results, include details about:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Material (brick, stone, wood, etc.)</li>
                  <li>Colors and patterns</li>
                  <li>Surface properties (rough, smooth, glossy)</li>
                  <li>Weathering or aging effects</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-center font-medium text-lg">Creating your texture preview...</p>
                  <p className="text-center text-muted-foreground mt-2">This may take a few seconds</p>
                </div>
              ) : isUpscaling ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <Progress value={upscaleProgress} className="w-64 mb-4" />
                  <p className="text-center font-medium text-lg">Generating high-resolution texture...</p>
                  <p className="text-center text-muted-foreground mt-2">{upscaleProgress}% complete</p>
                </div>
              ) : generatedTexture ? (
                <>
                  <img 
                    src={generatedTexture} 
                    alt="Generated texture" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-black/40 backdrop-blur-sm">
                      {isConfirmed ? resolutionMap[resolution[0] as 1 | 2 | 3] : 'Preview'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {!isConfirmed && (
                      <>
                        <Button 
                          size="sm"
                          onClick={handleRegenerate}
                          disabled={!canModify}
                          variant="secondary"
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Regenerate
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleUpscale}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Finalize
                        </Button>
                      </>
                    )}
                    {isConfirmed && (
                      <Button size="sm" variant="secondary">
                        <Upload className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <ImageIcon className="h-16 w-16 mb-4 text-muted-foreground/50" />
                  <p className="font-medium text-lg">Your texture will appear here</p>
                  <p className="text-muted-foreground mt-2">
                    Start by entering a prompt or uploading reference images
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information about the workflow */}
        {generatedTexture && !isConfirmed && (
          <div className="mt-8 p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">This is a low-resolution preview</h4>
                <p className="text-sm text-muted-foreground">
                  When you're satisfied with the texture, click "Finalize" to generate a high-resolution version 
                  that will be added to your gallery. {!userSubscriptionPlan.isPro && `You have ${MAX_FREE_MODIFICATIONS - modificationCount} modifications remaining.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GenerationForm;
