'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Train } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { toast.error('Email o contraseña incorrectos'); return }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
        router.push(profile?.role === 'admin' ? '/admin/dashboard' : '/comunicados-exclusivos')
        router.refresh()
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3a5c] stripe-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0f2540] opacity-90" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-[#c0392b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Train className="w-10 h-10 text-white" /></div>
          <h2 className="text-4xl font-bold text-white mb-3">Bienvenido de vuelta</h2>
          <p className="text-blue-200 text-lg max-w-sm">Ingresá para acceder a comunicados exclusivos, calendario y más.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a3a5c]">Iniciar sesión</h1>
            <p className="text-slate-500 text-sm mt-1">¿No tenés cuenta? <Link href="/registro" className="text-[#2563EB] font-semibold hover:underline">Registrarse</Link></p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required autoComplete="email" />
            <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" required autoComplete="current-password" />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">Ingresar</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
