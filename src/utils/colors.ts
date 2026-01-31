
export const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // We want colors that look good in dark mode (not too dark, not too bright)
    // Let's use HSL to control saturation and lightness
    const h = Math.abs(hash % 360);
    const s = 70; // High saturation for vivid colors
    const l = 60; // Medium lightness to pop against dark background

    return `hsl(${h}, ${s}%, ${l}%)`;
};
