'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, EmptyState, Spinner, Textarea } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { Plus, X, Trash2, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#1a3a5c','#c0392b','#2563EB','#16a34a','#d97706','#7c3aed']

export default function AdminCalendarioPage() {
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')
  const [form, setForm] = useState({ titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', color: '#1a3a5c' })
  const db = createClient() as any

  const load = async () => {
    setLoading(true)
    const { data } = await db.from('eventos_calendario').select('*').order('fecha_inicio', { ascending: false })
    setEventos(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    db.auth.getUser().then(({ data: { user } }: any) => { if (user) setUserId(user.id) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim() || !form.fecha_inicio) { toast.error('Título y fecha son requeridos'); return }
    setSaving(true)
    const { error } = await db.from('eventos_calendario').insert({ ...form, autor_id: userId, descripcion: form.descripcion || null, fecha_fin: form.fecha_fin || null, lugar: form.lugar || null })
    if (error) toast.error('Error al guardar')
    else { toast.success('Evento creado'); setForm({ titulo:'', descripcion:'', fecha_inicio:'', fecha_fin:'', lugar:'', color:'#1a3a5c' }); setShowForm(false); load() }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return
    const { error } = await db.from('eventos_calendario').delete().eq('id', id)
    if (error) toast.error('Error'); else { toast.success('Evento eliminado'); load() }
  }

  return (
    <div>
      <PageHeader title="Calendario de eventos" subtitle={`${eventos.length} eventos`}>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Nuevo evento</>}
        </Button>
      </PageHeader>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-[#1a3a5c] mb-4">Nuevo evento</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Título" value={form.titulo} onChange={e => setForm(p => ({...p, titulo: e.target.value}))} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Fecha inicio" type="date" value={form.fecha_inicio} onChange={e => setForm(p => ({...p, fecha_inicio: e.target.value}))} required />
              <Input label="Fecha fin (opcional)" type="date" value={form.fecha_fin} onChange={e => setForm(p => ({...p, fecha_fin: e.target.value}))} />
            </div>
            <Input label="Lugar (opcional)" value={form.lugar} onChange={e => setForm(p => ({...p, lugar: e.target.value}))} />
            <Textarea label="Descripción (opcional)" value={form.descripcion} onChange={e => setForm(p => ({...p, descripcion: e.target.value}))} rows={3} />
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-2">Color</p>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({...p, color: c}))} className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={saving}>Guardar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {loading ? <Spinner /> : eventos.length === 0 ? <EmptyState icon="📅" title="Sin eventos" /> : (
          <div className="divide-y divide-slate-100">
            {eventos.map((ev: any) => (
              <div key={ev.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ev.color }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{ev.titulo}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(ev.fecha_inicio)}</p>
                  {ev.lugar && <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.lugar}</p>}
                </div>
                <button onClick={() => del(ev.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
