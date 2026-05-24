#!/bin/bash

# ==============================================
# SCRIPT DE CRÉATION DE STRUCTURE FRONTEND
# ADMIN + BROKER + MODULES (non monolithe)
# TOUS FICHIERS VIDES
# ==============================================

set -e

echo "🚀 Création de la structure frontend complète..."

# ---------- 1. DOSSIERS PRINCIPAUX ----------
mkdir -p src/app
mkdir -p src/modules
mkdir -p src/shared
mkdir -p src/config
mkdir -p src/middleware

# ---------- 2. APP : ADMIN ----------
mkdir -p src/app/\(admin\)
mkdir -p src/app/\(admin\)/dashboard
mkdir -p src/app/\(admin\)/ia/anti-fraud
mkdir -p src/app/\(admin\)/ia/risk-analysis
mkdir -p src/app/\(admin\)/ia/audit
mkdir -p src/app/\(admin\)/ia/predictions
mkdir -p src/app/\(admin\)/ia/compliance
mkdir -p src/app/\(admin\)/ia/broker-performance
mkdir -p src/app/\(admin\)/ia/events
mkdir -p src/app/\(admin\)/ia/jobs
mkdir -p src/app/\(admin\)/ia/webhooks
mkdir -p src/app/\(admin\)/ia/assistant
mkdir -p src/app/\(admin\)/reports
mkdir -p src/app/\(admin\)/settings/ia-settings
mkdir -p src/app/\(admin\)/settings/notifications
mkdir -p src/app/\(admin\)/settings/webhooks
mkdir -p src/app/\(admin\)/logs

# Fichiers admin vides
touch src/app/\(admin\)/layout.tsx
touch src/app/\(admin\)/dashboard/page.tsx
touch src/app/\(admin\)/ia/anti-fraud/page.tsx
touch src/app/\(admin\)/ia/risk-analysis/page.tsx
touch src/app/\(admin\)/ia/audit/page.tsx
touch src/app/\(admin\)/ia/predictions/page.tsx
touch src/app/\(admin\)/ia/compliance/page.tsx
touch src/app/\(admin\)/ia/broker-performance/page.tsx
touch src/app/\(admin\)/ia/events/page.tsx
touch src/app/\(admin\)/ia/jobs/page.tsx
touch src/app/\(admin\)/ia/webhooks/page.tsx
touch src/app/\(admin\)/ia/assistant/page.tsx
touch src/app/\(admin\)/reports/page.tsx
touch src/app/\(admin\)/settings/ia-settings/page.tsx
touch src/app/\(admin\)/settings/notifications/page.tsx
touch src/app/\(admin\)/settings/webhooks/page.tsx
touch src/app/\(admin\)/logs/page.tsx

# ---------- 3. APP : BROKER ----------
mkdir -p src/app/\(broker\)
mkdir -p src/app/\(broker\)/dashboard
mkdir -p src/app/\(broker\)/clients
mkdir -p src/app/\(broker\)/clients/\[id\]/risk-analysis
mkdir -p src/app/\(broker\)/clients/\[id\]/claims-prediction
mkdir -p src/app/\(broker\)/policies
mkdir -p src/app/\(broker\)/policies/\[id\]/contract-analysis
mkdir -p src/app/\(broker\)/policies/\[id\]/recommendations
mkdir -p src/app/\(broker\)/policies/expiring
mkdir -p src/app/\(broker\)/claims
mkdir -p src/app/\(broker\)/commissions
mkdir -p src/app/\(broker\)/calendar
mkdir -p src/app/\(broker\)/calendar/smart-planning
mkdir -p src/app/\(broker\)/calendar/reminders
mkdir -p src/app/\(broker\)/documents
mkdir -p src/app/\(broker\)/clients-birthday
mkdir -p src/app/\(broker\)/assistant

