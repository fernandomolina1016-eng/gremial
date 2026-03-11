'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Train, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const redirect = searchParams.get('redirect') ?? ''
  const error = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error('Email o contraseña incorrectos')
        return
      }
      // Obtener perfil para redirigir según rol
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (redirect) {
          router.push(redirect)
        } else if (profile?.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/comunicados-exclusivos')
        }
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-clave`,
      })
      if (error) {
        toast.error('Error al enviar el email')
      } else {
        toast.success('Revisá tu casilla de correo para resetear la contraseña')
        setResetMode(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Panel izquierdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3a5c] stripe-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0f2540] opacity-90" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-[#c0392b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Train className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bienvenido de vuelta
          </h2>
          <p className="text-blue-200 text-lg max-w-sm leading-relaxed">
            Ingresá para acceder a comunicados exclusivos, calendario de eventos y más.
          </p>
          <div className="mt-8 flex gap-2 justify-center">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full bg-white/30 ${i === 0 ? 'w-8' : 'w-3'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-[#1a3a5c] rounded-xl flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
          </div>

          {error === 'cuenta_inactiva' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              Tu cuenta fue desactivada. Contactá al administrador.
            </div>
          )}
          {error === 'no_autorizado' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              No tenés permisos para acceder a esa sección.
            </div>
          )}

          {!resetMode ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Iniciar sesión
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  ¿No tenés cuenta?{' '}
                  <Link href="/registro" className="text-[#2563EB] font-semibold hover:underline">
                    Registrarse
                  </Link>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-xs text-[#2563EB] hover:underline"
                  >
                    Olvidé mi contraseña
                  </button>
                </div>

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
                  Ingresar
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Resetear contraseña
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Te enviamos un link a tu email para crear una nueva contraseña.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                <Input
                  label="Email de tu cuenta"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Enviar link de reset
                </Button>
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="w-full text-center text-sm text-slate-500 hover:text-[#1a3a5c] transition-colors mt-2"
                >
                  ← Volver al login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
