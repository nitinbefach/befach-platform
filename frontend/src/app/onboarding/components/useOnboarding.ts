'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserModeContext';
import {
  Search, Truck, Calculator, BarChart3, FileCheck, Users,
  User, Building2, Compass, ArrowRight, type LucideIcon
} from 'lucide-react';

export type Step = 'profile' | 'goals' | 'tour-choice';

export interface GoalOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const goalOptions: GoalOption[] = [
  { id: 'source-products', label: 'Source products from suppliers', icon: Search },
  { id: 'track-shipments', label: 'Track shipments and logistics', icon: Truck },
  { id: 'calculate-costs', label: 'Calculate import costs and duties', icon: Calculator },
  { id: 'market-research', label: 'Research market trends', icon: BarChart3 },
  { id: 'manage-compliance', label: 'Manage compliance and documents', icon: FileCheck },
  { id: 'team-collaboration', label: 'Collaborate with my team', icon: Users },
];

export const typeOptions = {
  individual: { label: 'Individual', desc: 'Sole proprietor or freelancer', icon: User },
  company: { label: 'Company', desc: 'Registered business entity', icon: Building2 },
} as const;

export const tourOptions = {
  start: { label: 'Take the Tour', desc: '2 minute interactive walkthrough', icon: Compass },
  skip: { label: 'Skip for Now', desc: 'Jump straight to the dashboard', icon: ArrowRight },
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
  handleStartTour: () => void;
  handleSkipTour: () => void;
  canSubmitProfile: boolean;
}

export function useOnboarding(): UseOnboardingReturn {
  const [step, setStep] = useState<Step>('profile');
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState<'individual' | 'company'>('company');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { login, completeOnboarding, completeTour } = useUser();
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
    setStep('tour-choice');
  };

  const handleGoBack = () => {
    setStep('profile');
  };

  const handleStartTour = () => {
    completeOnboarding();
    const dest = redirectTo || '/dashboard';
    router.push(redirectTo ? dest : '/dashboard?tour=true');
  };

  const handleSkipTour = () => {
    completeOnboarding();
    completeTour();
    router.push(redirectTo || '/dashboard');
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
    handleStartTour,
    handleSkipTour,
    canSubmitProfile: companyName.trim() !== '',
  };
}
