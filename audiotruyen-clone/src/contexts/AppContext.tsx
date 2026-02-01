'use client';

import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { AppState, Notification, User } from '@/types/state.types';
import { Story } from '@/lib/types';

export type AppAction =
    | { type: 'SET_ONLINE_STATUS'; payload: boolean }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'SET_MOBILE_MENU'; payload: boolean }
    | { type: 'SET_SEARCH_DROPDOWN'; payload: boolean }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_SEARCH_RESULTS'; payload: Story[] }
    | { type: 'SET_USER'; payload: User | null };

const initialAppState: AppState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isLoading: false,
    error: null,
    notifications: [],
    showMobileMenu: false,
    showSearchDropdown: false,
    searchQuery: '',
    searchResults: [],
    user: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_ONLINE_STATUS':
            return { ...state, isOnline: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload)
            };
        case 'SET_MOBILE_MENU':
            return { ...state, showMobileMenu: action.payload };
        case 'SET_SEARCH_DROPDOWN':
            return { ...state, showSearchDropdown: action.payload };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

interface AppContextType {
    state: AppState;
    actions: {
        setLoading: (loading: boolean) => void;
        setError: (error: string | null) => void;
        addNotification: (notification: Notification) => void;
        removeNotification: (id: string) => void;
        setOnlineStatus: (online: boolean) => void;
        toggleMobileMenu: () => void;
        setSearchQuery: (query: string) => void;
        setSearchResults: (results: Story[]) => void;
        setUser: (user: User | null) => void;
    };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialAppState);

    const actions = useMemo(() => ({
        setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
        setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
        addNotification: (notification: Notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
        removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
        setOnlineStatus: (online: boolean) => dispatch({ type: 'SET_ONLINE_STATUS', payload: online }),
        toggleMobileMenu: () => dispatch({ type: 'SET_MOBILE_MENU', payload: !state.showMobileMenu }),
        setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
        setSearchResults: (results: Story[]) => dispatch({ type: 'SET_SEARCH_RESULTS', payload: results }),
        setUser: (user: User | null) => dispatch({ type: 'SET_USER', payload: user }),
    }), [state.showMobileMenu]);

    // Listen for online/offline events
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleOnline = () => actions.setOnlineStatus(true);
        const handleOffline = () => actions.setOnlineStatus(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [actions]);

    return (
        <AppContext.Provider value={{ state, actions }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
