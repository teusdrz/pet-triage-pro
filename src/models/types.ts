// Define the data structure for a pet.
export type Pet = {
  id: string;
  name: string;
  photoUrl: string;
  triageScore: number;
  occurrencesCount: number;
};

// Define the data structure for a conversation message.
export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

export type Occurrence = {
  id: string;
  petId: string;
  title: string;
  status: 'iniciada' | 'em andamento' | 'concluida';
  details: string;
  timestamp: string;
};



// Define the data structure for a Triage Report.
export type TriageReport = {
  id: string;
  title: string;
  content: string;
  timestamp: string;
};

// Define the data structure for a loading state.
export type LoadingState = {
  progress: number;
  message: string;
};

export type TriagePriority = 'emergency' | 'attention' | 'common';