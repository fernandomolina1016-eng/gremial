'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Badge, EmptyState, Spinner, Textarea, Select } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDateTime, getEstadoConfig } from '@/lib/utils'
import { Plus, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MisConsultasPage() {
  const [consultas, setConsultas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Record<string, any[]>>({})
  const [userId, setUserId] = useState<string>('')
  const [form, setForm] = useState({ tipo: 'consulta', asunto: '', mensaje: '' })
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  const loadConsultas = async (uid: string) => {
    const { data } = await supabase
      .from('consultas')
      .select('*')
      .eq('afiliado_id', uid)
      .order('created_at', { ascending: false })
    setConsultas(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        loadConsultas(user.id)
      }
    })

    // Realtime: notificar cuando llega respuesta
    const channel = supabase
      .channel('mis-respuestas')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'respuestas_consultas' },
        () => { if (userId) loadConsultas(userId) }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const openConsulta = async (consulta: any) => {
    const isOpen = expanded === consulta.id
    setExpanded(isOpen ? null : consulta.id)
    if (!isOpen && !respuestas[consulta.id]) {
      const { data } = await supabase
        .from('respuestas_consultas')
        .select('*, admin:profiles(nombre, apellido)')
        .eq('consulta_id', consulta.id)
        .order('created_at')
      setRespuestas(prev => ({ ...prev, [consulta.id]: data ?? [] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.asunto.trim() || !form.mensaje.trim()) {
      toast.error('Completá todos los campos')
      return
    }
    setSending(true)
    const { error } = await supabase.from('consultas').insert({
      tipo: form.tipo as 'consulta' | 'sugerencia',
      asunto: form.asunto,
      mensaje: form.mensaje,
      afiliado_id: userId,
    })
    if (error) {
      toast.error('Error al enviar')
    } else {
      toast.success('Consulta enviada correctamente')
      setForm({ tipo: 'consulta', asunto: '', mensaje: '' })
      setShowForm(false)
      loadConsultas(userId)
    }
    setSending(false)
  }

  return (
    <div>
      <PageHeader
        title="Mis consultas"
        subtitle="Enviá dudas o sugerencias al equipo gremial"
      >
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Nueva consulta</>}
        </Button>
      </PageHeader>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6 mb-6 animate-slide-up">
          <h3 className="font-bold text-[#1a3a5c] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Nueva consulta o sugerencia
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Tipo"
              value={form.tipo}
              onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))}
              options={[
                { value: 'consulta',   label: 'Consulta' },
                { value: 'sugerencia', label: 'Sugerencia' },
              ]}
            />
            <Input
              label="Asunto"
              value={form.asunto}
              onChange={e => setForm(prev => ({ ...prev, asunto: e.target.value }))}
              placeholder="Resumí tu consulta en una línea"
              required
            />
            <Textarea
              label="Mensaje"
              value={form.mensaje}
              onChange={e => setForm(prev => ({ ...prev, mensaje: e.target.value }))}
              placeholder="Describí en detalle tu consulta o sugerencia..."
              rows={5}
              required
            />
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" loading={sending}>
                Enviar consulta
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista */}
      {loading ? (
        <Spinner />
      ) : consultas.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Sin consultas aún"
          description="Usá el botón 'Nueva consulta' para comunicarte con el equipo gremial."
        />
      ) : (
        <div className="space-y-3">
          {consultas.map(consulta => {
            const estadoConfig = getEstadoConfig(consulta.estado)
            const tieneRespuestas = (respuestas[consulta.id] ?? []).length > 0
            return (
              <Card key={consulta.id}>
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
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(consulta.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${estadoConfig.color} ${estadoConfig.bg}`}>
                      {estadoConfig.label}
                    </span>
                    {expanded === consulta.id
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />
                    }
                  </div>
                </button>

                {expanded === consulta.id && (
                  <div className="px-5 pb-5 border-t border-slate-100">
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700 leading-relaxed">{consulta.mensaje}</p>
                    </div>
                    {(respuestas[consulta.id] ?? []).length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Respuestas del equipo</p>
                        {(respuestas[consulta.id] ?? []).map(resp => (
                          <div key={resp.id} className="p-4 bg-[#DBEAFE] rounded-lg">
                            <p className="text-xs text-[#1a3a5c] font-semibold mb-1">
                              {resp.admin?.nombre} {resp.admin?.apellido}
                              <span className="font-normal text-slate-500 ml-2">{formatDateTime(resp.created_at)}</span>
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed">{resp.mensaje}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
