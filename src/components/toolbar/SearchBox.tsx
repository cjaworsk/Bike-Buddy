"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  type: string;
  importance: number;
}

interface SearchBoxProps {
  onLocationSelect: (lat: number, lng: number, displayName: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ 
  onLocationSelect, 
  placeholder = "Search city or zip code...",
  className = ""
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search function
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(query)}&countrycodes=us`
        );
        
        if (response.ok) {
          const data: SearchResult[] = await response.json();
          setResults(data);
          setIsOpen(data.length > 0);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

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
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    onLocationSelect(lat, lng, result.display_name);
    setQuery(result.display_name.split(',')[0]); // Show just the main location name
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const formatDisplayName = (displayName: string) => {
    // Split by commas and take first 3 parts for cleaner display
    const parts = displayName.split(',').map(part => part.trim());
    return parts.slice(0, 3).join(', ');
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="search-highlight">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`search-box ${className}`}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
        />
        {isLoading && (
          <span className="search-loading">⟳</span>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={result.place_id}
                onClick={() => handleResultSelect(result)}
                className={`search-item ${index === selectedIndex ? 'selected' : ''}`}
              >
                <div className="search-item-title">
                  {highlightText(formatDisplayName(result.display_name), query)}
                </div>
                <div className="search-item-type">
                  {result.type.replace('_', ' ')}
                </div>
              </div>
            ))
          ) : (
            query.length >= 2 && !isLoading && (
              <div className="search-no-results">
                No results found for &quot;{query}&quot;
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
