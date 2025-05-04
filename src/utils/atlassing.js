import { XMLParser } from 'fast-xml-parser';
import { ATLAS_XML_FILES } from '../config/atlasConfig';

export const readInventoryImages = async () => {
    try {
        const allAtlasResults = [];
        for (const file of ATLAS_XML_FILES) {
            const response = await fetch(process.env.PUBLIC_URL + file);
            if (!response.ok) {
                throw new Error(`Atlas XML fetch failed for ${file}: ${response.status}`);
            }
            const xmlText = await response.text();

            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "", parseAttributeValue: true });
            const jsonObj = parser.parse(xmlText);
            const fileData = {};

            if (jsonObj?.Atlas?.Elements?.Element) {
                const textureFilename = jsonObj.Atlas.Texture.filename.replace('.tex', '.png');
                const elements = Array.isArray(jsonObj.Atlas.Elements.Element)
                    ? jsonObj.Atlas.Elements.Element
                    : [jsonObj.Atlas.Elements.Element];

                elements.forEach(element => {
                    const name = element.name;
                    if (name && element.u1 != null && element.u2 != null && element.v1 != null && element.v2 != null) {
                        const cleanName = name.replace('.tex', '');
                        fileData[cleanName] = {
                            u1: element.u1,
                            u2: element.u2,
                            v1: element.v1,
                            v2: element.v2,
                            texture: textureFilename,
                            displayName: cleanName
                        };
                    }
                });
            }
            allAtlasResults.push(fileData);
        }

        // Combine atlas data from all files
        return allAtlasResults.reduce((acc, currentAtlas) => {
            return { ...acc, ...currentAtlas };
        }, {});

    } catch (err) {
        console.error("Error fetching atlas data:", err);
        return {};
    }
};

export const readRecipeData = async () => {
    try {
        const response = await fetch(process.env.PUBLIC_URL + '/prefab_data/survival_reimagined.json');
        if (!response.ok) {
            throw new Error(`Recipe JSON fetch failed: ${response.status}`);
        }
        const recipeData = await response.json();

        // Transform data to match the new structure
        const transformedData = recipeData.map(recipe => {
            // Get ingredients array from the new structure
            const ingredients = (recipe.ingredients?.ingredients || [])
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(ingredient => ({
                    name: ingredient.name,
                    prefab: ingredient.prefab,
                    amount: ingredient.count
                }));

            // Get tech levels if they exist
            const techLevels = recipe.ingredients?.tech_levels || {};

            return {
                name: recipe.name,
                prefab: recipe.prefab,
                ingredients: ingredients,
                techLevels: techLevels
            };
        });

        // Sort recipes alphabetically by name
        const sortedRecipeData = transformedData.sort((a, b) => {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
        });

        return sortedRecipeData;
    } catch (err) {
        console.error("Error fetching or sorting recipe data:", err);
        return []; // Return empty array on error
    }
};
