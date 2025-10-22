import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Exercise } from '../store/app-store';

interface VideoPlayerProps {
  exercise: Exercise;
  onClose: () => void;
}

export function VideoPlayer({ exercise, onClose }: VideoPlayerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-background rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3>{exercise.name}</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="aspect-video bg-black">
          {exercise.videoUrl ? (
            <video
              controls
              autoPlay
              className="w-full h-full"
              src={exercise.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Video not available
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-2 text-sm">
          <div className="flex gap-4 text-muted-foreground">
            <span>{exercise.sets} sets</span>
            <span>{exercise.reps.join('-')} reps</span>
            <span>{exercise.restSec}s rest</span>
            {exercise.targetWeightKg && <span>{exercise.targetWeightKg} kg</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
