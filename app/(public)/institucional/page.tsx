import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Institucional' }

export default async function InstitucionalPage() {
  const supabase = await createClient()
  const { data: secciones } = await (supabase as any)
    .from('institucional_secciones').select('*').eq('activo', true).order('orden')
  const { data: autoridades } = await (supabase as any)
    .from('autoridades').select('*').eq('activo', true).order('orden')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b-4 border-[#c0392b] pb-6 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a3a5c]">Institucional</h1>
        <p className="text-slate-500 mt-2">Conocé la historia y organización del gremio</p>
      </div>

      {secciones?.map((sec: any) => (
        <section key={sec.id} className="mb-12 bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-[#1a3a5c] mb-4">{sec.titulo}</h2>
          <div className="text-slate-700 leading-relaxed whitespace-pre-line">{sec.contenido}</div>
        </section>
      ))}

      {autoridades && autoridades.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a3a5c] mb-6">Comisión Directiva</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {autoridades.map((a: any) => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                {a.foto_url
                  ? <img src={a.foto_url} alt={a.nombre} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
                  : <div className="w-20 h-20 bg-[#DBEAFE] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-[#1a3a5c]">{a.nombre.charAt(0)}</div>
                }
                <p className="font-bold text-[#1a3a5c]">{a.nombre}</p>
                <p className="text-sm text-slate-500">{a.cargo}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
