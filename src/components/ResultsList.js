import React from 'react';
import CroppedImage from './CroppedImage'; // Import the CroppedImage component
import './ResultsList.css';

const ResultsList = ({ items }) => {

    // Determine the content based on loading, error, and search results
    if (items.length === 0) {
        return <p>No matching elements found.</p>;
    }

    return (
        // Container for results with scrolling and styling
        <div className="results-container">
            {items.map((el, index) => (
                <CroppedImage
                    key={`${el.name}-${index}`}
                    atlasName={el.name}
                    displayName={el.displayName}
                />
            ))}
        </div>
    );
};

export default ResultsList; 