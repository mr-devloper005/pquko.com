'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RegisterForm() {
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim() || !password) {
      setError('Enter your name, email, and password.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Use at least 6 characters for your password.')
      return
    }
    try {
      await signup(name.trim(), email.trim(), password)
      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="register-name" className="text-sm font-medium text-neutral-700">
          Full name
        </Label>
        <Input
          id="register-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          placeholder="Alex Rivera"
          className="h-12 rounded-2xl border-neutral-200 bg-white px-4 text-neutral-950"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="register-email" className="text-sm font-medium text-neutral-700">
          Email
        </Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="you@example.com"
          className="h-12 rounded-2xl border-neutral-200 bg-white px-4 text-neutral-950"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="register-password" className="text-sm font-medium text-neutral-700">
            Password
          </Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-2xl border-neutral-200 bg-white px-4 text-neutral-950"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-confirm" className="text-sm font-medium text-neutral-700">
            Confirm password
          </Label>
          <Input
            id="register-confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(ev) => setConfirm(ev.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-2xl border-neutral-200 bg-white px-4 text-neutral-950"
          />
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={isLoading} className="h-12 rounded-full bg-neutral-950 text-white hover:bg-neutral-800">
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
