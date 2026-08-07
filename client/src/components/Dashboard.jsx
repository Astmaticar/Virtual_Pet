import { PetProvider } from '../context/PetContext';
import PetDisplay from './pet/PetDisplay';
import PetStats from './pet/PetStats';
import ActionButtons from './pet/ActionButtons';
import './pet/PetDashboard.css';

const Dashboard = () => {
  return (
    <PetProvider>
      <div className="dashboard-wrapper">
        <div className="dashboard-grid">
          <PetDisplay />
          <PetStats />
        </div>
        <ActionButtons />
      </div>
    </PetProvider>
  );
};

export default Dashboard;
