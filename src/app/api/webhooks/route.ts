// src/app/api/webhooks/route.ts
// Webhooks entrants
// <110 lignes

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/modules/api/client/client';

// ============================================
// TYPES
// ============================================

interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, any>;
  signature?: string;
}

// ============================================
// WEBHOOK HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-webhook-signature');
    
    // Vérifier la signature (optionnel)
    if (!verifySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { event, data } = body as WebhookPayload;

    // Traiter l'événement
    switch (event) {
      case 'claim.created':
        await handleClaimCreated(data);
        break;
      case 'policy.expiring':
        await handlePolicyExpiring(data);
        break;
      case 'payment.received':
        await handlePaymentReceived(data);
        break;
      case 'user.registered':
        await handleUserRegistered(data);
        break;
      case 'report.generated':
        await handleReportGenerated(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json(
      { success: true, message: 'Webhook processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// VÉRIFICATION SIGNATURE
// ============================================

function verifySignature(payload: any, signature: string | null): boolean {
  // À implémenter avec votre logique de signature
  // Exemple avec HMAC-SHA256
  if (!signature) return false;
  
  // Pour la démonstration, on accepte toutes les requêtes
  // En production, vérifier la signature avec un secret partagé
  return true;
}

// ============================================
// HANDLERS
// ============================================

async function handleClaimCreated(data: Record<string, any>) {
  console.log(`New claim created: ${data.claimId}`);
  
  // Envoyer une notification
  await apiClient.post('/notifications/send', {
    userId: data.userId,
    title: 'Nouveau sinistre',
    message: `Un nouveau sinistre (${data.claimNumber}) a été créé`,
    type: 'info',
  });
  
  // Déclencher analyse IA automatique
  await apiClient.post(`/claims/ai/analyze-fraud/${data.claimId}`);
}

async function handlePolicyExpiring(data: Record<string, any>) {
  console.log(`Policy expiring soon: ${data.policyId}`);
  
  // Envoyer une alerte au courtier
  await apiClient.post('/notifications/send', {
    userId: data.brokerId,
    title: 'Contrat bientôt expiré',
    message: `Le contrat ${data.policyNumber} expire dans ${data.daysLeft} jours`,
    type: 'warning',
  });
  
  // Générer une prédiction de renouvellement
  await apiClient.post(`/policies/${data.policyId}/predict-renewal`);
}

async function handlePaymentReceived(data: Record<string, any>) {
  console.log(`Payment received: ${data.amount}€`);
  
  // Mettre à jour le statut de la commission
  await apiClient.put(`/commissions/${data.commissionId}`, {
    status: 'PAID',
    paidAt: new Date().toISOString(),
  });
}

async function handleUserRegistered(data: Record<string, any>) {
  console.log(`New user registered: ${data.userId}`);
  
  // Envoyer email de bienvenue
  await apiClient.post('/email/send', {
    to: data.email,
    template: 'welcome',
    data: { name: data.name },
  });
  
  // Créer un profil par défaut
  await apiClient.post('/users/profile', {
    userId: data.userId,
    preferences: {
      notifications: true,
      language: 'fr',
    },
  });
}

async function handleReportGenerated(data: Record<string, any>) {
  console.log(`Report generated: ${data.reportId}`);
  
  // Si l'utilisateur a demandé l'envoi par email
  if (data.sendEmail) {
    await apiClient.post(`/reports/${data.reportId}/send`, {
      recipients: [data.userEmail],
    });
  }
}

// ============================================
// METHODES SUPPLEMENTAIRES
// ============================================

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoints: {
      'claim.created': 'POST',
      'policy.expiring': 'POST',
      'payment.received': 'POST',
      'user.registered': 'POST',
      'report.generated': 'POST',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}