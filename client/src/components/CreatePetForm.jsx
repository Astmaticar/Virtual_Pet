import { useState } from 'react';
import { usePet } from '../context/PetContext';
import './CreatePetForm.css';

const petOptions = [
  { id: 'bunny', emoji: '🐰', label: 'Zec', accent: 'Lagan i nježan', species: 'rabbit', variant: 'brown' },
  { id: 'cat', emoji: '🐱', label: 'Mačak', accent: 'Sneni i znatiželjan', species: 'cat', variant: 'gray' },
  { id: 'fox', emoji: '🦊', label: 'Lisica', accent: 'Pametan i šarmantan', species: 'dog', variant: 'red' },
  { id: 'penguin', emoji: '🐧', label: 'Pingvin', accent: 'Sretan i energičan', species: 'bird', variant: 'black' },
];

const CreatePetForm = () => {
  const [name, setName] = useState('');
  const [selectedPet, setSelectedPet] = useState(petOptions[0].id);
  const [gender, setGender] = useState('male');
  const { createPet, error, actionLoading } = usePet();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    const selectedPetOption = petOptions.find((pet) => pet.id === selectedPet);
    const { species, variant } = selectedPetOption;

    await createPet(name.trim(), species, variant, gender);
  };

  return (
    <div className="create-pet-card">
      <h2>Odaberi svog virtualnog prijatelja</h2>
      <p>Prvo izaberi jedan od slatkih lika, a zatim mu daj ime.</p>

      <div className="pet-choice-grid">
        {petOptions.map((pet) => (
          <button
            key={pet.id}
            type="button"
            className={`pet-choice ${selectedPet === pet.id ? 'selected' : ''}`}
            onClick={() => setSelectedPet(pet.id)}
          >
            <span className="pet-choice-emoji">{pet.emoji}</span>
            <span className="pet-choice-label">{pet.label}</span>
            <small>{pet.accent}</small>
          </button>
        ))}
      </div>

      <form className="create-pet-form" onSubmit={handleSubmit}>
        <label htmlFor="pet-name">Ime ljubimca</label>
        <input
          id="pet-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="npr. Luna"
          required
        />

        <label htmlFor="pet-gender">Spol</label>
        <select
          id="pet-gender"
          value={gender}
          onChange={(event) => setGender(event.target.value)}
        >
          <option value="male">Muško</option>
          <option value="female">Žensko</option>
        </select>

        {error && <div className="create-pet-error">{error}</div>}
        <button type="submit" disabled={actionLoading}>
          {actionLoading ? 'Stvaranje...' : 'Stvori ljubimca'}
        </button>
      </form>
    </div>
  );
};

export default CreatePetForm;
