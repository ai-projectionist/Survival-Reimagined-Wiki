// Function to format element names
export const formatDisplayName = (name) => {
    if (!name) return ''
    // Remove .tex extension, replace underscores with spaces, capitalize words
    const formatted = name
        .replace(/\.tex$/, '')
        .split('_')
        .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '') // Add check for empty word after split
        .join(' ');
    return formatted;
}; 