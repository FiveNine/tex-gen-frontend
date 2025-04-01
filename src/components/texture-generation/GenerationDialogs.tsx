
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign in required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to be signed in to generate textures. Please sign in or create an account to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Sign In</AlertDialogAction>
          <AlertDialogAction className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            Create Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResolution: number;
  setSelectedResolution: (resolution: number) => void;
  onConfirm: () => void;
  getResolutionLabel: (res: number) => string;
  isResolutionAvailable: (res: number) => boolean;
  isPro: boolean;
}

export const ResolutionDialog: React.FC<ResolutionDialogProps> = ({
  open,
  onOpenChange,
  selectedResolution,
  setSelectedResolution,
  onConfirm,
  getResolutionLabel,
  isResolutionAvailable,
  isPro
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Texture Resolution</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 gap-2">
            {[64, 128, 256, 1024, 2048, 4096, 8192].map((res) => (
              <Button
                key={res}
                variant={selectedResolution === res ? "default" : "outline"}
                onClick={() => setSelectedResolution(res)}
                className={`${!isResolutionAvailable(res) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isResolutionAvailable(res)}
              >
                {getResolutionLabel(res)}
                {res === 8192 && !isPro && 
                  <span className="ml-1 text-xs">(Pro)</span>
                }
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={onConfirm}
          >
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
