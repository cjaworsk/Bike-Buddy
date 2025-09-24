// hooks/useLocationSearch.ts
"use client";

import React, { useState, useEffect, useRef } from "react";

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  type: string;
  importance: number;
}

interface UseLocationSearchOptions {
  onLocationSelect: (lat: number, lng: number, displayName: string) => void;
  minQueryLength?: number;
  searchDelay?: number;
  maxResults?: number;
}

export function useLocationSearch({
  onLocationSelect,
  minQueryLength = 2,
  searchDelay = 300,
  maxResults = 8
}: UseLocationSearchOptions) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search function
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length < minQueryLength) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=${maxResults}&q=${encodeURIComponent(query)}&countrycodes=us`
        );
        
        if (response.ok) {
          const data: SearchResult[] = await response.json();
          setResults(data);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, searchDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, minQueryLength, searchDelay, maxResults]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleResultSelect(results[0]);
        }
        break;
      case "Escape":
        setSelectedIndex(-1);
        setQuery("");
        setResults([]);
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    onLocationSelect(lat, lng, result.display_name);
    setQuery(result.display_name.split(',')[0]);
    setResults([]);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const formatDisplayName = (displayName: string): string => {
    const parts = displayName.split(',').map(part => part.trim());
    return parts.slice(0, 3).join(', ');
  };

  const highlightText = (text: string, highlight: string): React.ReactNode => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return React.createElement('span', {
          key: index,
          style: { backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '500' }
        }, part);
      }
      return part;
    });
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleResultSelect,
    clearSearch,
    formatDisplayName,
    highlightText
  };
}
