import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, truncate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ArrowRight, FileText, Calendar, MessageSquare, BookOpen } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: comunicados } = await (supabase as any)
    .from('comunicados')
    .select('*')
    .eq('es_publico', true)
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1a3a5c] stripe-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] via-[#1e4a70] to-[#0f2540] opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#c0392b]/20 border border-[#c0392b]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#c0392b] rounded-full animate-pulse" />
              <span className="text-[#fca5a5] text-xs font-semibold uppercase tracking-wider">Portal Gremial Oficial</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Unidos por los derechos <span className="text-[#c0392b]">ferroviarios</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-xl">
              Comunicados, acuerdos, calendario de eventos y más en un solo lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/registro"><Button variant="secondary" size="lg">Registrarse como afiliado <ArrowRight className="w-5 h-5" /></Button></Link>
              <Link href="/institucional"><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-[#1a3a5c]">Conocer el gremio</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Últimas noticias */}
      {comunicados && comunicados.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#1a3a5c]">Últimas noticias</h2>
            <Link href="/noticias" className="text-sm font-semibold text-[#2563EB] hover:text-[#1a3a5c] flex items-center gap-1">Ver todas <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comunicados.map((com: any) => (
              <article key={com.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
                {com.imagen_url
                  ? <img src={com.imagen_url} alt={com.titulo} className="w-full h-48 object-cover" />
                  : <div className="w-full h-48 bg-gradient-to-br from-[#1a3a5c] to-[#2563EB] flex items-center justify-center"><FileText className="w-12 h-12 text-white/30" /></div>
                }
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-2">{formatDate(com.created_at)}</p>
                  <h3 className="font-bold text-[#1a3a5c] mb-2 leading-tight line-clamp-2">{com.titulo}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{truncate(com.resumen, 120)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#1a3a5c] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'Calendario', desc: 'Eventos, actividades y más.', href: '/login' },
            { icon: BookOpen, title: 'Acuerdos', desc: 'Convenios y acuerdos salariales vigentes.', href: '/acuerdos' },
            { icon: MessageSquare, title: 'Consultas', desc: 'Enviá tus dudas al equipo gremial.', href: '/login' },
          ].map(({ icon: Icon, title, desc, href }) => (
            <div key={title} className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors">
              <div className="w-11 h-11 bg-[#c0392b] rounded-lg flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-white" /></div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-blue-200 text-sm mb-4">{desc}</p>
              <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-blue-200">
                Ver más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
