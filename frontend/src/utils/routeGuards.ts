import { UserMode } from '@/context/UserModeContext';

// Routes only accessible in Service mode
export const serviceOnlyRoutes = [
  '/submit-requirement',
  '/chat-support',
  '/track-simple',
  '/dashboard-service',
  '/billing-history',
];

// Routes only accessible in Platform mode
export const platformOnlyRoutes = [
  '/market-insights',
  '/exim-data',
  '/smart-sourcing',
  '/cost-calculator',
  '/compliance-tools',
  '/ai-assistant',
  '/saved-suppliers',
  '/team-management',
  '/reports',
  '/api-settings',
  '/payments',
];

// Routes accessible in both modes
export const sharedRoutes = [
  '/',
  '/dashboard',
  '/my-orders',
  '/settings',
  '/documents',
  '/track-shipment',
  '/mode-selection',
];

// Routes that don't require mode selection
export const publicRoutes = [
  '/',
  '/mode-selection',
];

export function isServiceOnlyRoute(pathname: string): boolean {
  return serviceOnlyRoutes.some(route => pathname.startsWith(route));
}

export function isPlatformOnlyRoute(pathname: string): boolean {
  return platformOnlyRoutes.some(route => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

export function canAccessRoute(pathname: string, userMode: UserMode): boolean {
  // Public routes are always accessible
  if (isPublicRoute(pathname)) {
    return true;
  }

  // If no mode selected, only public routes are accessible
  if (!userMode) {
    return false;
  }

  // Check mode-specific routes
  if (userMode === 'service') {
    return !isPlatformOnlyRoute(pathname);
  }

  if (userMode === 'platform') {
    return !isServiceOnlyRoute(pathname);
  }

  return true;
}

export function getRedirectPath(pathname: string, userMode: UserMode): string | null {
  if (!userMode) {
    return '/mode-selection';
  }

  // Service user trying to access platform route
  if (userMode === 'service' && isPlatformOnlyRoute(pathname)) {
    // Map platform routes to service equivalents
    const redirectMap: Record<string, string> = {
      '/market-insights': '/dashboard-service',
      '/exim-data': '/dashboard-service',
      '/smart-sourcing': '/submit-requirement',
      '/cost-calculator': '/chat-support',
      '/compliance-tools': '/documents',
      '/ai-assistant': '/chat-support',
      '/saved-suppliers': '/my-orders',
      '/team-management': '/settings',
      '/reports': '/billing-history',
      '/api-settings': '/settings',
      '/payments': '/billing-history',
    };
    
    return redirectMap[pathname] || '/dashboard-service';
  }

  // Platform user trying to access service route
  if (userMode === 'platform' && isServiceOnlyRoute(pathname)) {
    const redirectMap: Record<string, string> = {
      '/submit-requirement': '/smart-sourcing',
      '/chat-support': '/ai-assistant',
      '/track-simple': '/track-shipment',
      '/dashboard-service': '/dashboard',
      '/billing-history': '/settings',
    };
    
    return redirectMap[pathname] || '/dashboard';
  }

  return null;
}

// Get the appropriate dashboard based on user mode
export function getDashboardPath(userMode: UserMode): string {
  if (userMode === 'service') {
    return '/dashboard-service';
  }
  return '/dashboard';
}

