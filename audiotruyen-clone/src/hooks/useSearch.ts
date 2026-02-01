'use client';

import { useState, useEffect, useCallback } from 'react';
import { StoryService } from '@/services/story.service';
import { Story } from '@/lib/types';

export function useSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Debounced search
    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            setIsLoading(true);
            setShowDropdown(true);

            try {
                const response = await StoryService.search(searchQuery.trim());
                if (response.success && response.data?.items) {
                    setResults(response.data.items);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setResults([]);
        setShowDropdown(false);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        results,
        isLoading,
        showDropdown,
        setShowDropdown,
        clearSearch
    };
}
