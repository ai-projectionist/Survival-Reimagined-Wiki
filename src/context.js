import { createContext, useState } from 'react';
import { readInventoryImages, readRecipeData } from './utils/atlassing';
import { useEffect } from 'react';

export const AtlasContext = createContext();

export const AtlasProvider = ({ children }) => {
    const [inventoryAtlas, setInventoryAtlas] = useState({});
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchAtlasData = async () => {
            const atlasData = await readInventoryImages();
            setInventoryAtlas(atlasData);

            const recipeData = await readRecipeData();
            setRecipes(recipeData);
        };

        fetchAtlasData();
    }, []);

    return (
        <AtlasContext.Provider value={{ inventoryAtlas, recipes }}>{children}</AtlasContext.Provider>
    );
};
