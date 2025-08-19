import React from 'react';
import { type Occurrence } from '../models/types';
import Button from '../components/Button';

interface OccurrencesViewProps {
  occurrences: Occurrence[];
  onBack: () => void;
}

const OccurrencesView: React.FC<OccurrencesViewProps> = ({ occurrences, onBack }) => {

  const getStatusColor = (status: Occurrence['status']) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'iniciada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Acompanhamento de Ocorrências
          </h1>
          <Button label="Voltar para o Painel" onClick={onBack} className="bg-blue-500 text-white hover:bg-blue-600" />
        </div>

        {occurrences.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Nenhuma ocorrência encontrada para este animal.
          </div>
        ) : (
          <div className="space-y-4">
            {occurrences.map(occurrence => (
              <div key={occurrence.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{occurrence.title}</h2>
                  <p className="text-gray-600 text-sm">{occurrence.details}</p>
                  <p className="text-gray-400 text-xs mt-2">Data: {occurrence.timestamp}</p>
                </div>
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(occurrence.status)}`}>
                    {occurrence.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OccurrencesView;
