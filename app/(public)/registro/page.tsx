'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Train, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegistroPage() {
  const [form, setForm] = useState({ nombre:'', apellido:'', legajo:'', dependencia:'', celular:'', email:'', password:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({...p, [k]: e.target.value}))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Las contraseñas no coinciden'); return }
    if (form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { nombre: form.nombre, apellido: form.apellido, legajo: form.legajo, dependencia: form.dependencia, celular: form.celular } },
      })
      if (error) { toast.error(error.message.includes('already') ? 'Ese email ya está registrado' : error.message); return }
      setSuccess(true)
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 max-w-md text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-9 h-9 text-green-600" /></div>
        <h2 className="text-2xl font-bold text-[#1a3a5c] mb-2">¡Registro exitoso!</h2>
        <p className="text-slate-600 text-sm mb-6">Tu cuenta fue creada. Ya podés ingresar.</p>
        <Button variant="primary" size="lg" onClick={() => router.push('/login')} className="w-full">Ir al login</Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="hidden lg:flex lg:w-5/12 bg-[#1a3a5c] stripe-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0f2540] opacity-90" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-[#c0392b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Train className="w-10 h-10 text-white" /></div>
          <h2 className="text-3xl font-bold text-white mb-3">Sumate al gremio</h2>
          <p className="text-blue-200 max-w-xs">Registrate para acceder a todos los beneficios del portal.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a3a5c]">Crear cuenta</h1>
            <p className="text-slate-500 text-sm mt-1">¿Ya tenés cuenta? <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">Iniciar sesión</Link></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" value={form.nombre} onChange={set('nombre')} required />
              <Input label="Apellido" value={form.apellido} onChange={set('apellido')} required />
            </div>
            <Input label="N° de Legajo" value={form.legajo} onChange={set('legajo')} required helperText="Número asignado por el gremio" />
            <Input label="Dependencia" value={form.dependencia} onChange={set('dependencia')} required />
            <Input label="Celular" type="tel" value={form.celular} onChange={set('celular')} required />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
            <Input label="Contraseña" type="password" value={form.password} onChange={set('password')} required />
            <Input label="Confirmar contraseña" type="password" value={form.confirm} onChange={set('confirm')} required />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">Crear mi cuenta</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
