// src/components/broker/ia/IAUnifiedAssistantBroker.tsx
// Assistant IA unifié pour courtier
// <150 lignes

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { aiAssistantApi, ChatMessage } from '@/modules/api/ai-assistant/ai-assistant.api';

// Icônes
import { Send, Bot, User, Sparkles, Mic, MicOff, Trash2, Lightbulb, Zap, FileText, Calendar, TrendingUp, Shield, X } from 'lucide-react';

interface IAUnifiedAssistantBrokerProps {
  onClose?: () => void;
  compact?: boolean;
}

export const IAUnifiedAssistantBroker = ({ onClose, compact = false }: IAUnifiedAssistantBrokerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?', timestamp: new Date().toISOString() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await aiAssistantApi.chat({ message: currentInput, history: messages.slice(-5) });
      let replyMessage = '';
      let suggestions: string[] = [];
      
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        replyMessage = responseAny.message || responseAny.data?.message || 'Désolé, je n\'ai pas compris.';
        suggestions = responseAny.suggestions || responseAny.data?.suggestions || [];
      }
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: replyMessage, timestamp: new Date().toISOString() }]);
      
      if (suggestions.length > 0) {
        setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'assistant', content: `💡 Suggestions :\n${suggestions.map(s => `• ${s}`).join('\n')}`, timestamp: new Date().toISOString() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Désolé, une erreur est survenue.', timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => setInputValue(event.results[0][0].transcript);
      recognition.start();
    } else {
      alert('Reconnaissance vocale non supportée');
    }
  };

  const quickActions = [
    { icon: <FileText className="w-3 h-3" />, label: 'Analyse contrat', action: 'Analyse le contrat #' },
    { icon: <Shield className="w-3 h-3" />, label: 'Détection fraude', action: 'Analyse les fraudes récentes' },
    { icon: <Calendar className="w-3 h-3" />, label: 'Optimise agenda', action: 'Optimise mon agenda' },
    { icon: <TrendingUp className="w-3 h-3" />, label: 'Prédictions', action: 'Prévisions commissions' },
  ];

  if (compact) {
    return (
      <div className="fixed bottom-20 right-6 z-50 w-96">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">Assistant IA</span>
              </div>
              {onClose && (
                <button onClick={onClose} className="text-white hover:text-gray-200">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(action.action)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleVoiceInput} className={`p-2 rounded-lg ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Assistant IA
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </CardTitle>
          {onClose && (
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <Bot className="w-6 h-6 text-purple-600" />}
                <div className={`max-w-[75%] p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && <User className="w-6 h-6 text-blue-600" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <Bot className="w-6 h-6 text-purple-600" />
                <div className="bg-gray-100 p-2 rounded-lg"><LoadingSpinner size="sm" /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-3">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickActions.map((action, idx) => (
                <button key={idx} onClick={() => setInputValue(action.action)} className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {action.icon}{action.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleVoiceInput} className={`p-2 rounded-lg ${isListening ? 'bg-red-100' : 'bg-gray-100'}`}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Posez votre question..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>Envoyer</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IAUnifiedAssistantBroker;