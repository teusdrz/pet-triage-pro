import React, { useState } from 'react';
import DashboardView from './views/DashboardView';
import LoadingView from './views/LoadingView';
import OccurrenceFormView from './views/OccurrenceFormView';
import ChatView from './views/ChatView';
import OccurrencesView from './views/OccurrencesView';
import { type Pet, type LoadingState, type Occurrence } from './models/types';
import './index.css';

// Import the pet images directly from the assets folder.
import bobImage from './assets/Retrato alegre de Bob, o Retriever.png';
import marfimImage from './assets/Gato de olhar dourado e suave.png';
import miloImage from './assets/ChatGPT Image 18 de ago. de 2025, 20_17_53.png';

// Placeholder data
const initialPets: Pet[] = [
  { id: '1', name: 'Bob', photoUrl: bobImage, triageScore: 80, occurrencesCount: 2 },
  { id: '2', name: 'Marfim', photoUrl: marfimImage, triageScore: 60, occurrencesCount: 1 },
  { id: '3', name: 'Milo', photoUrl: miloImage, triageScore: 30, occurrencesCount: 3 },
];

const initialOccurrences: Occurrence[] = [
  { id: 'occ1', petId: '1', title: 'Mancha na pele', status: 'concluida', details: 'Exame de pele realizado e tratamento iniciado.', timestamp: '2025-08-18' },
  { id: 'occ2', petId: '1', title: 'Febre', status: 'em andamento', details: 'Medicação prescrita, aguardando melhora.', timestamp: '2025-08-19' },
  { id: 'occ3', petId: '2', title: 'Perda de apetite', status: 'concluida', details: 'Mudança na dieta e observação.', timestamp: '2025-08-17' },
  { id: 'occ4', petId: '3', title: 'Tosse persistente', status: 'iniciada', details: 'Primeira consulta agendada para o dia 22/08.', timestamp: '2025-08-19' },
  { id: 'occ5', petId: '3', title: 'Inchaço na pata', status: 'em andamento', details: 'Aplicando compressas e aguardando retorno.', timestamp: '2025-08-18' },
  { id: 'occ6', petId: '3', title: 'Comportamento estranho', status: 'concluida', details: 'O animal está com medo de um novo brinquedo.', timestamp: '2025-08-17' },
];

const App: React.FC = () => {
  // Movendo os dados para o estado do componente
  const [view, setView] = useState<'dashboard' | 'loading' | 'form' | 'chat' | 'occurrences'>('dashboard');
  const [loadingState, setLoadingState] = useState<LoadingState>({ progress: 0, message: '' });
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(initialOccurrences);

  const handleNewOccurrence = (petId: string) => {
    setSelectedPetId(petId);
    setView('form');
  };
  
  const handleFormSubmit = (data: any) => {
    setView('loading');
    setLoadingState({ progress: 10, message: 'Submitting occurrence...' });
    
    // Gerar um ID de ocorrência simples (para fins de demonstração)
    const newOccurrenceId = `occ${occurrences.length + 1}`;
    const newOccurrence: Occurrence = {
      id: newOccurrenceId,
      petId: data.selectedPetId,
      title: 'Nova Ocorrência', // Pode ser alterado para um campo do formulário
      status: 'em andamento', // Define o status inicial
      details: data.description, // Pega a descrição do formulário
      timestamp: new Date().toISOString().slice(0, 10), // Data atual
    };

    // Adiciona a nova ocorrência à lista de ocorrências
    const updatedOccurrences = [...occurrences, newOccurrence];
    setOccurrences(updatedOccurrences);

    // Atualiza a contagem de ocorrências do pet no estado de pets
    const updatedPets = pets.map(pet => {
      if (pet.id === data.selectedPetId) {
        return { ...pet, occurrencesCount: pet.occurrencesCount + 1 };
      }
      return pet;
    });
    setPets(updatedPets);

    let progress = 10;
    const interval = setInterval(() => {
      progress += 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setView('dashboard');
        }, 500);
      }
      setLoadingState({ progress, message: 'Submitting occurrence...' });
    }, 500);
  };
  
  const handleCancelForm = () => {
    setView('dashboard');
  };

  const handleAddPet = () => {
    console.log('Adicionando um novo animal...');
  };
  
  const handleChatWithVet = () => {
    setView('chat');
  };
  
  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  const handleViewOccurrences = (petId: string) => {
    setSelectedPetId(petId);
    setView('occurrences');
  };

  // Filtra as ocorrências do animal selecionado com base no estado
  const selectedPetOccurrences = selectedPetId
    ? occurrences.filter(occ => occ.petId === selectedPetId)
    : [];

  return (
    <>
      {view === 'dashboard' && (
        <DashboardView 
          pets={pets} // Passando o estado 'pets' para o DashboardView
          onAddPet={handleAddPet}
          onNewOccurrence={handleNewOccurrence}
          onChatWithVet={handleChatWithVet}
          onViewOccurrences={handleViewOccurrences}
        />
      )}
      {view === 'form' && (
        <OccurrenceFormView
          pets={pets} // Passando o estado 'pets' para o formulário
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          selectedPetId={selectedPetId}
        />
      )}
      {view === 'loading' && <LoadingView loadingState={loadingState} />}
      {view === 'chat' && <ChatView onBack={handleBackToDashboard} pets={[]} />}
      {view === 'occurrences' && (
        <OccurrencesView
          occurrences={selectedPetOccurrences}
          onBack={handleBackToDashboard}
        />
      )}
    </>
  );
};

export default App;
