'use client';

import React from 'react';
import Button, { ButtonProps as MuiButtonPropsBase } from '@mui/material/Button';
import { cn } from '@/lib/utils'; // Assuming this utility exists, as seen in button.tsx

// Extend MUI Button props
export interface MuiButtonProps extends MuiButtonPropsBase {
    // Add any custom props if needed
}

export const MuiButton = React.forwardRef<HTMLButtonElement, MuiButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn(className)} // Merge Tailwind classes
                {...props}
            >
                {children}
            </Button>
        );
    }
);

MuiButton.displayName = 'MuiButton';
