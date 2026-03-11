import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, truncate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ArrowRight, FileText, Calendar, MessageSquare, BookOpen, Users, Shield } from 'lucide-react'
import type { Comunicado } from '@/types/database'

async function getUltimasComunicados(): Promise<Comunicado[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('comunicados')
    .select('*')
    .eq('es_publico', true)
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(3)
  return data ?? []
}

export default async function HomePage() {
  const comunicados = await getUltimasComunicados()

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-[#1a3a5c] stripe-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] via-[#1e4a70] to-[#0f2540] opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#c0392b]/20 border border-[#c0392b]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#c0392b] rounded-full animate-pulse" />
              <span className="text-[#fca5a5] text-xs font-semibold uppercase tracking-wider">
                Portal Gremial Oficial
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Unidos por los derechos{' '}
              <span className="text-[#c0392b]">ferroviarios</span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Mantenemos a todos los afiliados informados. Comunicados, acuerdos, calendario de eventos y más en un solo lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/registro">
                <Button variant="secondary" size="lg">
                  Registrarse como afiliado
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/institucional">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-[#1a3a5c]">
                  Conocer el gremio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decoración geométrica */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/5 rounded-full" />
          <div className="absolute right-24 top-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/10 rounded-full" />
          <div className="absolute right-32 top-1/2 -translate-y-1/2 w-20 h-20 bg-[#c0392b]/20 rounded-full" />
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            {[
              { icon: Users, label: 'Afiliados activos', value: 'Portal activo' },
              { icon: FileText, label: 'Comunicados', value: 'Al día' },
              { icon: Shield, label: 'Derechos', value: 'Protegidos' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-4">
                <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1a3a5c]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1a3a5c]">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Últimas noticias ───────────────────────────────────── */}
      {comunicados.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1a3a5c]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Últimas noticias
              </h2>
              <p className="text-slate-500 text-sm mt-1">Comunicados recientes del gremio</p>
            </div>
            <Link href="/noticias" className="text-sm font-semibold text-[#2563EB] hover:text-[#1a3a5c] flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comunicados.map((com, i) => (
              <article key={com.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}>
                {com.imagen_url ? (
                  <img src={com.imagen_url} alt={com.titulo} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#1a3a5c] to-[#2563EB] flex items-center justify-center">
                    <FileText className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-2">{formatDate(com.created_at)}</p>
                  <h3 className="font-bold text-[#1a3a5c] mb-2 leading-tight line-clamp-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}>
                    {com.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {truncate(com.resumen, 120)}
                  </p>
                  {com.documento_url && (
                    <a href={com.documento_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1a3a5c] transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      Ver documento completo
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Afiliados ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#1a3a5c] to-[#1e4a70] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Calendario de eventos',
                desc: 'Enterate de las actividades, vacunaciones y entregas que organiza el gremio.',
                href: '/login',
                cta: 'Ver calendario',
              },
              {
                icon: BookOpen,
                title: 'Acuerdos y convenios',
                desc: 'Accedé a todos los convenios colectivos y acuerdos salariales vigentes.',
                href: '/acuerdos',
                cta: 'Ver acuerdos',
              },
              {
                icon: MessageSquare,
                title: 'Hacé tu consulta',
                desc: 'Enviá tus dudas o sugerencias. Nuestros delegados te responden.',
                href: '/login',
                cta: 'Consultar',
              },
            ].map(({ icon: Icon, title, desc, href, cta }) => (
              <div key={title} className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors">
                <div className="w-11 h-11 bg-[#c0392b] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {title}
                </h3>
                <p className="text-blue-200 text-sm mb-4 leading-relaxed">{desc}</p>
                <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-blue-200 transition-colors">
                  {cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
