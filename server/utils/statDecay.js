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
    // Energy se regenerira kroz vrijeme (simulira odmor), a ne opada kao ostali statovi.
    // Energy se smanjuje samo kad se igra (playWithPet), zato ovdje povećavamo energy
    // za +3 po satu, ali ne prelazimo gornju granicu od 100.
    energy: Math.min(100, pet.energy + hoursPassed * 3),
  };

  return updatedStats;
};

module.exports = {
  calculateDecay,
};
