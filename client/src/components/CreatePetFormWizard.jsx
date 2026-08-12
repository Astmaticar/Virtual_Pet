import { useState } from 'react';
import { usePet } from '../context/PetContext';
import './CreatePetFormWizard.css';

// Konstante za vrste, varijante i boje
const SPECIES_LIST = ['dog', 'cat', 'bird', 'rabbit'];

const SPECIES_LABELS = {
  dog: 'Pas',
  cat: 'Mačka',
  bird: 'Ptica',
  rabbit: 'Zec',
};

const getPetImage = (species, size = 'large') => {
  const sizeClass = size === 'small' ? 'wizard-pet-image-small' : 'wizard-pet-image';
  return (
    <img
      src={`/src/assets/pets/${species}.png`}
      alt={SPECIES_LABELS[species]}
      className={sizeClass}
      loading="lazy"
    />
  );
};

const VARIANTS_BY_SPECIES = {
  dog: ['brown', 'black', 'white', 'golden'],
  cat: ['gray', 'black', 'white', 'orange'],
  bird: ['blue', 'yellow', 'green', 'red'],
  rabbit: ['white', 'brown', 'gray', 'black'],
};

const VARIANT_LABELS = {
  brown: 'Smeđi',
  black: 'Crni',
  white: 'Bijeli',
  golden: 'Zlatni',
  gray: 'Sivi',
  orange: 'Narančasti',
  blue: 'Plava',
  yellow: 'Žuta',
  green: 'Zelena',
  red: 'Crvena',
};

const COLOR_MAP = {
  brown: '#8B4513',
  black: '#2C2C2C',
  white: '#F5F5F5',
  golden: '#FFD700',
  gray: '#A9A9A9',
  orange: '#FF8C00',
  blue: '#4169E1',
  yellow: '#FFD700',
  green: '#32CD32',
  red: '#FF6347',
};

const GENDER_LABELS = {
  male: 'Mužjak',
  female: 'Ženka',
};

const GENDER_SYMBOLS = {
  male: '♂',
  female: '♀',
};

const GENDER_COLORS = {
  male: '#4A90E2',
  female: '#E85D9A',
};

