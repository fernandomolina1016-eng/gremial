import { createClient } from '@/lib/supabase/server'
import { Card, PageHeader } from '@/components/ui'
import { Users, FileText, Inbox, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const db = await createClient() as any
  const [
    { count: totalUsuarios },
    { count: totalComunicados },
    { count: consultasPendientes },
    { data: eventos },
    { data: consultas },
  ] = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('comunicados').select('*', { count: 'exact', head: true }).eq('publicado', true),
    db.from('consultas').select('*', { count: 'exact', head: true }).neq('estado', 'Resuelta'),
    db.from('eventos_calendario').select('*').gte('fecha_inicio', new Date().toISOString().split('T')[0]).order('fecha_inicio').limit(3),
    db.from('consultas').select('*, afiliado:profiles(nombre,apellido)').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Usuarios registrados',  value: totalUsuarios ?? 0,      icon: Users,     color: 'bg-blue-50 text-blue-600' },
    { label: 'Comunicados publicados', value: totalComunicados ?? 0,   icon: FileText,  color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Consultas pendientes',   value: consultasPendientes ?? 0, icon: Inbox,    color: 'bg-amber-50 text-amber-600' },
    { label: 'Próximos eventos',       value: eventos?.length ?? 0,    icon: Calendar,  color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Resumen del sistema — ${formatDate(new Date())}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-[#1a3a5c]">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1a3a5c] text-lg">Últimas consultas</h2>
            <a href="/admin/bandeja" className="text-xs text-[#2563EB] font-semibold hover:underline">Ver todas →</a>
          </div>
          {consultas?.length ? (
            <div className="space-y-3">
              {consultas.map((c: any) => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${c.estado === 'Resuelta' ? 'bg-green-500' : c.estado === 'En Análisis' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.asunto}</p>
                    <p className="text-xs text-slate-500">{c.afiliado?.nombre} {c.afiliado?.apellido} · {formatDate(c.created_at, 'dd/MM/yy')}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${c.estado === 'Resuelta' ? 'bg-green-50 text-green-700' : c.estado === 'En Análisis' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{c.estado}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400 text-center py-8">Sin consultas aún</p>}
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1a3a5c] text-lg">Próximos eventos</h2>
            <a href="/admin/calendario" className="text-xs text-[#2563EB] font-semibold hover:underline">Ver todos →</a>
          </div>
          {eventos?.length ? (
            <div className="space-y-3">
              {eventos.map((ev: any) => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ev.color || '#1a3a5c' }} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{ev.titulo}</p>
                    <p className="text-xs text-slate-500">{formatDate(ev.fecha_inicio)}{ev.lugar && ` · ${ev.lugar}`}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-400 text-center py-8">Sin eventos próximos</p>}
        </Card>
      </div>
    </div>
  )
}
