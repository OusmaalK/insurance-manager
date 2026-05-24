// src/components/shared/ia/IAFeedbackCollector.tsx
// Collecteur de feedback IA
// <120 lignes

'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, X, MessageSquare, CheckCircle } from 'lucide-react';
import { apiClient } from '@/modules/api/client/client';

interface IAFeedbackCollectorProps {
  predictionId: string;
  predictionType: 'fraud' | 'risk' | 'renewal' | 'amount';
  predictionValue: any;
  onFeedbackSubmitted?: () => void;
  className?: string;
}

export const IAFeedbackCollector = ({
  predictionId,
  predictionType,
  predictionValue,
  onFeedbackSubmitted,
  className = ''
}: IAFeedbackCollectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback) return;
    setIsSubmitting(true);
    try {
      await apiClient.post('/ia/feedback', {
        prediction_id: predictionId,
        prediction_type: predictionType,
        prediction_value: predictionValue,
        feedback_type: feedback,
        comment: comment || null,
      });
      setSubmitted(true);
      onFeedbackSubmitted?.();
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedback(null);
        setComment('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = () => {
    const labels = { fraud: 'fraude', risk: 'risque', renewal: 'renouvellement', amount: 'montant' };
    return labels[predictionType];
  };

  return (
    <>
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <button
          onClick={() => { setFeedback('positive'); setIsOpen(true); }}
          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Prédiction utile"
        >
          <ThumbsUp className="w-3 h-3" />
        </button>
        <button
          onClick={() => { setFeedback('negative'); setIsOpen(true); }}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Prédiction inutile"
        >
          <ThumbsDown className="w-3 h-3" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-[90%]">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Donnez votre avis
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              {!submitted ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Cette prédiction de <strong>{getTypeLabel()}</strong> était-elle utile ?
                  </p>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setFeedback('positive')}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                        feedback === 'positive' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Utile
                    </button>
                    <button
                      onClick={() => setFeedback('negative')}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                        feedback === 'negative' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" /> Inutile
                    </button>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Pourquoi (optionnel)..."
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none h-20"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!feedback || isSubmitting}
                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Envoi...' : <><Send className="w-4 h-4" /> Envoyer</>}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Merci !</p>
                  <p className="text-sm text-gray-500">Votre feedback nous aide à améliorer l'IA</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IAFeedbackCollector;