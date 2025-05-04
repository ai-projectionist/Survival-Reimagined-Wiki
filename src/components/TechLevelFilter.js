import React from 'react';
import './TechLevelFilter.css';

const TechLevelFilter = ({ selectedTechLevel, onTechLevelChange }) => {
    const techLevels = [
        { value: '', label: 'All Tech Levels' },
        { value: 'SCIENCE', label: 'Science' },
        { value: 'MAGIC', label: 'Magic' },
        { value: 'ANCIENT', label: 'Ancient' },
        { value: 'SHADOW', label: 'Shadow' },
        { value: 'CARTOGRAPHY', label: 'Cartography' },
        { value: 'SEAFARING', label: 'Seafaring' },
        { value: 'SCULPTING', label: 'Sculpting' }
    ];

    return (
        <div className="tech-level-filter">
            <select
                value={selectedTechLevel}
                onChange={(e) => onTechLevelChange(e.target.value)}
                className="tech-level-select"
            >
                {techLevels.map((tech) => (
                    <option key={tech.value} value={tech.value}>
                        {tech.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TechLevelFilter; 