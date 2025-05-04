import React, { useState, useContext } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { AtlasContext } from '../context';
import ResultsList from './ResultsList';
import './ItemSearch.css';
import { formatDisplayName } from '../utils/formatting';

const ItemSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { inventoryAtlas } = useContext(AtlasContext);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Convert inventory atlas object to array of elements
    const elementData = React.useMemo(() => {
        return Object.entries(inventoryAtlas).map(([name, data]) => ({
            name,
            displayName: formatDisplayName(name)
        }));
    }, [inventoryAtlas]);

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter elements based on search term
    const filteredElements = React.useMemo(() => {
        if (!debouncedSearchTerm || debouncedSearchTerm.length < 3) return [];
        const searchLower = debouncedSearchTerm.toLowerCase();
        return elementData.filter(el => el.name.toLowerCase().includes(searchLower));
    }, [elementData, debouncedSearchTerm]);

    return (
        <div>
            <h2>Element Search</h2>
            <input
                type="text"
                placeholder="Search elements (minimum 3 characters)..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            {searchTerm.length >= 3 && (
                <ResultsList items={filteredElements} />
            )}
        </div>
    );
};

export default ItemSearch; 