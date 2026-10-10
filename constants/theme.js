export const Theme = {
  colors: {
    paper: '#FFFCF6',
    ink: '#3E3A39',
    coral: '#F2A497',
    yellow: '#F6D27A',
    blue: '#A8D3E6',
    green: '#B9DAA5',
    lilac: '#D8C7E8',
    white: '#FFFFFF',
    muted: '#857A75',
    line: '#E6DCD3',
    danger: '#D7796E',
  },
  radius: {
    card: 24,
    small: 14,
    pill: 999,
  },
  fontFamily: 'Huninn',
};

export const categoryPalette = [
  Theme.colors.coral,
  Theme.colors.blue,
  Theme.colors.yellow,
  Theme.colors.green,
  Theme.colors.lilac,
];

export function categoryColor(category = '') {
  const key = category.toLowerCase();
  if (key.includes('food') || key.includes('drink')) return Theme.colors.coral;
  if (key.includes('transport')) return Theme.colors.blue;
  if (key.includes('shop')) return Theme.colors.yellow;
  if (key.includes('bill')) return Theme.colors.green;
  if (key.includes('entertain')) return Theme.colors.lilac;
  return categoryPalette[Math.abs(category.length) % categoryPalette.length];
}

export function categoryLabel(category = 'Others') {
  const key = category.toLowerCase();
  if (key === 'food') return 'Food & Drinks';
  if (key === 'transport') return 'Transportation';
  return category || 'Others';
}
