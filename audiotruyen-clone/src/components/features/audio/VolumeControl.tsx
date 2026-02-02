'use client';

import { memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

export const VolumeControl = memo(function VolumeControl({
    volume,
    onVolumeChange,
}: VolumeControlProps) {
    return (
        <div className="flex items-center gap-3 w-[140px] group">
            <button
                onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            >
                {volume === 0 ? (
                    <VolumeX size={18} />
                ) : volume < 0.5 ? (
                    <Volume1 size={18} />
                ) : (
                    <Volume2 size={18} />
                )}
            </button>
            <Slider
                min={0}
                max={1}
                step={0.05}
                value={[volume]}
                onValueChange={(values) => onVolumeChange(values[0] as number)}
                aria-label="Âm lượng"
                className="cursor-pointer"
            />
        </div>
    );
});
