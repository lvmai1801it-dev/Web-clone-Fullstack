'use client';

import { ReactNode } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from './drawer';
import { X } from 'lucide-react';
import { Button } from './button';

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
    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="px-4 pb-8">
                <DrawerHeader className="px-0 flex flex-row items-center justify-between border-b pb-3 mb-4">
                    {title && (
                        <DrawerTitle className="text-lg font-bold">
                            {title}
                        </DrawerTitle>
                    )}
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight: `calc(${maxHeight} - 80px)` }}
                >
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
