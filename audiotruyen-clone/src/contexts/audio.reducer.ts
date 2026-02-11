import { AudioState, AudioAction } from './audio.types';

export const initialAudioState: AudioState = {
    storyId: null,
    storyTitle: '',
    storySlug: '',
    coverUrl: '',
    chapters: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    selectedChapter: 1,
    currentAudioUrl: '',
    playbackRate: 1,
    volume: 1,
    isSpeedMenuOpen: false,
    showResumeToast: false,
    resumeData: null,
    pendingSeek: null,
};

export function audioReducer(state: AudioState, action: AudioAction): AudioState {
    switch (action.type) {
        case 'SET_STORY':
            return { ...state, ...action.payload, selectedChapter: 1, currentAudioUrl: action.payload.chapters[0]?.audioUrl || '' };
        case 'SET_PLAYING':
            return { ...state, isPlaying: action.payload };
        case 'SET_CURRENT_TIME':
            return { ...state, currentTime: action.payload };
        case 'SET_DURATION':
            return { ...state, duration: action.payload };
        case 'SET_CHAPTER': {
            const chapter = action.payload;
            const newUrl = state.chapters.find(c => c.number === chapter)?.audioUrl || '';
            return { ...state, selectedChapter: chapter, currentAudioUrl: newUrl };
        }
        case 'SET_PLAYBACK_RATE':
            return { ...state, playbackRate: action.payload, isSpeedMenuOpen: false };
        case 'SET_VOLUME':
            return { ...state, volume: action.payload };
        case 'TOGGLE_SPEED_MENU':
            return { ...state, isSpeedMenuOpen: !state.isSpeedMenuOpen };
        case 'SHOW_RESUME_TOAST':
            return { ...state, showResumeToast: true, resumeData: action.payload };
        case 'HIDE_RESUME_TOAST':
            return { ...state, showResumeToast: false };
        case 'SET_PENDING_SEEK':
            return { ...state, pendingSeek: action.payload };
        case 'RESET':
            return initialAudioState;
        default:
            return state;
    }
}
