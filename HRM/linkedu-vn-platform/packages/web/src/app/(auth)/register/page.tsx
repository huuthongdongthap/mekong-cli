"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'
import { useAuthStore } from '@/lib/auth-store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setError(null)
    try {
      const result = await api.post<{ accessToken: string }>('/auth/register', data)
      useAuthStore.getState().setToken(result.accessToken)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('REGISTER_FAIL'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-6 text-card-foreground">{t('REGISTER')}</h1>
        {error && (
          <p className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">{error}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">Ho</label>
              <input id="firstName" type="text" {...register('firstName')} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">Ten</label>
              <input id="lastName" type="text" {...register('lastName')} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
              {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" type="email" {...register('email')} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">{t('PASSWORD')}</label>
            <input id="password" type="password" {...register('password')} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <p className="text-xs text-muted-foreground mb-1">{t('REGISTER_DEFAULT_ROLE')}</p>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t('PROCESSING') : t('REGISTER')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('HAVE_ACCOUNT')} <Link href="/login" className="underline">{t('LOGIN')}</Link>
        </p>
      </div>
    </div>
  )
}
