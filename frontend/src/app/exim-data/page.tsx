'use client';

import { useMobile } from '@/hooks/useMobile';
import { EximDataProvider, MobileEximData, WebEximData } from './components';

function EximDataContent() {
  const { isMobile } = useMobile();
  return isMobile ? <MobileEximData /> : <WebEximData />;
}

export default function EximDataPage() {
  return (
    <EximDataProvider>
      <EximDataContent />
    </EximDataProvider>
  );
}
