'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Badge, EmptyState, Spinner, Textarea } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const ESTADOS = ['Recibida', 'En Análisis', 'Resuelta']

export default function BandejaPage() {
  const [consultas, setConsultas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Record<string, any[]>>({})
  const [respuesta, setRespuesta] = useState('')
  const [sending, setSending] = useState(false)
  const [adminId, setAdminId] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const db = createClient() as any

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await db.from('consultas').select('*, afiliado:profiles(nombre,apellido,legajo)').order('created_at', { ascending: false })
    setConsultas(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    db.auth.getUser().then(({ data: { user } }: any) => { if (user) setAdminId(user.id) })
    const ch = db.channel('bandeja').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'consultas' }, load).subscribe()
    return () => { db.removeChannel(ch) }
  }, [])

  const open = async (c: any) => {
    const isOpen = expanded === c.id
    setExpanded(isOpen ? null : c.id)
    if (!isOpen) {
      if (!c.leida_admin) { await db.from('consultas').update({ leida_admin: true }).eq('id', c.id); load() }
      const { data } = await db.from('respuestas_consultas').select('*, admin:profiles(nombre,apellido)').eq('consulta_id', c.id).order('created_at')
      setRespuestas(prev => ({ ...prev, [c.id]: data ?? [] }))
    }
  }

  const changeEstado = async (id: string, estado: string) => {
    const { error } = await db.from('consultas').update({ estado }).eq('id', id)
    if (error) toast.error('Error'); else { toast.success('Estado actualizado'); load() }
  }

  const enviar = async (cid: string) => {
    if (!respuesta.trim()) return
    setSending(true)
    const { error } = await db.from('respuestas_consultas').insert({ consulta_id: cid, admin_id: adminId, mensaje: respuesta.trim() })
    if (error) toast.error('Error al enviar')
    else {
      setRespuesta('')
      const { data } = await db.from('respuestas_consultas').select('*, admin:profiles(nombre,apellido)').eq('consulta_id', cid).order('created_at')
      setRespuestas(prev => ({ ...prev, [cid]: data ?? [] }))
      toast.success('Respuesta enviada')
    }
    setSending(false)
  }

  const filtered = consultas.filter(c => filtro === 'todos' || c.estado === filtro)
  const pendientes = consultas.filter(c => c.estado !== 'Resuelta').length

  return (
    <div>
      <PageHeader title="Bandeja de consultas" subtitle={pendientes > 0 ? `${pendientes} pendientes` : 'Todo al día ✓'}>
        <select value={filtro} onChange={e => setFiltro(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
          <option value="todos">Todos</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </PageHeader>

      {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState icon="📭" title="Sin consultas" /> : (
        <div className="space-y-3">
          {filtered.map(c => (
            <Card key={c.id} className={!c.leida_admin ? 'border-l-4 border-l-[#2563EB]' : ''}>
              <button onClick={() => open(c)} className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-50 transition-colors rounded-xl">
                <div className="w-9 h-9 bg-[#DBEAFE] rounded-full flex items-center justify-center shrink-0"><MessageSquare className="w-4 h-4 text-[#1a3a5c]" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{c.asunto}</span>
                    <Badge variant={c.tipo === 'sugerencia' ? 'warning' : 'info'}>{c.tipo}</Badge>
                    {!c.leida_admin && <span className="w-2 h-2 bg-[#2563EB] rounded-full" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{c.afiliado?.nombre} {c.afiliado?.apellido} · Legajo {c.afiliado?.legajo} · {formatDateTime(c.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={c.estado} onClick={e => e.stopPropagation()} onChange={e => { e.stopPropagation(); changeEstado(c.id, e.target.value) }}
                    className={`text-xs px-2 py-1 rounded-full font-semibold border-0 focus:ring-1 ${c.estado === 'Resuelta' ? 'bg-green-50 text-green-700' : c.estado === 'En Análisis' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {expanded === c.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>
              {expanded === c.id && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Mensaje</p>
                    <p className="text-sm text-slate-700">{c.mensaje}</p>
                  </div>
                  {(respuestas[c.id] ?? []).map((r: any) => (
                    <div key={r.id} className="mt-3 p-4 bg-[#DBEAFE] rounded-lg ml-8">
                      <p className="text-xs text-[#1a3a5c] font-semibold mb-1">{r.admin?.nombre} {r.admin?.apellido} <span className="font-normal text-slate-500 ml-2">{formatDateTime(r.created_at)}</span></p>
                      <p className="text-sm text-slate-700">{r.mensaje}</p>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Textarea placeholder="Escribí tu respuesta..." value={respuesta} onChange={e => setRespuesta(e.target.value)} rows={3} label="Responder" />
                    <div className="flex justify-end mt-2">
                      <Button variant="primary" size="sm" onClick={() => enviar(c.id)} loading={sending} disabled={!respuesta.trim()}>
                        <Send className="w-3.5 h-3.5" />Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
