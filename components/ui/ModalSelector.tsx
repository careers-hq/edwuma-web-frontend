'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface ModalOption {
  value: string;
  label: string;
  group?: string;
}

interface ModalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: ModalOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiSelect?: boolean;
  showGroups?: boolean;
  popularOptions?: string[];
}

const ModalSelector: React.FC<ModalSelectorProps> = ({
  isOpen,
  onClose,
  title,
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = false,
  showGroups = true,
  popularOptions = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelection, setLocalSelection] = useState<string[]>(selectedValues);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelection(selectedValues);
      setSearchTerm('');
      setSelectedGroup('');
    }
  }, [isOpen, selectedValues]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Filter options based on search term and selected group
  const filteredOptions = options.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || option.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Group options
  const groupedOptions = showGroups ? filteredOptions.reduce((groups, option) => {
    const group = option.group || 'Other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, ModalOption[]>) : { 'All': filteredOptions };

  // Get unique groups for tabs
  const allGroups = showGroups ? [...new Set(options.map(option => option.group || 'Other'))] : [];

  const handleOptionToggle = (value: string) => {
    if (multiSelect) {
      setLocalSelection(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setLocalSelection([value]);
    }
  };

  const handleApply = () => {
    onSelectionChange(localSelection);
    onClose();
  };

  const handleClear = () => {
    setLocalSelection([]);
  };

  const handleSelectGroup = (group: string) => {
    const groupOptions = groupedOptions[group] || [];
    const groupValues = groupOptions.map(option => option.value);
    
    if (multiSelect) {
      // Toggle group selection
      const allSelected = groupValues.every(value => localSelection.includes(value));
      if (allSelected) {
        // Deselect all in group
        setLocalSelection(prev => prev.filter(value => !groupValues.includes(value)));
      } else {
        // Select all in group
        setLocalSelection(prev => [...new Set([...prev, ...groupValues])]);
      }
    } else {
      // Single select - just select first option in group
      setLocalSelection(groupValues.slice(0, 1));
    }
  };

  const getSelectedCount = () => {
    return localSelection.length;
  };

  const isGroupSelected = (group: string) => {
    const groupOptions = groupedOptions[group] || [];
    const groupValues = groupOptions.map(option => option.value);
    return groupValues.length > 0 && groupValues.every(value => localSelection.includes(value));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#244034]">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-1 focus:ring-[#244034]"
            />
          </div>

          {/* Group Tabs */}
          {showGroups && allGroups.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGroup('')}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    !selectedGroup 
                      ? 'bg-[#244034] text-white border-[#244034]' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  All ({options.length})
                </button>
                {allGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedGroup === group 
                        ? 'bg-[#244034] text-white border-[#244034]' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {group} ({groupedOptions[group]?.length || 0})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="flex-1 overflow-y-auto p-4">
            {Object.keys(groupedOptions).map((groupName) => (
              <div key={groupName} className="mb-6">
                {showGroups && groupName !== 'All' && (
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#244034]">{groupName}</h4>
                    {multiSelect && groupedOptions[groupName].length > 1 && (
                      <button
                        onClick={() => handleSelectGroup(groupName)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          isGroupSelected(groupName)
                            ? 'bg-[#244034] text-white border-[#244034]'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isGroupSelected(groupName) ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groupedOptions[groupName].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionToggle(option.value)}
                      className={`p-3 text-sm rounded-md border transition-all duration-200 text-left ${
                        localSelection.includes(option.value)
                          ? 'bg-[#244034] text-white border-[#244034] shadow-sm'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {localSelection.includes(option.value) && (
                          <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No options found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {getSelectedCount()} selected
              </span>
              {multiSelect && getSelectedCount() > 0 && (
                <button
                  onClick={handleClear}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleApply}
                className="px-4 py-2 bg-[#244034] hover:bg-[#1a2f26]"
              >
                Apply Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSelector;
