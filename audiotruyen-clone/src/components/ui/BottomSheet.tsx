'use client';

import { ReactNode } from 'react';
import { SwipeableDrawer, Box, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxHeight?: string;
}

export function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
    maxHeight = '80vh'
}: BottomSheetProps) {
    // Puller styling
    const Puller = (
        <Box
            sx={{
                width: 40,
                height: 4,
                bgcolor: 'grey.300',
                borderRadius: 2,
                mx: 'auto', // margin auto for horizontal center
                mt: 1,
                mb: 1
            }}
        />
    );

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={isOpen}
            onClose={onClose}
            onOpen={() => { }} // Required prop for SwipeableDrawer
            disableSwipeToOpen={true}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    maxHeight: maxHeight,
                }
            }}
        >
            <div className="bg-white">
                <Box
                    className="sticky top-0 bg-white z-10 border-b border-[var(--color-border)]"
                    sx={{ px: 2, pb: 1 }}
                >
                    {Puller}
                    <div className="flex items-center justify-between">
                        {title && (
                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                {title}
                            </Typography>
                        )}
                        <IconButton
                            onClick={onClose}
                            size="small"
                        >
                            <X size={20} />
                        </IconButton>
                    </div>
                </Box>

                <Box sx={{ overflowY: 'auto', maxHeight: `calc(${maxHeight} - 60px)`, p: 0 }}>
                    {children}
                </Box>
            </div>
        </SwipeableDrawer>
    );
}
