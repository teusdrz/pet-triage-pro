import React from 'react';
import PetCard from '../components/PetCard';
import Button from '../components/Button';
import { type Pet } from '../models/types';
import AnimatedCircularProgress from '../components/AnimatedCircularProgress';

interface DashboardViewProps {
  pets: Pet[];
  onAddPet: () => void;
  onNewOccurrence: (petId: string) => void;
  onChatWithVet: () => void;
  onViewOccurrences: (petId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ pets, onAddPet, onNewOccurrence, onChatWithVet, onViewOccurrences }) => {

  const getTriageColor = (score: number) => {
    return 'text-blue-500';
  };

  return (
    <div className="bg-gray-100 min-h-screen p-2 md:p-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-12 max-w-6xl">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="PetTriagePro Logo"
            className="w-12 h-12 md:w-16 md:h-16"
          />
          <h1 className="text-xl md:text-4xl font-bold text-gray-800">
            PetTriage<span className="text-blue-600">Pro</span>
          </h1>
        </div>
        <Button 
          label="Sign in with Google"
          className="bg-blue-600 text-white hover:bg-blue-700 text-xs md:text-base px-2 md:px-4 py-1 md:py-2" 
          onClick={() => {}}
        />
      </div>

      {/* Ajuste na classe do grid para layout lado a lado em telas pequenas, com gap reduzido */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 w-full max-w-6xl">
        {pets.map(pet => (
          <PetCard
            key={pet.id}
            pet={pet}
            onNewOccurrence={() => onNewOccurrence(pet.id)}
            onViewOccurrences={onViewOccurrences}
          />
        ))}
      </div>

      <div className="w-full max-w-xs mt-8 flex flex-col items-center space-y-4">
        <button
          onClick={onChatWithVet}
          className="flex items-center space-x-2 w-full px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 text-sm md:text-base"
        >
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 0 012 2v10zM7 9h10v2H7V9zm0 4h10v2H7v-2z" />
            </svg>
          </div>
          <span className="text-sm md:text-lg font-semibold text-gray-800">Entre no chat e converse com um veterinário</span>
        </button>

        <Button
          label="Cadastrar Animal"
          onClick={onAddPet}
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
        />
      </div>
    </div>
  );
};

export default DashboardView;
