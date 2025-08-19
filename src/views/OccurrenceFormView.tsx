import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { type Pet, type TriagePriority } from '../models/types';

interface OccurrenceFormViewProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  pets: Pet[];
  selectedPetId: string | null;
}

const OccurrenceFormView: React.FC<OccurrenceFormViewProps> = ({ onCancel, onSubmit, pets, selectedPetId }) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [urgency, setUrgency] = useState<TriagePriority>('common');
  const [description, setDescription] = useState<string>('');
  const [descriptionCount, setDescriptionCount] = useState<number>(0);
  const [media, setMedia] = useState<File[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedPetId) {
      const pet = pets.find(p => p.id === selectedPetId);
      if (pet) {
        setSelectedPet(pet);
      }
    }
  }, [selectedPetId, pets]);

  useEffect(() => {
    setDescriptionCount(description.length);
  }, [description]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedPet) {
      setIsSubmitting(true); // Set submitting state to true
      await onSubmit({ selectedPetId: selectedPet.id, urgency, description, media });
      setIsSubmitting(false); // Set submitting state to false after completion
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMedia(Array.from(event.target.files));
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setMedia(prevMedia => [...prevMedia, ...Array.from(event.dataTransfer.files)]);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderUrgencyOption = (label: string, priority: TriagePriority, color: string) => (
    <div className="flex items-center">
      <input
        type="radio"
        id={priority}
        name="triage"
        value={priority}
        checked={urgency === priority}
        onChange={() => setUrgency(priority)}
        className="hidden"
      />
      <label htmlFor={priority} className="flex items-center cursor-pointer space-x-2">
        <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
          {urgency === priority && (
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
          )}
        </span>
        <span className="text-gray-700">{label}</span>
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto">
      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Enviando ocorrência...</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New Ocurrence</h2>
            {/* Change button type to "submit" and remove onClick */}
            <Button label="Enviar" type="submit" className="bg-blue-600 text-white hover:bg-blue-700" onClick={function (): void {
                throw new Error('Function not implemented.');
              } } />
          </div>

          {/* Campo Animal com dropdown personalizado */}
          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">Animal</label>
            <button
              type="button"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedPet ? (
                <div className="flex items-center space-x-2">
                  <img src={selectedPet.photoUrl} alt={selectedPet.name} className="w-8 h-8 rounded-full object-cover" />
                  <span>{selectedPet.name}</span>
                </div>
              ) : (
                <span>Selecione um animal</span>
              )}
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {pets.map(pet => (
                  <div
                    key={pet.id}
                    className="p-2 flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedPet(pet);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img src={pet.photoUrl} alt={pet.name} className="w-8 h-8 rounded-full object-cover" />
                    <span>{pet.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campo Urgência com botões de rádio personalizados */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Urgência</label>
            <div className="flex items-center space-x-6">
              {renderUrgencyOption('Comum', 'common', 'bg-blue-500')}
              {renderUrgencyOption('Atenção', 'attention', 'bg-yellow-500')}
              {renderUrgencyOption('Emergência', 'emergency', 'bg-red-500')}
            </div>
          </div>
          
          {/* Campo Descrição */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
            <div className="relative">
              <textarea
                className="w-full h-32 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Descreva a ocorrência..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              ></textarea>
              <span className="absolute bottom-2 right-4 text-xs text-gray-400">
                {descriptionCount}/500
              </span>
            </div>
          </div>

          {/* Campo Mídia com área de upload e pré-visualização */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Mídia</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 hover:border-blue-500 transition duration-300 cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={handleFileUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaUpload}
                className="hidden"
                accept="image/*"
                multiple
              />
              <p className="mb-2">Arraste e solte os arquivos aqui</p>
              <p className="text-blue-500">ou clique para fazer upload</p>
              {media.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center">
                  {media.map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md m-2" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default OccurrenceFormView;
