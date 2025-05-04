import React, { useContext } from 'react';
import CroppedImage from './CroppedImage';
import './Recipe.css';
import { TECH_LEVELS } from '../config/atlasConfig';
import { AtlasContext } from '../context';

const Recipe = ({ recipe }) => {
    const { recipes } = useContext(AtlasContext);

    const findIngredientRecipe = (ingredient) => {
        return recipes.find(r => r.prefab === ingredient.prefab);
    };

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
                                tooltipContent={
                                    <div>
                                        {findIngredientRecipe(ingredient)?.ingredients?.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                                                {findIngredientRecipe(ingredient).ingredients.map((r) => (
                                                    <div key={r.prefab} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <CroppedImage
                                                            atlasName={r.prefab}
                                                            displayName={r.name}
                                                        />
                                                        {r.amount > 1 && (
                                                            <span style={{ marginLeft: '2px' }}>x{r.amount}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>{ingredient.name.replace(/\*/g, '')}</div>
                                        )}
                                    </div>
                                }
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
                    {Object.entries(recipe.techLevels).map(([techLevel, level]) => {
                        const tech = TECH_LEVELS.find(t => t.techLevel === techLevel && t.level === level);
                        return (
                            <span key={`${techLevel}-${level}`} className="tech-level">
                                {tech?.name || techLevel}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Recipe; 