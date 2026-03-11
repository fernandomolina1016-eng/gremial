'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Badge, EmptyState, Spinner, Select, Textarea } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { Plus, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminAcuerdosPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ titulo: '', descripcion: '', archivo_url: '', tipo: 'convenio', anio: '' })
  const db = createClient() as any

  const load = async () => {
    setLoading(true)
    const { data } = await db.from('acuerdos').select('*').order('anio', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim() || !form.archivo_url.trim()) { toast.error('Título y URL de archivo son requeridos'); return }
    setSaving(true)
    const { error } = await db.from('acuerdos').insert({ ...form, anio: form.anio ? parseInt(form.anio) : null })
    if (error) toast.error('Error al guardar')
    else { toast.success('Acuerdo guardado'); setForm({ titulo:'', descripcion:'', archivo_url:'', tipo:'convenio', anio:'' }); setShowForm(false); load() }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este acuerdo?')) return
    const { error } = await db.from('acuerdos').delete().eq('id', id)
    if (error) toast.error('Error'); else { toast.success('Eliminado'); load() }
  }

  return (
    <div>
      <PageHeader title="Acuerdos y Convenios" subtitle={`${items.length} documentos`}>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Nuevo</>}
        </Button>
      </PageHeader>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-[#1a3a5c] mb-4">Nuevo acuerdo o convenio</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Título" value={form.titulo} onChange={e => setForm(p => ({...p, titulo: e.target.value}))} required />
            <Textarea label="Descripción (opcional)" value={form.descripcion} onChange={e => setForm(p => ({...p, descripcion: e.target.value}))} rows={3} />
            <Input label="URL del archivo" value={form.archivo_url} onChange={e => setForm(p => ({...p, archivo_url: e.target.value}))} required placeholder="https://..." />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Tipo" value={form.tipo} onChange={e => setForm(p => ({...p, tipo: e.target.value}))}
                options={[{value:'convenio',label:'Convenio Colectivo'},{value:'acuerdo_salarial',label:'Acuerdo Salarial'}]} />
              <Input label="Año (opcional)" type="number" value={form.anio} onChange={e => setForm(p => ({...p, anio: e.target.value}))} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={saving}>Guardar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {loading ? <Spinner /> : items.length === 0 ? <EmptyState icon="📋" title="Sin acuerdos" /> : (
          <div className="divide-y divide-slate-100">
            {items.map((a: any) => (
              <div key={a.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{a.titulo}</span>
                    <Badge variant={a.tipo === 'convenio' ? 'info' : 'warning'}>{a.tipo === 'convenio' ? 'Convenio' : 'Acuerdo Salarial'}</Badge>
                    {a.anio && <span className="text-xs text-slate-400">Año {a.anio}</span>}
                  </div>
                  {a.descripcion && <p className="text-xs text-slate-500 mb-1 line-clamp-1">{a.descripcion}</p>}
                  <a href={a.archivo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2563EB] hover:underline">Ver archivo →</a>
                </div>
                <button onClick={() => del(a.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
