'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Spinner } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ celular: '', dependencia: '' })
  const db = createClient() as any

  useEffect(() => {
    db.auth.getUser().then(async ({ data: { user } }: any) => {
      if (user) {
        const { data } = await db.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
        setForm({ celular: data?.celular ?? '', dependencia: data?.dependencia ?? '' })
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await db.from('profiles').update({ celular: form.celular, dependencia: form.dependencia }).eq('id', profile.id)
    if (error) toast.error('Error al guardar')
    else toast.success('Perfil actualizado')
    setSaving(false)
  }

  if (loading) return <Spinner />
  if (!profile) return null

  return (
    <div>
      <PageHeader title="Mi perfil" subtitle="Tus datos personales en el portal" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#1a3a5c] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
            {getInitials(profile.nombre, profile.apellido)}
          </div>
          <h2 className="font-bold text-[#1a3a5c] text-lg">{profile.nombre} {profile.apellido}</h2>
          <p className="text-sm text-slate-500">Legajo {profile.legajo}</p>
          <span className={`mt-2 text-xs px-3 py-1 rounded-full font-semibold ${profile.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {profile.role === 'admin' ? 'Administrador' : 'Afiliado'}
          </span>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-[#1a3a5c] mb-4">Actualizar datos</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" value={profile.nombre} disabled />
              <Input label="Apellido" value={profile.apellido} disabled />
            </div>
            <Input label="Email" value={profile.email} disabled />
            <Input label="Legajo" value={profile.legajo} disabled helperText="El legajo no se puede modificar" />
            <Input label="Dependencia" value={form.dependencia} onChange={e => setForm(p => ({...p, dependencia: e.target.value}))} />
            <Input label="Celular" value={form.celular} onChange={e => setForm(p => ({...p, celular: e.target.value}))} />
            <Button type="submit" variant="primary" loading={saving}>Guardar cambios</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
