'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserModeContext';
import posthog from 'posthog-js';
import { reloadPostHogSurveys } from '@/components/providers/PostHogProvider';
import {
  PackageSearch, Ship, BadgeDollarSign, TrendingUp, ShieldCheck, Handshake,
  User, Building2, type LucideIcon
} from 'lucide-react';

export type Step = 'profile' | 'goals';

export interface GoalOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const goalOptions: GoalOption[] = [
  { id: 'source-products', label: 'Source products from suppliers', icon: PackageSearch },
  { id: 'track-shipments', label: 'Track shipments and logistics', icon: Ship },
  { id: 'calculate-costs', label: 'Calculate import costs and duties', icon: BadgeDollarSign },
  { id: 'market-research', label: 'Research market trends', icon: TrendingUp },
  { id: 'manage-compliance', label: 'Manage compliance and documents', icon: ShieldCheck },
  { id: 'team-collaboration', label: 'Collaborate with my team', icon: Handshake },
];

export const typeOptions = {
  individual: { label: 'Individual', desc: 'Sole proprietor or freelancer', icon: User },
  company: { label: 'Company', desc: 'Registered business entity', icon: Building2 },
} as const;

export interface UseOnboardingReturn {
  step: Step;
  companyName: string;
  companyType: 'individual' | 'company';
  selectedGoals: string[];
  setCompanyName: (name: string) => void;
  setCompanyType: (type: 'individual' | 'company') => void;
  handleProfileSubmit: () => void;
  handleGoalToggle: (goalId: string) => void;
  handleGoalsSubmit: () => void;
  handleGoBack: () => void;
  canSubmitProfile: boolean;
}

export function useOnboarding(): UseOnboardingReturn {
  const [step, setStep] = useState<Step>('profile');
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState<'individual' | 'company'>('company');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { login, completeOnboarding } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const handleProfileSubmit = () => {
    if (companyName.trim()) {
      login({
        name: companyName,
        type: companyType,
        teamSize: '1',
        primaryGoals: []
      });
      posthog.identify(companyName.trim(), {
        company_name: companyName.trim(),
        company_type: companyType,
      });
      reloadPostHogSurveys();
      setStep('goals');
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleGoalsSubmit = () => {
    completeOnboarding();
    posthog.capture('onboarding_completed', {
      company_name: companyName.trim(),
      company_type: companyType,
      goals: selectedGoals,
      goals_count: selectedGoals.length,
    });
    reloadPostHogSurveys();
    router.push(redirectTo || '/dashboard?tour=true');
  };

  const handleGoBack = () => {
    setStep('profile');
  };

  return {
    step,
    companyName,
    companyType,
    selectedGoals,
    setCompanyName,
    setCompanyType,
    handleProfileSubmit,
    handleGoalToggle,
    handleGoalsSubmit,
    handleGoBack,
    canSubmitProfile: companyName.trim() !== '',
  };
}
