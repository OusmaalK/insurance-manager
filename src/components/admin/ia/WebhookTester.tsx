// src/components/admin/ia/WebhookTester.tsx
'use client';

import { useState } from 'react';
import { Send, CheckCircle, XCircle, Eye, Copy, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

interface WebhookLog {
  id: number;
  url: string;
  status: 'success' | 'error';
  responseCode: number;
  timestamp: string;
  payload: any;
}

export const WebhookTester = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [payload, setPayload] = useState(JSON.stringify({
    event: 'claim.created',
    data: {
      id: 123,
      amount: 15000,
      status: 'pending'
    }
  }, null, 2));
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; response?: any; error?: string } | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([
    { id: 1, url: 'https://webhook.site/abc123', status: 'success', responseCode: 200, timestamp: '2026-05-24 10:30:00', payload: { event: 'claim.created' } },
    { id: 2, url: 'https://webhook.site/def456', status: 'error', responseCode: 500, timestamp: '2026-05-24 09:15:00', payload: { event: 'policy.updated' } },
  ]);

  const handleSend = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Simuler envoi webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler réponse
      const success = webhookUrl.includes('valid');
      setResult({
        success: success,
        response: success ? { message: 'Webhook reçu avec succès', timestamp: new Date().toISOString() } : null,
        error: success ? undefined : 'Erreur de connexion au serveur'
      });
    } catch (error) {
      setResult({ success: false, error: 'Erreur lors de l\'envoi' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500" />
            Testeur Webhook
          </CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Documentation
          </Button>
        </div>
        <p className="text-xs text-gray-500">Tester et surveiller les webhooks IA</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Webhook */}
        <div>
          <label className="block text-sm font-medium mb-1">URL du webhook</label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://votre-serveur.com/webhook"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        {/* Payload */}
        <div>
          <label className="block text-sm font-medium mb-1">Payload (JSON)</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          />
        </div>

        {/* Bouton envoi */}
        <Button onClick={handleSend} disabled={isLoading || !webhookUrl} className="w-full">
          {isLoading ? 'Envoi en cours...' : 'Tester le webhook'}
          <Send className="w-4 h-4 ml-2" />
        </Button>

        {/* Résultat */}
        {result && (
          <div className={`p-3 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {result.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.success ? 'Webhook envoyé avec succès' : result.error}
              </p>
            </div>
            {result.response && (
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
                {JSON.stringify(result.response, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Historique */}
        {logs.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Historique des envois</p>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                    <span className="text-xs font-mono truncate max-w-[200px]">{log.url}</span>
                    <span className="text-xs text-gray-500">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.responseCode}
                    </span>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};