import React, { useContext, useState, useMemo } from 'react';
import './RecipeList.css';
import { AtlasContext } from '../context';
import { useDebounce } from '../hooks/useDebounce';
import Recipe from './Recipe';
import TechLevelFilter from './TechLevelFilter';
import { getMatchScore } from '../utils/recipeSearch';
import { TECH_LEVELS } from '../config/atlasConfig';

const RecipeList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { recipes } = useContext(AtlasContext);
    const [selectedTech, setSelectedTech] = useState({ techLevel: '', level: 0 });
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const handleTechLevelChange = (value) => {
        const [techLevel, level] = value.split('-');
        setSelectedTech({
            techLevel,
            level: parseInt(level)
        });
    };

    const getModifiedRecipe = (recipe, bestIngredientIndex) => {
        if (bestIngredientIndex <= 0 || !recipe.ingredients) return recipe;

        const modifiedRecipe = { ...recipe };
        modifiedRecipe.ingredients = [...recipe.ingredients];
        const [matchedIngredient] = modifiedRecipe.ingredients.splice(bestIngredientIndex, 1);
        modifiedRecipe.ingredients.unshift(matchedIngredient);
        return modifiedRecipe;
    };

    const matchesFilters = (recipe, score) => {
        const matchesTechLevel = !selectedTech.techLevel ||
            (recipe.techLevels && recipe.techLevels[selectedTech.techLevel] === selectedTech.level);

        const validSearch = debouncedSearchTerm.length >= 3 || selectedTech.techLevel || !debouncedSearchTerm;
        const matchesSearch = !debouncedSearchTerm || score < 9999;

        return matchesTechLevel && matchesSearch && validSearch;
    };

    const getNoResultsMessage = () => {
        if (!selectedTech.techLevel && (!debouncedSearchTerm || debouncedSearchTerm.length < 3)) {
            return "Enter at least 3 characters to search recipes or select a tech level.";
        }
        return "No matching recipes found.";
    };

    const filteredAndSortedRecipes = useMemo(() => {
        if (!selectedTech.techLevel && !debouncedSearchTerm) return [];

        return recipes
            .map(recipe => {
                const [score, bestIngredientIndex] = getMatchScore(recipe, debouncedSearchTerm);
                const modifiedRecipe = getModifiedRecipe(recipe, bestIngredientIndex);
                return { recipe: modifiedRecipe, score };
            })
            .filter(({ recipe, score }) => matchesFilters(recipe, score))
            .sort((a, b) => {
                if (a.score !== b.score) return a.score - b.score;
                return (a.recipe.name || '').localeCompare(b.recipe.name || '');
            })
            .map(({ recipe }) => recipe);
    }, [recipes, debouncedSearchTerm, selectedTech]);

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
                    techs={TECH_LEVELS}
                    selectedTech={selectedTech}
                    setSelectedTech={handleTechLevelChange}
                />
            </div>
            <div className="recipe-list-container">
                {filteredAndSortedRecipes.length > 0 ? (
                    filteredAndSortedRecipes.map((recipe, index) => (
                        <Recipe key={`${recipe.prefab}-${index}`} recipe={recipe} />
                    ))
                ) : (
                    <div className="loading">{getNoResultsMessage()}</div>
                )}
            </div>
        </div>
    );
};

export default RecipeList;