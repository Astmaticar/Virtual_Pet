const calculateDecay = (pet) => {
  const now = new Date();
  const lastUpdated = new Date(pet.lastUpdated);

  // Izračunaj koliko je minuta prošlo od zadnjeg ažuriranja
  const minutesPassed = Math.max(0, (now - lastUpdated) / (1000 * 60));

  // BRZO TESTIRANJE: Parametri padaju 100 po minuti
  // Za produkciju: promijeniti na hoursPassed * konstante
  const updatedStats = {
    hunger: Math.max(0, pet.hunger - minutesPassed * 100),
    cleanliness: Math.max(0, pet.cleanliness - minutesPassed * 100),
    happiness: Math.max(0, pet.happiness - minutesPassed * 100),
    energy: Math.min(100, pet.energy + minutesPassed * 50),
  };

  // Provjera run away logike
  let runAwayInfo = {
    isRunAway: pet.isRunAway || false,
    criticalSince: pet.criticalSince || null,
  };

  // Ako su svi tri kritična stata <= 0
  const allCriticalZero =
    updatedStats.hunger <= 0 &&
    updatedStats.cleanliness <= 0 &&
    updatedStats.happiness <= 0;

  if (allCriticalZero) {
    // Ako nema criticalSince, postavi ga na sad
    if (!runAwayInfo.criticalSince) {
      runAwayInfo.criticalSince = now;
    }

    // Provjeri je li prošlo više od 1 sekunde (za brzo testiranje)
    const secondsPassed = (now - new Date(runAwayInfo.criticalSince)) / 1000;
    const CRITICAL_THRESHOLD_SECONDS = 5; // 5 sekundi za testiranje

    if (secondsPassed >= CRITICAL_THRESHOLD_SECONDS) {
      runAwayInfo.isRunAway = true;
      // Spremi trenutni growth stage prije nego što pet pobjegne
      runAwayInfo.growthStageBeforeRunAway = pet.growthStage;
    }
  } else {
    // Ako bilo koji stat poraste iznad 0, resetiraj criticalSince
    runAwayInfo.criticalSince = null;
  }

  return {
    ...updatedStats,
    isRunAway: runAwayInfo.isRunAway,
    criticalSince: runAwayInfo.criticalSince,
    growthStageBeforeRunAway: runAwayInfo.growthStageBeforeRunAway || null,
  };
};

module.exports = {
  calculateDecay,
};
