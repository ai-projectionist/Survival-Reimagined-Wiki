import { formatDisplayName } from './formatting';

/**
 * Calculates a match score for a recipe based on the search term.
 * Lower score means better match.
 * @param {Object} recipe - The recipe object to score
 * @param {string} search - The search term
 * @returns {[number, number]} - [score, bestIngredientIndex]
 *   score: 0 = exact match on name/prefab
 *          1 = exact match on formatted name/prefab
 *          2 = partial match on name/prefab
 *          3 = partial match on formatted name/prefab
 *          4 = ingredient match
 *          9999 = no match
 *   bestIngredientIndex: index of best matching ingredient, or -1 if none
 */
export const getMatchScore = (recipe, search) => {
    // Lower is better
    const searchLower = search.toLowerCase();
    // Recipe name/prefab
    const name = (recipe.name || '').toLowerCase();
    const prefab = (recipe.prefab || '').toLowerCase();
    const nameDisplay = formatDisplayName(recipe.name || '').toLowerCase();
    const prefabDisplay = formatDisplayName(recipe.prefab || '').toLowerCase();

    // Check if any ingredient matches and get best matching ingredient
    let bestIngredientScore = 9999;
    let bestIngredientIndex = -1;
    recipe.ingredients?.forEach((ing, index) => {
        const ingName = (ing.name || '').toLowerCase();
        const ingPrefab = (ing.prefab || '').toLowerCase();

        // Score ingredient matches similar to recipe matches
        let score = 9999;
        if (ingName === searchLower || ingPrefab === searchLower) score = 0;
        else if (ingName.includes(searchLower) || ingPrefab.includes(searchLower)) score = 2;

        if (score < bestIngredientScore) {
            bestIngredientScore = score;
            bestIngredientIndex = index;
        }
    });

    // Prioritize exact matches on name/prefab
    if (name === searchLower || prefab === searchLower) return [0, bestIngredientIndex];
    if (nameDisplay === searchLower || prefabDisplay === searchLower) return [1, bestIngredientIndex];

    // Then partial matches on name/prefab
    if (name.includes(searchLower) || prefab.includes(searchLower)) return [2, bestIngredientIndex];
    if (nameDisplay.includes(searchLower) || prefabDisplay.includes(searchLower)) return [3, bestIngredientIndex];

    // Then ingredient matches
    if (bestIngredientScore < 9999) return [4, bestIngredientIndex];

    return [9999, -1]; // No match
};