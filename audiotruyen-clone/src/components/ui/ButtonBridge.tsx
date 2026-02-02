'use client';

import React from 'react';
import { Button, type ButtonProps as ShadcnButtonProps } from './button';
import { cn } from '@/lib/utils';

/**
 * MuiButton Bridge Component
 * 
 * This component acts as a bridge during the migration from MUI to Shadcn/UI.
 * It translates legacy MUI props to Shadcn equivalents while maintaining the "Pro Max" feel.
 */
export interface MuiButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    variant?: 'contained' | 'outlined' | 'text' | 'string';
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | string;
    fullWidth?: boolean;
    disabled?: boolean;
    component?: React.ElementType;
    href?: string;
}

export const MuiButton = React.forwardRef<HTMLButtonElement, MuiButtonProps>(
    ({ className, variant, size, color, fullWidth, children, ...props }, ref) => {
        // Map MUI variants to Shadcn variants
        let shadcnVariant: ShadcnButtonProps['variant'] = 'default';
        if (variant === 'outlined') shadcnVariant = 'outline';
        if (variant === 'text') shadcnVariant = 'ghost';
        if (color === 'error') shadcnVariant = 'destructive';

        // Map MUI sizes to Shadcn sizes
        let shadcnSize: ShadcnButtonProps['size'] = 'default';
        if (size === 'small') shadcnSize = 'sm';
        if (size === 'large') shadcnSize = 'lg';

        return (
            <Button
                ref={ref}
                variant={shadcnVariant}
                size={shadcnSize}
                className={cn(
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

MuiButton.displayName = 'MuiButton';
