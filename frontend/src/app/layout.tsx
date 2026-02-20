import type { Metadata } from 'next'
import Script from "next/script";
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { UserProvider } from '@/context/UserModeContext'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { PostHogPageView } from '@/components/providers/PostHogPageView'
import { NextStepWrapper } from '@/components/providers/NextStepWrapper'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'BEFACH International - AI-Powered Trade Intelligence Platform',
  description: 'Your AI-powered command center for global trade operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className={inter.className}>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <UserProvider>
            <NextStepWrapper>
              {children}
            </NextStepWrapper>
          </UserProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
