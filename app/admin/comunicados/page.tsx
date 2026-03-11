'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Badge, EmptyState, Spinner, Textarea } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { Plus, X, Eye, EyeOff, Trash2, Lock, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminComunicadosPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')
  const [form, setForm] = useState({ titulo: '', resumen: '', imagen_url: '', es_publico: true, publicado: true })
  const db = createClient() as any

  const load = async () => {
    setLoading(true)
    const { data } = await db.from('comunicados').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    db.auth.getUser().then(({ data: { user } }: any) => { if (user) setUserId(user.id) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim() || !form.resumen.trim()) { toast.error('Título y resumen son requeridos'); return }
    setSaving(true)
    const { error } = await db.from('comunicados').insert({ ...form, autor_id: userId })
    if (error) toast.error('Error al guardar')
    else { toast.success('Comunicado creado'); setForm({ titulo:'', resumen:'', imagen_url:'', es_publico:true, publicado:true }); setShowForm(false); load() }
    setSaving(false)
  }

  const togglePublicado = async (id: string, publicado: boolean) => {
    const { error } = await db.from('comunicados').update({ publicado: !publicado }).eq('id', id)
    if (error) toast.error('Error'); else { toast.success(!publicado ? 'Publicado' : 'Despublicado'); load() }
  }

  const del = async (id: string) => {
    if (!confirm('¿Eliminar este comunicado?')) return
    const { error } = await db.from('comunicados').delete().eq('id', id)
    if (error) toast.error('Error'); else { toast.success('Eliminado'); load() }
  }

  return (
    <div>
      <PageHeader title="Comunicados" subtitle={`${items.length} comunicados`}>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Nuevo</>}
        </Button>
      </PageHeader>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="font-bold text-[#1a3a5c] mb-4">Nuevo comunicado</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Título" value={form.titulo} onChange={e => setForm(p => ({...p, titulo: e.target.value}))} required />
            <Textarea label="Resumen / Contenido" value={form.resumen} onChange={e => setForm(p => ({...p, resumen: e.target.value}))} rows={5} required />
            <Input label="URL de imagen (opcional)" value={form.imagen_url} onChange={e => setForm(p => ({...p, imagen_url: e.target.value}))} placeholder="https://..." />
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={form.es_publico} onChange={e => setForm(p => ({...p, es_publico: e.target.checked}))} className="w-4 h-4 rounded" />
                Visible para el público
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={form.publicado} onChange={e => setForm(p => ({...p, publicado: e.target.checked}))} className="w-4 h-4 rounded" />
                Publicado
              </label>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={saving}>Guardar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {loading ? <Spinner /> : items.length === 0 ? <EmptyState icon="📰" title="Sin comunicados" /> : (
          <div className="divide-y divide-slate-100">
            {items.map((c: any) => (
              <div key={c.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{c.titulo}</span>
                    {c.es_publico ? <Badge variant="success"><Globe className="w-3 h-3 mr-1" />Público</Badge> : <Badge variant="info"><Lock className="w-3 h-3 mr-1" />Exclusivo</Badge>}
                    {!c.publicado && <Badge variant="warning">Borrador</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{c.resumen}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(c.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePublicado(c.id, c.publicado)} title={c.publicado ? 'Despublicar' : 'Publicar'} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                    {c.publicado ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => del(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
