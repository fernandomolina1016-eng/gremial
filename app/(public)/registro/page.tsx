'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Train, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface FormData {
  nombre: string
  apellido: string
  legajo: string
  dependencia: string
  celular: string
  email: string
  password: string
  confirmPassword: string
}

const INITIAL: FormData = {
  nombre: '', apellido: '', legajo: '', dependencia: '',
  celular: '', email: '', password: '', confirmPassword: '',
}

export default function RegistroPage() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = (): boolean => {
    const errs: Partial<FormData> = {}
    if (!form.nombre.trim())       errs.nombre       = 'Ingresá tu nombre'
    if (!form.apellido.trim())     errs.apellido     = 'Ingresá tu apellido'
    if (!form.legajo.trim())       errs.legajo       = 'Ingresá tu número de legajo'
    if (!form.dependencia.trim())  errs.dependencia  = 'Ingresá tu dependencia'
    if (!form.celular.trim())      errs.celular      = 'Ingresá tu celular'
    if (!form.email.includes('@')) errs.email        = 'Email inválido'
    if (form.password.length < 6)  errs.password     = 'Mínimo 6 caracteres'
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nombre:      form.nombre,
            apellido:    form.apellido,
            legajo:      form.legajo,
            dependencia: form.dependencia,
            celular:     form.celular,
          },
        },
      })
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Ese email ya está registrado')
        } else {
          toast.error('Error al registrarse: ' + error.message)
        }
        return
      }
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 max-w-md text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a3a5c] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            ¡Registro exitoso!
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Tu cuenta fue creada. Ya podés ingresar con tu email y contraseña.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push('/login')} className="w-full">
            Ir al login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1a3a5c] stripe-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0f2540] opacity-90" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-[#c0392b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Train className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sumate al gremio
          </h2>
          <p className="text-blue-200 text-base max-w-xs leading-relaxed">
            Registrate para acceder a todos los beneficios del portal gremial.
          </p>
          <ul className="mt-6 space-y-2 text-left">
            {[
              'Comunicados exclusivos',
              'Calendario de eventos',
              'Consultas directas',
              'Acceso a documentación',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-blue-200">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Crear cuenta
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" value={form.nombre} onChange={set('nombre')}
                error={errors.nombre} placeholder="Juan" required />
              <Input label="Apellido" value={form.apellido} onChange={set('apellido')}
                error={errors.apellido} placeholder="Pérez" required />
            </div>

            <Input label="N° de Legajo" value={form.legajo} onChange={set('legajo')}
              error={errors.legajo} placeholder="Ej: 12345" required
              helperText="Número de legajo asignado por el gremio" />

            <Input label="Dependencia" value={form.dependencia} onChange={set('dependencia')}
              error={errors.dependencia} placeholder="Ej: Ramal Bs As - Rosario" required />

            <Input label="Celular" type="tel" value={form.celular} onChange={set('celular')}
              error={errors.celular} placeholder="Ej: 11 1234-5678" required />

            <Input label="Email" type="email" value={form.email} onChange={set('email')}
              error={errors.email} placeholder="tu@email.com" required />

            <Input label="Contraseña" type="password" value={form.password} onChange={set('password')}
              error={errors.password} placeholder="Mínimo 6 caracteres" required />

            <Input label="Confirmar contraseña" type="password" value={form.confirmPassword}
              onChange={set('confirmPassword')} error={errors.confirmPassword}
              placeholder="Repetí tu contraseña" required />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Crear mi cuenta
            </Button>

            <p className="text-xs text-slate-400 text-center">
              Al registrarte aceptás los términos y condiciones del gremio.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
