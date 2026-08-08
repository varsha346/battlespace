export const STARTERS_BY_LEAGUE = {
  1: [
    { name: 'Bulbasaur', type: 'Grass', emoji: '🍃', spriteId: 1, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Charmander', type: 'Fire', emoji: '🔥', spriteId: 4, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Squirtle', type: 'Water', emoji: '💧', spriteId: 7, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  2: [
    { name: 'Chikorita', type: 'Grass', emoji: '🍃', spriteId: 152, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Cyndaquil', type: 'Fire', emoji: '🔥', spriteId: 155, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Totodile', type: 'Water', emoji: '💧', spriteId: 158, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  3: [
    { name: 'Treecko', type: 'Grass', emoji: '🍃', spriteId: 252, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Torchic', type: 'Fire', emoji: '🔥', spriteId: 255, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Mudkip', type: 'Water', emoji: '💧', spriteId: 258, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  4: [
    { name: 'Turtwig', type: 'Grass', emoji: '🍃', spriteId: 387, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Chimchar', type: 'Fire', emoji: '🔥', spriteId: 390, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Piplup', type: 'Water', emoji: '💧', spriteId: 393, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  5: [
    { name: 'Snivy', type: 'Grass', emoji: '🍃', spriteId: 495, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Tepig', type: 'Fire', emoji: '🔥', spriteId: 498, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Oshawott', type: 'Water', emoji: '💧', spriteId: 501, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  6: [
    { name: 'Chespin', type: 'Grass', emoji: '🍃', spriteId: 650, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Fennekin', type: 'Fire', emoji: '🔥', spriteId: 653, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Froakie', type: 'Water', emoji: '💧', spriteId: 656, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  7: [
    { name: 'Rowlet', type: 'Grass', emoji: '🍃', spriteId: 722, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Litten', type: 'Fire', emoji: '🔥', spriteId: 725, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Popplio', type: 'Water', emoji: '💧', spriteId: 728, color: '#6890F0', rgb: '104, 144, 240' }
  ],
  8: [
    { name: 'Grookey', type: 'Grass', emoji: '🍃', spriteId: 810, color: '#78C850', rgb: '120, 200, 80' },
    { name: 'Scorbunny', type: 'Fire', emoji: '🔥', spriteId: 813, color: '#F08030', rgb: '240, 128, 48' },
    { name: 'Sobble', type: 'Water', emoji: '💧', spriteId: 816, color: '#6890F0', rgb: '104, 144, 240' }
  ]
};

export const getStartersForLeague = (league) => {
  const index = ((league - 1) % 8) + 1;
  return STARTERS_BY_LEAGUE[index] || STARTERS_BY_LEAGUE[1];
};

export const getPokemonDetails = (name) => {
  if (!name) return null;
  const lowerName = name.toLowerCase();
  for (const list of Object.values(STARTERS_BY_LEAGUE)) {
    const found = list.find(p => p.name.toLowerCase() === lowerName);
    if (found) {
      return {
        ...found,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${found.spriteId}.png`
      };
    }
  }
  // Default fallback for Pikachu (example companion)
  if (lowerName === 'pikachu') {
    return {
      name: 'Pikachu',
      type: 'Electric',
      emoji: '⚡',
      spriteId: 25,
      color: '#F8D030',
      rgb: '248, 208, 48',
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png`
    };
  }
  return null;
};