const CreatePetFormWizard = () => {
  const { createPet, actionLoading, error } = usePet();

  // State za sve korake
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState('dog');
  const [selectedVariant, setSelectedVariant] = useState('brown');
  const [selectedGender, setSelectedGender] = useState('male');
  const [petName, setPetName] = useState('');

  // Navigacija kroz vrste (beskonačna petlja)
  const handleSpeciesChange = (direction) => {
    const currentIndex = SPECIES_LIST.indexOf(selectedSpecies);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % SPECIES_LIST.length;
    } else {
      newIndex = (currentIndex - 1 + SPECIES_LIST.length) % SPECIES_LIST.length;
    }

    const newSpecies = SPECIES_LIST[newIndex];
    setSelectedSpecies(newSpecies);

    // Resetiraj varijantu na prvu dostupnu za novu vrstu
    setSelectedVariant(VARIANTS_BY_SPECIES[newSpecies][0]);
  };

  // Navigacija kroz varijante (beskonačna petlja)
  const handleVariantChange = (direction) => {
    const variants = VARIANTS_BY_SPECIES[selectedSpecies];
    const currentIndex = variants.indexOf(selectedVariant);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % variants.length;
    } else {
      newIndex = (currentIndex - 1 + variants.length) % variants.length;
    }

    setSelectedVariant(variants[newIndex]);
  };

  // Navigacija između koraka
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Završna akcija - slanje podataka
  const handleSubmit = async () => {
    if (!petName.trim()) {
      return;
    }

    await createPet(petName.trim(), selectedSpecies, selectedVariant, selectedGender);
  };

  return (
    <div className="wizard-container">
      {/* Progress Indicator */}
      <div className="wizard-progress">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`progress-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          />
        ))}
      </div>

      {/* Device Frame */}
      <div className="wizard-device-frame">
        <div className="wizard-screen">
          {/* KORAK 1 - Odabir vrste */}
          {currentStep === 1 && (
            <div className="wizard-step step-species">
              <h2 className="wizard-title">Odaberi vrstu</h2>
              <div className="wizard-content">
                <button
                  className="wizard-arrow-btn wizard-arrow-prev"
                  onClick={() => handleSpeciesChange('prev')}
                  type="button"
                  aria-label="Prethodna vrsta"
                >
                  ‹
                </button>

                <div className="wizard-emoji-display">
                  {getPetImage(selectedSpecies)}
                </div>

                <button
                  className="wizard-arrow-btn wizard-arrow-next"
                  onClick={() => handleSpeciesChange('next')}
                  type="button"
                  aria-label="Sljedeća vrsta"
                >
                  ›
                </button>
              </div>

              <div className="wizard-label">{SPECIES_LABELS[selectedSpecies]}</div>
            </div>
          )}

          {/* KORAK 2 - Odabir varijante */}
          {currentStep === 2 && (
            <div className="wizard-step step-variant">
              <h2 className="wizard-title">Odaberi boju</h2>
              <div className="wizard-content">
                <button
                  className="wizard-arrow-btn wizard-arrow-prev"
                  onClick={() => handleVariantChange('prev')}
                  type="button"
                  aria-label="Prethodna boja"
                >
                  ‹
                </button>

                <div
                  className="wizard-emoji-display variant-preview"
                  style={{
                    background: COLOR_MAP[selectedVariant],
                  }}
                >
                  {getPetImage(selectedSpecies)}
                </div>

                <button
                  className="wizard-arrow-btn wizard-arrow-next"
                  onClick={() => handleVariantChange('next')}
                  type="button"
                  aria-label="Sljedeća boja"
                >
                  ›
                </button>
              </div>

              <div className="wizard-label">{VARIANT_LABELS[selectedVariant]}</div>
            </div>
          )}

          {/* KORAK 3 - Odabir spola */}
          {currentStep === 3 && (
            <div className="wizard-step step-gender">
              <h2 className="wizard-title">Odaberi spol</h2>
              <div className="wizard-content gender-buttons">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    className={`gender-btn ${selectedGender === gender ? 'active' : ''}`}
                    onClick={() => setSelectedGender(gender)}
                    style={{
                      borderColor: GENDER_COLORS[gender],
                      ...(selectedGender === gender && {
                        backgroundColor: GENDER_COLORS[gender],
                        color: 'white',
                      }),
                    }}
                    type="button"
                  >
                    <span className="gender-symbol">{GENDER_SYMBOLS[gender]}</span>
                    <span className="gender-text">{GENDER_LABELS[gender]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KORAK 4 - Unos imena */}
          {currentStep === 4 && (
            <div className="wizard-step step-name">
              <h2 className="wizard-title">Kako će se zvati?</h2>
              <div className="wizard-content">
                <div
                  className="wizard-emoji-display variant-preview name-preview"
                  style={{
                    background: COLOR_MAP[selectedVariant],
                  }}
                >
                  {getPetImage(selectedSpecies, 'small')}
                </div>

                <input
                  type="text"
                  className="wizard-name-input"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="npr. Luna, Max, Tweety..."
                  maxLength="30"
                />

                {error && <div className="wizard-error">{error}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="wizard-nav">
        <button
          className="wizard-nav-btn wizard-btn-back"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          type="button"
        >
          Natrag
        </button>

        {currentStep < 4 ? (
          <button
            className="wizard-nav-btn wizard-btn-next"
            onClick={handleNextStep}
            type="button"
          >
            Dalje
          </button>
        ) : (
          <button
            className="wizard-nav-btn wizard-btn-submit"
            onClick={handleSubmit}
            disabled={!petName.trim() || actionLoading}
            type="button"
          >
            {actionLoading ? 'Stvaram...' : 'Stvori ljubimca!'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePetFormWizard;
