import React from 'react';
import Select from 'react-select';
import './TechLevelFilter.css';

const TechLevelFilter = ({ techs, selectedTech, setSelectedTech }) => {
    const options = [
        { value: '-0', label: 'All Tech Levels' },
        ...techs.map(tech => ({
            value: `${tech.techLevel}-${tech.level}`,
            label: tech.name
        }))
    ];

    const currentValue = options.find(
        option => option.value === `${selectedTech.techLevel}-${selectedTech.level}`
    ) || options[0];

    return (
        <div className="tech-level-filter">
            <Select
                value={currentValue}
                onChange={(option) => setSelectedTech(option.value)}
                options={options}
                className="tech-level-select"
                classNamePrefix="tech-select"
                isSearchable={false}
                menuPlacement="auto"
            />
        </div>
    );
};

export default TechLevelFilter; 