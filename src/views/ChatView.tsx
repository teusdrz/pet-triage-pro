import React, { useState } from 'react';
import { type Pet } from '../models/types';

interface ChatViewProps {
  onBack: () => void;
  pets: Pet[];
}

// Componente principal para a visualização do chat com o veterinário IA.
const ChatView: React.FC<ChatViewProps> = ({ onBack, pets }) => {
  // Estado para armazenar todas as mensagens da conversa.
  const [messages, setMessages] = useState<any[]>([]);
  // Estado para controlar o valor do campo de entrada de texto.
  const [inputValue, setInputValue] = useState('');
  // Estado para indicar se a IA está "digitando" uma resposta.
  const [aiIsTyping, setAiIsTyping] = useState(false);

  // Lidar com o envio de uma mensagem pelo usuário.
  const handleSendMessage = async () => {
    // Não envia se o campo estiver vazio.
    if (inputValue.trim() === '') return;

    // Cria o objeto da mensagem do usuário.
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isSender: true,
      photo: "https://placehold.co/40x40/E5E7EB/4B5563?text=user"
    };

    // Adiciona a mensagem do usuário ao histórico.
    setMessages(prevMessages => [...prevMessages, userMessage]);
    // Limpa o campo de entrada.
    setInputValue('');
    // Ativa o indicador de que a IA está digitando.
    setAiIsTyping(true);

    // Chama a função para gerar a resposta da IA.
    await generateVetResponse(userMessage.text);
  };

  // Lidar com a chamada da API para gerar a resposta da IA.
  const generateVetResponse = async (userPrompt: string) => {
    // Adiciona explicitamente as informações dos pets para a IA usar no contexto.
    const specificPets = [
      { name: 'Bob', species: 'Cão', triageScore: 75 },
      { name: 'Marfim', species: 'Gato', triageScore: 50 },
      { name: 'Milo', species: 'Cão', triageScore: 60 },
    ];

    // Formata os dados dos pets em uma string para o prompt.
    const petDataString = specificPets.map(pet =>
      `Nome: ${pet.name}, Espécie: ${pet.species}, Pontuação de Triagem: ${pet.triageScore}`
    ).join('; ');

    // Constrói o prompt completo para a IA, definindo sua persona e o contexto.
    const prompt = `Você é um veterinário especializado. Responda de forma profissional e concisa. Mantenha as respostas curtas, diretas e úteis, como um especialista. As informações dos pets são: ${petDataString}. Se a pergunta for sobre um desses animais ou uma pergunta geral, use seu conhecimento. Não invente informações. O usuário perguntou: "${userPrompt}"`;

    let responseText = "Desculpe, não consegui obter uma resposta no momento. Por favor, tente novamente mais tarde.";

    const MAX_RETRIES = 3;
    let retries = 0;
    let success = false;
    // Tenta a chamada da API com retries e backoff exponencial.
    while (retries < MAX_RETRIES && !success) {
        try {
            // Prepara o payload com o prompt para a API.
            const payload = {
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }],
            };

            // Use uma string vazia para a apiKey. O ambiente injetará a chave real.
            const apiKey = "AIzaSyBkHednTbgFLuyHrR_cULDLJ5i8ySSH5QI";
            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

            // Realiza a chamada fetch, passando a chave de API no cabeçalho como no comando cURL.
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey // Passa a chave de API no cabeçalho
                },
                body: JSON.stringify(payload)
            });

            // Lança um erro se a resposta da API não for bem-sucedida.
            if (!response.ok) {
                throw new Error(`A chamada da API falhou com o status: ${response.status}`);
            }

            // Analisa a resposta JSON.
            const result = await response.json();
            // Verifica se a resposta da IA é válida.
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                responseText = result.candidates[0].content.parts[0].text;
                success = true;
            } else {
                responseText = "Não consegui gerar uma resposta com base nas informações fornecidas. Por favor, tente reformular sua pergunta.";
                success = true; // Não há motivo para tentar novamente se a formatação da resposta estiver incorreta.
            }

        } catch (error) {
            console.error(`A tentativa ${retries + 1} falhou:`, error);
            retries++;
            if (retries < MAX_RETRIES) {
                // Espera um tempo crescente antes de tentar novamente (backoff exponencial).
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
            }
        }
    }

    // Desativa o indicador de digitação.
    setAiIsTyping(false);
    // Cria o objeto da mensagem da IA.
    const aiMessage = {
        id: messages.length + 2,
        text: responseText,
        isSender: false,
        photo: "https://placehold.co/40x40/D1E0FC/3B82F6?text=vet"
    };
    // Adiciona a mensagem da IA ao histórico.
    setMessages(prevMessages => [...prevMessages, aiMessage]);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-blue-600 font-semibold">
          &larr; Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Chat com Veterinário</h1>
        <div className="w-16"></div> {/* Espaço para alinhamento */}
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${message.isSender ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isSender && (
              <img
                src={message.photo}
                alt="Perfil"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div
              className={`p-4 rounded-lg shadow-sm max-w-sm ${message.isSender ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
            >
              <p>{message.text}</p>
            </div>
            {message.isSender && (
              <img
                src={message.photo}
                alt="Perfil"
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>
        ))}
        {aiIsTyping && (
          <div className="flex justify-start space-x-4">
            <img
              src="https://placehold.co/40x40/D1E0FC/3B82F6?text=vet"
              alt="Perfil"
              className="w-10 h-10 rounded-full"
            />
            <div className="p-4 rounded-lg shadow-sm bg-white text-gray-800 max-w-sm animate-pulse">
              <p>Veterinário digitando...</p>
            </div>
          </div>
        )}
      </div>

      {/* Área de entrada de texto */}
      <div className="mt-6 flex items-center space-x-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua mensagem"
          className="flex-1 p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatView;
