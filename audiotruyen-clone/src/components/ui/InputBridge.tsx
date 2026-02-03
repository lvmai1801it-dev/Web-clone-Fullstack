'use client';

import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';

export interface MuiInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    InputProps?: {
        startAdornment?: React.ReactNode;
        endAdornment?: React.ReactNode;
        className?: string;
    };
}

export const MuiInput = React.forwardRef<HTMLInputElement, MuiInputProps>(
    ({ className, label, error, helperText, fullWidth, id, size, InputProps, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className={cn("space-y-1.5", fullWidth && "w-full")}>
                {label && (
                    <Label
                        htmlFor={inputId}
                        className={cn(error && "text-destructive", "text-sm font-medium ml-1")}
                    >
                        {label}
                    </Label>
                )}
                <div className="relative flex items-center group">
                    {InputProps?.startAdornment && (
                        <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                            {InputProps.startAdornment}
                        </div>
                    )}
                    <Input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            error && "border-destructive focus-visible:ring-destructive",
                            InputProps?.startAdornment && "pl-10",
                            InputProps?.endAdornment && "pr-10",
                            size === 'small' && "h-9 text-sm",
                            "rounded-full bg-muted/40 hover:bg-muted/60 dark:bg-muted/30 dark:hover:bg-muted/50 transition-all border-transparent focus:border-primary/50 shadow-sm",
                            className
                        )}
                        {...props}
                    />
                    {InputProps?.endAdornment && (
                        <div className="absolute right-1 flex items-center">
                            {InputProps.endAdornment}
                        </div>
                    )}
                </div>
                {helperText && (
                    <p className={cn("text-xs ml-1", error ? "text-destructive" : "text-muted-foreground")}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

MuiInput.displayName = 'MuiInput';