# Fichiers broker vides
touch src/app/\(broker\)/layout.tsx
touch src/app/\(broker\)/dashboard/page.tsx
touch src/app/\(broker\)/clients/page.tsx
touch src/app/\(broker\)/clients/\[id\]/page.tsx
touch src/app/\(broker\)/clients/\[id\]/risk-analysis/page.tsx
touch src/app/\(broker\)/clients/\[id\]/claims-prediction/page.tsx
touch src/app/\(broker\)/policies/page.tsx
touch src/app/\(broker\)/policies/\[id\]/page.tsx
touch src/app/\(broker\)/policies/\[id\]/contract-analysis/page.tsx
touch src/app/\(broker\)/policies/\[id\]/recommendations/page.tsx
touch src/app/\(broker\)/policies/expiring/page.tsx
touch src/app/\(broker\)/claims/page.tsx
touch src/app/\(broker\)/commissions/page.tsx
touch src/app/\(broker\)/calendar/page.tsx
touch src/app/\(broker\)/calendar/smart-planning/page.tsx
touch src/app/\(broker\)/calendar/reminders/page.tsx
touch src/app/\(broker\)/documents/page.tsx
touch src/app/\(broker\)/clients-birthday/page.tsx
touch src/app/\(broker\)/assistant/page.tsx

# ---------- 4. APP : AUTH ----------
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/register
mkdir -p src/app/\(auth\)/forgot-password

touch src/app/\(auth\)/login/page.tsx
touch src/app/\(auth\)/register/page.tsx
touch src/app/\(auth\)/forgot-password/page.tsx

# ---------- 5. APP : SHARED ----------
mkdir -p src/app/\(shared\)/profile
mkdir -p src/app/\(shared\)/notifications

touch src/app/\(shared\)/profile/page.tsx
touch src/app/\(shared\)/notifications/page.tsx

# ---------- 6. APP : API ----------
mkdir -p src/app/api/admin
mkdir -p src/app/api/broker
mkdir -p src/app/api/auth

touch src/app/api/admin/route.ts
touch src/app/api/broker/route.ts
touch src/app/api/auth/route.ts

# ---------- 7. FICHIERS RACINE APP ----------
touch src/app/layout.tsx
touch src/app/page.tsx

# ---------- 8. MODULES ----------

# 8.1 Module ia-core
mkdir -p src/modules/ia-core/hooks
mkdir -p src/modules/ia-core/components
mkdir -p src/modules/ia-core/services
mkdir -p src/modules/ia-core/types

touch src/modules/ia-core/hooks/useIAContext.ts
touch src/modules/ia-core/hooks/useIAOrchestrator.ts
touch src/modules/ia-core/hooks/useIAMonetization.ts
touch src/modules/ia-core/components/IAPalierSwitch.tsx
touch src/modules/ia-core/components/IATelemetryDashboard.tsx
touch src/modules/ia-core/components/IACreditBalance.tsx
touch src/modules/ia-core/services/iaStandardService.ts
touch src/modules/ia-core/services/iaTransversalService.ts
touch src/modules/ia-core/types/ia-paliers.types.ts

# 8.2 Module reports
mkdir -p src/modules/reports/standard
mkdir -p src/modules/reports/ia
mkdir -p src/modules/reports/shared

touch src/modules/reports/standard/StandardReportBuilder.tsx
touch src/modules/reports/standard/StandardReportExporter.ts
touch src/modules/reports/ia/IANarrativeReportEditor.tsx
touch src/modules/reports/ia/IAReportGenerator.ts
touch src/modules/reports/shared/ReportTemplate.tsx
touch src/modules/reports/shared/ReportFilters.tsx

# 8.3 Module telemetry
mkdir -p src/modules/telemetry/collectors
mkdir -p src/modules/telemetry/dashboards
mkdir -p src/modules/telemetry/alerts

touch src/modules/telemetry/collectors/latencyCollector.ts
touch src/modules/telemetry/collectors/costCollector.ts
touch src/modules/telemetry/dashboards/AdminTelemetry.tsx
touch src/modules/telemetry/dashboards/BrokerUsageView.tsx
touch src/modules/telemetry/alerts/TelemetryAlert.tsx

# 8.4 Module monetization
mkdir -p src/modules/monetization/pricing
mkdir -p src/modules/monetization/billing
mkdir -p src/modules/monetization/usage

touch src/modules/monetization/pricing/PricingPlanEditor.tsx
touch src/modules/monetization/pricing/BrokerSubscription.tsx
touch src/modules/monetization/billing/InvoiceGenerator.ts
touch src/modules/monetization/billing/CreditTopUp.tsx
touch src/modules/monetization/usage/IACreditMeter.tsx

# 8.5 Module events
mkdir -p src/modules/events/jobs

