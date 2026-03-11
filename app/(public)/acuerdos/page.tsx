import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui'
import { FileText, Download } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Acuerdos y Convenios' }

export default async function AcuerdosPage() {
  const supabase = await createClient()
  const { data: acuerdos } = await supabase
    .from('acuerdos')
    .select('*')
    .eq('activo', true)
    .order('anio', { ascending: false })

  const convenios = acuerdos?.filter(a => a.tipo === 'convenio') ?? []
  const salariales = acuerdos?.filter(a => a.tipo === 'acuerdo_salarial') ?? []

  const Section = ({ title, items, emptyMsg }: { title: string; items: typeof acuerdos; emptyMsg: string }) => (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-[#c0392b] rounded-full" />
        <h2 className="text-2xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h2>
      </div>
      {!items || items.length === 0 ? (
        <p className="text-slate-400 text-sm italic pl-4">{emptyMsg}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(acuerdo => (
            <a
              key={acuerdo.id}
              href={acuerdo.archivo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1a3a5c] transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1a3a5c] transition-colors">
                <FileText className="w-6 h-6 text-[#1a3a5c] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1a3a5c] leading-tight">{acuerdo.titulo}</p>
                {acuerdo.descripcion && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{acuerdo.descripcion}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {acuerdo.anio && (
                    <span className="text-xs text-slate-400">Año {acuerdo.anio}</span>
                  )}
                  <span className="text-xs text-slate-400">{formatDate(acuerdo.created_at, 'dd/MM/yyyy')}</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-300 group-hover:text-[#1a3a5c] transition-colors shrink-0 mt-1" />
            </a>
          ))}
        </div>
      )}
    </section>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b-4 border-[#c0392b] pb-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Acuerdos y Convenios
        </h1>
        <p className="text-slate-500 mt-2">Documentación gremial actualizada</p>
      </div>

      {(!acuerdos || acuerdos.length === 0) ? (
        <EmptyState icon="📋" title="Sin acuerdos cargados" description="Próximamente se publicarán los acuerdos y convenios vigentes." />
      ) : (
        <>
          <Section title="Convenios Colectivos de Trabajo" items={convenios} emptyMsg="Sin convenios publicados aún." />
          <Section title="Acuerdos Salariales" items={salariales} emptyMsg="Sin acuerdos salariales publicados aún." />
        </>
      )}
    </div>
  )
}
