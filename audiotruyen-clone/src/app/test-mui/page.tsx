'use client';

import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { MuiButton } from '@/components/ui/MuiButton';

export default function TestMuiPage() {
    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <Typography variant="h4" component="h1" gutterBottom className="text-blue-600">
                Material UI Integration Test
            </Typography>

            <section className="space-y-4">
                <Typography variant="h6">1. Basic Components</Typography>
                <div className="flex gap-4">
                    <Button variant="contained">Default MUI Button</Button>
                    <Button variant="outlined" color="secondary">Outlined Secondary</Button>
                </div>
            </section>

            <section className="space-y-4">
                <Typography variant="h6">2. Tailwind Override Test (injectFirst)</Typography>
                <div className="flex gap-4 items-center">
                    <Button variant="contained" className="bg-red-500 hover:bg-red-600">
                        MUI Button with Tailwind Red Background
                    </Button>
                    <p className="text-sm text-gray-600">
                        (Should be Red, not MUI Blue)
                    </p>
                </div>
            </section>

            <section className="space-y-4">
                <Typography variant="h6">3. Mixed Usage</Typography>
                <Card className="max-w-md shadow-lg border border-gray-200">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            MUI Card
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            with Tailwind Layout
                        </Typography>
                        <Typography variant="body2">
                            This card uses MUI components but is constrained by Tailwind utility classes (max-w-md, shadow-lg).
                        </Typography>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <Typography variant="h6">4. MuiButton Wrapper</Typography>
                <div className="flex gap-4">
                    <MuiButton variant="contained" color="success">
                        MuiButton (Success)
                    </MuiButton>
                    <MuiButton variant="outlined" className="border-dashed border-2">
                        MuiButton (Dashed Border via Tailwind)
                    </MuiButton>
                </div>
            </section>
        </div>
    );
}
