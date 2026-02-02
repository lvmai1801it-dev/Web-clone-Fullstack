'use client';

import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { cn } from '@/lib/utils';

export type MuiInputProps = Omit<TextFieldProps, 'variant'> & {
    variant?: 'outlined' | 'filled' | 'standard';
};

export const MuiInput = React.forwardRef<HTMLDivElement, MuiInputProps>(
    ({ className, variant = 'outlined', size = 'small', InputProps, ...props }, ref) => {
        return (
            <TextField
                ref={ref}
                variant={variant}
                size={size}
                className={cn(className)}
                InputProps={{
                    ...InputProps,
                    classes: {
                        root: 'bg-white', // Base background
                        ...InputProps?.classes,
                    }
                }}
                {...props}
            />
        );
    }
);

MuiInput.displayName = 'MuiInput';
