'use client';

import dynamic from 'next/dynamic';

const AudioPlayer = dynamic(() => import('./AudioPlayer'), {
    ssr: false,
    loading: () => <div className="h-[300px] animate-pulse bg-slate-100 rounded-2xl border-2 border-slate-100" />
});

export default AudioPlayer;
