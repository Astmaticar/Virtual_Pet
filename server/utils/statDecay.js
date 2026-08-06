const calculateDecay = (pet) => {
  const now = new Date();
  const lastUpdated = new Date(pet.lastUpdated);

  // Izračunaj koliko je sati prošlo od zadnjeg ažuriranja
  const hoursPassed = Math.max(0, (now - lastUpdated) / (1000 * 60 * 60));

  // Za svaki sat smanji statove prema zadanim vrijednostima
  const updatedStats = {
    hunger: Math.max(0, pet.hunger - hoursPassed * 2),
    cleanliness: Math.max(0, pet.cleanliness - hoursPassed * 1.5),
    happiness: Math.max(0, pet.happiness - hoursPassed * 1),
    energy: Math.max(0, pet.energy - hoursPassed * 1),
  };

  return updatedStats;
};

module.exports = {
  calculateDecay,
};
