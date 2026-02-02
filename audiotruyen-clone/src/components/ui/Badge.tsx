'use client';

import * as React from "react"
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'customVariant',
})<{ customVariant?: 'default' | 'full' | 'hot' | 'translate' | 'convert' }>(({ theme, customVariant }) => {
    const variants = {
        default: {
            backgroundColor: '#2563EB', // blue-600
            color: '#fff',
        },
        full: {
            background: 'linear-gradient(to bottom right, #10B981, #059669)', // emerald-500 to emerald-600
            color: '#fff',
        },
        hot: {
            background: 'linear-gradient(to bottom right, #F59E0B, #D97706)', // amber-500 to amber-600
            color: '#fff',
        },
        translate: {
            background: 'linear-gradient(to bottom right, #06B6D4, #0891B2)', // cyan-500 to cyan-600
            color: '#fff',
        },
        convert: {
            background: 'linear-gradient(to bottom right, #F97316, #EA580C)', // orange-500 to orange-600
            color: '#fff',
        },
    };

    const selectedVariant = variants[customVariant || 'default'];

    return {
        ...selectedVariant,
        height: '20px',
        fontSize: '0.75rem', // text-xs
        fontWeight: 700, // font-bold
        textTransform: 'uppercase',
        '& .MuiChip-label': {
            paddingLeft: '8px',
            paddingRight: '8px',
        },
    };
});

export interface BadgeProps extends Omit<ChipProps, 'variant' | 'children'> {
    variant?: 'default' | 'full' | 'hot' | 'translate' | 'convert';
    children?: React.ReactNode;
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    return (
        <StyledChip
            customVariant={variant}
            size="small"
            className={className}
            label={children}
            {...props}
        />
    )
}

export { Badge }
