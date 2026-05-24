Write-Host "🚀 Création de la structure frontend synchrone avec le backend..." -ForegroundColor Green

# ==============================================
# 1. DOSSIERS PRINCIPAUX
# ==============================================
$folders = @(
    # App routes
    "src/app/(admin)/dashboard",
    "src/app/(admin)/companies",
    "src/app/(admin)/companies/[id]",
    "src/app/(admin)/policies",
    "src/app/(admin)/policies/[id]",
    "src/app/(admin)/claims",
    "src/app/(admin)/claims/[id]",
    "src/app/(admin)/reports",
    "src/app/(admin)/reports/[id]",
    "src/app/(admin)/ia-settings",
    "src/app/(admin)/ai-assistant",
    "src/app/(admin)/insights",
    "src/app/(admin)/calendar",
    "src/app/(admin)/users",
    "src/app/(admin)/audit-logs",
    "src/app/(broker)/dashboard",
    "src/app/(broker)/companies",
    "src/app/(broker)/companies/[id]",
    "src/app/(broker)/policies",
    "src/app/(broker)/policies/[id]",
    "src/app/(broker)/claims",
    "src/app/(broker)/claims/[id]",
    "src/app/(broker)/calendar",
    "src/app/(broker)/ai-assistant",
    "src/app/(broker)/reports",
    "src/app/(broker)/clients",
    "src/app/(broker)/clients/[id]",
    "src/app/(broker)/commissions",
    "src/app/(broker)/documents",
    "src/app/(auth)/login",
    "src/app/(auth)/register",
    "src/app/(auth)/forgot-password",
    "src/app/(shared)/profile",
    "src/app/(shared)/notifications",
    "src/app/api/auth",
    "src/app/api/webhooks",
    # Modules frontend (consommation API uniquement)
    "src/modules/api/client",
    "src/modules/api/companies",
    "src/modules/api/policies",
    "src/modules/api/claims",
    "src/modules/api/ia-settings",
    "src/modules/api/reports",
    "src/modules/api/ai-assistant",
    "src/modules/api/insights",
    "src/modules/api/dashboard",
    "src/modules/api/calendar",
    "src/modules/api/contacts",
    "src/modules/api/renewals",
    "src/modules/api/auth",
    "src/modules/ia-core/hooks",
    "src/modules/ia-core/components",
    "src/modules/ia-core/types",
    "src/modules/reports/components",
    "src/modules/reports/hooks",
    "src/modules/reports/types",
    "src/modules/telemetry/collectors",
    "src/modules/telemetry/dashboards",
    "src/modules/monetization/pricing",
    "src/modules/monetization/usage",
    # Shared
    "src/shared/ui",
    "src/shared/layout",
    "src/shared/utils",
    "src/shared/guards",
    # Components
    "src/components/admin/companies",
    "src/components/admin/policies",
    "src/components/admin/claims",
    "src/components/admin/reports",
    "src/components/admin/ia-settings",
    "src/components/admin/shared",
    "src/components/broker/clients",
    "src/components/broker/policies",
    "src/components/broker/claims",
    "src/components/broker/calendar",
    "src/components/broker/shared",
    "src/components/shared/ia",
    "src/components/shared/forms",
    "src/components/shared/tables",
    # Hooks globaux
    "src/hooks",
    # Types globaux
    "src/types",
    # Config
    "src/config",
    # Middleware
    "src/middleware",
    # Styles
    "src/styles"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

# ==============================================
# 2. FICHIERS VIDES
# ==============================================

$files = @(
    # App admin pages
    "src/app/(admin)/layout.tsx",
    "src/app/(admin)/dashboard/page.tsx",
    "src/app/(admin)/companies/page.tsx",
    "src/app/(admin)/companies/[id]/page.tsx",
    "src/app/(admin)/policies/page.tsx",
    "src/app/(admin)/policies/[id]/page.tsx",
    "src/app/(admin)/claims/page.tsx",
    "src/app/(admin)/claims/[id]/page.tsx",
    "src/app/(admin)/reports/page.tsx",
    "src/app/(admin)/reports/[id]/page.tsx",
    "src/app/(admin)/ia-settings/page.tsx",
    "src/app/(admin)/ai-assistant/page.tsx",
    "src/app/(admin)/insights/page.tsx",
    "src/app/(admin)/calendar/page.tsx",
    "src/app/(admin)/users/page.tsx",
    "src/app/(admin)/audit-logs/page.tsx",
    # App broker pages
    "src/app/(broker)/layout.tsx",
    "src/app/(broker)/dashboard/page.tsx",
    "src/app/(broker)/companies/page.tsx",
    "src/app/(broker)/companies/[id]/page.tsx",
    "src/app/(broker)/policies/page.tsx",
    "src/app/(broker)/policies/[id]/page.tsx",
    "src/app/(broker)/claims/page.tsx",
    "src/app/(broker)/claims/[id]/page.tsx",
    "src/app/(broker)/calendar/page.tsx",
    "src/app/(broker)/ai-assistant/page.tsx",
    "src/app/(broker)/reports/page.tsx",
    "src/app/(broker)/clients/page.tsx",
    "src/app/(broker)/clients/[id]/page.tsx",
    "src/app/(broker)/commissions/page.tsx",
    "src/app/(broker)/documents/page.tsx",
    # App auth pages
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/register/page.tsx",
    "src/app/(auth)/forgot-password/page.tsx",
    # App shared pages
    "src/app/(shared)/profile/page.tsx",
    "src/app/(shared)/notifications/page.tsx",
    # App api routes
    "src/app/api/auth/route.ts",
    "src/app/api/webhooks/route.ts",
    # App root
    "src/app/layout.tsx",
    "src/app/page.tsx",
    # Modules API clients
    "src/modules/api/client/client.ts",
    "src/modules/api/companies/companies.api.ts",
    "src/modules/api/policies/policies.api.ts",
    "src/modules/api/claims/claims.api.ts",
    "src/modules/api/claims/claims-ia.api.ts",
    "src/modules/api/ia-settings/ia-settings.api.ts",
    "src/modules/api/reports/reports.api.ts",
    "src/modules/api/ai-assistant/ai-assistant.api.ts",
    "src/modules/api/insights/insights.api.ts",
    "src/modules/api/dashboard/dashboard.api.ts",
    "src/modules/api/calendar/calendar.api.ts",
    "src/modules/api/contacts/contacts.api.ts",
    "src/modules/api/renewals/renewals.api.ts",
    "src/modules/api/auth/auth.api.ts",
    # Modules IA core
    "src/modules/ia-core/hooks/useIAFraudDetection.ts",
    "src/modules/ia-core/hooks/useIARiskScore.ts",
    "src/modules/ia-core/hooks/useIAPrediction.ts",
    "src/modules/ia-core/components/IAScoreBadge.tsx",
    "src/modules/ia-core/components/IAAnalysisModal.tsx",
    "src/modules/ia-core/types/ia.types.ts",
    # Modules reports
    "src/modules/reports/components/ReportGenerator.tsx",
    "src/modules/reports/components/ReportList.tsx",
    "src/modules/reports/components/ReportExporter.tsx",
    "src/modules/reports/hooks/useReports.ts",
    "src/modules/reports/types/report.types.ts",
    # Shared
    "src/shared/ui/Button.tsx",
    "src/shared/ui/Card.tsx",
    "src/shared/ui/Table.tsx",
    "src/shared/ui/Modal.tsx",
    "src/shared/ui/LoadingSpinner.tsx",
    "src/shared/ui/ErrorBoundary.tsx",
    "src/shared/layout/AdminLayout.tsx",
    "src/shared/layout/BrokerLayout.tsx",
    "src/shared/layout/AdminSidebar.tsx",
    "src/shared/layout/BrokerSidebar.tsx",
    "src/shared/layout/Header.tsx",
    "src/shared/utils/formatDate.ts",
    "src/shared/utils/formatCurrency.ts",
    "src/shared/utils/api.ts",
    "src/shared/guards/AuthGuard.tsx",
    "src/shared/guards/RoleGuard.tsx",
    # Components admin
    "src/components/admin/companies/CompanyList.tsx",
    "src/components/admin/companies/CompanyForm.tsx",
    "src/components/admin/companies/CompanyRiskScore.tsx",
    "src/components/admin/policies/PolicyList.tsx",
    "src/components/admin/policies/PolicyForm.tsx",
    "src/components/admin/claims/ClaimList.tsx",
    "src/components/admin/claims/ClaimFraudAlert.tsx",
    "src/components/admin/reports/ReportDashboard.tsx",
    "src/components/admin/ia-settings/IASettingsForm.tsx",
    "src/components/admin/shared/StatsCard.tsx",
    "src/components/admin/shared/DataTable.tsx",
    # Components broker
    "src/components/broker/clients/ClientList.tsx",
    "src/components/broker/clients/ClientDetail.tsx",
    "src/components/broker/clients/ClientRiskScore.tsx",
    "src/components/broker/policies/PolicyRenewalAlert.tsx",
    "src/components/broker/claims/ClaimPrediction.tsx",
    "src/components/broker/calendar/CalendarOptimizer.tsx",
    "src/components/broker/shared/BrokerStats.tsx",
    "src/components/broker/shared/QuickActions.tsx",
    # Components shared IA
    "src/components/shared/ia/IAVoiceAssistant.tsx",
    "src/components/shared/ia/IAContextualHelp.tsx",
    "src/components/shared/ia/IAFeedbackCollector.tsx",
    "src/components/shared/forms/Input.tsx",
    "src/components/shared/forms/Select.tsx",
    "src/components/shared/tables/DataTable.tsx",
    "src/components/shared/tables/Pagination.tsx",
    # Hooks globaux
    "src/hooks/useAuth.ts",
    "src/hooks/useLocalStorage.ts",
    "src/hooks/useDebounce.ts",
    "src/hooks/useToast.ts",
    # Types globaux
    "src/types/company.types.ts",
    "src/types/policy.types.ts",
    "src/types/claim.types.ts",
    "src/types/user.types.ts",
    "src/types/report.types.ts",
    "src/types/api.types.ts",
    "src/types/index.ts",
    # Config
    "src/config/api.config.ts",
    "src/config/app.config.ts",
    "src/config/paliers.config.ts",
    # Middleware
    "src/middleware/auth.middleware.ts",
    "src/middleware.ts",
    # Styles
    "src/styles/globals.css",
    # Env
    ".env.local"
)

foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}

# ==============================================
# 3. RÉSULTAT FINAL
# ==============================================

$fileCount = (Get-ChildItem -Path "src" -Recurse -File).Count
Write-Host "✅ Structure complete creee avec succes !" -ForegroundColor Green
Write-Host "📁 Nombre total de fichiers vides : $fileCount" -ForegroundColor Yellow
Write-Host "🚀 Structure synchrone avec le backend (port 3001)" -ForegroundColor Cyan