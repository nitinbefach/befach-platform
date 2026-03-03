'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { safeStorage } from '@/lib/safeStorage';
import posthog from 'posthog-js';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Organization {
  name: string;
  type: 'individual' | 'company';
  teamSize: '1' | '2-5' | '6-20' | '20+';
  primaryGoals?: string[];
  industry?: string;
  role?: string;
  experienceLevel?: string;
  tradeVolume?: string;
  tradeDirection?: string;
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
  isLoading: boolean;
  login: (org: Organization) => void;
  logout: () => void;
  updateOrganization: (org: Partial<Organization>) => void;
  updateSidebarPreferences: (prefs: Partial<SidebarPreferences>) => void;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'befach-user';
const SIDEBAR_PREFS_KEY = 'befach-sidebar-prefs';
const ONBOARDING_KEY = 'befach-onboarding';

const defaultSidebarPreferences: SidebarPreferences = {
  pinnedItems: ['dashboard', 'my-orders', 'submit-requirement'],
  collapsedSections: [],
  hiddenItems: []
};

const defaultOrganization: Organization = {
  name: 'Befach Demo',
  type: 'company',
  teamSize: '2-5',
  primaryGoals: ['source-products', 'track-shipments', 'calculate-costs'],
  industry: 'other',
  role: 'owner',
  experienceLevel: '1-3-years',
  tradeVolume: 'exploring',
  tradeDirection: 'import',
};

const defaultSubscription: Subscription = {
  plan: 'free',
  seats: 5,
  validUntil: null,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(defaultOrganization);
  const [userRole] = useState<UserRole>('owner');
  const [subscription, setSubscription] = useState<Subscription | null>(defaultSubscription);
  const [sidebarPreferences, setSidebarPreferences] = useState<SidebarPreferences>(defaultSidebarPreferences);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [isLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Load saved sidebar preferences from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const savedPrefs = safeStorage.getItem(SIDEBAR_PREFS_KEY);
      if (savedPrefs) {
        setSidebarPreferences(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    }

    // Re-identify returning users for PostHog session stitching
    const savedUser = safeStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const { organization: savedOrg, subscription: savedSub } = JSON.parse(savedUser);
        if (savedOrg?.name) {
          posthog.identify(savedOrg.name, {
            company_name: savedOrg.name,
            company_type: savedOrg.type,
            team_size: savedOrg.teamSize,
            plan: savedSub?.plan || 'free',
            role: 'owner',
            goals: savedOrg.primaryGoals || [],
            industry: savedOrg.industry || '',
            user_role: savedOrg.role || '',
            experience_level: savedOrg.experienceLevel || '',
            trade_volume: savedOrg.tradeVolume || '',
            trade_direction: savedOrg.tradeDirection || '',
          });
        }
      } catch (e) {
        // Silently fail — don't block app initialization
      }
    }
  }, []);

  const login = useCallback((org: Organization) => {
    setIsAuthenticated(true);
    setOrganization(org);
    setSubscription({
      plan: 'free',
      seats: 1,
      validUntil: null
    });
    
    safeStorage.setItem(STORAGE_KEY, JSON.stringify({
      organization: org,
      subscription: { plan: 'free', seats: 1, validUntil: null }
    }));

    posthog.identify(org.name, {
      company_name: org.name,
      company_type: org.type,
      team_size: org.teamSize,
      plan: 'free',
      role: 'owner',
      goals: org.primaryGoals || [],
      industry: org.industry || '',
      user_role: org.role || '',
      experience_level: org.experienceLevel || '',
      trade_volume: org.tradeVolume || '',
      trade_direction: org.tradeDirection || '',
    });
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setOrganization(null);
    setSubscription(null);
    setHasCompletedOnboarding(false);
    setSidebarPreferences(defaultSidebarPreferences);

    safeStorage.removeItem(STORAGE_KEY);
    safeStorage.removeItem(SIDEBAR_PREFS_KEY);
    safeStorage.removeItem(ONBOARDING_KEY);

    posthog.reset();

    router.push('/');
  }, [router]);

  const updateOrganization = useCallback((org: Partial<Organization>) => {
    setOrganization(prev => {
      const updated = { ...prev, ...org } as Organization;
      const currentData = JSON.parse(safeStorage.getItem(STORAGE_KEY) || '{}');
      safeStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...currentData,
        organization: updated
      }));
      return updated;
    });
  }, []);

  const updateSidebarPreferences = useCallback((prefs: Partial<SidebarPreferences>) => {
    setSidebarPreferences(prev => {
      const updated = { ...prev, ...prefs };
      safeStorage.setItem(SIDEBAR_PREFS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
    safeStorage.setItem(ONBOARDING_KEY, 'true');
    posthog.capture('onboarding_completed', {
      goals_count: organization?.primaryGoals?.length || 0,
      industry: organization?.industry || '',
      trade_volume: organization?.tradeVolume || '',
    });
  }, [organization]);

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
        isLoading,
        login,
        logout,
        updateOrganization,
        updateSidebarPreferences,
        completeOnboarding
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
