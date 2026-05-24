// src/app/(broker)/ai-assistant/page.tsx
// Assistant IA Chatbot - Version corrigée
// <170 lignes

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BrokerLayout } from '@/shared/layout/BrokerLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { aiAssistantApi, ChatMessage, QuickAction } from '@/modules/api/ai-assistant/ai-assistant.api';

// Icônes
import { Send, Bot, User, Sparkles, Mic, MicOff, Trash2, Lightbulb } from 'lucide-react';

export default function BrokerAIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA personnel. Je peux vous aider à analyser des contrats, prédire des sinistres, optimiser votre agenda, et bien plus encore. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadQuickActions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Correction : getQuickCommands retourne directement les données
  const loadQuickActions = async () => {
    try {
      const actions = await aiAssistantApi.getQuickCommands();
      // Vérifier si actions est un tableau
      if (Array.isArray(actions)) {
        setQuickActions(actions);
      } else if (actions && typeof actions === 'object' && 'data' in actions && Array.isArray((actions as any).data)) {
        setQuickActions((actions as any).data);
      } else {
        // Actions par défaut
        setQuickActions([
          { type: 'CREATE_REPORT', label: 'Générer rapport hebdomadaire', params: {} },
          { type: 'ANALYZE_RISK', label: 'Analyser les risques portefeuille', params: {} },
          { type: 'SCHEDULE_MEETING', label: 'Planifier rendez-vous', params: {} },
          { type: 'SEND_EMAIL', label: 'Envoyer relance clients', params: {} }
        ]);
      }
    } catch (error) {
      console.error('Failed to load quick actions:', error);
      setQuickActions([
        { type: 'CREATE_REPORT', label: 'Générer rapport hebdomadaire', params: {} },
        { type: 'ANALYZE_RISK', label: 'Analyser les risques portefeuille', params: {} },
        { type: 'SCHEDULE_MEETING', label: 'Planifier rendez-vous', params: {} },
        { type: 'SEND_EMAIL', label: 'Envoyer relance clients', params: {} }
      ]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // ✅ Correction : chat retourne directement les données
      const response = await aiAssistantApi.chat({
        message: currentInput,
        history: messages.slice(-5)
      });

      // Extraire le message de la réponse
      let replyMessage = '';
      let suggestions: string[] = [];

      if (response && typeof response === 'object') {
        const responseAny = response as any;
        
        // Différents formats possibles
        if (responseAny.message) {
          replyMessage = responseAny.message;
        } else if (responseAny.data?.message) {
          replyMessage = responseAny.data.message;
        } else if (responseAny.content) {
          replyMessage = responseAny.content;
        } else {
          replyMessage = 'Désolé, je n\'ai pas compris votre demande.';
        }
        
        if (responseAny.suggestions) {
          suggestions = responseAny.suggestions;
        } else if (responseAny.data?.suggestions) {
          suggestions = responseAny.data.suggestions;
        }
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyMessage,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Afficher les suggestions
      if (suggestions && suggestions.length > 0) {
        const suggestionMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `💡 Suggestions :\n${suggestions.map((s: string) => `• ${s}`).join('\n')}`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    let message = '';
    switch (action.type) {
      case 'CREATE_REPORT':
        message = 'Génère un rapport hebdomadaire';
        break;
      case 'ANALYZE_RISK':
        message = 'Analyse les risques de mon portefeuille';
        break;
      case 'SCHEDULE_MEETING':
        message = 'Planifie un rendez-vous avec un client';
        break;
      case 'SEND_EMAIL':
        message = 'Envoie un email de relance';
        break;
      default:
        message = action.label;
    }
    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
    }
  };

  const clearHistory = async () => {
    try {
      await aiAssistantApi.clearHistory();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Historique effacé. Comment puis-je vous aider ?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <BrokerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistant IA</h1>
            <p className="text-gray-500 mt-1">Votre conseiller virtuel intelligent</p>
          </div>
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer l'historique
          </Button>
        </div>

        {/* Actions rapides */}
        {quickActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Zone de chat */}
        <Card>
          <CardContent className="p-0">
            <div className="h-[500px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.timestamp && (
                        <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <LoadingSpinner size="sm" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <button
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question ou donnez une commande..."
                    className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  💡 Exemples : "Analyse le risque de l'entreprise X", "Prédiction renouvellement contrat Y", "Optimise mon agenda"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrokerLayout>
  );
}