touch src/modules/events/EventBus.ts
touch src/modules/events/StandardEventLogger.ts
touch src/modules/events/IAEventTrigger.ts
touch src/modules/events/jobs/renewal-prediction.job.ts
touch src/modules/events/jobs/fraud-score-update.job.ts
touch src/modules/events/jobs/productivity-report.job.ts
touch src/modules/events/jobs/weekly-ia-report.job.ts
touch src/modules/events/jobs/monthly-ia-report.job.ts

# 8.6 Module calendar-optimizer
mkdir -p src/modules/calendar-optimizer

touch src/modules/calendar-optimizer/StandardCalendar.tsx
touch src/modules/calendar-optimizer/IACalendarSuggestions.tsx
touch src/modules/calendar-optimizer/SharedCalendarSlots.tsx

# 8.7 Module contract-analyzer
mkdir -p src/modules/contract-analyzer

touch src/modules/contract-analyzer/StandardContractViewer.tsx
touch src/modules/contract-analyzer/IAClauseDetector.tsx
touch src/modules/contract-analyzer/ContractComparison.tsx

# 8.8 Module assistant
mkdir -p src/modules/assistant

touch src/modules/assistant/StandardHelpCenter.tsx
touch src/modules/assistant/IAVoiceAssistant.tsx
touch src/modules/assistant/SharedChatHistory.tsx

# ---------- 9. SHARED (UI + LAYOUT + UTILS) ----------
mkdir -p src/shared/ui
mkdir -p src/shared/layout
mkdir -p src/shared/utils

touch src/shared/ui/Button.tsx
touch src/shared/ui/Card.tsx
touch src/shared/ui/Modal.tsx
touch src/shared/ui/Table.tsx
touch src/shared/ui/LoadingSpinner.tsx
touch src/shared/ui/ErrorBoundary.tsx

touch src/shared/layout/AdminLayout.tsx
touch src/shared/layout/BrokerLayout.tsx
touch src/shared/layout/AdminSidebar.tsx
touch src/shared/layout/AdminHeader.tsx
touch src/shared/layout/BrokerSidebar.tsx
touch src/shared/layout/BrokerHeader.tsx

touch src/shared/utils/formatDate.ts
touch src/shared/utils/formatCurrency.ts
touch src/shared/utils/api.ts

# ---------- 10. COMPOSANTS ADMIN (ancienne structure conservée) ----------
mkdir -p src/components/admin/ia
mkdir -p src/components/admin/shared
mkdir -p src/components/admin/layout

touch src/components/admin/ia/FraudScoreCard.tsx
touch src/components/admin/ia/CompanyRiskTable.tsx
touch src/components/admin/ia/AuditReportGenerator.tsx
touch src/components/admin/ia/GlobalPredictionChart.tsx
touch src/components/admin/ia/ComplianceChecklist.tsx
touch src/components/admin/ia/BrokerPerformanceList.tsx
touch src/components/admin/ia/EventOrchestratorPanel.tsx
touch src/components/admin/ia/JobSchedulerControls.tsx
touch src/components/admin/ia/WebhookTester.tsx
touch src/components/admin/ia/IAUnifiedAssistant.tsx
touch src/components/admin/shared/IAMetricCard.tsx
touch src/components/admin/shared/IAAlertBanner.tsx
touch src/components/admin/shared/IAEventTimeline.tsx
touch src/components/admin/layout/AdminSidebar.tsx

# ---------- 11. COMPOSANTS BROKER (ancienne structure conservée) ----------
mkdir -p src/components/broker/ia
mkdir -p src/components/broker/shared
mkdir -p src/components/broker/layout

touch src/components/broker/ia/ClientRiskScore.tsx
touch src/components/broker/ia/PolicyClauseAnalyzer.tsx
touch src/components/broker/ia/ClaimPredictionWidget.tsx
touch src/components/broker/ia/CommissionForecast.tsx
touch src/components/broker/ia/SmartCalendarSuggestions.tsx
touch src/components/broker/ia/ExpiringContractsAlert.tsx
touch src/components/broker/ia/MissingDocumentsReminder.tsx
touch src/components/broker/ia/BirthdayOfferGenerator.tsx
touch src/components/broker/ia/RenewalPredictionCard.tsx
touch src/components/broker/ia/IAUnifiedAssistantBroker.tsx
touch src/components/broker/shared/BrokerNotificationCenter.tsx
touch src/components/broker/shared/BrokerQuickActions.tsx
touch src/components/broker/shared/BrokerEventList.tsx
touch src/components/broker/layout/BrokerSidebar.tsx

