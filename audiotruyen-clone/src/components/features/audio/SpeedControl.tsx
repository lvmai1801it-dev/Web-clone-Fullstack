'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeedControlProps {
    playbackRate: number;
    onSpeedChange: (rate: number) => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const SpeedControl = memo(function SpeedControl({
    playbackRate,
    onSpeedChange,
}: SpeedControlProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full gap-1.5 h-9 px-3 text-muted-foreground hover:text-primary hover:bg-muted transition-all font-bold"
                >
                    <Gauge size={16} />
                    <span className="font-mono">{playbackRate}x</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[100px] rounded-xl shadow-premium border-muted/50 p-1">
                {SPEED_OPTIONS.map((rate) => (
                    <DropdownMenuItem
                        key={rate}
                        onClick={() => onSpeedChange(rate)}
                        className={cn(
                            "cursor-pointer rounded-lg text-sm font-bold font-mono",
                            playbackRate === rate ? "bg-primary text-primary-foreground focus:bg-primary/90" : "text-foreground/70"
                        )}
                    >
                        {rate}x
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
