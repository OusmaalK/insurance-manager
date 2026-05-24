// src/modules/assistant/StandardHelpCenter.tsx
// Centre d'aide standard
// <130 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

// Icônes
import { HelpCircle, BookOpen, Video, FileText, Search, Mail, MessageCircle, ExternalLink } from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'features' | 'troubleshooting' | 'faq';
  content?: string;
}

const articles: HelpArticle[] = [
  { id: '1', title: 'Bienvenue sur la plateforme', description: 'Guide de prise en main', category: 'getting-started' },
  { id: '2', title: 'Gérer vos clients', description: 'Ajouter et suivre vos clients', category: 'features' },
  { id: '3', title: 'Utiliser l\'assistant IA', description: 'Comment interagir avec l\'IA', category: 'features' },
  { id: '4', title: 'Résolution des problèmes courants', description: 'Solutions aux erreurs fréquentes', category: 'troubleshooting' },
  { id: '5', title: 'Questions fréquentes', description: 'FAQ', category: 'faq' },
];

export const StandardHelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous', icon: HelpCircle },
    { id: 'getting-started', label: 'Démarrage', icon: BookOpen },
    { id: 'features', label: 'Fonctionnalités', icon: Video },
    { id: 'troubleshooting', label: 'Dépannage', icon: FileText },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Centre d'aide</h2>
        <p className="text-gray-500 mt-1">Trouvez des réponses à vos questions</p>
      </div>

      {/* Recherche */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une aide..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Catégories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{article.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <ExternalLink className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600">Lire l'article</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold text-gray-900">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-sm text-gray-600 mt-1">Notre équipe est là pour vous aider</p>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandardHelpCenter;