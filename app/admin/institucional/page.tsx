'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, EmptyState, Spinner, Textarea } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, X, Pencil, Trash2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminInstitucionalPage() {
  const [secciones, setSecciones] = useState<any[]>([])
  const [autoridades, setAutoridades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSecForm, setShowSecForm] = useState(false)
  const [showAutForm, setShowAutForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [secForm, setSecForm] = useState({ titulo: '', slug: '', contenido: '', orden: '0' })
  const [autForm, setAutForm] = useState({ nombre: '', cargo: '', foto_url: '', orden: '0' })
  const db = createClient() as any

  const load = async () => {
    setLoading(true)
    const [{ data: sec }, { data: aut }] = await Promise.all([
      db.from('institucional_secciones').select('*').order('orden'),
      db.from('autoridades').select('*').order('orden'),
    ])
    setSecciones(sec ?? [])
    setAutoridades(aut ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const saveSec = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...secForm, orden: parseInt(secForm.orden), slug: secForm.slug || secForm.titulo.toLowerCase().replace(/\s+/g, '-') }
    const { error } = editId
      ? await db.from('institucional_secciones').update(payload).eq('id', editId)
      : await db.from('institucional_secciones').insert(payload)
    if (error) toast.error('Error al guardar')
    else { toast.success('Sección guardada'); setSecForm({ titulo:'', slug:'', contenido:'', orden:'0' }); setShowSecForm(false); setEditId(null); load() }
    setSaving(false)
  }

  const saveAut = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...autForm, orden: parseInt(autForm.orden), foto_url: autForm.foto_url || null }
    const { error } = await db.from('autoridades').insert(payload)
    if (error) toast.error('Error al guardar')
    else { toast.success('Autoridad guardada'); setAutForm({ nombre:'', cargo:'', foto_url:'', orden:'0' }); setShowAutForm(false); load() }
    setSaving(false)
  }

  const delSec = async (id: string) => { if (!confirm('¿Eliminar?')) return; await db.from('institucional_secciones').delete().eq('id', id); load() }
  const delAut = async (id: string) => { if (!confirm('¿Eliminar?')) return; await db.from('autoridades').delete().eq('id', id); load() }

  return (
    <div>
      <PageHeader title="Institucional" subtitle="Gestión de contenido institucional" />
      {loading ? <Spinner /> : (
        <div className="space-y-8">
          {/* Secciones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1a3a5c]">Secciones de texto</h2>
              <Button variant="primary" size="sm" onClick={() => { setShowSecForm(!showSecForm); setEditId(null); setSecForm({ titulo:'', slug:'', contenido:'', orden:'0' }) }}>
                {showSecForm ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Nueva sección</>}
              </Button>
            </div>
            {showSecForm && (
              <Card className="p-5 mb-4">
                <form onSubmit={saveSec} className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Título" value={secForm.titulo} onChange={e => setSecForm(p => ({...p, titulo: e.target.value}))} required />
                    <Input label="Orden" type="number" value={secForm.orden} onChange={e => setSecForm(p => ({...p, orden: e.target.value}))} />
                  </div>
                  <Textarea label="Contenido" value={secForm.contenido} onChange={e => setSecForm(p => ({...p, contenido: e.target.value}))} rows={6} required />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowSecForm(false)}>Cancelar</Button>
                    <Button type="submit" variant="primary" size="sm" loading={saving}>Guardar</Button>
                  </div>
                </form>
              </Card>
            )}
            <Card>
              {secciones.length === 0 ? <EmptyState icon="📄" title="Sin secciones" /> : (
                <div className="divide-y divide-slate-100">
                  {secciones.map(s => (
                    <div key={s.id} className="flex items-start gap-3 p-4 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{s.titulo}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{s.contenido}</p>
                      </div>
                      <button onClick={() => delSec(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Autoridades */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1a3a5c]">Comisión Directiva</h2>
              <Button variant="primary" size="sm" onClick={() => setShowAutForm(!showAutForm)}>
                {showAutForm ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Agregar</>}
              </Button>
            </div>
            {showAutForm && (
              <Card className="p-5 mb-4">
                <form onSubmit={saveAut} className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre completo" value={autForm.nombre} onChange={e => setAutForm(p => ({...p, nombre: e.target.value}))} required />
                    <Input label="Cargo" value={autForm.cargo} onChange={e => setAutForm(p => ({...p, cargo: e.target.value}))} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="URL foto (opcional)" value={autForm.foto_url} onChange={e => setAutForm(p => ({...p, foto_url: e.target.value}))} />
                    <Input label="Orden" type="number" value={autForm.orden} onChange={e => setAutForm(p => ({...p, orden: e.target.value}))} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAutForm(false)}>Cancelar</Button>
                    <Button type="submit" variant="primary" size="sm" loading={saving}>Guardar</Button>
                  </div>
                </form>
              </Card>
            )}
            <Card>
              {autoridades.length === 0 ? <EmptyState icon="👥" title="Sin autoridades cargadas" /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y divide-slate-100">
                  {autoridades.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-4 hover:bg-slate-50">
                      <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center text-[#1a3a5c] text-sm font-bold shrink-0">{a.nombre.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{a.nombre}</p>
                        <p className="text-xs text-slate-500">{a.cargo}</p>
                      </div>
                      <button onClick={() => delAut(a.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
