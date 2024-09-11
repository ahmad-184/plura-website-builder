export function getRandomColor(baseColor: string) {
  // Convert base color from hex to RGB
  let r = parseInt(baseColor.slice(1, 3), 16);
  let g = parseInt(baseColor.slice(3, 5), 16);
  let b = parseInt(baseColor.slice(5, 7), 16);

  // Generate random variations
  r = Math.min(255, Math.max(0, r + Math.floor(Math.random() * 50 - 25)));
  g = Math.min(255, Math.max(0, g + Math.floor(Math.random() * 50 - 25)));
  b = Math.min(255, Math.max(0, b + Math.floor(Math.random() * 50 - 25)));

  // Convert back to hex
  const newColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
  return newColor;
}
