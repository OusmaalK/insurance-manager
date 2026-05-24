// src/components/shared/ia/IAVoiceAssistant.tsx
// Assistant vocal IA flottant
// <180 lignes

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { aiAssistantApi, ChatMessage } from '@/modules/api/ai-assistant/ai-assistant.api';

// Icônes
import { Mic, MicOff, X, Minimize2, Maximize2, Send, Bot, Volume2, VolumeX, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const IAVoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: 'Bonjour ! Je suis votre assistant vocal. Comment puis-je vous aider aujourd\'hui ?', timestamp: new Date().toISOString() }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSpeechResult = (event: any) => {
    const text = event.results[0][0].transcript;
    setTranscript(text);
    sendMessage(text);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
      if (!isMuted) {
        const utterance = new SpeechSynthesisUtterance("Je vous écoute");
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const sendMessage = async (text: string) => {
    setIsProcessing(true);
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');

    try {
      const response = await aiAssistantApi.chat({ message: text, history: messages.slice(-5) });
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const reply = responseAny.message || responseAny.data?.message || 'Désolé, je n\'ai pas compris.';
        const assistantMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, assistantMessage]);
        if (!isMuted) {
          const utterance = new SpeechSynthesisUtterance(reply);
          utterance.lang = 'fr-FR';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Désolé, une erreur est survenue. Veuillez réessayer.', timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) window.speechSynthesis.cancel();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96'}`}>
      <Card className="shadow-2xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-white text-sm">Assistant IA Vocal</CardTitle>
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </div>
            <div className="flex gap-2">
              <button onClick={toggleMute} className="text-white hover:text-gray-200">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:text-gray-200">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-3">
            <div className="h-80 overflow-y-auto mb-3 space-y-2 bg-gray-50 rounded-lg p-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 p-2 rounded-lg"><LoadingSpinner size="sm" /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <button onClick={toggleListening} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Écoute...' : 'Parler'}
              </button>
              <input type="text" value={transcript} onChange={(e) => setTranscript(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && transcript && sendMessage(transcript)} placeholder="ou tapez..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <button onClick={() => transcript && sendMessage(transcript)} disabled={!transcript || isProcessing} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">{isListening ? '🎤 Parlez maintenant...' : 'Cliquez sur le microphone pour parler'}</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default IAVoiceAssistant;