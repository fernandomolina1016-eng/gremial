import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { EmptyState, Badge } from '@/components/ui'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Comunicados' }

export default async function ComunicadosPage() {
  const supabase = await createClient()
  const { data: comunicados } = await (supabase as any)
    .from('comunicados').select('*').eq('publicado', true).order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a3a5c]">Comunicados</h1>
        <p className="text-slate-500 mt-1 text-sm">Todos los comunicados del gremio</p>
      </div>
      {!comunicados?.length
        ? <EmptyState icon="📢" title="Sin comunicados" description="Próximamente se publicarán comunicados aquí." />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comunicados.map((com: any) => (
              <article key={com.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
                {com.imagen_url
                  ? <img src={com.imagen_url} alt={com.titulo} className="w-full h-48 object-cover" />
                  : <div className="w-full h-48 bg-gradient-to-br from-[#1a3a5c] to-[#2563EB] flex items-center justify-center"><FileText className="w-12 h-12 text-white/30" /></div>
                }
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <time className="text-xs text-slate-400">{formatDate(com.created_at)}</time>
                    {!com.es_publico && <Badge variant="info">Exclusivo</Badge>}
                  </div>
                  <h2 className="font-bold text-[#1a3a5c] mb-2 leading-tight line-clamp-2">{com.titulo}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">{com.resumen}</p>
                  {com.documento_url && (
                    <a href={com.documento_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#1a3a5c] hover:bg-[#15304d] px-4 py-2 rounded-lg transition-colors">
                      <FileText className="w-4 h-4" />Ver documento
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )
      }
    </div>
  )
}
