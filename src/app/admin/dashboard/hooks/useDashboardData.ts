// src/app/admin/dashboard/hooks/useDashboardData.ts
'use client';

import { useState } from 'react';

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications] = useState(3);

  const kpis = [
    { title: 'Clients actifs', value: '2,847', change: '+12.5%', trend: 'up', icon: null, bg: '#eff6ff', text: '#2563eb', description: 'vs mois dernier' },
    { title: 'Contrats en cours', value: '4,291', change: '+8.2%', trend: 'up', icon: null, bg: '#ecfdf5', text: '#059669', description: 'vs mois dernier' },
    { title: 'Primes totales', value: '€3.2M', change: '+18.3%', trend: 'up', icon: null, bg: '#fffbeb', text: '#d97706', description: 'cumul annuel' },
    { title: 'Taux conversion', value: '34.8%', change: '-2.1%', trend: 'down', icon: null, bg: '#faf5ff', text: '#9333ea', description: 'vs mois dernier' },
  ];

  const activities = [
    { id: 1, type: 'Nouveau contrat', client: 'Sophie Martin', produit: 'Assurance Auto', montant: '€420/an', status: 'validé', time: '5 min', icon: null, color: '#16a34a', bg: '#f0fdf4' },
    { id: 2, type: 'Devis signé', client: 'Thomas Bernard', produit: 'Habitation', montant: '€280/an', status: 'en attente', time: '25 min', icon: null, color: '#2563eb', bg: '#eff6ff' },
    { id: 3, type: 'Sinistre déclaré', client: 'Marie Lambert', produit: 'Santé', montant: '€1,200', status: 'urgence', time: '1 heure', icon: null, color: '#dc2626', bg: '#fef2f2' },
    { id: 4, type: 'Renouvellement', client: 'Nicolas Dubois', produit: 'Prévoyance', montant: '€890/an', status: 'effectué', time: '3 heures', icon: null, color: '#9333ea', bg: '#faf5ff' },
    { id: 5, type: 'Avenant signé', client: 'Julie Petit', produit: 'Auto + Habitation', montant: '€720/an', status: 'validé', time: '5 heures', icon: null, color: '#059669', bg: '#ecfdf5' },
  ];

  const products = [
    { name: 'Assurance Auto', percentage: 38, count: 1632, color: '#3b82f6', growth: '+15%', revenue: '€1.2M' },
    { name: 'Habitation', percentage: 27, count: 1159, color: '#10b981', growth: '+8%', revenue: '€890K' },
    { name: 'Santé', percentage: 20, count: 858, color: '#f59e0b', growth: '+22%', revenue: '€650K' },
    { name: 'Prévoyance', percentage: 15, count: 642, color: '#8b5cf6', growth: '+5%', revenue: '€480K' },
  ];

  const requests = [
    { id: 1, client: 'Élodie Rousseau', email: 'elodie.r@email.com', type: 'Devis Auto', date: '2026-05-23', status: 'À traiter', priority: 'haute' },
    { id: 2, client: 'Lucas Moreau', email: 'lucas.m@email.com', type: 'Sinistre', date: '2026-05-22', status: 'En cours', priority: 'urgente' },
    { id: 3, client: 'Camille Leroy', email: 'camille.l@email.com', type: 'Résiliation', date: '2026-05-22', status: 'À traiter', priority: 'moyenne' },
    { id: 4, client: 'Antoine Girard', email: 'antoine.g@email.com', type: 'Avenant', date: '2026-05-21', status: 'Validé', priority: 'basse' },
    { id: 5, client: 'Sarah Dubois', email: 'sarah.d@email.com', type: 'Devis Habitation', date: '2026-05-21', status: 'En attente', priority: 'haute' },
  ];

  const teams = [
    { name: 'Équipe Nord', revenue: '€892K', target: 95, growth: '+12%', avatar: 'N' },
    { name: 'Équipe Sud', revenue: '€784K', target: 87, growth: '+8%', avatar: 'S' },
    { name: 'Équipe Est', revenue: '€678K', target: 92, growth: '+15%', avatar: 'E' },
    { name: 'Équipe Ouest', revenue: '€567K', target: 78, growth: '+5%', avatar: 'O' },
  ];

  const monthlyData = [
    { month: 'Jan', primes: 185000, prevYear: 165000 },
    { month: 'Fév', primes: 195000, prevYear: 172000 },
    { month: 'Mar', primes: 210000, prevYear: 188000 },
    { month: 'Avr', primes: 225000, prevYear: 195000 },
    { month: 'Mai', primes: 248000, prevYear: 210000 },
    { month: 'Juin', primes: 265000, prevYear: 228000 },
    { month: 'Juil', primes: 280000, prevYear: 240000 },
    { month: 'Aoû', primes: 275000, prevYear: 238000 },
    { month: 'Sep', primes: 290000, prevYear: 252000 },
    { month: 'Oct', primes: 310000, prevYear: 268000 },
    { month: 'Nov', primes: 325000, prevYear: 275000 },
    { month: 'Déc', primes: 345000, prevYear: 290000 },
  ];

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return {
    isLoading,
    notifications,
    kpis,
    activities,
    products,
    requests,
    teams,
    monthlyData,
    refreshData,
  };
}