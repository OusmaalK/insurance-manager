# # 🏢 Insurance Manager - Plateforme d'Assurance avec IA

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

## 📋 Description

**Insurance Manager** est une plateforme complète de gestion d'assurance intégrant une intelligence artificielle transversale. L'application permet aux courtiers et administrateurs de gérer efficacement les clients, contrats, sinistres, et d'optimiser leurs décisions grâce à l'IA.

### ✨ Fonctionnalités principales

- **🤖 IA Transversale** : Analyse en temps réel, détection de fraudes, auto-approbation
- **👥 Gestion des clients** : Suivi des clients, analyse de risque, prédictions
- **📄 Gestion des contrats** : Analyse de clauses, recommandations, renouvellements
- **⚠️ Gestion des sinistres** : Détection de fraudes, traitement automatisé
- **📊 Dashboard IA** : Métriques en temps réel, prédictions, alertes
- **⚙️ Paramètres avancés** : Configuration IA, sécurité, API, notifications
- **📈 Rapports IA** : Génération automatique de rapports, tendances

## 🚀 Technologies utilisées

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Next.js | 15 | Framework React |
| TypeScript | 5.0 | Typage statique |
| Tailwind CSS | 3.0 | Styling |
| Zustand | 4.5 | Gestion d'état |
| Lucide React | - | Icônes |
| Gemini AI | 2.0 | Intelligence artificielle |

## 📁 Structure du projet
insurance-manager/
├── src/
│ ├── app/
│ │ ├── admin/ # Interface administrateur
│ │ │ ├── dashboard/ # Tableau de bord
│ │ │ ├── settings/ # Paramètres généraux
│ │ │ ├── ia-settings/ # Configuration IA
│ │ │ ├── audit/ # Audit et logs
│ │ │ └── reports/ # Rapports
│ │ ├── broker/ # Interface courtier
│ │ └── auth/ # Authentification
│ ├── components/ # Composants réutilisables
│ ├── hooks/ # Hooks personnalisés
│ ├── stores/ # Stores Zustand
│ ├── lib/ # Utilitaires et API
│ └── types/ # Types TypeScript
├── public/ # Fichiers statiques
└── package.json # Dépendances

text

## 🛠️ Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Git

### Étapes d'installation

```bash
# Cloner le dépôt
git clone https://github.com/OusmaalK/insurance-manager.git

# Accéder au dossier
cd insurance-manager

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
L'application sera disponible sur http://localhost:3000

🔧 Configuration
Variables d'environnement
Créez un fichier .env.local à la racine :

env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentification
NEXTAUTH_SECRET=votre_secret
NEXTAUTH_URL=http://localhost:3000

# IA (Gemini)
GEMINI_API_KEY=votre_clé_api

# Base de données
DATABASE_URL=votre_url_base_données
🎨 Fonctionnalités détaillées
1. Interface Administrateur
Dashboard : KPIs, graphiques, activités récentes

Gestion des utilisateurs : CRUD, rôles, permissions

Audit : Logs d'actions, historique des modifications

Paramètres : Configuration globale, sécurité, API

2. Interface Courtier
Clients : Gestion des prospects et clients

Contrats : Suivi des polices d'assurance

Sinistres : Déclarations et traitement

Commission : Calcul et suivi des commissions

3. Intelligence Artificielle
Détection de fraude : Analyse comportementale

Auto-approbation : Décisions automatiques

Prédictions : Risques clients, renouvellements

Recommandations : Suggestions personnalisées

4. Paramètres IA Configurables
Seuils de risque

Détection de fraude

Auto-approbation

Modèles IA

Notifications

📦 Scripts disponibles
bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build l'application
npm run start        # Lance le serveur de production

# Linting
npm run lint         # Vérifie le code

# TypeScript
npm run type-check   # Vérifie les types
🌐 Déploiement
Déploiement sur Vercel (recommandé)
bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
Déploiement sur un serveur
bash
# Build
npm run build

# Démarrer avec PM2
pm2 start npm --name "insurance-manager" -- start
🤝 Contribution
Fork le projet

Créez une branche (git checkout -b feature/amazing-feature)

Commitez vos changements (git commit -m 'Add amazing feature')

Poussez la branche (git push origin feature/amazing-feature)

Ouvrez une Pull Request

📝 Convention de commits
feat: Nouvelle fonctionnalité

fix: Correction de bug

docs: Documentation

style: Formatage

refactor: Refactorisation

test: Tests

chore: Maintenance

🧪 Tests
bash
# Lancer les tests unitaires
npm run test

# Lancer les tests e2e
npm run test:e2e
📄 Licence
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

👤 Auteur
OusmaalK

GitHub: @OusmaalK

🙏 Remerciements
Next.js team pour le framework

Vercel pour l'hébergement

Google Gemini AI pour l'IA

📞 Support
Pour toute question ou problème :

Ouvrez une issue sur GitHub

Contactez l'administrateur

⭐ N'oubliez pas de mettre une étoile si ce projet vous est utile !

text

## Pour ajouter ce README à votre projet :

```powershell
# Créer le fichier README.md avec le contenu ci-dessus
# (copiez-collez le contenu dans le fichier)

# Ajouter et committer
git add README.md
git commit -m "docs: add comprehensive README file"
git push origin main
Points positifs de votre README :
✅ Badges : Montre les technologies et versions
✅ Structure claire : Organisation logique
✅ Installation détaillée : Facile à suivre
✅ Configuration : Variables d'environnement
✅ Fonctionnalités : Bien présentées
✅ Scripts : Commandes utiles
✅ Contribution : Guide pour les contributeurs
✅ Licence : Information claire
