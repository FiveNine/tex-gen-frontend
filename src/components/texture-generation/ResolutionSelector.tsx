
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ResolutionSelectorProps {
  resolution: number[];
  setResolution: (value: number[]) => void;
}

const resolutionMap = {
  1: '1K',
  2: '2K',
  3: '4K'
};

const ResolutionSelector = ({ resolution, setResolution }: ResolutionSelectorProps) => {
  return (
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
  );
};

export default ResolutionSelector;
