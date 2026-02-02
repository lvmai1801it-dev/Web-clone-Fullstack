'use client';

import { memo, useState, MouseEvent } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { Gauge } from 'lucide-react';

interface SpeedControlProps {
    playbackRate: number;
    onSpeedChange: (rate: number) => void;
    // isOpen and onToggle are no longer needed as Menu handles its own state
    isOpen?: boolean;
    onToggle?: () => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export const SpeedControl = memo(function SpeedControl({
    playbackRate,
    onSpeedChange,
}: SpeedControlProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (rate: number) => {
        onSpeedChange(rate);
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                size="small"
                startIcon={<Gauge size={18} />}
                sx={{
                    minWidth: 'auto',
                    borderRadius: 20,
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'text.secondary',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                    }
                }}
            >
                {playbackRate}x
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: -1,
                            minWidth: 100,
                            borderRadius: 2,
                        }
                    }
                }}
            >
                {SPEED_OPTIONS.map((rate) => (
                    <MenuItem
                        key={rate}
                        selected={playbackRate === rate}
                        onClick={() => handleSelect(rate)}
                        dense
                    >
                        <Typography variant="body2" fontWeight={playbackRate === rate ? 700 : 400}>
                            {rate}x
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
});
