const Pet = require('../models/Pet');
const { calculateDecay } = require('../utils/statDecay');

// Pomoćna funkcija za ažuriranje faze rasta na temelju levela
const updateGrowthStage = (pet) => {
  const oldStage = pet.growthStage;
  let newStage = 'baby';

  if (pet.level >= 10) {
    newStage = 'adult';
  } else if (pet.level >= 5) {
    newStage = 'child';
  }

  pet.growthStage = newStage;

  return {
    hasEvolved: oldStage !== newStage,
    oldStage,
    newStage,
  };
};

const checkLevelUp = (pet) => {
  let evolution = null;

  if (pet.xp >= pet.level * 100) {
    pet.level += 1;
    pet.xp = 0;
    evolution = updateGrowthStage(pet);
  }

  return {
    leveledUp: evolution !== null,
    evolution,
  };
};

exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ owner: req.user });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const updatedStats = calculateDecay(pet);

    pet.hunger = updatedStats.hunger;
    pet.cleanliness = updatedStats.cleanliness;
    pet.happiness = updatedStats.happiness;
    pet.energy = updatedStats.energy;
    pet.lastUpdated = new Date();

    await pet.save();

    res.status(200).json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPet = async (req, res) => {
  try {
    const { name, species, variant, gender } = req.body;

    // Validacija enum vrijednosti
    const validSpecies = ['dog', 'cat', 'bird', 'rabbit'];
    const validGenders = ['male', 'female'];

    if (!species || !validSpecies.includes(species)) {
      return res.status(400).json({ 
        message: `Neispravna vrsta ljubimca. Dozvoljene vrijednosti: ${validSpecies.join(', ')}` 
      });
    }

    if (!gender || !validGenders.includes(gender)) {
      return res.status(400).json({ 
        message: `Neispravan spol. Dozvoljene vrijednosti: ${validGenders.join(', ')}` 
      });
    }

    if (!variant) {
      return res.status(400).json({ 
        message: 'Varijanta je obavezna' 
      });
    }

    const existingPet = await Pet.findOne({ owner: req.user });
    if (existingPet) {
      return res.status(400).json({ message: 'Pet already exists for this user' });
    }

    const pet = await Pet.create({
      owner: req.user,
      name: name || 'Milo',
      species,
      variant,
      gender,
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.feedPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ owner: req.user });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const prevHunger = typeof pet.hunger === 'number' ? pet.hunger : 0;
    const newHunger = Math.min(100, prevHunger + 20);

    if (newHunger > prevHunger) {
      pet.hunger = newHunger;
      pet.lastUpdated = new Date();
      pet.xp += 5;
      const levelUpResult = checkLevelUp(pet);

      await pet.save();

      const response = {
        ...pet.toObject(),
        leveledUp: levelUpResult.leveledUp,
      };

      if (levelUpResult.evolution && levelUpResult.evolution.hasEvolved) {
        response.hasEvolved = true;
        response.newStage = levelUpResult.evolution.newStage;
      }

      return res.status(200).json(response);
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Feed pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cleanPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ owner: req.user });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const prevClean = typeof pet.cleanliness === 'number' ? pet.cleanliness : 0;
    const newClean = Math.min(100, prevClean + 25);

    if (newClean > prevClean) {
      pet.cleanliness = newClean;
      pet.lastUpdated = new Date();
      pet.xp += 5;
      const levelUpResult = checkLevelUp(pet);

      await pet.save();

      const response = {
        ...pet.toObject(),
        leveledUp: levelUpResult.leveledUp,
      };

      if (levelUpResult.evolution && levelUpResult.evolution.hasEvolved) {
        response.hasEvolved = true;
        response.newStage = levelUpResult.evolution.newStage;
      }

      return res.status(200).json(response);
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error('Clean pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.playWithPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ owner: req.user });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    // Prevent playing if pet has no energy
    if (typeof pet.energy === 'number' && pet.energy <= 0) {
      return res.status(400).json({ message: 'Ljubimac je premoren za igru, pusti ga da se odmori' });
    }

    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 10);
    pet.lastUpdated = new Date();
    pet.xp += 10;
    const levelUpResult = checkLevelUp(pet);

    await pet.save();

    const response = {
      ...pet.toObject(),
      leveledUp: levelUpResult.leveledUp,
    };

    if (levelUpResult.evolution && levelUpResult.evolution.hasEvolved) {
      response.hasEvolved = true;
      response.newStage = levelUpResult.evolution.newStage;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Play with pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
