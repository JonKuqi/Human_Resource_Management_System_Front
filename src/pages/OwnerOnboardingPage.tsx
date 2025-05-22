'use client'
export const dynamic = 'force-dynamic';
import { Suspense } from 'react'
import OwnerOnboardingContent from './OwnerOnboardingContent'

export default function OwnerOnboardingPage() {
  return (
      <Suspense fallback={<div className="text-center mt-20 text-gray-500">Loading...</div>}>
        <OwnerOnboardingContent />
      </Suspense>
  )
}