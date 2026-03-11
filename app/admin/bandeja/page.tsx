'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Badge, EmptyState, Spinner, Textarea, Select } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Consulta, RespuestaConsulta } from '@/types/database'

const ESTADOS = [
  { value: 'Recibida',    label: 'Recibida' },
  { value: 'En Análisis', label: 'En Análisis' },
  { value: 'Resuelta',    label: 'Resuelta' },
]

export default function BandejaPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaConsulta[]>>({})
  const [respuesta, setRespuesta] = useState('')
  const [sending, setSending] = useState(false)
  const [adminId, setAdminId] = useState<string>('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const supabase = createClient()

  const loadConsultas = useCallback(async () => {
    setLoading(true)
    const query = supabase
      .from('consultas')
      .select('*, afiliado:profiles(nombre, apellido, legajo, dependencia)')
      .order('created_at', { ascending: false })

    const { data } = await query
    setConsultas(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadConsultas()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setAdminId(user.id)
    })

    // Realtime
    const channel = supabase
      .channel('bandeja-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'consultas' }, loadConsultas)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const openConsulta = async (consulta: Consulta) => {
    const isOpen = expanded === consulta.id
    setExpanded(isOpen ? null : consulta.id)
    if (!isOpen) {
      // Marcar como leída
      if (!consulta.leida_admin) {
        await supabase.from('consultas').update({ leida_admin: true }).eq('id', consulta.id)
        loadConsultas()
      }
      // Cargar respuestas
      const { data } = await supabase
        .from('respuestas_consultas')
        .select('*, admin:profiles(nombre, apellido)')
        .eq('consulta_id', consulta.id)
        .order('created_at')
      setRespuestas(prev => ({ ...prev, [consulta.id]: data ?? [] }))
    }
  }

  const changeEstado = async (id: string, estado: string) => {
    const { error } = await supabase.from('consultas').update({ estado }).eq('id', id)
    if (error) toast.error('Error al cambiar estado')
    else { toast.success('Estado actualizado'); loadConsultas() }
  }

  const enviarRespuesta = async (consultaId: string) => {
    if (!respuesta.trim()) return
    setSending(true)
    const { error } = await supabase.from('respuestas_consultas').insert({
      consulta_id: consultaId,
      admin_id: adminId,
      mensaje: respuesta.trim(),
    })
    if (error) {
      toast.error('Error al enviar respuesta')
    } else {
      setRespuesta('')
      // Recargar respuestas
      const { data } = await supabase
        .from('respuestas_consultas')
        .select('*, admin:profiles(nombre, apellido)')
        .eq('consulta_id', consultaId)
        .order('created_at')
      setRespuestas(prev => ({ ...prev, [consultaId]: data ?? [] }))
      toast.success('Respuesta enviada')
    }
    setSending(false)
  }

  const filtered = consultas.filter(c =>
    filtroEstado === 'todos' || c.estado === filtroEstado
  )

  const pendientes = consultas.filter(c => c.estado !== 'Resuelta').length

  return (
    <div>
      <PageHeader
        title="Bandeja de consultas"
        subtitle={pendientes > 0 ? `${pendientes} consultas pendientes` : 'Todo al día ✓'}
      >
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </PageHeader>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon="📭" title="Sin consultas" description="No hay consultas con ese filtro" />
      ) : (
        <div className="space-y-3">
          {filtered.map(consulta => (
            <Card key={consulta.id} className={!consulta.leida_admin ? 'border-l-4 border-l-[#2563EB]' : ''}>
              {/* Header de consulta */}
              <button
                onClick={() => openConsulta(consulta)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-50 transition-colors rounded-xl"
              >
                <div className="w-9 h-9 bg-[#DBEAFE] rounded-full flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#1a3a5c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{consulta.asunto}</span>
                    <Badge variant={consulta.tipo === 'sugerencia' ? 'warning' : 'info'}>
                      {consulta.tipo}
                    </Badge>
                    {!consulta.leida_admin && (
                      <span className="w-2 h-2 bg-[#2563EB] rounded-full" title="No leída" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(consulta as any).afiliado?.nombre} {(consulta as any).afiliado?.apellido}
                    {' '}· Legajo {(consulta as any).afiliado?.legajo}
                    {' '}· {formatDateTime(consulta.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={consulta.estado}
                    onChange={e => { e.stopPropagation(); changeEstado(consulta.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className={`text-xs px-2 py-1 rounded-full font-semibold border-0 focus:ring-1 focus:ring-[#2563EB] ${
                      consulta.estado === 'Resuelta' ? 'bg-green-50 text-green-700' :
                      consulta.estado === 'En Análisis' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                  {expanded === consulta.id
                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 text-slate-400" />
                  }
                </div>
              </button>

              {/* Contenido expandido */}
              {expanded === consulta.id && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  {/* Mensaje original */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Mensaje del afiliado</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{consulta.mensaje}</p>
                  </div>

                  {/* Respuestas anteriores */}
                  {(respuestas[consulta.id] ?? []).map(resp => (
                    <div key={resp.id} className="mt-3 p-4 bg-[#DBEAFE] rounded-lg ml-8">
                      <p className="text-xs text-[#1a3a5c] font-semibold mb-1">
                        Admin: {(resp as any).admin?.nombre} {(resp as any).admin?.apellido}
                        <span className="font-normal text-slate-500 ml-2">{formatDateTime(resp.created_at)}</span>
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{resp.mensaje}</p>
                    </div>
                  ))}

                  {/* Nueva respuesta */}
                  <div className="mt-4">
                    <Textarea
                      placeholder="Escribí tu respuesta..."
                      value={respuesta}
                      onChange={e => setRespuesta(e.target.value)}
                      rows={3}
                      label="Responder"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => enviarRespuesta(consulta.id)}
                        loading={sending}
                        disabled={!respuesta.trim()}
                      >
                        <Send className="w-3.5 h-3.5" />
                        Enviar respuesta
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
