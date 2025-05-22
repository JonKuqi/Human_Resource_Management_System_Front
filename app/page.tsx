'use client'
export const dynamic = 'force-dynamic'

// rename dynamic import to avoid naming conflict
import * as NextDynamic from 'next/dynamic'

const App = NextDynamic.default(() => import('../src/App'), { ssr: false })

export default function Page() {
  return <App />
}