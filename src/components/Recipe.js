import React from 'react';
import CroppedImage from './CroppedImage';
import './Recipe.css';

const Recipe = ({ recipe }) => {
    return (
        <div className="recipe">
            <div className="result-item">
                <CroppedImage
                    atlasName={recipe.prefab}
                    displayName={recipe.name}
                />
            </div>
            <span className="equals">=</span>
            <div className="ingredients">
                {recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient) => (
                        <div className="ingredient-item" key={ingredient.prefab}>
                            <CroppedImage
                                atlasName={ingredient.prefab}
                                displayName={ingredient.name}
                            />
                            {ingredient.amount > 1 && (
                                <span className="amount">{ingredient.amount}</span>
                            )}
                        </div>
                    ))
                ) : (
                    <span className="no-ingredients">(No ingredients listed)</span>
                )}
            </div>
            {recipe.techLevels && Object.keys(recipe.techLevels).length > 0 && (
                <div className="tech-levels">
                    {Object.entries(recipe.techLevels).map(([tech, level]) => (
                        <span key={tech} className="tech-level" title={`Requires ${tech} level ${level}`}>
                            {tech} {level}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recipe; 