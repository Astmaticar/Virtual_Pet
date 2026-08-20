const calculateDecay = (pet) => {
  const now = new Date();
  const lastUpdated = new Date(pet.lastUpdated || Date.now());
  const minutesPassed = Math.max(0, (now - lastUpdated) / (1000 * 60));

  const hungerPerMinute = 100 / (24 * 60);
  const cleanlinessPerMinute = 100 / (30 * 60);
  const happinessPerMinute = 100 / (36 * 60);
  const energyPerMinute = 3 / 60;

  const updatedStats = {
    hunger: Math.max(0, pet.hunger - minutesPassed * hungerPerMinute),
    cleanliness: Math.max(0, pet.cleanliness - minutesPassed * cleanlinessPerMinute),
    happiness: Math.max(0, pet.happiness - minutesPassed * happinessPerMinute),
    energy: Math.min(100, pet.energy + minutesPassed * energyPerMinute),
  };

  return {
    ...updatedStats,
    isDead: updatedStats.hunger <= 0
      && updatedStats.cleanliness <= 0
      && updatedStats.happiness <= 0,
  };
};

module.exports = {
  calculateDecay,
};
