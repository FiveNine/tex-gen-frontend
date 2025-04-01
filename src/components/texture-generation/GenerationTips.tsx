
import React from 'react';

const GenerationTips = () => {
  return (
    <div className="text-sm text-muted-foreground mt-2">
      <p>Pro tip: For best results, include details about:</p>
      <ul className="list-disc ml-5 mt-1 space-y-1">
        <li>Material (brick, stone, wood, etc.)</li>
        <li>Colors and patterns</li>
        <li>Surface properties (rough, smooth, glossy)</li>
        <li>Weathering or aging effects</li>
      </ul>
    </div>
  );
};

export default GenerationTips;
