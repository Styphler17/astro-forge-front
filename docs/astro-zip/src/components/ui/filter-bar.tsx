import React from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterBy?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  placeholder?: string;
  showSort?: boolean;
  showFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  filterOptions = [],
  sortOptions = [],
  placeholder = "Search...",
  showSort = true,
  showFilter = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            id="search-input"
            name="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filter Dropdown */}
        {showFilter && filterOptions.length > 0 && (
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={filterBy || "all"} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort Dropdown */}
        {showSort && (
          <div className="flex items-center space-x-2">
            {sortBy.includes('desc') ? (
              <SortDesc className="h-4 w-4 text-gray-400" />
            ) : (
              <SortAsc className="h-4 w-4 text-gray-400" />
            )}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.length > 0 ? (
                  sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="created_at_desc">Newest First</SelectItem>
                    <SelectItem value="created_at_asc">Oldest First</SelectItem>
                    <SelectItem value="title_asc">Title A-Z</SelectItem>
                    <SelectItem value="title_desc">Title Z-A</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Filters Button */}
        {(searchQuery || (filterBy && filterBy !== 'all')) && (
          <Button
            variant="outline"
            onClick={() => {
              onSearchChange('');
              if (onFilterChange) onFilterChange('');
            }}
            className="whitespace-nowrap"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 