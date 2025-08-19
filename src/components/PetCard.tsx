import React from 'react';
import { type Pet } from '../models/types';
import Button from './Button';
import AnimatedCircularProgress from './AnimatedCircularProgress';

interface PetCardProps {
  pet: Pet;
  onNewOccurrence: () => void;
  // Nova propriedade para lidar com o clique no número de ocorrências
  onViewOccurrences: (petId: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onNewOccurrence, onViewOccurrences }) => {
  const getTriageColor = (score: number) => {
    return 'text-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center space-y-4 relative">
      <div className="relative">
        {/* Novo botão para exibir a contagem de ocorrências */}
        <button
          onClick={() => onViewOccurrences(pet.id)}
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {pet.occurrencesCount}
        </button>
        <div className="w-40 h-40 rounded-full overflow-hidden">
          <img
            src={pet.photoUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <AnimatedCircularProgress percentage={pet.triageScore} label="" color={getTriageColor(pet.triageScore)} />
      <h2 className="text-xl font-semibold text-gray-800 mt-2">{pet.name}</h2>
      <Button
        label="+ Nova Ocorrência"
        onClick={onNewOccurrence}
        className="bg-blue-600 text-white hover:bg-blue-700"
      />
    </div>
  );
};

export default PetCard;
