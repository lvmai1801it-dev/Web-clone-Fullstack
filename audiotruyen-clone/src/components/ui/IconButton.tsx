'use client';

import React from 'react';
import { Button, type ButtonProps } from './button';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
    size?: 'small' | 'medium' | 'large' | string;
    edge?: 'start' | 'end' | false; // MUI Compatibility
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, size, edge, ...props }, ref) => {
        // Map MUI sizes
        let shadcnSize: ButtonProps['size'] = 'icon';
        if (size === 'small') shadcnSize = 'icon-sm';
        if (size === 'large') shadcnSize = 'icon-lg';

        return (
            <Button
                ref={ref}
                variant="ghost"
                size={shadcnSize}
                className={cn(
                    "rounded-full",
                    edge === 'start' && "-ml-2",
                    edge === 'end' && "-mr-2",
                    className
                )}
                {...props}
            />
        );
    }
);

IconButton.displayName = 'IconButton';
