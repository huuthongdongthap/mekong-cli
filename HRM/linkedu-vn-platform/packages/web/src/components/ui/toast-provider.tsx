'use client'

import { Toaster } from 'sonner'

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'white', border: '1px solid #e5e7eb' },
        }}
      />
      {children}
    </>
  )
}
