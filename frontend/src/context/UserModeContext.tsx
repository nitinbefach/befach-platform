'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Organization {
  name: string;
  type: 'individual' | 'company';
  teamSize: '1' | '2-5' | '6-20' | '20+';
  primaryGoals?: string[];
}

export interface Subscription {
  plan: 'free' | 'starter' | 'growth' | 'enterprise';
  seats: number;
  validUntil: Date | null;
}

export interface SidebarPreferences {
  pinnedItems: string[];
  collapsedSections: string[];
  hiddenItems: string[];
}

interface UserContextType {
  isAuthenticated: boolean;
  organization: Organization | null;
  userRole: UserRole;
  subscription: Subscription | null;
  sidebarPreferences: SidebarPreferences;
  hasCompletedOnboarding: boolean;
  hasCompletedTour: boolean;
  isLoading: boolean;
  login: (org: Organization) => void;
  logout: () => void;
  updateOrganization: (org: Partial<Organization>) => void;
  updateSidebarPreferences: (prefs: Partial<SidebarPreferences>) => void;
  completeOnboarding: () => void;
  completeTour: () => void;
  skipTour: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'befach-user';
const SIDEBAR_PREFS_KEY = 'befach-sidebar-prefs';
const ONBOARDING_KEY = 'befach-onboarding';
const TOUR_KEY = 'befach-tour';

const defaultSidebarPreferences: SidebarPreferences = {
  pinnedItems: ['dashboard', 'my-orders', 'submit-requirement'],
  collapsedSections: [],
  hiddenItems: []
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('owner');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [sidebarPreferences, setSidebarPreferences] = useState<SidebarPreferences>(defaultSidebarPreferences);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Load saved state from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      const savedPrefs = localStorage.getItem(SIDEBAR_PREFS_KEY);
      const savedOnboarding = localStorage.getItem(ONBOARDING_KEY);
      const savedTour = localStorage.getItem(TOUR_KEY);
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setOrganization(userData.organization);
        setSubscription(userData.subscription || {
          plan: 'free',
          seats: 1,
          validUntil: null
        });
      }
      
      if (savedPrefs) {
        setSidebarPreferences(JSON.parse(savedPrefs));
      }

      if (savedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }

      if (savedTour === 'true') {
        setHasCompletedTour(true);
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Redirect unauthenticated users to home (except public routes)
  useEffect(() => {
    const publicRoutes = ['/', '/onboarding'];
    if (!isLoading && mounted && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, mounted, pathname, router]);

  // Redirect authenticated users who haven't completed onboarding
  useEffect(() => {
    if (!isLoading && mounted && isAuthenticated && !hasCompletedOnboarding && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, mounted, pathname, router]);

  const login = useCallback((org: Organization) => {
    setIsAuthenticated(true);
    setOrganization(org);
    setSubscription({
      plan: 'free',
      seats: 1,
      validUntil: null
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      organization: org,
      subscription: { plan: 'free', seats: 1, validUntil: null }
    }));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setOrganization(null);
    setSubscription(null);
    setHasCompletedOnboarding(false);
    setHasCompletedTour(false);
    setSidebarPreferences(defaultSidebarPreferences);
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SIDEBAR_PREFS_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(TOUR_KEY);
    
    router.push('/');
  }, [router]);

  const updateOrganization = useCallback((org: Partial<Organization>) => {
    setOrganization(prev => {
      const updated = { ...prev, ...org } as Organization;
      const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...currentData,
        organization: updated
      }));
      return updated;
    });
  }, []);

  const updateSidebarPreferences = useCallback((prefs: Partial<SidebarPreferences>) => {
    setSidebarPreferences(prev => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem(SIDEBAR_PREFS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  const completeTour = useCallback(() => {
    setHasCompletedTour(true);
    localStorage.setItem(TOUR_KEY, 'true');
  }, []);

  const skipTour = useCallback(() => {
    setHasCompletedTour(true);
    localStorage.setItem(TOUR_KEY, 'true');
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        organization,
        userRole,
        subscription,
        sidebarPreferences,
        hasCompletedOnboarding,
        hasCompletedTour,
        isLoading,
        login,
        logout,
        updateOrganization,
        updateSidebarPreferences,
        completeOnboarding,
        completeTour,
        skipTour
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Keep backward compatibility alias
export const useUserMode = useUser;
export const UserModeProvider = UserProvider;
