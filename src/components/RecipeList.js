import React, { useContext, useState, useMemo } from 'react';
import CroppedImage from './CroppedImage';
import './RecipeList.css';
import { AtlasContext } from '../context';
import { useDebounce } from '../hooks/useDebounce';
import Recipe from './Recipe';
import TechLevelFilter from './TechLevelFilter';

const ItemDisplay = ({ prefab, name, amount }) => {
    return (
        <div className={`${amount > 1 ? 'ingredient-item' : 'result-item'}`}>
            {prefab ? (
                <CroppedImage
                    atlasName={prefab}
                    displayName={name}
                />
            ) : (
                <div title={`${name} (Image not found)`} className="placeholder-image">?</div>
            )}
            {amount > 1 && <span className="amount">{amount}</span>}
        </div>
    );
};

const RecipeList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { recipes } = useContext(AtlasContext);
    const [selectedTechLevel, setSelectedTechLevel] = useState('');

    const filteredAndSortedRecipes = useMemo(() => {
        return recipes
            .filter(recipe => {
                const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    recipe.prefab.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesTechLevel = !selectedTechLevel ||
                    (recipe.techLevels && recipe.techLevels[selectedTechLevel]);

                return matchesSearch && matchesTechLevel;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [recipes, searchTerm, selectedTechLevel]);

    return (
        <div>
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search by name or prefab..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <TechLevelFilter
                    selectedTechLevel={selectedTechLevel}
                    onTechLevelChange={setSelectedTechLevel}
                />
            </div>
            <div className="recipe-list-container">
                {filteredAndSortedRecipes.map((recipe, index) => {
                    return <Recipe key={`${recipe.prefab}-${index}`} recipe={recipe} />
                })}
            </div>
        </div>
    );
};

export default RecipeList;