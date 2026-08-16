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

  const criticalStatRates = {
    hunger: hungerPerMinute,
    cleanliness: cleanlinessPerMinute,
    happiness: happinessPerMinute,
  };

  const zeroTimestamps = Object.keys(criticalStatRates)
    .filter((stat) => updatedStats[stat] <= 0)
    .map((stat) => {
      const previousValue = Number(pet[stat]) || 0;
      const minutesToZero = previousValue > 0 ? previousValue / criticalStatRates[stat] : 0;
      return new Date(lastUpdated.getTime() + minutesToZero * 60 * 1000);
    });

  const criticalSince = zeroTimestamps.length === 3
    ? new Date(Math.max(...zeroTimestamps.map((timestamp) => timestamp.getTime())))
    : null;

  const allCriticalZero = criticalSince !== null;
  const CRITICAL_THRESHOLD_HOURS = 6;

  const isRunAway = allCriticalZero && (now - criticalSince) >= CRITICAL_THRESHOLD_HOURS * 60 * 60 * 1000;

  return {
    ...updatedStats,
    isRunAway,
    criticalSince,
    growthStageBeforeRunAway: isRunAway ? pet.growthStage : null,
  };
};

module.exports = {
  calculateDecay,
};