# ---------- 12. COMPOSANTS SHARED IA ----------
mkdir -p src/components/shared/ia

touch src/components/shared/ia/IAVoiceAssistant.tsx
touch src/components/shared/ia/IAContextualHelp.tsx
touch src/components/shared/ia/IANotificationToast.tsx
touch src/components/shared/ia/IAEventBusVisualizer.tsx
touch src/components/shared/ia/IAFeedbackCollector.tsx
touch src/components/shared/ia/IACostTracker.tsx
touch src/components/shared/ia/IAPermissionGuard.tsx

# ---------- 13. HOOKS (ancienne structure conservée) ----------
mkdir -p src/hooks

touch src/hooks/useAuth.ts
touch src/hooks/usePermissions.ts
touch src/hooks/useLocalStorage.ts
touch src/hooks/useIAFraudDetection.ts
touch src/hooks/useIARiskScore.ts
touch src/hooks/useIAPrediction.ts
touch src/hooks/useIAAudit.ts
touch src/hooks/useIACompliance.ts
touch src/hooks/useIACalendarOptimization.ts
touch src/hooks/useIAContractAnalysis.ts
touch src/hooks/useIACommissionForecast.ts
touch src/hooks/useIANotifications.ts
touch src/hooks/useIAEvents.ts
touch src/hooks/useIAWebhooks.ts

# ---------- 14. LIB / API (ancienne structure conservée) ----------
mkdir -p src/lib/api
mkdir -p src/lib/auth
mkdir -p src/lib/config
mkdir -p src/lib/utils

touch src/lib/api/ia-fraud.ts
touch src/lib/api/ia-risk.ts
touch src/lib/api/ia-prediction.ts
touch src/lib/api/ia-audit.ts
touch src/lib/api/ia-compliance.ts
touch src/lib/api/ia-calendar.ts
touch src/lib/api/ia-contract.ts
touch src/lib/api/ia-commission.ts
touch src/lib/api/ia-events.ts
touch src/lib/api/ia-jobs.ts
touch src/lib/api/ia-webhooks.ts
touch src/lib/api/company-ai.ts
touch src/lib/api/policy-ai.ts
touch src/lib/api/calendar-ai.ts
touch src/lib/api/ai-assistant.ts
touch src/lib/api/ia-settings.ts
touch src/lib/api/ia-reports.ts
touch src/lib/api/ia-dashboard.ts
touch src/lib/api/ia-audit.ts

touch src/lib/auth/auth.config.ts
touch src/lib/auth/session.ts

touch src/lib/config/routes.ts
touch src/lib/config/permissions.ts

touch src/lib/utils/format.ts

# ---------- 15. TYPES (ancienne structure conservée) ----------
mkdir -p src/types

touch src/types/roles.ts
touch src/types/user.ts
touch src/types/index.ts
touch src/types/ai-company.types.ts
touch src/types/ai-policy.types.ts
touch src/types/ai-calendar.types.ts
touch src/types/ai-assistant.types.ts
touch src/types/ia-settings.types.ts
touch src/types/ia-report.types.ts
touch src/types/ia-audit.types.ts
touch src/types/ia-dashboard.types.ts
touch src/types/report.types.ts
touch src/types/report-standards.types.ts
touch src/types/report-ai.types.ts

# ---------- 16. CONFIG ----------
touch src/config/paliers.config.ts
touch src/config/monetization.config.ts
touch src/config/telemetry.config.ts

# ---------- 17. MIDDLEWARE ----------
touch src/middleware/iaPalierGuard.ts
touch src/middleware/telemetryCollector.middleware.ts
touch src/middleware/ia-rate-limiter.ts
touch src/middleware/ia-cost-tracker.ts

# ---------- 18. FICHIER MIDDLEWARE RACINE ----------
touch src/middleware.ts

# ---------- 19. STYLES ----------
mkdir -p src/styles
touch src/styles/globals.css

# ---------- 20. FICHIER ENVIRONNEMENT ----------
touch .env.local

echo "✅ Structure complète créée avec succès !"
echo "📁 Nombre total de fichiers vides : $(find src -type f | wc -l)"
echo "🚀 Vous pouvez maintenant coder chaque fichier (<200 lignes chacun)"