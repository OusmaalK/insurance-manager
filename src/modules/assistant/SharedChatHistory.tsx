// src/modules/assistant/SharedChatHistory.tsx
// Historique de chat partagé
// <120 lignes

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { aiAssistantApi, ChatMessage } from '@/modules/api/ai-assistant/ai-assistant.api';

// Icônes
import { History, Trash2, MessageSquare, Clock, ChevronRight, X } from 'lucide-react';

interface SharedChatHistoryProps {
  onSelectConversation?: (messages: ChatMessage[]) => void;
  maxItems?: number;
}

export const SharedChatHistory = ({ onSelectConversation, maxItems = 20 }: SharedChatHistoryProps) => {
  const [conversations, setConversations] = useState<{ id: string; title: string; lastMessage: string; updatedAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await aiAssistantApi.getHistory(maxItems);
      if (response && typeof response === 'object') {
        const responseAny = response as any;
        const history = responseAny.data || responseAny;
        if (Array.isArray(history)) {
          const formatted = history.map((conv: any) => ({
            id: conv.id || Date.now().toString(),
            title: conv.title || 'Conversation',
            lastMessage: conv.lastMessage || conv.messages?.[conv.messages.length - 1]?.content?.substring(0, 50) || 'Nouvelle conversation',
            updatedAt: conv.updatedAt || new Date().toISOString(),
          }));
          setConversations(formatted);
        }
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await aiAssistantApi.clearHistory();
      setConversations([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner size="sm" text="Chargement..." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="w-4 h-4" />
          Historique des conversations
        </CardTitle>
        {conversations.length > 0 && (
          <Button onClick={handleClearHistory} variant="ghost" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun historique</p>
            <p className="text-xs">Vos conversations apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedId === conv.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{conv.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{formatDate(conv.updatedAt)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SharedChatHistory;