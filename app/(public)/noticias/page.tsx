import { createClient } from '@/lib/supabase/server'
import { formatDate, getFileIcon } from '@/lib/utils'
import { EmptyState } from '@/components/ui'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Noticias' }

export default async function NoticiasPage() {
  const supabase = await createClient()
  const { data: comunicados } = await supabase
    .from('comunicados')
    .select('*')
    .eq('es_publico', true)
    .eq('publicado', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="border-b-4 border-[#c0392b] pb-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
          Noticias
        </h1>
        <p className="text-slate-500 mt-2">Comunicados y novedades del gremio</p>
      </div>

      {!comunicados || comunicados.length === 0 ? (
        <EmptyState icon="📰" title="Sin noticias publicadas" description="Próximamente habrá comunicados aquí." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comunicados.map((com, i) => (
            <article key={com.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}>
              {com.imagen_url ? (
                <img src={com.imagen_url} alt={com.titulo} className="w-full h-52 object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-52 bg-gradient-to-br from-[#1a3a5c] to-[#2563EB] flex items-center justify-center">
                  <FileText className="w-14 h-14 text-white/20" />
                </div>
              )}
              <div className="p-5">
                <time className="text-xs text-[#c0392b] font-semibold uppercase tracking-wider">
                  {formatDate(com.created_at)}
                </time>
                <h2 className="font-bold text-[#1a3a5c] text-lg mt-1 mb-2 leading-tight line-clamp-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}>
                  {com.titulo}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {com.resumen}
                </p>
                {com.documento_url && (
                  <a
                    href={com.documento_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#1a3a5c] hover:bg-[#15304d] px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>{getFileIcon(com.documento_nombre)}</span>
                    Ver documento completo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
