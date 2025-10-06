'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  group?: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  showSearch?: boolean;
  showGroups?: boolean;
  popularOptions?: string[];
  onViewAll?: () => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  label,
  className = "",
  showSearch = true,
  showGroups = true,
  popularOptions: _ = [],
  onViewAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options
  const groupedOptions = showGroups ? filteredOptions.reduce((groups, option) => {
    const group = option.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, DropdownOption[]>) : { 'All': filteredOptions };

  // Prioritize popular options
  const orderedGroups = Object.keys(groupedOptions).sort((a, b) => {
    if (a === 'Popular') return -1;
    if (b === 'Popular') return 1;
    return a.localeCompare(b);
  });

  // Get selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, showSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const allOptions = filteredOptions;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, allOptions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && allOptions[focusedIndex]) {
          onChange(allOptions[focusedIndex].value);
          setIsOpen(false);
          setSearchTerm('');
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-[#244034] mb-1">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034] text-left flex items-center justify-between hover:border-gray-400 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue || placeholder}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          {showSearch && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder="Search..."
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {orderedGroups.map((groupName) => (
              <div key={groupName}>
                {showGroups && groupName !== 'All' && (
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                    {groupName}
                  </div>
                )}
                {groupedOptions[groupName].map((option) => {
                  const globalIndex = filteredOptions.findIndex(opt => opt.value === option.value);
                  const isFocused = focusedIndex === globalIndex;
                  const isSelected = value === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                        isSelected ? 'bg-[#244034] text-white hover:bg-[#1a2f26]' : 'text-gray-900'
                      } ${isFocused ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>

          {/* Footer with "View All" option */}
          {searchTerm === '' && onViewAll && (
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onViewAll();
                }}
                className="w-full px-3 py-2 text-xs text-[#244034] hover:bg-gray-100 rounded transition-colors"
              >
                View All Options →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
