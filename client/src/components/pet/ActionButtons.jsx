import { usePet } from '../../context/PetContext';
import './ActionButtons.css';

const ActionButtons = () => {
  const { feed, clean, play, actionLoading } = usePet();

  return (
    <div className="action-buttons">
      <button type="button" onClick={feed} disabled={actionLoading}>
        Nahrani
      </button>
      <button type="button" onClick={clean} disabled={actionLoading}>
        Očisti
      </button>
      <button type="button" onClick={play} disabled={actionLoading}>
        Igraj se
      </button>
    </div>
  );
};

export default ActionButtons;
