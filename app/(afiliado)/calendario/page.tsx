import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui'
import { Calendar, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Calendario' }

export default async function CalendarioPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data: eventos } = await (supabase as any)
    .from('eventos_calendario').select('*').gte('fecha_inicio', today).order('fecha_inicio').limit(20)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a3a5c]">Calendario de eventos</h1>
        <p className="text-slate-500 mt-1 text-sm">Próximos eventos y actividades</p>
      </div>
      {!eventos?.length
        ? <EmptyState icon="📅" title="Sin eventos próximos" description="Próximamente se agregarán eventos al calendario." />
        : (
          <div className="space-y-4">
            {eventos.map((ev: any) => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ev.color || '#1a3a5c' }} />
                <div>
                  <h3 className="font-bold text-[#1a3a5c]">{ev.titulo}</h3>
                  <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />{formatDate(ev.fecha_inicio)}
                  </p>
                  {ev.lugar && <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{ev.lugar}</p>}
                  {ev.descripcion && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{ev.descripcion}</p>}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
